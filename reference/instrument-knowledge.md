# Bagpipe instrument knowledge — ground truth for the app

Reliable, sourced facts about the Great Highland Bagpipe (GHB) and its practice
chanter, so features are built on how the instrument actually works, not on
guesses. This is the canonical reference the app's exercises, tunes, and Guide
prose must agree with. Sources are listed at the bottom.

> **Why this file exists:** the app once shipped a "Steady Low A" exercise —
> eight separate taps on one repeated note. That is physically impossible on a
> chanter (see §1). This file captures the instrument's real constraints so that
> class of error doesn't recur. See §6 for the hard rules that fall out of it.

---

## 1. The defining constraint: one continuous, unstoppable tone

The chanter is an open-ended pipe driven by a double reed. **While air flows, the
reed sounds — continuously.** The player cannot stop it, cannot tongue it, and
cannot vary its loudness. Everything else about how pipe music works follows from
this. Concretely:

- **No rests / no silence.** Standard Highland pipe music has no rests; the sound
  is unbroken from the first note to the last. (A few *other* bagpipes with
  closed/stopped chanters can rest — the GHB cannot.)
- **No tonguing / no re-articulation.** Unlike most wind instruments, there is no
  way to "start" a note with the breath. Notes slur (legato) directly into one
  another.
- **No dynamics.** You cannot play one note louder or softer than another.
  Expression is achieved through **note length** (agogic/rhythm) and
  **embellishments**, not volume.
- **⇒ You cannot play the same note twice in a row as two distinct notes.** Two
  consecutive notes of the *same pitch* would just merge into one longer sound.
  The **only** way to separate them is to insert a very short **grace note** of a
  *different* pitch between them — this is the piping equivalent of tonguing.
  This is *the* reason grace notes exist; they are functional, not decorative.

Consecutive notes of *different* pitch are fine: the pitch change itself is the
articulation. So a scale, or any stepwise/leaping line, plays cleanly "plain"
(no grace notes). It is only a **repeated pitch** that requires a grace note.

---

## 2. The scale, the notes, and the sharps

Nine notes, low to high: **Low G, Low A, B, C, D, E, F, High G, High A** — just
over one octave. The tonic/reference note is **Low A**.

- **"C" sounds a C sharp and "F" sounds an F sharp.** Pipers *write* them as C
  and F with no accidentals (pipe notation carries no key signature), but they
  *sound* sharp. The scale is a form of **A Mixolydian** (major-ish scale with a
  flattened 7th): G A B C♯ D E F♯ G, then High A.
- **High G is a flat 7th.** It is tuned notably flatter than an equal-tempered
  minor 7th (toward the harmonic 7th, ratio ≈ 16:9 above Low A).
- **The chanter is not concert-pitched.** "Low A" is far above concert A: modern
  chanters sit around **475–485 Hz** (roughly a concert B♭ or higher), and the
  pitch has drifted upward over the decades. Every chanter differs slightly —
  which is exactly why the app has a tuning dial (Low A is the tunable anchor;
  all other notes move with it).
- **Traditional tuning is just intonation, not equal temperament.** Intervals are
  tuned as pure ratios (e.g. D = 4:3 above Low A, E = 3:2). Against an
  equal-tempered reference the just C♯ and F♯ read as ~15 cents flat, and High G
  is flatter still; some notes deviate 30+ cents from equal temperament. The app
  currently uses equal temperament derived from the tunable Low A — a defensible
  approximation. A just-intonation option is a possible future refinement (would
  need per-note cent offsets confirmed against a source before encoding).

---

## 3. Embellishments (grace-note movements)

All are played by flicking fingers up/down as fast as possible so the grace notes
are heard as clicks, not melody. They break up the continuous tone to create
articulation, accent, and separation.

- **Single grace note.** One quick note of a higher pitch, thrown in front of a
  melody note. The **High-G grace note** is the workhorse and can be played on any
  melody note **from Low G up to F** — *not* on High G or High A (there's no
  higher hole to flick). D and E grace notes are used on the higher melody notes.
- **Doubling.** Two grace notes on a melody note (commonly a High-G grace note on
  the beat, then a second grace note, then the melody note). Rule of thumb for the
  second grace note: to a G/A/B/C melody note use **D**; to D use **E**; to E use
  **F**. "High-G" and "High-A" doublings are special cases (there is no note above
  to grace with, so they're formed differently — e.g. a High-A doubling uses a
  thumb High-G grace note).
- **Half doubling.** A doubling without the leading High-G grace note.
- **Grip (Gaelic: leumluath).** A low-hand movement built around a low-G grace
  note; a foundational embellishment.
- **Throw on D.** A movement onto D. A "light/high" throw and a "heavy/low" throw
  exist; the heavy throw is essentially a grip to C then up to D.
- **Taorluath / Crùnluath.** More complex movements, prominent in *pìobaireachd*
  (the classical "big music"), typically taught much later.
- **Birl.** Played **only on Low A**; a rapid low-hand movement that sounds like a
  triplet on A. Written variously (GAG, AGAG, gAGAG) but sounds "A-A-A".
- **Strike / casting.** A single low-hand grace to separate or accent.

**Grace-note timing.** Grace notes "take no time" in theory, but in practice the
common convention is that a single grace note lands **on the beat** and steals a
sliver of time from the melody note it precedes (so the melody note arrives a hair
late). The grace notes themselves are crushed as fast as the fingers move.

---

## 4. How the instrument is actually taught

- **Everyone starts on the practice chanter (PC)** — quieter, cheaper, easier to
  blow, no bag or drones. You learn all fingering and grace-note technique here
  before ever picking up the pipes. Typical PC-before-pipes span is **6–12 months**;
  full mastery with drones takes a couple of years.
