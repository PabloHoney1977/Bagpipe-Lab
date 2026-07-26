// Which drills are open yet, and what to practise today.
//
// Two problems this solves. First, every exercise in the app was visible on a
// fresh install, so nothing ever *appeared* because of something the learner
// did — no anticipation, and it contradicted PEDAGOGY.md §2.2's "gate on
// mastery, not completion". Second, a returning learner landed on an unchanged
// front page and a row of identical chips, so every session started with a
// decision instead of a practice.

import { STAGES } from './curriculum'
import { EXERCISES } from './tunes'
import { TRIADS } from './triads'
import { ORNAMENT_DRILLS } from './ornaments'
import type { Exercise } from './tunes'
import type { ExerciseProgress } from './progress'

/**
 * The Guide stage that teaches each drill. Exercises absent from this map are
 * open from the start — the learner must always have something to play on a
 * fresh install, and the first drill of each group stays open as a taster so a
 * locked group is never a dead end.
 */
const TAUGHT_BY: Record<string, string> = {
  'amazing-grace': 'first-tune',
  // Finger gym: the two simplest moves stay open; the rest arrive with the stage.
  ...Object.fromEntries(TRIADS.slice(2).map((t) => [t.id, 'finger-gym'])),
  // Ornaments: the first high-G drill is the taster, the rest follow the stage.
  ...Object.fromEntries(ORNAMENT_DRILLS.slice(1).map((o) => [o.id, 'first-grace'])),
}

export function taughtBy(exerciseId: string): string | null {
  return TAUGHT_BY[exerciseId] ?? null
}

export function stageTitle(stageId: string): string {
  return STAGES.find((s) => s.id === stageId)?.title ?? stageId
}

/**
 * A drill is open if nothing teaches it, its stage is done, the Guide sent the
 * learner to it, or they have already practised it — nobody loses access to
 * something they were using before locking existed.
 *
 * The `granted` case matters: several stages open with a CTA into the very
 * drill they teach (the "Your first tune" stage points straight at Amazing
 * Grace), and a stage is not marked done until *after* you have practised it.
 * Without this, following the Guide's own button would land you on a fallback
 * drill instead of the one you asked for.
 */
export function isUnlocked(
  exerciseId: string,
  doneStages: Set<string>,
  progress: Record<string, ExerciseProgress>,
  granted: Set<string> = new Set(),
): boolean {
  const stage = taughtBy(exerciseId)
  if (!stage) return true
  if (doneStages.has(stage)) return true
  if (granted.has(exerciseId)) return true
  return Boolean(progress[exerciseId])
}

// --- what to practise now -------------------------------------------------

export type Suggestion = {
  exercise: Exercise
  /** why it's being suggested, shown to the learner */
  reason: string
}

const ALL = [...EXERCISES, ...TRIADS, ...ORNAMENT_DRILLS]
const STALE_MS = 3 * 24 * 60 * 60 * 1000

/**
 * Today's practice: the drills worth the learner's next ten minutes, weakest
 * first, plus one they haven't touched in a while. Only ever suggests unlocked
 * drills, and only ones they've actually met.
 */
export function suggestPractice(
  doneStages: Set<string>,
  progress: Record<string, ExerciseProgress>,
  granted: Set<string> = new Set(),
  limit = 3,
): Suggestion[] {
  const open = ALL.filter((e) => isUnlocked(e.id, doneStages, progress, granted))
  const attempted = open.filter((e) => progress[e.id])
  const out: Suggestion[] = []

  // Weakest first — the drills where the score says there's room.
  const weakest = [...attempted]
    .filter((e) => (progress[e.id].bestPct ?? 0) < 85)
    .sort((a, b) => (progress[a.id].bestPct ?? 0) - (progress[b.id].bestPct ?? 0))
  for (const e of weakest.slice(0, 2)) {
    out.push({ exercise: e, reason: `Best so far ${progress[e.id].bestPct ?? 0}% — worth another go` })
  }

  // One spaced-review item: solid before, but not lately.
  const now = Date.now()
  const stale = [...attempted]
    .filter((e) => !out.some((s) => s.exercise.id === e.id))
    .filter((e) => now - (progress[e.id].lastAt ?? 0) > STALE_MS)
    .sort((a, b) => (progress[a.id].lastAt ?? 0) - (progress[b.id].lastAt ?? 0))
  if (stale.length) out.push({ exercise: stale[0], reason: 'You haven’t played this in a few days' })

  // Nothing practised yet, or everything is strong: point at something new.
  if (out.length < limit) {
    const fresh = open.filter((e) => !progress[e.id] && !out.some((s) => s.exercise.id === e.id))
    for (const e of fresh.slice(0, limit - out.length)) {
      out.push({ exercise: e, reason: 'New — you haven’t tried this one' })
    }
  }

  return out.slice(0, limit)
}

/**
 * A warm-up that interleaves drills the learner already knows. Practice in the
 * app is otherwise entirely blocked — n reps of one thing, never revisiting
 * earlier material — which PEDAGOGY.md §2.5 explicitly argues against.
 */
export function buildWarmUp(
  doneStages: Set<string>,
  progress: Record<string, ExerciseProgress>,
  granted: Set<string> = new Set(),
): Exercise | null {
  const attempted = ALL.filter((e) => progress[e.id] && isUnlocked(e.id, doneStages, progress, granted))
  if (attempted.length < 3) return null

  // Deterministic per-day shuffle: the mix changes daily without reshuffling
  // underneath a learner mid-session.
  const seed = new Date().getDate()
  const picked = [...attempted]
    .sort((a, b) => ((a.id.charCodeAt(0) * seed) % 97) - ((b.id.charCodeAt(0) * seed) % 97))
    .slice(0, 4)

  const notes = picked.flatMap((e) => e.notes.slice(0, 4).map((n) => ({ ...n, cue: undefined })))
  const bpm = Math.round(picked.reduce((a, e) => a + (progress[e.id].bpm ?? e.bpm), 0) / picked.length)

  return {
    id: 'warm-up-mix',
    name: 'Warm-up mix',
    description: `A few bars each of ${picked
      .map((e) => e.name)
      .join(', ')} — switching between moves is harder than repeating one, and it is how they will actually turn up in tunes.`,
    bpm,
    beatsPerBar: 4,
    notes,
  }
}
