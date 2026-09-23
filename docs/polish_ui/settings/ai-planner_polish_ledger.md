# AI Planner polish ledger (source of truth)

Status: **implemented 2026-09-23 — all AP01–AP14 code patches applied; L01–L03
verify-only items still owed with the device pass (320/430, large text, DE + TR +
AR, landscape, VoiceOver slider + radios, empty-program + planner-off states).**
Per instruction no test files were written or run.
Scope: page 16 — AI Planner settings (`ai/planner.tsx` → `PlannerScreen` →
`CoachHeader`, `TrainingDays`, `SessionShape` (+ `PlannerSlider`, focus
chips), `Recovery`, `WeeklyOverload`, `NextSession`, chat link row; chat UI
itself at `planner-chat` is out of scope) against
`docs/new_design/settings-dark.md` Screen 4 (393 × 1256) + the skill.

Read method: every file in render order, `.tsx` + `.styles.ts` + pure data
fully, against the spec SVG geometry. Nothing inferred.

## What is already good (not touched by this ledger)

- Slider is fully measured (no fixed geometry): thumb centered on the fill,
  edge-clamped, float-dust rounding, `adjustable` role with step
  increment/decrement + voiced value ✓.
- Switch travel is computed (44 − 22 − 2 = 20), standard curve, reduced-motion
  snaps to 0-duration ✓.
- `planner-data.ts` is locale-excellent: cached Intl formatters, RPE with
  the locale's decimal separator, weekday/month names in-language ✓.
- Empty states are honest and crash-safe (planner-off / no-program /
  no-sessions / no-days — the deleted-program `undefined` case is handled,
  with a comment saying so) ✓.
- Stepper buttons are 44pt + hitSlop-7 with named increase/decrease labels ✓.
- `SplitStrip` already single-line ✓. Aura stretches via
  `preserveAspectRatio="none"` ✓ responsive.

The problems below: one circle-row overflow, English-only day initials, one
light-mode contrast bug, locale-blind number paths, clamps, and micro-details.

## Batch 1 — scale + clip + locale (AP01–AP08)

- [x] **AP01 — day circles overflow ~60pt on 320.** 7 × 44 pressables =
  308; card content on 320 is ~248, and `space-between` cannot invent
  negative gaps. Computed. Fix: pressable `flex: 1; max-width: 44` —
  spec-exact on 393 (content 321 ≥ 308), evenly distributed on 320.
- [x] **AP02 — visual day initials are English-only.** `WEEK[].letter`
  hardcodes M/T/W/… while the a11y label is already localized
  (`weekdayShort`). The notifications loop solved this exact problem with
  `dayLetter` (Intl narrow). Fix: visual letters via the same narrow
  pattern with `locale`.
- [x] **AP03 — focus options are 26pt targets.** The focus `Pressable`s
  fill a fixed 26-high track with no hitSlop. Fix: vertical hitSlop 9
  (→ 44) like the small segmented variant.
- [x] **AP04 — focus labels unclamped.** `FocusOptionText` (11pt
  "Krafttraining" ≈ 140pt at 200%) in fixed thirds. Fix:
  `numberOfLines={1}` (full names already in the radio labels).
- [x] **AP05 — muscle chips: locale-blind uppercase + no wrap.**
  `next-session.tsx` `.toUpperCase()` on a translated muscle name
  (Turkish-İ class, same as SH08) + `MuscleChips` single row. Fix:
  `toLocaleUpperCase(locale)` + `flex-wrap: wrap` on the row.
- [x] **AP06 — overload decimal is locale-blind.** `trimZeros` uses
  `toFixed('.')` while RPE two files away uses the locale separator via
  `decimalFormatterFor`. Fix: route the overload display through the
  same locale-decimal pattern.
- [x] **AP07 — stepper value not tabular.** `StepValue` mutates per tap in
  proportional figures (same class as profile P10). Fix: `fontVariant:
  ['tabular-nums']` style prop + `numberOfLines={1}`.
- [x] **AP08 — insight percent not localized.** `Math.abs(change)`
  interpolates Latin digits everywhere. Fix: `Intl.NumberFormat(locale,
  { maximumFractionDigits: 0 })` (integers — no separator drama, digits
  correct).

