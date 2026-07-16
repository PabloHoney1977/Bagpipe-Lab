import type { ReactNode } from 'react'
import type { Preset } from './nav'
import {
  Welcome,
  Anatomy,
  Reed,
  Blowing,
  Holding,
  FingerPlacement,
  NotationBasics,
  RhythmBasics,
  StaffNotes,
  ToThePipes,
} from './content'

/** A button on a stage card that jumps into a preconfigured tool tab. */
export type StageCTA = { label: string; preset: Preset }

export type Stage = {
  id: string
  phase: string
  title: string
  /** rough time budget, shown under the title */
  time?: string
  /** a short "what & why" — a couple of sentences, not an essay */
  concept: ReactNode
  /** buttons that send the learner into the practice tabs */
  ctas?: StageCTA[]
  /** concrete things to do, in the tool the CTA opens */
  checklist?: string[]
  /** how you know you're ready to move on */
  mastery?: string
  /** the deeper written lesson, tucked behind a "Why it works" expander */
  why?: () => ReactNode
}

// The Guide is a coaching path, not a textbook: each stage explains one idea in
// a few sentences, then sends the learner into the Scale / Play / Explore tabs
// to actually do it. The longer prose lives behind each stage's "Why it works".
export const STAGES: Stage[] = [
  // ── Phase 1 — Meet the instrument ─────────────────────────────────
  {
    id: 'welcome',
    phase: 'Meet the instrument',
    title: 'How this course works',
    time: 'Read once',
    concept: (
      <p>
        This Guide is your <strong>map</strong>. Each stage explains one small thing, then sends you to the{' '}
        <strong>Scale</strong>, <strong>Play</strong>, or <strong>Explore</strong> tabs to actually do it. Work top to
        bottom, tick off the practice steps, and mark a stage done when it feels solid.
      </p>
    ),
    why: () => <Welcome />,
  },
  {
    id: 'anatomy',
    phase: 'Meet the instrument',
    title: 'Meet the practice chanter',
    time: '5 min',
    concept: (
      <p>
        Every piper starts on the practice chanter — a simple pipe you blow into, with eight finger holes. Get to know
        its parts before you play it.
      </p>
    ),
    why: () => <Anatomy />,
  },
  {
    id: 'reed',
    phase: 'Meet the instrument',
    title: 'The reed',
    time: '5 min',
    concept: (
      <p>
        A small double reed inside the chanter makes the sound. It never stops while you blow — which, later, is the
        whole reason grace notes exist.
      </p>
    ),
    why: () => <Reed />,
  },
  {
    id: 'blowing',
    phase: 'Meet the instrument',
    title: 'Blowing steadily',
    time: 'A few sessions',
    concept: (
      <p>
        The one skill under everything: a steady, even breath. Not hard — <em>even</em>. A wavering breath makes a
        wavering note.
      </p>
    ),
    checklist: [
      'Cover every hole and blow softly until the note is clear and steady.',
      'Hold one long, unwavering note for a slow count of eight.',
      'Do it again without the pitch dipping or rising.',
    ],
    mastery: 'Done when you can hold a clear, steady note without it wobbling.',
    why: () => <Blowing />,
  },
  {
    id: 'holding',
    phase: 'Meet the instrument',
    title: 'Holding the chanter',
    time: '5 min',
    concept: (
      <p>
        Left hand on top, right hand on the bottom — always, whichever hand you write with. A relaxed hold now saves you
        from habits that are hard to undo.
      </p>
    ),
    why: () => <Holding />,
  },
  {
    id: 'fingers',
    phase: 'Meet the instrument',
    title: 'Finger placement',
    time: 'A few sessions',
    concept: (
      <p>
        Every note is made by sealing holes with the soft pads of your fingers. Open the <strong>Explore</strong> tab to
        see exactly which holes each note needs.
      </p>
    ),
    ctas: [{ label: 'Open Explore notes', preset: { tab: 'play', playMode: 'notes' } }],
    checklist: [
      'In Explore notes, tap a few notes and watch which holes fill in on the diagram.',
      'Copy each shape on your own chanter, sealing every covered hole with the finger pad.',
      'Check there are no squeals — a squeal means a hole is leaking.',
    ],
    mastery: 'Done when your fingers seal cleanly and your hand stays relaxed.',
    why: () => <FingerPlacement />,
  },

  // ── Phase 2 — The nine notes ──────────────────────────────────────
  {
    id: 'nine-notes',
    phase: 'The nine notes',
    title: 'Learn the nine notes',
    time: '10–15 min/session',
    concept: (
      <p>
        The chanter plays exactly nine notes: Low G, Low A, B, C, D, E, F, High G, High A. Learn each one by its sound{' '}
        <em>and</em> its fingering together.
      </p>
    ),
    ctas: [{ label: 'Open Explore notes', preset: { tab: 'play', playMode: 'notes' } }],
    checklist: [
      'In Explore notes, tap up from Low G to High A and back, saying each note name aloud.',
      'Play each note on your chanter as you tap it in the app.',
      'Pick a note at random, name it, and set the fingering before you tap to check.',
    ],
    mastery: 'Done when you can name any note and find its fingering without looking it up.',
  },

  // ── Phase 3 — Reading the music ───────────────────────────────────
  {
    id: 'notation-why',
    phase: 'Reading the music',
    title: 'Why bagpipe notation is simple',
    time: '5 min',
    concept: (
      <p>
        Pipe music uses one clef, one small range, and no sharps or flats. Because the chanter is a fixed-pitch
        instrument, reading it is one of the simplest jobs in music.
      </p>
    ),
    why: () => <NotationBasics />,
  },
  {
    id: 'staff-notes',
    phase: 'Reading the music',
    title: 'The staff, note by note',
    time: '10 min/session',
    concept: (
      <p>
        Each of the nine notes has one fixed spot on the staff. Learn the spots, then hear them: the{' '}
        <strong>Read the music</strong> mode lights each note on the staff as it plays.
      </p>
    ),
    ctas: [
      { label: 'Read the scale on the staff', preset: { tab: 'play', playMode: 'read', exerciseId: 'scale-up' } },
      { label: 'Cross-check in Explore', preset: { tab: 'play', playMode: 'notes' } },
    ],
    checklist: [
      'Study where each note sits (Low G on the 2nd line, up to High A on a ledger line).',
      'In Read the music, play “The scale, in time” and watch each note light up on the staff.',
      'Pause on a note and name it from its staff position before you look at the label.',
    ],
    mastery: 'Done when you can name any note from where it sits on the staff.',
    why: () => <StaffNotes />,
  },
  {
    id: 'rhythm-reading',
    phase: 'Reading the music',
    title: 'Reading the rhythm',
    time: '10 min',
    concept: (
      <p>
        A note’s shape tells you how long to hold it; the time signature groups the beats into bars. Feel that pulse in
        the <strong>Play</strong> tab.
      </p>
    ),
    ctas: [{ label: 'Feel a steady pulse', preset: { tab: 'play', playMode: 'feel', exerciseId: 'a-b-alternate' } }],
    why: () => <RhythmBasics />,
  },

  // ── Phase 4 — Play in time ────────────────────────────────────────
  {
    id: 'scale-in-time',
    phase: 'Play in time',
    title: 'The scale, in time',
    time: '10–15 min/session',
    concept: (
      <p>
        Put fingers and pulse together: play the whole scale evenly, one note per beat. Watch it first in the{' '}
        <strong>Scale</strong> tab, then play it for a score.
      </p>
    ),
    ctas: [
      { label: 'Watch the scale', preset: { tab: 'scale' } },
      { label: 'Play the scale in time', preset: { tab: 'play', playMode: 'feel', exerciseId: 'scale-up' } },
    ],
    checklist: [
      'In the Scale tab, follow the highlighted finger up and down the octave.',
      'In Feel the pulse, play “The scale, in time” and keep every beat even.',
      'Reach 85% so the tempo ladder lets you speed up a notch.',
    ],
    mastery: 'Done when you can play the scale cleanly at 85% or better.',
  },
  {
    id: 'steady-rhythm',
    phase: 'Play in time',
    title: 'Steady rhythm',
    time: 'Daily, 10 min',
    concept: (
      <p>
        Rhythm is graded before anything fancy. Because a chanter can’t restrike the same note — the tone never stops —
        your first pulse work <em>moves</em> between notes on the beat. Hold it rock-steady and let the tempo ladder speed
        you up only when you play clean.
      </p>
    ),
    ctas: [
      { label: 'Rock Low A & B', preset: { tab: 'play', playMode: 'feel', exerciseId: 'a-b-alternate' } },
      { label: 'Then the low-hand walk', preset: { tab: 'play', playMode: 'feel', exerciseId: 'low-hand-walk' } },
    ],
    checklist: [
      'Play “Low A & B” — rock between two notes on the beat — until you hit 85% and can step the tempo up.',
      'Move to the “Low-hand walk” for a little more finger movement, still dead on the pulse.',
      'Climb the tempo ladder a notch at a time; never faster than you can play cleanly.',
    ],
    mastery: 'Done when both patterns sit above 85% at a tempo that feels comfortable.',
  },
  {
    id: 'read-along',
    phase: 'Play in time',
    title: 'Read while you play',
    time: '10 min/session',
    concept: (
      <p>
        Now combine reading and playing. In <strong>Read the music</strong> the notes are written on the staff and light
        up in time — follow along on your chanter.
      </p>
    ),
    ctas: [{ label: 'Read the scale up and down', preset: { tab: 'play', playMode: 'read', exerciseId: 'scale-updown' } }],
    checklist: [
      'Slow the tempo down until you can read each note before the line reaches it.',
      'Play “Scale, up and down” all the way through without losing your place.',
      'Nudge the tempo back up once your eyes stay ahead of the line.',
    ],
    mastery: 'Done when you can read and play a full run without stopping.',
  },
  {
    id: 'first-tune',
    phase: 'Play in time',
    title: 'Your first tune',
    time: 'Ongoing',
    concept: (
      <p>
        Time for real music. Read <strong>Amazing Grace</strong> plain — melody only, no ornaments yet — then feel its
        pulse. (This setting is a working draft while the exact notes are finalised.)
      </p>
    ),
    ctas: [
      { label: 'Read Amazing Grace', preset: { tab: 'play', playMode: 'read', exerciseId: 'amazing-grace' } },
      { label: 'Feel its pulse', preset: { tab: 'play', playMode: 'feel', exerciseId: 'amazing-grace' } },
    ],
    checklist: [
      'Read it through slowly in Read the music, naming notes as they light up.',
      'Switch to Feel the pulse and play it in time.',
      'Build it up until you can play the whole tune plainly, start to finish.',
    ],
    mastery: 'Done when you can play the tune plainly and steadily from beginning to end.',
  },

  // ── Phase 5 — Onto the pipes ──────────────────────────────────────
  {
    id: 'to-the-pipes',
    phase: 'Onto the pipes',
    title: 'From chanter to pipes',
    time: 'Read once',
    concept: (
      <p>
        When your fingering is clean and your rhythm is steady, the exact same fingering carries straight over to the
        Great Highland Bagpipe. Next comes the grace notes that make it sound like piping — the{' '}
        <strong>Grace notes</strong> tab is where that lives.
      </p>
    ),
    why: () => <ToThePipes />,
  },
]

/** Phase names in order, derived from the stage list. */
export const PHASES: string[] = STAGES.reduce<string[]>((acc, s) => {
  if (!acc.includes(s.phase)) acc.push(s.phase)
  return acc
}, [])

export function stagesInPhase(phase: string): Stage[] {
  return STAGES.filter((s) => s.phase === phase)
}
