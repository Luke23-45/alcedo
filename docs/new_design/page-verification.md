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
| 2 | Workout flow (session) | docs/new_design | pending |
| 3 | Workout editor | docs/new_design/workout-editor-redesign.md | pending |
| 4 | Exercise editor | docs/new_design (exercise editor) | pending |
| 5 | Diff-save (Update Plan) | docs/new_design/diff-save-redesign.md | pending |
| 6 | History | docs/new_design/history-dark.md | pending |
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
