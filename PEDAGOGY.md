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

### 3a. The Finger Gym (transition drills)

Between the scale (stage 2) and tunes (stage 3) sits a layer of **note-to-note
transition drills** — one finger move at a time, looped slowly until crisp. This
is the transferable core of Bogart's paper tutor (see
`reference/triad-method.md`): clean piping is mostly clean transitions, so
isolate each move before stringing them into tunes. [piping][principle]

Two things carry over from that method and are worth keeping:
- **The TAP/SNAP movement vocabulary** — to a lower note you *tap* the finger(s)
  down; to a higher note you *snap* them up, well clear of the holes. We surface
  this as a per-note cue during the drill, generated from the fingering diff.
- **Ordering: simplest move first** — bottom-hand moves, then top-hand, then the
  two-handed crossings and leaps.

Built as `src/triads.ts` (`TRIADS`), drilled through the existing rhythm lane and
tempo ladder. This realises principles #7 (separate streams) and #9/#10 (isolated
motor loops, targeted drills) for plain fingering, not just ornaments.

We deliberately **do not** copy the tutor's ordering, which front-loads esoteric
embellishments before tunes — that contradicts §4 (and the tutor's own stated
"simplest first" principle). We take the drill *method*, not the sequence.

---

## 4. Embellishment curriculum

**The owner's core directive (2026-07-12): tunes first, ornaments layered on
later.** Many tutors introduce embellishments too early. Better sequence:

1. Learn a tune **plain** — melody and rhythm solid, no ornaments at all.
2. Add **simple single grace notes** to that same tune.
3. Then introduce **increasingly complex embellishments**, one at a time, onto
   tunes the learner already knows.

So ornaments are never taught in the abstract or up front — they're added to a
tune that's already in the hands. [piping][owner]

Two axes to teach each ornament on: the **finger pattern** (what the movement
is) and — the insight from the timing-tree chart in `reference/embellishments.md`
— **where it sits against the beat**:

- ends on the beat (borrows time from the note *before*)
- starts on the beat (borrows from the note *after*)
- across the beat (borrows from *both*)

That beat-relationship is the thing learners most often get wrong, and it's
directly visualisable in a falling-notes lane (does the movement resolve before /
on / across the beat line?). Teach and score it explicitly, not just the finger
shape. [proposal]

### First tune: Amazing Grace [owner]

Public-domain (Newton's 1779 words; the "New Britain" melody, 1830s). It's the
vehicle for the first ornaments, taught in this order **on the tune**:

1. Plain melody — steady rhythm, no ornaments (this is the stage-3 checkpoint).
2. **High G grace notes**
3. **D strike**
4. **Light D throw** — *across the beat*
5. **G catch** — *ends on the beat*

Later tunes introduce the heavier movements (grip, taorluath, birl, etc.) the
same way — layered onto a known melody. Exact ordering for those is still
**[needs owner]**.

**"Be ready for:" tune prerequisites [proposal].** Borrowed from the paper
tutor: each tune stage should open with a short checklist of exactly which
skills/embellishments it needs, each linking to the drill (Finger Gym item or
ornament) that builds it. Turns a tune into a visible set of prerequisites rather
than a wall.

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

**Answered (2026-07-12):**
- ✅ High A on the GHB practice chanter matches the chart (top ring back down,
  low hand covered). Fingering grid is final.
- ✅ First tune: **Amazing Grace** (public-domain — see §4).
- ✅ Ornament philosophy: tunes plain first, then simple grace notes, then more
  complex — layered onto known tunes (§4). First ornaments on Amazing Grace:
  high-G grace notes → D strike → light D throw → G catch.

**Still open:**
1. The exact **pipe setting of Amazing Grace** — note-for-note melody and
   rhythm. The chanter's lowest note is Low G (one step under the Low-A tonic),
   so the usual "low" pickup has to be adapted; that arrangement choice is
   yours. Paste a setting you like, or confirm the one I propose.
2. **Ordering of the heavier movements** (grip, taorluath, birl…) and which
   later tunes introduce them.
3. The **faults** you see most and your go-to fix for each (§5).
4. When *you* learned — what finally made it click, and what did the books/apps
   get wrong? (The stuff no source has.)

---

*Living document. Corrections from the owner override anything here.*
