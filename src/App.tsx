import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { STAGES, PHASES, stagesInPhase } from './curriculum'
import type { Stage } from './curriculum'
import { MeetTheChanter } from './MeetTheChanter'
import { TheScale } from './TheScale'
import { RhythmLane } from './RhythmLane'
import { StaffPlayer } from './StaffPlayer'
import { EXERCISES } from './tunes'
import type { Exercise } from './tunes'
import { TRIADS } from './triads'
import { ORNAMENT_DRILLS } from './ornaments'
import { loadProgress } from './progress'
import { buildWarmUp, isUnlocked, stageTitle, suggestPractice, taughtBy } from './plan'
import { daysPractised, loadSessions, minutesToday, recentDays, streak } from './sessions'
import type { Tab, PlayMode, Preset } from './nav'

// All playable exercises across every group, for id lookup and CTA routing.
const ALL_EXERCISES = [...EXERCISES, ...TRIADS, ...ORNAMENT_DRILLS]

const STORAGE_KEY = 'bagpipe-lab-progress' // stage ids marked done
const CHECK_KEY = 'bagpipe-lab-checklist' // per-item checklist ticks
const LAST_KEY = 'bagpipe-lab-last' // last tab + exercise, so a session resumes where it stopped
const GRANT_KEY = 'bagpipe-lab-granted' // drills the Guide has explicitly sent the learner into

type LastPlace = { tab?: Tab; exerciseId?: string; playMode?: PlayMode }

function loadLast(): LastPlace {
  try {
    const raw = localStorage.getItem(LAST_KEY)
    return raw ? (JSON.parse(raw) as LastPlace) : {}
  } catch {
    return {}
  }
}

