# Chanter fingering chart (ground truth)

Transcribed from a fingering chart provided by the project owner (a piper).
The source chart was labelled **"Scottish small pipe fingering chart"**; the
nine-note fingering is the standard one shared with the Great Highland Bagpipe
practice chanter, and it matches the owner's separately-stated rules
(E-and-above keep the low-hand index/middle/ring down; C and D keep the pinky
down). This file is the canonical source for `src/chanter.ts`.

## Holes

Eight holes, listed in the order used by `covered[]` in `src/chanter.ts`:

| index | hole | finger |
|------:|------|--------|
| 0 | thumb (back) | left thumb |
| 1 | L1 | left index |
| 2 | L2 | left middle |
| 3 | L3 | left ring |
| 4 | R1 | right index |
| 5 | R2 | right middle |
| 6 | R3 | right ring |
| 7 | R4 | right little (pinky) |

## Chart

`●` = covered / closed, `○` = open / lifted.

| Note   | thumb | L1 | L2 | L3 | R1 | R2 | R3 | R4 |
|--------|:-----:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Low G  | ● | ● | ● | ● | ● | ● | ● | ● |
| Low A  | ● | ● | ● | ● | ● | ● | ● | ○ |
| B      | ● | ● | ● | ● | ● | ● | ○ | ○ |
| C      | ● | ● | ● | ● | ● | ○ | ○ | ● |
| D      | ● | ● | ● | ● | ○ | ○ | ○ | ● |
| E      | ● | ● | ● | ○ | ● | ● | ● | ○ |
| F      | ● | ● | ○ | ○ | ● | ● | ● | ○ |
| High G | ● | ○ | ○ | ○ | ● | ● | ● | ○ |
| High A | ○ | ○ | ○ | ● | ● | ● | ● | ○ |

## Notes / open questions

- **C and D** keep the pinky (R4) planted and lift the low hand above it: C
  opens R2+R3, D opens R1+R2+R3. (Not a single-hole cross-fingering.)
- **High A** is not all-open: thumb + top index (L1) + top middle (L2) lift,
  but the top ring (L3) comes back down and the whole low hand index/middle/
  ring (R1-R3) stays covered; pinky up.
- **Confirmed by the owner (2026-07-12):** the GHB practice chanter plays these
  fingerings exactly as shown, including the High A. This grid is final.
