# Bagpipe Lab — pedagogy & design spine

This is the shared design document for how Bagpipe Lab actually *teaches*. It is
meant to be co-owned: I (Claude) draft it, and the project owner — a piper —
corrects the domain-specific parts. Every learning feature should trace back to
something in here.

Each claim below is tagged:
- **[principle]** — established learning-science; I'm confident.
- **[piping]** — established piping practice; reasonably confident but confirm.
- **[proposal]** — my design suggestion; needs the owner's judgement.
- **[needs owner]** — I can't source this well; the owner should fill it in.

Ground-truth facts (fingering, embellishment taxonomy) live in `reference/`.

---

## 1. What makes this app different

A book or video can *show* you piping. This app can *watch you do it* and
respond. Everything here orbits that one advantage: **a tight, specific feedback
loop on the two things that actually matter on a chanter — finger accuracy and
timing.** [principle]

Chanter pitch is deterministic (one fingering = one pitch, no embouchure), and
the tone is continuous (no tonguing). So the skills worth grading aren't pitch
or attack — they're *which fingers, in what order, exactly when.* The whole
product thesis follows from that. [piping]

---

## 2. Design principles

1. **Feedback must be immediate and specific.** Not "try again" but "your High-G
   gracenote was late" or "the C hole leaked." Generic feedback is nearly
   worthless for motor learning. [principle]
2. **Gate on mastery, not completion.** You advance by *demonstrating* a skill
   consistently (e.g. 3 clean runs in a row), never by clicking "next." [principle]
3. **Slow first, then a tempo ladder.** The core piping practice habit: start
   below performance tempo, and only let the metronome step up when the current
   tempo is clean. The app should automate this ladder. [piping][principle]
4. **Chunk everything.** Teach a tune as 2-bar phrases, master each, then chain
   them. Never present a whole tune as one wall. [principle]
5. **Interleave and space the weak spots.** Track each learner's shaky
   fingerings/movements and deliberately bring them back for review later, rather
   than drilling one thing to death in a single sitting. [principle]
6. **Introduce every embellishment as the solution to a problem the learner just
   felt.** The doubling isn't a flourish — it's the fix for two of the same note
   blurring together. Teach it the moment they hit that wall. [principle][piping]
7. **Separate the streams; combine them last.** Fingers, rhythm, blowing, and
   ornament are separate skills. Teach one axis at a time, then layer. (This is
   literally why the practice chanter exists before the pipes; apply the same
   logic *within* the chanter course.) [principle]
8. **Sing it before you play it.** Piping has its own vocal tradition
   (canntaireachd) for exactly this reason — hearing/voicing a phrase's rhythm
   before fingering it builds audiation and locks in timing. Almost no app uses
   this; it's a distinctive, authentic lever. [piping][proposal]
9. **Drill ornaments as isolated motor loops before they go in tunes** — slow,
   looped, hands-only. Musical context comes after the motor pattern is reliable.
   [principle]
10. **Error-driven micro-lessons.** When the scorer sees a *recurring specific*
    fault, surface a 30-second targeted drill for exactly that, instead of
    "practice more." [principle][proposal]
11. **Protect motivation with the right challenge.** Visible progress, small
    wins, and difficulty that tracks ability (flow, not frustration). [principle]

---

## 3. The learning spine (stages + mastery criteria)

Mirrors the six curriculum phases, but adds concrete *entry* and *mastery*
criteria so gating is real. Thresholds are **[proposal]** starting points to tune
against real learners.

| Stage | Teaches | Mastery criterion (to unlock next) |
|------|---------|-------------------------------------|
| 0 · Fundamentals | Hold, reed, steady blow, finger placement | Comprehension only (no scoring). Learner can name/seal each hole. |
| 1 · The nine notes | Each note's fingering, by recall | Produce the correct fingering for any prompted note, 8/9 without hint |
| 2 · The scale | Ascending/descending in time, clean transitions | 3 consecutive runs ≥ 90% finger accuracy at the slow tempo |
| 3 · Steady rhythm | Simple public-domain tunes, no ornaments | On one tune: ≥ 90% timing **and** finger accuracy at target tempo. **Gates ornaments.** |
| 4 · The doubling | First ornament, on repeated-note passages | Doubling lands in the right beat position 8/10 in a tune context |
| 5 · First tunes | Scale + doubling combined | Complete a short tune end-to-end above accuracy threshold |
| 6 · Progressive ornaments | Strike, grip, throw-on-D, taorluath, birl… | Each ornament gated on its own accuracy checkpoint, in a tune that needs it |

