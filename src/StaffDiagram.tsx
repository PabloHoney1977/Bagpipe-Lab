// Renders chanter notes on a treble-clef staff. See reference/staff-notation.md
// for how these step values were derived (measured from a reference chart, not
// guessed) — step 0 is the bottom staff line, and each +1 moves up half a line
// spacing, so lines fall on even steps and spaces fall on odd steps.
const NOTE_STEPS: Record<string, number> = {
  'Low G': 2,
  'Low A': 3,
  B: 4,
  C: 5,
  D: 6,
  E: 7,
  F: 8,
  'High G': 9,
  'High A': 10,
}

const LINE_STEPS = [0, 2, 4, 6, 8]
const STEP_PX = 10 // half a line-spacing, in svg units
const BOTTOM_LINE_Y = 120

function stepToY(step: number): number {
  return BOTTOM_LINE_Y - step * STEP_PX
}

/** Ledger lines needed to reach `step`, beyond the 5 printed staff lines. */
function ledgerStepsFor(step: number): number[] {
  const steps: number[] = []
  if (step > 8) {
    for (let s = 10; s <= step; s += 2) steps.push(s)
  } else if (step < 0) {
    for (let s = -2; s >= step; s -= 2) steps.push(s)
  }
  return steps
}

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
