# Bagpipe Lab — pedagogy review (2026-07-26)

Lens: music educator (skill-acquisition evidence) + pipe major (how pipers are
actually taught). Method: read `PEDAGOGY.md`, `src/curriculum.tsx`,
`src/content.tsx`, `src/chanter.ts`, `src/tunes.ts`, `src/triads.ts`,
`src/ornaments.ts`, `src/rhythmEngine.ts`, `src/RhythmLane.tsx`,
`src/StaffPlayer.tsx`, `src/TheScale.tsx`, `src/MeetTheChanter.tsx`,
`src/staff.ts`, and all four files in `reference/`; then drove the live app with
Playwright at 390×844 — walked all 17 Guide stages, played scored runs, ran
Finger Gym and gracenote drills, and inspected the staff render.

Builds on `reference/ux-review-2026-07.md`; I do not re-litigate its findings.
Two of its items are **still unfixed** and reappear below with new evidence
(grace-flick fingering never shown; first tune at stage 15/17). Its P0
resequence is done and the new order is better.

Screenshots: `…/scratchpad/review/shots/pedagogy/`.

---

## Verdict

**As a music educator: strong bones, thin muscle.** The design *document* is
genuinely good — `PEDAGOGY.md` names the right principles (mastery gating,
tempo laddering, chunking, interleaving, problem-first ornaments, audiation,
error-driven micro-drills) and the Guide's stage-card structure — concept →
CTA into a preconfigured tool → checklist → mastery statement — is a textbook
scaffold-and-fade pattern. But of the eleven principles in §2, roughly **three
are actually implemented**. Feedback is not "immediate and specific," it's a
percentage. Mastery gating is an honour-system checkbox on 15 of 17 stages.
Interleaving and spaced review do not exist in any form. Singing before playing
does not exist. Error-driven micro-drills do not exist. The app currently
implements *one* of the two things §1 says the whole product is for — timing —
and does not implement finger accuracy at all, on any surface.

**As a pipe major: the sequence is defensible and the accuracy is unusually
good — but the app is training a metronome habit, not a chanter habit, and it
says "Mastered" about a skill it has never observed.** The fingering table is
right, the staff positions are right, the gracenote mechanics are described
correctly, and the discipline about not guessing piping specifics is better than
most commercial apps. What's missing is what I'd actually spend a first-year
student's lesson time on: steady blowing (one stage, never revisited, never
checked), tone, note *length* rather than note onset, pointed rhythm (every
single exercise in the app is even beats — pipe music barely contains any), and
crossing noise. And I'd take issue with one structural thing the app does
constantly: it sounds repeated notes as separate re-attacks, which is the one
sound a chanter cannot make. See P0-5 — it's fixable and the fix is the best
teaching moment in the app.

**Where the two hats disagree:** the educator says "get them to a tune fast,
motivation is the binding constraint" and supports the owner's plain-tunes-first
call. The pipe major says "a plain tune is, on this instrument, often not a
playable object." Both are right, and the resolution is in the next section.

---

## Sequence assessment

The current path (verified in-app):

| # | Phase | Stage | Verdict |
|---|-------|-------|---------|
| 1–3 | Meet the instrument | How this course works · chanter · reed | Right. The reed lesson correctly plants "it never stops sounding" as the seed for gracenotes — this is the single best-sequenced idea in the course. |
| 4 | Meet the instrument | **Blowing steadily** | **Out of order.** Its checklist opens "Cover every hole and blow softly" — that is a Low G, and *how* to cover a hole (pads, sealing, left hand on top) is taught in stages 5 and 6. Swap 4 with 5–6. |
| 5–6 | Meet the instrument | Holding · Finger placement | Right, but should precede blowing. |
| 7 | The nine notes | Learn the nine notes | Right slot, wrong tool. See P2-16 — the tool is recognition-only and cannot support the stage's own mastery criterion. |
| 8 | Play in time | The scale, in time | **Too hard for its slot.** Nine different notes, one per beat, scored. |
| 9 | Play in time | Finger gym | Right idea, right place. Internal ordering is slightly off (P1-15). |
| 10 | Play in time | Steady rhythm (`steady-low-a`, `a-b-alternate`) | **Out of order.** These are the two *easiest* scored exercises in the app — one note, then two — and they sit after a full nine-note scale and after the D↔E crossing. Difficulty across 8→9→10 goes hard → medium → easy. Move stage 10 before stage 8. |
| 11–13 | Reading the music | notation-why · staff · rhythm | The prior review's P0 resequence landed and it reads much better. Remaining problem: stage 13 teaches quarter/eighth/half/dotted **note shapes**, and the app's own staff renders every note as an identical filled oval (P2-17). The learner is taught to read something the app will never show them. |
| 14 | Your first tunes | Read while you play | Good. |
| 15 | Your first tunes | **Your first tune** | Still stage 15 of 17 (prior review P1, unfixed). Nothing before it is a *tune*. Also: the encoded melody has problems — see "Instructional accuracy". |
| 16 | Your first ornaments | Your first grace note | **The best-framed stage in the app.** Problem-first, mechanically correct, correct first ornament. |
| 17 | Onto the pipes | From chanter to pipes | Fine as a preview, but the readiness claim is loose: "when your fingering is clean and your rhythm is steady … ready to carry it all across." No piper goes to the pipes on fingering alone; the gate is months of steady blowing plus, usually, a teacher's say-so, and normally via a bag/goose/blowpipe stage the app never mentions. |

