import { useState } from 'react'
import { ChanterDiagram } from './ChanterDiagram'
import { NOTES, playChanterNote } from './chanter'

function App() {
  const [selected, setSelected] = useState(0)
  const note = NOTES[selected]

  function selectAndPlay(index: number) {
    setSelected(index)
    playChanterNote(NOTES[index].freq)
  }

  return (
    <main className="trainer">
      <header className="trainer-header">
        <h1>Bagpipe Lab</h1>
        <p className="phase-label">Phase 1 &middot; Meet the chanter</p>
      </header>

      <section className="trainer-body">
        <ChanterDiagram covered={note.covered} />

        <div className="note-panel">
          <p className="note-name">{note.name}</p>
          <div className="note-grid">
            {NOTES.map((n, i) => (
              <button
                key={n.name}
                type="button"
                className={i === selected ? 'note-button active' : 'note-button'}
                onClick={() => selectAndPlay(i)}
              >
                {n.name}
              </button>
            ))}
          </div>
          <p className="hint">Tap a note to hear it and see the fingering.</p>
        </div>
      </section>
    </main>
  )
}

export default App
