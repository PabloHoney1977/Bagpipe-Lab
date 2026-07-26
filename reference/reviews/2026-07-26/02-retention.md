# Bagpipe Lab — review lens: ENGAGEMENT & RETENTION

Reviewed 2026-07-26 against the live dev build at `localhost:5173` (Playwright, 390×844)
plus the source. Screenshots: `…/scratchpad/review/shots/retention/`.

---

## Verdict

**It would not retain today.** Not because it's bad — the teaching content is careful and
the tools work — but because **nothing in this app is aware that time passes.** There is no
timestamp written anywhere in the codebase. No streak, no session log, no "last practised",
no reminder, no unlock cadence, no spaced review. The three localStorage keys store a set of
self-ticked checkboxes, a set of self-ticked stage IDs, and one accuracy number per exercise
that **saturates at 100% on day one and can never move again**.

Worse, the one system that *is* designed to accumulate — the tempo ladder, which is the
app's whole "getting better" mechanic — **is not persisted and resets on every tab switch**
(verified live: 60 → step up to 66 → tap Guide → tap Play → back to 60). So a learner who
grinds a drill from 60 to 84 bpm over a week opens the app on day 8 and is back at 60, with
a "Best 100%" badge that was earned in their first thirty seconds. Every session starts from
the same place. That is the precise opposite of what a months-long instrument grind needs.

Layered on top: the mastery gate is calibrated for someone who is already good at rhythm
games (see F2 — an all-*Good* run scores **50%**), there is no way to make anything *easier*
in the scored mode, and the entire library of distinct practice material is **5 minutes 48
seconds long**.

The good news is that the fixes are small and mostly additive. The teaching spine
(`PEDAGOGY.md`) already prescribes almost all of them — mastery gating, spaced review,
error-driven micro-drills, chunked tunes — they just haven't been built. This is a
retention *layer* missing, not a retention *design* missing.

---

## The current loop, as it actually is

A 10-minute session today:

1. Open the app. It always lands on **Guide**, scrolled to the top, at Phase 1 Stage 1
   (`App.tsx:39` — `useState<Tab>('guide')`, never persisted).
2. The Guide *does* auto-expand your first unfinished stage (`App.tsx:109–112`) — genuinely
   the best retention feature in the app. But it doesn't scroll to it: with 9 of 17 stages
   done, the open card sits **475px below the fold** (measured). So you scroll past a column
   of ✓'d cards to find where you were.
3. Read a two-sentence concept, tap a CTA, land in Play preconfigured. This handoff is good
   and works.
4. Tap **Start**. A four-beat count-in, then 8–17 circles fall to a line over ~12–23 seconds.
   Tap each one. Get four numbers: Perfect / Good / Missed / Accuracy.
5. If ≥85%: a green "Step up to 66 bpm ›" button. If <85%: `"X% this run. Aim for 85% to move
   the tempo up."` and nothing else — no diagnosis, no easier option.
6. Repeat the same 12-second drill. There are 23 of them, totalling under six minutes.
7. Go back to Guide, tap **Mark this stage done** — a self-report checkbox the app does not
   verify against the scoring data it already has.
8. Close the app. Nothing was recorded about today. Nothing will ask for tomorrow.

The loop is coherent inside a session. Between sessions it does not exist.

---

## Findings

### F1 — Nothing in the app is aware of time. No streak, no session, no return trigger. **P0**

**Evidence:** `grep -rniE "streak|Date|notification|reminder|daily|goal" src/` returns five
hits, all false positives (`localStorage`, prose). Not a single `new Date()`, timestamp, or
day counter is written anywhere. Persisted state is exactly:

| key | contents |
|---|---|
| `bagpipe-lab-progress` | `string[]` of stage IDs the user ticked (`App.tsx:18`) |
| `bagpipe-lab-checklist` | `string[]` of `stageId:index` ticks (`App.tsx:19`) |
| `bagpipe-lab-best` | `{exerciseId: accuracyPct}` (`RhythmLane.tsx:38`) |

