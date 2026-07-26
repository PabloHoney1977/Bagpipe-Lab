# Bagpipe Lab — four-lens app review, 2026-07-26

Commissioned by the owner: *"look at the UI for intuitiveness, look at engagement
(will it keep people coming back), is it price gated so people upgrade, is it user
friendly, does it use proven methods of learning music generally and bagpipes in
particular?"*

**Method.** Four independent reviewers drove the live app with Playwright at
390×844 (phone), each with one lens and no visibility into the others' findings,
then their reports were cross-checked against the source by the coordinating
session. Every code claim quoted below was independently re-verified against
`src/` before being written here. Full unedited lens reports are in
`reference/reviews/2026-07-26/`. Screenshots were session-local and are not
committed.

**Prior review.** Builds on `reference/ux-review-2026-07.md`. That review's P0
(notation taught before rhythm was felt) is **confirmed fixed** — all four lenses
verified the new 7-phase order and found it better. Two of its P1s are **still
open** and are re-raised below with harder evidence.

---

## 1. Verdict

The app is better built than it is *alive*. The teaching content is careful and
well-sourced, the visual design is genuinely good in both themes, the fingering
and staff data are right, and the engine underneath (`RhythmLane`, `StaffPlayer`,
`rhythmEngine`) is real, working software. Nothing here is a toy.

Two things undermine all of it, and they are the same problem seen from two ends:

> **Nothing accumulates, and there is nothing to sell.**

*Nothing accumulates:* there is no `new Date()` anywhere in the codebase. No
session log, no streak, no "last practised", no spaced review. The one mechanic
that models getting better — the tempo ladder — is held in plain `useState` and
resets on a tab switch. The one persisted number, `Best %`, saturates at 100% in
the first two minutes and can never move again. So the app has no memory that
time passed, and a learner has no evidence they are improving.

*Nothing to sell:* the half of the app `CLAUDE.md` designates as paid is the half
that isn't built — one tune the code itself flags as an unverified draft, one
ornament auto-generated into six near-identical drills, and one drill whose own
UI copy admits its fingering may be wrong. The free half, meanwhile, is strong
enough to beat the $2.99 paid competitor on the App Store.

These converge on one conclusion: **the highest-leverage work is not the paywall.
It is making progress persist, making feedback diagnostic, and building tune
content — which fixes retention and creates something worth paying for in the
same stroke.**

---

## 2. Direct answers to the five questions asked

**Is it intuitive?** Mostly yes, with three concrete stumbles. The visual
hierarchy, typography and theming are strong and the stage-card structure reads
well. But the first sentence a new user reads points at a tab that doesn't exist;
the flagship "Guide sends you into the right drill" mechanic doesn't reset scroll,
so you land at an arbitrary position; and the Play tab shows a wall of ~20
identical-looking exercise pills before the game is visible at all.

**Will people come back?** As built, no. Not because the teaching is bad, but
because nothing in the app is aware that time passes, and the only progression
mechanic it has is discarded on every tab switch. There is no answer anywhere in
the code to "why open this on a Tuesday?"

**Is it price gated so people upgrade?** No — there is no gate, no IAP, no
paywall, and no analytics. But building one now would be premature: the paid side
is empty, and the two things blocking it are content decisions only the owner can
make.

**Is it user friendly?** Yes at the level of craft — legible, warm, consistent,
progress survives reload, the Guide reopens your next unfinished stage. It is
*unfriendly* in one specific and important place: the failure path. An all-*Good*
run scores 50% with no diagnosis, no way to slow down, and no path forward.

**Does it use proven methods?** The design *document* does — `PEDAGOGY.md` names
eleven right principles. The *product* implements roughly three. Mastery gating is
an honour-system checkbox on 15 of 17 stages; interleaving, spaced review,
audiation and error-driven micro-drills don't exist in any form.

---

## 3. Where the lenses independently converged

These are the highest-confidence findings in the review — each was hit by two or
more reviewers who could not see each other's work.

