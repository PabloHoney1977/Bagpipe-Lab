import { useState } from 'react'
import { ChanterDiagram } from './ChanterDiagram'
import { NOTES, playChanterNote } from './chanter'

export function MeetTheChanter() {
  const [selected, setSelected] = useState(0)
  const note = NOTES[selected]

  function selectAndPlay(index: number) {
    setSelected(index)
    playChanterNote(NOTES[index].freq)
  }

  return (
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
  )
}