function saveLast(place: LastPlace) {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify(place))
  } catch {
    /* ignore storage failures */
  }
}

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
  const last = loadLast()
  const [tab, setTab] = useState<Tab>(last.tab ?? 'guide')
  const [playMode, setPlayMode] = useState<PlayMode>(last.playMode ?? 'feel')
  const [playExerciseId, setPlayExerciseId] = useState(last.exerciseId ?? ALL_EXERCISES[0].id)
  const [focusStage, setFocusStage] = useState<string | null>(null)
  const [granted, setGranted] = useState<Set<string>>(() => loadSet(GRANT_KEY))
  useEffect(() => saveSet(GRANT_KEY, granted), [granted])

  // Stage completion lives here rather than in GuideTab because the Play tab
  // needs it too — it decides which drills have been unlocked yet.
  const [done, setDone] = useState<Set<string>>(() => loadSet(STORAGE_KEY))
  useEffect(() => saveSet(STORAGE_KEY, done), [done])

  const toggleDone = useCallback((id: string) => {
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  useEffect(() => {
    saveLast({ tab, exerciseId: playExerciseId, playMode })
  }, [tab, playExerciseId, playMode])

  // Tapping a tab should land you at the top of it. Without this the window
  // keeps whatever scroll offset the previous tab had, so you arrive somewhere
  // arbitrary in a completely different layout.
  const goTab = useCallback((t: Tab) => {
    setTab(t)
    window.scrollTo({ top: 0 })
  }, [])

  const openPreset = useCallback((p: Preset) => {
    if (p.playMode) setPlayMode(p.playMode)
    if (p.exerciseId) {
      setPlayExerciseId(p.exerciseId)
      // Following a CTA into a drill opens it: the Guide is the unlock path.
      setGranted((prev) => (prev.has(p.exerciseId!) ? prev : new Set(prev).add(p.exerciseId!)))
    }
    if (p.stageId) setFocusStage(p.stageId)
    setTab(p.tab)
    if (!p.stageId) window.scrollTo({ top: 0 })
  }, [])

  return (
    <div className="app">
      <main className="app-main">
        {tab === 'guide' && (
          <GuideTab
            openPreset={openPreset}
            done={done}
            granted={granted}
            onToggleDone={toggleDone}
            focusStage={focusStage}
            onFocused={() => setFocusStage(null)}
          />
        )}
        {tab === 'scale' && <ScaleTab />}
        {tab === 'play' && (
          <PlayTab
            mode={playMode}
            setMode={setPlayMode}
            exerciseId={playExerciseId}
            setExerciseId={setPlayExerciseId}
            done={done}
            granted={granted}
            openPreset={openPreset}
          />
        )}
        {tab === 'embellishments' && <EmbellishmentsTab openPreset={openPreset} />}
      </main>

      <nav className="tab-bar" aria-label="Sections">
        <div className="tab-bar-inner">
          <TabButton label="Guide" active={tab === 'guide'} onClick={() => goTab('guide')} icon={<GuideIcon />} />
          <TabButton label="Scale" active={tab === 'scale'} onClick={() => goTab('scale')} icon={<ScaleIcon />} />
          <TabButton label="Play" active={tab === 'play'} onClick={() => goTab('play')} icon={<PlayIcon />} />
          <TabButton
            label="Grace notes"
            active={tab === 'embellishments'}
            onClick={() => goTab('embellishments')}
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

function GuideTab({
  openPreset,
  done,
  granted,
  onToggleDone,
  focusStage,
  onFocused,
}: {
  openPreset: (p: Preset) => void
  done: Set<string>
  granted: Set<string>
  onToggleDone: (id: string) => void
  focusStage: string | null
  onFocused: () => void
}) {
  const [ticks, setTicks] = useState<Set<string>>(() => loadSet(CHECK_KEY))
  const [openId, setOpenId] = useState<string | null>(() => {
    const d = loadSet(STORAGE_KEY)
    return STAGES.find((s) => !d.has(s.id))?.id ?? null
  })
  const sessions = loadSessions()
  const progress = loadProgress()
  const suggestions = suggestPractice(done, progress, granted)

  useEffect(() => saveSet(CHECK_KEY, ticks), [ticks])

  // A CTA can ask for a particular stage (a locked drill points at the stage
  // that unlocks it). Open it and bring it into view.
  useEffect(() => {
    if (!focusStage) return
    setOpenId(focusStage)
    const el = document.getElementById(`stage-${focusStage}`)
    el?.scrollIntoView({ block: 'center' })
    onFocused()
  }, [focusStage, onFocused])

  // The Guide already reopens the next unfinished stage, but it used to sit
  // hundreds of pixels below the fold, so a returning learner had to scroll
  // past a column of ticked cards to find where they were.
  useEffect(() => {
    if (focusStage || !openId) return
    if (done.size === 0) return
    const el = document.getElementById(`stage-${openId}`)
    el?.scrollIntoView({ block: 'center' })
    // run once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

      <PracticeStrip sessions={sessions} />
      <TodaysPractice
        stage={STAGES.find((s) => !done.has(s.id)) ?? null}
        suggestions={suggestions}
        openPreset={openPreset}
        onOpenStage={setOpenId}
      />

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
                  onToggleDone={() => onToggleDone(stage.id)}
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

/** Streak + the last week, so the app can show that it noticed you turned up. */
function PracticeStrip({ sessions }: { sessions: ReturnType<typeof loadSessions> }) {
  const run = streak(sessions)
  const week = daysPractised(sessions)
  const mins = minutesToday(sessions)
  const days = recentDays(sessions)

  if (!sessions.length) {
    return (
      <div className="practice-strip is-empty">
        <p className="practice-strip-line">
          Nothing practised yet. Play any drill through once and this is where your practice history lives.
        </p>
      </div>
    )
  }

  return (
    <div className="practice-strip">
      <div className="practice-strip-stats">
        <span className="practice-streak">
          {run > 0 ? `${run}-day streak` : 'Back for more'}
        </span>
        <span className="practice-week">{week} of the last 7 days</span>
        {mins > 0 ? <span className="practice-mins">{mins} min today</span> : null}
      </div>
      <div className="practice-dots" aria-hidden="true">
        {days.map((d) => (
          <span key={d.date} className={d.practised ? 'practice-dot is-on' : 'practice-dot'} />
        ))}
      </div>
    </div>
  )
}

/** The answer to "what do I do now" — the thing a re-opened app should lead with. */
function TodaysPractice({
  stage,
  suggestions,
  openPreset,
  onOpenStage,
}: {
  stage: Stage | null
  suggestions: ReturnType<typeof suggestPractice>
  openPreset: (p: Preset) => void
  onOpenStage: (id: string) => void
}) {
  if (!stage && !suggestions.length) return null

  return (
    <section className="today">
      <h2 className="today-title">Today’s practice</h2>
      {stage ? (
        <button
          type="button"
          className="today-stage"
          onClick={() => {
            onOpenStage(stage.id)
            document.getElementById(`stage-${stage.id}`)?.scrollIntoView({ block: 'center' })
          }}
        >
          <span className="today-stage-label">Next stage</span>
          <span className="today-stage-title">{stage.title}</span>
        </button>
      ) : null}
      {suggestions.map((s) => (
        <button
          key={s.exercise.id}
          type="button"
          className="today-drill"
          onClick={() => openPreset({ tab: 'play', playMode: 'feel', exerciseId: s.exercise.id })}
        >
          <span className="today-drill-name">{s.exercise.name}</span>
          <span className="today-drill-reason">{s.reason}</span>
        </button>
      ))}
    </section>
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
  done,
  granted,
  openPreset,
}: {
  mode: PlayMode
  setMode: (m: PlayMode) => void
  exerciseId: string
  setExerciseId: (id: string) => void
  done: Set<string>
  granted: Set<string>
  openPreset: (p: Preset) => void
}) {
  const progress = loadProgress()
  const warmUp = buildWarmUp(done, progress, granted)
  const pool = warmUp ? [...ALL_EXERCISES, warmUp] : ALL_EXERCISES
  const picked = pool.find((e) => e.id === exerciseId)
  // Never leave the learner on a drill they can no longer reach.
  const exercise = picked && isUnlocked(picked.id, done, progress, granted) ? picked : ALL_EXERCISES[0]

  const groupProps = {
    activeId: exercise.id,
    onPick: setExerciseId,
    done,
    granted,
    progress,
    openPreset,
  }

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
          {warmUp ? (
            <ExerciseGroup
              label="Warm-up"
              hint="A few bars each of drills you already know — switching between moves is the harder skill."
              items={[warmUp]}
              {...groupProps}
            />
          ) : null}
          <ExerciseGroup label="Tunes & patterns" items={EXERCISES} {...groupProps} />
          <ExerciseGroup
            label="Finger gym"
            hint="Short drills for one finger move at a time."
            items={TRIADS}
            {...groupProps}
          />
          <ExerciseGroup
            label="Grace notes"
            hint="Ornament drills — a gracenote flams in before the note."
            items={ORNAMENT_DRILLS}
            {...groupProps}
          />
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

function ExerciseGroup({
  label,
  hint,
  items,
  activeId,
  onPick,
  done,
  granted,
  progress,
  openPreset,
}: {
  label: string
  hint?: string
  items: Exercise[]
  activeId: string
  onPick: (id: string) => void
  done: Set<string>
  granted: Set<string>
  progress: ReturnType<typeof loadProgress>
  openPreset: (p: Preset) => void
}) {
  // Locked drills in a group nearly always share one unlocking stage; saying so
  // once beats repeating the stage title on every chip.
  const lockedStages = [
    ...new Set(items.filter((e) => !isUnlocked(e.id, done, progress, granted)).map((e) => taughtBy(e.id))),
  ].filter((x): x is string => Boolean(x))
  const lockedCount = items.filter((e) => !isUnlocked(e.id, done, progress, granted)).length

  return (
    <div className="exercise-group">
      <p className="exercise-group-label">
        {label}
        {hint ? <span className="exercise-group-hint">{hint}</span> : null}
      </p>
      {lockedStages.length === 1 && lockedCount > 1 ? (
        <p className="exercise-group-lock">
          {lockedCount} more unlock with “{stageTitle(lockedStages[0])}”
        </p>
      ) : null}
      <div className="exercise-picker">
        {items.map((e) => {
          const open = isUnlocked(e.id, done, progress, granted)
          const stage = taughtBy(e.id)
          const best = progress[e.id]?.bestPct

          if (!open && stage) {
            // Locked chips stay visible and say what opens them — a locked drill
            // is a signpost to the stage that teaches it, never a dead end.
            return (
              <button
                key={e.id}
                type="button"
                className="exercise-chip is-locked"
                onClick={() => openPreset({ tab: 'guide', stageId: stage })}
                title={`Unlocks with “${stageTitle(stage)}”`}
              >
                <span className="chip-lock" aria-hidden="true">
                  ✦
                </span>
                {e.name}
                {lockedCount === 1 ? <span className="chip-unlock">{stageTitle(stage)}</span> : null}
              </button>
            )
          }

          return (
            <button
              key={e.id}
              type="button"
              className={e.id === activeId ? 'exercise-chip is-active' : 'exercise-chip'}
              onClick={() => onPick(e.id)}
            >
              {e.name}
              {best != null ? <span className="chip-best">{best}%</span> : null}
            </button>
          )
        })}
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
          before the beat, and you’re scored on the main note’s timing.
        </p>
      </div>

      <div className="stage-ctas">
        <button
          type="button"
          className="cta-button"
          onClick={() => openPreset({ tab: 'play', playMode: 'feel', exerciseId: 'orn-hg-b' })}
        >
          Drill the high-G gracenote ›
        </button>
        <button
          type="button"
          className="cta-button"
          onClick={() => openPreset({ tab: 'play', playMode: 'read', exerciseId: 'orn-hg-b' })}
        >
          Read it on the staff ›
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
