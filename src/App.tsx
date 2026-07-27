import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { STAGES, PHASES, stagesInPhase } from './curriculum'
import type { Stage } from './curriculum'
import { MeetTheChanter } from './MeetTheChanter'
import { TheScale } from './TheScale'
import { StaffPlayer } from './StaffPlayer'
import { EXERCISES } from './tunes'
import type { Exercise } from './tunes'
import { TRIADS } from './triads'
import { ORNAMENT_DRILLS } from './ornaments'
import { setTuningRatio, TUNING_DEFAULT_LOW_A, TUNING_MIN_LOW_A, TUNING_MAX_LOW_A } from './chanter'
import type { Tab, ScaleMode, Preset } from './nav'

// All playable exercises across every group, for id lookup and CTA routing.
const ALL_EXERCISES = [...EXERCISES, ...TRIADS, ...ORNAMENT_DRILLS]

const STORAGE_KEY = 'bagpipe-lab-progress' // stage ids marked done
const CHECK_KEY = 'bagpipe-lab-checklist' // per-item checklist ticks
const TUNING_KEY = 'bagpipe-lab-tuning' // chanter Low A reference pitch in Hz

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
  const [scaleMode, setScaleMode] = useState<ScaleMode>('scale')
  const [playExerciseId, setPlayExerciseId] = useState(ALL_EXERCISES[0].id)
  const [lowAHz, setLowAHz] = useState<number>(() => {
    try {
      const raw = Number(localStorage.getItem(TUNING_KEY))
      if (raw >= TUNING_MIN_LOW_A && raw <= TUNING_MAX_LOW_A) return raw
    } catch {
      /* ignore storage failures */
    }
    return TUNING_DEFAULT_LOW_A
  })

  // Apply + persist the global tuning whenever it changes (and on mount).
  useEffect(() => {
    setTuningRatio(lowAHz / TUNING_DEFAULT_LOW_A)
    try {
      localStorage.setItem(TUNING_KEY, String(lowAHz))
    } catch {
      /* ignore storage failures */
    }
  }, [lowAHz])

  const openPreset = useCallback((p: Preset) => {
    if (p.scaleMode) setScaleMode(p.scaleMode)
    if (p.exerciseId) setPlayExerciseId(p.exerciseId)
    setTab(p.tab)
    document.querySelector('.app-main')?.scrollTo({ top: 0 })
  }, [])

  return (
    <div className="app">
      <main className="app-main">
        {tab === 'guide' && <GuideTab openPreset={openPreset} />}
        {tab === 'scale' && <ScaleTab mode={scaleMode} setMode={setScaleMode} />}
        {tab === 'play' && (
          <PlayTab
            exerciseId={playExerciseId}
            setExerciseId={setPlayExerciseId}
            lowAHz={lowAHz}
            setLowAHz={setLowAHz}
          />
        )}
        {tab === 'embellishments' && <EmbellishmentsTab openPreset={openPreset} />}
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
        <button
          type="button"
          className="tune-shortcut"
          onClick={() => openPreset({ tab: 'play', exerciseId: 'amazing-grace' })}
        >
          In a hurry? Hear a real tune ▸
        </button>
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

function ScaleTab({ mode, setMode }: { mode: ScaleMode; setMode: (m: ScaleMode) => void }) {
  return (
    <div className="tool">
      <ToolHeader title="Scale" subtitle="Explore each note on its own, then play the whole octave up and down." />

      <div className="segmented">
        <button type="button" className={mode === 'scale' ? 'seg is-active' : 'seg'} onClick={() => setMode('scale')}>
          The scale
        </button>
        <button type="button" className={mode === 'notes' ? 'seg is-active' : 'seg'} onClick={() => setMode('notes')}>
          Explore notes
        </button>
      </div>

      {mode === 'scale' ? <TheScale /> : <MeetTheChanter />}
    </div>
  )
}

function PlayTab({
  exerciseId,
  setExerciseId,
  lowAHz,
  setLowAHz,
}: {
  exerciseId: string
  setExerciseId: (id: string) => void
  lowAHz: number
  setLowAHz: (hz: number) => void
}) {
  const exercise = ALL_EXERCISES.find((e) => e.id === exerciseId) ?? ALL_EXERCISES[0]

  return (
    <div className="tool">
      <ToolHeader
        title="Play"
        subtitle="Read the music on the staff and play along on your chanter — slow it down until every note lands clean."
      />

      <ExerciseGroup label="Tunes & patterns" items={EXERCISES} activeId={exerciseId} onPick={setExerciseId} />
      <ExerciseGroup
        label="Finger gym"
        hint="Short drills for one finger move at a time."
        items={TRIADS}
        activeId={exerciseId}
        onPick={setExerciseId}
      />
      <ExerciseGroup
        label="Grace notes"
        hint="Ornament drills — a gracenote flams in before the note."
        items={ORNAMENT_DRILLS}
        activeId={exerciseId}
        onPick={setExerciseId}
      />
      <p className="exercise-desc">{exercise.description}</p>
      <StaffPlayer key={exercise.id} exercise={exercise} />
      <TuningControl hz={lowAHz} setHz={setLowAHz} />
    </div>
  )
}

const TUNING_PRESETS = [
  { label: 'Concert', hz: 440 },
  { label: 'Solo', hz: 466 },
  { label: 'Band', hz: 480 },
]

function TuningControl({ hz, setHz }: { hz: number; setHz: (hz: number) => void }) {
  return (
    <div className="tuning">
      <div className="tuning-head">
        <span className="tuning-label">Chanter pitch</span>
        <span className="tuning-value">Low A = {hz} Hz</span>
      </div>
      <input
        type="range"
        className="tuning-slider"
        min={TUNING_MIN_LOW_A}
        max={TUNING_MAX_LOW_A}
        step={1}
        value={hz}
        onChange={(e) => setHz(Number(e.target.value))}
        aria-label="Chanter pitch — Low A reference in hertz"
      />
      <div className="tuning-presets">
        {TUNING_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            className={hz === p.hz ? 'tuning-preset is-active' : 'tuning-preset'}
            onClick={() => setHz(p.hz)}
          >
            {p.label} · {p.hz}
          </button>
        ))}
      </div>
      <p className="hint tuning-hint">
        Playing along on a real chanter? Sound a steady Low A and drag until the app matches its pitch — band chanters
        ring sharp, solo and practice chanters lower. This shifts only the sound, never the notes or fingering.
      </p>
    </div>
  )
}

