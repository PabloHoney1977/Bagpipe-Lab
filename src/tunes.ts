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

// A chanter sounds one unbroken tone: a repeated pitch can't be re-articulated
// without a separating grace note (see reference/instrument-knowledge.md §1).
// So the first pulse exercise can't be "tap Low A on every beat" — that's
// unplayable. It has to MOVE between different pitches; the pitch change is the
// only articulation available until grace notes are introduced. Every exercise
// below therefore avoids adjacent same-pitch notes (enforced by the guard at
// the foot of this file). A steady single tone is a blowing exercise, done on
// the real chanter — the Guide's "Blowing steadily" stage — not a tap drill.
export const EXERCISES: Exercise[] = [
  {
    id: 'a-b-alternate',
    name: 'Low A & B',
    description: 'Rock between two neighbouring notes on the beat — your first steady pulse, and your first finger move.',
    bpm: 60,
    beatsPerBar: 4,
    notes: Array.from({ length: 8 }, (_, i) => ({ note: i % 2 === 0 ? 'Low A' : 'B', beats: 1 })),
  },
  {
    id: 'low-hand-walk',
    name: 'Low-hand walk',
    description: 'Step up the bottom hand and back — Low A, B, C, D, C, B. A little more finger movement, still rock-steady.',
    bpm: 58,
    beatsPerBar: 3,
    notes: ['Low A', 'B', 'C', 'D', 'C', 'B'].map((note) => ({ note, beats: 1 })),
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

// Guard against re-introducing the "Steady Low A" trap: no plain exercise may
// place the same pitch on two adjacent beats, because a chanter can't restrike
// a repeated note without a grace note (not yet a feature). Fails loudly in dev
// so a bad exercise is caught the moment it's written, never shipped.
// See reference/instrument-knowledge.md §1 and §6.
function assertPlayablePlain(exercises: Exercise[]) {
  for (const ex of exercises) {
    for (let i = 1; i < ex.notes.length; i++) {
      if (ex.notes[i].note === ex.notes[i - 1].note) {
        throw new Error(
          `Exercise "${ex.id}" repeats ${ex.notes[i].note} on adjacent beats — a chanter ` +
            `can't restrike a note without a grace note. See reference/instrument-knowledge.md.`,
        )
      }
    }
  }
}

if (import.meta.env.DEV) assertPlayablePlain(EXERCISES)
