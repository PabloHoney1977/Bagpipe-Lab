import { useCallback, useEffect, useRef, useState } from 'react'
import {
  NOTES,
  playChanterNoteLegato,
  playOrnamentedNote,
  playClick,
  releaseChanterNote,
  resumeAudio,
} from './chanter'
import { ChanterDiagram } from './ChanterDiagram'
import { buildTimedExercise } from './rhythmEngine'
import { loadProgress, loadLatency, recordRun, saveLadderBpm, saveLatency } from './progress'
import type { Exercise } from './tunes'

type Judgement = 'pending' | 'perfect' | 'good' | 'miss'

type GameNote = {
  name: string
  freq: number
  covered: boolean[]
  targetMs: number
  status: Judgement
  /** signed timing error in ms; positive = tapped late. Undefined until judged. */
  delta?: number
  cue?: string
  graces: string[]
  graceFreqs: number[]
}

type Game = {
  startMs: number
  notes: GameNote[]
  beatTimes: { ms: number; accent: boolean }[]
  nextBeat: number
  lastTargetMs: number
  leadInMs: number
  beatMs: number
  endMs: number
  /** taps that arrived too early to belong to any note — the signature of rushing */
  earlyStrays: number
}

const APPROACH_MS = 2000 // how long a note is visible falling before its beat
const PERFECT_MS = 100
const GOOD_MS = 200
const MISS_MS = 220 // a pending note this far past its beat is a miss
const LANE_HEIGHT = 360

const MASTERY_PCT = 85 // accuracy needed to step the tempo up
const GOOD_WEIGHT = 0.8 // a Good hit is inside a sixth of a beat: worth most of a note
const TEMPO_STEP = 6 // bpm added on a clean run
const MIN_BPM = 40
const MAX_BPM = 120

/** Mean signed error worth offering as a device-latency correction. */
const CALIBRATE_MIN_MS = 45
/** ...but only when the taps are consistent enough to look systematic, not sloppy. */
const CALIBRATE_MAX_SPREAD_MS = 90

function mean(xs: number[]) {
  return xs.reduce((a, b) => a + b, 0) / xs.length
}

function stdev(xs: number[]) {
  if (xs.length < 2) return 0
  const m = mean(xs)
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)))
}