Verified on a cold start: `{"bagpipe-lab-checklist":"[]","bagpipe-lab-progress":"[]"}`.

**Why it costs retention:** the entire question of this lens — "why open it on a Tuesday?" —
has no answer in the code. There is no habit surface (a streak, a practice log, a "you've
practised 4 of the last 7 days"), no scheduled nudge, and, since this ships as a Capacitor
app, not even a local notification. Instrument learning has a brutal week-2 cliff and this
app has nothing standing at the edge of it.

**Fix:** add `bagpipe-lab-sessions` — an array of `{date, minutes, runs, exercises[]}` written
on every finished run. From that one array you get, nearly free: a streak, a "practised 4/7
days" strip, a per-week minutes total, and the data any spaced-review scheduler needs.
Surface it as a card at the very top of the Guide. Then one Capacitor local notification at a
user-chosen practice time — *one*, opt-in, no guilt copy (see "wrong mechanics" below).

---

### F2 — The mastery gate is unreachable for the target user, and there is no way to make it easier. **P0**

**Evidence:** `RhythmLane.tsx:310` —
`accuracy = (perfect + good * 0.5) / total`, gate at `MASTERY_PCT = 85` (`:35`).
A *Good* hit — every note landed within 200ms of its beat — is worth **half a note**.

Verified live (`07-all-good-run.png`): I tapped all 8 notes at a uniform +150ms, i.e. inside
the Good window on every single one. Result: **`0 Perfect / 8 Good / 0 Missed → 50%`**, with
the message *"50% this run. Aim for 85% to move the tempo up."* A player who was within a
sixth of a beat on **every note of the run** is told they are half way to competent.

What 85% actually demands (Gaussian model of tap error, `PERFECT_MS=100`, `GOOD_MS=200`):

| tap std-dev | accuracy @ zero bias | accuracy @ +40ms systematic bias |
|---|---|---|
| 60ms | 95.2% | 91.4% |
| 80ms | 88.8% | 85.5% |
| **91ms** | **85.0% (threshold)** | 82.3% |
| 100ms | 81.9% | 79.1% |
| 120ms | 75.0% | 72.8% |

So: you need a tap standard deviation ≤ **91ms with zero bias**, or ≤ **81ms** once you
account for a modest 40ms of device latency. And **there is no latency calibration anywhere**
(`grep latency|baseLatency|outputLatency src/chanter.ts` → nothing). On a phone, touch-event
delay plus Web Audio output latency plus lane render lag routinely stacks to 60–100ms of
*systematic* offset. At a +80ms bias the accuracy ceiling is **~80% no matter how good you
are** — the gate is literally unpassable on some devices, and the app gives the user no way to
discover or correct that. They will conclude they have no rhythm.

**Compounding it:** `RhythmLane` has **no tempo-down control at all**. The only tempo mutation
is `stepUpTempo()` (`:331`). A learner stuck at the hardcoded 60 bpm of "Steady Low A" cannot
go to 45. Ironically `StaffPlayer` — the *unscored* mode — has a full ±5 bpm stepper down to
30 (`StaffPlayer.tsx:264–272`), and the Guide's `read-along` checklist even instructs *"Slow
the tempo down until you can read each note"* — advice that is impossible to follow in the
mode that actually grades you.

**Why it costs retention:** this is the single place the app can make a beginner feel stupid,
and it does. "Everything you did was inside the window" + "50%" + no way to slow down is a
quit event.

**Fix, in order:**
1. Re-weight Good to **0.8** (an all-Good run → 80%, honest but not humiliating), or replace
   the two-band judgement with a continuous score that decays with |delta|.
2. Add a **latency calibration**: "tap along with 8 clicks" once, store the median offset,
   subtract it in `judge()`. Thirty lines, removes an entire class of unwinnable users.
3. Add a **tempo-down** control to `RhythmLane`, mirroring `StaffPlayer`'s stepper.
4. On a sub-gate run, auto-offer it: *"Close — try it 6 bpm slower?"*

---

### F3 — The tempo ladder, the app's only progression system, is thrown away constantly. **P0**

**Evidence:** `RhythmLane.tsx:58` — `const [bpm, setBpm] = useState(exercise.bpm)`, reset by
the effect at `:71–80` on `exercise.id` change; `App.tsx:353` mounts it with
`key={exercise.id}` (forcing remount on exercise change), and the tab render at `App.tsx:53–63`
unmounts the whole Play tree when you leave the tab. `bpm` is never written to storage.

Verified live: mastered "Steady Low A" at 60, stepped up to **66 bpm**, tapped Guide, tapped
Play → tempo badge read **60 bpm** again.

**Why it costs retention:** the tempo ladder is the *only* mechanic in the app that models
"you are better than you were." `PEDAGOGY.md` §3 makes it a headline principle. As built, it
is a within-a-single-uninterrupted-view toy. There is no version of this app where a learner
feels the multi-week climb from 55 to 90 bpm, because the number can't survive a tab tap.

**Fix:** persist per-exercise current bpm (extend `bagpipe-lab-best` into
`{[id]: {bpm, bestPct, bestAtBpm, runs, lastPractised}}`) and restore it on mount. This is
one of the highest-value-to-effort changes in the whole review.

---

### F4 — The one persisted progress number maxes out on day one and then means nothing. **P1**

**Evidence:** `RhythmLane.tsx:316–329` stores a bare accuracy percentage per exercise, with
**no tempo attached**. `:387` renders it as `Best 100%`.

Verified live: after one clean 60 bpm run of "Steady Low A", the badge reads **"Best 100%"**.
In `07-all-good-run.png` you can see the absurdity directly — the badge says *Best 100%* while
the run just scored 50% at a harder tempo. The number can never improve again, for that
exercise, ever. A learner who returns on day 30 playing that drill at 96 bpm sees the identical
badge they saw in minute two.

**Why it costs retention:** "I improved since last time" is *the* feeling that brings people
back to a practice app, and this is the only surface that could carry it. It is inert by
construction.

**Fix:** store `{bestBpm, accuracyAtBestBpm}` and display **"Best: 92% @ 78 bpm"**. Now the
number climbs for months, which is exactly the shape of instrument practice. Add a small
sparkline of the last ~10 runs from the session log (F1) under the score row.

---

### F5 — There are 5 minutes 48 seconds of distinct practice material. **P1**

**Evidence:** 23 exercises exist (dumped live from `.exercise-chip`):

| group | count | source | total audio, each played once |
|---|---|---|---|
| Tunes & patterns | 5 | `tunes.ts` | 1m 57s |
| Finger gym | 11 | `triads.ts` (generated pairs) | 2m 22s |
| Grace notes | 7 | `ornaments.ts` (6 high-G drills + 1 draft doubling) | 1m 25s |
| **Total** | **23** | | **5m 48s** |

Individual runs: Steady Low A **12s**, Low A & B **12s**, scale **14s**, scale up-down **23s**,
Amazing Grace **56s**, each finger-gym drill **~13s**, each ornament drill **~12s**.

Of the 5 "Tunes & patterns", **4 are the scale or two notes of it**. There is exactly **one
tune** in the app, and per `CLAUDE.md` its note data is still an unverified draft setting.
Of the 7 "Grace notes" drills, 6 are the same ornament transposed onto 6 different notes, and
the 7th is flagged provisional.

**Sessions to exhaustion:** a curious user can tap every chip in the app in **one 15-minute
sitting** and will have heard everything it contains. What remains after that is repetition of
12-second loops at incrementally higher tempi — which is legitimate practice, but it needs the
progression signal that F3 and F4 destroy to feel like anything but a treadmill.

**Fix:** (a) 8–12 more public-domain tunes is the real answer, and the repertoire policy in
`CLAUDE.md` already permits it. (b) Cheaper and pedagogically better per `PEDAGOGY.md` §2.4:
**chunk** each tune into 2-bar phrases as separate exercises — Amazing Grace alone becomes
7 practice items with mastery per phrase, from data you already have. (c) A "random 5-minute
warm-up" that assembles a session from the drill pool costs nothing and makes the library feel
larger than it is.

**Note the monetization collision:** the free tier is phases 1–3 and the paid unlock is
ornaments. Phases 1–3 is where essentially all 5m48s currently lives, and the paid side is
6 variations of one ornament. Right now the paywall would sit exactly at the point of content
exhaustion with almost nothing behind it.

---

### F6 — The failure screen is a dead end with no diagnosis. **P1**

**Evidence:** `04-bad-run-result.png`. A run with zero taps produces an empty lane, the word
**"Done"**, and: *"0% this run. Aim for 85% to move the tempo up."* — `RhythmLane.tsx:391–399`.
That is the entire feedback surface for failure. No indication of *why*, no next action, no
"try slower", no encouragement, and the lane is blank so there's nothing to look back at.

The app **already computes** the signed timing delta for every tap (`:139`, `bestDelta`) and
throws away the sign. It knows whether you are consistently early or consistently late — the
single most useful thing you can tell a beginner — and never says it.

**Why it costs retention:** `PEDAGOGY.md` §2.1 is explicit: *"Not 'try again' but 'your High-G
gracenote was late.'"* The failure path is where learners decide whether they're improvable.
Generic percentage + no path forward is the standard shape of a churn event.

**Fix:** keep signed deltas; on the results screen say *"You're running ~120ms ahead of the
beat — try feeling the click before you tap"* or *"3 of your 8 misses were on the D→E crossing
— drill that."* Then two buttons: **Try again** and **Try 6 bpm slower**. This also unlocks
`PEDAGOGY.md` §5's fault→drill catalogue, currently unimplemented.

---

### F7 — On re-open there's no "what do I do now." **P1**

**Evidence:** every launch lands on Guide, scroll 0 (`App.tsx:39`). Play resets to
`ALL_EXERCISES[0]` = "Steady Low A" every time (`App.tsx:41`) — verified: a returning user with
9 stages done and 5 recorded bests opens Play and is pointed at the drill they scored 100% on
in week one. Guide auto-opens the right stage but doesn't scroll to it (measured: 475px below
the fold).

