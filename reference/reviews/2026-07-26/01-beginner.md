# Bagpipe Lab — Complete Beginner / Intuitiveness Review (2026-07-26)

Role: someone who has never touched a bagpipe, never read music, just downloaded
this app on their phone, mildly impatient. Driven live via Playwright at 390×844
against the running dev server. Screenshots referenced below live in
`shots/beginner/`.

## Verdict

The visual design is genuinely good — clean typography, a consistent warm
parchment/gold palette that holds up in both themes, generous card-based
layout, and a working progress tracker that survives reload. But two things
would visibly trip a first-time user in the first ten minutes: the app's own
copy tells you to look for a tab that doesn't exist, and its flagship "Guide
sends you straight into a preconfigured drill" feature doesn't actually scroll
you there — it silently drops you wherever your scroll position happened to be
on the previous screen. Neither is a design taste issue; both are things that
visibly don't do what the app itself says they do. The rhythm game's silent
count-in is the other concrete stumble: for four full seconds after tapping
Start, nothing happens on screen and there's no readout telling you why.

## Findings

### 1. The Guide's own onboarding text references a tab that doesn't exist (P1)
**Screenshots:** `01-guide-home-fresh-light.png`, `04-guide-why-it-works-light.png`, `18-guide-home-fresh-dark.png`

The very first thing the app shows you — Stage 1, "How this course works,"
open by default on a fresh install — reads: *"Each stage explains one small
thing, then sends you to the **Scale**, **Play**, or **Explore** tabs to
actually do it."* The bottom tab bar has exactly four tabs: **Guide, Scale,
Play, Grace notes**. There is no "Explore" tab. "Explore notes" is actually one
of three modes *inside* the Play tab (a segmented control: Feel the pulse /
Read the music / Explore notes). A beginner reading this sentence, then
scanning the tab bar for "Explore," will not find it — on the very first
screen they see, before they've done anything else. Source:
`src/curriculum.tsx` line 54 (`<strong>Explore</strong> tabs`).

**Fix:** say "the Scale, Play, or Grace notes tabs" (matching the real tab
bar), or "the Play tab's Feel/Read/Explore modes" if the intent was to
reference the segmented control specifically.

### 2. Guide → tool CTA handoff doesn't actually scroll to the destination — it's silently broken (P0/P1)
**Screenshot:** `30-guide-cta-to-play-light.png`

This is the app's flagship "the Guide is a map, tap a button and land
preconfigured in the right tool" mechanic (praised in the prior UX review). I
scrolled partway down the Guide to the "Finger gym" stage (window scrollY =
821px), tapped its "Start with Low A ↔ B" CTA, and landed on the Play tab —
correctly switched to the right exercise — but the CTA drops you at scrollY
821 again, unchanged. I verified this isn't just visual: `window.scrollY`
before and after the click are identically `821`; `app-main.scrollTop` is `0`
both times. The screenshot shows the result: the CTA landed me staring at
"High-G on C / High-G on D / High-G on E / High-G on F / Doubling of B" —
the **Grace notes** group, not the Finger Gym drill I was just sent to. I only
find the actual "Low A ↔ B" drill I asked for by scrolling further down myself.

**Root cause:** `App.tsx`'s `openPreset` calls
`document.querySelector('.app-main')?.scrollTo({ top: 0 })`, but `.app-main`
(`index.css` line 52) has no `overflow`/height constraint — it's not the
scrolling element. The actual document/window scrolls natively, so calling
`.scrollTo` on `.app-main` is a no-op. This means **every** Guide CTA across
all 15 stages inherits this bug — the destination you land on is whatever
pixel-position you happened to be scrolled to on the Guide, re-interpreted
against the Play tab's completely different layout. Sometimes that will
coincidentally look fine; sometimes (as reproduced here) it drops you in the
wrong section entirely.

**Fix:** scroll `window`/`document.documentElement`, not `.app-main` — e.g.
`window.scrollTo({ top: 0 })` — or better, scroll the picked exercise's
`.rhythm`/`.staffplay` element into view so the learner lands looking at the
actual game, not just "top of Play tab."

