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

// Great Highland Bagpipe / smallpipe fingering chart, transcribed from the
// user-provided fingering chart (see reference/fingering-chart.md). This is
// NOT a recorder-style "lift one hole at a time" scale:
//   - Low A, then B, lift from the bottom of the low hand (pinky, then ring).
//   - C and D keep the pinky (R4) planted and lift the low hand above it
//     progressively (C opens R2+R3; D opens R1+R2+R3).
//   - Every note E and above keeps the low-hand index/middle/ring (R1-R3)
//     covered while the top hand opens from the bottom up (ring for E, then
//     middle for F, then index for High G).
//   - High A lifts the thumb and the top index+middle, but the top ring (L3)
//     comes back down and the low hand (R1-R3) stays covered.
// Hole order: [thumb, L1, L2, L3 (top hand), R1, R2, R3, R4 (bottom hand)].
export const NOTES: Note[] = [
  { name: 'Low G', freq: 392.0, covered: [true, true, true, true, true, true, true, true] },
  { name: 'Low A', freq: 440.0, covered: [true, true, true, true, true, true, true, false] },
  { name: 'B', freq: 493.88, covered: [true, true, true, true, true, true, false, false] },
  { name: 'C', freq: 554.37, covered: [true, true, true, true, true, false, false, true] },
  { name: 'D', freq: 587.33, covered: [true, true, true, true, false, false, false, true] },
  { name: 'E', freq: 659.25, covered: [true, true, true, false, true, true, true, false] },
  { name: 'F', freq: 739.99, covered: [true, true, false, false, true, true, true, false] },
  { name: 'High G', freq: 783.99, covered: [true, false, false, false, true, true, true, false] },
  { name: 'High A', freq: 880.0, covered: [false, false, false, true, true, true, true, false] },
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

/** Short metronome click. `accent` marks the first beat of a bar. */
export function playClick(accent = false) {
  const audioCtx = getContext()
  const now = audioCtx.currentTime

  const osc = audioCtx.createOscillator()
  osc.type = 'square'
  osc.frequency.value = accent ? 1600 : 1100

  const gain = audioCtx.createGain()
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(accent ? 0.16 : 0.1, now + 0.001)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)

  osc.connect(gain)
  gain.connect(audioCtx.destination)

  osc.start(now)
  osc.stop(now + 0.06)
}

/** Ensure the audio context is running (call from a user gesture). */
export function resumeAudio() {
  getContext()
}