## Batch 2 — clamps + hairline + targets (AP09–AP14)

- [x] **AP09 — slider header row has no shrink contract.**
  `SliderLabel` + `SliderValue` space-between, neither clamped. Fix:
  label `flex: 1; numberOfLines={1}`, value `flex-shrink: 0`.
- [x] **AP10 — header/meta clamps.** `CoachTitle` 1 line, `CoachCaption` 2
  lines, `NextName` 1 line, `NextMeta` 2 lines, `ChatRowTitle` /
  `ChatRowCaption` 1/2 lines, `RegenLabel` + `EmptyCtaText` 1 line
  (fixed-44 buttons). Bodies grow — no height changes.
- [x] **AP11 — days header squeeze.** `DaysTitle` + long rest caption
  space-between with no shrink. Fix: title `flex-shrink: 1;
  numberOfLines={1}`, caption `flex-shrink: 0`? (caption is the longer
  side in DE — instead: caption `flex: 1; text-align: right;
  numberOfLines={1}`). Verify on 320 DE.
- [x] **AP12 — 1px divider.** `RecoveryDivider height: 1px`. Fix:
  `StyleSheet.hairlineWidth` (same patch class as SH03/PF01).
- [x] **AP13 — plus icon vanishes in light mode.** Step minus `#C7C7CC`
  reads on both fills, but the plus `#FFFFFF` sits on
  `rgba(0,0,0,0.04)` in light — near-invisible. Genuine contrast bug.
  Fix: theme-aware plus (`#FFFFFF` dark / `#1C1C1E` light), minus keep.
- [x] **AP14 — unguarded track-width setState.**
  `planner-slider.tsx onTrackLayout` (same class as PF09). Fix: guard
  unchanged widths.

## Batch 3 — verify-only (no code expected)

- [ ] **L01 — brand slider fills.** `HomeGradient variant="brand"` fills +
  white thumb + brand core — verify gradient + gloss in light.
- [ ] **L02 — deload date honesty.** Stored date or +3 weeks, never
  hardcoded; `resolveDeloadWeek` try/catch falls through on garbage.
  Recorded keep.
- [ ] **L03 — volume insight gating.** Renders only when `change !==
  undefined && autoDeload`. Recorded keep.

## Implementation notes (2026-09-23 — read before device pass)

- **AP01 corrected — the ledger fix was insufficient.** Verified against
  `HomeCard` source (1px edge + 20 pad, no page margins): DaysCard content
  on 320 is 246, so 7 × 40 circles (280) overlap even with flex
  pressables. Shipped instead: measured circles (`min(40, max(28,
  floor((w − 24) / 7)))`) + `flex: 1; max-width: 44` pressables — 393
  renders 40-exact, 320 scales to ~31 with ~5pt gaps, 28 floor keeps the
  12pt initial legible. Guarded layout state (no loops). Recorded
  deviation with arithmetic.
- **AP06 keeps RPE untouched.** New exported `formatOverloadValue`
  (min 0 / max 1 fraction) beside the untouched `decimalFormatterFor`;
  halves render bare, locale separator correct.
- **AP08/AP10 visuals unchanged.** Percent is integer-formatted digits
  only; clamps sit on growing bodies (no height edits).
- **Gates:** `typecheck` clean on all touched files (remaining errors
  pre-exist in untouched files).

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Measured day circles + localized initials + days header | AP01, AP02, AP11 | typecheck (touched files clean) |
| 2026-09-23 | Focus targets/clamps, slider contracts, overload/percent locale, chips, clamps, hairline, plus contrast | AP03–AP10, AP12–AP14 | typecheck (touched files clean) |
| 2026-09-23 | Cross-cutting brand sweep: Kinetic → Alcedo user-facing copy | settings.planner.title | en.json string-only, zero layout risk |

## Verification (owed before close)

- 320/393/430 × dark/light, 200% text + DE + TR (uppercase paths) +
  AR (digits), landscape; VoiceOver slider adjust + focus radios;
  empty-program + planner-off states; `npm run typecheck`.
