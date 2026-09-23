# Profile editor polish ledger (source of truth)

Status: **implemented 2026-09-23 — all code patches applied; device pass (320/430, large
text, DE, landscape) still required before closing the acceptance bar.** Vitest skipped
per instruction — run the profile suites before the device pass.
Scope: pages 11 + 12 — Screen 4 (`feed/profile-editor.tsx` →
`smart/profile-editor-screen.tsx` → `profile/profile-screen.tsx`: nav, avatar,
stats strip, identity, goals + ring sheet + slider, units, privacy + toggles +
blocked sheet, connected, footer) against `docs/new_design/social-dark.md`
Screen 4 (393×1854) + the spec's light-mode delta table + the skill; plus page
12 (`feed/share.tsx` `?id=` share-request branch), which is recorded here as
deliberately out of polish scope (no spec reference, legacy Paper chrome —
verification §12's own decision).

Read method: every section in render order, `.tsx` + `.styles.ts` fully,
against the spec SVG geometry. Nothing inferred.

## What is already good (not touched by this ledger)

- Light palette rows verified in `profile-tokens.ts`: destructive `#D70015`,
  chevron `#C7C7CC`, toggle `#34C759`, segmented thumb white + shadow flag,
  slider thumb `$light` branch, sheets/stepper/input fills, danger wash kept
  red in both modes (spec destructive row).
- Honesty architecture intact: empty identity defaults, real follower count,
  no bodyweight fiction, no Log Out / photo dead controls, `useOwnPerson`
  everywhere, save-gated identity writes, session-scoped everything that
  needs it.
- Tabular numerals already on RingValue, VolumeValue, StepValue
  (`fontVariant` style prop / `font-variant` CSS).
- Reduced-motion thumb + toggle, 44pt targets (steppers, Done/Cancel,
  Block/Unblock, toggles via rows, sheet Done), a11y roles/states/labels on
  rows and segmented options, own-row switch ownership (toggle itself
  `accessible={false}` — exactly one control per row).
- Avatar/rings glyphs 1:1 from the Screen 4 defs; dots use the home-ring
  gradient pairs (documented, better than the spec's flat approximations).
- Background already `xMidYMin slice` (consistent with trends TX08 / feed FX04).

The problems below: one fixed-geometry slider, one fixed segmented control,
fixed card/row heights meeting unclamped text, hairlines, and micro-details.

## Cross-cutting items (PX)

- [x] **PX01 — 1px hairlines.** Nine absolute dividers at `height: 1px`
  (stats-strip, identity ×2, goals ×3, units ×2, privacy ×6, connected) render
  ~2–3 physical px on @2x/@3x. Fix: `StyleSheet.hairlineWidth`, keep colors.
  (Sheet top borders 1px are spec edges — keep, not this.)
- [x] **PX02 — absolute dividers + fixed rows.** Dividers sit at spec-boundary
  tops (52/104, 98/150/210, 62/118, 56…316, 56) while rows are fixed
  52/56/64. At reference sizes both are exact; under large text the rows clip
  (HomeCard `overflow: hidden`) before dividers can drift. So the fix is
  clamps (Batch 1), not repositioning — absolute boundaries stay, recorded
  reasoning.
- [x] **PX03 — large-text policy.** Recorded, not coded: fixed 68/72/190/card
  heights + fixed pills assume reference sizes. Containments below prevent
  overlap; the 200% + German device pass is still owed.
- [x] **PX04 — compact M/K suffixes stay Latin.** `formatCompactVolume`
  localizes digits ("1,28M") but M/K never translate (contract thresholds).
  Recorded, consistent with the verification log.
## Batch 1 — scale + clip (P01–P10)

- [x] **P01 — slider frozen in 321-space.** `SliderArea width: 361`,
  `TrackBase left: 36 / width: 321`, thumb/now/range math in
  `profile-formatters.ts` constants (`trackX 36`, `trackWidth 321`), drag
  clamp in the same space. On 320 the card inner is ~248: 73pt overflow +
  thumb/tick/drag all mispositioned. Fix: `SliderArea onLayout` → measured
  card width; track width = measured − 40 (36 left inset, 4 right — the
  reference's real asymmetric insets); thumb/now x scaled from 321-space;
  formatters take optional `(trackWidth = 321, trackX = 36)` params so the
  contract specs (x=196.5 / 189.4) stay green untouched. Drag clamp uses the
  measured track.
- [x] **P02 — "50k" label 32pt off spec.** `RangeEdge $right` uses `right:
  36px`, ending the label at card−36 = 325; spec ends it at x=357 (track end
  36+321). The left label (`left: 36`) is correct. Fix: `right: 36` → `right:
  4` (track-relative both ends). Genuine spec deviation, not taste.
- [x] **P03 — visibility segmented fixed 161.** Label (`flex: 1`) + 161 control
  + 40 insets overflows ~63pt on 320 once the German label
  ("Profilsichtbarkeit") takes its share; "Öffentlich" (≈55pt) already exceeds
  its 53.7 segment. Fix: `VisibilityWrap flex: 1` + measured width into
  `SegmentedControl width` (its thumb math already derives from `width` —
  pass `thumbWidth = width/3 − 4`, the spec's 2pt side insets); `OptionLabel
  numberOfLines={1}`. Units segmented (120, kg/lb/… universal) verified fine —
  no change.
- [x] **P04 — toggle labels unclamped.** `ToggleLabel flex: 1`, no clamp, rows
  fixed 52 — German labels wrap and clip. Fix: `numberOfLines={2}` (2 lines =
  ~34pt + 13 pad = 47 ≤ 52 ✓ contained; single-line languages unchanged).
- [x] **P05 — connected rows unclamped.** `Title/Subtitle/Status` wrap in fixed
  56 rows ("Nicht gekoppelt" + a long watch name + a wrapped subtitle clips
  today on 320). Fix: `numberOfLines={1}` on all three (single-line rows by
  spec design; full strings stay in a11y labels).
- [x] **P06 — stats strip micro-labels.** `Value/Label` unclamped in a fixed 68
  strip; "DAY STREAK" (≈55pt at 7.5) already touches 52pt cells on 320.
  Fix: `numberOfLines={1}` both. (Values are short numerals — safe.)
- [x] **P07 — danger button fixed 361.** `DangerButton width: 361px` overflows
  73pt on 320. Fix: `width: 100%` (Footer centers; 361 on 393 ✓) + `min-height:
  48` + vertical padding + label `numberOfLines={2}`.
- [x] **P08 — ring/volume labels.** `RingLabel flex: 1` (good) but unclamped;
  `VolumeLabel` + `VolumeValue` unclamped in a fixed 34 header (German
  "Wöchentliches Volumenziel" + "35.000 kg" ≈ 260 > 248 on 320 → clip). Fix:
  `numberOfLines={1}` on all three (`VolumeLabel flex: 1` already implied by
  `margin-left: auto` on the value — add explicit flex to the label).
- [x] **P09 — blocked names.** `BlockedName flex: 1`, no clamp, 52 rows. Fix:
  `numberOfLines={1}` (full name in the row a11y label — check; add if absent).
- [x] **P10 — bio counter not tabular.** `BioCounter` mutates per keystroke in
  proportional figures. Fix: `fontVariant: ['tabular-nums']` (same one-line
  call as the composer counter, feed-composer loop).
## Batch 2 — nav a11y + avatar labels (P11–P12)

- [x] **P11 — nav buttons have roles but no labels.** `profile-screen.tsx`
  `NavButton`s carry `accessibilityRole` only — screen readers announce
  "button" with no name. Fix: `accessibilityLabel` reusing the existing
  `feed.profile.nav.cancel/title/save` keys (no new strings).
- [x] **P12 — avatar a11y hardcoded English.** `profile-avatar.tsx`
  `accessibilityLabel="Profile photo"`. Fix: fragment key
  (`feed.profile.avatar.photo`, "Profile photo" fallback).

## Batch 3 — verify-only (no code expected)

- [x] **L01 — palette light rows** (destructive, chevron, toggle, segmented,
  slider shadow flag, sheets, danger wash). Verified in `profile-tokens.ts`.
- [x] **L02 — ring dots = home gradient pairs.** Documented upgrade over the
  spec's flat approximations. Record only, do not "simplify".
- [x] **L03 — units rows.** Label `flex: 1`, 120 control, universal short
  labels, absolute dividers at true boundaries (62/118). Verified, no change.
- [x] **L04 — toggle a11y architecture.** Row owns role/state/label, visual
  toggle `accessible={false}` — exactly one control per row. Verified.
- [x] **L05 — iOS switch geometry.** 44×26, 22 knob, 20pt travel, standard
  curve, reduced-motion instant. Verified against the spec comment.
- [x] **L06 — StepGlyph ± text.** 22pt text glyphs, not SVG — iOS stepper
  convention, font-reliable at this size. Record keep, do not redraw.
- [x] **L07 — avatar initial offset.** `margin-top: 6` optically centers the
  cap-height glyph in the 88 circle. Reasonable; confirm on device.
- [x] **L08 — version `#48484a` both modes.** ≈7:1 on white, spec value.
  Record only.

## Batch 4 — details + page-12 record

- [x] **D01 — PX01 hairlines.** Nine absolute dividers → `hairlineWidth`.
- [x] **D02 — dead `CameraGlyph`.** Exported in `profile-glyphs.tsx`, zero
  usages (camera badge deliberately omitted — no image-picker dep). Remove
  the export. (Verify zero usages again at implementation; if resurrected,
  drop this item.)
- [x] **D03 — ring-sheet Modal `fade` vs blocked `slide`.** Both are bottom
  sheets; different transitions read as two components. Spec is silent.
  Record — unify to `slide` at implementation unless a reason surfaces
  (one-line, low risk), device-confirmed.
- [x] **D04 — focusPrivacy offset 76.** Magic number aligning the privacy card
  under the 56 nav. Works; record (brittle only if nav height changes — it is
  fixed 56 by the same file).
- [x] **D05 — StepValue `font-variant` CSS.** `font-variant: tabular-nums`
  in a styled template — confirm it maps (else switch to the `tabularNumbers`
  style-prop pattern used in goals.tsx). Check at implementation.
- [x] **D06 — page 12 share-request: NO POLISH.** `share.tsx` `?id=` branch
  stays legacy Paper chrome — no spec reference exists and inventing one is
  a design decision, not a patch (verification §12's own ruling). Record only;
  functional fixes already landed there.
- [x] **D07 — `shared-item/[id]` renderer: out of scope.** E2E-decrypted share
  view, unlisted in verification, no spec reference. Not audited in this loop;
  needs its own loop if it ever gets one. Recorded so the gap is visible.

## Verification gates (run at implementation)

`npm run typecheck` 0 new errors · touched-file vitest suites
(`profile-editor-simulation`, `profile-formatters`, slider-adjacent) ·
`oxlint`/`oxfmt` on touched files · device pass 320/430 × dark/light + 200%
text + DE before closing. Formatters keep default params so contract specs
stay green untouched.

## Implementation notes (2026-09-23 — read before device pass)

- **P01 drag space:** `dragX` is area-local (track starts at area-local 36), so it
  displays unscaled; only the resting/thumb math scales from 321-space. The
  `setAreaW` guard (`prev === width`) prevents layout loops.
- **P02 verified arithmetically:** `right: 4` + 5 centering inset = 35 = spec
  x=357 end. Left label untouched (already track-relative).
- **P03 on 393:** wrap measures 204 → control `min(161, 204)` = 161 spec-exact,
  right-aligned (spec x196). Segment labels truncate inside shrunken segments
  on narrow German — contained + full a11y names, recorded.
- **D05:** `font-variant` in the styled template replaced with the proven
  `fontVariant` style-prop pattern (same as goals.tsx) — the CSS spelling has
  no guaranteed RN mapping.
- **Gates:** `typecheck` clean on all touched files (remaining errors pre-exist in
  untouched files). Vitest skipped per instruction — run
  `profile-editor-simulation`, `profile-formatters` before the device pass.

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Batch 1: measured slider + 50k fix, flex segmented, clamps, danger button | P01–P10 | typecheck (touched files clean) |
| 2026-09-23 | Batch 2: tabular counter, nav/a11y labels, avatar key | P10–P12 | typecheck (touched files clean) |
| 2026-09-23 | Batch 3: light table verified row by row | L01–L08 | code review (no changes) |
| 2026-09-23 | Batch 4: hairlines, dead glyph, sheet fade, StepValue tabular | D01–D03, D05 | typecheck (touched files clean) |
| 2026-09-23 | Cross-cutting brand sweep: Kinetic → Alcedo user-facing copy | feed.profile.footer.version | en.json string-only, zero layout risk |
| 2026-09-23 | Sweep 2: fragment footer + shared-item kicker (p12 file, string-only; its en-US date hardcode stays a known item for a future p12 loop) | feed.profile.json, shared-item | typecheck (touched files clean) |