**Why it costs retention:** a returning learner's first 5 seconds should be *"here's today's
practice, tap here."* Instead they get an unchanged front page and a chip row of 23 identical
buttons with no marks on them (verified: chip classNames carry no state beyond `is-active`).
Decision cost at re-open is a well-documented churn driver, and this app front-loads it.

**Fix:** a **"Today's practice"** card pinned above Phase 1: current stage + 2–3 recommended
drills (weakest-scoring first, plus one spaced-review item), each a single tap into a
preconfigured Play. Persist last tab + last exercise. Auto-scroll the Guide to the open stage.
Mark chips with their best score / a ✓ so the picker shows a map of what's been touched.

---

### F8 — Nothing is gated. Everything is visible on first launch. **P1**

**Evidence:** on a fresh install (empty localStorage), the Play picker renders all 23 chips
including *"Doubling of B"* and *"High-G on F"* — verified live. No exercise is locked behind
any stage, any accuracy, or the paywall.

**Why it costs retention:** two costs. First, no unlock cadence means no anticipation — there
is never a moment where something *new appears* because of something you did, which is the
cheapest recurring reward in the category. Second, it directly contradicts `PEDAGOGY.md` §2.2
("gate on mastery, not completion") and §3's mastery table, which the whole curriculum is
built around.