### 3. "Feel the pulse" mode has a silent, blank 4-second count-in with no indicator (P1)
**Screenshots:** `11b-play-feel-countin-500ms.png`, `11c-play-feel-countin-1700ms.png` (vs. `14-play-read-playing-light.png` which shows the fix already exists elsewhere)

Tapping "Start" in Feel the pulse begins a full one-bar count-in (4 beats at
60bpm = 4000ms) before the first note even becomes visible in the lane. For
roughly the first 2 seconds of that, the lane is **completely blank** — no
falling note, no countdown, nothing but the static hit-line. At 1700ms, the
very top edge of the first circle has just barely begun to peek in from
off-screen. The only cue anything is happening is the metronome click audio,
which a first-time user may have their volume down for, may not connect to
"this means count in," or may simply not notice. A beginner tapping Start and
staring at an empty rectangle for two-plus seconds will reasonably conclude
the button didn't work.

The frustrating part: the fix already exists in the same codebase. "Read the
music" mode shows a literal **"Count in... 3"** text readout during its
identical count-in (`14-play-read-playing-light.png`). Feel the pulse has no
equivalent.

**Fix:** port the "Count in... N" text (or a simple pulsing dot / beat
counter) from `StaffPlayer` into `RhythmLane` during the lead-in.

### 4. Play tab dumps a ~19-button exercise wall before showing the actual game, no "start here" signal (P1)
**Screenshots:** `09-play-feel-idle-light.png`, `10-play-exercise-picker-light.png`, `20-play-feel-idle-dark.png`

The very first thing you see on entering Play — before any lane, staff, or
"press start" — is three stacked groups of small pill buttons: Tunes &
patterns (5), Finger gym (9), Grace notes (6+), all roughly the same visual
weight. "Steady Low A" happens to be pre-selected/highlighted, but nothing on
screen explains *why that one* or that it's the recommended starting point —
a beginner has no way to distinguish "the thing I should try first" from "one
of 20 identical-looking buttons." You have to scroll past the entire picker
just to reach the description and the actual rhythm lane / Start button. This
compounds with Finding 2: even when the Guide sends you here with a specific
drill selected, you still land facing this same wall.

**Fix:** collapse the picker behind a "choose a different drill" disclosure
by default, surfacing only the active exercise + Start button first; or move
the picker below the game/lane instead of above it.

### 5. Staff notation overflows off the right edge of the phone screen with no scroll affordance (P2)
**Screenshots:** `13b-play-read-staff-idle.png`, `14b-play-read-staff-playing.png`

In "Read the music" mode, the staff for an 8-note exercise runs off the right
edge of the 390px viewport — the note-name captions are cut off mid-word
("Low A Low A Low A Low A Low A Low A Low A Lo—"), and the last notehead is
clipped at the container edge. The container (`.staffplay-scroll`) does have
`overflow-x: auto`, so it's technically swipeable, but there's no visible
scrollbar, fade-edge, or arrow hinting that more content continues to the
right — nothing else in this single-column app teaches the user that
horizontal swiping is a thing. A beginner is likely to read the cut-off text
as a rendering bug rather than "swipe to see more of the tune."

**Fix:** add a fade-out gradient mask on the trailing edge when content
overflows, or a small "→ scroll" hint the first time this view is shown.

### 6. Segmented mode control renders unevenly — one label wraps, others don't (P2)
**Screenshots:** `09-play-feel-idle-light.png`, `13-play-read-idle-light.png`

"Read the music" wraps onto two lines inside its pill while "Feel the pulse"
and "Explore notes" each sit on one line, in both themes. The three pills end
up visibly different heights within the same control, which reads as a small
polish miss on what is otherwise a very clean, consistent UI.

**Fix:** reduce font size slightly at this breakpoint, or shorten the label
("Read music"), or allow the whole segmented control to wrap to two rows
instead of wrapping one label.

### 7. End-of-run fingering diagram falls back to "Low G" with no note selected, labeled "Done" (P2)
**Screenshot:** `12f-play-feel-final-mastered-light.png`

