import { useEffect, useState } from 'react'
import { CURRICULUM, FLAT_LESSONS, findFlat } from './curriculum'

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
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [completed, setCompleted] = useState<Set<string>>(() => new Set(loadProgress()))

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]))
    } catch {
      /* ignore storage failures (private mode, etc.) */
    }
  }, [completed])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [currentId])

  function markComplete(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const current = currentId ? findFlat(currentId) : undefined
  const total = FLAT_LESSONS.length
  const done = FLAT_LESSONS.filter((f) => completed.has(f.lesson.id)).length

  if (!current) {
    return (
      <Contents
        completedCount={done}
        total={total}
        isDone={(id) => completed.has(id)}
        onOpen={setCurrentId}
      />
    )
  }

  const prev = current.index > 0 ? FLAT_LESSONS[current.index - 1] : undefined
  const next = current.index < total - 1 ? FLAT_LESSONS[current.index + 1] : undefined

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
          {completed.has(current.lesson.id) ? '✓ Done' : 'Mark as done'}
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

function Contents({
  completedCount,
  total,
  isDone,
  onOpen,
}: {
  completedCount: number
  total: number
  isDone: (id: string) => boolean
  onOpen: (id: string) => void
}) {
  const pct = total ? Math.round((completedCount / total) * 100) : 0
  return (
    <div className="contents">
      <header className="contents-head">
        <p className="brand-eyebrow">Practice chanter → Highland pipes</p>
        <h1 className="brand-title">Bagpipe Lab</h1>
        <p className="brand-sub">A step-by-step course from your very first note to playing real tunes.</p>
        <div className="progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-text">
            {completedCount} of {total} lessons
          </span>
        </div>
      </header>

      <div className="units">
        {CURRICULUM.map((unit, ui) => (
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
                  <button type="button" className="lesson-row" onClick={() => onOpen(lesson.id)}>
                    <span className={isDone(lesson.id) ? 'check is-done' : 'check'} aria-hidden="true">
                      {isDone(lesson.id) ? '✓' : ''}
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

      <footer className="contents-foot">
        Free to learn on. Public-domain tunes only. Made for pipers, by the Highland Music portfolio.
      </footer>
    </div>
  )
}

export default App
