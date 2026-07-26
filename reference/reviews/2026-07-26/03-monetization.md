# Bagpipe Lab — Monetization & the Free/Paid Boundary

Review date: 2026-07-26 · Lens: commercial / paywall design
Reviewed at commit state of `/home/user/Bagpipe-Lab`, driven live at `localhost:5173`.

---

## Verdict

**No. It is not price gated at all — there is no paid tier, no paywall, no IAP, and no analytics. Verified, not assumed.**

Searched `src/`, `index.html`, `package.json`, `codemagic.yaml`, `ios/` for `revenuecat|purchases|iap|paywall|posthog|premium|subscri|unlock|upgrade|entitle|restore`. **Exactly one hit: `ctx.restore()` in `src/RhythmLane.tsx:250`** — a canvas API call. `package.json` dependencies are React, React-DOM, and Capacitor core/ios. Nothing else. `index.html` is a bare 12-line Vite shell with no analytics snippet.

So the freemium plan in `CLAUDE.md` exists purely as prose. That is the *smaller* problem.

The bigger problem, and the headline of this review:

> **The half of the app that `CLAUDE.md` designates as paid is the half that isn't built.** The paid side today is one unverified draft tune, one ornament auto-generated into six near-identical drills, and one drill whose own UI copy admits its fingering is provisional. You cannot sell that. Building the paywall right now would be building a tollbooth on an unfinished road.

The free side, meanwhile, is genuinely good and already beats the $2.99 paid competitor on the App Store. The commercial problem is not that too much is free — it's that nothing that would justify money exists yet.

---

## What's actually built — free side vs. paid side

Using the **documented** boundary from `CLAUDE.md` ("free = phases 1–3, paid = phases 4–6") mapped onto today's 7-phase, 17-stage `src/curriculum.tsx`. The mapping is already broken: the doc predates the resequence, and today's Phase 4 is *Reading the music* — a prerequisite skill, not premium content.

### Would be FREE (Phases 1–3 · 11 of 17 stages)

| Phase | Stage | What's actually there | Real? |
|---|---|---|---|
| 1 Meet the instrument | Welcome | 356 words + how-to-use | ✅ Written |
| 1 | Meet the practice chanter | 211 words + `AnatomyDiagram` | ✅ Built |
| 1 | The reed | 293 words + reed close-up SVG | ✅ Built |
| 1 | Blowing steadily | 219 words + 3-item checklist | ✅ Written |
| 1 | Holding the chanter | 215 words | ✅ Written |
| 1 | Finger placement | 313 words + `FingerMapDiagram` + CTA | ✅ Built |
| 2 The nine notes | Learn the nine notes | Explore-notes tab, 9-note picker, verified fingering | ✅ Built, solid |
| 3 Play in time | The scale, in time | Scale tab + scored `scale-up` | ✅ Built |
| 3 | **Finger gym** | **11 generated transition drills w/ TAP/SNAP cues** | ✅ **Built, differentiated** |
| 3 | Steady rhythm | 2 patterns + tempo ladder + 85% mastery gate + best-score persistence | ✅ Built, good |
| — | *(tools)* | `RhythmLane` scoring engine, `TheScale`, `MeetTheChanter`, `ChanterDiagram` | ✅ All real |

**Free subtotal: ~1,607 words of prose, 3 full interactive tools, 17 scored exercises, a working tempo-ladder mastery loop.**

### Would be PAID (Phases 4–7 · 6 of 17 stages)

| Phase | Stage | What's actually there | Real? |
|---|---|---|---|
| 4 Reading the music | Why notation is simple | 395 words | ✅ Written |
| 4 | The staff, note by note | 281 words + `StaffDiagram` + `StaffPlayer` read mode | ✅ **Built — the strongest paid-side asset** |
| 4 | Reading the rhythm | 344 words | ✅ Written |
| 5 Your first tunes | Read while you play | Points at `scale-updown` — **an exercise that is already free** | ⚠️ No exclusive content |
| 5 | **Your first tune** | **`amazing-grace` — flagged DRAFT in `tunes.ts:26-29`, owner has never confirmed the melody** | ❌ **Unverified** |
| 6 Your first ornaments | Your first grace note | 6 drills — but all six are `highGDrill()` output, the *same* ornament on 6 principals (`ornaments.ts:37-51`) | ⚠️ One ornament, generated |
| 6 | *(Grace notes tab)* | `orn-doubling-b` — ships with UI copy saying "treat the exact fingering as provisional" | ❌ **Admits it may be wrong** |
| 7 Onto the pipes | From chanter to pipes | 248 words, no interactivity | ✅ Written |

