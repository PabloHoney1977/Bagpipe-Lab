# Bagpipes: The Manual — Interactive Edition

A standalone, no-build web edition of Lloyd M. Bogart's _Bagpipes: The Manual_
(© 1990, La Crosse, WI), with playable, pitch-adjustable audio so a student can
play along with every exercise on their own chanter.

Standalone for now; designed to fold into the LDPD website later.

## Provenance & permission

This edition reproduces the manual **by permission of the author, Lloyd M.
Bogart.** Record the specifics of that permission here (date, scope, any
attribution wording the author requested) so the basis for reproduction is
documented alongside the content.

Verbatim text and exercise note-data must be transcribed **directly from the
source pages.** Do not reconstruct them from memory or from the summaries in the
main app's `reference/` folder — those are original re-expressions written for a
different project, not the manual's wording.

## Status

The engine is built; the content is pending the source page images.

- **Built:** page shell, contents, light/dark theme, the play-along audio engine,
  and the global **chanter-pitch control** (a reference-A slider, 415–490 Hz,
  that tunes all playback to the student's own chanter).
- **Pending:** every section's verbatim text and its exercises. `content/manual.js`
  holds a section skeleton with empty `body`/`exercises` fields marked
  `pending: true`, plus one clearly-labeled original placeholder exercise
  (`DEMO_EXERCISE`, a plain scale run — **not from the book**) so the audio can be
  tested before the real content lands.

## How to fill in content

For each section, in `content/manual.js`:

1. Transcribe the section's prose verbatim into its `body` string.
2. Transcribe each exercise into `exercises` as
   `{ name, notes: [{ note, beats }], bpm, beatsPerBar }`, where `note` matches a
   name in `BASE_NOTES` (`js/audio.js`): Low G, Low A, B, C, D, E, F, High G, High A.
3. Set `pending: false` for that section.

Remove `DEMO_EXERCISE` (and its render in `js/app.js`) once real exercises exist.

## Run locally

No build step. Serve the folder over HTTP (module scripts need a server):

```
cd bogart-manual
python3 -m http.server 8000
# open http://localhost:8000
```

## Files

- `index.html` — page shell
- `styles.css` — theme + layout
- `js/audio.js` — reed-tone synth, pitch scaling (`freqFor`, `playNote`, `playSequence`)
- `js/player.js` — global tuning control + reusable exercise-player UI
- `js/app.js` — page wiring
- `content/manual.js` — content model (section skeleton + placeholder demo)