- **Order of skills** (consistent across the standard tutors):
  1. Hold the chanter — **left hand always on top**, right hand below.
  2. **Steady blowing** — a constant, even pressure producing one unwavering tone.
     This is repeatedly called the single most important fundamental; you can't
     tune or sound good without it. (On the PC this is a long held tone, not a
     rhythmic drill.)
  3. Learn the **nine notes** and the **scale**, evenly.
  4. **Grace notes early — because you can't play real music without them.** The
     standard first grace-note work is the **G–D–E** grace notes, then the
     High-G grace note applied across the scale, then **doublings**, then throws
     and the D throw, then grips, then more complex movements.
  5. **Simple tunes**, graded in difficulty, with the required embellishments
     introduced in the tune that needs them.
- **Standard tutors / methods:** the College of Piping *Tutor for the Highland
  Bagpipe* ("Green Book", Lessons 1–13 progression), the National Piping Centre
  tutor, and Logan's Tutor. Grade syllabi (e.g. Novice grades) are literally
  defined by which lessons/embellishments you've reached.
- **Canntaireachd** — the traditional system of vocables for singing tunes and
  embellishments before playing them ("sing it before you play it").

**Nuance on "plain first" (our curriculum's approach):** teaching a tune "plain"
before adding ornaments is sound, but it has a hard limit — a plain melody must
**avoid adjacent repeated pitches** (or merge them into one longer note). You
cannot play a real repeated-note passage plain; the grace note is precisely what
re-separates those notes when it's added later. So "plain" exercises/tunes in the
app must be written with no adjacent same-pitch notes until grace notes exist as a
feature.

---

## 5. Rhythm & expression (relevant to the Play tab)

- With no dynamics and no rests, **rhythm and note-length carry the music.**
  Getting durations and pulse right is the core skill the app scores — which is
  the right thing to grade for this instrument.
- Tunes are grouped by type/time signature (marches in 2/4, 4/4, 6/8; strathspeys
  and reels in 4/4 with characteristic rhythms; jigs in 6/8 or 9/8; airs freer).
  Amazing Grace is commonly set as a 3/4 air or in 9/8 as a pipe setting.

---

## 6. Hard rules for building exercises, tunes, and lessons

These are the constraints any melody data (`tunes.ts`), staff/lane rendering, and
Guide prose must respect:

1. **No two adjacent notes of the same pitch** in any "plain" (no-grace-note)
   exercise or tune. Repeated pitches require a separating grace note, which the
   app hasn't implemented yet. (This is the "Steady Low A" trap.) A dev-time guard
   in `tunes.ts` enforces this.
2. **No rests** in pipe melodies — the sound is continuous.
3. **Don't teach or imply dynamics** (louder/softer). Expression = note-length +
   embellishment.
4. A **single sustained tone** is a *blowing/tone* exercise (hold it steady), not
   a "tap the pulse on every beat" drill. Pulse/rhythm drills must move between
   different pitches.
5. **C and F sound sharp** (C♯, F♯) even though written natural. Audio must reflect
   this (it does — see `chanter.ts` semitone offsets).
6. **The chanter is not A=440.** Pitch is user-tunable around ~475–485 Hz via the
   Low A anchor; keep all note frequencies relative to that anchor.
7. **Grace notes, when added, are functional** — introduce each in the context
   that needs it (separating a repeat, or the movement a specific tune calls for),
   not as early decoration. High-G grace note only works up to F; the birl is Low
   A only; etc. (see §3).

---

## Sources

Consulted July 2026 (direct page fetches are blocked by this session's network
policy; these were read via web search summaries of the pages):

- Teach Yourself Bagpipes (Lindsay Davidson) — grace notes, doublings, which grace
  note on which note: https://www.teachyourselfbagpipes.co.uk/gracenotesandstrikes.html ,
  https://teachyourselfbagpipes.co.uk/highggracenotes.htm ,
  http://www.teachyourselfbagpipes.co.uk/spdoublings2021.html
- Bagpipes / Great Highland bagpipe / Glossary of bagpipe terms — Wikipedia
  (continuous sound, no rests, embellishment names, scale): 
  https://en.wikipedia.org/wiki/Bagpipes ,
  https://en.wikipedia.org/wiki/Great_Highland_bagpipe ,
  https://en.wikipedia.org/wiki/Glossary_of_bagpipe_terms
- Ewan MacPherson, "The Pitch and Scale of the Great Highland Bagpipe" &
  gracenote-timing analysis (just intonation, C♯/F♯/High-G cents, ~475–485 Hz):
  https://publish.uwo.ca/~emacphe3/pipes/acoustics/pipescale.html ,
  https://publish.uwo.ca/~emacphe3/pipes/acoustics/grace_time.html
- Peterson Strobe Tuners — Highland bagpipe tuning (concert A 475–485 Hz):
  https://www.petersontuners.com/myinstrument/bagpipes
- College of Piping *Tutor for the Highland Bagpipe* (Green Book) & Piping Press
  exam syllabus — teaching order, lessons 1–13, grade progression:
  https://pipingpress.com/piping-press-academy-piping-exam-syllabus/
- BagpipeLessons.com, Piper's Dojo, Henderson's — practice-chanter-first path,
  steady blowing, 6–12 month timeline:
  https://bagpipelessons.com/learn-the-pipes-right/ ,
  https://www.pipersdojo.university/blog/how-to-learn-to-play-the-bagpipes ,
  https://www.hendersongroupltd.com/resources/beginning-the-bagpipes/
- Schenectady Pipe Band — Bagpipe Embellishment Guide (movement mechanics):
  https://schenectadypipeband.com/wp-content/uploads/2019/01/Bagpipe-Embellishment-Guide.pdf
