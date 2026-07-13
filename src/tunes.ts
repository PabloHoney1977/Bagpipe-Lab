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

// Proposed setting of Amazing Grace (public domain: Newton's 1779 words + the
// 1830s "New Britain" melody). Set with D as the tonic so it fits the chanter's
// Low A -> High A range (the pickup lands on Low A, the high phrase on High A).
// Melody only, no grace notes yet (tunes are learned plain first). This is a
// DRAFT pending the owner's correction of the exact notes and rhythm.
const AMAZING_GRACE: Exercise = {
  id: 'amazing-grace',
  name: 'Amazing Grace (draft)',
  description: 'The first real tune — melody only for now. A draft setting to be corrected; grace notes come later.',
  bpm: 50,
  beatsPerBar: 3,
  notes: [
    { note: 'Low A', beats: 1 },
    { note: 'D', beats: 2 },
    { note: 'F', beats: 1 },
    { note: 'D', beats: 2 },
    { note: 'F', beats: 1 },
    { note: 'E', beats: 2 },
    { note: 'D', beats: 1 },
    { note: 'B', beats: 2 },
    { note: 'Low A', beats: 1 },
    { note: 'D', beats: 2 },
    { note: 'F', beats: 1 },
    { note: 'D', beats: 2 },
    { note: 'F', beats: 1 },
    { note: 'E', beats: 3 },
    { note: 'F', beats: 1 },
    { note: 'High A', beats: 2 },
    { note: 'F', beats: 1 },
    { note: 'High A', beats: 2 },
    { note: 'F', beats: 1 },
    { note: 'E', beats: 2 },
    { note: 'D', beats: 1 },
    { note: 'B', beats: 2 },
    { note: 'Low A', beats: 1 },
    { note: 'D', beats: 2 },
    { note: 'F', beats: 1 },
    { note: 'D', beats: 2 },
    { note: 'E', beats: 1 },
    { note: 'D', beats: 3 },
  ],
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
  AMAZING_GRACE,
]
