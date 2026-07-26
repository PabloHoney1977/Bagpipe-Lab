# Mic input — design record

Status: **design agreed, not built.** Supersedes the framing in `CLAUDE.md`
§Roadmap ("we only need onset detection, not pitch"), which is wrong for the
reason given below. Sequencing is unchanged: this comes after the tap-based
curriculum ships.

---

## 1. Why it is pitch tracking, not onset detection

The roadmap assumed we need only to know *when* a note changed, since fingering
tells us which note it was. That reasoning fails on this instrument: a chanter's
reed never stops, and the amplitude barely moves through a fingering change, so
there is no attack transient for an energy-based onset detector to find. Legato
pitch changes are close to invisible to that approach.

The robust route is to **track pitch continuously and read transitions off it**,
which hands us note identity for free. Identity is worth having: it is what
catches wrong notes and **crossing noise** — the extra pip when fingers don't
move together, which is the fault the Finger Gym exists to prevent and currently
cannot observe.

The problem is unusually constrained: monophonic, no polyphony, no percussion,
loud, close-miked, and **9-way classification over a known alphabet** rather than
open-ended f0 estimation.

## 2. Tuning variance — the thing that sounds fatal and isn't

Practice chanters are rarely in tune and vary considerably between instruments.
This does not threaten the approach, because **nothing compares against absolute
pitch.** The question is never "is this 470Hz?" but "which of *your* nine notes
is this?" — a relative judgement, from a frame measured on the learner's own
instrument. A chanter sitting sharp of concert shifts the whole frame, and the
frame is what we calibrate.

The sharper version of the objection is real and is what drives the design below:
chanters do not merely sit uniformly sharp. Crude undercutting on cheap practice
chanters moves notes *relative to each other*. So deriving nine frequencies from
a single anchor reintroduces the error we were removing.

Margins remain comfortable regardless: the nine notes sit roughly a whole tone
apart, tightest adjacent gap around 90–100 cents, against tuning error in the
tens of cents.

## 3. Calibration: anchor → profile → self-refinement

Three stages, mapped onto when the learner is actually *capable* of each.

| Stage | What | When | Cost |
|---|---|---|---|
| **Anchor** | Hold a Low A | Start of any session | ~3s |
| **Profile** | Play the scale slowly | Once the learner can — Guide stage 8 | ~20s |
| **Refine** | Every confidently-classified note nudges that note's stored centre | Continuous, invisible | free |

**The anchor** is the ritual a piper already performs, cheap enough to open a
practice session rather than hide in settings. It catches reed warm-up, a new
reed, a different chanter, and it is all a beginner needs — before the scale they
are not playing tunes, so classification isn't required yet; "is a note sounding
and is it steady" runs off the anchor alone.

**The profile** measures all nine actual frequencies on that instrument, with no
assumption about interval spacing. It is immune to uneven chanters. Note it is
*already an exercise in the curriculum* — "play the scale slowly, low to high" is
Guide stage 8 — so calibration is a lesson doing double duty rather than friction
bolted onto the feature.

**Refinement** means the profile converges on the learner's real instrument
without ever asking again, and keeps up with drift as the reed warms.

Free diagnostic: if a note's observed cluster wanders far from where the profile
expects, prompt a re-calibration instead of silently misclassifying and telling
someone they played a wrong note when they didn't.

### Guard rails

- Sanity-check the anchor against a plausible band; reject with *"that doesn't
  sound like a Low A — try again"* rather than accepting a poisoned profile. A
  bad profile is worse than none.
- Calibration must be **skippable** with a sensible default, flagged as reduced
  accuracy, so a first run never dead-ends on a mic permission or hardware issue.

## 4. What this cannot do

**Intonation coaching.** Telling a learner "your High A is flat" requires knowing
what their chanter *should* do, and for an arbitrary practice chanter we cannot
know that. Note identity, timing, crossing noise and blowing steadiness are all
fine; grading tuning is not, and must not be promised.

## 5. Record-then-review, not real-time

Post-hoc analysis of a recording beats live scoring on both counts:

- **Easier to build** — no latency budget, larger windows, multiple passes, and
  the ability to look forwards as well as backwards in the signal.
- **Better pedagogy** — hearing yourself is most of what musicians get out of
  recording, and it dissolves the physical problem that you cannot hold a chanter
  in both hands and tap a phone.

Assessment is DTW alignment against the `tunes.ts` sequence, yielding per note:
substitutions (wrong note), deletions (missed), **insertions (crossing noise)**,
and signed onset error. Steady blowing falls out as pitch/amplitude variance over
sustained notes — the dominant first-year fault, currently taught in one stage
and never checked.

**Classical DSP and alignment, not an LLM.** Deterministic, offline, instant, no
per-use cost — which matters because a one-time IAP cannot absorb recurring
inference cost. An LLM may phrase the coaching from extracted features; it must
not do the listening.

## 6. Build order

**A.** Recorder + playback only, no analysis. Near-zero risk, and most of the
value musicians get from recording. → **B.** Anchor calibration + sustained-note
analysis → a real steady-blowing score. → **C.** Full profile + DTW alignment on
tunes → per-note diagnosis and crossing-noise detection. → **D.** Gracenote
assessment (~30–50ms, near the resolution floor — hardest, last). → **E.** Full
pipes: drones swamp the chanter; tractable by spectral subtraction since drones
are steady, but scope it last.

Other known difficulties: backing-track bleed into the mic (require headphones,
or use click-only backing and gate around known click times); iOS mic processing
must be disabled explicitly (`echoCancellation`, `autoGainControl`,
`noiseSuppression`) or the platform mangles the signal before we see it.

## 7. Open item in the shipped app

`chanter.ts` uses concert equal temperament — Low A is literally `440.0`, High A
`880.0`. A real chanter's A sits substantially higher (roughly 470–480Hz for
modern instruments — **[needs owner] to confirm**, asserted from memory).

Harmless while learners tap a screen and the tone is only a cue. Unpleasant the
moment anyone plays along by ear, and a genuine problem once mic input puts a
backing tone in the same room as the chanter. **The same calibration that
profiles the chanter for listening should retune what the app plays.**

## 8. De-risking — what is actually needed from the owner

**[needs owner]** A phone recording: a **slow scale** (low to high and back) then
a **slow tune**, on a normal practice chanter, untuned and unfussed-over.

The scale is not a favour to the algorithm — it is precisely what the in-app
profile step will capture, so it doubles as a specimen of that.

Two different chanters would be better than one: that tests whether the profile
generalises, which is the question that decides whether any of this is safe to
build on.

The empirical question the recording answers is **not** tuning. It is whether the
nine notes separate cleanly in the spectrum through a phone mic, and whether
transitions are crisp enough to time. An unstable or squeaky reed threatens that.
Being out of tune does not.
