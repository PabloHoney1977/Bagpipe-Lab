import { NOTE_STEPS, LINE_STEPS, stepToY, ledgerStepsFor } from './staff'

type StaffNote = { note: string; label?: string }

/** A treble-clef staff with one or more chanter notes placed on it in sequence. */
export function StaffDiagram({ notes, noteSpacing = 46 }: { notes: StaffNote[]; noteSpacing?: number }) {
  const staffLeft = 24
  const staffRight = staffLeft + noteSpacing * notes.length + 24
  const width = staffRight + 16

  return (
    <svg viewBox={`0 0 ${width} 170`} width={width} height="170" role="img" aria-label="Staff notation">
      {LINE_STEPS.map((s) => (
        <line key={s} x1={staffLeft} y1={stepToY(s)} x2={staffRight} y2={stepToY(s)} className="staff-line" />
      ))}

      {notes.map((n, i) => {
        const step = NOTE_STEPS[n.note]
        const cx = staffLeft + 34 + i * noteSpacing
        const cy = stepToY(step)
        const ledgers = ledgerStepsFor(step)
        return (
          <g key={i}>
            {ledgers.map((s) => (
              <line
                key={s}
                x1={cx - 13}
                y1={stepToY(s)}
                x2={cx + 13}
                y2={stepToY(s)}
                className="staff-ledger"
              />
            ))}
            <line x1={cx + 8.5} y1={cy} x2={cx + 8.5} y2={cy - 42} className="staff-stem" />
            <ellipse cx={cx} cy={cy} rx="9" ry="6.5" className="staff-note" />
            <text x={cx} y={148} className="staff-note-label" textAnchor="middle">
              {n.label ?? n.note}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
