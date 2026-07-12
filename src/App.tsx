import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { GUIDE_UNITS, GUIDE_FLAT, findGuideLesson } from './curriculum'
import { MeetTheChanter } from './MeetTheChanter'
import { TheScale } from './TheScale'
import { ComingSoon } from './ui'

type Tab = 'guide' | 'scale' | 'play' | 'embellishments'

const STORAGE_KEY = 'bagpipe-lab-progress'

function loadProgress(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function App() {
  const [tab, setTab] = useState<Tab>('guide')

  return (
    <div className="app">
      <main className="app-main">
        {tab === 'guide' && <GuideTab />}
        {tab === 'scale' && <ScaleTab />}
        {tab === 'play' && <PlayTab />}
        {tab === 'embellishments' && <EmbellishmentsTab />}
      </main>

      <nav className="tab-bar" aria-label="Sections">
        <div className="tab-bar-inner">
          <TabButton label="Guide" active={tab === 'guide'} onClick={() => setTab('guide')} icon={<GuideIcon />} />
          <TabButton label="Scale" active={tab === 'scale'} onClick={() => setTab('scale')} icon={<ScaleIcon />} />
          <TabButton label="Play" active={tab === 'play'} onClick={() => setTab('play')} icon={<PlayIcon />} />
          <TabButton
            label="Grace notes"
            active={tab === 'embellishments'}
            onClick={() => setTab('embellishments')}
            icon={<GraceIcon />}
          />
        </div>
      </nav>
    </div>
  )
}

function TabButton({
  label,
  active,
  onClick,
  icon,
}: {
  label: string
  active: boolean
  onClick: () => void
  icon: ReactNode
}) {
  return (
    <button type="button" className={active ? 'tab is-active' : 'tab'} onClick={onClick} aria-current={active}>
      <span className="tab-icon">{icon}</span>
      <span className="tab-label">{label}</span>
    </button>
  )
}

/* ---------------------------------------------------------------- */
/* Guide tab — the written course                                   */
/* ---------------------------------------------------------------- */

function GuideTab() {
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [completed, setCompleted] = useState<Set<string>>(() => new Set(loadProgress()))

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]))
    } catch {
      /* ignore storage failures */
    }
  }, [completed])

  useEffect(() => {
    document.querySelector('.app-main')?.scrollTo({ top: 0 })
  }, [currentId])

  function markComplete(id: string) {
    setCompleted((prev) => new Set(prev).add(id))
  }

  const current = currentId ? findGuideLesson(currentId) : undefined
  const total = GUIDE_FLAT.length
  const done = GUIDE_FLAT.filter((f) => completed.has(f.lesson.id)).length

  if (!current) {
    const pct = total ? Math.round((done / total) * 100) : 0
    return (
      <div className="contents">
        <header className="contents-head">
          <p className="brand-eyebrow">Practice chanter → Highland pipes</p>
          <h1 className="brand-title">Bagpipe Lab</h1>
          <p className="brand-sub">A step-by-step guide from your very first note to playing real tunes.</p>
          <div className="progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="progress-text">
              {done} of {total} read
            </span>
          </div>
        </header>

        <div className="units">
          {GUIDE_UNITS.map((unit, ui) => (
            <section key={unit.id} className="unit">
              <div className="unit-head">
                <span className="unit-num">{ui + 1}</span>
                <div>
                  <h2 className="unit-title">{unit.title}</h2>
                  <p className="unit-summary">{unit.summary}</p>
                </div>
              </div>
              <ul className="lesson-list">
                {unit.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <button type="button" className="lesson-row" onClick={() => setCurrentId(lesson.id)}>
                      <span className={completed.has(lesson.id) ? 'check is-done' : 'check'} aria-hidden="true">
                        {completed.has(lesson.id) ? '✓' : ''}
                      </span>
                      <span className="lesson-row-text">
                        <span className="lesson-row-title">{lesson.title}</span>
                        {lesson.subtitle ? <span className="lesson-row-sub">{lesson.subtitle}</span> : null}
                      </span>
                      <span className="lesson-row-arrow" aria-hidden="true">›</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="contents-foot">
          When your fingers know the way, head to the <strong>Scale</strong> and <strong>Play</strong> tabs to practise.
        </p>
      </div>
    )
  }

  const prev = current.index > 0 ? GUIDE_FLAT[current.index - 1] : undefined
  const next = current.index < total - 1 ? GUIDE_FLAT[current.index + 1] : undefined

  return (
    <article className="lesson-view">
      <div className="lesson-top">
        <button type="button" className="link-button" onClick={() => setCurrentId(null)}>
          ‹ All lessons
        </button>
        <span className="lesson-unit">{current.unit.title}</span>
      </div>

      <header className="lesson-head">
        <h1 className="lesson-title">{current.lesson.title}</h1>
        {current.lesson.subtitle ? <p className="lesson-sub">{current.lesson.subtitle}</p> : null}
      </header>

      <div className="lesson-content">{current.lesson.render()}</div>

      <nav className="lesson-nav">
        <button
          type="button"
          className="nav-button"
          disabled={!prev}
          onClick={() => prev && setCurrentId(prev.lesson.id)}
        >
          ‹ Previous
        </button>
        <button
          type="button"
          className={completed.has(current.lesson.id) ? 'done-button is-done' : 'done-button'}
          onClick={() => markComplete(current.lesson.id)}
        >
          {completed.has(current.lesson.id) ? '✓ Read' : 'Mark as read'}
        </button>
        {next ? (
          <button
            type="button"
            className="nav-button nav-primary"
            onClick={() => {
              markComplete(current.lesson.id)
              setCurrentId(next.lesson.id)
            }}
          >
            Next ›
          </button>
        ) : (
          <button
            type="button"
            className="nav-button nav-primary"
            onClick={() => {
              markComplete(current.lesson.id)
              setCurrentId(null)
            }}
          >
            Finish ✓
          </button>
        )}
      </nav>
    </article>
  )
}

/* ---------------------------------------------------------------- */
/* Scale / Play / Grace-notes tabs                                  */
/* ---------------------------------------------------------------- */

function ToolHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="tool-header">
      <h1 className="tool-title">{title}</h1>
      <p className="tool-sub">{subtitle}</p>
    </header>
  )
}

function ScaleTab() {
  return (
    <div className="tool">
      <ToolHeader title="The scale" subtitle="Play the octave low to high and back, and watch the fingering move." />
      <TheScale />
    </div>
  )
}

function PlayTab() {
  return (
    <div className="tool">
      <ToolHeader title="Play" subtitle="Tap any note to hear it and see exactly which holes to seal." />
      <MeetTheChanter />
      <div className="tool-note">
        <p>
          <strong>Play-along tunes are coming.</strong> Soon this is where you’ll play simple melodies against a steady
          beat, scored on your timing and finger accuracy.
        </p>
      </div>
    </div>
  )
}

function EmbellishmentsTab() {
  return (
    <div className="tool">
      <ToolHeader title="Grace notes" subtitle="The movements that make piping sound like piping." />
      <ComingSoon>
        <p>
          Because a chanter can’t stop between two of the same note, pipers use tiny grace-note movements to separate
          them. This is where you’ll learn the doubling — your first embellishment — then build up through strikes,
          grips, throws, and more, each practised in the tune that calls for it.
        </p>
      </ComingSoon>
    </div>
  )
}

/* ---------------------------------------------------------------- */
/* Tab-bar icons                                                    */
/* ---------------------------------------------------------------- */

function GuideIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z" />
      <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z" />
    </svg>
  )
}

function ScaleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 19h4v-4M10 15h4V9M16 9h4V5" />
      <path d="M4 19 20 5" opacity="0.35" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M7 5v14l11-7z" />
    </svg>
  )
}

function GraceIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="7" cy="17" r="2.5" />
      <path d="M9.5 16V5l8 2v9" />
      <circle cx="17" cy="16" r="2.5" />
    </svg>
  )
}

export default App
