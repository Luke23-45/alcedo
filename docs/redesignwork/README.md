# Workout split redesign — the plan

**Status:** planned, not started. Companion ledger: [`workout-split_ledger.md`](workout-split_ledger.md)
(source of truth for what is done).

The active workout is one page doing two jobs: it *lists* the session and it *performs* the work.
This split gives each job a screen.

| Screen | Route | Job |
| --- | --- | --- |
| **Session list** (today's freeform page) | `/(tabs)/(session)/session` | Browse the session. Totals, every exercise's state, where you are. Navigate. Add. Finish. |
| **Workout detail** (new) | `/(tabs)/(session)/session/exercise?sessionId=&index=` | Do the work. One exercise, full attention, all of its information, one thumb. |

---

## 1. Research — what the good apps actually do

Read in September 2026 across Hevy (incl. Hevy Coach + 2026 features guide), Stronglifts, Hevy
support docs, SmartWorkout, Tempo, Trainlike, Next Set, Alpha Progression, plus Apple's own
`HKWorkoutSession` documentation and its lifecycle contract. What is genuinely load-bearing:

**1. A workout is a state machine, and Apple already specified it.**
`HKWorkoutSessionState` is `notStarted → prepared → running ⇄ paused → stopped → ended`, with
`prepare()`, `startActivity(with:)`, `pause()`, `resume()`, `stopActivity(with:)`, `end()`. Notes
transitions through a delegate. Three properties worth copying:

- **Pause is a first-class state, not a flag on the timer.** Time stops being collected; the session
  survives; `resume()` returns to running. It can cycle any number of times.
- **There is no path from `stopped` back to `running`.** Finishing is terminal. (Today
  `sessionFinished` already behaves this way — `selectSessions` excludes `activeSessionId` forever.)
- **Nothing is measured until Start.** A workout has an explicit start event, not "whenever the first
  set happened to be tapped". Our clock today derives from `firstExercise.earliestTime`, which is
  exactly the anti-pattern: open the app, walk to the rack, tap set 1 — and 4 minutes of walking are
  billed as training.

**2. Pause must also stop the *other* clocks.** Tempo pauses rest and lets the phone do anything
else; Stronglifts auto-pauses after 10 minutes of inactivity; SmartWorkout exposes auto-pause. A pause
button that leaves the lock-screen rest timer counting is a lie the app tells itself.

**3. Per-set type is table stakes.** Warm-up / working / failure / drop. Warm-ups are *excluded* from
volume and PR statistics (Hevy makes this an explicit user setting, "Warm Up Sets — choose whether to
include warm-up sets in workout stats", and recalculates history when you flip it). A warm-up set
should not earn a PR badge.

**4. RPE / RIR is the autoregulation primitive.** Hevy: an extra column, per set, optional, blank by
default — you log it only on the sets where it matters (usually compounds, not isolation). Tempo
prompts for RIR mid-workout and feeds it into the next weight recommendation. SmartWorkout's whole
pitch is "heavier is not always progress" — RIR/tempo/rest let you tell progress from a good day.

**5. The single most-wanted feature is a *verdict*, not a number.** Trainlike ships verdict chips:
`+5 LBS`, `+1 REP`, `MATCH YOUR BEST`, `HOLD STEADY`, `EASING BACK`. Hevy ships live PR notifications.
Nobody ships "here is your e1RM" alone during a set — the lifter wants to know **what to do next**.
**We can compute this honestly for free:** `applyProgression(progression, exercise)`
(`models/blueprint-models/index.ts:653`) already exists, already returns the exercise a rule would move.
Run it on a probe copy, diff against the current exercise, and the verdict falls out. No invented math.

**6. "Focus mode, one set at a time" is a named feature** (Trainlike). It is the market telling us this
screen exists. Everyone else calls it the set logger; the split is the same idea taken seriously.

**7. Rest timers are prescribed per exercise, and a warm-up rest is shorter.** Trainlike: "a separate,
faster warm-up rest timer". Hevy: per-exercise automatic timers, toggleable.

**8. Plate calculator is a per-side, inventory-aware feature** (Trainlike: "plate calculator, per side;
your own plate and bar inventory"). Greenfield for us. **Out of scope for this split** — logged as
future work (L-F1), because it needs its own settings surface and its own model.

**9. Plate/live-haptics and live PR celebration matter more than any single stat.** Hevy's "live PR
notification" is opt-in with a volume slider, because it fires constantly. Our PR language already
exists in gold (`theme.exerciseHistory.gold`) — reuse it, do not invent a second celebration colour.

### What we deliberately are not copying

- Hevy's editable-everything-in-place density. It is superb and completely wrong for a screen whose
  whole job is focus. Detail page is one exercise, generous, thumb-first.
- Tempo's camera form coaching and range-of-motion meters. Not a logger concern.
- SmartWorkout's periodisation engine. Its own pitch, its own ledger.

---

## 2. Decisions

Recorded here so a later reader does not relitigate them.

| # | Decision | Why |
| --- | --- | --- |
| D1 | **Persist a real workout clock** — `startedAt`, `pausedAt`, `pausedTotalMs` on `Session`, `SessionJSON` v9. | HKWorkoutSession shape. Elapsed must run from Start, not from the first set. Pause must survive app kill. `pausedTotalMs` folds each completed pause into one number, so N pause cycles need N+1 fields, not a pause-event list. |
| D2 | **Derive the workout phase, don't store an enum.** `idle = !startedAt`; `running = startedAt && !pausedAt`; `paused = startedAt && pausedAt`; `finished` = no longer the active session. | A redundant enum can disagree with its own fields. Two facts, one derived state, no drift. This is the Apple-minimal choice. |
| D3 | **Persist set `type` + `rpe`** on `RecordedSet`, `SessionJSON` v9, in the same step. | Table stakes (§1.3, §1.4). Warm-ups excluded from volume + PR. RPE drives the effort lane and the "you were at an 8, next time go 9" advice. |
| D4 | **Warm-up and failure are the only two types the app auto-derives.** `drop` is user-set. | You do not accidentally take a drop set; you do accidentally fail one. `working` is the default. |
| D5 | **RPE gated behind a new setting** (`settings.rpeTracking`, default off). | Hevy's own default. An always-on empty column is dead chrome. Absent → the row reclaims the space; nothing renders a placeholder. |
| D6 | **Timers live on the detail page only.** | The list page is for orientation; a countdown competes with that. Rest still *earns* on set-write from the shared reducer, so the lock-screen/wearable mirror is unaffected by where the card renders. |
| D7 | **Drop the `avgBpm: '128'` sample stat from the list strip.** Replace with `EXERCISES 4/6`, which is real. | Hardcoded sample heart rate on a redesigned workout screen is exactly the "looks fake" failure. The old strip's `SampleBadge` honesty hack stays in history views where it already ships. |
| D8 | **The totals strip becomes a 2×2 tile grid** (`TIME`, `SETS`, `VOLUME`, `REPS`), not 4 columns. | The session polish ledger already documents AVG overflowing at 320pt (W03b). A 2×2 grid is Apple "Tiles", never overflows, and each tile earns its own micro-detail. |
| D9 | **Elapsed moves off the top of the list page into the totals grid.** | The instruction is "remove the time from the top" — the hero `ElapsedCard` goes. Duration is a session total, so it belongs in the totals surface, not as a second hero above it. |
| D10 | **One row, one destination.** Tapping any part of an exercise row on the list navigates to the detail page. No nested targets on the row. | A row with a chevron that also has an inline log button is the ambiguity we are removing. |
| D11 | **The verdict is computed by diffing `applyProgression`, never by new math.** | It is the plan's own engine. It cannot disagree with the plan editor. |
| D12 | **Hard copy first, then refactor — for both screens.** | Explicit instruction, and correct: the detail page must be visible and working before the list page loses its set logger. Phases are gated on that. |
| D13 | **New route is a session-stack sibling**, `session/exercise.tsx`, query-param driven, with a `getSessionExerciseHref(sessionId, index)` helper. | Matches `/exercise-editor?sessionId=&index=` and `/workout-editor?sessionId=&focus=` exactly. Staying inside the session stack means back returns to the list with the list's scroll position intact. |

---

## 3. Architecture

### 3.1 Model changes (phase 2 — before any UI)

```
SessionJSON  v8 → v9
  + startedAt?:    OffsetDateTimeJSON
  + pausedAt?:     OffsetDateTimeJSON
  + pausedTotalMs?: number
RecordedSetJSON   (same step)
  + type?: 'warmUp' | 'working' | 'failure' | 'drop'
  + rpe?:  number            // half steps 6.0 – 10.0
```

Migration step is a **pure additive identity** (`migrations/session.ts` gains one `.add()`; a new
`steps/add-workout-clock.ts` + `steps/add-set-effort.ts`). Every pre-v9 row keeps byte-identical
meaning: absent `startedAt` → clock still derives from the first set, and the pause control is hidden
because a workout that has not started has nothing to pause.

`Session` gains:

```ts
withStartedAt(now)                     // idle → running
withPaused(now)                        // running → paused   (stamps pausedAt)
withResumed(now)                       // paused  → running  (folds pausedAt into pausedTotalMs)
workoutPhase: 'idle' | 'running' | 'paused'
elapsedMsAt(now)                       // (now − startedAt) − pausedTotalMs − (pausedAt ? now − pausedAt : 0)
duration                                // elapsedMsAt(lastExercise.latestTime ?? startedAt), legacy fallback
```

`RecordedSet` gains `type` (default `'working'`) and `rpe` (`number | undefined`), plus
`withType` / `withRpe`.

**Four traps, all load-bearing — each is a ledger item:**

1. `RecordedSet.equals()` must compare `type` and `rpe`. `Session.equals()` is the persistence dirty
   check (`updateStoredSession` → `effects.ts`); miss it and edits to RPE never reach disk.
2. `totalWeightLifted`, `calculate-stats.ts` (volume + `calculateOneRepMax`), and
   `personal-records.ts` must skip `warmUp` sets. Otherwise warm-ups inflate tonnage and mint PRs.
3. `store/workout-worker/helpers.ts` builds the lock-screen/wearable `RestTimerInfo` from
   `session.restTimer`. A paused workout must also pause the mirrored rest countdown, or the watch
   counts down through a phone that says "paused".
4. `auto-pause-on-lock.tsx` currently pauses only the *rest* timer. With D1 it should pause the
   *workout* (Stronglifts precedent) — but it must not fight the explicit pause button, and it must
   not auto-pause a session that was never started.

### 3.2 The focus state machine

Two orthogonal axes. The screen is a pure function of both, which is what makes it testable to
exhaustion rather than by hand.

**Axis A — workout phase** (`session.workoutPhase`, D2): `idle | running | paused`.

**Axis B — exercise phase**, derived per exercise:

| Phase | Rule |
| --- | --- |
| `complete` | `exercise.isComplete` |
| `resting` | a rest timer exists **and this exercise earned it** **and** rest phase is `resting` |
| `restReady` | ditto, rest phase `ready` |
| `restOver` | ditto, rest phase `over` |
| `current` | `session.nextExercise === exercise` |
| `upcoming` | no set logged yet |
| `ahead` | some sets logged, some remain, not the session's next exercise (a superset partner) |

> "This exercise earned it" is new and matters: today `session.restTimer` is a single session-wide
> value with no owner. `RestTimer` gains `exerciseIndex`. Without it, the detail page for exercise 1
> would show exercise 4's countdown.

**Composition → `FocusState`** (pure, in `workout-focus-state.ts`, zero React Native imports so the
simulation suite can enumerate the whole space):

| Workout | Exercise | `FocusState` | Primary CTA | Secondary |
| --- | --- | --- | --- | --- |
| `idle` | any | `start` | Start Workout | Add exercise |
| `running` | `upcoming` / `current` | `ready` | Log Set *n* | Skip (dismiss rest) |
| `running` | `resting` | `resting` | — (timer owns it) | +15 / −15 / Skip / Pause rest |
| `running` | `restReady` / `restOver` | `restReady` | Log Set *n* (highlighted) | Log anyway |
| `running` | `complete`, a next exists | `exerciseDone` | Next Exercise *name* | Finish workout |
| `running` | `complete`, last | `allDone` | Finish Workout | — |
| `paused` | any | `paused` | Resume Workout | Finish workout |

Rules that make it *honest*, not just pretty:

- **Paused is absorbing.** No logging, no rest earning, no auto-rest, while paused. The primary CTA
  is Resume. Logging while paused is offered as an explicit two-step "Resume & log", never silently.
- **No dead buttons.** Every CTA in the table resolves to a real action in that exact state; the
  regression test asserts the CTA is non-null for all 21 rows and that its handler is defined.
- **Superset-aware "next".** If `blueprint.supersetWithNext`, "Next Exercise" is the partner, not the
  following row — matching `session.nextExercise`'s own superset-chain walk.
- **RPE and set type never block logging.** Both are optional annotations; the set logs without them.

### 3.3 Progression verdict (D11)

```ts
// components/presentation/workout/detail/progression-verdict.ts — pure
type Verdict =
  | { kind: 'increaseLoad'; step: BigNumber }
  | { kind: 'increaseReps'; step: number }
  | { kind: 'resetReps'; target: RepsTarget }        // onCeiling: 'reset' ladder handed over
  | { kind: 'hold'; reason: 'noRule' | 'noLoad' | 'atCeiling' }
  | { kind: 'ease'; reason: 'failureSet' | 'missedTarget' }
```

`applyProgression(blueprint.progression, probe)` where `probe` is a copy with the working sets
cleared, diffed against the copy. `ease` short-circuits: a logged `failure` set, or any set below its
target `.min`, means hold the load and drop the reps. This is SmartWorkout's "avoid fake progress",
implemented with the plan's own engine.

Rendered as one chip under the next-set prescription, with the arithmetic shown: `+2.5 kg`,
`+1 rep`, `HOLD STEADY`, `EASE BACK`. `Trainlike`'s pattern, our engine.

### 3.4 Navigation

```
Session list  ──tap row──▶  Workout detail (index)  ──"Next"──▶  Workout detail (index+1)
      │                            │                                      │
      ├── Add exercise ──▶ /exercise-editor?isNew=1 ──▶ back to list     │
      └── Finish ──▶ /session/post-workout?source=finished                │
                                   │
                                   └── per-row: /exercise-history?name=&type=
                                        /stats/expanded-weighted-exercise?exerciseName=
                                        /exercise-editor?sessionId=&index=  (⋯ menu)
```

One `getSessionExerciseHref(sessionId, index)` in `components/smart/session-exercise/`, `as Href`,
`encodeURIComponent` on both params — the existing house convention.

---

## 4. Screen specification

Read with `.agents/skills/apple-ios-frontend/SKILL.md` as law. Every number below is a real number:
4pt grid, `type(theme, …)` for type, `theme.color.*` / `theme.space.*` / `theme.radius.*` for
everything else, `borderCurve: 'continuous'` on every card, two strokes per card (body gradient +
edge gradient via `HomeCard`), 2-stop gradients on every accent, computed dash arrays, negative
tracking on display sizes and positive on uppercase micro-labels, 44pt targets.

### 4.1 Session list — `/(tabs)/(session)/session`

Render order (this replaces `ActiveSessionView`):

```
0  Nav                    session name + ⋯ menu        (unchanged)
1  Totals grid            2×2: TIME · SETS · VOLUME KG · REPS     [D8, D9]   sticky
2  Exercises header       "EXERCISES 4 / 6"             (existing, kept)
3  Exercise rows          navigation rows              [REDESIGN]
4  Add exercise           dashed row + empty state     (unchanged)
5  Notes card             (unchanged)
6  Progress line          "4 sets to go"                [NEW]
7  Finish card            brand button + gate hint     (existing, timer slot now empty)
```

**No `ElapsedCard`.** No timer card. Everything else stays.

**Totals grid (1).** Four tiles, 2×2, `theme.home.radius.tile` (24), `HomeCard elev="tile" pad={16}`,
12pt gutter. Each tile is `label` (9/700/+1.2 uppercase, `theme.color.content.tertiary`) over
`value` (`metricM`/22, tabular, `theme.color.content.primary`) over a third micro-detail line
(11/500). That third line is what makes each tile earn itself, per the skill's "every section earns
its own micro-detail":

| Tile | Value | Micro-detail |
| --- | --- | --- |
| TIME | `47:12` (`metricXL`-adjacent, tabular) | `+6 min vs last` when a previous comparable session exists |
| SETS | `18 / 24` | a 3pt progress rule: `18/24 × width`, `rx = h/2`, fill `rest_timer` 2-stop gradient, track 8% |
| VOLUME KG | `4 820` | best single set `· 140 kg × 6` |
| REPS | `386` | `· 21 sets` (avg reps/set) |

When the session is empty every tile renders dimmed (`0`, `—`) exactly like the current
`StatStrip dimmed` state, so the empty state is one code path.

**Exercise row (3).** `HomeCard elev="card" radius={24} pad={0}` — same material as today, new
internals. Whole card is one `Pressable` (D10), `minHeight` 84, `accessibilityRole="button"`,
`accessibilityLabel` = "Bench Press, 4 of 5 sets, 1 240 kilograms, opens detail".

```
┌──────────────────────────────────────────────┐
│ ⬤ ①  Bench Press                        ›    │   index tile · name title3/20 −0.35
│         Barbell · Chest                        │   meta caption2, tertiary
│         ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬░░░░░  4/5          │   progress rule (computed)
│         1 240 kg · last 60×8, 60×8, 60×7      │   status + prev line caption1
└──────────────────────────────────────────────┘
```

- **Index tile** — existing `IndexTile`, but the fill encodes phase: green 14% + green numeral when
  `complete`, brand red 16% when `current`, `fill.quaternary` when `upcoming`/`ahead`. Replaces the
  old text chip with something readable at a glance down the list.
- **Progress rule** — height 3, `rx = 1.5`, track `theme.color.fill.quaternary`, fill a 2-stop
  gradient: complete `#7BE000 → #D6FF52` (the rest timer's own done stops, so one green in the app),
  in-progress `#FF0A47 → #FF7A96`. Fill width = `completed / total × trackWidth` measured from
  `onLayout`, never a guessed percentage.
- **Next-row rail** — `session.nextExercise` gets a 2pt brand-tinted left rail inset 1pt from the
  card edge and a `NEXT` micro-chip. One glance answers "where do I tap".
- **Prev line** — from `selectRecentlyCompletedExercises(sessionId)(movementKey())[0]`, formatted
  `60 kg × 8, 60 × 8, 60 × 7`, `numberOfLines={1}`. Absent for a movement never done before; the line
  then reads the plan's prescription instead, never a blank.
- **Cardio rows** — the tonnage/prev line becomes `12 min · 4.2 km` and the progress rule counts
  `isCompletelyFilled` sets. Same card, different payload, discriminated on `.type`.
- **Superset** — a 12pt link glyph in the 8pt gutter between a superset pair, plus the partner's name
  in the meta line.

### 4.2 Workout detail — `/(tabs)/(session)/session/exercise`

Not a list page. One exercise. The layout is a **fixed action bar + scrolling body**, because the
primary action must never scroll out of thumb reach during a set.

```
┌──────────────────────────────────────────────┐
│ ‹  Bench Press                        ⋯      │   nav (SessionNav, same as list)
├──────────────────────────────────────────────┤
│  FOCUS CARD                                  │   §4.2.1 — the state machine's face
│    (hero, gradient body + edge, glow)         │
├──────────────────────────────────────────────┤
│  SETS                                        │
│   ① − 62.5 +   × 8        RPE 8      [✓]     │   §4.2.2 — redesigned set rows
│       target 6–8 · prev 60×8                 │
│   ② ...                                      │
│   + Add set                                  │
├──────────────────────────────────────────────┤
│  VS LAST TIME                                │   §4.2.3
│   Set 1   60 × 8  →  62.5 × 8    ▲ +2.5 kg   │
│   Set 2   60 × 8  →  60 × 8      ▲ +1 rep    │
│   Set 3   60 × 7  →  —                      │
├──────────────────────────────────────────────┤
│  PLAN & PROGRESSION                          │   §4.2.4
│   [ +2.5 KG ]   REST 60–90 s   SUPERSET →    │
│   Notes…                                      │
├──────────────────────────────────────────────┤
│  LAST 8 SESSIONS      [sparkline + dots]  ›  │   §4.2.5
├──────────────────────────────────────────────┤
│  ▬▬ rest timer card (when running) ▬▬        │   §4.2.6
├──────────────────────────────────────────────┤
│  [ secondary ]      [ ▂▂ PRIMARY CTA ▂▂ ]    │   §4.2.7 — pinned, 54pt
└──────────────────────────────────────────────┘
```

#### 4.2.1 Focus card — the hero

`HomeCard hero radius={30} pad={20}`, plus a phase aura behind it (`radial-gradient` in the phase
hue at 12–18%, asymmetric, never centered — skill §3). One card, five faces, chosen by `FocusState`:

| `FocusState` | Face |
| --- | --- |
| `start` | micro-label `WORKOUT`, title2 `Ready when you are`, body = exercise name + planned `4 sets · 6–8 reps`, body = `Set 1 of 5` chip |
| `ready` | micro-label `NEXT SET · SET 3 OF 5`, **`62.5 kg × 8`** at `metricL`/40 rounded tabular, verdict chip + `prev 60 × 8` delta line |
| `resting` | **the rest ring + clock** promoted into the hero (dash computed exactly as `rest-timer.tsx` already does: `fraction × 2π × 26`), prescription line, next-set line beneath |
| `restReady` / `restOver` | the ring at full (`#7BE000 → #D6FF52`), a `READY` chip in the brand-green ink, and the same next-set line — the moment the lifter actually wants |
| `paused` | amber `PAUSED` chip, the frozen clock in `content.secondary`, body = `Elapsed time is held. Your sets are saved.` |
| `exerciseDone` / `allDone` | a full green check ring at 44, `Exercise complete`, `5 sets · 1 240 kg · 42 reps`, and — on the next line — what comes next |

Motion: faces cross-fade over `motion.duration.base` (250ms) with the primary CTA scale-spraying in
on `motion.spring.enter`. Phase changes that earn celebration (a set completing, a PR) use
`motion.spring.bouncy` and a heavy haptic — matching the existing rest-timer milestone pattern, so
the app has exactly one celebration language.

#### 4.2.2 Set rows — the redesign

Today a set is a 32pt line. On a screen that is only about this exercise, that is the room we were
missing. Rows grow to `minHeight` 56 with a real `rest` lane, and get four new affordances:

- **Load stepper** — `−` `62.5 kg` `+` inline, stepping by `weightIncrementFor(blueprint.progression)`.
  Tapping the number still opens the existing `WeightDialog` with its `applyTo` chips. This is the
  single biggest ergonomics win: no dialog to reach the load you use 90% of the time.
- **Reps with a printed range** — value at `metricM`/22 tabular, and the target range *underneath* in
  11/500 tertiary (`6–8`). Trainlike prints it; we should too. Tap still cycles down (Stronglifts'
  universal gesture); long-press still opens the precise editor.
- **RPE chip** — only when `settings.rpeTracking`. A 44pt pill, 6.0–10.0 in 0.5 steps, opened by the
  existing `SegmentedPicker`. Absent → the row's `gap` redistributes; nothing renders a placeholder.
  Recorded RPE sits on the row as a small effort bar (filled = RPE − 5 over a 5 range) so effort is
  legible without reading the number.
- **Set type** — long-press the number tile opens the type menu (Warm-up / Working / Failure / Drop).
  Warm-up sets get an amber tile fill (not red), print `WARM-UP` under the index, are excluded from
  volume and PRs, and earn the shorter warm-up rest. Failure sets tint the check red, not green.
- **Per-set e1RM** (D-offset lane) — for logged sets, `metricM` tabular plus a `▲/▼/=` vs the same
  index last time. Reuses `calculateOneRepMax` so the number matches every other screen.

#### 4.2.3 VS LAST TIME

The reason people open history mid-set. A `last time → today` matrix, one row per set index, cells
signed and coloured by the delta, using the `$positive/$negative` precedent from
`session-comparison-table.tsx`. **Honesty rule, stated in the code comment:** a load increase is only
`positive` when reps held; more weight at fewer reps is `neutral`, not a win. Set indices past last
time's set count show `—` on the left. Excluded when the movement has no history (then the card is
replaced by the plan's prescription, so it never renders an empty card).

#### 4.2.4 PLAN & PROGRESSION

The verdict chip from §3.3, the exercise's `restBetweenSets` as an editable line (existing
`RestSheet`), a superset-partner chip, the per-exercise progression rule list rendered read-only
(so the lifter can *see* why the verdict says what it says), and the notes editor inline rather than
behind the ⋯ dialog. Links out to the exercise editor and to `/exercise-history`.

#### 4.2.5 LAST 8 SESSIONS

A horizontal micro-chart: top-set weight per session as a 2-stop gradient line (`#FF9F0A → #FF2D55` in
dark, `#E07800 → #D70015` in light — `theme.exerciseHistory.line`), 2pt round caps, a dashed average
guide (`dasharray 2 5`, white 18%, skill §6), dots on each point, the newest one ringed in gold if
it is the all-time best. Tapping opens `/exercise-history?name=&type=`. Height 72, `radius: 12`
behind it. This is the "should I add weight today" answer without leaving the workout.

#### 4.2.6 Rest timer

Reuses `<RestTimer/>` unchanged (do not fork) with one new prop — the next-set line now reads *this*
exercise's upcoming set rather than the session's, and `rest` comes from the set type (warm-up →
`Rest.short`, working → the blueprint's `restBetweenSets`). Docked above the action bar, so it is
always adjacent to the primary CTA it feeds.

#### 4.2.7 Action bar

Fixed at the bottom over a `tb` gradient (`footer.gradientFrom → gradientTo`, extended under the home
indicator by `-insets.bottom`) with the 44pt `fd` fade above it — the exact treatment `SessionFooter`
already ships, reused rather than redrawn.

- **Primary** — `BrandButton` 54pt, full width minus a 12pt gutter when a secondary exists. Label is
  `FocusState`'s output verbatim. Haptic `Medium` on press, `usePressScale` for the spring.
- **Secondary** — a 44pt ghost `Pressable` in `content.secondary`: Skip (dismisses rest, snackbar +
  Undo), Add exercise, Finish workout, Log anyway. Never a dead control.
- **Paused** — primary becomes `Resume Workout` and is the only enabled action; everything else dims.

---

## 5. Sequencing

Phase-gated, and the gates are real: nothing starts until the previous phase's exit criterion holds.

| Phase | Work | Gate to leave |
| --- | --- | --- |
| **0** | Nothing. | — |
| **1** | **Hard copy the detail page.** New route, copy `SessionComponent`'s active wiring verbatim, both pages fully working, old page untouched. | Both screens run; `typecheck` + `lint` + `npm test` green. |
| **2** | Model v9: clock, set type, RPE + migration + JSON-schema regen. | `session-migration` + `session-restore` suites green; a v8 fixture round-trips unchanged. |
| **3** | Focus state machine (`workout-focus-state.ts`) + exhaustive simulation spec. | All 21 composed rows covered; no null CTA. |
| **4** | Detail page redesign (§4.2). | Design checklist + ledger green. |
| **5** | List page redesign (§4.1) — **now** the old one loses its logger. | Design checklist + ledger green. |
| **6** | Polish pass: light mode, 320/DE/200% text, reduce-motion, a11y. | Device pass on iOS + Android. |

The gate on phase 5 is the whole point of phase 1: until the detail page can log a set well, taking
the logger off the list page loses functionality.

---

## 6. Risks

| Risk | Mitigation |
| --- | --- |
| v9 migration corrupts sessions | Additive identity step; a v8 fixture round-trip test in phase 2; the `Session.equals` trap (§3.1.1) is an explicit ledger item with its own regression test. |
| Warm-up exclusion changes historical numbers | It cannot: pre-v9 sets have no `type` and read as `working`. Verified by a spec that computes stats for a v8-shaped session and asserts no change. |
| Pause and the wearable mirror disagree | One ledger item forces `store/workout-worker/helpers.ts` to derive from the workout phase, with a spec. |
| Auto-pause fights the pause button | `AutoPauseOnLock` only pauses a `running` workout whose `pausedAt` it did not set, and never resumes — resume is always the user's. Spec'd. |
| The detail page gets heavy (scroll fatigue) | Fixed action bar + at most six cards; the focus card carries the live state so nothing below it needs reading during a set. |
| 320pt / 200% text / DE clipping | Per the global acceptance bar in the ledger: 2×2 grid instead of 4 columns (D8), `minHeight` everywhere (SX02 precedent), `numberOfLines` clamps (SX03), longest-locale strings for every new label. |
| Two pages disagree about state | Both read the same `Session` through `updateStoredSession`. There is no second source of truth to drift. |

---

## 7. Files

New (phase-tagged):

```
app/src/app/(tabs)/(session)/session/exercise.tsx                     route
app/src/components/smart/session-exercise/                           container + href helper + index.tsx
app/src/components/presentation/workout/detail/
  workout-focus-state.ts          pure state machine  (§3.2)
  workout-focus-state.spec.ts     exhaustive simulation
  progression-verdict.ts          pure verdict        (§3.3)
  progression-verdict.spec.ts
  focus-card/                     hero, five faces
  set-log/                        redesigned set rows + type menu + RPE
  vs-last-time/
  plan-card/
  history-strip/
  action-bar/
  detail-tokens.ts                detail-page palette deltas over sessionPalette
app/src/hooks/useWorkoutClock.ts  phase + elapsed + start/pause/resume
app/src/models/storage/versions/migrations/steps/add-workout-clock.ts
app/src/models/storage/versions/migrations/steps/add-set-effort.ts
```

Modified: `session.ts` (model + JSON + migration chain), `recorded-weighted-exercise.ts`,
`rest-timer.ts` (`exerciseIndex` owner), `rest-timer.tsx` (next-set context prop),
`session-component.tsx` (loses the active variant), `use-elapsed-seconds.ts` (→ `useWorkoutClock`),
`calculate-stats.ts` + `personal-records.ts` (warm-up exclusion), `auto-pause-on-lock.tsx`,
`workout-worker/helpers.ts`, `en.json` (+ `settings` registry for `rpeTracking`),
`docs/index.md`.

---

## 8. Ground truth — do not re-derive

- Skill (law): `.agents/skills/apple-ios-frontend/SKILL.md`
- Existing polish ledger for this flow: `docs/polish_ui/session/session_polish_ledger.md` — its SX
  cross-cutting items (min-heights, clamps, hairlines, `type()`, index keys, material unification)
  are **already done** and are the baseline the detail page inherits, not work to redo.
- Reference mockup: `docs/new_design/workout-flow-dark.md` §§1–3 + its light table.
- Tokens: `components/presentation/workout/session/session-tokens.ts` — `detail-tokens.ts` extends it
  rather than forking it.
- `applyProgression` (`blueprint-models/index.ts:653`) and `calculateOneRepMax`
  (`store/stats/calculate-stats.ts:21`) — the two functions the verdict and the e1RM lane are built on.
  Do not reimplement either.