**Fix:** lock each exercise to the stage that teaches it, with the locked chip visibly showing
*"unlocks at Stage 9"*. This costs nothing to build, enforces the curriculum the pedagogy doc
already specifies, and converts the content shortage (F5) into a paced drip instead of a
5-minute buffet.

---

### F9 — Stage progress is self-reported when the app has the evidence to earn it. **P2**

**Evidence:** `App.tsx:272–274` — "Mark this stage done" is a manual toggle. Meanwhile stage
`scale-in-time` says *"Done when you can play the scale cleanly at 85% or better"*
(`curriculum.tsx:181`) and `bagpipe-lab-best['scale-up']` holds exactly that number. The two
never talk.

**Why it costs retention:** a checkbox you tick yourself carries no weight — the 17-stage
progress bar is decoration. An *earned* tick ("✓ unlocked — you hit 88% at 66 bpm") is a real
reward, and it's already sitting in storage.

**Fix:** where a stage has a measurable mastery criterion, auto-complete it from the score data
and animate the tick. Keep manual ticking for the read-only/physical stages (blowing, holding).

---

### F10 — Tapping a screen is not the instrument, and the app never bridges the gap. **P2**

The input is a screen tap while your actual chanter is in your hands. There's an unresolved
physical problem the app never addresses: you cannot hold a practice chanter with both hands
and tap a phone. So in practice the learner either plays the chanter and ignores the scoring,
or puts the chanter down and plays a rhythm game — and the rhythm game is a fairly thin one
(one lane, one button, no combo, no visual reward, no scoring texture beyond four numbers).

