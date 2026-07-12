// Rhythm exercises for the Play tab. These are original practice patterns built
// from the chanter scale (not tunes), so there's no copyright question. Real
// public-domain melodies get added once the repertoire is chosen.

export type ExerciseNote = {
  /** must match a name in NOTES (see chanter.ts) */
  note: string
  /** duration in beats */
  beats: number
}

export type Exercise = {
  id: string
  name: string
  description: string
  bpm: number
  beatsPerBar: number
  notes: ExerciseNote[]
}

export const EXERCISES: Exercise[] = [
  {
    id: 'steady-low-a',
    name: 'Steady Low A',
    description: 'Eight steady beats on Low A. Feel the pulse before you add anything.',
    bpm: 60,
    beatsPerBar: 4,
    notes: Array.from({ length: 8 }, () => ({ note: 'Low A', beats: 1 })),
  },
  {
    id: 'a-b-alternate',
    name: 'Low A & B',
    description: 'Alternate two neighbouring notes in time — your first real finger move on the beat.',
    bpm: 60,
    beatsPerBar: 4,
    notes: Array.from({ length: 8 }, (_, i) => ({ note: i % 2 === 0 ? 'Low A' : 'B', beats: 1 })),
  },
  {
    id: 'scale-up',
    name: 'The scale, in time',
    description: 'Walk up the full scale, one note per beat. Keep every beat even.',
    bpm: 55,
    beatsPerBar: 4,
    notes: ['Low G', 'Low A', 'B', 'C', 'D', 'E', 'F', 'High G', 'High A'].map((note) => ({
      note,
      beats: 1,
    })),
  },
  {
    id: 'scale-updown',
    name: 'Scale, up and down',
    description: 'Up to High A and back down — a longer run to hold a steady pulse through.',
    bpm: 55,
    beatsPerBar: 4,
    notes: ['Low G', 'Low A', 'B', 'C', 'D', 'E', 'F', 'High G', 'High A', 'High G', 'F', 'E', 'D', 'C', 'B', 'Low A', 'Low G'].map(
      (note) => ({ note, beats: 1 }),
    ),
  },
]
