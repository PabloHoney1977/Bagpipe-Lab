// Shared geometry for rendering chanter notes on a treble-clef staff.
// See reference/staff-notation.md for how these step values were derived
// (measured from a reference chart, not guessed): step 0 is the bottom staff
// line, and each +1 moves up half a line spacing, so lines fall on even steps
// and spaces fall on odd steps.
export const NOTE_STEPS: Record<string, number> = {
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

// The five printed staff lines, in step units (bottom to top).
export const LINE_STEPS = [0, 2, 4, 6, 8]

export const STEP_PX = 10 // half a line-spacing, in svg units
export const BOTTOM_LINE_Y = 120

export function stepToY(step: number): number {
  return BOTTOM_LINE_Y - step * STEP_PX
}

/** Ledger lines needed to reach `step`, beyond the 5 printed staff lines. */
export function ledgerStepsFor(step: number): number[] {
  const steps: number[] = []
  if (step > 8) {
    for (let s = 10; s <= step; s += 2) steps.push(s)
  } else if (step < 0) {
    for (let s = -2; s >= step; s -= 2) steps.push(s)
  }
  return steps
}
