import { useCallback, useEffect, useRef, useState } from 'react'
import { NOTES, playChanterNote, playClick, resumeAudio } from './chanter'
import { ChanterDiagram } from './ChanterDiagram'
import type { Exercise } from './tunes'

type Judgement = 'pending' | 'perfect' | 'good' | 'miss'

type GameNote = {
  name: string
  freq: number
  covered: boolean[]
  targetMs: number
  status: Judgement
}

type Game = {
  startMs: number
  notes: GameNote[]
  beatTimes: { ms: number; accent: boolean }[]
  nextBeat: number
  lastTargetMs: number
  endMs: number
}

const NOTE_BY_NAME = new Map(NOTES.map((n) => [n.name, n]))

const APPROACH_MS = 2000 // how long a note is visible falling before its beat
const PERFECT_MS = 100
const GOOD_MS = 200
const MISS_MS = 220 // a pending note this far past its beat is a miss
const LANE_HEIGHT = 360

const MASTERY_PCT = 85 // accuracy needed to step the tempo up
const TEMPO_STEP = 6 // bpm added on a clean run
const MAX_BPM = 120
const BEST_KEY = 'bagpipe-lab-best'

function loadBest(): Record<string, number> {
  try {
    const raw = localStorage.getItem(BEST_KEY)
    return raw ? (JSON.parse(raw) as Record<string, number>) : {}
  } catch {
    return {}
  }
}

export function RhythmLane({ exercise }: { exercise: Exercise }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Game | null>(null)
  const rafRef = useRef<number | null>(null)

  const [status, setStatus] = useState<'idle' | 'playing' | 'done'>('idle')
  const [score, setScore] = useState({ perfect: 0, good: 0, miss: 0 })
  const [current, setCurrent] = useState<GameNote | null>(null)
  const [bpm, setBpm] = useState(exercise.bpm)
  const [best, setBest] = useState<Record<string, number>>(() => loadBest())

  const total = exercise.notes.length
  const beatMs = 60000 / bpm
  const leadInMs = exercise.beatsPerBar * beatMs

  const stop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }, [])

  useEffect(() => () => stop(), [stop])

  // Reset when the exercise changes.
  useEffect(() => {
    stop()
    gameRef.current = null
    setStatus('idle')
    setScore({ perfect: 0, good: 0, miss: 0 })
    setCurrent(null)
    setBpm(exercise.bpm)
    drawStatic()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id])

  function buildGame(): Game {
    let beat = exercise.beatsPerBar // count-in of one bar
    const notes: GameNote[] = exercise.notes.map((en) => {
      const n = NOTE_BY_NAME.get(en.note)
      const targetMs = beat * beatMs
      beat += en.beats
      return {
        name: en.note,
        freq: n?.freq ?? 440,
        covered: n?.covered ?? [],
        targetMs,
        status: 'pending',
      }
    })
    const totalBeats = beat
    const beatTimes = Array.from({ length: totalBeats + 1 }, (_, i) => ({
      ms: i * beatMs,
      accent: i % exercise.beatsPerBar === 0,
    }))
    const lastTargetMs = notes.length ? notes[notes.length - 1].targetMs : leadInMs
    return { startMs: 0, notes, beatTimes, nextBeat: 0, lastTargetMs, endMs: lastTargetMs + 1200 }
  }

  function start() {
    resumeAudio()
    const g = buildGame()
    g.startMs = performance.now()
    gameRef.current = g
    setScore({ perfect: 0, good: 0, miss: 0 })
    setStatus('playing')
    setCurrent(g.notes[0] ?? null)
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
    const elapsed = performance.now() - g.startMs
    let best: GameNote | null = null
    let bestDelta = Infinity
    for (const n of g.notes) {
      if (n.status !== 'pending') continue
      const d = Math.abs(n.targetMs - elapsed)
      if (d < bestDelta) {
        bestDelta = d
        best = n
      }
    }
    if (!best || bestDelta > GOOD_MS + 60) return // stray tap, ignore
    best.status = bestDelta <= PERFECT_MS ? 'perfect' : bestDelta <= GOOD_MS ? 'good' : 'miss'
    if (best.status !== 'miss') playChanterNote(best.freq)
    recount(g)
    setCurrent(nextPending(g))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

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

    // misses
    let changed = false
    for (const n of g.notes) {
      if (n.status === 'pending' && elapsed - n.targetMs > MISS_MS) {
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
    }
  }

  const judged = score.perfect + score.good + score.miss
  const accuracy = judged ? Math.round(((score.perfect + score.good * 0.5) / total) * 100) : 0
  const mastered = status === 'done' && accuracy >= MASTERY_PCT
  const canStepUp = mastered && bpm < MAX_BPM
  const bestPct = best[exercise.id]

  // Record best accuracy per exercise when a run finishes.
  useEffect(() => {
    if (status !== 'done') return
    setBest((prev) => {
      if (accuracy <= (prev[exercise.id] ?? 0)) return prev
      const next = { ...prev, [exercise.id]: accuracy }
      try {
        localStorage.setItem(BEST_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  function stepUpTempo() {
    stop()
    gameRef.current = null
    setBpm((b) => Math.min(MAX_BPM, b + TEMPO_STEP))
    setScore({ perfect: 0, good: 0, miss: 0 })
    setCurrent(null)
    setStatus('idle')
    drawStatic()
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
        <p className="rhythm-current">{current ? current.name : status === 'done' ? 'Done' : '—'}</p>
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
          <button type="button" className="stepup-button" onClick={stepUpTempo}>
            Step up to {Math.min(MAX_BPM, bpm + TEMPO_STEP)} bpm ›
          </button>
        ) : (
          <button type="button" className="tap-button" onClick={judge} disabled={status !== 'playing'}>
            Tap
          </button>
        )}
      </div>

      <div className="rhythm-meta">
        <span className="tempo-badge">{bpm} bpm</span>
        <span className="best-badge">Best {bestPct != null ? `${bestPct}%` : '—'}</span>
        <span className="mastery-target">Reach {MASTERY_PCT}% to speed up</span>
      </div>

      {status === 'done' ? (
        <p className={mastered ? 'run-result is-mastered' : 'run-result'}>
          {mastered
            ? bpm >= MAX_BPM
              ? `Clean at ${bpm} bpm — top of the ladder. Beautiful.`
              : `Mastered at ${bpm} bpm. Step up when you’re ready.`
            : `${accuracy}% this run. Aim for ${MASTERY_PCT}% to move the tempo up.`}
        </p>
      ) : null}

      <div className="rhythm-score">
        <Stat label="Perfect" value={score.perfect} tone="good" />
        <Stat label="Good" value={score.good} tone="mid" />
        <Stat label="Missed" value={score.miss} tone="bad" />
        <Stat label="Accuracy" value={`${accuracy}%`} tone="accent" />
      </div>

      <p className="hint">
        Tap the lane, the <strong>Tap</strong> button, or the spacebar as each note crosses the line. Start slow — the tempo
        steps up only when you play a run clean.
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
