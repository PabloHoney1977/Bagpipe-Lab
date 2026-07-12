# Bagpipe Lab

Bagpipe/practice-chanter learning app. Part of the Highland Music, LLC portfolio — see `pablohoney1977/highland-music-site` (`CLAUDE.md`) for business/legal status and shared infrastructure decisions (RevenueCat one-time IAP, PostHog, Codemagic, Capacitor, audio sample sourcing) that this app inherits by default unless noted otherwise here.

## Concept

Interactive, animated practice-chanter trainer. Core differentiator vs. existing bagpipe learning material (tutor-book PDFs, YouTube channels, static fingering/metronome apps): none of them combine an animated interactive chanter with a rhythm-driven play-along loop.

**Why rhythm/timing, not pitch matching:** chanter fingering is deterministic — one fingering produces exactly one pitch, no embouchure or pitch-bending. So unlike pitch-matching apps, the skill worth grading is timing and finger-sequence accuracy. Core gameplay loop: animated SVG chanter with holes lighting up in sequence, played against a falling-notes/rhythm-lane UI synced to a backing play-along track.

**Why embellishments early but not too early:** a chanter has no tonguing and can't silence or restart a note — it's one continuous reed tone. Grace-note embellishments (starting with the doubling) aren't decoration; they're the only way to separate two repeated notes rhythmically. Introduce the doubling right after the student can hold steady rhythm on an unembellished simple tune, framed as solving a problem they've already felt (their repeated notes blur together) — not as an early flourish or a late afterthought.

## Curriculum phases

1. **Meet the chanter** — interactive hole diagram (8 holes, hand position), tap-to-hear each of the 9 notes (Low G, Low A, B, C, D, E, F, High G, High A).
2. **The scale** — full octave play-along at slow tempo, visual finger-highlight leads eye/ear, ascending and descending.
3. **Steady rhythm, no embellishments** — simple traditional (public-domain) melodies, scored purely on timing/finger-sequence accuracy. Checkpoint here gates phase 4.
4. **The doubling** — introduced with the functional "why," practiced on the repeated-note passages from phase 3's tunes.
5. **First real tunes** combining scale + doubling.
6. **Progressive embellishments** (strike, grip, throw-on-D, taorluath, birl) — each introduced in the specific tune context that requires it, each gated behind a rhythm-accuracy checkpoint.

## Monetization

Free tier: phases 1–3 (scale + rhythm fundamentals). Paid one-time unlock: phases 4–6 (tunes + embellishments) — mirrors Jazz Guitar Lab's freemium boundary, one-time IAP per portfolio policy (no subscriptions).

## Market note

Smaller, more niche audience than guitar/piano — lower download ceiling, less competition, more committed/willing-to-pay audience. Organic marketing via piping-specific communities (r/bagpipes, pipe band forums) rather than general music-app ASO.

## Roadmap — deferred until fundamentals ship

- **Mic-based rhythm detection.** Longer-term goal: use the device mic to detect actual note-onset timing from a real practice chanter, instead of tap/metronome-sync input, so scoring reflects real playing rather than tapping a screen in rhythm.
  - Framing: a chanter's reed tone is harmonically rich/noisy compared to a clean metronome click, but *onset detection* (when a note attacks) is a different and generally easier problem than pitch detection — we don't need to identify which note was played (fingering already tells us that), just when a transition happened. This should make it more tractable than it first sounds.
  - Sequencing: build and ship the tap/metronome-sync version first (phases 1–6 above), validate the curriculum and retention with that, then layer mic-based onset detection in as an upgrade to the existing rhythm-accuracy scoring — not a blocker to first release.
  - Open questions to resolve when this gets picked up: onset-detection approach/library (e.g. spectral flux or energy-based onset detection vs. a full pitch tracker misapplied to this problem), mic permission/UX on iOS, noise/environment robustness, latency budget for real-time scoring.

## Tech stack (inherited from portfolio pattern unless noted)

- Single-file React PWA + Capacitor (`ios/` project committed to this repo)
- RevenueCat (`@revenuecat/purchases-capacitor`) for the one-time IAP unlock
- PostHog analytics (CDN snippet, no-op until a real project key is set)
- Codemagic CI/CD (`codemagic.yaml`)
- Audio: recorded practice-chanter/pipe samples where available (check `nbrosowsky/tonejs-instruments` first), synthesized reed/drone tone as fallback for any note or instrument mode without a clean recorded sample — hybrid, not an either/or.
- Instrument modes: practice chanter (primary, drives the whole curriculum) and full Highland pipes (same fingering logic, adds drone audio) both supported.
- Bundle ID on the `com.pablohoney.*` namespace