function ExerciseGroup({
  label,
  hint,
  items,
  activeId,
  onPick,
}: {
  label: string
  hint?: string
  items: Exercise[]
  activeId: string
  onPick: (id: string) => void
}) {
  return (
    <div className="exercise-group">
      <p className="exercise-group-label">
        {label}
        {hint ? <span className="exercise-group-hint">{hint}</span> : null}
      </p>
      <div className="exercise-picker">
        {items.map((e) => (
          <button
            key={e.id}
            type="button"
            className={e.id === activeId ? 'exercise-chip is-active' : 'exercise-chip'}
            onClick={() => onPick(e.id)}
          >
            {e.name}
          </button>
        ))}
      </div>
    </div>
  )
}

function EmbellishmentsTab({ openPreset }: { openPreset: (p: Preset) => void }) {
  return (
    <div className="tool">
      <ToolHeader title="Grace notes" subtitle="The movements that make piping sound like piping." />

      <div className="prose">
        <p>
          A chanter never stops sounding, so it can’t separate two of the same note with silence. Instead, pipers flick
          in a tiny, near-instant <strong>grace note</strong> to break them apart and to articulate a note crisply.
        </p>
        <p>
          Your first one is the <strong>high-G gracenote</strong>: a quick lift of the top-hand index finger that sounds
          High G for an instant before dropping back to the melody note. Drill it below — the gracenote flams in just
          before the beat. Slow the tempo right down so you can get the finger movement clean before you speed it up.
        </p>
      </div>

      <div className="stage-ctas">
        <button
          type="button"
          className="cta-button"
          onClick={() => openPreset({ tab: 'play', exerciseId: 'orn-hg-b' })}
        >
          Drill the high-G gracenote ›
        </button>
      </div>

      <p className="tool-note">
        More ornaments — the doubling, strikes, throws, grips, the birl — build from here, each introduced on a tune that
        needs it. The doubling drill is still being refined, so treat its exact fingering as provisional for now.
      </p>
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
