// A practice log — the app's memory that time passes.
//
// Nothing in Bagpipe Lab used to record *when* you practised, so there was no
// streak, no "you've practised 4 of the last 7 days", no spaced review, and no
// answer to "why open this on a Tuesday?". One array of days, written whenever a
// run finishes, supplies all of it.

const KEY = 'bagpipe-lab-sessions'
const MAX_DAYS = 400

export type PracticeDay = {
  /** local calendar day, YYYY-MM-DD */
  date: string
  runs: number
  /** total practised time that day, ms */
  ms: number
}

export function dayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function shiftDays(key: string, delta: number): string {
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + delta)
  return dayKey(dt)
}

export function loadSessions(): PracticeDay[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as PracticeDay[]) : []
  } catch {
    return []
  }
}

/** Fold one finished run into today's entry. */
export function recordPractice(days: PracticeDay[], ms: number): PracticeDay[] {
  const today = dayKey()
  const idx = days.findIndex((d) => d.date === today)
  const next = [...days]
  if (idx >= 0) next[idx] = { ...next[idx], runs: next[idx].runs + 1, ms: next[idx].ms + ms }
  else next.push({ date: today, runs: 1, ms })
  next.sort((a, b) => (a.date < b.date ? -1 : 1))
  const trimmed = next.slice(-MAX_DAYS)
  try {
    localStorage.setItem(KEY, JSON.stringify(trimmed))
  } catch {
    /* ignore storage failures */
  }
  return trimmed
}

/**
 * Consecutive practice days ending today or yesterday.
 *
 * Yesterday still counts so that opening the app in the morning doesn't show a
 * broken streak before you've had a chance to play — losing a streak to the
 * clock rather than to not practising is the mechanic's worst failure mode.
 */
export function streak(days: PracticeDay[]): number {
  if (!days.length) return 0
  const seen = new Set(days.map((d) => d.date))
  const today = dayKey()
  let cursor = seen.has(today) ? today : shiftDays(today, -1)
  if (!seen.has(cursor)) return 0
  let n = 0
  while (seen.has(cursor)) {
    n++
    cursor = shiftDays(cursor, -1)
  }
  return n
}

/** How many of the last `window` days (including today) had any practice. */
export function daysPractised(days: PracticeDay[], window = 7): number {
  const seen = new Set(days.map((d) => d.date))
  const today = dayKey()
  let n = 0
  for (let i = 0; i < window; i++) if (seen.has(shiftDays(today, -i))) n++
  return n
}

/** The last `window` days as booleans, oldest first — for a dot strip. */
export function recentDays(days: PracticeDay[], window = 7): { date: string; practised: boolean }[] {
  const seen = new Set(days.map((d) => d.date))
  const today = dayKey()
  return Array.from({ length: window }, (_, i) => {
    const date = shiftDays(today, -(window - 1 - i))
    return { date, practised: seen.has(date) }
  })
}

export function minutesToday(days: PracticeDay[]): number {
  const today = days.find((d) => d.date === dayKey())
  return today ? Math.round(today.ms / 60000) : 0
}