export function RhythmLane({ exercise }: { exercise: Exercise }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Game | null>(null)
  const rafRef = useRef<number | null>(null)

  const [status, setStatus] = useState<'idle' | 'playing' | 'done'>('idle')
  const [score, setScore] = useState({ perfect: 0, good: 0, miss: 0 })
  const [current, setCurrent] = useState<GameNote | null>(null)
  const [countIn, setCountIn] = useState(0)
  const [progress, setProgress] = useState(() => loadProgress())
  const [bpm, setBpm] = useState(() => loadProgress()[exercise.id]?.bpm ?? exercise.bpm)
  const [latency, setLatency] = useState(() => loadLatency())
  const [deltas, setDeltas] = useState<number[]>([])
  const [strays, setStrays] = useState(0)

  const total = exercise.notes.length

  const stop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    releaseChanterNote()
  }, [])

  useEffect(() => () => stop(), [stop])

  // Reset when the exercise changes, picking up where this drill's ladder left off.
  useEffect(() => {
    stop()
    gameRef.current = null
    setStatus('idle')
    setScore({ perfect: 0, good: 0, miss: 0 })
    setCurrent(null)
    setCountIn(0)
    setDeltas([])
    setStrays(0)
    const saved = loadProgress()
    setProgress(saved)
    setBpm(saved[exercise.id]?.bpm ?? exercise.bpm)
    drawStatic()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id])

  function buildGame(): Game {
    const timed = buildTimedExercise(exercise, bpm)
    const notes: GameNote[] = timed.notes.map((tn) => ({
      name: tn.name,
      freq: tn.freq,
      covered: tn.covered,
      targetMs: tn.targetMs,
      status: 'pending',
      cue: tn.cue,
      graces: tn.graces,
      graceFreqs: tn.graceFreqs,
    }))
    return {
      startMs: 0,
      notes,
      beatTimes: timed.beatTimes,
      nextBeat: 0,
      lastTargetMs: timed.lastTargetMs,
      leadInMs: timed.leadInMs,
      beatMs: timed.beatMs,
      endMs: timed.lastTargetMs + 1200,
      earlyStrays: 0,
    }
  }

  function start() {
    resumeAudio()
    const g = buildGame()
    g.startMs = performance.now()
    gameRef.current = g
    setScore({ perfect: 0, good: 0, miss: 0 })
    setDeltas([])
    setStrays(0)
    setStatus('playing')
    setCurrent(g.notes[0] ?? null)
    setCountIn(exercise.beatsPerBar)
    loop()
  }

  function nextPending(g: Game): GameNote | null {
    return g.notes.find((n) => n.status === 'pending') ?? null
  }

  function recount(g: Game) {
    let perfect = 0
    let good = 0
    let miss = 0
    for (const n of g.notes) {
      if (n.status === 'perfect') perfect++
      else if (n.status === 'good') good++
      else if (n.status === 'miss') miss++
    }
    setScore({ perfect, good, miss })
  }

  const judge = useCallback(() => {
    const g = gameRef.current
    if (!g || status !== 'playing') return
    // Correct for device latency (touch delay + audio output + render lag)
    // before judging, so a slow phone doesn't read as a learner with no rhythm.
    const elapsed = performance.now() - g.startMs - latency
    let best: GameNote | null = null
    let bestDelta = Infinity // signed: positive = tapped late
    for (const n of g.notes) {
      if (n.status !== 'pending') continue
      const d = elapsed - n.targetMs
      if (Math.abs(d) < Math.abs(bestDelta)) {
        bestDelta = d
        best = n
      }
    }
    if (!best || Math.abs(bestDelta) > GOOD_MS + 60) {
      // Too far from any note to judge. Count the early ones: a learner who
      // rushes taps well ahead of the beat, and silently dropping those taps is
      // what made the commonest beginner fault invisible.
      if (best && bestDelta < 0) {
        g.earlyStrays++
        setStrays(g.earlyStrays)
      }
      return
    }
    const mag = Math.abs(bestDelta)
    best.status = mag <= PERFECT_MS ? 'perfect' : mag <= GOOD_MS ? 'good' : 'miss'
    best.delta = bestDelta
    setDeltas((prev) => [...prev, bestDelta])
    if (best.status !== 'miss') {
      if (best.graceFreqs.length) playOrnamentedNote(best.graceFreqs, best.freq)
      else playChanterNoteLegato(best.freq)
    }
    recount(g)
    setCurrent(nextPending(g))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, latency])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === 'Space') {
        e.preventDefault()
        judge()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [judge])

  function loop() {
    const g = gameRef.current
    if (!g) return
    const elapsed = performance.now() - g.startMs

    // metronome
    while (g.nextBeat < g.beatTimes.length && g.beatTimes[g.nextBeat].ms <= elapsed) {
      playClick(g.beatTimes[g.nextBeat].accent)
      g.nextBeat++
    }

    // count-in readout: the lane is empty for the first couple of seconds, so
    // without this the learner just sees a blank rectangle and assumes the
    // button didn't work.
    setCountIn(elapsed < g.leadInMs ? Math.ceil((g.leadInMs - elapsed) / g.beatMs) : 0)

    // misses
    let changed = false
    for (const n of g.notes) {
      if (n.status === 'pending' && elapsed - latency - n.targetMs > MISS_MS) {
        n.status = 'miss'
        changed = true
      }
    }
    if (changed) {
      recount(g)
      setCurrent(nextPending(g))
    }

    draw(g, elapsed)

    if (elapsed >= g.endMs) {
      setStatus('done')
      stop()
      return
    }
    rafRef.current = requestAnimationFrame(loop)
  }

  function laneMetrics(canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect()
    const w = rect.width
    const h = LANE_HEIGHT
    const hitY = h - 72
    const pxPerMs = hitY / APPROACH_MS
    return { w, h, hitY, pxPerMs }
  }

  function prepareCanvas(): { ctx: CanvasRenderingContext2D; w: number; h: number; hitY: number; pxPerMs: number } | null {
    const canvas = canvasRef.current
    if (!canvas) return null
    const { w, h, hitY, pxPerMs } = laneMetrics(canvas)
    const dpr = window.devicePixelRatio || 1
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    return { ctx, w, h, hitY, pxPerMs }
  }

  function css(name: string) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  }

  function drawStatic() {
    const p = prepareCanvas()
    if (!p) return
    const { ctx, w, h, hitY } = p
    ctx.clearRect(0, 0, w, h)
    drawHitLine(ctx, w, hitY)
  }

  function drawHitLine(ctx: CanvasRenderingContext2D, w: number, hitY: number) {
    const accent = css('--accent') || '#93641b'
    ctx.save()
    ctx.fillStyle = accent
    ctx.globalAlpha = 0.12
    ctx.fillRect(0, hitY - 26, w, 52)
    ctx.globalAlpha = 1
    ctx.strokeStyle = accent
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, hitY)
    ctx.lineTo(w, hitY)
    ctx.stroke()
    ctx.restore()
  }

  function draw(g: Game, elapsed: number) {
    const p = prepareCanvas()
    if (!p) return
    const { ctx, w, h, hitY, pxPerMs } = p
    ctx.clearRect(0, 0, w, h)
    drawHitLine(ctx, w, hitY)

    const cx = w / 2
    const accent = css('--accent') || '#93641b'
    const text = css('--text') || '#211f1a'
    const bg = css('--bg') || '#f2f0e6'

    for (const n of g.notes) {
      const y = hitY - (n.targetMs - elapsed) * pxPerMs
      if (y < -40 || y > h + 40) continue
      let fill = bg
      let stroke = accent
      let label = text
      if (n.status === 'perfect') {
        fill = '#3f7d4f'
        stroke = '#3f7d4f'
        label = '#fff'
      } else if (n.status === 'good') {
        fill = accent
        stroke = accent
        label = bg
      } else if (n.status === 'miss') {
        fill = bg
        stroke = '#b3543b'
        label = '#b3543b'
      }
      ctx.beginPath()
      ctx.arc(cx, y, 22, 0, Math.PI * 2)
      ctx.fillStyle = fill
      ctx.fill()
      ctx.lineWidth = 2.5
      ctx.strokeStyle = stroke
      ctx.stroke()
      ctx.fillStyle = label
      ctx.font = '600 12px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(n.name, cx, y)

      // grace notes: small satellite dots up and to the left of the principal
      if (n.graces.length) {
        for (let gi = 0; gi < n.graces.length; gi++) {
          ctx.beginPath()
          ctx.arc(cx - 30 - gi * 13, y - 20, 5, 0, Math.PI * 2)
          ctx.fillStyle = accent
          ctx.fill()
        }
      }
    }

    // count-in: fill the otherwise-empty lane with the beats going by
    if (elapsed < g.leadInMs) {
      const remaining = Math.ceil((g.leadInMs - elapsed) / g.beatMs)
      ctx.save()
      ctx.fillStyle = accent
      ctx.globalAlpha = 0.85
      ctx.font = '700 64px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(remaining), cx, hitY / 2)
      ctx.globalAlpha = 0.6
      ctx.font = '600 14px system-ui, sans-serif'
      ctx.fillText('counting you in', cx, hitY / 2 + 48)
      ctx.restore()
    }
  }

  const judged = score.perfect + score.good + score.miss
  const accuracy = judged ? Math.round(((score.perfect + score.good * GOOD_WEIGHT) / total) * 100) : 0
  const mastered = status === 'done' && accuracy >= MASTERY_PCT
  const canStepUp = mastered && bpm < MAX_BPM
  const record = progress[exercise.id]

  // Timing diagnosis: the sign of the error is the most useful thing we can
  // tell a beginner, and it used to be computed and thrown away.
  const meanDelta = deltas.length ? mean(deltas) : 0
  const spread = stdev(deltas)
  const offerCalibration =
    status === 'done' &&
    deltas.length >= 4 &&
    Math.abs(meanDelta) >= CALIBRATE_MIN_MS &&
    spread < CALIBRATE_MAX_SPREAD_MS

  // Record the run when it finishes: best accuracy with the tempo it happened
  // at, plus the ladder position, so both survive a tab switch and a reload.
  useEffect(() => {
    if (status !== 'done') return
    setProgress((prev) => recordRun(prev, exercise.id, bpm, accuracy))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  function changeTempo(delta: number) {
    const next = Math.min(MAX_BPM, Math.max(MIN_BPM, bpm + delta))
    if (next === bpm) return
    stop()
    gameRef.current = null
    setBpm(next)
    setProgress((prev) => saveLadderBpm(prev, exercise.id, next))
    setScore({ perfect: 0, good: 0, miss: 0 })
    setDeltas([])
    setStrays(0)
    setCurrent(null)
    setCountIn(0)
    setStatus('idle')
    drawStatic()
  }

  function applyCalibration() {
    const next = latency + Math.round(meanDelta)
    setLatency(next)
    saveLatency(next)
  }

  function timingNote() {
    if (!deltas.length) return 'No taps landed near a note — start with the count-in and tap on each beat.'
    const dir = meanDelta > 0 ? 'late' : 'early'
    const ms = Math.abs(Math.round(meanDelta))
    if (ms >= 35) return `You were on average ${ms}ms ${dir}.`
    if (strays >= 2) return `You tapped ahead of the beat ${strays} times — settle onto the click.`
    if (score.miss > 0) return `${score.miss} ${score.miss === 1 ? 'note went' : 'notes went'} by untapped.`
    return 'Your taps were close, just scattered — the same tempo again will tighten them.'
  }

  return (
    <div className="rhythm">
      <div className="rhythm-lane-wrap" ref={wrapRef}>
        <canvas
          ref={canvasRef}
          className="rhythm-canvas"
          style={{ height: LANE_HEIGHT }}
          onPointerDown={(e) => {
            e.preventDefault()
            judge()
          }}
        />
      </div>

      <div className="rhythm-side">
        <ChanterDiagram covered={current?.covered ?? NOTES[0].covered} />
        <p className="rhythm-current">
          {countIn > 0 ? `Count in… ${countIn}` : current ? current.name : status === 'done' ? 'Done' : '—'}
        </p>
        {current?.graces.length ? (
          <p className="rhythm-grace">grace: {current.graces.join(' · ')}</p>
        ) : null}
        {current?.cue ? <p className="rhythm-cue">{current.cue}</p> : null}
      </div>

      <div className="rhythm-controls">
        {status !== 'playing' ? (
          <button type="button" className="play-button" onClick={start}>
            {status === 'done' ? 'Play again' : 'Start'}
          </button>
        ) : (
          <button type="button" className="play-button" onClick={() => { stop(); setStatus('idle') }}>
            Stop
          </button>
        )}
        {canStepUp ? (
          <button type="button" className="stepup-button" onClick={() => changeTempo(TEMPO_STEP)}>
            Step up to {Math.min(MAX_BPM, bpm + TEMPO_STEP)} bpm ›
          </button>
        ) : (
          <button type="button" className="tap-button" onClick={judge} disabled={status !== 'playing'}>
            Tap
          </button>
        )}
      </div>

      <div className="rhythm-meta">
        <div className="tempo-stepper">
          <button
            type="button"
            className="tempo-btn"
            onClick={() => changeTempo(-TEMPO_STEP)}
            disabled={bpm <= MIN_BPM}
            aria-label="Slower"
          >
            –
          </button>
          <span className="tempo-badge">{bpm} bpm</span>
          <button
            type="button"
            className="tempo-btn"
            onClick={() => changeTempo(TEMPO_STEP)}
            disabled={bpm >= MAX_BPM}
            aria-label="Faster"
          >
            +
          </button>
        </div>
        <span className="best-badge">
          {record?.bestPct != null
            ? `Best ${record.bestPct}%${record.bestBpm ? ` @ ${record.bestBpm} bpm` : ''}`
            : 'Best —'}
        </span>
        <span className="mastery-target">Reach {MASTERY_PCT}% to speed up</span>
      </div>

      {status === 'done' ? (
        <div className="run-result-block">
          <p className={mastered ? 'run-result is-mastered' : 'run-result'}>
            {mastered
              ? bpm >= MAX_BPM
                ? `Timing clean at ${bpm} bpm — top of the ladder. Beautiful.`
                : `Timing clean at ${bpm} bpm. Step up when you’re ready.`
              : `${accuracy}% this run. ${timingNote()}`}
          </p>
          {!mastered ? (
            <div className="run-actions">
              {bpm > MIN_BPM ? (
                <button type="button" className="retry-slower" onClick={() => changeTempo(-TEMPO_STEP)}>
                  Slow it to {Math.max(MIN_BPM, bpm - TEMPO_STEP)} bpm
                </button>
              ) : null}
              {offerCalibration ? (
                <button type="button" className="calibrate-button" onClick={applyCalibration}>
                  Every tap ran {Math.abs(Math.round(meanDelta))}ms {meanDelta > 0 ? 'late' : 'early'} — adjust for my device
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="rhythm-score">
        <Stat label="Perfect" value={score.perfect} tone="good" />
        <Stat label="Good" value={score.good} tone="mid" />
        <Stat label="Missed" value={score.miss} tone="bad" />
        <Stat label="Accuracy" value={`${accuracy}%`} tone="accent" />
      </div>

      <p className="hint">
        Tap the lane, the <strong>Tap</strong> button, or the spacebar as each note crosses the line. Start slow — the tempo
        steps up only when you play a run clean. This scores your <strong>timing</strong>, not your fingers: play along on
        your chanter and check the diagram matches your hands.
        {latency !== 0 ? (
          <>
            {' '}
            Timing is offset by {latency}ms for your device.{' '}
            <button
              type="button"
              className="link-button"
              onClick={() => {
                setLatency(0)
                saveLatency(0)
              }}
            >
              Reset
            </button>
          </>
        ) : null}
      </p>
    </div>
  )
}

function Stat({ label, value, tone }: { label: string; value: number | string; tone: string }) {
  return (
    <div className={`stat stat-${tone}`}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
