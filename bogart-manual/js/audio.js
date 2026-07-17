// Pitch-adjustable practice-chanter audio engine (standalone, no build step).
//
// Frequencies and the synthesized reed tone are adapted from the main
// Bagpipe Lab app (src/chanter.ts), which anchors the scale at Low A = 440 Hz.
// Here every note is scaled at play time by a user-adjustable reference pitch
// so a student can tune the app's playback to their own chanter.
//
// Real Highland chanters run sharp of concert pitch: a modern band chanter's
// "A" is commonly around 470-484 Hz, while older/practice chanters sit lower.
// The reference-A control (see player.js) lets the student slide the whole
// instrument up or down to match what they actually hear.

// Base scale, Low A = 440 Hz. Hole order (for reference / diagrams):
// [thumb, L1, L2, L3 (top hand), R1, R2, R3, R4 (bottom hand)].
export const BASE_NOTES = [
  { name: 'Low G', freq: 392.0 },
  { name: 'Low A', freq: 440.0 },
  { name: 'B', freq: 493.88 },
  { name: 'C', freq: 554.37 },
  { name: 'D', freq: 587.33 },
  { name: 'E', freq: 659.25 },
  { name: 'F', freq: 739.99 },
  { name: 'High G', freq: 783.99 },
  { name: 'High A', freq: 880.0 },
]

const BASE_A = 440.0 // the reference pitch BASE_NOTES is written against

const nameToBase = new Map(BASE_NOTES.map((n) => [n.name, n.freq]))

let ctx = null

function getContext() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

/** Ensure the audio context is running. Call from a user gesture (a click). */
export function resumeAudio() {
  getContext()
}

/**
 * Frequency for a note name at a given reference pitch.
 * refA is the frequency the chanter's Low A should sound at (default 440).
 */
export function freqFor(noteName, refA = BASE_A) {
  const base = nameToBase.get(noteName)
  if (base == null) throw new Error(`Unknown note: ${noteName}`)
  return base * (refA / BASE_A)
}

/** Schedule one reed tone on the shared context at an absolute start time. */
function scheduleReedTone(audioCtx, freq, start, dur, peak) {
  const osc = audioCtx.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.value = freq

  const filter = audioCtx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = freq * 3.5
  filter.Q.value = 0.7

  const gain = audioCtx.createGain()
  const attack = Math.min(0.012, dur * 0.3)
  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(peak, start + attack)
  gain.gain.linearRampToValueAtTime(peak * 0.72, start + dur * 0.5)
  gain.gain.linearRampToValueAtTime(0, start + dur)

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(audioCtx.destination)

  osc.start(start)
  osc.stop(start + dur + 0.02)
  return { osc, gain }
}

/** Play a single note now, at the current reference pitch (tap-to-hear). */
export function playNote(noteName, refA = BASE_A) {
  const audioCtx = getContext()
  scheduleReedTone(audioCtx, freqFor(noteName, refA), audioCtx.currentTime, 0.85, 0.28)
}

/** Short metronome click. `accent` marks the first beat of a bar. */
export function playClick(audioCtx, start, accent = false) {
  const osc = audioCtx.createOscillator()
  osc.type = 'square'
  osc.frequency.value = accent ? 1600 : 1100

  const gain = audioCtx.createGain()
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(accent ? 0.16 : 0.1, start + 0.001)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.05)

  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start(start)
  osc.stop(start + 0.06)
}

/**
 * Play a sequence of notes as a play-along.
 *
 * @param {Array<{note:string, beats:number}>} notes
 * @param {object} opts
 * @param {number} opts.bpm            tempo in beats per minute
 * @param {number} [opts.beatsPerBar]  for metronome accenting (default 4)
 * @param {number} [opts.refA]         reference pitch for Low A (default 440)
 * @param {boolean}[opts.metronome]    play a click track (default true)
 * @param {(index:number|null)=>void} [opts.onNote]  called as each note starts
 *        (index into `notes`), and once with null when the sequence ends
 * @returns {{stop: () => void}} handle to cancel playback
 */
export function playSequence(notes, opts) {
  const {
    bpm,
    beatsPerBar = 4,
    refA = BASE_A,
    metronome = true,
    onNote,
  } = opts

  const audioCtx = getContext()
  const secPerBeat = 60 / bpm
  const startAt = audioCtx.currentTime + 0.15
  const timers = []
  let stopped = false

  // Schedule the reed tones + fire onNote highlights.
  let t = startAt
  let totalBeats = 0
  notes.forEach((n, i) => {
    const dur = n.beats * secPerBeat
    scheduleReedTone(audioCtx, freqFor(n.note, refA), t, Math.max(dur - 0.03, 0.05), 0.26)
    if (onNote) {
      const delayMs = (t - audioCtx.currentTime) * 1000
      timers.push(setTimeout(() => !stopped && onNote(i), Math.max(0, delayMs)))
    }
    t += dur
    totalBeats += n.beats
  })

  // Metronome click on every beat across the whole sequence.
  if (metronome) {
    const beats = Math.ceil(totalBeats)
    for (let b = 0; b < beats; b++) {
      playClick(audioCtx, startAt + b * secPerBeat, b % beatsPerBar === 0)
    }
  }

  // End callback.
  const endMs = (t - audioCtx.currentTime) * 1000
  timers.push(setTimeout(() => !stopped && onNote && onNote(null), Math.max(0, endMs)))

  return {
    stop() {
      stopped = true
      timers.forEach(clearTimeout)
      // A hard stop of scheduled oscillators would need per-node refs; for a
      // practice loop, letting already-scheduled tones ring out briefly is fine.
      // Recreate the context to silence everything immediately on stop.
      if (ctx) {
        ctx.close()
        ctx = null
      }
      if (onNote) onNote(null)
    },
  }
}
