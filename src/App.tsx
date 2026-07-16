import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { STAGES, PHASES, stagesInPhase } from './curriculum'
import type { Stage } from './curriculum'
import { MeetTheChanter } from './MeetTheChanter'
import { TheScale } from './TheScale'
import { RhythmLane } from './RhythmLane'
import { StaffPlayer } from './StaffPlayer'
import { EXERCISES } from './tunes'
import { ComingSoon } from './ui'
import type { Tab, PlayMode, Preset } from './nav'

const STORAGE_KEY = 'bagpipe-lab-progress' // stage ids marked done
const CHECK_KEY = 'bagpipe-lab-checklist' // per-item checklist ticks

function loadSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function saveSet(key: string, set: Set<string>) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]))
  } catch {
    /* ignore storage failures */
  }
}

function App() {
  const [tab, setTab] = useState<Tab>('guide')
  const [playMode, setPlayMode] = useState<PlayMode>('feel')
  const [playExerciseId, setPlayExerciseId] = useState(EXERCISES[0].id)

  const openPreset = useCallback((p: Preset) => {
    if (p.playMode) setPlayMode(p.playMode)
    if (p.exerciseId) setPlayExerciseId(p.exerciseId)
    setTab(p.tab)
    document.querySelector('.app-main')?.scrollTo({ top: 0 })
  }, [])

  return (
    <div className="app">
      <main className="app-main">
        {tab === 'guide' && <GuideTab openPreset={openPreset} />}
        {tab === 'scale' && <ScaleTab />}
        {tab === 'play' && (
          <PlayTab
            mode={playMode}
            setMode={setPlayMode}
            exerciseId={playExerciseId}
            setExerciseId={setPlayExerciseId}
          />
        )}
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

function GuideTab({ openPreset }: { openPreset: (p: Preset) => void }) {
  const [done, setDone] = useState<Set<string>>(() => loadSet(STORAGE_KEY))
  const [ticks, setTicks] = useState<Set<string>>(() => loadSet(CHECK_KEY))
  const [openId, setOpenId] = useState<string | null>(() => {
    const d = loadSet(STORAGE_KEY)
    return STAGES.find((s) => !d.has(s.id))?.id ?? null
  })

  useEffect(() => saveSet(STORAGE_KEY, done), [done])
  useEffect(() => saveSet(CHECK_KEY, ticks), [ticks])

  function toggleDone(id: string) {
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleTick(key: string) {
    setTicks((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const total = STAGES.length
  const doneCount = STAGES.filter((s) => done.has(s.id)).length
  const pct = total ? Math.round((doneCount / total) * 100) : 0

  return (
    <div className="contents">
      <header className="contents-head">
        <p className="brand-eyebrow">Practice chanter → Highland pipes</p>
        <h1 className="brand-title">Bagpipe Lab</h1>
        <p className="brand-sub">Your path from a first note to real tunes — read a stage, then practise it in the tools.</p>
        <div className="progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-text">
            {doneCount} of {total} done
          </span>
        </div>
      </header>

      <div className="path">
        {PHASES.map((phase, pi) => (
          <section key={phase} className="phase">
            <h2 className="phase-title">
              <span className="phase-num">Phase {pi + 1}</span>
              {phase}
            </h2>
            {stagesInPhase(phase).map((stage) => {
              const n = STAGES.indexOf(stage) + 1
              return (
                <StageCard
                  key={stage.id}
                  n={n}
                  stage={stage}
                  isDone={done.has(stage.id)}
                  isOpen={openId === stage.id}
                  onToggleOpen={() => setOpenId((cur) => (cur === stage.id ? null : stage.id))}
                  onToggleDone={() => toggleDone(stage.id)}
                  ticks={ticks}
                  onToggleTick={toggleTick}
                  openPreset={openPreset}
                />
              )
            })}
          </section>
        ))}
      </div>
    </div>
  )
}

function StageCard({
  n,
  stage,
  isDone,
  isOpen,
  onToggleOpen,
  onToggleDone,
  ticks,
  onToggleTick,
  openPreset,
}: {
  n: number
  stage: Stage
  isDone: boolean
  isOpen: boolean
  onToggleOpen: () => void
  onToggleDone: () => void
  ticks: Set<string>
  onToggleTick: (key: string) => void
  openPreset: (p: Preset) => void
}) {
  const [whyOpen, setWhyOpen] = useState(false)

  return (
    <div className={`stage${isDone ? ' is-done' : ''}${isOpen ? ' is-open' : ''}`} id={`stage-${stage.id}`}>
      <button type="button" className="stage-head" onClick={onToggleOpen} aria-expanded={isOpen}>
        <span className={isDone ? 'stage-check is-done' : 'stage-check'} aria-hidden="true">
          {isDone ? '✓' : n}
        </span>
        <span className="stage-head-text">
          <span className="stage-title">{stage.title}</span>
          {stage.time ? <span className="stage-time">{stage.time}</span> : null}
        </span>
        <span className="stage-chevron" aria-hidden="true">
          {isOpen ? '▾' : '▸'}
        </span>
      </button>

      {isOpen ? (
        <div className="stage-body">
          <div className="stage-concept prose">{stage.concept}</div>

          {stage.ctas?.length ? (
            <div className="stage-ctas">
              {stage.ctas.map((cta) => (
                <button key={cta.label} type="button" className="cta-button" onClick={() => openPreset(cta.preset)}>
                  {cta.label} ›
                </button>
              ))}
            </div>
          ) : null}

          {stage.checklist?.length ? (
            <ul className="stage-checklist">
              {stage.checklist.map((item, i) => {
                const key = `${stage.id}:${i}`
                const checked = ticks.has(key)
                return (
                  <li key={key}>
                    <button
                      type="button"
                      className={checked ? 'tick-row is-checked' : 'tick-row'}
                      onClick={() => onToggleTick(key)}
                    >
                      <span className="tick-box" aria-hidden="true">
                        {checked ? '✓' : ''}
                      </span>
                      <span className="tick-text">{item}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : null}

          {stage.mastery ? <p className="stage-mastery">{stage.mastery}</p> : null}

          {stage.why ? (
            <div className="stage-why">
              <button type="button" className="why-toggle" onClick={() => setWhyOpen((v) => !v)}>
                <span aria-hidden="true">{whyOpen ? '▾' : '▸'}</span> Why it works
              </button>
              {whyOpen ? <div className="why-body">{stage.why()}</div> : null}
            </div>
          ) : null}

          <button type="button" className={isDone ? 'done-button is-done' : 'done-button'} onClick={onToggleDone}>
            {isDone ? '✓ Done' : 'Mark this stage done'}
          </button>
        </div>
      ) : null}
    </div>
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

function PlayTab({
  mode,
  setMode,
  exerciseId,
  setExerciseId,
}: {
  mode: PlayMode
  setMode: (m: PlayMode) => void
  exerciseId: string
  setExerciseId: (id: string) => void
}) {
  const exercise = EXERCISES.find((e) => e.id === exerciseId) ?? EXERCISES[0]

  return (
    <div className="tool">
      <ToolHeader title="Play" subtitle="Feel the pulse, read the music, or explore each note freely." />

      <div className="segmented segmented-3">
        <button type="button" className={mode === 'feel' ? 'seg is-active' : 'seg'} onClick={() => setMode('feel')}>
          Feel the pulse
        </button>
        <button type="button" className={mode === 'read' ? 'seg is-active' : 'seg'} onClick={() => setMode('read')}>
          Read the music
        </button>
        <button type="button" className={mode === 'notes' ? 'seg is-active' : 'seg'} onClick={() => setMode('notes')}>
          Explore notes
        </button>
      </div>

      {mode === 'notes' ? (
        <MeetTheChanter />
      ) : (
        <>
          <div className="exercise-picker">
            {EXERCISES.map((e) => (
              <button
                key={e.id}
                type="button"
                className={e.id === exerciseId ? 'exercise-chip is-active' : 'exercise-chip'}
                onClick={() => setExerciseId(e.id)}
              >
                {e.name}
              </button>
            ))}
          </div>
          <p className="exercise-desc">{exercise.description}</p>
          {mode === 'feel' ? (
            <RhythmLane key={exercise.id} exercise={exercise} />
          ) : (
            <StaffPlayer key={exercise.id} exercise={exercise} />
          )}
          <div className="tool-note">
            {mode === 'read' ? (
              <p>
                <strong>Read the music</strong> shows the exercise as real bagpipe staff notation and plays it for you —
                follow the moving line on your own chanter. Switch to <strong>Feel the pulse</strong> to be scored on your
                timing.
              </p>
            ) : (
              <p>
                <strong>Feel the pulse</strong> scores your timing as notes reach the line. Switch to{' '}
                <strong>Read the music</strong> to see the same exercise written on the staff and learn to read it.
              </p>
            )}
          </div>
        </>
      )}
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
