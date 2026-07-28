// Mic-based chanter tuner. A student can't drag a slider while both hands are on
// the chanter, so instead they tap "Tune to your chanter", sound a steady Low A,
// and we detect its pitch and set the app's tuning to match. This is also the
// gentlest possible use of the mic — detecting one sustained tone is far easier
// than the note-onset detection the scoring engine will later need.

export type TuneResult = { ok: true; hz: number } | { ok: false; reason: 'denied' | 'no-signal' }

// A chanter's Low A always lands in a known band (concert-ish practice chanters
// up to sharp band chanters), and B sits above ~491 Hz, so searching only this
// band both centres us on Low A and makes detection immune to octave/harmonic
// errors — we never look at lags outside it.
const SEARCH_MIN_HZ = 415
const SEARCH_MAX_HZ = 492
const LISTEN_MS = 2200
const MIN_RMS = 0.01
const MIN_CLARITY = 0.4

function rms(buf: Float32Array): number {
  let sum = 0
  for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i]
  return Math.sqrt(sum / buf.length)
}

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

/**
 * Estimate the fundamental of a sustained tone by autocorrelation, searching
 * only the lag range that maps to a chanter's Low A band. Returns null when
 * nothing periodic and clear is present. Parabolic interpolation around the peak
 * gives sub-sample (sub-hertz) accuracy — enough to tune by.
 */
function detectPitch(buf: Float32Array, sampleRate: number): number | null {
  const minLag = Math.floor(sampleRate / SEARCH_MAX_HZ)
  const maxLag = Math.ceil(sampleRate / SEARCH_MIN_HZ)

  let energy = 0
  for (let i = 0; i < buf.length; i++) energy += buf[i] * buf[i]
  if (energy < 1e-6) return null
  const perSample = energy / buf.length

  const corrs: number[] = []
  let bestLag = -1
  let bestCorr = 0
  for (let lag = minLag; lag <= maxLag; lag++) {
    let c = 0
    for (let i = 0; i < buf.length - lag; i++) c += buf[i] * buf[i + lag]
    c /= buf.length - lag
    corrs.push(c)
    if (c > bestCorr) {
      bestCorr = c
      bestLag = lag
    }
  }
  if (bestLag < 0 || bestCorr / perSample < MIN_CLARITY) return null

  // Parabolic interpolation around the correlation peak.
  const i = bestLag - minLag
  const cm = corrs[i - 1] ?? bestCorr
  const cp = corrs[i + 1] ?? bestCorr
  const denom = cm - 2 * bestCorr + cp
  const refinedLag = denom !== 0 ? bestLag + (0.5 * (cm - cp)) / denom : bestLag

  return sampleRate / refinedLag
}

/**
 * Listen briefly through the mic and return the detected Low A frequency. The
 * caller sets the app tuning from it. `onLevel` reports input loudness (0–1) so
 * the UI can show that the mic is hearing something.
 */
export async function detectChanterLowA(onLevel?: (level: number) => void): Promise<TuneResult> {
  let stream: MediaStream
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    })
  } catch {
    return { ok: false, reason: 'denied' }
  }

  const ctx = new AudioContext()
  const source = ctx.createMediaStreamSource(stream)
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 2048
  source.connect(analyser)
  const buf = new Float32Array(analyser.fftSize)
  const estimates: number[] = []

  // Poll on a timer, not requestAnimationFrame: rAF is throttled when the tab
  // isn't painting (backgrounded, or headless), which would stall the capture.
  await new Promise<void>((resolve) => {
    const start = performance.now()
    const tick = () => {
      analyser.getFloatTimeDomainData(buf)
      const level = rms(buf)
      onLevel?.(Math.min(1, level * 8))
      if (level > MIN_RMS) {
        const hz = detectPitch(buf, ctx.sampleRate)
        if (hz != null && hz >= SEARCH_MIN_HZ && hz <= SEARCH_MAX_HZ) estimates.push(hz)
      }
      if (performance.now() - start < LISTEN_MS) window.setTimeout(tick, 45)
      else resolve()
    }
    tick()
  })

  stream.getTracks().forEach((t) => t.stop())
  void ctx.close()

  if (estimates.length < 3) return { ok: false, reason: 'no-signal' }
  return { ok: true, hz: median(estimates) }
}
