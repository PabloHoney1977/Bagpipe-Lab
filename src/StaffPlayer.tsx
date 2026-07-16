import { useCallback, useEffect, useRef, useState } from 'react'
import { NOTES, playChanterNote, playClick, resumeAudio } from './chanter'
import { ChanterDiagram } from './ChanterDiagram'
import { buildTimedExercise } from './rhythmEngine'
import type { TimedExercise } from './rhythmEngine'
import { NOTE_STEPS, LINE_STEPS, stepToY, ledgerStepsFor } from './staff'
import type { Exercise } from './tunes'

const PX_PER_BEAT = 44
const LEFT_PAD = 40
const RIGHT_PAD = 44
const VIEW_H = 168
const MIN_BPM = 30
const MAX_BPM = 120
const TEMPO_STEP = 5

// Notes from the middle line (B) up get a downward stem; below it, upward —
// standard practice, and it keeps High A's stem from poking out the top.
const MIDDLE_STEP = 4
const STEM_LEN = 40

type PlayerState = 'idle' | 'playing' | 'done'

type Frame = {
  startMs: number
  timed: TimedExercise
  nextBeat: number
  nextNote: number
  endMs: number
  lastCount: number
}

/**
 * "Read the music" play-along: renders the exercise as real bagpipe staff
 * notation and sweeps a playhead across it in time, sounding each note as it
 * lands. Unlike the falling-notes lane this isn't scored — it's a reading and
 * play-along surface, so you follow the dots on your own chanter.
 */
