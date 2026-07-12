import { useState } from 'react'
import { MeetTheChanter } from './MeetTheChanter'
import { TheScale } from './TheScale'

const PHASES = [
  { label: 'Meet the chanter', render: () => <MeetTheChanter /> },
  { label: 'The scale', render: () => <TheScale /> },
]

function App() {
  const [phase, setPhase] = useState(0)

  return (
    <main className="trainer">
      <header className="trainer-header">
        <h1>Bagpipe Lab</h1>
        <p className="phase-label">
          Phase {phase + 1} &middot; {PHASES[phase].label}
        </p>
      </header>

      <nav className="phase-nav">
        {PHASES.map((p, i) => (
          <button
            key={p.label}
            type="button"
            className={i === phase ? 'phase-tab active' : 'phase-tab'}
            onClick={() => setPhase(i)}
          >
            {i + 1}. {p.label}
          </button>
        ))}
      </nav>

      {PHASES[phase].render()}
    </main>
  )
}

export default App
