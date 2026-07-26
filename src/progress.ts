// Per-exercise practice progress, persisted across sessions.
//
// The tempo ladder is the app's only "you are better than you were" mechanic,
// so it has to survive a tab switch and a reload — it used to live in component
// state and reset every time the Play tree unmounted. `bestPct` is stored with
// the tempo it was earned at, so the number keeps climbing for months instead of
// saturating at 100% on the first clean run of an easy drill.

const KEY = 'bagpipe-lab-best'
const LATENCY_KEY = 'bagpipe-lab-latency'

export type ExerciseProgress = {
  /** current rung of the tempo ladder; undefined = the exercise's authored bpm */
  bpm?: number
  /** best accuracy reached on this exercise */
  bestPct: number
  /** tempo `bestPct` was reached at; undefined for records saved before this was tracked */
  bestBpm?: number
  /** finished runs */
  runs: number
}

type Store = Record<string, ExerciseProgress>

/** Older builds stored a bare accuracy number per exercise. */
function migrate(raw: unknown): Store {
  if (!raw || typeof raw !== 'object') return {}
  const out: Store = {}
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === 'number') out[id] = { bestPct: value, runs: 0 }
    else if (value && typeof value === 'object') out[id] = value as ExerciseProgress
  }
  return out
}

export function loadProgress(): Store {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? migrate(JSON.parse(raw)) : {}
  } catch {
    return {}
  }
}

function save(store: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store))
  } catch {
    /* ignore storage failures */
  }
}

/** Remember where the ladder currently sits for an exercise. */
export function saveLadderBpm(store: Store, id: string, bpm: number): Store {
  const prev = store[id] ?? { bestPct: 0, runs: 0 }
  const next = { ...store, [id]: { ...prev, bpm } }
  save(next)
  return next
}

/** Record a finished run, keeping the best accuracy and the tempo it happened at. */
export function recordRun(store: Store, id: string, bpm: number, accuracy: number): Store {
  const prev = store[id] ?? { bestPct: 0, runs: 0 }
  const improved = accuracy > prev.bestPct
  const entry: ExerciseProgress = {
    ...prev,
    bpm,
    runs: prev.runs + 1,
    bestPct: improved ? accuracy : prev.bestPct,
    bestBpm: improved ? bpm : prev.bestBpm,
  }
  const next = { ...store, [id]: entry }
  save(next)
  return next
}

// --- device latency -------------------------------------------------------
//
// Touch delay plus Web Audio output latency plus render lag routinely stacks to
// 60-100ms of *systematic* offset on a phone. Without correcting for it the
// mastery gate is unreachable on some devices no matter how well you play, and
// the learner has no way to discover why.

export function loadLatency(): number {
  try {
    const raw = localStorage.getItem(LATENCY_KEY)
    const n = raw ? Number(raw) : 0
    return Number.isFinite(n) ? n : 0
  } catch {
    return 0
  }
}

export function saveLatency(ms: number) {
  try {
    localStorage.setItem(LATENCY_KEY, String(Math.round(ms)))
  } catch {
    /* ignore storage failures */
  }
}
