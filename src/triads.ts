// The "Finger Gym": short note-to-note transition drills, each looping one
// finger move until it's crisp. Inspired by the transition-drill ("Triad")
// method in Bogart's _Bagpipes: The Manual_ (see reference/triad-method.md) —
// the method and mechanics, NOT his text or exact exercises. Every drill and its
// coaching cue is generated here from our own fingering table in chanter.ts.

import { NOTES } from './chanter'
import type { Exercise, ExerciseNote } from './tunes'

const NOTE_BY_NAME = new Map(NOTES.map((n) => [n.name, n]))

// Hole order in `covered`: [thumb, L1, L2, L3, R1, R2, R3, R4].
const FINGER_NAMES = [
  'thumb',
  'top index',
  'top middle',
  'top ring',
  'bottom index',
  'bottom middle',
  'bottom ring',
  'bottom pinky',
]

function list(names: string[]): string {
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`
}

/**
 * A short coaching cue for the move from one note to another, derived from the
 * fingering diff: holes that open are "snapped up", holes that close are "tapped
 * down" (Bogart's TAP/SNAP vocabulary). Returns '' if the notes are unknown.
 */
export function transitionCue(fromName: string, toName: string): string {
  const from = NOTE_BY_NAME.get(fromName)?.covered
  const to = NOTE_BY_NAME.get(toName)?.covered
  if (!from || !to) return ''

  const raised: string[] = [] // covered -> open (lift)
  const lowered: string[] = [] // open -> covered (tap down)
  for (let i = 0; i < to.length; i++) {
    if (from[i] && !to[i]) raised.push(FINGER_NAMES[i])
    else if (!from[i] && to[i]) lowered.push(FINGER_NAMES[i])
  }
  if (!raised.length && !lowered.length) return `Stay on ${toName}.`

  const parts: string[] = []
  if (raised.length) parts.push(`snap up your ${list(raised)}`)
  if (lowered.length) parts.push(`tap down your ${list(lowered)}`)
  // Capitalise the first word.
  const s = parts.join(', and ')
  return `${s.charAt(0).toUpperCase()}${s.slice(1)}.`
}

/** Build a looping up-and-back drill between two notes, with a cue on each note. */
function drill(id: string, low: string, high: string, bpm: number, reps = 4): Exercise {
  const notes: ExerciseNote[] = []
  for (let i = 0; i < reps; i++) {
    // low then high, so each pair drills the move up and the move back down.
    notes.push({ note: low, beats: 1, cue: i === 0 ? `Set the ${low} position.` : transitionCue(high, low) })
    notes.push({ note: high, beats: 1, cue: transitionCue(low, high) })
  }
  return {
    id,
    name: `${low} ↔ ${high}`,
    description: `Drill the move between ${low} and ${high} until it snaps cleanly. One note per beat, up and back.`,
    bpm,
    beatsPerBar: 4,
    notes,
  }
}

// Ordered simplest-move-first: bottom hand, then top hand, then crossings/leaps.
// (Pairs are our own selection, not Bogart's sequence.)
export const TRIADS: Exercise[] = [
  // Bottom hand — left hand stays put.
  drill('gym-a-b', 'Low A', 'B', 60),
  drill('gym-b-c', 'B', 'C', 58),
  drill('gym-c-d', 'C', 'D', 58),
  drill('gym-a-d', 'Low A', 'D', 56),
  drill('gym-g-a', 'Low G', 'Low A', 60),
  // Top hand.
  drill('gym-d-e', 'D', 'E', 54), // the hand crossing
  drill('gym-e-f', 'E', 'F', 56),
  drill('gym-f-hg', 'F', 'High G', 56),
  drill('gym-hg-ha', 'High G', 'High A', 54),
  // Two-handed / leaps.
  drill('gym-c-e', 'C', 'E', 52),
  drill('gym-a-ha', 'Low A', 'High A', 50), // full octave leap
]