**Why it costs retention:** rhythm-game tapping *can* sustain practice (Beat Saber, Melodics)
but only with dense feedback — combos, streaks, escalating visuals, satisfying hit sounds. Here
a hit produces a chanter note and a coloured circle, and that's it. It isn't satisfying enough
on its own merits, and it isn't the instrument either.

**Fix (short term):** make the hit feel good — combo counter, escalating "x8 clean" text,
haptics via Capacitor, a per-note early/late tick mark so the lane teaches while you play.
**Fix (real):** the mic-based onset detection already scoped in `CLAUDE.md`'s roadmap is the
single biggest retention unlock available to this product — it removes the tap entirely, scores
the actual instrument, and resolves the both-hands problem. It should be prioritised as a
retention feature, not just an accuracy upgrade.

---

### Still-unfixed items from the prior review (`reference/ux-review-2026-07.md`)

Two of that review's own P1s are retention items and remain open, and I'd raise both:

- *"Mastery curve may feel stuck… an all-Good run is 50%… Reconsider the weighting."* — still
  exactly as described (F2). That review was right and it is more severe than P1.
- *"First tune is stage 15 of 17 — too far… No early quick win today."* — still true (see
  time-to-first-satisfying-moment below).

The P0 notation resequence *has* been done (verified: 7 phases, "Reading the music" now sits
after "Play in time"), so this review does not re-litigate it.

---

## Content inventory

| Item | Count | Notes |
|---|---|---|
| Guide stages | 17 across 7 phases | 8 have practice checklists; 9 are read-only prose |
| Guide CTAs into tools | 15 | handoff works well |
| Scored exercises (Feel the pulse) | 23 | all also playable in Read mode |
| — real tunes | **1** | Amazing Grace, draft setting, 56s |
| — scale/two-note patterns | 4 | 12–23s each |
| — finger-gym transitions | 11 | generated from `chanter.ts`; ~13s each |
| — ornament drills | 7 | 6 = the same high-G gracenote on 6 notes; 1 draft doubling |
| Notes explorable | 9 | one screen, `MeetTheChanter.tsx` — 36 lines |
| Scale player | 1 | fixed 550ms/note, no tempo control |
| **Total distinct audio, everything once** | **5m 48s** | |

**Sessions to exhaustion:** everything can be seen in **one sitting**. After that the app is
23 short loops replayed at rising tempi — and the tempo doesn't persist (F3), so it isn't even
that.

---

## Time-to-first-satisfying-moment

Measured honestly, in four different senses of "satisfying":

| Moment | Time | Notes |
|---|---|---|
| First pleasant sound the user caused | **~45s** | Play → Explore notes → tap a note. But it's three taps deep behind a text-heavy Guide, and nothing points at it on launch. |
| First thing that sounds like *music* | **~30s** *if discovered* | Select "Amazing Grace" in Read mode and press Play. This is the app's best hook and it is buried as the 5th chip in a row of 23, on a tab that isn't the landing tab. **The app plays it, not the user.** |
| First scored success ("I did that") | **~10 min** | Read stage → open drill → count-in → 8 taps → a percentage. Then per F2, a competent-but-uncalibrated beginner sees 60–80% and the message that they haven't earned the next tempo. |
| **First time the learner plays recognisable music on a real chanter** | **2–4 weeks** | Amazing Grace is stage **15 of 17**. Three intervening stages are budgeted "a few sessions" or "daily" by the Guide's own labels. Getting a physical chanter to sound clean alone is a week. |