export function StaffPlayer({ exercise }: { exercise: Exercise }) {
  const [status, setStatus] = useState<PlayerState>('idle')
  const [bpm, setBpm] = useState(exercise.bpm)
  const [currentIdx, setCurrentIdx] = useState(-1)
  const [countIn, setCountIn] = useState(0)

  const frameRef = useRef<Frame | null>(null)
  const rafRef = useRef<number | null>(null)
  const playheadRef = useRef<SVGLineElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const beatsPerBar = exercise.beatsPerBar
  const timed = buildTimedExercise(exercise, bpm)
  const totalDisplayBeats = timed.totalBeats - beatsPerBar
  const width = LEFT_PAD + totalDisplayBeats * PX_PER_BEAT + RIGHT_PAD

  const noteX = useCallback(
    (beatPos: number) => LEFT_PAD + (beatPos - beatsPerBar) * PX_PER_BEAT,
    [beatsPerBar],
  )

  const stop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }, [])

  useEffect(() => () => stop(), [stop])

  // Reset when the exercise changes.
  useEffect(() => {
    stop()
    frameRef.current = null
    setStatus('idle')
    setCurrentIdx(-1)
    setCountIn(0)
    setBpm(exercise.bpm)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id])

  // Keep the current note in view as it plays.
  useEffect(() => {
    if (currentIdx < 0) return
    const note = timed.notes[currentIdx]
    const el = scrollRef.current
    if (!note || !el) return
    const target = noteX(note.beatPos) - el.clientWidth / 2
    el.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx])

  function movePlayhead(x: number) {
    const ph = playheadRef.current
    if (ph) {
      ph.setAttribute('x1', String(x))
      ph.setAttribute('x2', String(x))
    }
  }

  function loop() {
    const f = frameRef.current
    if (!f) return
    const elapsed = performance.now() - f.startMs
    const { timed: t } = f

    // count-in display (one bar of clicks before the first note)
    if (elapsed < t.leadInMs) {
      const remaining = Math.ceil((t.leadInMs - elapsed) / t.beatMs)
      if (remaining !== f.lastCount) {
        f.lastCount = remaining
        setCountIn(remaining)
      }
    } else if (f.lastCount !== 0) {
      f.lastCount = 0
      setCountIn(0)
    }

    // metronome
    while (f.nextBeat < t.beatTimes.length && t.beatTimes[f.nextBeat].ms <= elapsed) {
      playClick(t.beatTimes[f.nextBeat].accent)
      f.nextBeat++
    }

    // sound notes as their beat arrives, and light the current one
    while (f.nextNote < t.notes.length && t.notes[f.nextNote].targetMs <= elapsed) {
      playChanterNote(t.notes[f.nextNote].freq)
      setCurrentIdx(f.nextNote)
      f.nextNote++
    }

    const beatNow = Math.max(0, (elapsed - t.leadInMs) / t.beatMs)
    movePlayhead(LEFT_PAD + beatNow * PX_PER_BEAT)

    if (elapsed >= f.endMs) {
      setStatus('done')
      setCurrentIdx(-1)
      stop()
      return
    }
    rafRef.current = requestAnimationFrame(loop)
  }

  function start() {
    resumeAudio()
    const t = buildTimedExercise(exercise, bpm)
    frameRef.current = {
      startMs: performance.now(),
      timed: t,
      nextBeat: 0,
      nextNote: 0,
      // run to the end of the last note (its full written length), plus a short
      // tail — so the playhead completes long final notes and reaches the last bar
      endMs: t.totalBeats * t.beatMs + Math.max(400, t.beatMs),
      lastCount: exercise.beatsPerBar,
    }
    setStatus('playing')
    setCurrentIdx(-1)
    setCountIn(exercise.beatsPerBar)
    if (scrollRef.current) scrollRef.current.scrollTo({ left: 0 })
    loop()
  }

  function halt() {
    stop()
    frameRef.current = null
    setStatus('idle')
    setCurrentIdx(-1)
    setCountIn(0)
    movePlayhead(LEFT_PAD)
  }

  function changeTempo(delta: number) {
    halt()
    setBpm((b) => Math.min(MAX_BPM, Math.max(MIN_BPM, b + delta)))
  }

  const current = currentIdx >= 0 ? timed.notes[currentIdx] : null

  // Bar lines: one at the start of every bar across the piece.
  const barLines: number[] = []
  for (let b = 0; b <= totalDisplayBeats + 0.001; b += beatsPerBar) {
    barLines.push(LEFT_PAD + b * PX_PER_BEAT)
  }

  return (
    <div className="staffplay">
      <div className="staffplay-scroll" ref={scrollRef}>
        <svg
          viewBox={`0 0 ${width} ${VIEW_H}`}
          width={width}
          height={VIEW_H}
          role="img"
          aria-label={`${exercise.name} in bagpipe staff notation`}
          className="staffplay-svg"
        >
          {/* staff lines */}
          {LINE_STEPS.map((s) => (
            <line key={s} x1={LEFT_PAD} y1={stepToY(s)} x2={width - RIGHT_PAD + 16} y2={stepToY(s)} className="staff-line" />
          ))}

          {/* bar lines */}
          {barLines.map((x, i) => (
            <line key={`bar-${i}`} x1={x} y1={stepToY(8)} x2={x} y2={stepToY(0)} className="staff-barline" />
          ))}

          {/* notes */}
          {timed.notes.map((n, i) => {
            const step = NOTE_STEPS[n.name] ?? MIDDLE_STEP
            const cx = noteX(n.beatPos)
            const cy = stepToY(step)
            const stemUp = step < MIDDLE_STEP
            const stemX = stemUp ? cx + 8.5 : cx - 8.5
            const stemY2 = stemUp ? cy - STEM_LEN : cy + STEM_LEN
            const isCurrent = i === currentIdx
            return (
              <g key={i}>
                {ledgerStepsFor(step).map((s) => (
                  <line key={s} x1={cx - 13} y1={stepToY(s)} x2={cx + 13} y2={stepToY(s)} className="staff-ledger" />
                ))}
                {isCurrent ? <circle cx={cx} cy={cy} r="14" className="staff-note-halo" /> : null}
                <line x1={stemX} y1={cy} x2={stemX} y2={stemY2} className={isCurrent ? 'staff-stem is-current' : 'staff-stem'} />
                <ellipse cx={cx} cy={cy} rx="8.5" ry="6.5" className={isCurrent ? 'staff-note is-current' : 'staff-note'} />
                <text x={cx} y={VIEW_H - 14} className={isCurrent ? 'staff-note-label is-current' : 'staff-note-label'} textAnchor="middle">
                  {n.name}
                </text>
              </g>
            )
          })}

          {/* playhead */}
          <line ref={playheadRef} x1={LEFT_PAD} y1={stepToY(10)} x2={LEFT_PAD} y2={stepToY(-1)} className="staff-playhead" />
        </svg>
      </div>

      <div className="staffplay-side">
        <ChanterDiagram covered={current?.covered ?? NOTES[0].covered} />
        <p className="staffplay-current">
          {current ? current.name : countIn > 0 ? `Count in… ${countIn}` : status === 'done' ? 'Done' : 'Ready'}
        </p>
      </div>

      <div className="staffplay-controls">
        {status !== 'playing' ? (
          <button type="button" className="play-button" onClick={start}>
            {status === 'done' ? 'Play again' : 'Play'}
          </button>
        ) : (
          <button type="button" className="play-button" onClick={halt}>
            Stop
          </button>
        )}
        <div className="tempo-stepper">
          <button type="button" className="tempo-btn" onClick={() => changeTempo(-TEMPO_STEP)} disabled={bpm <= MIN_BPM} aria-label="Slower">
            –
          </button>
          <span className="tempo-badge">{bpm} bpm</span>
          <button type="button" className="tempo-btn" onClick={() => changeTempo(TEMPO_STEP)} disabled={bpm >= MAX_BPM} aria-label="Faster">
            +
          </button>
        </div>
      </div>

      <p className="hint">
        Watch the line sweep across the staff and follow along on your chanter — the note it touches is the note that
        sounds. Slow the tempo down until you can read each note before it arrives.
      </p>
    </div>
  )
}