| Finding | Lenses | Status |
|---|---|---|
| Tempo ladder doesn't persist; progression is destroyed | Retention, Pedagogy | **P0** |
| 85% gate is punishing/unreachable; `Good` weighted 0.5; no way to slow down | Retention, Pedagogy, *prior review* | **P0** (third time raised) |
| Timing feedback is a score, not a diagnosis — the signed delta is computed and thrown away | Retention, Pedagogy | **P0** (both called it the single highest-value fix) |
| Only ~6 minutes of distinct content; one tune; one ornament ×6 | Retention, Monetization, Pedagogy | **P0** |
| First tune sits at stage 15 of 17 | Retention, Pedagogy, *prior review* | **P1** (unfixed) |
| Nothing is gated or unlocked — no cadence, contradicts `PEDAGOGY.md` §2.2 | Retention, Monetization | **P1** |
| App says "Mastered" about a skill it has never observed (tapping ≠ playing) | Pedagogy, Retention | **P1** |

---

## 4. Consolidated priority list

Severity is the coordinating session's, after cross-checking. Items marked
**[needs owner]** cannot be actioned without a piping decision.

### P0 — fix before any launch or paywall work

1. **Tempo ladder is not persisted.** `RhythmLane.tsx:58` — `useState(exercise.bpm)`;
   the component is mounted with `key={exercise.id}` (`App.tsx:353`) and unmounted
   on tab change. Reproduced live: mastered at 60 → stepped to 66 → tapped Guide →
   tapped Play → back to 60. The app's only "you are better than you were"
   mechanic cannot survive a tab tap.
   *Fix:* extend `bagpipe-lab-best` to `{[id]: {bpm, bestPct, bestAtBpm, runs, lastPractised}}`.

2. **The mastery gate is punishing and may be unreachable on real devices.**
   `RhythmLane.tsx:310` — `accuracy = (perfect + good * 0.5) / total`, gate at 85%.
   A run with **all 8 notes inside the Good window scores 50%** (verified live,
   with a `Best 100%` badge sitting next to it). There is no latency calibration
   anywhere in the codebase; at a realistic +80ms device offset the ceiling is ~80%
   *regardless of skill*. And `RhythmLane` has no tempo-down control at all —
   only `stepUpTempo()` — while the Guide's own copy tells learners to slow down
   and the *unscored* `StaffPlayer` has a full ± stepper.
   *Fix:* re-weight `Good` to ~0.8, add a one-time latency calibration, add a
   tempo-down stepper, and offer "try it 6 bpm slower?" on a sub-gate run.

3. **The diagnostic data is computed and discarded.** `RhythmLane.tsx:138` takes
   `Math.abs(n.targetMs - elapsed)`, throwing away the sign. The app knows whether
   you rush or drag and never says so. Worse, taps >260ms early are dropped as
   "stray" (`:145`), so *rushing* — the commonest beginner fault — is structurally
   invisible. `PEDAGOGY.md` §2.1 promises the opposite.
   *Fix:* keep the signed delta; report mean signed offset and spread.

4. **Repeated notes are sounded as separate re-attacks — the one sound a chanter
   cannot make.** `tunes.ts:70-76` (`steady-low-a`) plays eight discrete Low As,
   while the app's own reed lesson (`content.tsx:91-97`) correctly teaches the tone
   never stops.
   *Fix, and this is an opportunity rather than a bug:* sustain the tone across
   repeated notes and add one line — *"On your chanter this is one long note. You
   can't break it. That's the problem grace notes solve."* This converts the app's
   biggest internal contradiction into the strongest possible problem-first setup
   for the doubling, which is the curriculum's central pedagogical bet.

5. **The paid side does not exist.** One draft tune, one ornament ×6, one
   provisional drill. Do not ship a paywall against this. **[needs owner]** — the
   two blockers are content decisions (§6).

### P1 — materially costs users or revenue

6. **Guide→tool CTA doesn't reset scroll.** `App.tsx:47` calls `.scrollTo()` on
   `.app-main`, which has `flex: 1` and no overflow/height constraint
   (`index.css:52`) — it is not the scrolling element, so the call is a no-op and
   the window keeps its previous scroll position. The correct exercise *is*
   selected and the drill *is* reachable, but you land at an arbitrary offset,
   typically looking at unrelated exercise chips rather than the drill you asked
   for. Affects all 15 stage CTAs.
   *Fix:* scroll `window`, or better, scroll the selected exercise into view.