## Decisions

- **Instruments:** support both practice chanter and full Highland pipes (drone + chanter, same fingering). Chanter remains the primary/default mode the curriculum is built around.
- **Audio sourcing:** hybrid — recorded samples where available, synthesized tone filling gaps (missing notes, drone, or either instrument mode not yet sampled).
- **Repertoire:** public-domain tunes only for initial release. No tune is added to the shipped repertoire without its public-domain status confirmed first.

## Open questions

- None blocking phase 1 as of this update — audio sourcing, instrument scope, and repertoire policy are resolved above. Revisit if a specific tune's public-domain status is ambiguous, or if sample sourcing for a given note/instrument proves impractical.

## Working Memory
> Rolling snapshot, overwrite don't append.

- **Repo created (2026-07-12):** `bagpipe-lab` created by the user directly (the ops-hub session's GitHub integration isn't authorized to create repos — 403 — same constraint noted in `highland-music-site`'s `CLAUDE.md`). This `CLAUDE.md` seeded from the strategy work done in that ops-hub session/`bagpipe-app-strategy.md` before the ops session's repo-adding connector got stuck, so a fresh session here starts with full context instead of none.
- **App shell scaffolded (2026-07-12):** Vite + React + TS PWA in repo root, single-file-style `src/App.tsx` holding a placeholder for phase 1 ("Meet the chanter"). Capacitor added (`@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`), `ios/` project generated and committed, bundle id `com.pablohoney.bagpipelab`. `codemagic.yaml` added mirroring the portfolio's Capacitor iOS build pattern. App Store checklist section added to README. Merged to `main` via PR #1.
- **Open questions resolved (2026-07-12):** both instruments (chanter + full pipes) in scope; audio sourcing is hybrid (recorded samples + synthesized fallback); repertoire starts public-domain-only. Merged via PR #2.
- **Phase 1 built (2026-07-12):** interactive chanter trainer live in `src/App.tsx` — SVG hole diagram (`src/ChanterDiagram.tsx`) grouped by top/bottom hand, 9-note picker (`src/chanter.ts`) with the standard cumulative fingering chart, tap-to-hear via a synthesized Web Audio tone (placeholder pending recorded samples). Verified working in-browser with Playwright, both themes. Merged via PR #3.
- **Chanter sample sourcing researched, no source found (2026-07-12):** checked `nbrosowsky/tonejs-instruments` (19 instruments, no reed/bagpipe samples), Wikimedia Commons, Freesound, KVR/VI-Control forums, GitHub bagpipe/soundfont projects, Pixabay/Sample Focus/Splice/Musical Artifacts. No clean, redistribution-safe library of isolated chanter notes (Low G–High A) exists in the free/CC ecosystem — bagpipes are sampled as loops/drones/one-shots, not as a chromatic per-note instrument like piano/violin. Commercial loop libraries' "royalty-free" licenses are typically for use *in music tracks*, not for redistributing the raw audio as an app asset — a distinction worth re-checking carefully if a paid source is considered later. **Decision: keep the synthesized placeholder tone for launch.** Revisit real samples by recording the 9 notes directly (cleanest rights path) if/when that becomes practical, or if a vetted licensed source turns up.
- **Phase 2 built (2026-07-12):** scale play-along live in `src/TheScale.tsx` — steps through the full octave ascending then descending (17 notes, Low G→High A→Low G) at a slow fixed tempo (550ms/note), chanter diagram and note name follow the current step, progress dots and an ascending/descending label track position. Added simple phase-nav tabs in `src/App.tsx`; phase 1 extracted to `src/MeetTheChanter.tsx`. Verified working in-browser with Playwright — tab switch, full play-through, auto-stop/reset at the end, no console errors.
- **Chanter diagram corrected (2026-07-12):** the original diagram modeled 8 front holes with no thumb hole, which is wrong — a real Highland/practice chanter has 7 front holes + 1 thumb hole on the back. Verified the correct 8-hole layout and full 9-note fingering chart against multiple sources (this also caught that High G's fingering was wrong before: it's not a simple continuation of the low-note pattern — it re-covers R1–R3 while opening the top hand except the thumb, due to overblowing). `src/chanter.ts` and `src/ChanterDiagram.tsx` rebuilt accordingly: thumb hole rendered separately (dashed outline, "back" label, leader line) from the 7 front holes, plus a more polished chanter silhouette (reed cap, turning rings, flared bell) instead of a plain rounded rectangle. Verified fingering correctness and visuals in-browser with Playwright, both themes.
- **Live preview:** deployed to GitHub Pages at https://pablohoney1977.github.io/Bagpipe-Lab/ via `.github/workflows/pages.yml` (auto-deploys on push to `main`). Repo was made public to enable Pages. Note: this session's sandbox blocks outbound `*.github.io`, so the live URL can't be fetched from here — rely on the Actions run `conclusion: success` as the deploy signal.
- **Reframed as a full course (2026-07-12):** per user direction, the app is no longer a few flat interactive widgets — it's now a structured, beginning-to-end course ("square one → playing the Highland pipes"), modeled on the Jazz Guitar Lab tutorial depth. New architecture: `src/curriculum.tsx` (units → lessons data), `src/App.tsx` reworked into a contents/home view + lesson viewer with prev/next and localStorage completion tracking, `src/ui.tsx` (Callout/Steps/Figure/FactList/ComingSoon presentational components), `src/content.tsx` (real, source-verified instructional prose), `src/AnatomyDiagram.tsx` (labeled chanter + a double-reed close-up), `src/FingerMapDiagram.tsx` (which finger → which hole). Six units: Fundamentals (Welcome, anatomy, the reed, blowing steadily, holding, finger placement — all written), The nine notes (existing `MeetTheChanter`), The scale (existing `TheScale`), Steady rhythm (coming-soon stub), Embellishments (coming-soon stub), Onto the pipes (written preview). Instructional facts (left-hand-on-top, finger pads/sealing, double-reed mechanics, steady blowing) checked against real piping sources. Verified in-browser with Playwright — navigation, completion tracking, both themes, no console errors.
- **Model default:** `.claude/settings.json` sets the project default model to `claude-opus-4-8` (committed, applies repo-wide).
- **Fingering chart corrected to real GHB cross-fingering (2026-07-12):** the earlier `chanter.ts` used a wrong recorder-style "lift one hole at a time" scale. The user (a piper) corrected it: **every note E and above keeps the low-hand index/middle/ring (R1–R3) covered** while the top hand opens bottom-up (ring→E, middle→F, index→High G; High A also lifts the thumb); **C and D keep the pinky (R4) down** and are cross-fingered (C opens R2 only, D opens R1 only). Low A and B still lift from the bottom (pinky, then ring+pinky). Full grid now in `src/chanter.ts` (order [thumb, L1,L2,L3, R1,R2,R3,R4], true=covered). NOTE: piping fingering sites (bagpipejourney, oddscotland, peeb, teachyourselfbagpipes, PDFs) all 403 to WebFetch/curl from this sandbox, and the fast-model WebFetch summaries were unreliable (gave identical text for different notes) — so this chart came from the user's direct correction + established cross-fingering structure. If revisiting, get a real chart to double-check C's exact open hole and the pinky state on E–High A.
- **Hole visibility fixed (2026-07-12):** open holes were near-black on dark-brown wood = invisible (user reported "can't see the holes"). Added `--hole-rim` (light parchment) stroke on all holes so open holes read as hollow rings and covered holes as gold discs, in both themes; also lightened dark-theme `--wood` for contrast. Affects `.hole`, `.an-hole`, `.fm-hole` in `index.css`.
- **Restructured into a bottom tab-bar app (2026-07-12):** per user request to mimic their Jazz Guitar app's layout, `src/App.tsx` now has a fixed bottom tab bar with four tabs — **Guide** (the written course: Fundamentals + Onto the pipes, via `GUIDE_UNITS` in `curriculum.tsx`, with contents list + lesson viewer + localStorage read-tracking), **Scale** (`TheScale`), **Play** (`MeetTheChanter` note explorer + a "play-along tunes coming soon" note), **Grace notes** (embellishments, coming-soon). Inline SVG tab icons. `curriculum.tsx` trimmed to just the guide units (interactive pieces are now tabs, not lessons). Verified in-browser with Playwright at phone width, both themes, fingering grid dumped and checked, no console errors.
- **Next concrete step:** build the real "Play" experience — play-along tunes with a falling-notes/rhythm lane, metronome-synced backing, simple public-domain melodies, and timing/finger-sequence scoring. That's the biggest remaining feature and lives in the Play tab.
