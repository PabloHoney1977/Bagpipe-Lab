export type Note = {
  name: string
  /**
   * Semitones above Low A, the chanter's reference note. The bagpipe scale
   * is written G A B C D E F G A, but sounds G A B C#-D E F#-G A — a chanter
   * "C" is really a C sharp and a chanter "F" is really an F sharp. Encoding
   * the intervals here (rather than raw A=440 frequencies) keeps those sharps
   * explicit and lets every pitch move together when the chanter is retuned.
   */
  semitones: number
  /** Sounding pitch when Low A = 440 Hz. Derived from `semitones`; actual
   * playback is retuned to the user's chanter via {@link noteFreq}. */
  freq: number
  /**
   * 8 holes: [thumb (back, top hand), L1, L2, L3 (top hand front),
   * R1, R2, R3, R4 (bottom hand front, R4 = pinky/bottom-most)].
   * true = covered/closed.
   */
  covered: boolean[]
}

/** Concert pitch that the written A=440 frequencies are anchored to. */
export const CONCERT_A = 440

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
//
// `semitones` is the interval above Low A. Note the +4 for "C" (a C sharp)
// and +9 for "F" (an F sharp) — the two notes pipers write natural but play
// sharp. See reference/fingering-chart.md.
const SCALE: { name: string; semitones: number; covered: boolean[] }[] = [
  { name: 'Low G', semitones: -2, covered: [true, true, true, true, true, true, true, true] },
  { name: 'Low A', semitones: 0, covered: [true, true, true, true, true, true, true, false] },
  { name: 'B', semitones: 2, covered: [true, true, true, true, true, true, false, false] },
  { name: 'C', semitones: 4, covered: [true, true, true, true, true, false, false, true] }, // C#
  { name: 'D', semitones: 5, covered: [true, true, true, true, false, false, false, true] },
  { name: 'E', semitones: 7, covered: [true, true, true, false, true, true, true, false] },
  { name: 'F', semitones: 9, covered: [true, true, false, false, true, true, true, false] }, // F#
  { name: 'High G', semitones: 10, covered: [true, false, false, false, true, true, true, false] },
  { name: 'High A', semitones: 12, covered: [false, false, false, true, true, true, true, false] },
]

export const NOTES: Note[] = SCALE.map((s) => ({
  name: s.name,
  semitones: s.semitones,
  freq: CONCERT_A * Math.pow(2, s.semitones / 12),
  covered: s.covered,
}))

/* ------------------------------------------------------------------ */
/* Chanter tuning — real chanters are not pitched to concert A=440.    */
/* The user dials their chanter's Low A frequency; every note shifts   */
/* with it, preserving the intervals above.                            */
/* ------------------------------------------------------------------ */

/** Sensible range for a chanter's Low A: from concert A up past the
 * bright, sharp pitch of a modern pipe-band chanter (~480 Hz). */
export const TUNING_MIN = 430
export const TUNING_MAX = 495
export const TUNING_DEFAULT = CONCERT_A
const TUNING_KEY = 'bagpipe-lab-tuning'

function clampTuning(hz: number): number {
  if (!Number.isFinite(hz)) return TUNING_DEFAULT
  return Math.min(TUNING_MAX, Math.max(TUNING_MIN, hz))
}

let lowAFreq = ((): number => {
  try {
    const raw = localStorage.getItem(TUNING_KEY)
    if (raw != null) return clampTuning(parseFloat(raw))
  } catch {
    /* ignore storage failures */
  }
  return TUNING_DEFAULT
})()

/** Current chanter Low A, in Hz. */
export function getTuning(): number {
  return lowAFreq
}

/** Set the chanter's Low A frequency (Hz); persists and retunes all audio. */
export function setTuning(hz: number): number {
  lowAFreq = clampTuning(hz)
  try {
    localStorage.setItem(TUNING_KEY, String(lowAFreq))
  } catch {
    /* ignore storage failures */
  }
  return lowAFreq
}

/** Sounding frequency of an A=440-anchored pitch at the current tuning. */
export function tunedFreq(freqAt440: number): number {
  return freqAt440 * (lowAFreq / CONCERT_A)
}

/** Sounding frequency of a note at the current chanter tuning. */
export function noteFreq(note: Note): number {
  return tunedFreq(note.freq)
}

let ctx: AudioContext | null = null

function getContext(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

/**
 * Synthesized stand-in reed tone, pending recorded chanter samples.
 * `freq` is the pitch anchored at concert A=440; it is retuned to the
 * user's chanter here so every call site respects the tuning dial.
 */
export function playChanterNote(freq: number) {
  const audioCtx = getContext()
  const now = audioCtx.currentTime
  const sounding = tunedFreq(freq)

  const osc = audioCtx.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.value = sounding

  const filter = audioCtx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = sounding * 3.5
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
