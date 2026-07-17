# Bagpipe Lab — UX & pedagogy review (2026-07-16)

A multi-perspective review of the app as it stood on 2026-07-16. Method: four
learner/expert lenses. Two ran as independent Sonnet subagents that drove the
live app and read the source (**Cold-start beginner**, **Skeptical pipe-major**);
two were role-played on the main thread after the other agents hit a session
limit (**Impatient learner**, **Musician new to pipes**), plus an **audio/timing**
pass (dimensions the agents can't hear/feel). Findings converged cleanly.

## Verdict

Foundations are strong — a domain expert signed off on accuracy, and the Guide's
teach-then-practise structure works. Friction is concentrated in **one place**
(the notation block) plus a few small defects. Polish-and-resequence, not rebuild.

## P0 — The "Reading the music" block (Guide stages 8–10)

**Three of four lenses broke here.** Beginner called it the most likely quit
point; the impatient learner would bail at stage 8; the musician found it
redundant. It introduces ~18 undefined terms (clef, key signature, accidental,
ledger line, quarter/eighth/dotted note, 2/4, 6/8, strathspey, reel, retreat
march…) in ~25 minutes, before the learner has felt a single beat, and the
tune-genre words are never reused.

Fixes:
1. **Resequence** the block to *after* "Steady rhythm" (stage 13), so "beat" and
   "time signature" land on rhythm already felt in the hands.
2. **Cut** the tune-genre vocabulary (jig/reel/strathspey/waltz/retreat), or defer
   to a later optional aside.
3. **Define primitives before use** (what a staff is) or lean on the diagram,
   which already does the teaching.
4. **Add an "already read music?" fast-path** collapsing stages 8 & 10, keeping
   the pipe-specific staff positions (stage 9).

## P1 — Quick wins (done 2026-07-16 unless noted)

- **Strip developer-speak from user-facing copy.** "Doubling of B (draft) —
  pending the owner's check" and Amazing Grace's "(working draft…)" read like a
  bug to a learner. Reworded to learner-facing language (kept an honest
  "provisional" note on the doubling, per the pipe-major's point about not
  presenting unconfirmed technique as settled). ✅ applied
- **`FINGER_NAMES[7]` `'pinky'` → `'bottom pinky'`** in `src/triads.ts` — on the
  D↔E cue "top ring and pinky" could imply a nonexistent "top pinky." ✅ applied
- **Grace drills show only the principal's fingering,** never the grace flick
  shape — flash the grace fingering on the diagram during the flam. ⏳ deferred
  (slightly larger change to the lane render loop).

## P1 — First-tune reachability & motivation

- **First tune is stage 15 of 17** — too far for an impatient learner. Add a
  prominent early "play a tune now" signpost (the Play tab already lists Amazing
  Grace) or bring a simple recognizable melody forward. No early quick win today
  ("Steady Low A" = 8 beats on one note).
- **Mastery curve may feel stuck.** Tempo ladder needs 85%, but a "Good" hit
  scores 0.5, so an all-Good run is 50% — you need mostly Perfect to advance.
  Reconsider the weighting.

## P2 — Owner-verify / human-test-only

- **Doubling of B:** the pipe-major suspects a **C** gracenote where the draft
  uses **D**. Genuinely uncertain — keep provisional until confirmed.
- **Tuning:** A440 vs a real chanter's ~480 Hz is human-test-only. Nice detail:
  the synthesized C/F are already the authentically-sharp values; consider a
  "C and F sound naturally sharp" aside in stage 8 for credibility.
- **Grace audio** lands the principal a hair late — polish, human-test-only.

## Verified strengths — protect these

- **Fingering is correct** (expert-signed-off), incl. C/D pinky-planted and the
  D→E "crossing the break."
- **Staff positions are correct** — resolved the pipe-major's one doubt: it's
  standard treble clef (Low G on the G line = 2nd line), so `src/staff.ts` is right.
- **Gracenote mechanics are textbook**; the **draft-flagging discipline** is good.
- **Guide→tool CTA handoff, chunking, and stage 16's problem-first framing** all
  drew explicit praise.

## Single highest-impact change

Resequence/gut the "Reading the music" block (P0). It damages first-time-learner
confidence more than everything else combined.