7. **The app's own onboarding names a tab that doesn't exist.** `curriculum.tsx:54`
   — *"sends you to the **Scale**, **Play**, or **Explore** tabs"*. The tab bar is
   Guide / Scale / Play / Grace notes; "Explore notes" is a *mode inside Play*.
   This is the first sentence on the first screen. Two further instances at
   `curriculum.tsx:125` and `:257` ("Open the Explore tab", "Cross-check in Explore").

8. **No return trigger and no "what do I do now".** No streak, session log,
   reminder, or unlock cadence — no `new Date()` anywhere. Every launch lands on
   Guide at scroll 0; Play always resets to `ALL_EXERCISES[0]`, so a returning
   learner with nine stages done is pointed at the drill they aced in week one.
   *Fix:* a session log (one array, written on each finished run) unlocks a streak,
   a "practised 4 of the last 7 days" strip, and the data any spaced-review
   scheduler needs. Then a "Today's practice" card pinned above Phase 1.

9. **`Best %` is stored without its tempo** (`RhythmLane.tsx:316-329`), so it
   saturates at 100% on day one and is inert thereafter.
   *Fix:* store and show **"Best: 92% @ 78 bpm"** — a number that climbs for months.

10. **Silent 4-second count-in in Feel mode.** The lane is blank for ~2s after
    Start with no on-screen indicator; a beginner concludes the button didn't work.
    The fix already exists in the same codebase — `StaffPlayer` shows "Count in… 3".

11. **The Play tab shows ~20 exercise pills before the game.** The lane and Start
    button are entirely below the fold on arrival, and nothing marks the
    recommended starting point.
    *Fix:* collapse the picker behind a disclosure, or move it below the lane.

12. **Practice is 100% blocked — no interleaving, no spaced review.** Every
    exercise is *n* reps of one thing; nothing revisits earlier material.
    `PEDAGOGY.md` §2.5 specifies it; the stored per-exercise bests already supply
    the data.

13. **Mastery is self-reported on 15 of 17 stages** (`App.tsx:272-274`) while the
    app already holds the score data that would earn the tick.

14. **Difficulty is non-monotonic across stages 8–10.** The scale (nine notes, one
    per beat, scored) precedes `steady-low-a` and `a-b-alternate`, which are the two
    *easiest* exercises in the app. Stage 4 (Blowing steadily) also depends on
    hole-covering technique taught in stages 5–6.

15. **The timing standard gets *looser* as the ladder climbs.** `PERFECT_MS`/`GOOD_MS`
    are fixed in milliseconds (`RhythmLane.tsx:30-31`), so ±100ms is 10% of a beat
    at 60bpm and 20% at 120. `PEDAGOGY.md` §6 specifies the opposite.

16. **Nothing communicates that a paid tier will exist**, and the mastery moment —
    the highest-intent second in the app, already computed at `RhythmLane.tsx:311` —
    currently ends the interaction.

17. **No Settings/About screen**, so nowhere to put **Restore Purchases**, which
    App Store review requires. A launch blocker once an IAP exists.

18. **Zero analytics.** PostHog is in the portfolio plan and not in the app, so
    drop-off and conversion are invisible. Notably `openPreset` is unmeasured — the
    Guide→tool bridge is the core architectural bet of the July rework and has never
    been validated.

### P2 — polish and correctness

19. Staff notation overflows the phone with no scroll affordance; note names clip
    mid-word ("Low A Low A Lo—").
20. The staff render omits clef, time signature, and note-value shapes — all three
    of which the notation stages explicitly teach.
21. Gracenote drills never show the grace fingering, only the principal's (prior
    review P1, still open).
22. The gracenote's principal is scheduled *after* the beat (`chanter.ts:110-115`),
    modelling the exact fault plain-first learners are most prone to.
23. Amazing Grace's pickup is barred as a downbeat (`rhythmEngine.ts:49`), so the
    metronome accents "**A**-mazing".
24. "Read the music" wraps to two lines in the segmented control while its siblings
    don't, giving the three pills different heights.
25. End-of-run fingering diagram falls back to Low G's fingering with "Done" beside
    it, reading as "the last note was Low G".
26. Finger Gym cue is accurate but unusable in real time — 15 words, five fingers,
    one beat. Chunk it by hand the way a teacher speaks.
27. Finger Gym ordering starts at Low A↔B; Low G↔Low A (a single pinky move) is
    fifth.
