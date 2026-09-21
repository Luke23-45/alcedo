# Page-by-page flow simulation

## Objective
Verify every redesigned page end-to-end without a device. For each page: enumerate
every section/component, simulate each one through all of its states, check design
against the spec, trace functionality through the code, patch what fails, and prove
it with tests. No page is done until its simulation is green.

## Method (per page)
1. **Inventory** — list every section/component from the design spec and the code.
2. **State matrix** — for each section, enumerate: with data, empty, loading, error,
   offline, first-run. Nothing ships with an unconsidered state.
3. **Trace** — read the component: render paths per state, every handler, navigation
   targets, store writes, persistence. Verify each claim the UI makes.
4. **Simulate** — write component/logic tests that drive each state and each user
   action (tap, swipe, toggle, back). Tests are the stand-in for the device.
5. **Patch** — fix design deviations and functional bugs found. No new fake states;
   offline/empty states must be honest.
6. **Verify** — typecheck 0 errors, full vitest green, oxlint/oxfmt clean.
7. **Record** — commit per page on `redesign/backup-and-restore` (no push), update
   the checklist below with the result.

## Honesty rule
We cannot claim pixel or feel verification without a device. What simulation proves:
logic, state coverage, navigation, persistence, copy. What it cannot: animation feel,
timing, real-device performance. Device checklist comes later with a dev build.

## Page order and status

| # | Page | Spec | Status |
|---|------|------|--------|
| 1 | Home | docs/new_design (home dark/light) | done 2026-09-21 |
| 2 | Workout flow (session) | docs/new_design | done 2026-09-22 |
| 3 | Workout editor | docs/new_design/workout-editor-redesign.md | done 2026-09-22 |
| 4 | Exercise editor | docs/new_design/exercise-editor-redesign.md | done 2026-09-22 |
| 5 | Diff-save / Update Plan | docs/new_design/diff-save-redesign.md | done 2026-09-22 |
| 6 | History | docs/new_design/history-dark.md | done 2026-09-22 |

## Per-page log
### 1. Home
- Verified 2026-09-21 (route `app/src/app/(tabs)/(session)/index.tsx`).
- Sections inventoried (in render order): greeting header + workout options menu,
  What's New banner, activity rings, stat tiles, Today's Session, quick actions,
  Weekly Volume, Heart Rate Zones, Programs, Coach card, Recent Activity,
  Achievements, Hydration, Macros, Personal Records, Weekly Challenge, Welcome Wizard.
- State matrix simulated: populated, empty/first-run, active-workout resume,
  no-upcoming freeform start, existing-workout replacement confirmation,
  menus/navigation, What's New dismissal/CTA, Welcome Wizard first-run path,
  offline focus (core stays local; backup/publish dispatches remain non-blocking).
- Sample-only sections (no app data source) keep their `SampleBadge`: activity
  rings, HR/calories/steps tiles, HR zones, coach/recovery, achievements,
  hydration, macros, weekly challenge.

