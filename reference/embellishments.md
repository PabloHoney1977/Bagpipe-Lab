# Embellishment reference

Vocabulary and timing taxonomy for Highland bagpipe embellishments, to guide
the design of the **Grace notes** tab.

The organising idea below — grouping embellishments by how they sit against the
beat — is transcribed from the "Highland Bagpipe Embellishment Timing Tree"
infographic provided by the project owner (credit: Matt Willis, mattpiper.com).
Only the factual taxonomy is captured here; the original image is not stored in
the repo. Confirm specifics with the owner before shipping scored content.

## The core teaching idea: timing relative to the beat

Every embellishment steals its time from somewhere. Which note it borrows from
is what makes it land correctly — and it's one of the hardest things for
learners to feel. Three categories:

1. **Ends on the beat** — the embellishment takes its time from the note
   *before* the ornament. The note it decorates lands *on* the beat; the
   movement finishes exactly as the beat arrives.
2. **Starts on the beat** — the embellishment takes its time from the note
   *after* the ornament. The movement begins *on* the beat.
3. **Goes across the beat** — the embellishment takes its time from the notes
   *both before and after* the ornament.

## Embellishments by category (from the chart)

### Ends on the beat
- F Catch
- Low G Catch
- Grip from D
- Taorluath from Low G
- Taorluath from D
- Grip
- Taorluath

### Starts on the beat
- High A Doubling
- High G Doubling
- Half Doubling
- Doubling (Low G up to F)  — the "standard" doubling across the low notes
- Strike
- Birl from Low A
- Birl
- Tripling (also called Hornpipe Shake, Doubling Strike, or Pele)
- G Gracenote Birl

### Goes across the beat
- D Throw (Light)
- D Throw (Heavy)

## Shipped ornaments — fingering detail

What the app actually implements so far (`src/ornaments.ts`), and its status.

### High-G gracenote — SHIPPED, considered solid
- **What:** a single grace note sounding **High G**, flicked in before a melody
  note that is lower than High G.
- **Fingering:** from the melody note, briefly lift the **top-hand index (L1)**
  to open the High-G hole, then drop straight back. A quick flick, not a note
  with real length.
- **Use:** articulates a note, and separates two of the same note (a chanter
  can't stop between them). Valid on Low A, B, C, D, E, F (and Low G).
- In the app: `graces: ['High G']` on an ExerciseNote; drilled per note in the
  Grace notes group.

### Doublings — DRAFT, needs owner verification
The app ships **one flagged draft** (doubling of B, modelled as high-G gracenote
→ B → D gracenote → B) purely to exercise the multi-grace rendering. The full,
correct doublings table is **[needs owner]** — please confirm, for each note, the
exact grace-note construction:

| Note | Doubling (grace cluster) — to confirm |
|------|----------------------------------------|
| Low A | ? |
| B | high-G gracenote, B, D gracenote, B *(draft assumption)* |
| C | ? |
| D | ? (E gracenote involved?) |
| E | ? (half-doubling?) |
| F | ? (half-doubling?) |
| High G / High A | ? |

Until confirmed, no doubling is presented as authoritative or scored as correct.

## Design implications (for later)

- **Teach the beat-relationship explicitly**, not just the finger pattern.
  Scoring should reward the movement landing in the right place in time, which
  is the whole point of these three categories.
- **Introduction order** should still follow the curriculum's "solve a problem
  you just felt" principle (doubling first, to separate repeated notes), but
  this timing taxonomy gives a second, orthogonal axis to teach and to visualise
  in a falling-notes / rhythm-lane UI (e.g. show whether the movement resolves
  before, on, or across the beat line).
- Many of these are grace-note clusters on a single melody note; the Play/rhythm
  engine will need to represent an ornament as a timed group attached to a beat,
  not just single note onsets.
