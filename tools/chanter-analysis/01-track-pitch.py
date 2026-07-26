import numpy as np
x = np.load('audio.npy').astype(np.float64)
sr = 44100
N, HOP = 2048, 512
win = np.hanning(N)

# harmonic-sum f0 estimator: robust to octave errors on a harmonically rich reed
fmin, fmax = 340.0, 1150.0
cands = fmin * (2 ** (np.arange(0, 1400) / 1200.0))   # 1-cent grid to ~1150Hz
cands = cands[cands <= fmax]

nfft = 8192
freqs = np.fft.rfftfreq(nfft, 1/sr)
def bin_of(f): return np.clip((f/ (sr/nfft)).astype(int), 0, len(freqs)-1)
HARM = 8
cand_bins = np.stack([bin_of(cands*k) for k in range(1, HARM+1)])  # (HARM, ncand)

f0s, rms, times = [], [], []
for start in range(0, len(x)-N, HOP):
    fr = x[start:start+N] * win
    r = np.sqrt((fr**2).mean())
    rms.append(r); times.append(start/sr)
    if r < 0.01:
        f0s.append(np.nan); continue
    mag = np.abs(np.fft.rfft(fr, nfft))
    score = mag[cand_bins].sum(axis=0)
    f0s.append(cands[int(np.argmax(score))])

f0 = np.array(f0s); rms = np.array(rms); t = np.array(times)
np.save('f0.npy', f0); np.save('rms.npy', rms); np.save('t.npy', t)

voiced = ~np.isnan(f0)
print(f"frames={len(f0)} voiced={voiced.sum()} ({100*voiced.mean():.1f}%)  hop={HOP/sr*1000:.1f}ms")
print(f"rms: min {rms.min():.4f} med {np.median(rms):.4f} max {rms.max():.4f}")
print(f"f0 range: {np.nanmin(f0):.1f} - {np.nanmax(f0):.1f} Hz")

# how continuous is the tone? (a chanter's reed should never stop)
gaps = (~voiced).astype(int)
print(f"silent frames: {gaps.sum()} ({100*gaps.mean():.1f}%)")