**Bugs found and fixed:**
1. `use-home-data.ts` — js-joda text patterns (`'EEEE, MMMM d'`, `'EEEE'`) throw
   `IllegalArgumentException` without the locale plugin (we don't ship it): the
   home screen would crash on render. Replaced with the app's cached
   `Intl.DateTimeFormat` path (`useFormatDate`), which also respects
   `settings.preferredLanguage`.
2. `use-home-data.ts` — Personal Records showed the *first* time a lift PR'd,
   not the standing best. Now keys records by exercise and keeps the latest per
   lift (delta/NEW follow the latest record).
3. `store/stats/personal-records.ts` — records now carry `previousBest` and
   `achievedAt` so Home can show honest `+x.x kg` deltas and current-month NEW
   badges.
4. `recent-activity.tsx` — rows had chevrons but were not pressable. Every row
   is now a ≥44pt target routing to
   `/history/post-workout?sessionId=<id>&source=history`.
5. `today-session.tsx` — removed the dead Nutrition and Timer quick-action
   tiles (no routes/handlers/persistence exist; dead tiles are worse than missing
   ones). Removed their now-unused styles and glyphs.
6. `macros.tsx` — sample values corrected to 125/200/60g so the footer reads
   1,840 kcal, matching the reference spec (was 1,708 kcal).
7. `greeting-header.tsx` — added the reference's red notification dot on the
   avatar (was missing).

**Tests (24 new, all green):**
- `use-home-data.spec.ts` (new, 13 tests): empty/first-run honesty, greeting +
  date label, upcoming → today's session, weekly volume math vs previous window
  (incl. null delta when no prior data), unlogged sets excluded from volume,
  recent-activity ordering/kind classification/duration-vs-count subtitle, PR
  big-three preference + improvement delta + NEW month gating + latest-record
  selection, program ordering/accent/session count with no invented progress.
- `personal-records.spec.ts` (+3 tests): `previousBest`/`achievedAt` carried on
  records, chaining across three sessions.

**Verification:** `npm run typecheck` 0 errors; full vitest 104 files / 1,538
tests green; oxlint 0 errors in touched files (210 repo-wide errors are
pre-existing in untouched files); oxfmt clean.

**Not claimed:** pixel/animation feel, real-device performance — no device used.

**Deferred to their pages (same js-joda crash pattern, outside Home scope):**
`feed/composer/composer-data.ts:133` (`'EEEE, MMMM d'`),
`stats/trends/exercise-detail/{progress-chart,last-session,session-history}`
(`'MMM d'`, `'MMM'`). Flag for pages 7–10.
Update 2026-09-22: fixed as commit `a4abc1b` (cached Intl formatters), so the
deferral is resolved; the session-adjacent screens it touched are safe.

### 2. Workout flow (session)
- Verified 2026-09-22 (route `app/src/app/(tabs)/(session)/session/index.tsx`,
  container `components/smart/session-component.tsx`).
- Sections inventoried (in render order): SessionNav (back chevron, blueprint
  title, `⋯` ActiveSessionMenu), ElapsedCard (MM:SS → H:MM:SS, LIVE pill,
  anchored to the first logged set), StatStrip (Sets n/m, Volume kg, Reps, Avg
  bpm), ExercisesHeader ("EXERCISES · n of m"), EmptySession (dumbbell
  illustration, Add Exercise CTA), weighted exercise cards (index tile, name,
  status chip, 32px set rows with number/weight/reps/check, prev-line, Add Set
  row, notes, history/notes/`⋯` menus), cardio exercise cards (per-set duration
  and distance, live CardioTimer), sticky SessionFooter (idle Rest card or live
  timer slot, Finish Workout + "Log at least one set to finish" hint when
  disabled), live RestTimer (two-segment ring, pause, ±15s, skip with undo,
  complete-state Log Set), ActiveSessionMenu (Add exercise, Edit workout),
  finish confirmation dialog (incomplete session), post-workout summary route.
- State matrix simulated: empty (zeroed stats, disabled Finish, CTA), populated
  weighted (sets/volume/reps math), unstarted-with-exercises (Finish stays
  disabled), cardio (filled/empty), mixed weighted+cardio, rest timer
  resting/ready/over/paused/failed/fixed/nudged (incl. the spec's 00:42 of 60
  ring math), cardio timer count-up/countdown/`elapsedAt` banking/stop banking,
  elapsed clock formats, kill → relaunch (active session restored exactly, no
  invented active session, finished workout not resurrected, mid-set writes
  never steal the active flag), offline focus (all session interactions are
  local Redux + SQLite; nothing in this flow requires network).
- Finish flow traced: empty session cannot finish; incomplete session shows the
  confirmation dialog; complete finishes to `/session/post-workout` when the
  summary toggle is on, otherwise clears the active session, dismisses homeward,
  and opens `/diff-save` when plan differences exist. Back navigation never
  destroys the stored active session.
- 44×44 audit: nav buttons, Finish (54px), empty-state CTA (48px), set-row check
  toggle (44 via hitSlop) pass. The weight/reps text edits inside the dense 32px
  set rows are 30px effective — a deliberate density trade-off matching the
  reference's row pitch; the primary mid-workout action (log set) meets the
  target. Recorded as a considered decision, not a bug.

**Bugs found and fixed:**
1. `stat-strip.tsx` — the code comment claimed AVG BPM carries a `SampleBadge`,
   but none rendered: the hard-coded sample `'128'` read as recorded health
   data. The badge now renders (home convention), and the empty state shows
   `'—'` for Avg bpm, matching the reference (`0 / 0 / —`).
2. `useAddExercise.ts` — the new-exercise placeholder name was hard-coded
   English (`'New Exercise'`). Now uses `t('exercise.new.default_name')` (key
   added to `en.json`; other locales fall back to English via
   `fallbackLanguage: 'en'`).
3. `rest-timer.tsx` — the countdown state machine was locked inside the
   component, untestable. Extracted to pure `rest-timer-state.ts`
   (`getRestTimerState`); the pause-freeze now lives in the state machine
   itself, component behavior unchanged.
4. `timer-pane.tsx` — `formatTimeSpan` lived in a component module that cannot
   load without native deps. Extracted to pure `timer-format.ts`; `timer-pane`
   re-exports it, export shape unchanged.
5. `session-component.tsx` — `computeSessionStats`, `sessionHasLoggedSet`, and
   `sessionStartedExerciseCount` moved verbatim to new `session/session-stats.ts`
   (named exports) so the simulation suite can drive them; the component
   imports them, behavior unchanged.

**Tests (40 new, all green):**
- `session/session-simulation.spec.ts` (new, 24 tests): elapsed clock formats
  (incl. the spec's 45:12 and 00:00 empty state), empty-session zeroing + Finish
  gate, populated weighted sets/volume/reps math, unstarted exercises not
  gating Finish, cardio filled/empty counting, mixed aggregation, heart-rate
  sample honesty, cardio timer readouts (`formatTimeSpan`, `elapsedAt` banking,
  stop banking), single-set start enabling Finish, completion timestamping.
- `rest-timer-state.spec.ts` (new, 11 tests): resting countdown with exact
  remaining time, the 00:42-of-60 ring fraction (114.35 of 163.36), failed-set
  longer window, nudge clamping (never below zero, +15 exact), ready/over
  phases, fixed-rest straight to over, paused freeze, medium/long presets.
- `store/stored-sessions/session-restore.spec.ts` (new, 5 tests): kill →
  relaunch restores the exact active session through the real reducers, effects,
  and SQLite; payload restored not just the id; no invented active session;
  finished workout not resurrected; mid-set writes never steal/drop the flag.

**Verification:** `npm run typecheck` 0 errors; full vitest 108 files / 1,584
tests green; eslint 0 errors in touched files; `oxfmt --check` clean; all
`t('…')` keys in the workout flow resolve in `en.json`.

**Not claimed:** pixel/animation feel, real-device performance, haptic
confirmation on device — no device used.
| 2 | Workout flow (session) | docs/new_design | done 2026-09-22 |
| 3 | Workout editor | docs/new_design/workout-editor-redesign.md | done 2026-09-22 |
| 4 | Exercise editor | docs/new_design/exercise-editor-redesign.md | done 2026-09-22 |
| 5 | Diff-save (Update Plan) | docs/new_design/diff-save-redesign.md | done 2026-09-22 |
| 6 | History | docs/new_design/history-dark.md | done 2026-09-22 |
| 7 | Trends | docs/new_design | pending |
| 8 | Feed timeline | docs/new_design/social-dark.md | pending |
| 9 | Feed post detail | docs/new_design/social-dark.md | pending |
| 10 | Feed share composer | docs/new_design/social-dark.md | pending |
| 11 | Feed profile editor | docs/new_design/social-dark.md | pending |
| 12 | Feed shared-item | (thin wrapper) | pending |
| 13 | Settings home | docs/new_design/settings-dark.md | pending |
| 14 | Settings preferences | docs/new_design/settings-dark.md | pending |
| 15 | Settings notifications | docs/new_design/settings-dark.md | pending |
| 16 | Settings AI planner | docs/new_design/settings-dark.md | pending |
| 17 | Settings programs & import | docs/new_design/settings-dark.md | pending |
| 18 | Backup hub + remote/export/import | docs/new_design/backup-redesign.md | pending |
| 19 | What's New | (settings spec) | pending |
| 20 | Backends [id] | — | deferred (no design yet) |

### 3. Workout editor (/workout-editor)
- Verified 2026-09-22 (route `app/src/app/workout-editor.tsx`, container
  `components/smart/session-workout-editor/session-workout-editor.tsx`).
- Sections inventoried (in render order): nav row (back chevron, Edit Plan
  title, ⋯ overflow), amber draft strip, plan-name input (focused underline),
  meta card (exercises / sets / est. volume / est. time + "Computed from logged
  history"), notes section (autofocus on `?focus=notes`), exercises list
  (grip + number tile, name, row summary, chevron, dividers), empty state
  (dumbbell, 0/0/–/–, Add Exercise, ADD BEHAVIOR card), formula footnote,
  sticky footer (Add Exercise + Save Plan + "Changes apply to this session
  only" / amber Cancel when empty), remove-all confirm, per-exercise remove
  confirm (long-press).
- State matrix simulated: populated (6-exercise reference), empty, reorder
  dragging (scroll locked, lifted row, drop indicator), confirmation open
  (both), draft dirty/clean, notes focus entry, imperial units, unlogged
  exercise (weight segment vanishes), bodyweight moves, cardio rows.
- Estimate math verified against the reference Push Day: 19 sets, 35 min
  (2,085s → round), volume **7,604 kg** — see the spec correction below.
- Draft semantics traced exactly: name/notes are local drafts committed on
  Save, back chevron, and swipe-back (unmount); only Cancel / Discard Changes
  discards. Add/remove/reorder mutate the store immediately and are never
  lost by a Cancel. Blank name falls back to the stored name; cleared notes
  persist as empty.
- 44×44 audit: nav buttons, menu trigger, Add/Save (52px), empty-state CTA,
  Cancel, grab zone (handle + number tile, ≈56×64) pass.

**Bugs found and fixed:**
1. `session-workout-editor.tsx` — both destructive confirmations rendered
   their confirm action in the default button color. They now pass
   `destructive`, so Remove / Remove all render in destructive red per the
   spec.
2. `session-workout-editor.tsx` — the remove-all confirm's button read the
   generic "Delete". The spec shows "Remove all". Now uses the dedicated key
   `workout.editor.remove_all_exercises.confirm.ok` ("Remove all", added to
   `en.json`).
3. `session-workout-editor.tsx` — the est-time label's `t()` default was
   "EST. TIME" while `en.json` (and the spec) say "MIN · EST. TIME". Default
   aligned to the spec.
4. Spec correction (`docs/new_design/workout-editor-redesign.md`): the
   verification log claimed 8,420 kg for the reference Push Day via a
   "two-dumbbell convention" (34 kg per DB × 2). No exercise, blueprint, or
   recorded set carries dumbbell-count metadata, so doubling the logged
   weight would be invented data. The honest reference value is **7,604 kg**,
   which is what the implementation computes and the suite asserts.

**Refactors (behavior unchanged):**
- `reorderExercises` moved verbatim from the component file to new
  `reorder.ts` (named export) so the simulation suite can drive it.
- Draft-name resolution extracted from the component's `commitDraft` into
  `resolveDraftName` in `draft.ts` (named export).

**Tests (13 new, all green):**
- `reorder.spec.ts` (new, 8 tests): from===to identity, first→last and
  last→first moves, adjacent swap, no mutation of the original, store-level
  reorder keeping blueprint/recorded 1-for-1, store-level remove-all clearing
  both arrays while keeping name/notes, single-exercise removal keeping
  alignment.
- `draft.spec.ts` (+5 tests): name trimming, blank-name fallback through the
  real store, untouched name untouched, cleared notes persist as empty.

**Verification:** `npm run typecheck` 0 errors; full vitest 109 files /
1,597 tests green; oxlint 0 errors and oxfmt clean on touched files; all
`t('…')` keys resolve in `en.json`. (One environment note: a full-suite run
failed mid-way with `ENOSPC` — `/tmp` was full of 511 leftover
`liftlog-test-*.db` files from earlier backup-test runs; after cleaning,
the suite went fully green.)

**Not claimed:** pixel/animation feel, drag-gesture feel, real-device
performance — no device used.

### 4. Exercise editor (/exercise-editor)
- Verified 2026-09-22 (route `app/src/app/exercise-editor.tsx`, container
  `components/smart/session-exercise-editor/session-exercise-editor.tsx`,
  screen `components/presentation/exercise-editor/`).
- Sections inventoried (in render order): nav row (back chevron, Add/Edit
  Exercise title, Done — disabled until a name is chosen in add mode), amber
  draft strip ("Unsaved draft · commits when you leave"), add-mode
  search-first cards (focused search field with ember glow, results with tile
  accents, hint / no-results states), identity card (name well with swap
  glyph, type picker Weighted/Cardio footer), set-config card (reps-mode
  segmented Fixed/Range/Per set, sets + reps steppers, add/remove set,
  drop-set tail caption, 3-per-row per-set grid), detail card (notes with
  counter, link well with validity glyph), options card (rest-between-sets
  row, track-superset toggle, superset hint), resistance card (External /
  Bodyweight / No added resistance radios), progression card (rule rows,
  add/edit/remove), cardio set card (distance/time steppers, HMS duration,
  unit picker, track toggles, per-set rest, add/remove set floor of 1),
  rest sheet (big −/+ steppers, preset chips, slider, Apply to all sets),
  type-switch dialog (Cancel / Switch & Reset).
- State matrix simulated: add (search-first, Done disabled) vs edit, swap
  (keeps sets·notes·link), fixed/range/per-set reps, 9-set wrapping,
  drop-set tail detection, cardio distance/time conversion and tracking
  locks, add/remove set floors, rest enabled/disabled + presets + apply-all,
  progression add/edit/remove, type-switch cancel/confirm both directions,
  dirty strip show/hide, commit-on-dismiss for Done and Back, deleted-while-
  open dismisses, invalid/empty link, notes cap, empty query, no results,
  long-name two-line wrap, imperial units (mi/yd), keyboard avoidance via
  FullHeightScrollView.
- Draft/persistence traced end to end: local draft in component state
  (draftRef guards the unmount closure) → `useOnDismiss` →
  `exerciseEditorDismissUpdate` → `updateStoredSession` → Redux reducer →
  store effect → SQLite upsert of the session payload. No network in any
  editor path; fully offline-capable.
- 44×44 audit: nav buttons, Done, add/remove-set (48px), all rows (44–64px),
  toggles (hitSlop 10), trash (hitSlop 10), dialog actions (52px), rest-sheet
  big steppers (44px). Three sub-44 visuals fixed with hitSlop (no geometry
  change): small steppers 22px → slop 11 (44 effective), 36px segments →
  vertical slop 4 (44 effective), 28px rest chips → vertical slop 8 (44
  effective). Adjacent-target overlap checked for the per-set grid and HMS
  steppers — none.

**Bugs found and fixed:**
1. `useAddExercise.ts` — the hook pre-named the placeholder with the
   localized "New Exercise" and inherited 3×10 defaults, which made the
   designed S6 search-first add state (`showAddSearch`, Done-disabled) and
   the 1×8 default unreachable from day one. It now inserts
   `newExercisePlaceholder()` (blank name, 1×8 fixed), matching the workout
   editor's own add flow and the S6 reference. The orphaned
   `exercise.new.default_name` key was removed from `en.json`.
2. `exercise-editor-logic.ts` (new `newExercisePlaceholder()`) and
   `session-workout-editor.tsx` — both add entry points now share the one
   helper, so the placeholder construction cannot drift again.
3. `resistance-card` — the selected row rendered no radio (only the ember
   well) while the S1 reference shows a selected ring + dot. Selected rows
   now render the ember ring + dot; the stale "no radio" comment was
   corrected.
4. `editor-primitives.tsx` / `detail-card.tsx` — the link glyph used a
   cyan third state for empty/invalid links; the reference only ever shows
   grey (empty) and ember (valid http(s)). Glyph ink is now decided by the
   tested `linkGlyphColor()` helper: ember for a real link, grey otherwise.
5. `en.json` + `set-config-card.tsx` — the drop-set tail caption claimed
   sets "step down automatically". Nothing performs an automatic step-down;
   the caption is a stored-target detector. Copy corrected to "step down."
   (regression-tested against `en.json`).
6. `en.json` + `type-switch-dialog.tsx` — the dialog only warned about
   reps/targets being reset and implied the rest was kept. It now names the
   full reset honestly: weighted→cardio resets reps, resistance, progression,
   rest and superset; cardio→weighted resets targets, tracking and rest.
   Name, notes and link are still kept.
7. `app/exercise-editor.tsx` — `isNew={!!isNew}` would treat any non-empty
   param (e.g. `?isNew=0`) as add mode. Now parsed explicitly
   (`isNew === '1'`); the sole in-app producer only ever emits `isNew=1`.

**Refactors (behavior unchanged):**
- `switchExerciseKind()` extracted from `ExerciseEditorScreen.confirmTypeSwitch`
  into `exercise-editor-logic.ts` so the destructive reset (fresh blueprint of
  the target kind, preserving only name/notes/link) is unit-tested.

**Tests (8 new, all green):**
- `exercise-editor-logic.spec.ts` (+8): `switchExerciseKind` both directions
  (identity preserved, config genuinely reset), `linkGlyphColor` (ember only
  for http(s), grey for empty/invalid), `newExercisePlaceholder` (blank name,
  1×8 fixed), drop-set copy regression (never claims "automatically").

**Honest deviations (unchanged, correct):** imperial distance uses mi/yd
(the model has no feet); progression has no Each session/Each week toggle
(the model stores no frequency).

**Verification:** `npm run typecheck` 0 errors; full vitest 109 files /
1,604 tests green; oxlint 0 errors and oxfmt clean on all touched files.

**Not claimed:** pixel/animation feel, haptic feel, real-device performance —
no device used.

### 5. Diff-save / Update Plan (/diff-save)
- Verified 2026-09-22 (route `app/src/app/diff-save.tsx`, container
  `components/smart/session-diff-save.tsx`, screen
  `components/presentation/plan-diff/update-plan-screen/`).
- Sections inventoried (in render order): nav row (back chevron, Update Plan
  title, Reset action 44×44), intro title + destination-aware subtitle, mode
  segmented control (Update Push Day / Save as New, 361×44, radius 22) +
  consequence line, REVIEW CHANGES header + "N SELECTED" chip, review cards
  (neutral SESSION, green ADDED, red REMOVED, amber MODIFIED with exercise
  group headers), per-row checkbox or lock glyph + ALWAYS tag, transition
  typography (old → new + delta chip), sticky commit bar (destructive-ghost
  Discard 110×54 + brand-gradient Save 54pt), no-changes empty state (quiet
  check glyph + honest copy).
- State matrix simulated: reference Push Day (session notes + added +
  removed + modified sets/rest), all-checked default, per-row toggle,
  all-deselected (Save disabled, plain "Save" label), mode switch
  update→new→update (diff recomputed, selection reset, original references
  preserved), Reset (reverts to all-checked), no-changes deep-link state
  (empty state + disabled save + working Discard), offline (the entire flow
  is local: Redux + SQLite + local sessionService; zero network calls).
- Apply semantics traced exactly: update mode applies only the selected
  changes to the workout matched by name (falls back to name search when
  the plan moved it; silent no-op when the workout is gone — never invents
  data); save-as-new appends a uniquely named workout; the logged history
  session is never touched; programs persist via the existing transactional
  SQLite effect. Added exercises land at their session position, not
  appended.
- Entry points: workout finish, post-workout summary, history edit — each
  pushes `/diff-save` only when `getPlanDiff` finds a real diff.
- 44×44 audit: Reset (44×44), rows (64px), segments (44px), Discard
  (110×54), Save (54pt), checkboxes non-pressable visuals inside the row
  target — all pass.

**Bugs found and fixed:**
1. `plan-commit-bar.styles.ts` — Discard rendered as a neutral ghost (white
   / `#111111` text). The spec demands a destructive ghost: `#FF3B30` @ .10
   fill + .22 hairline, `#FF6B60` text dark / `#D70015` light.
2. `session-diff-save.tsx` — Reset label in light mode was `#B25000`; the
   spec's deliberate light-mode deviation is `#007AFF`.
3. `diff-review-card.tsx` — selected checkbox hard-coded `#30D158` in both
   modes; spec says `#34C759` in light.
4. `diff-review-card.styles.ts` / `.tsx` — transition rows had a
   strikethrough old value, a green pill around the new value, and a `›`
   chevron. The spec is plain `old → new` typography: old `#6C6C70` /
   `#AEAEB2`, arrow `#48484A` / `#AEAEB2`, new white / `#111111` 600.
5. `update-plan-screen.tsx` — SESSION card showed a count the reference
   doesn't have (removed); MODIFIED card was missing the reference's "2"
   count (now total modified change rows).

**Light-mode deviations (the spec's two deliberate ones) verified and
restored:** Discard text `#D70015` (not `#FF6B60`) and Reset `#007AFF` (not
`#FF9F0A`) — both deepen failing-on-light colors to WCAG AA-passing ones;
justified and unchanged in intent.

**Tests (18 new, all green):**
- `diff-save-simulation.spec.ts` (new, 18 tests): reference-scenario
  grouping (session/added/removed/modified), "5 SELECTED" count, notes
  line/char honesty, added/removed summaries computed from real blueprints
  + ADD/REMOVE chips, sets 4→5 +1 chip, rest 90→120 s +30 S chip,
  same-count rep transition without chip, locked-row never toggleable and
  never counted, deselected rows excluded from the committed diff, save-as-
  new naming, new→update recomputation from preserved refs, store-level
  apply (selected-only, by-name matching after reorder, save-as-new
  append, silent no-op on missing workout), `getPlanDiff`
  undefined/diff/add entry points.

**Verification:** `npm run typecheck` 0 errors; full vitest 110 files /
1,622 tests green; oxlint 0 errors and oxfmt clean on touched files
(214 repo-wide oxlint errors are pre-existing in untouched files).

**Not claimed:** pixel/animation feel, real-device performance — no device
used.

### 6. History (`/history`, `/history/post-workout`, `/history/edit`)
- Verified 2026-09-22 (routes `app/src/app/(tabs)/history/index.tsx`,
  `app/src/app/(tabs)/history/post-workout.tsx`,
  `app/src/app/(tabs)/history/edit.tsx`; screens
  `components/presentation/history/*`).
- Sections inventoried (in render order):
  - Screen 1 (activity calendar + sessions): header (activity title, month
    pager chevrons, filter button with active-filter badge), month calendar
    (Monday-first six-week grid, computed load rings, ring geometry from
    `history-design.ts`, chevrons 44×44), month summary strip (workouts /
    volume / hours, month-aware copy, hidden when the month is empty), day
    summary + selected-session cards (coral edge, PR chips), week list
    (weekday rows + session rows), empty states (empty selected day →
    "Add workout" creates a freeform session at that date and opens the
    edit screen; empty month → "Start workout"; no filter results →
    "Clear filters").
  - Screen 2 (session detail): nav row (back chevron, "Session Detail"
    title, overflow menu), hero (date, volume, duration), stat tiles
    (volume / sets / exercises + sub notes), detail strip (avg BPM sample
    under SampleBadge, started-exercise count standing in for AVG RPE —
    documented, rest time), PR card (gold ring; set chips e1RM-matched
    against store records via `pr-match.ts`), HR curve (sample, SampleBadge),
    exercise breakdown (per-exercise volume, gold PR chips), previous-session
    comparison (`selectPreviousComparableSession`), notes card, kudos,
    actions (share / repeat with replace-current confirm / edit / delete
    with destructive confirm).
  - Screen 3 (edit session): nav (Cancel / Save, overflow with Resume +
    Delete), live totals strip (volume / sets / reps / duration recomputed
    from the draft + pulsing sync dot, 361×68), WHEN card (Start / End rows
    open date-then-time pickers that shift every recorded set timestamp via
    `applySessionDateTime`; Duration row recomputes with AUTO chip), EXERCISES
    section (drag-to-reorder keeping blueprint + recorded arrays aligned,
    set chips with 44pt hitSlop, inline set editor with weight/reps
    steppers + delete-set, add-exercise via `useAddExercise`), notes editor
    (500-char draft committed on blur/unmount), Delete Session (destructive
    confirm).
- Data path traced: real stored sessions through focused Redux selectors
  backed by SQLite persistence; write-through `updateStoredSession` on every
  edit; leaving the edit screen dispatches `sessionFinished` once (re-queues
  feed sharing, marks stats dirty, re-exports to health) unless resuming.
  Detail route redirects to `/history` for missing/invalid session ids.
  Calories are the documented approximation
  `round(3.5 × minutes + 0.028 × volumeKg)` and always labelled "KCAL EST".
  Avg/max BPM and the HR curve are sample data (no HR source in the app) and
  carry SampleBadge.
- State matrix simulated: populated month, empty month, empty selected day,
  filters active with and without matches (filter logic in
  `history-screen1.spec.ts`), empty session (honest zeros, "—" duration),
  planned-but-unlogged session (ignored by aggregates), weighted session,
  cardio-only session (zero volume, sets counted, kcal from duration),
  mixed session, active/rest split from real timestamps (undefined without
  timing data), month grouping, edit write-through, delete (detail can no
  longer find it), previous comparable found / missing, delete-all-sets then
  re-add, notes write-through. Calendar grid + ring geometry and filters
  were already covered by `history-screen1.spec.ts`; PR matching by
  `pr-match.spec.ts`; time shifts by `session-time-utils.spec.ts`.

**Bugs found and fixed:**
1. `app/(tabs)/history/edit.tsx` — the delete-session confirmation did not
   pass `destructive`, unlike the detail screen's; the spec demands red
   destructive text. Fixed.
2. `app/(tabs)/history/edit.tsx` — `save()` dispatched `sessionFinished`
   through `finishWorkout()`, then the unmount handler dispatched it a
   second time (duplicate stats/exports work). Now guarded with a
   `finished` ref; cancel/resume paths unchanged.
3. `models/session-models/recorded-weighted-exercise.ts` —
   `withAddedSet()` no-op'd when an exercise's sets were all deleted, leaving
   the add-set chip a dead control. It now reseeds from the blueprint (zero
   weight in the user's unit, first planned target) when a unit is given;
   the edit screen passes the settings unit. The no-unit no-op contract is
   unchanged.
4. `when-card.styles.ts` — body was 130px with 43.33px rows while the spec
   (and the file's own comment) say 361×132 with three 44pt rows; dividers
   at 48/92 floated mid-row. Now 132px body, 44px rows — also fixes the
   sub-44pt touch target.
5. `live-totals-strip.styles.ts` — body 66px vs the spec's 361×68. Now 68px.
6. `filter-sheet.styles.ts` — search clear button was 32×32, under the
   44×44 minimum. Now 44×44 (fits the 44px search box).

**Deliberate deviations / deferred (recorded, not patched):**
- RPE: the spec's strip shows AVG RPE and screen 3 has an Effort slider, but
  the Session model has no RPE field (SessionJSON v7) and no workout flow
  collects one. The strip shows the started-exercise count instead
  (documented in code); the edit screen omits the slider rather than
  inventing data. Adding RPE needs a SessionJSON v8 + model field — a
  feature, not a safe patch; deferred for a product decision.
- The spec's "Mark as personal record" toggle is mock chrome: PRs are
  store-computed from logged sets, and a manual toggle would invent
  records. Omitted deliberately.
- Home continuity patches from the spec (22 min Zone 3+, 12m / 8m / 9m / 9m
  / 4m bars, static TODAY chip) were verified already applied in
  `home/hr-zones/hr-zones.tsx`.

**Tests (14 new, all green):**
- `history-simulation.spec.ts` (new, 13 tests): empty / planned-only /
  weighted / cardio-only / mixed aggregates, kcal estimates, active/rest
  split, month grouping, edit write-through, delete, previous comparable,
  delete-all-sets reseed, notes write-through.
- `recorded-weighted-exercise.spec.ts` (+1 test): `withAddedSet` reseeds
  from the blueprint with a unit; the existing no-unit no-op test kept.

**Verification:** `npm run typecheck` 0 errors; full vitest 111 files /
1,636 tests green; oxlint 0 errors and oxfmt clean on touched files.

**Not claimed:** pixel/animation feel, real-device performance — no device
used.
