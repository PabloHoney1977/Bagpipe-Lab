// Reusable exercise player UI. Renders play/stop, a tempo control, and a
// current-note readout. The chanter-pitch control is global (one per page)
// and shared through a small tuning store, so tuning the app once tunes every
// exercise on the page at the same time.

import { playSequence, playNote, resumeAudio, BASE_NOTES } from './audio.js'

// ---- Global tuning store ---------------------------------------------------

const REF_A_KEY = 'bogart-manual-refA'
const listeners = new Set()

function loadRefA() {
  const saved = Number(localStorage.getItem(REF_A_KEY))
  return Number.isFinite(saved) && saved >= 400 && saved <= 500 ? saved : 440
}

let refA = loadRefA()

export function getRefA() {
  return refA
}

export function setRefA(value) {
  refA = value
  localStorage.setItem(REF_A_KEY, String(value))
  listeners.forEach((fn) => fn(value))
}

function onRefAChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/**
 * Build the global chanter-pitch control. Slides the reference "A" the whole
 * instrument is tuned to, so playback matches the student's own chanter.
 * Returns a DOM element to place once, near the top of the page.
 */
export function createTuningControl() {
  const wrap = document.createElement('div')
  wrap.className = 'tuning'
  wrap.innerHTML = `
    <div class="tuning-head">
      <span class="tuning-title">Chanter pitch</span>
      <span class="tuning-value"><span class="tuning-hz">${refA.toFixed(0)}</span> Hz</span>
    </div>
    <input class="tuning-slider" type="range" min="415" max="490" step="1"
           value="${refA}" aria-label="Chanter reference pitch (A) in hertz" />
    <div class="tuning-scale">
      <span>Concert (415)</span><span>440</span><span>Band (~480)</span>
    </div>
    <p class="tuning-hint">Slide until the app matches the pitch of your own chanter, then tap a note to check. Highland chanters play sharp of concert pitch.</p>
    <div class="tuning-notes" role="group" aria-label="Tap a note to hear it"></div>
  `

  const slider = wrap.querySelector('.tuning-slider')
  const hz = wrap.querySelector('.tuning-hz')
  slider.addEventListener('input', () => {
    setRefA(Number(slider.value))
  })
  onRefAChange((v) => {
    slider.value = String(v)
    hz.textContent = v.toFixed(0)
  })

  // Tap-a-note reference row so the student can match the app to their chanter.
  const notesRow = wrap.querySelector('.tuning-notes')
  BASE_NOTES.forEach((n) => {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = 'note-chip'
    b.textContent = n.name
    b.addEventListener('click', () => {
      resumeAudio()
      playNote(n.name, refA)
    })
    notesRow.appendChild(b)
  })

  return wrap
}

// ---- Exercise player -------------------------------------------------------

/**
 * Render a play-along card for one exercise.
 * @param {object} exercise  { id, name, notes:[{note,beats}], bpm, beatsPerBar }
 * @returns {HTMLElement}
 */
export function createExercisePlayer(exercise) {
  const bpmDefault = exercise.bpm ?? 60
  const card = document.createElement('div')
  card.className = 'exercise'
  card.innerHTML = `
    <div class="exercise-head">
      <h3 class="exercise-name">${exercise.name}</h3>
      <div class="exercise-controls">
        <label class="tempo">
          Tempo <span class="tempo-val">${bpmDefault}</span> bpm
          <input class="tempo-slider" type="range" min="30" max="140" step="1" value="${bpmDefault}" />
        </label>
        <label class="metro">
          <input class="metro-toggle" type="checkbox" checked /> Metronome
        </label>
        <button class="play-btn" type="button">▶ Play along</button>
      </div>
    </div>
    <div class="exercise-notes" aria-hidden="true"></div>
    <div class="exercise-status" role="status"></div>
  `

  const playBtn = card.querySelector('.play-btn')
  const tempoSlider = card.querySelector('.tempo-slider')
  const tempoVal = card.querySelector('.tempo-val')
  const metroToggle = card.querySelector('.metro-toggle')
  const notesRow = card.querySelector('.exercise-notes')
  const status = card.querySelector('.exercise-status')

  // Render the note sequence as chips that highlight during playback.
  const chips = exercise.notes.map((n) => {
    const c = document.createElement('span')
    c.className = 'seq-note'
    c.textContent = n.note
    notesRow.appendChild(c)
    return c
  })

  tempoSlider.addEventListener('input', () => {
    tempoVal.textContent = tempoSlider.value
  })

  let handle = null

  function reset() {
    handle = null
    playBtn.textContent = '▶ Play along'
    chips.forEach((c) => c.classList.remove('active'))
    status.textContent = ''
  }

  playBtn.addEventListener('click', () => {
    if (handle) {
      handle.stop()
      reset()
      return
    }
    resumeAudio()
    playBtn.textContent = '■ Stop'
    handle = playSequence(exercise.notes, {
      bpm: Number(tempoSlider.value),
      beatsPerBar: exercise.beatsPerBar ?? 4,
      refA: getRefA(),
      metronome: metroToggle.checked,
      onNote: (i) => {
        chips.forEach((c) => c.classList.remove('active'))
        if (i == null) {
          reset()
          return
        }
        chips[i]?.classList.add('active')
        status.textContent = `Playing: ${exercise.notes[i].note}`
      },
    })
  })

  return card
}
