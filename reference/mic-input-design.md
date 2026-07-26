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

## 8a. FEASIBILITY CONFIRMED — measured on real audio, 2026-07-26

Owner supplied a 25.2s phone recording (mp3, 128kbps, 44.1kHz mono, peak 0.80,
rms 0.094 — clean, not clipped). Analysis: harmonic-sum f0 with octave
disambiguation, FFT autocorrelation cross-check, 1.45ms-hop transition tracking.
**Everything the design depended on is confirmed, and one assumption was
upgraded from "probably fine" to "load-bearing".**

*Measurements below were produced twice by independent implementations (different
FFT size, search grid and sub-window length). They agree to within **1.4 cents**,
which is the quantisation of the two search grids — so treat every figure as
±1.5 cents. Where the two differ the table gives the first run; the second gives
an octave span of 1199c, worst deviation +62c, tightest gap 75c. No conclusion
changes.*

### What is in the file

Two takes of four sustained notes each (~2s per note), ascending, with a ~4s
break between. Take 1 spans 1.9–9.4s, take 2 spans 13.5–21.2s.

### The measured profile of this chanter

| Note (inferred) | Hz | cents from lowest | nominal | deviation | gap to previous |
|---|---|---|---|---|---|
| Low A | 230.5 | 0 | 0 | — | — |
| B | 257.0 | 188 | 200 | −12 | +188 |
| C | 284.5 | 364 | 400 | −36 | +176 |
| D | 304.5 | 482 | 500 | −18 | +118 |
| E | 349.0 | 718 | 700 | +18 | +236 |
| F | 401.5 | 961 | 900 | **+61** | +243 |
| High G | 419.5 | 1037 | 1000 | +37 | **+76** |
| High A | 460.5 | 1198 | 1200 | −2 | +161 |

**Lowest to highest = 1198 cents — a perfect octave to within 2 cents.** With the
interval pattern coming out tone·tone·semitone·tone·tone·semitone·tone, which is
exactly the chanter scale, the reading "Low A up to High A, Low G omitted" is
strongly supported. **[needs owner] to confirm the note labels** — the intervals
are measured, the names are inference.

### Findings

1. **Pitch is extremely stable.** ±1–3 cents drift on 7 of 8 notes over 1.3–1.9s
   (the exception, the first note of take 2, wandered ±8 cents). Measurement
   precision is far finer than any interval we need to resolve.
2. **Notes separate with enormous margin.** Adjacent gaps run 76–243 cents
   against ±1–3 cents of noise — a 25–75× margin. 9-way classification is not a
   hard problem on this signal.
3. **The tone never stops.** Strictly inside each take: RMS minimum 0.088 and
   0.071, **zero frames below silence threshold out of ~1200 each**. The reed
   sustains continuously through every fingering change, exactly as the
   instrument's physics require.
4. **Transitions are near-instant with almost no amplitude change.** Pitch moves
   between plateaus in **1.5–25ms**, while amplitude dips only **2–17%** —
   ordinary playing dynamics. This is the design's central premise measured
   directly: **an energy-based onset detector would have nothing to detect, while
   the pitch jump of 76–243 cents is unmissable.** The roadmap correction in §1
   is now empirically justified, not merely argued.
5. **The harmonic signature is diagnostic of a practice chanter.** Fundamental
   strongest, **2nd harmonic weak (0.06–0.16), 3rd harmonic stronger than the
   2nd (0.09–0.30)** — the odd-harmonic pattern of a cylindrical closed pipe,
   which is what a practice chanter is, as distinct from the conical pipe
   chanter. It also explains why the fundamentals sit this low: a stopped
   cylindrical pipe sounds roughly an octave below an open one of similar length.
   Octave errors were ruled out directly — ACF at f0 is 0.92–0.98 while at 2·f0
   it is *negative*, and energy at f0/2 is 0.000–0.002.

### The finding that changes a design decision

The owner's instinct that practice chanters are "rarely in tune" is confirmed and
is **more consequential than it first appeared**:

> **Worst deviation from the nominal scale is +61 cents (F), while the tightest
> adjacent gap is 76 cents (F→High G).**

So a classifier assuming a theoretical scale would expect F at 900 cents and find
it at 961 — landing within 15 cents of where **High G actually is**. That is a
near-certain misclassification, and it would tell a learner they played a wrong
note when they played correctly.

**Calibration is therefore not a refinement, it is required for correctness** —
and the profile-the-whole-scale step is required, not just the Low A anchor,
because the deviations are per-note and not a uniform shift (−36 to +61 cents
across the range). This is exactly the reasoning in §3, now with numbers behind
it. Recording a second chanter would confirm the deviations differ per
instrument, which is the last piece of the argument.

### Bearing on the concert-pitch item (§7)

This chanter's Low A is **230.5 Hz** against `chanter.ts`'s `440.0`. That is not
a small mistuning; it is most of an octave plus a tone. Note a practice chanter
and a pipe chanter are pitched differently, so "what should the app play?" is a
real choice rather than a single correction — **[needs owner]**: tune the
synthesized voice to practice-chanter pitch, to pipe-chanter pitch, or make it a
setting the calibration fills in?

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
