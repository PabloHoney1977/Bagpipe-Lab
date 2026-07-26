# Repertoire — rights status and transcription state

Project rule (`CLAUDE.md` §Decisions): *public-domain tunes only for initial
release; no tune enters the shipped repertoire without its public-domain status
confirmed first.* This file is the register of that check.

**The distinction that governs everything here: the tune and the setting are two
different works.** A traditional melody can be centuries out of copyright while a
particular *arrangement* of it — the choice and placement of embellishments, the
specific setting — is a recent, protected creative work. Several sheets in the
2026-07-26 batch are exactly that case. Encoding the plain melody is safe;
copying an arranger's ornamented setting note-for-note is not.

That happens to align with the app's own pedagogy: tunes are learned **plain
first**, ornaments layered on later (`PEDAGOGY.md` §4). So the copyright-safe
path and the teaching-correct path are the same path — encode the plain melody,
then add standard ornaments ourselves at the stage the curriculum calls for them.

---

## Batch 1 — received 2026-07-26

| Tune | Sheet metadata read from the scan | Rights | Shippable? |
|---|---|---|---|
| **Amazing Grace** | 9/8, 4 systems, ornaments written in | Melody PD (Newton 1779 text; "New Britain" melody 1830s) | ✅ Melody yes |
| **Auld Lang Syne** | 4/4, 4 systems | Melody PD (trad., rel. "The Miller's Wedding"; Burns text 1788) | ✅ Melody yes |
| **Bonny Dundee** | 6/8, 4 systems, credited **"Arr. L. Bogart May '92"**, ★ footnote: *"The grip or Taorluath takes the time of the 16th note"* | Tune PD (trad.; Scott's words 1825). **This setting is Bogart's 1992 arrangement** | ⚠️ Melody only — do not copy this setting |
| **Balmoral** | 3/4, 4 systems, repeat marks (2 parts), no composer credit on the sheet | **Unverified** — no credit shown, which is not proof of PD | ⛔ Blocked pending check |
| **Highland Cathedral** | 2/2, 4 systems, "REPEAT 1st PART" | **In copyright — composed 1982 by Ulrich Roever and Michael Korb** | ⛔ **Cannot ship** |

### Highland Cathedral — do not ship

It sounds traditional and is played everywhere, which is exactly why it catches
people out, but it is a modern composition (1982) and firmly in copyright. It
cannot go into the repertoire — free tier or paid — without a licence from the
rights holders. This is the single highest-risk item in the batch: shipping it in
a paid app is a straightforward infringement, and pipers would recognise it
instantly.

*Confidence: high on the 1982 Roever/Korb attribution, but this is the kind of
fact worth the owner confirming independently before any decision rests on it.*

### Bonny Dundee — tune yes, this setting no

The sheet credits **L. Bogart, May '92**. That is the same Lloyd M. Bogart whose
*Bagpipes: The Manual* is recorded in `reference/triad-method.md` as
all-rights-reserved with an explicit no-copying notice. The underlying tune is
traditional and free to use; his 1992 arrangement is not ours to reproduce.
Encode the plain melody and let the app's own curriculum add the ornaments.

Note the Amazing Grace and Highland Cathedral sheets are the same dot-matrix
HyperCard-era print as Bogart's book, so **the whole batch may come from his
material**. Worth assuming so until established otherwise. Bogart is local to the
owner; asking permission via the La Crosse pipe band remains the clean path if we
ever want to use his settings directly rather than just the melodies.

### Balmoral — needs a check

No composer credit on the sheet. Absence of a credit is weak evidence, not proof.
Several pipe tunes named "Balmoral" exist and at least one well-known 3/4 setting
may be a named composition. **[needs owner]** — confirm before encoding.

---

## Transcription state: not attempted from the scans, deliberately

I tried to transcribe these by measurement rather than by eye — the same
pixel-measurement method that settled the staff positions in
`reference/staff-notation.md`. It does not work well enough on this material:

- Staff-line detection is reliable (Balmoral: 4 systems, 5 lines, 29.2px spacing).
- **Notehead detection is not.** A morphological pass over the Balmoral scan
  returned 85 candidate blobs; the overlay showed it marking beams and stems,
  missing many real noteheads, and — fatally — unable to separate grace notes
  from principals, which is the whole difficulty in piping notation. The
  dot-matrix scans (Amazing Grace, Highland Cathedral) are worse: their systems
  are indented, so even staff detection needs per-system handling.

Producing a plausible-but-wrong note sequence is the specific failure this
project keeps avoiding — it is how the original fingering chart went wrong, and a
wrong setting of the most recognisable tune in piping is the one unlearning cost
that is genuinely expensive. So nothing from these scans has been encoded.

### What would make this reliable

In rough order of preference:

1. **Note names, per bar, from the owner.** The mechanism that produced
   `reference/fingering-chart.md`. Perhaps ten minutes a tune, and exact. Only
   the plain melody is needed — no ornaments, since the curriculum adds those.
   Format: `| Low A | D. F | D. F | E.` — bar lines, note names, `.` for dotted.
2. **A digital source.** Bagpipe Writer (`.bww`) or ABC notation is plain text
   and unambiguous; if any of these exist in that form, they can be parsed
   directly with no reading step at all.
3. **A cleaner scan** — 600dpi, one system per image. This would make the
   measurement approach viable, but it is still the weakest of the three because
   grace-note discrimination stays hard.

Existing `amazing-grace` note data in `tunes.ts` remains the unverified DRAFT
described in `reference/app-review-2026-07-26.md` §6, and the 2026-07-26 pedagogy
review reads its opening as non-standard. It is still presented to learners as
"Your first tune" with no caveat. **That has not changed and is still item 1 of
the owner-decision queue.**

---

## Batch 2 — received 2026-07-26

| Tune | Sheet metadata | Rights | Shippable? |
|---|---|---|---|
| **Skye Boat Song** | Photo of a published collection, no. 449, "Slow March", 6/8, p.254 | Melody PD (trad. air; Boulton's words 1884). The *book's* setting is that collection's | ✅ Melody yes |
| **'Gin A 'Were A Baron's Heir** | 6/8, ♩.=42, "Slow Air / March", **two-sharp key signature**, red-dot tutorial. Credited **"Phrasing Arr. L. Bogart 7/2023"** | Melody PD (trad. Scots song). **Phrasing arrangement is Bogart 2023** | ⚠️ Melody only |
| **Dawning of the Day** | 4/4 march, ♩=81, red/blue-dot tutorial, annotations "Grip / Shake / Dbl", "passing note", "+2 beats IF Called Last Time". Credited **"Arr. Terry Tully · Tutorial Arr. L. Bogart 10/5/2023"** | Air PD (Irish trad., *Fáinne Geal an Lae*). **Setting is Terry Tully's — a living third-party arranger** | ⚠️ Melody only; highest third-party risk after Highland Cathedral |
| **Wings** | 4/4, 4 systems, no credit, same dot-matrix print as the Bogart material | **Unverified** — treat as modern/in-copyright until established | ⛔ Blocked pending check |

### What this batch establishes

These are a pipe band's **tutorial folder** — teaching sheets circulated inside a
band, several by living arrangers, one carrying a note to discard a superseded
version and its mp3. Two involve third parties with no relationship to this
project: Terry Tully (Dawning of the Day) and the Highland Cathedral composers.

The position is unchanged and workable: **the melodies are overwhelmingly public
domain and are all we actually need.** What we must not reproduce is the
arrangers' settings — their ornament choices, phrasing marks, and tutorial
annotations. Take the tune, generate our own ornaments at the curriculum's stage.

### Bonus: the two-sharp key signature is confirmed

The Baron's Heir sheet carries a visible **two-sharp key signature (F♯, C♯)**.
That independently confirms claim #1 in
`reference/reviews/2026-07-26/04-pedagogy.md` — asserted from memory there and
flagged for checking — and therefore that `content.tsx:246-249`'s "no sharps or
flats… the extra symbols other instruments use never appear here" is misleading
to a learner opening a real tune book.

Honest caveat: it is **not universal across these sheets** — Dawning of the Day
is engraved with no key signature at all. So the accurate statement is that
published pipe music *commonly* carries two sharps, not always. The fix in
`content.tsx` should say the sharps are built into the chanter so there is
nothing to do about them, and that no accidentals appear inside the tune.

### The red-dot convention is worth stealing

Both tutorial sheets colour the embellishment notes red, leaving the melody
black. That is the app's plain-tunes-first pedagogy rendered on paper — and
`StaffPlayer` already draws grace noteheads in gold, so the app independently
arrived at the same idea. Worth keeping and making explicit in the Guide.

---

## Transcription: the colour trick is right, the resolution isn't

The red/black separation solves precisely the problem that defeated the greyscale
scans — telling grace notes from principals — and it happens to isolate exactly
the copyright-safe layer. Measured on the two engraved PNGs:

- Colour separation is clean: Baron's Heir 47,559 black ink px vs 466 red;
  Dawning of the Day 58,014 black vs 1,712 red vs 27 blue.
- Staff detection is **perfect**: 20 lines = 4 systems × 5, uniform 8.5–8.75px
  spacing, no indentation problem.
- **But the images are only 960×1194, so one note step is ~4.3px.** A two-pixel
  centroid error changes the note. With antialiasing and beams touching
  noteheads, that is not a margin worth betting a learner's first tune on.

**These were exported from notation software, so the good version exists.** The
ask is small and specific:

> For Baron's Heir and Dawning of the Day: the **source file** (`.bww`,
> MuseScore, Sibelius — anything) or a **PDF / 300–600dpi PNG export**. With
> either, the melody comes out exactly, with no reading step to get wrong.

For the paper-only tunes (batch 1, Wings, Skye Boat Song), note names per bar
remain the reliable path.