Free vs paid boundary (from CLAUDE.md): stages 0–3 free, 4–6 one-time unlock.

---

## 4. Embellishment curriculum

Two axes to teach on. The **finger pattern** (what the movement is) and — the
insight from the timing-tree chart in `reference/embellishments.md` — **where it
sits against the beat**:

- ends on the beat (borrows time from the note *before*)
- starts on the beat (borrows from the note *after*)
- across the beat (borrows from *both*)

That beat-relationship is the thing learners most often get wrong, and it's
directly visualisable in a falling-notes lane (does the movement resolve before /
on / across the beat line?). We should teach and score it explicitly, not just
the finger shape. [proposal]

**Introduction order — [needs owner].** Standard piping teaching roughly runs:
single gracenotes → doublings → half doubling → throw on D → grip → taorluath →
birl → strikes/catches → advanced. But the exact order, and *which tune*
introduces each, is the owner's call. Proposed first pass:

1. Doubling (the repeated-note fix) — *starts on the beat*
2. G / D / E single gracenotes
3. Throw on D — *across the beat*
4. Grip — *ends on the beat*
5. Taorluath — *ends on the beat*
6. Birl — *starts on the beat*

*(Owner: please reorder / correct, and name the tune context for each.)*

---

## 5. Common faults → targeted drills

The catalogue that powers principle #10. **[needs owner]** to make authoritative,
but a starting list:

| Fault | What it sounds/looks like | Drill |
|-------|---------------------------|-------|
| Unsealed hole | Squeal or wrong note on a specific note | Single-note hold; highlight the leaking hole |
| Crossing noise | Unwanted blip moving between two notes | Slow paired-note transition, both fingers move together |
| Wavering tone | Pitch/volume wobble | Sustained-tone steadiness drill (mic, later) |
| Rushing | Ahead of the beat | Metronome lock; tap-back before playing |
| Late gracenote | Ornament drags behind the beat | Isolated ornament loop, slow → up the ladder |
| Crushed doubling | Two gracenotes blur into one | Slow doubling loop with a visible gap |
| Collapsed birl | The birl "mushes" | Slow birl isolation (the classic hard one) |

*(Owner: add the faults you actually see most, and the fix you use for each.)*

---

## 6. Scoring model

For any timed exercise: [proposal]

- **Finger accuracy** — did the fingering hit the correct hole-state for each
  note, in order? (deterministic; we always know the target)
- **Timing accuracy** — onset deviation from the expected beat position, graded
  by a tightening window as tempo/level rises.
- **Ornament placement** — for movements, did it resolve in the correct
  beat-relationship (before/on/across)?
- Combine into a per-run score; mastery threshold (§3) gates progression; the
  tempo ladder (principle #3) auto-advances on mastery.

Input evolution: tap/metronome-sync first → **mic-based onset detection** later
(already in the CLAUDE.md roadmap) so scoring reflects real playing, not screen
taps. Onset detection (when a note attacks) is more tractable than pitch
detection, and we don't need pitch — the fingering already tells us the note.

---

## 7. Open questions for the owner

1. Does the GHB practice chanter play **High A** exactly as the smallpipe chart
   shows (top ring back down, low hand covered)? (Last open fingering item.)
2. **Embellishment order** and the **tune** you'd use to introduce each (§4).
3. The **first tune** you'd put in front of a total beginner for stage 3, and
   why that one. (Public-domain only.)
4. The **faults** you see most and your go-to fix for each (§5).
5. When *you* learned — what finally made it click, and what did the books/apps
   get wrong? (The stuff no source has.)

---

*Living document. Corrections from the owner override anything here.*