**The gap that matters:** for a beginner instrument app, the retention-critical event is
"I made music." The app currently has no early proxy for it. The Guide's own path makes the
learner earn nine notes, a scale, a finger gym and three notation stages first. Bringing *one*
recognisable 8-note phrase forward to roughly stage 3 — playable badly, unscored, in the first
session — would likely do more for week-1 retention than every other fix in this document.

---

## Recommended retention mechanics, ranked

**Do these (high impact, low effort):**

1. **Persist the tempo ladder + best-@-bpm** (F3, F4). Half a day. Turns the app's central
   mechanic from a toy into a months-long progression. Highest ratio in the review.
2. **Session log + streak strip** (F1). One array of `{date, minutes, runs}` written on each
   finished run, rendered at the top of Guide. Unlocks streaks, "practised 4 of last 7 days",
   and the data for spaced review — all from one write.
3. **Fix the gate: Good→0.8, latency calibration, tempo-down button, "try slower?" on failure**
   (F2, F6). Removes the app's main humiliation surface and its unwinnable-device class.
4. **"Today's practice" card** (F7). Next stage + 2 weakest drills + 1 spaced-review item, one
   tap each. Kills the re-open decision cost.
5. **Bring one recognisable melody to session 1**, unscored and forgiving (time-to-first-music).
6. **Lock exercises behind their teaching stage** (F8). Nearly free; makes 5m48s feel paced
   instead of exhausted, and finally implements `PEDAGOGY.md` §2.2.
7. **Chunk Amazing Grace into 2-bar phrases** (F5). Multiplies practice items from existing data
   and matches `PEDAGOGY.md` §2.4.

**Do these next (high impact, real effort):**

8. **8–12 more public-domain tunes.** The only true fix for content depth.
9. **Spaced review queue.** `PEDAGOGY.md` §2.5 specifies it; the session log (2) supplies the
   data; it gives the app a genuine reason to be opened on a Tuesday — *"3 drills due today."*
10. **Mic onset detection** (F10). Strategically the biggest retention lever this product has:
    it makes the app score *the instrument*, which is the promise it's implicitly making.

**Explicitly wrong for this app:**

- **Hearts / lives / energy (Duolingo).** They punish practice volume. Here practice volume
  *is* the goal, and failure is the normal state of learning an instrument. This would make
  the F2 problem catastrophic.
- **Leaderboards and head-to-head.** `CLAUDE.md`'s own market note calls this a small, niche,
  committed adult audience. Small user base means empty or absurd leaderboards, which read
  worse than no leaderboard. Solo instrument, solo motivation.
- **Aggressive daily push guilt ("you're about to lose your 12-day streak!").** Wrong register
  for self-selected adult learners, and it drives notification-permission revocation, which
  costs you the *one* channel that actually works. One opt-in reminder at a user-chosen
  practice time; a streak that's shown but never weaponised; freezes/rest days by default.
- **Loss-framed streak mechanics generally.** Piping practice is legitimately interrupted by
  life. Count *sessions this month*, not consecutive days, or offer generous freezes.
- **Paywalling harder to force commitment.** Per F5, the free/paid line (phases 1–3 free,
  ornaments paid) currently sits exactly where the content runs out, with 6 variations of one
  ornament behind it. Fix depth before the boundary matters, or the paywall converts a
  boredom problem into a resentment problem.
- **Cosmetic collectibles / avatars / XP-for-its-own-sake.** This audience's reward is
  *"I played that cleanly at 78 bpm."* Give them the real number (F4) rather than a proxy
  currency; a fake economy reads as unserious to the exact people most willing to pay.
