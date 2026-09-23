# Notifications polish ledger (source of truth)

Status: **implemented 2026-09-23 — code patches NC01–NC05 applied; NC06 + L01–L03
verify-only items still owed with the device pass (320/430, large text, DE,
landscape, VoiceOver chips + time pill).** Per instruction no test files were
written or run.
Scope: page 15 — Notifications (`notifications.tsx` → `NotificationsScreen`
→ `WorkoutCard` (+ day chips + time pill), `ResultsCard`, `SocialCard`,
`DeliveryCard`) against `docs/new_design/settings-dark.md` Screen 3
(393 × 1040) + the skill.

Read method: every file in render order, `.tsx` + `.styles.ts` + helpers
fully, against the spec SVG geometry. Nothing inferred.

## What is already good (not touched by this ledger)

- Day chips are locale-correct: `Intl weekday: narrow` letters + full-name
  a11y labels, Monday-first order, pure testable helpers ✓.
- 44pt press cells around 28×22 chips; checkbox roles with checked/disabled
  states ✓. Whole reminder area dims (.45) when reminders are off ✓.
- Inert toggles are honest: `disabled` + dimmed + "Not available" caption
  everywhere no delivery path exists (goal completions, PRs, all three
  social rows) — documented in the file comments ✓.
- Spec deviations are deliberate and recorded: no fake Alert Sound row, no
  fake quiet-hours editor, legacy Rest Timers row kept last ✓.
- Time respects the app's own 24-hour + language prefs, not device locale ✓.
- Fragment keys are stable (`kudos`, …) — no remount-on-language-switch
  issue here (contrast PF07).

The problems below: one genuine 320pt overflow, one tabular pattern, and
micro-details.

## Batch 1 — scale + clip (NC01–NC04)

- [x] **NC01 — reminder row overflows ~65pt on 320.** 7 cells × 34 (238) +
  time pill 77 + area padding 36 = 351; card inner on 320 is 286.
  Computed, not eyeballed. Fix: `ReminderArea flex-wrap: wrap; row-gap:
  8` + `TimeCell margin-left: auto` — on 393 chips + pill (315 ≤ 323)
  stay one spec-exact row; on 320 the pill wraps to a second right-aligned
  line instead of clipping. Verify 320/393.
- [x] **NC02 — `font-variant` CSS spelling.** `TimeText font-variant:
  tabular-nums` is the same unproven-CSS class as profile D05 (fixed via
  style prop there). Fix: `style={{ fontVariant: ['tabular-nums'] }}` at
  the usage — one patch with any D05-style leftovers.
- [x] **NC03 — time pill a11y names the group, not the value.**
  `TimeCell accessibilityLabel` reuses "Workout Reminders". Fix: label =
  "Workout reminder time, {formatted time}" via existing keys (no new
  strings if the pattern fits; otherwise one fragment key).
- [x] **NC04 — quiet-hours value squeeze.** `delivery-card.styles.ts`
  `RowValue` has no shrink contract ("10 PM – 6 AM" is short, but 24h +
  long locales grow it). Fix: same `flex-shrink: 1` treatment as PF04 in
  the same patch.

## Batch 2 — migrate + verify (NC05–NC06)

- [x] **NC05 — legacy shim in notification styles.** `theme.font.text` /
  `theme.weight.*` in `workout-card.styles.ts` (DayLetter, TimeText) and
  `delivery-card.styles.ts` (RowValue). Fix: fold into the PF06
  migration patch (same one-line pattern).
- [ ] **NC06 — picker locale fallback.** `TimePickerModal locale={language}`
  is `undefined` until a language is chosen (device fallback). Recorded:
  verify the fallback reads sanely; do not force a hard-coded locale.

## Batch 3 — verify-only (no code expected)

- [ ] **L01 — deliberate toggle states.** Challenge Updates ON-looking /
  New Followers OFF while inert is the contract's state variety, not a
  bug. Recorded keep.
- [ ] **L02 — chip active colors in light.** `#B26A00` letter on light vs
  `#FFB84D` dark — verify on device.
- [ ] **L03 — permission-revert behaviour.** Toggle reverts when the OS
  denies permission or nothing is schedulable — behaviour, verified by
  the settings-effects tests, not this loop.

## Implementation notes (2026-09-23 — read before device pass)

- **NC01 wrap mechanics.** `DayCells flex: 1` stays: on 393 it fills the
  line (pill right via `margin-left: auto`, spec-right); on 320 the cells
  hold line 1 at content width and the pill wraps right-aligned below.
- **NC02 proof reused.** The profile D05 fix established the CSS spelling
  has no guaranteed RN mapping — same one-line style-prop pattern here.
- **NC03 key:** new `settings.notifications.workout_reminders.time_label`
  (en + fallback); no fitting pattern existed.
- **NC05 visuals preserved.** 10/700, 10.5/600, 12.5/500 kept as
  overrides; only family/weight/line-height now come from the system.
- **Gates:** `typecheck` clean on all touched files (remaining errors
  pre-exist in untouched files).

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Wrap row, tabular time, voiced pill, shrink, shim, new key | NC01–NC05 | typecheck (touched files clean) |

## Verification (owed before close)

- 320/393/430 × dark/light, 200% text + DE, landscape; VoiceOver on chips
  (letter vs full name) + time pill; toggle-off dim; `npm run typecheck`.
