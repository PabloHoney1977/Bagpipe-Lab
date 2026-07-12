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
