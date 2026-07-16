# Staff notation positions (ground truth)

Transcribed from a "Bagpipe Scale" reference chart the owner provided
(`FingeringChart1.png` — the same chart's fingering-diagram row also backs
`fingering-chart.md`). The chart's bottom row shows each of the nine notes
on a small treble-clef staff. Positions below were read directly off the
pixels (line spacing measured, notehead center measured per note), not
guessed — see the derivation notes at the bottom of this file if the method
needs to be re-checked.

## The mapping

Staff lines, bottom to top: line 1 (bottom) · line 2 · line 3 (middle) ·
line 4 · line 5 (top). "Step" is a half-line-spacing unit used by
`src/StaffDiagram.tsx`, where step 0 = line 1 and each +1 moves up half a
line spacing (so lines fall on even steps, spaces on odd steps).

| Note    | Position                          | Step |
|---------|------------------------------------|:----:|
| Low G   | Line 2 (2nd line from the bottom)  | 2    |
| Low A   | Space between line 2 and line 3    | 3    |
| B       | Line 3 (middle line)               | 4    |
| C       | Space between line 3 and line 4    | 5    |
| D       | Line 4                             | 6    |
| E       | Space between line 4 and line 5    | 7    |
| F       | Line 5 (top line)                  | 8    |
| High G  | Space just above the staff (no ledger) | 9 |
| High A  | On a ledger line above the staff   | 10   |

Notes:
- The staff's bottom line (line 1, step 0) is **unused** — no chanter note
  sits there. Low G is the *second* line from the bottom, not below the
  staff, which runs against a common verbal shorthand ("Low G hangs below
  the stave") — the measured pixel positions are the source of truth here,
  not that shorthand.
- Only High A requires an actual ledger line. High G sits in the open space
  immediately above the staff and needs no ledger.
- This is a plain, un-transposed reading: bagpipe notation uses no key
  signature and (per `content.tsx`'s `NotationBasics` lesson) essentially no
  accidentals, so each of these nine positions always means the same
  chanter note, with no exceptions to check for.

## Derivation (for re-verification)

The source image is 778×476px. The "Bagpipe Scale" row sits at y≈367–456,
with 9 equal-width columns from x≈177–756 (one per note, same column grid as
the "Note" label row above it). Within each column, the five staff lines
measured at y ≈ 399 / 405.5 / 412 / 418.5 / 425.5 (top to bottom, ~6.5px
apart). Each note's filled notehead was located by finding the vertical
center of its darkest, widest blob (the stem is ~1–2px wide; the notehead is
~7–9px). High A's row additionally showed a short (~9px wide) gray segment
at the notehead's row that does not appear for any other note — confirming
it alone sits on an added ledger line, while High G (the next position
below it) has no such extra segment.
