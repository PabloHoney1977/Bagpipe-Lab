// Embellishment ("grace notes") foundation. An ornament is a short flam of grace
// notes attached to the front of a melody note. We model that as a list of grace
// note names on an ExerciseNote (`graces`), sounded just before the principal.
//
// Fingering accuracy matters and the project's rule is: don't guess piping
// specifics (see the fingering/staff corrections in CLAUDE.md). So here we ship
// only the ornament we're certain of — the HIGH-G GRACENOTE — as real drills,
// plus ONE clearly-labelled DRAFT doubling to exercise the cluster rendering.
// The full doublings table is left for the owner to verify; see
// reference/embellishments.md.

import { NOTES } from './chanter'
import type { Exercise, ExerciseNote } from './tunes'

const FREQ_BY_NAME = new Map(NOTES.map((n) => [n.name, n.freq]))

/** Resolve grace-note names to frequencies (unknown names are dropped). */
export function toGraceFreqs(names: string[]): number[] {
  return names.map((n) => FREQ_BY_NAME.get(n)).filter((f): f is number => f != null)
}

// The high-G gracenote is played by briefly lifting the top-hand index finger to
// sound High G, then dropping back to the melody note. It articulates a note —
// and, crucially, separates two of the SAME note, which a chanter can't stop
// between. Valid on any note below High G.
const HG_PRINCIPALS = ['Low A', 'B', 'C', 'D', 'E', 'F']

function slug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

/** Eight beats of one note, each articulated by a high-G gracenote. */
function highGDrill(principal: string): Exercise {
  const notes: ExerciseNote[] = Array.from({ length: 8 }, () => ({
    note: principal,
    beats: 1,
    graces: ['High G'],
  }))
  return {
    id: `orn-hg-${slug(principal)}`,
    name: `High-G on ${principal}`,
    description: `Articulate each ${principal} with a high-G gracenote — a quick lift of the top-hand index finger. This is how you separate two of the same note.`,
    bpm: 60,
    beatsPerBar: 4,
    notes,
  }
}

// DRAFT — a doubling separates two of the same note with a grace-note cluster.
// The exact interior grace for each note is piping canon but NOT yet owner-
// verified here, so this is a single flagged example, not a full table.
const DOUBLING_B_DRAFT: Exercise = {
  id: 'orn-doubling-b',
  name: 'Doubling of B',
  description:
    'A doubling separates two of the same note with a quick cluster of grace notes. This one is still being refined, so treat the exact fingering as provisional for now.',
  bpm: 54,
  beatsPerBar: 4,
  notes: Array.from({ length: 4 }, () => ({
    note: 'B',
    beats: 2,
    graces: ['High G', 'B', 'D'],
  })),
}

export const ORNAMENT_DRILLS: Exercise[] = [
  ...HG_PRINCIPALS.map(highGDrill),
  DOUBLING_B_DRAFT,
]