When a run finishes, the side panel's fingering diagram falls back to
`NOTES[0]` (Low G's fingering — several holes shown covered) even though no
note is actually "current." Paired with the "Done" label next to it, this
briefly reads as "the last note was Low G," which may not be true of the
exercise just played. Minor, but worth a `null`-safe blank/neutral state
instead of defaulting to a real note's fingering.

## What works well

- **Visual polish and theme handling are genuinely strong.** Both light and
  dark themes are legible, warm, and consistent — text contrast, button
  states, and the wood/gold chanter illustration all read clearly in both
  (checked `01`, `18`, `07` vs `19`, `09` vs `20`, `17` vs `24`).
- **Progress persistence works correctly and adds a nice touch.** Marking 5
  stages done, reloading, confirms `5 of 17 done` with gold checkmarks
  persisted (`28`, `29`) — and the app automatically re-opens the next
  not-yet-done stage on reload, which is a genuinely good default.
- **The mastery/tempo-ladder end-of-run screen is clear and rewarding.**
  "Mastered at 60 bpm. Step up when you're ready" plus a green "Step up to 66
  bpm ›" button reads well in both themes (`12f`, `12g`) — good positive
  reinforcement design once you get there.
- **The chanter fingering diagram is a strong, reused anchor.** Consistent
  across Scale, Play (all three modes), and Guide — a beginner builds one
  mental model of "which circles are gold/filled" rather than several.
- **Stage cards are legible and well-chunked**, with numbered circles, a
  clear open/closed chevron state, and one-line time estimates ("5 min," "A
  few sessions") that set expectations well.
- The previously-flagged P0 (notation dumped before rhythm was felt) is
  confirmed fixed — the phase order now runs Meet the instrument → Nine
  notes → Play in time → Reading the music, matching what `curriculum.tsx`
  and the working-memory log describe.
- Only console issue found across the whole session was a `favicon.ico` 404,
  a harmless dev-server artifact, not a real defect.

## First-session narrative

I open the app. I land on Guide, stage 1 already expanded: "This Guide is your
map... sends you to the Scale, Play, or Explore tabs." I glance at the tab bar
— Guide, Scale, Play, Grace notes. No Explore. I shrug it off as maybe meaning
something inside Play and keep reading.

I skim the phase list — clean, well-organized, "5 min" time estimates are
reassuring. I jump to Scale out of curiosity, hit "Play the scale," watch the
fingering diagram track each note. Good — self-explanatory, no confusion.

Back to Guide, I find the "Finger gym" stage and tap its "Start with Low A ↔
B" button, expecting to land in a small focused drill. Instead I land on Play
tab looking at a wall of grace-note buttons ("High-G on C," "High-G on D"...)
— not what I asked for, and not obviously related to what I just read. I
scroll down, hunting, and eventually find "Low A ↔ B" highlighted further up
the picker with the actual drill below it. Minor "wait, where am I" moment
that shouldn't have happened.

I hit Start. Nothing happens for what feels like a couple of seconds — no
note, no countdown, just an empty rounded rectangle. I wonder if I mis-tapped.
Then a small circle creeps in from the top labeled "Low A." I tap along,
eventually get a "Mastered at 60 bpm" message with a green step-up button —
that part feels genuinely good, like a small win.

I flip to "Read the music" out of curiosity and notice it does show
"Count in... 3" during its own lead-in — so it's not that the concept is
missing from the app, just that Feel-the-pulse didn't get it. The staff
itself, though, runs off the edge of my phone screen with note names cut off
mid-word ("Low A Low A Lo—"); I don't immediately realize I can swipe it
sideways.

I poke the Grace notes tab last, curious. Clean writing, good short paragraph,
but it name-drops "flams" and assumes I already know what a gracenote drill
score means — fine as a fourth stop, but this tab has no gate, so if I'd
tapped it first instead of last, I'd have hit that jargon cold.

Ten minutes in: I like the look and feel of this app a lot more than I trust
its wiring. The things it says about itself ("there's an Explore tab," "tap
this and you'll land in the drill") aren't quite what actually happens.
