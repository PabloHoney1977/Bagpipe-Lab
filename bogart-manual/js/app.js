// Page wiring: renders the global tuning control, a section index, each
// section's (currently pending) content, and the demo play-along so the audio
// engine is usable today.

import { createTuningControl, createExercisePlayer } from './player.js'
import { MANUAL_META, SECTIONS, DEMO_EXERCISE } from '../content/manual.js'

function el(tag, className, html) {
  const n = document.createElement(tag)
  if (className) n.className = className
  if (html != null) n.innerHTML = html
  return n
}

function renderHeader() {
  const header = document.querySelector('.site-header')
  header.innerHTML = `
    <p class="eyebrow">Interactive edition</p>
    <h1>${MANUAL_META.title}</h1>
    <p class="byline">${MANUAL_META.author} · ${MANUAL_META.year} · ${MANUAL_META.place}</p>
    <p class="permission">${MANUAL_META.permission}</p>
  `
}

function renderTuning() {
  document.querySelector('.tuning-slot').appendChild(createTuningControl())
}

function renderContents() {
  const nav = document.querySelector('.contents')
  const list = el('ol', 'contents-list')
  SECTIONS.forEach((s) => {
    const li = el('li')
    li.innerHTML = `<a href="#${s.id}">${s.number}. ${s.title}</a>${
      s.pending ? '<span class="pending-tag">pending source</span>' : ''
    }`
    list.appendChild(li)
  })
  nav.innerHTML = '<h2>Contents</h2>'
  nav.appendChild(list)
}

function renderSections() {
  const main = document.querySelector('.sections')
  SECTIONS.forEach((s) => {
    const sec = el('section', 'section')
    sec.id = s.id
    sec.appendChild(el('h2', 'section-title', `${s.number}. ${s.title}`))

    if (s.pending) {
      sec.appendChild(
        el(
          'div',
          'pending',
          `<strong>Awaiting source pages.</strong> The verbatim text and exercises
           for this section will appear here once the manual's pages for it are
           transcribed from the source images.`,
        ),
      )
    } else {
      sec.appendChild(el('div', 'section-body', s.body))
      s.exercises.forEach((ex) => sec.appendChild(createExercisePlayer(ex)))
    }
    main.appendChild(sec)
  })
}

function renderDemo() {
  const demo = document.querySelector('.demo')
  demo.innerHTML = `
    <h2>Try the play-along engine</h2>
    <p class="demo-note">This is a placeholder pattern (a plain scale run), not from the
    manual — it's here so you can test the audio and the chanter-pitch control before the
    real exercises are transcribed. Tune the chanter pitch above, then press play.</p>
  `
  demo.appendChild(createExercisePlayer(DEMO_EXERCISE))
}

// Theme toggle (respects system, remembers choice).
function initTheme() {
  const KEY = 'bogart-manual-theme'
  const saved = localStorage.getItem(KEY)
  if (saved) document.documentElement.dataset.theme = saved
  const btn = document.querySelector('.theme-toggle')
  btn?.addEventListener('click', () => {
    const cur =
      document.documentElement.dataset.theme ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    const next = cur === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    localStorage.setItem(KEY, next)
  })
}

renderHeader()
renderTuning()
renderContents()
renderSections()
renderDemo()
initTheme()
