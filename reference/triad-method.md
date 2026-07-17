# The transition-drill ("Triad") method

A summary — in our own words — of the teaching *method* in **Lloyd M. Bogart,
_Bagpipes: The Manual_ (© 1990, La Crosse, Wisconsin)**, a paper tutor the owner
studied from. This file records the *ideas and technique* we build against. It is
**not** a transcription of the book.

> **Copyright, important.** The Manual carries an all-rights-reserved notice that
> forbids copying "in whole or in part … including translating into another
> language or format." So: we use the underlying **facts and methods** — which
> finger plays which note, standard embellishment definitions, and the general
> *idea* of drilling one note-to-note move at a time. We do **not** copy Bogart's
> wording, reproduce his exact exercise sequences verbatim, or embed scans of his
> pages. Everything shipped is re-expressed originally and generated from our own
> fingering table (`src/chanter.ts`). Bogart is local; if we ever want to lift
> his material more directly, the clean path is to ask him (or via the La Crosse
> pipe band) for permission and credit.

## The core idea

Good piping is mostly clean **note-to-note finger transitions**. Instead of
starting on tunes, the method isolates every move — "from this note to that
note" — and drills it on its own as a short, looping rhythmic figure until the
change is crisp and automatic. Tunes are then just familiar transitions in a row.

Each drill is presented three ways at once — and our app already has all three:

1. **Staff notation** with the note names and finger numbers written under each note.
2. A **fingering diagram** for each position (our `ChanterDiagram`).
3. An explicit **movement instruction** naming the exact finger and motion.

## The movement vocabulary (the real gold)

The method's teaching value is in *how* the finger moves, not just where it ends up:

- **TAP down** — to go to a *lower* note, drop the finger(s) onto the hole(s)
  with a crisp, distinct tap. (Lower note = more holes covered.)
- **SNAP up** — to go to a *higher* note, lift/extend the finger(s) cleanly and
  well off the chanter. (Higher note = a hole uncovered.)
- Fingers move **like levers from the knuckles**, nearly straight, not from the
  fingertips; the hand stays relaxed and the chanter rests on a leg/table.
- Raise fingers **well clear** of the holes — small, mushy movements blur the change.
- Keep the *non-moving* hand completely still (in the early right-hand drills the
  left hand is frozen in the "Low A position").

We compute each drill's cue directly from the fingering diff between the two
notes (see `src/triads.ts`): holes that open → "snap up", holes that close →
"tap down", named by finger.

## How the drills are ordered

Roughly simplest-move-first, one hand before both:

1. **Bottom-hand moves** — the low notes (Low G, Low A, B, C, D), left hand still.
2. **Top-hand moves** — E, F, High G, High A.
3. **Two-handed / crossing moves** — changes that move both hands at once (e.g.
   the C→E hand-crossing) and wide leaps (Low A→High A).

Our Finger Gym follows this order but chooses its own set of pairs.

## Where it stops — and where we deliberately differ

The Manual then spends its bulk (its Sections 5–7) on embellishments —
gracenotes, doublings, half-doublings, strikes, slurs, shakes, the "tachum," cut
notes, taorluath, throw, grip, birl — **before** its tunes section (Section 8).

We keep the *drill method and the embellishment mechanics* but **not that
ordering**. A beginner should reach real tunes early and layer ornaments on
afterwards, tune by tune. This is also more faithful to the Manual's own stated
principles ("the simplest, most essential moves should be practiced first";
beginners "are anxious to work on tunes … and should"). See `PEDAGOGY.md`.

## One more pattern worth stealing: "Be ready for:"

Before each tune, the Manual lists exactly which skills/embellishments that tune
requires (e.g. for *I See Mull*: high-G gracenotes on F & E, half-doublings of
F & E, throw on D, doubling of E & B, slurs, birl, a timing change). We can put
the same prerequisite checklist on each tune stage, linking to the drills that
build each item.
