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
- **Open questions resolved (2026-07-12):** both instruments (chanter + full pipes) in scope; audio sourcing is hybrid (recorded samples + synthesized fallback); repertoire starts public-domain-only.
- **Next concrete step:** wire up phase 1 ("Meet the chanter") — interactive SVG hole diagram with tap-to-hear for the 9 notes, chanter mode first.