**Paid subtotal: ~1,268 words of prose, 1 real feature (`StaffPlayer`), 1 unverified tune, 1 ornament, 1 provisional drill.**

### The three facts that decide everything

1. **`StaffPlayer` is real and good — but it has nothing exclusive to read.** Its content is `scale-up` and `scale-updown`, both already free in Feel-the-pulse. The *engine* is premium-grade; the *library* is empty.
2. **The headline paid tune is a guess.** `tunes.ts` says so in its own comment: *"This is a DRAFT pending the owner's correction of the exact notes and rhythm."* Pipers are a picky expert audience — shipping a wrong setting of Amazing Grace as the flagship paid item is the single largest reputational risk here.
3. **`reference/embellishments.md` lists 20 ornaments across the timing tree. One is shipped.** The doublings table is entirely `[needs owner]` — every cell after B is a literal `?`.

---

## Recommended boundary

### Not the documented one. Move the line down.

**Free: everything through the learner's first complete tune, plus the high-G gracenote.**
**Paid ("Bagpipe Lab Pro"): the tune library from tune #2 onward, plus the full ornament curriculum.**

Tab-level, concretely:

| Surface | Free | Paid |
|---|---|---|
| **Guide** tab | All 17 stages readable — the whole map, always | (nothing gated) |
| **Scale** tab | Entirely free | — |
| **Play** → Feel / Read / Explore | All three modes free | — |
| **Play** → Tunes & patterns | 4 patterns + Amazing Grace | 🔒 **Tunes 2–12** |
| **Play** → Finger gym | All 11 drills free | — |
| **Play** → Grace notes | High-G drills (6) | 🔒 Doublings, strikes, throws, grips, birl |
| **Grace notes** tab | Intro + high-G | 🔒 The rest of the timing tree |

### Why this line and not `CLAUDE.md`'s

**Gating Phase 4 (Reading the music) would be a mistake.** Reading notation is a *prerequisite*, not a reward. A learner who can't read can't use any tune you sell them — you'd be gating the key to the thing you're also gating. It also makes the free tier feel crippled at exactly the point the learner is still deciding whether the app is any good.

**Gate at the second tune, not the first.** The strongest paywall placement in a learning app is immediately after the learner's first genuine competence win, at the moment they can see the next one. In this app that moment is unusually well-defined and already instrumented in code: `RhythmLane.tsx:311` — `mastered = status === 'done' && accuracy >= MASTERY_PCT`. A learner who has just played Amazing Grace start-to-finish at 85% has *proof the app works on them*. That is the highest-intent second of the entire experience, and it is currently followed by nothing.

