export type Note = {
  name: string
  freq: number
  /**
   * 8 holes: [thumb (back, top hand), L1, L2, L3 (top hand front),
   * R1, R2, R3, R4 (bottom hand front, R4 = pinky/bottom-most)].
   * true = covered/closed.
   */
  covered: boolean[]
}

// Standard Highland chanter fingering chart. Low G through F uncover the
// front holes bottom-up with the thumb held down throughout. High G and
// High A are overblown notes with distinct fingerings, not a continuation
// of the same pattern: High G re-covers R1-R3 while opening the top hand
// (except the thumb), and High A opens everything including the thumb.
export const NOTES: Note[] = [
  { name: 'Low G', freq: 392.0, covered: [true, true, true, true, true, true, true, true] },
  { name: 'Low A', freq: 440.0, covered: [true, true, true, true, true, true, true, false] },
  { name: 'B', freq: 493.88, covered: [true, true, true, true, true, true, false, false] },
  { name: 'C', freq: 554.37, covered: [true, true, true, true, true, false, false, false] },
  { name: 'D', freq: 587.33, covered: [true, true, true, true, false, false, false, false] },
  { name: 'E', freq: 659.25, covered: [true, true, true, false, false, false, false, false] },
  { name: 'F', freq: 739.99, covered: [true, true, false, false, false, false, false, false] },
  { name: 'High G', freq: 783.99, covered: [true, false, false, false, true, true, true, false] },
  { name: 'High A', freq: 880.0, covered: [false, false, false, false, false, false, false, false] },
]

let ctx: AudioContext | null = null

function getContext(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

/** Synthesized stand-in reed tone, pending recorded chanter samples. */
export function playChanterNote(freq: number) {
  const audioCtx = getContext()
  const now = audioCtx.currentTime

  const osc = audioCtx.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.value = freq

  const filter = audioCtx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = freq * 3.5
  filter.Q.value = 0.7

  const gain = audioCtx.createGain()
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.28, now + 0.02)
  gain.gain.linearRampToValueAtTime(0.2, now + 0.4)
  gain.gain.linearRampToValueAtTime(0, now + 0.85)

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(audioCtx.destination)

  osc.start(now)
  osc.stop(now + 0.9)
}