**What's structurally missing from the sequence**, in order of how much a real
teacher would care:

- **Steady blowing appears once, at stage 4, and never returns.** It is the
  dominant fault for the first year and the thing that most separates a piper
  from someone with fast fingers. There is no recurring blowing thread, no tone
  check, no long-note discipline after stage 4.
- **No pointed/dotted rhythm anywhere.** All 22 exercises are isochronous
  (`beats: 1` throughout, except Amazing Grace's 2s and 3s). Pipe music is
  built on dotted-quaver/semiquaver "pointing"; a 2/4 march played evenly is
  not a march. The learner reaches stage 15 having only ever felt a flat pulse.
- **One tune.** Retention and transfer research is unambiguous that variety in
  the same skill beats repetition of one exemplar; and a piper with one tune has
  no repertoire.
- **No practice-session structure at all.** Nothing on session length, how often,
  warm-up, or what a 20-minute session should contain. The stage "time" chips
  ("Daily, 10 min") are the entire treatment.

---

## The plain-tunes-first decision

The owner's directive (`PEDAGOGY.md` §4): **plain tune → simple gracenotes on
that tune → heavier movements layered on tunes already known**, in deliberate
departure from the tutor-book lineage (Logan's, College of Piping, Bogart) which
drills gracenotes and doublings before tunes.

**My genuine opinion: the owner is 80% right, and the 20% is load-bearing.**

**Where the owner is right, strongly.**
1. The traditional sequence's failure mode is real and well-documented in
   general motor learning: extended blocked practice on context-free movements
   produces good in-session performance and poor retention and transfer, plus a
   motivational cliff. Bogart's own book concedes the point — beginners "are
   anxious to work on tunes … and should" — and then spends three sections
   contradicting it (`reference/triad-method.md`). Front-loaded taorluath
   drilling is the single most common reason adult beginners quit.
2. Ornaments are *additive*. A gracenote does not move the melody note; the
   principal stays on its beat. So unlike, say, a wrong guitar fingering,
   there is very little that has to be *un*learned when you add one later.
   This substantially weakens the classic "bad habits" objection.
3. Ornament-as-solution-to-a-felt-problem is better than any tutor book I know.
   Introducing the high-G gracenote at the moment repeated notes blur is exactly
   right, and stage 16 nails it.

**Where it breaks, and this is not a small point.**

On a chanter, **a plain melody containing repeated notes is not a playable
object.** If the tune has two Bs in a row, there is no "plain" version — you
either play one long B (a different tune) or you play the gracenote. So "learn
it plain first" is coherent only if one of these holds:
- the tune is chosen to have **no repeated notes** (very restrictive), or
- the app states an explicit convention: *"where the melody repeats a note, hold
  it as one long note for now — the next stage gives you the tool to break it."*

The app currently does neither. `steady-low-a` (eight repeated Low As) and
`orn-hg-b` (eight Bs, each articulated) are the same exercise before and after
the fix, and the app never connects them or explains that the first one is
literally unplayable as it sounds. It's sitting on its own best teaching moment
and not using it.

There is also a **specific fault this ordering creates**, which the owner should
build against rather than deny: learners who play plain for a long stretch tend
to acquire a "gracenote is a decoration I squeeze in" model, and the
characteristic error is **stealing time from the melody note** — playing the
principal late to make room. That is exactly what the app's own audio currently
models (P1-7: the principal lands 45 ms after the beat). The mitigation is
cheap and should be designed in now: always score the *principal's* onset, never
the ornament's, and teach in one sentence that the gracenote is taken from the
note *before* and the melody note does not move — which is precisely the
"ends on / starts on / across the beat" framing already sitting in
`reference/embellishments.md` and not yet used anywhere in the product.

**My recommendation — a small amendment, not a reversal.** Keep plain-first for
everything heavy (doublings, strikes, throws, grips, taorluath, birl); that
departure is well-judged and is the app's best pedagogical differentiator.
But move the **high-G gracenote alongside the first tune rather than after it**
(stages 15 and 16 become one stage, or 16 is folded into 15's second session).
Rationale: the first tune will need it, and a gracenote learned as "the thing
that makes this tune playable" is retained far better than one learned as
"decoration for a tune I already finished." That is also what most working
teachers actually do, as distinct from what the books print.

---

## Practice-design findings

### P0

**P0-1 · Feedback is a score, not a diagnosis. The diagnostic information is
computed and thrown away.**
Evidence: `src/RhythmLane.tsx:137-146` computes `bestDelta` per tap and
immediately discards the **sign** (`Math.abs`). The end-of-run panel
(`:391-399`) says only `"19% this run. Aim for 85% to move the tempo up."`
— screenshot `03-play-result-sloppy.png`. `PEDAGOGY.md` §2.1 promises the exact
opposite: *"Not 'try again' but 'your High-G gracenote was late'."*
Worse, a badly **rushing** learner gets no signal at all: taps more than
`GOOD_MS + 60` = 260 ms early are silently dropped as "stray tap" (`:145`) and
the note then times out as a miss. Rushing is the most common beginner timing
fault and the app is structurally blind to it.
Fix: keep the signed delta; report mean signed offset and its spread —
"You were on average 78 ms **late**, and drifting later" / "You rushed 5 of 8."
Two numbers, one line of copy, and it converts the whole tool from a game into
deliberate practice. This is the highest-value change in the review.

**P0-2 · The mastery gate is an honour-system checkbox on 15 of 17 stages, and
the two real gates measure a proxy.**
Evidence: `src/App.tsx:272-274` — every stage advances via `Mark this stage
done`. Only `scale-in-time` and `steady-rhythm` reference the 85% gate, and that
gate measures screen-tap timing. `PEDAGOGY.md` §2.2 ("never by clicking 'next'")
and §3's per-stage criteria (e.g. stage 1: "correct fingering for any prompted
note, 8/9 without hint") are unimplemented.
Fix: implement the stage-1/stage-7 gate — it needs no mic, just a quiz mode in
Explore (P2-16). For everything genuinely unobservable (blowing, sealing), keep
the checkbox but *say* it's self-assessed; don't dress self-report as mastery.

**P0-3 · The timing standard gets *looser* as the tempo ladder climbs.**
Evidence: `src/RhythmLane.tsx:30-32` — `PERFECT_MS = 100`, `GOOD_MS = 200`,
fixed in milliseconds. At 60 bpm, ±100 ms is ±10% of a beat; at 120 bpm it is
±20%. So the ladder rewards you with a *lower* rhythmic standard for going
faster. `PEDAGOGY.md` §6 explicitly specifies the opposite ("graded by a
tightening window as tempo/level rises"), and it is also just wrong musically —
real playing demands proportionally tighter placement at speed.
Fix: make the windows a fraction of the beat (≈12% perfect / 22% good), with an
absolute floor around 60/110 ms so it never becomes superhuman.

**P0-4 · The scored mode cannot go slower, and cannot step back down.**
Evidence: `RhythmLane.tsx` has no tempo control at all — `bpm` changes only via
`stepUpTempo()` (`:331-339`) or an exercise change (`:71-80`). `StaffPlayer` has
a ± stepper; the *scored* surface does not. So the learner can never practise
below the exercise's authored tempo (50–60 bpm), and once stepped up to a tempo
they can't hold, they are stuck there until they switch exercises.
"Slow first, then a ladder" is `PEDAGOGY.md` §2.3 and the single most important
practice habit in piping; the tool that scores you enforces only the "then" half.
Fix: add the same ± stepper to `RhythmLane` (down to ~40 bpm), and auto-step
*down* one rung after two consecutive sub-threshold runs.

**P0-5 · Repeated notes are sounded as separate re-attacks — the one sound a
chanter cannot make.**
Evidence: `src/tunes.ts:70-76` (`steady-low-a`: eight discrete Low As) played
through `playChanterNote` (`chanter.ts:45-70`), each with its own attack
envelope. The app's own `Reed()` lesson (`content.tsx:91-97`) correctly teaches
that the instrument never stops sounding. A learner following stage 10's
instruction with a chanter in hand hears one continuous eight-beat note and the
app hears eight; nothing reconciles that.
Fix (and this is an *opportunity*, not just a bug): sustain the tone across
repeated notes in audio, and add one line to `steady-low-a`:
*"On your chanter this is one long note — you can't break it. That's the problem
grace notes solve, in a few stages' time."* Then make stage 16 explicitly the
callback. That single edit turns the app's biggest internal contradiction into
its strongest problem-first moment, and it is the missing piece of the
plain-tunes-first argument above.

### P1

**P1-6 · One lucky run advances you.** `RhythmLane.tsx:311` — `mastered` is
computed from the single run just finished. `PEDAGOGY.md` §3 specifies "3
consecutive runs ≥ 90%". Fix: require 2–3 in a row; it is a counter and it
matches the doc.

**P1-7 · The gracenote's principal lands after the beat.**
`chanter.ts:110-115` schedules graces at `t0` and the principal at
`t0 + n·GRACE_S` — so the melody note is 45 ms late relative to the tap that was
just judged. In piping the gracenote is taken from the *preceding* note; the
principal is on the beat. As shipped, the app's ear-model teaches the exact
fault that plain-first learners are most prone to (see above).
Fix: schedule graces *before* the target (`t0 − n·GRACE_S`), which the
rhythm engine already has the timeline to support.

**P1-8 · Gracenote drills never show the flick.** Screenshot
`05-grace-hg-b-midplay.png`: side panel reads `B` + `grace: High G`, and the
diagram shows B's fingering only, throughout. The app tells the learner in prose
that it's "a quick lift of the top-hand index" and then never shows that shape.
For a motor skill this is the one thing worth showing. (Prior review P1,
deferred, still open.)

**P1-9 · Practice is 100% blocked; there is no interleaving and no spaced
review.** Every exercise is *n* reps of one thing; nothing ever brings back
earlier material. `PEDAGOGY.md` §2.5 calls for exactly this and none of it
exists. The data is already there — `bagpipe-lab-best` stores a best-% per
exercise id (`RhythmLane.tsx:38, 316-329`).
Fix: a "Warm-up mix" exercise that concatenates 4–6 previously-attempted drills
in random order, plus a "shaky moves" shelf listing the three lowest-best drills.
Both are pure data-layer work over what's already stored.

**P1-10 · No pointed rhythm.** All exercises are even. Add at least one
dot-cut/2-4-march-feel pattern before stage 15; the `beats` field already
supports fractional values.

**P1-11 · Difficulty is non-monotonic across stages 8–10.** See table above.
Move `steady-low-a` / `a-b-alternate` ahead of the scale.

**P1-12 · Stage 4's checklist depends on stages 5–6.** See table above.

**P1-13 · The Finger Gym cue is accurate and unusable in real time.**
Live capture, D↔E at 54 bpm: *"Snap up your top ring and bottom pinky, and tap
down your bottom index, bottom middle, and bottom ring."* — 15 words, five
fingers, one beat. Correct per `chanter.ts`, unreadable while playing, and it
buries the actual teaching point, which is that all five move **together** (this
is "crossing the break", the classic source of crossing noise).
Fix: chunk by hand, the way a teacher says it — *"D → E: bottom hand **down**,
top ring **up** — all at once."* Keep the finger-by-finger enumeration as
secondary text.

**P1-14 · Amazing Grace's pickup is barred as a downbeat, so the metronome
accents the wrong syllable.** `rhythmEngine.ts:49` starts the first note at
`beat = beatsPerBar` and `:69-72` accents every `beatsPerBar`-th beat, so the
pickup Low A gets the bar accent. Confirmed in the render: first notehead at
x=40 and first barline at x=40 (`07-amazing-grace-staff.png`). The learner is
drilled to stress "**A**-mazing" instead of "A-**MA**-zing" for the whole tune.
Fix: add an optional `pickupBeats` to `Exercise` and offset the bar grid by it.

**P1-15 · Finger Gym order.** `triads.ts:76-91` starts at Low A↔B and puts
Low G↔Low A fifth. Low G↔Low A is a single pinky move — the simplest change on
the instrument — and Low A↔D (three fingers) currently precedes it. Reorder:
Low G↔Low A → Low A↔B → B↔C → C↔D → Low A↔D → top hand → crossings.

### P2

**P2-16 · Explore notes is recognition-only.** `MeetTheChanter.tsx` — tap a
name, see the fingering. There is no retrieval direction (show a fingering →
name the note; name a note → set it → reveal), no random prompting, no scoring.
Stage 7's checklist asks the learner to self-test *"set the fingering before you
tap to check"* — but the answer is always on screen, so it can't be hidden.
Retrieval practice is the highest-yield, lowest-cost intervention in the entire
learning literature and this is the one screen where it's free to add.

**P2-17 · The staff render omits everything the notation stages teach.**
`StaffPlayer.tsx` / `StaffDiagram.tsx` draw no clef, no time signature, no key
signature, and one notehead shape for all durations
(`07-amazing-grace-staff.png` — the 2-beat D and 1-beat F are visually
identical). Stage 11 teaches "at the far left is a clef"; stage 13 teaches
quarter/eighth/half/dotted shapes; stage 12 sends the learner to a staff that has
none of it. At minimum draw a clef and a time signature (static SVG, ~20 lines)
and distinguish note shapes; otherwise cut the corresponding teaching claims.

**P2-18 · Lane lookahead is fixed in ms, not beats.** `APPROACH_MS = 2000`
(`RhythmLane.tsx:29`) means you read 1.7 beats ahead at 50 bpm and 4 beats ahead
at 120 — reading-ahead distance changes as you ladder up. Make it beats.

**P2-19 · `Best %` never decays** and is stored forever, so a fluke run
permanently mislabels a drill as mastered.

**P2-20 · No practice-session guidance, warm-up, or "see a teacher" advice.**
See next section.

---

## Transfer to the real instrument

Being honest about this matters more than usual, because the app makes explicit
claims ("Mastered at 60 bpm") about a skill it has never observed.

**What tapping genuinely does train** — and this is more than it might look:
- **Pulse entrainment and beat anticipation.** Tapping to a metronome with a
  visual lead-in trains anticipatory timing, and that does transfer to
  instrumental onset placement.
- **Sequence memory.** Knowing *which note comes next* without thinking is a
  real prerequisite that the lane rehearses every run.
- **Note-name ↔ staff-position ↔ sound** mapping (Read mode). Fully transferable.
- **The tempo-ladder habit itself** — slow-then-up is a discipline, and having a
  tool enforce it builds a practice behaviour that outlives the app.
- One structural point in the app's favour: on a chanter, rhythm *is* onset
  placement, because the sound never stops and a "note" is defined by when the
  fingering changes. So onset-only scoring — which would be a real limitation on
  a piano — is close to the right model here. Protect that framing; it's the
  strongest part of the product thesis.

**What it cannot train, at all:**
- **Sealing.** The number-one beginner fault, per the app's own `FingerPlacement`
  lesson. Untouched by a screen tap.
- **Finger height and economy**; **simultaneity of multi-finger moves.** The
  D↔E crossing (five fingers, together) and Low A↔B (one finger) are scored by
  the identical single tap. The Finger Gym is, from the scorer's point of view,
  eleven copies of the same exercise.
- **Crossing noise** — the thing the Finger Gym exists to prevent — is
  unobservable and unmentioned in-app.
- **Blowing steadiness and tone.** Stage 4 only, no check, never revisited.
- **Gracenote crispness and duration.** The lane scores the tap; whether the
  flick was clean, or a smear, or a full extra note, is invisible.
- **Note length.** The lane displays onsets only; a 3-beat note and a 1-beat note
  look identical falling. So the learner cannot see the shape of a rhythm, only
  its attack points.

**Does the app mislead the learner about their own progress?** Somewhat, yes —
and it's fixable with copy, not code. `"Mastered at 60 bpm"` and
`"Done when you can play the scale cleanly at 85% or better"` are claims about
*playing*; the evidence is *tapping*. A learner can be "mastered" on D↔E at
120 bpm and be unable to make the crossing cleanly at 60. Mic onset detection is
already the documented answer and I'm not re-proposing it — but until it lands,
the wording should be honest:
- `"Mastered at 60 bpm"` → **"Timing clean at 60 bpm"**.
- One standing line in Feel mode: *"This scores your timing, not your fingers.
  Play along on your chanter and check the diagram matches your hands."*
That costs nothing and buys the credibility the app will need with real pipers.

---

## Instructional accuracy issues

### Confident this is wrong

1. **"No sharps or flats" is misleading about real pipe scores.**
   `content.tsx:246-249` and stage 11's concept say pipe music has no sharps or
   flats and that "the extra symbols other instruments use … never appear here."
   Published GHB music is conventionally written with a **two-sharp key signature
   (F♯, C♯)**. The learner's *behaviour* is unaffected — there are no accidentals
   to act on — but the first real tune book they open will contradict the app on
   sight. Reword to: "you'll see two sharps at the start of the line; they're
   already built into the chanter, so there is nothing for you to do about them —
   and no accidentals ever appear inside the tune."
   *(Asserted from memory — see final section.)*

2. **"The chanter's entire range is Low G up to High A — under two octaves"**
   (`content.tsx:254-257`). It is a ninth: one octave plus one note. "Under two
   octaves" is technically true and badly misleading in a lesson whose whole
   point is how *small* the range is. Say "an octave and one note — nine notes,
   that's the lot."

3. **The staff render contradicts the notation lessons** (P2-17): clef, time
   signature and note-value shapes are taught and never drawn.

4. **Gracenote audio places the principal after the beat** (P1-7).

5. **Timing windows loosen as tempo rises** (P0-3) — directly contradicts
   `PEDAGOGY.md` §6.

6. **`reference/embellishments.md` and `src/ornaments.ts` disagree about Low G.**
   The reference says the high-G gracenote is "valid on Low A, B, C, D, E, F
   (and Low G)"; `ornaments.ts:26` sets `HG_PRINCIPALS` without Low G. The
   G gracenote on Low G is extremely common. Add the drill or correct the doc.

7. **Amazing Grace: pickup barred as a downbeat** (P1-14) — structural, verified
   in the render, independent of any question about the melody itself.

8. **`reference/triad-method.md` and `content.tsx` give opposite finger-height
   advice, and the app surfaces both.** `triad-method.md:44-46`: "Raise fingers
   **well clear** of the holes — small, mushy movements blur the change," and
   "lift/extend the finger(s) cleanly and well off the chanter." `content.tsx:213-217`:
   "don't fling it high into the air. Lift it just a small amount — around half
   an inch … Close, controlled fingers are fast fingers." A learner reads the
   second in the Guide and is coached by the first (via the SNAP cue vocabulary)
   in the Finger Gym. One of these has to give; my own view is that the
   close-fingers advice in `content.tsx` reflects mainstream modern teaching and
   the "well clear" phrasing is an older emphasis that should be softened to
   "clear of the hole, not high off the chanter" — but this is the owner's call
   and it is currently an unresolved contradiction shipping in the product.

### Disagreement to check (I am not asserting an error)

- **Doubling of B — the interior gracenote.** The draft uses **D**
  (`ornaments.ts:52-64`: High G → B → D → B). The prior review's pipe-major lens
  suspected **C**. My recollection leans toward the draft being *right* — that
  the doublings on Low A, B and C all take a high-G gracenote followed by a
  **D** gracenote. So I disagree with the previous reviewer. **Neither of us
  should be trusted here; the owner should settle it**, and the "provisional"
  label should stay until they do. That the app is honest about this is a
  strength worth keeping.
- **High A fingering** — verified by the owner and marked final in
  `reference/fingering-chart.md`. No disagreement; noting only that it remains
  the one fingering that surprises people, so it is the right one to have
  double-sourced.
- **Staff positions** — Low G on the 2nd line, High G in the space above the
  staff, High A on one ledger line. That is plain treble clef and I agree with
  it; the prior review already resolved the doubt. No change needed.
- **Amazing Grace melody.** The encoded setting (`tunes.ts:30-66`) reads to me as
  a plausible-sounding but non-standard version — in particular it states the
  same two-bar figure twice at the opening where the standard tune has
  "tonic-third-tonic | fifth-fourth", and it never returns to the tonic inside
  the first phrase. I would not change a note on my say-so; it is flagged DRAFT
  in the code comment but the user-facing name and description no longer say so
  (the prior review's P1 copy cleanup removed it), so **the app now presents an
  unverified melody as "Your first tune" with no caveat**. Either finish the
  transcription with the owner or restore an honest note. Teaching a beginner a
  wrong version of the most recognisable tune in piping is the one unlearning
  cost that actually is expensive.

---

## What a real teacher would add — ranked by impact

1. **Make blowing a recurring, checked thread, not a stage-4 read.** Even without
   a mic: a long-note timer (hold Low A for a slow 8, then 12, then 16), placed
   as a *warm-up* item that recurs at the top of every practice session, plus a
   self-report tick. This is the difference between a piper and a person with
   fast fingers, and right now it occupies 1/17th of the course and is never
   mentioned again.
2. **Say it before you play it.** `PEDAGOGY.md` §2.8 (canntaireachd/audiation) is
   entirely unbuilt and is the app's most distinctive available lever. Cheapest
   possible version, no audio work required: add a step to every tune and drill
   stage — *"Play it once with the sound on and just listen. Then count or sing
   it out loud with the metronome. Then play."* Audiation-before-execution is
   one of the best-supported interventions in music pedagogy and costs three
   lines of copy.
3. **Give the learner a diagnosis, not a score** (P0-1). Early/late plus a
   per-note breakdown. Highest ratio of value to effort in the codebase.
4. **Practice-session structure.** One short stage: what 20 minutes looks like
   (long notes → scale → one gym drill → tune work → finish on something you can
   already play), little-and-often beats one long session, and stop before
   frustration. Every teacher's first-lesson speech; the app has none of it.
5. **Pointed rhythm before the first tune** (P1-10).
6. **Spaced review / warm-up mix** (P1-9) — the stored data already supports it.
7. **"Be ready for:" prerequisites on tunes.** Already designed in
   `PEDAGOGY.md` §4 and `triad-method.md`, unbuilt. Turns a tune from a wall
   into a checklist and gives the Finger Gym a *reason*.
8. **A retrieval mode in Explore** (P2-16), which also makes stage 7's stated
   mastery criterion real.
9. **Two more tunes.** One tune is not a repertoire, and variety is what makes
   the underlying skill stick.
10. **Say when to find a human.** One honest paragraph: a teacher or pipe band
    catches blowing, hand position, tone and crossing noise that no app can hear
    yet; find one when you can play a tune through. This *increases* trust rather
    than costing users — and it is what a pipe major will look for first when
    judging whether this app is serious.

---

## Claims asserted from memory — please verify

These are piping/notation facts I am stating without a source in this session
(outbound piping sites are blocked). None of them should be acted on until the
owner, a real piper, confirms:

1. **Published GHB music conventionally carries a two-sharp key signature
   (F♯, C♯).** High confidence, but it is the basis of accuracy issue #1.
2. **A single gracenote is taken from the time of the *preceding* note; the
   melody note it decorates lands on the beat.** High confidence; basis of P1-7
   and part of the plain-first argument. Consistent with the "ends on the beat"
   category already in `reference/embellishments.md`.
3. **The doubling of B is high-G gracenote → B → D gracenote → B** (i.e. the
   current draft is right and the prior reviewer's "C" suspicion is wrong).
   Medium confidence only. Do not promote the doubling out of draft on my word.
4. **The doublings on Low A, B and C share the same D gracenote as their second
   element.** Medium confidence, same caveat.
5. **The high-G gracenote is played by lifting the top-hand index alone** (not by
   taking the full High G fingering), and is common on Low G as well as Low A–F.
   High confidence; the app's prose already says the first half, and this is the
   basis of accuracy issue #6.
6. **Mainstream modern teaching favours low, close finger height** over lifting
   fingers well clear. Medium confidence — this is the basis of the
   `triad-method.md` vs `content.tsx` contradiction (#8) and is exactly the kind
   of thing that varies by teacher and era. The *contradiction* is a fact; which
   side is right is the owner's call.
7. **Pipe music is characterised by pointed/dotted rhythms and a 2/4 march played
   evenly is not idiomatic.** High confidence; basis of P1-10.
8. **The standard route to the pipes involves a bag/goose or blowpipe stage and
   is normally gated on blowing steadiness, not fingering alone.** High
   confidence; basis of the stage-17 critique.
9. **Amazing Grace's standard opening phrase does not repeat its first two-bar
   figure.** Medium confidence — flagged as a disagreement to check, not an
   error, above.
