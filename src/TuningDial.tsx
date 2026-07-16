import { useEffect, useRef, useState } from 'react'
import {
  NOTES,
  playChanterNote,
  resumeAudio,
  getTuning,
  setTuning,
  TUNING_MIN,
  TUNING_MAX,
  TUNING_DEFAULT,
} from './chanter'

const LOW_A = NOTES.find((n) => n.name === 'Low A') ?? NOTES[0]

/**
 * Global tuning control. Real chanters aren't pitched to concert A=440 —
 * a modern pipe-band chanter's Low A sits nearer 480 Hz, and every chanter
 * is a little different. This dials the app's Low A to match the user's own
 * chanter so the play-along sounds in tune against it.
 */
export function TuningDial() {
  const [open, setOpen] = useState(false)
  const [hz, setHz] = useState<number>(() => getTuning())
  const panelRef = useRef<HTMLDivElement>(null)

  // Close when tapping outside the panel.
  useEffect(() => {
    if (!open) return
    function onDown(e: PointerEvent) {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  function change(next: number) {
    setHz(setTuning(next))
  }

  function preview() {
    resumeAudio()
    playChanterNote(LOW_A.freq) // retuned to the current setting inside
  }

  const isDefault = Math.round(hz) === TUNING_DEFAULT

  return (
    <div className="tuning" ref={panelRef}>
      <button
        type="button"
        className="tuning-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`Chanter tuning: Low A at ${Math.round(hz)} hertz`}
      >
        <TuningForkIcon />
        <span className="tuning-toggle-hz">{Math.round(hz)} Hz</span>
      </button>

      {open ? (
        <div className="tuning-panel" role="dialog" aria-label="Chanter tuning">
          <p className="tuning-panel-title">Tune to your chanter</p>
          <p className="tuning-panel-sub">
            Chanters aren’t pitched to concert A. Set the app’s <strong>Low A</strong> to match yours.
          </p>

          <div className="tuning-readout">
            <span className="tuning-readout-hz">{Math.round(hz)}</span>
            <span className="tuning-readout-unit">Hz</span>
          </div>

          <input
            type="range"
            className="tuning-slider"
            min={TUNING_MIN}
            max={TUNING_MAX}
            step={1}
            value={Math.round(hz)}
            onChange={(e) => change(parseFloat(e.target.value))}
            aria-label="Low A frequency"
          />
          <div className="tuning-scale-labels">
            <span>{TUNING_MIN}</span>
            <span>concert A</span>
            <span>{TUNING_MAX}</span>
          </div>

          <div className="tuning-actions">
            <button type="button" className="tuning-btn" onClick={preview}>
              ♪ Hear Low A
            </button>
            <button
              type="button"
              className="tuning-btn tuning-btn-ghost"
              onClick={() => change(TUNING_DEFAULT)}
              disabled={isDefault}
            >
              Reset to {TUNING_DEFAULT}
            </button>
          </div>

          <p className="tuning-hint">
            Not sure? Play a steady Low A on your chanter and slide until the app matches its pitch. Higher Hz = sharper.
          </p>
        </div>
      ) : null}
    </div>
  )
}

function TuningForkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v8a4 4 0 0 0 8 0V3" />
      <path d="M12 15v6" />
    </svg>
  )
}
