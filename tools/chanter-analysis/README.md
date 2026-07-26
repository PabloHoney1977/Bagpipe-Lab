# Chanter recording analysis

The scripts used to establish mic-input feasibility from the owner's practice
chanter recording on 2026-07-26. Findings are written up in
`reference/mic-input-design.md` §8a; these are kept so the next recording (a
tune, or a second chanter) can be measured the same way instead of re-deriving
the method.

## Setup

    pip install pillow numpy scipy soundfile

`soundfile` decodes mp3 directly — no ffmpeg needed, which matters because
ffmpeg is not installable in the sandbox.

## Use

Decode first, into the working directory the scripts expect:

```python
import soundfile as sf, numpy as np
data, sr = sf.read('recording.mp3')      # sr must be 44100
np.save('audio.npy', data.astype('float32'))
```

Then:

| script | what it does |
|---|---|
| `01-track-pitch.py` | coarse f0 + RMS track over the whole file; use it to find where the takes are and print a timeline |
| `02-measure-notes.py` | precise f0 per sustained note, with octave disambiguation and per-note stability in cents. **Edit the `segs` list** to the time spans found in step 1 |
| `03-measure-transitions.py` | fine-grained (1.45ms hop) transition timing and amplitude dip at each note change; also reports tone continuity |

## Notes / gotchas

- **Octave errors are the main hazard.** A naive harmonic-sum estimator locks
  onto the 2nd or 3rd partial. `02` penalises candidates with real energy at
  f0/2; always sanity-check with autocorrelation (ACF at the true f0 should be
  strongly positive while ACF at 2·f0 goes negative).
- A practice chanter is a **cylindrical closed pipe**, so expect a weak 2nd
  harmonic and a 3rd harmonic *stronger* than the 2nd. That signature is how you
  confirm you are looking at a practice chanter and not a pipe chanter.
- `02` is slow if you widen the search grid — it is O(candidates × harmonics).
  Keep the grid tight once the rough range is known.
- Measurement precision is about **±1.5 cents**, set by the search-grid
  quantisation. Do not report tighter than that.
