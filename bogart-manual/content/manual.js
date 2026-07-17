// Manual content model.
//
// IMPORTANT — content provenance:
//   This site reproduces Lloyd M. Bogart, "Bagpipes: The Manual" (© 1990) by
//   permission of the author. Verbatim text and the exercise note-sequences
//   must be transcribed directly from the source pages — do NOT reconstruct
//   them from memory or from the summaries in the main app's reference/ folder
//   (those are original re-expressions written for a different project and are
//   not the manual's wording).
//
//   Until the source page images are provided in-session and transcribed, the
//   `body` fields below stay empty and `exercises` hold no manual exercises.
//   The DEMO_EXERCISE at the bottom is an ORIGINAL placeholder pattern (a plain
//   scale run, not from the book) so the audio engine can be exercised and
//   demonstrated before the real content lands. Replace/remove it once the
//   manual's own exercises are transcribed.
//
// Section skeleton reflects the manual's known high-level structure
// (fundamentals -> triad/transition drills -> embellishments -> tunes). Fill
// each section's `body` (verbatim prose) and `exercises` (verbatim note data)
// from the pages as they are transcribed.

export const MANUAL_META = {
  title: 'Bagpipes: The Manual',
  author: 'Lloyd M. Bogart',
  year: 1990,
  place: 'La Crosse, WI',
  permission: 'Reproduced by permission of the author.',
}

/**
 * @typedef {object} Section
 * @property {string} id
 * @property {string} number   e.g. "1", "2"
 * @property {string} title
 * @property {string} body     verbatim prose (empty until transcribed)
 * @property {boolean} pending  true while awaiting source transcription
 * @property {Array}  exercises verbatim exercises ({name, notes:[{note,beats}], bpm, beatsPerBar})
 */

/** @type {Section[]} */
export const SECTIONS = [
  { id: 'sec-1', number: '1', title: 'Fundamentals', body: '', pending: true, exercises: [] },
  { id: 'sec-2', number: '2', title: 'Triad Exercises — Right Hand', body: '', pending: true, exercises: [] },
  { id: 'sec-3', number: '3', title: 'Triad Exercises — Left Hand', body: '', pending: true, exercises: [] },
  { id: 'sec-4', number: '4', title: 'Triad Exercises — Two Hands', body: '', pending: true, exercises: [] },
  { id: 'sec-5', number: '5', title: 'Embellishments I', body: '', pending: true, exercises: [] },
  { id: 'sec-6', number: '6', title: 'Embellishments II', body: '', pending: true, exercises: [] },
  { id: 'sec-7', number: '7', title: 'Embellishments III', body: '', pending: true, exercises: [] },
  { id: 'sec-8', number: '8', title: 'Tunes', body: '', pending: true, exercises: [] },
]

// Original placeholder so the play-along engine is demonstrable before the
// manual's own exercises are transcribed. NOT from the book.
export const DEMO_EXERCISE = {
  id: 'demo-scale',
  name: 'Demo: the scale (placeholder — not from the manual)',
  bpm: 60,
  beatsPerBar: 4,
  notes: [
    { note: 'Low G', beats: 1 },
    { note: 'Low A', beats: 1 },
    { note: 'B', beats: 1 },
    { note: 'C', beats: 1 },
    { note: 'D', beats: 1 },
    { note: 'E', beats: 1 },
    { note: 'F', beats: 1 },
    { note: 'High G', beats: 1 },
    { note: 'High A', beats: 2 },
    { note: 'High G', beats: 1 },
    { note: 'F', beats: 1 },
    { note: 'E', beats: 1 },
    { note: 'D', beats: 1 },
    { note: 'C', beats: 1 },
    { note: 'B', beats: 1 },
    { note: 'Low A', beats: 1 },
    { note: 'Low G', beats: 2 },
  ],
}