Giving away the first full tune costs you little (it's one tune) and buys you the only thing that converts in a niche this small: a learner who genuinely believes the method works.

**Never gate the Guide.** It's the map. Locking stages a learner hasn't reached yet reads as hostile, and the Guide is what earns the "this is a real course, not a toy" reviews that drive word-of-mouth in r/bagpipes. Show all 17 stages; gate the *tools* the later ones open.

---

## Is the paid side worth paying for?

**Today: absolutely not.** A learner who paid would receive: one tune whose notes may be wrong, six copies of one ornament, and a doubling drill that tells them in writing it might be incorrect. That earns 1-star reviews and refund requests from an audience that knows the subject better than the app does.

**Under the recommended boundary, once built: yes, and comfortably** — because what sits behind that line is exactly what pipers actually want and cannot get elsewhere in this form: *a graded tune repertoire with the ornaments layered on in the order a real teacher would layer them.*

### The single highest-leverage addition

**A verified tune library — 8–12 public-domain tunes, each with a "Be ready for:" prerequisite list and a plain → ornamented progression.**

Nothing else comes close. Reasoning:

- It's the only thing that converts *desire* (people learn pipes to play tunes) into a purchase.
- It scales the paid side without new engineering — `RhythmLane`, `StaffPlayer`, `rhythmEngine`, and the `graces` field already handle it. This is a **data problem, not a code problem**, which makes it unusually cheap.
- It gives the unlock ongoing value: new tunes ship as free updates to purchasers, which is what makes a one-time IAP feel generous rather than final.
- It fixes the Amazing Grace risk as a side effect, because verifying tune #1 becomes part of the same workstream.

**The blocker is not engineering — it's the two `[needs owner]` items.** The doublings table in `reference/embellishments.md` and the Amazing Grace melody confirmation are, right now, the two things standing between this app and having anything to sell. Everything else is downstream of those.

Runner-up: **mic-based onset detection** (deferred in `CLAUDE.md`). It's the only feature no competitor has and the honest answer to "am I actually playing this right, or just tapping a screen?" — a real weakness a skeptical piper will spot immediately. High willingness-to-pay, but far more expensive than tune data. Correctly sequenced as later.

---

## Price recommendation

### **$14.99 one-time unlock. Launch at $9.99 as a founder price.**

Verified market anchors (found this session, real):

- **Bagpipe Basics** — **$2.99**, paid upfront. Direct competitor: chanter animations + music staves + scale + basic notation. This app's *free* tier already exceeds it.
- **Bagpipe Tutorial** — free with consumable "Pipe Coin" IAPs from **$3.99 (10 coins) to $69.99 (500 coins)**. 700+ videos.
- **Eskin's uilleann app** — **$4.99**.

From memory, flagged as unverified: practice chanters ~$30–80; the College of Piping / National Piping Centre tutor books ~$20–30; in-person lessons ~$30–60/hour; online piping schools (Dojo University and similar) roughly $20–40/month subscription.

**The reasoning:**

The $2.99 competitor is the wrong anchor — that's a reference app, this is a course. The right anchors are the tutor book (~$25, one-time, no interactivity, no feedback) and *one hour* of in-person instruction (~$40). A one-time $14.99 that includes a scored practice engine and a graded tune library is straightforwardly cheaper than either and easy to justify in a review or a forum post.

The Bagpipe Tutorial data point matters more than it looks: **a competitor in this exact niche is successfully charging up to $69.99.** Willingness to pay here is real and higher than general music-app instincts suggest. This audience already spends $300+ on an instrument and buys books. $2.99-tier thinking leaves money on the table.

Do not price at $4.99. In a small niche you cannot make it up on volume — `CLAUDE.md`'s own market note says the download ceiling is low. With a hard ceiling on installs, **price per conversion is the only lever you have**, and an underpriced educational app also signals low quality to exactly the committed buyer you want.

$14.99 with a $9.99 founder price for the first cohort gives you a genuine urgency hook for the r/bagpipes launch post and a clean A/B read on elasticity before you settle.

### On the one-time-IAP portfolio policy

**Keep it. It's right for this app** — and I'd argue that more strongly here than for a general music app:

- The piping audience skews older and is measurably subscription-averse; the forums are hostile to rental software.
- The product is a *course with an ending*, not a service. Subscriptions need continuous delivery this owner can't sustain solo.
- It's a sharp differentiator against the subscription piping schools, and it's a marketing line: *"buy it once."*

**But name the tradeoff:** one-time IAP caps LTV at a single transaction in a niche with a low install ceiling. That is precisely why the number must be $14.99 and not $4.99. The policy is sound; pricing it like an impulse purchase is what would make it fail.

---

## Conversion mechanics — placed in this app's real screens

Right now **a user could use this app for a month and never learn a paid tier exists.** Fixing that is mostly UI, and cheap. In priority order:

**1. Locked-but-visible tune chips — `PlayTab`'s `ExerciseGroup` (`App.tsx:377-410`).**
The single highest-leverage change. Add a fourth group, **"Tunes"**, rendering real tune names with a lock glyph on a dimmed `exercise-chip`. The learner *sees* "Scots Wha Hae 🔒", "The Rowan Tree 🔒" every time they open the tab they use most. Tapping a locked chip opens the paywall with that tune named in the header — context-specific, not generic. The `ExerciseGroup` component already takes an item list; this is an `isLocked` prop and a CSS class.

**2. The mastery moment — `RhythmLane.tsx:311`, the `mastered` branch.**
The `done` state already computes `mastered` and swaps the Tap button for "Step up to N bpm ›". Add: when the mastered exercise is `amazing-grace`, render an upsell card *below* the score row — **"You just played your first tune, start to finish. Unlock 11 more →"**. Success moment, not frustration moment. This will be your highest-converting placement; instrument it separately so you can prove that.

**3. Guide path stage cards — `StageCard` (`App.tsx:186`).**
Stages in Phases 6+ get a small "Pro" badge in `.stage-head` next to the number chip. Keep the concept text readable; lock only the CTA buttons, which become "Unlock to practise ›". The learner reads the whole road ahead and sees precisely where it turns paid. The path metaphor is already built — this costs almost nothing.

**4. Grace notes tab — `EmbellishmentsTab` (`App.tsx:412`).**
It is *already* a teaser and doesn't know it. That closing paragraph — *"More ornaments — the doubling, strikes, throws, grips, the birl — build from here"* — should become a **visible locked list**, one row per ornament, pulled from `reference/embellishments.md`'s timing tree, grouped by ends-on / starts-on / across the beat. Twenty named rows with locks is a far stronger pitch than one sentence, and it makes the paid side *look* as substantial as it will be. Highest-intent surface in the app: anyone on this tab has already decided they want to sound like a piper.

**5. Free trial of one premium item.** Unlock exactly one paid tune (a different one from the free Amazing Grace) as a one-time taste, triggered *after* the first mastered run. Lets the learner feel the tune library rather than imagine it.

**Do NOT place:** a launch interstitial (kills D1 retention, and this audience resents it); any prompt after a *failed* run — `RhythmLane`'s `!mastered` branch must stay purely encouraging; nor anything in Phases 1–3, where the learner hasn't yet felt a win.

**Required, currently absent: a Settings/About screen.** There is no fifth tab, no settings surface, nowhere to put **Restore Purchases** — which App Store Review requires (3.1.1). Also needs a home for the privacy policy and a "Restore" path for reinstalls. This is a launch blocker, not a nice-to-have.

---

## Minimum analytics to make this tunable

`CLAUDE.md` inherits PostHog from the portfolio; **none of it is wired** — no snippet in `index.html`, no dependency. Without this the owner is blind: no drop-off data, no conversion data, no way to tune a paywall. Wire the CDN snippet as a no-op until a real key exists (the documented portfolio pattern).

Minimum viable event set, tied to real surfaces:

**Funnel / retention**
- `app_open` · `first_open`
- `tab_viewed { tab }` — `App.tsx:39` `setTab`
- `stage_opened { stage_id, phase, index }` — `StageCard` `onToggleOpen`
- `stage_marked_done { stage_id, phase }` — `toggleDone`, `App.tsx:117`
- `checklist_ticked { stage_id, item_index }` — `toggleTick`
- `cta_clicked { stage_id, target_tab, play_mode, exercise_id }` — `openPreset`, `App.tsx:43`. **Measures whether the Guide→tool bridge actually works** — the core architectural bet of the 2026-07-16 rework, currently unmeasured.

**Engagement / value proof**
- `exercise_started { exercise_id, group, mode, bpm }`
- `exercise_completed { exercise_id, mode, bpm, accuracy, perfect, good, miss, mastered }` — `RhythmLane.tsx:311`
- `tempo_stepped_up { exercise_id, from_bpm, to_bpm }` — `stepUp`, `RhythmLane.tsx:334`. **The single best engagement signal in the app**: it means the learner got better.
- `mode_switched { from, to }` — feel / read / notes
- `first_tune_completed { exercise_id, accuracy, days_since_first_open }` — the conversion trigger

**Monetization**
- `paywall_shown { placement }` where placement ∈ `picker_lock | guide_stage | mastery_moment | grace_tab | tune_chip`
- `paywall_dismissed { placement, seconds_visible }`
- `purchase_started | purchase_completed | purchase_failed { product_id, price, placement }`
- `restore_tapped | restore_completed`

**The four numbers the owner should actually watch:**
1. % of installs reaching their first `exercise_completed` with `mastered: true` — does the method land at all?
2. % reaching `first_tune_completed`, and median days to get there — is the free tier the right length?
3. `paywall_shown → purchase_completed`, **split by placement** — proves or kills the mastery-moment hypothesis.
4. Stage index of last `stage_opened` per user — the drop-off cliff. The 2026-07 UX review predicted Phase 4 (reading) is where people break; this is how you confirm it with data instead of lenses.

---

## Findings, ranked

### P0 — blocks any paid launch

1. **The paid side is not built.** One unverified tune, one ornament ×6, one self-declared-provisional drill. *Fix: do not ship a paywall until the tune library exists. Build content first, paywall second.*
2. **`amazing-grace` is an unconfirmed guess shipping as the flagship tune** (`tunes.ts:26-29`). Expert audience; a wrong setting will be called out publicly. *Fix: get the melody as note names from the owner before it goes behind any paywall — this is one of two `[needs owner]` items gating all monetization.*
3. **`orn-doubling-b` ships copy admitting its fingering is provisional** (`ornaments.ts:56-59`, echoed in the Grace notes tab). Unsellable as-is. *Fix: verify via the `reference/embellishments.md` doublings table, or remove it from the paid bundle entirely.*
4. **No Restore Purchases surface, because there is no settings screen.** App Store Review 3.1.1 requires it. *Fix: add a fifth tab or a header gear icon with About / Restore / Privacy.*
5. **Zero analytics.** The paywall would be untunable and drop-off invisible. *Fix: wire the PostHog snippet + the event list above before, not after, launch.*

### P1 — materially affects revenue

6. **Nothing in the app communicates that a paid tier exists.** *Fix: locked tune chips in `ExerciseGroup` — highest-leverage single change.*
7. **The documented boundary no longer maps to the product** and would gate reading notation, a prerequisite. *Fix: adopt the recommended line (free through first tune) and update `CLAUDE.md` §Monetization, which is now stale against the 7-phase curriculum.*
8. **The free web build undercuts a paid iOS launch.** `CLAUDE.md` records a public GitHub Pages deploy at `pablohoney1977.github.io/Bagpipe-Lab/` with the full app. If it stays fully free, there is no reason to buy on iOS. *Fix: decide deliberately — either gate the web build the same way, or cut it to a marketing/demo subset. Not verified live (sandbox blocks `*.github.io`); taken from `CLAUDE.md`.*
9. **The mastery moment is unmonetized.** `RhythmLane`'s `mastered` branch is the best conversion surface in the app and currently ends the interaction.
10. **The Grace notes tab under-sells the paid side** — 20 ornaments exist in the reference, one sentence mentions them.

### P2 — worth doing before scale

11. **Six "different" grace-note drills are one generated function.** A buyer will notice `highGDrill()` output repeated across principals. Padding the paid count this way invites bad reviews.
12. **Progress is localStorage-only** (`bagpipe-lab-progress`, `-checklist`, `-best`). Reinstall loses all progress while the purchase restores — a jarring, review-worthy mismatch. Consider exporting progress or noting it in-app.
13. **No App Privacy disclosure / privacy policy**, required once PostHog is added.
14. **Consider positioning the free tier as the competitive weapon.** It already beats the $2.99 Bagpipe Basics. Say so in the store listing: "the free tier alone does more than the paid competition" is a strong r/bagpipes hook and makes the unlock look like an upgrade rather than a gate.

---

## Claims I could not verify

**Verified this session (real, cite-able):**
- No monetization/analytics code anywhere in the repo — searched directly.
- Bagpipe Basics **$2.99**; Bagpipe Tutorial free + Pipe Coin IAPs **$3.99–$69.99**; Eskin uilleann app **$4.99**. From live search results.
- All curriculum structure, exercise counts, word counts, and code line references — read from source and driven live in the browser.

**From memory — the owner should double-check before betting on them:**
- Tutor-book pricing (~$20–30 for College of Piping / National Piping Centre books).
- In-person piping lesson rates (~$30–60/hour).
- Online piping school subscription pricing (~$20–40/month, Dojo University and similar).
- Practice chanter retail (~$30–80).
- The characterisation of the piping audience as older-skewing and subscription-averse — plausible and consistent with `CLAUDE.md`'s own market note, but it is my inference, not measured data. **The r/bagpipes launch post is the cheapest way to test both this and the price point before committing.**
- App Store Review Guideline numbering (3.1.1 restore, 4.2 minimum functionality) — directionally correct from memory; confirm current numbering against Apple's live guidelines.

**Not verifiable here:** the live GitHub Pages deployment state (sandbox blocks `*.github.io`), and Jazz Guitar Lab's actual price point and paywall placement — the stated sibling model. **Worth pulling that app's real numbers before setting this one's**, since the portfolio-consistency argument is only as good as the sibling's results.
