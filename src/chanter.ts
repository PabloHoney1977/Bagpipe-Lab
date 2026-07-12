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

// Standard Great Highland Bagpipe fingering chart. This is NOT a recorder-
// style "lift one hole at a time" scale:
//   - Low A and B lift from the bottom of the low hand (pinky, then ring).
//   - C and D are cross-fingered: the pinky (R4) comes back down and a single
//     higher low-hand hole opens (R2 for C, R1 for D).
//   - Every note E and above keeps the low-hand index/middle/ring (R1-R3)
//     covered while the top hand opens from the bottom up (ring for E, then
//     middle for F, then index for High G); High A also lifts the thumb.
// Hole order: [thumb, L1, L2, L3 (top hand), R1, R2, R3, R4 (bottom hand)].
export const NOTES: Note[] = [
  { name: 'Low G', freq: 392.0, covered: [true, true, true, true, true, true, true, true] },
  { name: 'Low A', freq: 440.0, covered: [true, true, true, true, true, true, true, false] },
  { name: 'B', freq: 493.88, covered: [true, true, true, true, true, true, false, false] },
  { name: 'C', freq: 554.37, covered: [true, true, true, true, true, false, true, true] },
  { name: 'D', freq: 587.33, covered: [true, true, true, true, false, true, true, true] },
  { name: 'E', freq: 659.25, covered: [true, true, true, false, true, true, true, false] },
  { name: 'F', freq: 739.99, covered: [true, true, false, false, true, true, true, false] },
  { name: 'High G', freq: 783.99, covered: [true, false, false, false, true, true, true, false] },
  { name: 'High A', freq: 880.0, covered: [false, false, false, false, true, true, true, false] },
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
