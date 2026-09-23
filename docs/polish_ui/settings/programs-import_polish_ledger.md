# Programs & Import polish ledger (source of truth)

Status: **implemented 2026-09-23 — all code patches applied; device pass (320/430,
large text, DE + TR, landscape, empty-program + unmatched-only states) still required
before closing the acceptance bar.** Per instruction no test files were written or run.
Scope: page 17 — programs & import (`program-list` → `ProgramListScreen` →
`ProgramHeroCard`, `ProgramRow`; `import-plan` → `ImportPlanScreen` +
parser; `import-plan-info` → `ImportReviewScreen`; `manage-workouts` →
`ManageWorkoutsScreen`; session/exercise editors' settings-owned chrome)
against `docs/new_design/settings-dark.md` Screen 5 + the skill.

Read method: every settings-owned file fully (thin wrappers verified as
thin), against the spec geometry. Nothing inferred.

## What is already good (not touched by this ledger)

- Hero progress is real coverage (covered/total computed, fill =
  `fraction × 100%` — skill real numbers, never "week 3 of 6") with an
  empty-program branch ✓.
- Stale deep links redirect instead of crashing (program + session) ✓.
- Parser honesty: zero-line count (not one), disabled submit, ICU plural
  source lines, matched/renamed/unmatched per-row states, review-before-save
  with dismiss-clears-pending ✓.
- Row names clamped; list keys stable (`id`, `focusprogramId` highlight
  ring) ✓.
- Name/session fields are `min-height` (they grow); paste box caps at 260
  with internal scroll ✓.
- Pre-uppercased micro-label keys ("SESSIONS", "IMPORT PLAN", "PASTED
  TEXT") match the 9/700/+1.2 spec rows ✓.

The problems below: one title-row squeeze, one sub-44 target, locale-blind
paths, rebrand residue, and micro-details.

## Batch 1 — scale + clip + targets (PR01–PR06)

- [x] **PR01 — hero name pushes badge/chevron/menu.** `HeroName`
  (`numberOfLines={1}` but no flex) sits in `HeroTitleRow` beside the
  ACTIVE badge; a long program name squeezes both. Fix: `HeroName flex:
  1` + badge `flex-shrink: 0`.
- [x] **PR02 — paste button is 36pt tall.** `PasteButton height: 36` with
  no hitSlop on the wrapping Pressable. Fix: vertical hitSlop 4 (→ 44)
  or `min-height: 44`.
- [x] **PR03 — action labels unclamped in fixed-48 buttons.**
  `ActionLabel` ("Programm hinzufügen" ≈ 120pt in a 137pt half-button on
  320) wraps and clips at 200%. Fix: `numberOfLines={1}` + verify 320 DE.
- [x] **PR04 — recognized name has no flex.** `RecognizedName` (no
  `flex: 1`) beside `RecognizedSets` in a space-between row — long
  exercise names push the sets column. Fix: name `flex: 1` (list grows
  vertically, by design) + sets `flex-shrink: 0` + tabular style prop.
- [x] **PR05 — hero/review clamps.** `HeroCaption`, `ReviewTitle`,
  `ReviewMeta` unclamped (German coverage strings + long import names).
  Fix: 1/1/1 lines — bodies grow, no height changes.
- [x] **PR06 — submit has no disabled state for a11y.** Opacity .5 only.
  Fix: `accessibilityState={{ disabled: !hasExercises }}`.

## Batch 2 — locale + brand (PR07–PR11)

- [x] **PR07 — ACTIVE badge uppercases blind.** `t('plan.active.label')
  .toUpperCase()` (same class as SH08/AP05). Fix:
  `toLocaleUpperCase(preferredLanguage)`.
- [x] **PR08 — rebrand residue in copy.** `settings.programs.import.
  recognized` = "Kinetic recognized …". Fix: sweep settings copy
  (`Kinetic` → `Alcedo`) in the same patch as SH01's footer.
- [x] **PR09 — hardcoded rest suffix.** `formatSets` builds
  `` `${rest}s` `` + hardcoded `'AMRAP'`. Fix: fragment key for the
  short-seconds unit; AMRAP recorded keep (universal gym tag).
- [x] **PR10 — hero percent digits.** `Math.round(fraction * 100}%`
  interpolates Latin digits (same class as AP08). Fix:
  `Intl.NumberFormat(locale, { maximumFractionDigits: 0 })` + tabular
  style prop on `HeroPercent`.
- [x] **PR11 — Menlo-only monospace.** Paste `TextInput fontFamily:
  'Menlo'` has no Android fallback. Fix: `Platform.select({ ios:
  'Menlo', android: 'monospace', default: 'monospace' })`.

## Batch 3 — verify-only (no code expected)

- [ ] **L01 — nested note layout.** `RecognizedNote` nests inside
  `RecognizedName` with `\n` + `margin-top` (ignored on nested Text) —
  verify the note sits on its own line on device before reworking.
- [ ] **L02 — FieldLabel casing.** `workout.name.label` / `workout.notes.
  label` under 9/700/+1.2 styling — verify they render as micro-labels
  (pre-uppercased or locale-uppercased), else fold into PR07's patch.
- [ ] **L03 — shared-foundation chrome.** `CardList`, `ItemList`,
  Paper `Card`, `ConfirmationDialog`, `ExerciseManager`,
  `ExerciseEditor`, `ManageWorkoutCardContent`, `PageActions` are legacy
  shared components — out of this loop (foundation migration owns them),
  same decision class as page 12.
- [ ] **L04 — hero chevron.** Hardcoded `#48484A` — already covered by the
  SH06/PF05 shared-chevron patch.

## Implementation notes (2026-09-23 — read before device pass)

- **L04 corrected, then fixed.** The ledger claimed the hero chevron was
  "already covered" by SH06 — wrong: it is an inline SVG stroke, a
  different mechanism the hook never reached. Fixed in this loop with
  `stroke={chevron}`; ledger text stands corrected here.
- **PR09:** new `settings.programs.import.seconds_short` key (en only —
  the only locale carrying these keys; Tolgee falls back). AMRAP kept as
  the universal tag, recorded.
- **Rebrand sweep (this loop):** `import.recognized` → Alcedo. Still open
  for their own loops: `settings.backup.footer` (18), `whatsnew.footer`
  (19), `home.coach.label` / `settings.planner.title` / feed share copy /
  remote captions (other pages' loops — untouched).
- **Gates:** `typecheck` clean on all touched files (remaining errors
  pre-exist in untouched files).

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Hero: title flex, locale badge, Intl percent + tabular, caption clamp, chevron | PR01, PR05 (part), PR07, PR10 | typecheck (touched files clean) |
| 2026-09-23 | Buttons, parser rows/targets/locale/mono, review clamps, rebrand key | PR02–PR04, PR06, PR08, PR09, PR11 | typecheck (touched files clean) |

## Verification (owed before close)

- 320/393/430 × dark/light, 200% text + DE + TR, landscape; 0-session
  program; unmatched-only paste; empty review (file-picker branch);
  VoiceOver on rows + stepper; `npm run typecheck`.
