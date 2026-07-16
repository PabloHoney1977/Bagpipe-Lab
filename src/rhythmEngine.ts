import { NOTES } from './chanter'
import type { Exercise } from './tunes'

const NOTE_BY_NAME = new Map(NOTES.map((n) => [n.name, n]))

/** A single note placed on the timeline, in ms from the start of the count-in. */
export type TimedNote = {
  name: string
  freq: number
  covered: boolean[]
  /** ms at which this note lands on its beat */
  targetMs: number
  /** duration in beats (carried from the exercise) */
  beats: number
  /** cumulative beat position where this note starts (after the count-in) */
  beatPos: number
}

export type Beat = { ms: number; accent: boolean }

export type TimedExercise = {
  notes: TimedNote[]
  beatTimes: Beat[]
  /** beat position of the last note's onset */
  lastTargetMs: number
  /** total beats including the one-bar count-in */
  totalBeats: number
  beatMs: number
  /** ms of the one-bar count-in before the first note */
  leadInMs: number
}

/**
 * Turn an exercise into an absolute-time schedule at a given tempo. Shared by
 * the falling-notes lane and the staff play-along so both agree on timing.
 * A one-bar count-in is prepended (the first note lands after `beatsPerBar`).
 */
export function buildTimedExercise(exercise: Exercise, bpm: number): TimedExercise {
  const beatMs = 60000 / bpm
  const leadInMs = exercise.beatsPerBar * beatMs

  let beat = exercise.beatsPerBar // count-in of one bar
  const notes: TimedNote[] = exercise.notes.map((en) => {
    const n = NOTE_BY_NAME.get(en.note)
    const beatPos = beat
    const targetMs = beat * beatMs
    beat += en.beats
    return {
      name: en.note,
      freq: n?.freq ?? 440,
      covered: n?.covered ?? [],
      targetMs,
      beats: en.beats,
      beatPos,
    }
  })

  const totalBeats = beat
  const beatTimes: Beat[] = Array.from({ length: totalBeats + 1 }, (_, i) => ({
    ms: i * beatMs,
    accent: i % exercise.beatsPerBar === 0,
  }))
  const lastTargetMs = notes.length ? notes[notes.length - 1].targetMs : leadInMs

  return { notes, beatTimes, lastTargetMs, totalBeats, beatMs, leadInMs }
}
