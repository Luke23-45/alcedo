# Preferences polish ledger (source of truth)

Status: **implemented 2026-09-23 — all code patches applied; device pass (320/430,
large text, DE, landscape) still required before closing the acceptance bar.**
Per instruction no test files were written or run.
Scope: page 14 — Preferences (`app-configuration` + `localization` deep-link
here → `PreferencesScreen` → `AppearanceCard`, `UnitsCard`,
`LanguageRegionCard`, `LanguagePickerCard`, `DisplayCard`, shared
`PreferenceSegmented` + math, `PreferenceRow` anatomy) against
`docs/new_design/settings-dark.md` Screen 2 (393 × 1380) + the skill.

Read method: every file in render order, `.tsx` + `.styles.ts` + math fully,
against the spec SVG geometry. Nothing inferred.

## What is already good (not touched by this ledger)

- Segmented control measures its track (`onLayout`) and derives the thumb —
  no fixed geometry; thumb math exact (large overshoots 2/side, small insets
  2, both spec-measured); hidden until measured (no wrong-position flash);
  reduced-motion snap; unknown value clamps to first segment.
- Locale honesty throughout: `Intl.DateTimeFormat` day names, real fallback
  language label (never claims English), Japanese listed-but-disabled,
  region row only for curated languages, bodyweight via `shortLocaleFormat`.
- Rows are `min-height` (they grow); clamps correct (title 1, subtitle 2,
  language name 1, values 1).
- Swatch radio roles + selected ring theme-aware (white .85 / ink .85) ✓.
- Separators at spec 20/20 insets (x36→x357 on 393 ✓).
- `scrollToPicker` offsets 16pt above the picker ✓.

The problems below: one genuine 320pt overflow, one hairline, unclamped
segment labels, hardcoded chevrons, the shim, and micro-details.

## Batch 1 — scale + clip (PF01–PF05)

- [x] **PF01 — 1px separators.** `preference-row.styles.ts` `RowSeparator
  height: 1px` (used between every preference row). Fix:
  `StyleSheet.hairlineWidth`, keep 20/20 insets + colors.
- [x] **PF02 — swatch row overflows 14pt on 320.** Five seeds × 52 pitch +
  40 padding = 300; card inner on 320 is 286. Computed, not eyeballed.
  Fix: `SwatchRow justify-content: space-between` + `SwatchButton width:
  44` (keeps the 44pt target; pitch stays 52-exact on 393 where
  5×44 + 4×gaps fills the same 300). Verify 320/393.
- [x] **PF03 — segment labels unclamped.** `OptionLabel` has no
  `numberOfLines`; at 200% text two-line labels clip inside the fixed
  44/30 tracks. Fix: `numberOfLines={1}` on the label (segments are
  single-word in every shipped language — verify DE).
- [x] **PF04 — trailing value squeeze.** `language-region-card.styles.ts`
  `RowValue` (12.5pt "Português (Brasil)") + chevron has no shrink
  contract; `PreferenceRow RowText` has no `min-width: 0`. Fix:
  `RowValue flex-shrink: 1` + `RowText min-width: 0`; verify on 320.
- [x] **PF05 — hardcoded chevrons.** `language-region-card.tsx` `Chevron()`
  and the display-card restart row use `#48484A` both modes (same defect
  as SH06). Fix: shared theme-aware chevron (`#48484A` dark / `#C7C7CC`
  light) — do SH06 + PF05 as one patch.

## Batch 2 — migrate + micro-detail (PF06–PF09)

- [x] **PF06 — legacy shim across preference styles.** `theme.font.text` /
  `theme.weight.*` in `preference-row.styles.ts` (CardSectionLabel,
  CardCaption), `preference-segmented.styles.ts` (OptionLabel),
  `units-card.styles.ts` (UnitLabel), `language-picker-card.styles.ts`
  (LanguageName, RegionText), `language-region-card.styles.ts`
  (RowValue). Fix: migrate to `type(theme, …)` in one patch.
- [x] **PF07 — display rows keyed by localized label.**
  `display-card.tsx` `key={row.label}` remounts every toggle on language
  change. Fix: stable keys (setting id).
- [x] **PF08 — locale-unsafe accent fallback.** `appearance-card.tsx`
  `seed.id.charAt(0).toUpperCase()` (same class as SH08). Fix:
  locale-aware casing with `preferredLanguage`.
- [x] **PF09 — unguarded track-width setState.** `preference-segmented.tsx`
  `onLayout` sets state on every layout pass. Fix: guard
  (`prev === width` return) against layout loops.

## Batch 3 — verify-only (no code expected)

- [ ] **L01 — light segmented.** Thumb white + dy2/blur4 .18 shadow,
  selected `#1C1C1E`, track black .05 — verify on device.
- [ ] **L02 — fixed 120 unit segmented.** Options are universal 2-letter
  codes; German labels + 120 + 40 insets fit 320 arithmetically (~220).
  Verify on 320 DE rather than reworking.
- [ ] **L03 — region row scrolls to the language picker.** Deliberate and
  documented (region follows language). Recorded keep.
- [ ] **L04 — Japanese disabled row.** Opacity .55 + `disabled` + Soon
  badge + `accessibilityState.disabled` — honest and voiced. Recorded keep.
- [ ] **L05 — true-black toggle vs "no dead black".** User-chosen pure
  black is a preference, not the default atmosphere. Recorded keep.

## Implementation notes (2026-09-23 — read before device pass)

- **PF02 implemented better than specced.** The ledger proposed
  space-between + 44 buttons, but arithmetic shows gaps would drift to
  24.75 on 393 (spec: 20). Shipped instead: `flex: 1; max-width: 52` —
  393 renders 52-exact (content 319 ≥ 260), 320 shares the row at 49.2
  each (content 246 = 5 × 49.2 exactly), targets stay ≥ 44 everywhere,
  equal cells keep even spacing. Recorded deviation with reasoning.
- **PF06 visuals preserved.** Every migrated style keeps its spec-measured
  size/tracking as an override; only family/weight/line-height now come
  from the type system (single-line texts — line-height deltas ≤ 1pt).
- **Gates:** `typecheck` clean on all touched files (remaining errors
  pre-exist in untouched files).

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Preference anatomy: hairline, shrink contract, segmented clamp+guard, swatch flex | PF01–PF04, PF09 | typecheck (touched files clean) |
| 2026-09-23 | Chevrons, accent casing, stable display keys, full shim migration | PF05–PF08 | typecheck (touched files clean) |

## Verification (owed before close)

- 320/393/430 × dark/light, 200% text + DE, landscape; VoiceOver on the
  segmented + swatch radios; language switch (no toggle remount);
  `npm run typecheck`.
