import { useEffect, useRef, useState } from 'react'
import { ChanterDiagram } from './ChanterDiagram'
import { NOTES, playChanterNote } from './chanter'

// Full octave, ascending then descending: Low G..High A..Low G.
const SEQUENCE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1, 0]
const NOTE_DURATION_MS = 550

export function TheScale() {
  const [stepIndex, setStepIndex] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  function play() {
    setIsPlaying(true)
    let i = 0

    const playStep = () => {
      if (i >= SEQUENCE.length) {
        setIsPlaying(false)
        setStepIndex(null)
        return
      }
      setStepIndex(i)
      playChanterNote(NOTES[SEQUENCE[i]].freq)
      i += 1
      timeoutRef.current = window.setTimeout(playStep, NOTE_DURATION_MS)
    }

    playStep()
  }

  function stop() {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = null
    setIsPlaying(false)
    setStepIndex(null)
  }

  const noteIndex = stepIndex === null ? 0 : SEQUENCE[stepIndex]
  const note = NOTES[noteIndex]
  const direction = stepIndex === null ? 'Ready' : stepIndex <= 8 ? 'Ascending' : 'Descending'

  return (
    <section className="trainer-body">
      <ChanterDiagram covered={note.covered} />

      <div className="note-panel">
        <p className="note-name">{note.name}</p>
        <p className="direction-label">{direction}</p>

        <div className="scale-progress" aria-hidden="true">
          {SEQUENCE.map((_, i) => (
            <span
              key={i}
              className={stepIndex !== null && i <= stepIndex ? 'scale-dot scale-dot-done' : 'scale-dot'}
            />
          ))}
        </div>

        <button type="button" className="play-button" onClick={isPlaying ? stop : play}>
          {isPlaying ? 'Stop' : 'Play the scale'}
        </button>

        <p className="hint">Full octave, low to high and back down, at a slow tempo. Watch the fingering as it moves.</p>
      </div>
    </section>
  )
}