28. Lane lookahead is fixed in ms, so reading-ahead distance changes as you ladder up.
29. Explore notes is recognition-only — no retrieval direction, which is the
    highest-yield/lowest-cost intervention in the learning literature.
30. Six "different" gracenote drills are one `highGDrill()` function; a buyer will
    notice.
31. Progress is localStorage-only, so a reinstall loses everything while a purchase
    restores — a jarring mismatch.

---

## 5. On the plain-tunes-first decision

The pedagogy lens engaged this seriously and concluded: **the owner is ~80% right,
and the remaining 20% is load-bearing.**

Right, strongly: extended blocked practice on context-free movements is
well-documented to produce good in-session performance and poor retention and
transfer, plus a motivational cliff — front-loaded ornament drilling is a leading
reason adult beginners quit. And ornaments are *additive*: a gracenote doesn't move
the melody note, so there is little to un-learn later. That substantially weakens
the classic "bad habits" objection to this ordering.

The problem: **on a chanter, a plain melody containing repeated notes is not a
playable object.** Two Bs in a row have no "plain" version — you play one long B
(a different tune) or you play the gracenote. "Learn it plain first" is coherent
only if tunes are chosen to avoid repeated notes, or the app states a convention
("hold it as one long note for now — the next stage gives you the tool to break
it"). It currently does neither, which is the same gap as P0-4 above.

Its recommendation is an amendment, not a reversal: keep plain-first for everything
heavy (doublings onward — that's the real differentiator), but move the **high-G
gracenote alongside the first tune rather than after it**, because a gracenote
learned as "the thing that makes this tune playable" is retained better than one
learned as decoration for a tune already finished.

It also identifies a specific fault this ordering creates and recommends designing
against it now: learners who play plain for a long stretch tend to steal time from
the melody note to make room for the ornament. Mitigation is cheap — always score
the *principal's* onset, never the ornament's.

---

## 6. Owner-decision queue — these block everything downstream

Nothing in the monetization or ornament workstream can move until these are
settled, and none of them can be settled by a reviewer.

1. **The Amazing Grace melody.** `tunes.ts:26-29` still flags it DRAFT in code, but
   the prior review's copy cleanup removed the user-facing caveat — so the app now
   presents an unverified melody as "Your first tune" with no warning. The pedagogy
   lens reads the encoded setting as plausible but non-standard (it states the same
   two-bar figure twice at the opening where the standard tune goes
   tonic-third-tonic | fifth-fourth). Teaching a beginner a wrong version of the
   most recognisable tune in piping is the one unlearning cost that genuinely is
   expensive. **Either finish the transcription or restore an honest note.**

2. **The doublings table** in `reference/embellishments.md` — every cell after B is
   a `?`. This gates the entire ornament curriculum, which is the entire paid tier.
   Note: the two reviews now **disagree** on the doubling of B's interior gracenote
   — the draft and this review's pedagogy lens say **D**, the prior review's
   pipe-major lens suspected **C**. Neither should be trusted over you.

3. **Finger height — the app currently ships a contradiction.**
   `reference/triad-method.md:44-46` says lift fingers "well clear" of the holes;
   `content.tsx:213-217` says "don't fling it high… around half an inch. Close,
   controlled fingers are fast fingers." A learner reads the second in the Guide and
   is coached by the first via the Finger Gym's SNAP vocabulary. One has to give.

4. **Nine piping/notation claims** the pedagogy lens asserted from memory (outbound
   piping sites are blocked in these sessions) are listed at the end of
   `reference/reviews/2026-07-26/04-pedagogy.md`. The ones that would change shipped
   behaviour: that published GHB music carries a two-sharp key signature (making
   `content.tsx:246-249`'s "no sharps or flats" misleading), that a gracenote is
   taken from the *preceding* note's time, and that the high-G gracenote is also
   common on Low G (`ornaments.ts:26` excludes it, `reference/embellishments.md`
   includes it — one of the two is wrong).

---

## 7. Monetization: where the line should fall

Recommended by the monetization lens, and it is a deliberate move *down* from what
`CLAUDE.md` documents:

> **Free: everything through the learner's first complete tune, plus the high-G
> gracenote. Paid: the tune library from tune #2 onward, plus the full ornament
> curriculum.**

The documented boundary (free = phases 1–3) no longer maps onto the 7-phase
curriculum and would gate **Reading the music** — a prerequisite, not a reward.
Gating it means selling tunes to someone you've prevented from learning to read.
The Guide should never be gated at all: it's the map, and it's what earns the
"this is a real course" reviews that drive word-of-mouth in piping communities.
Gate the *tools* the later stages open.

**Price: $14.99 one-time, launched at $9.99 as a founder price.** Verified live
anchors: Bagpipe Basics is **$2.99** (this app's free tier already exceeds it), and
Bagpipe Tutorial runs free-plus-IAPs from **$3.99 to $69.99** — a competitor in
this exact niche is successfully charging up to seventy dollars, so willingness to
pay is higher than general music-app instinct suggests. Keep the one-time-IAP
policy (right for a finite course and a subscription-averse audience) but name the
tradeoff: it caps LTV at a single transaction in a niche with a low install
ceiling, which is precisely why it must not be priced as an impulse buy.

Tutor-book, lesson, and piping-school pricing in the full report are **asserted
from memory** and flagged there. Two things worth pulling before committing: Jazz
Guitar Lab's actual price and paywall placement (the portfolio-consistency argument
is only as strong as the sibling's results), and a decision about the free public
GitHub Pages build, which currently undercuts a paid iOS launch.

---

## 8. Recommended sequence

**Tier 0 — no owner input needed, mostly small, unblocks everything else.**
Persist the tempo ladder and best-@-bpm (#1, #9). Fix the gate: Good→0.8, latency
calibration, tempo-down control, "try slower?" on failure (#2). Report early/late
instead of a bare percentage (#3). Sustain repeated notes and add the one-line
callback (#4). Fix the scroll bug (#6) and the "Explore tab" copy (#7). Add the
count-in indicator (#10). Change "Mastered at 60 bpm" to "Timing clean at 60 bpm"
and add one standing line that the app scores timing, not fingers — that costs
nothing and buys the credibility this app will need with real pipers.

**Tier 1 — owner decisions (§6).** Settle Amazing Grace and the doublings table.
Everything in the ornament and monetization workstream is downstream of these.

**Tier 2 — the retention layer.** Session log + streak, "Today's practice" card,
lock exercises to their teaching stage for an unlock cadence, spaced-review /
warm-up mix, chunk tunes into 2-bar phrases. Bring one recognisable melody into
session 1, unscored — the retention lens argues this alone would beat every other
fix for week-1 retention.

**Tier 3 — the thing that makes money.** 8–12 verified public-domain tunes with
plain → ornamented progressions. This is a *data* problem, not an engineering one:
`RhythmLane`, `StaffPlayer`, `rhythmEngine` and the `graces` field already support
it. It fixes the content shortage and creates the paid tier simultaneously.

**Tier 4 — only now.** Settings/Restore screen, PostHog + the event list, then the
paywall.

Mic-based onset detection remains correctly deferred, but note that the retention
lens rates it the single biggest retention lever available to this product, not
merely an accuracy upgrade — it removes the tap, scores the actual instrument, and
resolves the physical problem that you cannot hold a chanter in both hands and tap
a phone.

---

## 9. What is genuinely good

Stated plainly because it's true and because the fix list above is long:

- **The fingering and staff data are right**, and the discipline of not guessing
  piping specifics — flagging drafts, refusing to transcribe an unreadable scan —
  is better than most commercial apps in this space and is the reason this review
  could be specific rather than hand-wavy.
- **The visual design holds up** at phone width in both themes: warm, legible,
  consistent, with one reusable chanter diagram anchoring every surface.
- **The reed lesson plants "it never stops sounding" as the seed for gracenotes** —
  the best-sequenced idea in the course.
- **Stage 16 ("Your first grace note") is the best-framed stage in the app**:
  problem-first, mechanically correct, correct first ornament.
- **`StaffPlayer` is premium-grade software.** It just has nothing exclusive to read.
- **The prior review's P0 resequence landed and made the course materially better** —
  all four lenses independently confirmed it.
- One structural point in the product thesis's favour, worth protecting: on a
  chanter, rhythm *is* onset placement, because the sound never stops and a note is
  defined by when the fingering changes. Onset-only scoring would be a real
  limitation on a piano; here it is close to the right model.
