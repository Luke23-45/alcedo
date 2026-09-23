# Exercise editor polish ledger (source of truth)

Status: **implemented 2026-09-23 — all code patches applied; device pass (320/430, large text, DE,
Android dash, keyboard, landscape) still required before closing the acceptance bar.** No verification
runs yet by user request (`typecheck`/`lint`/`vitest` skipped) — run them plus
`exercise-editor-logic.spec` / `dismiss-update.spec` before the device pass.
Scope: `/exercise-editor` in render order — route `app/src/app/exercise-editor.tsx` through
`components/smart/session-exercise-editor/session-exercise-editor.tsx`,
`components/presentation/exercise-editor/` (screen, tokens, logic, primitives, all seven cards,
rest sheet, type-switch dialog) — for **dark + light** and **iOS + Android**.
Out of scope (own ledgers later): workout editor (the href target), `ConfirmationDialog`/`Menu`
foundation chrome (invocation only here), `WeightEditor`/`DecimalEditor`/`IntegerEditor`/
`DurationEditor` foundation editors (invocation only here).
Audited 2026-09-23 by reading each file end-to-end (no skips). Same rules as the home/session/
workout-editor ledgers: one patch per item (or tight group), state closed IDs, check boxes only
with code + verification, append new IDs (never reuse), keep sorted by section.

## Ground truth references (do not re-derive)

- Skill (law): `.agents/skills/apple-ios-frontend/SKILL.md` — same bar (4pt grid, 44pt targets,
  negative-display / positive-micro tracking, computed values, dy10/blur14 cards, dy6/blur8 tiles).
- Reference: `docs/new_design/exercise-editor-redesign.md` S1–S6 + contract checklist (lines 567–599)
  + light row (line 601). Gradient/filter IDs cited below come from its `<defs>` (`cd` card body,
  `ce` edge, `br` brand, `gl` gloss, `bk` back chevron, `ch` chevron, `mag`/`swap`/`lnk` glyphs,
  `bm`/`bp`/`bms`/`bps` steppers, `tgon`/`tgoff`/`tglock` toggles, `lck` lock, `trash`,
  `rdsel`/`rdoff` radios, `fc`/`ft2`/`fb`/`fa` shadows).
- Tokens: `exercise-editor-tokens.ts` (`editorPalette(isDark)` — explicit per-mode values; light
  keeps identical geometry with iOS-standard deltas).
- Honesty anchors (do not regress): draft-on-dismiss (dirty strip only when dirty); search-first add
  flow with Done-disabled; swap keeps sets·notes·link; destructive type-switch naming lost + kept;
  rest rows removed (never disabled) when timers off; locked toggles read locked; drop-set caption
  never claims automatic step-down; link glyph ember only for real http(s); imperial mi/yd honesty
  (no feet — model has none); `isNew === '1'` explicit parse.
- What's already right: card edge/body shells with concentric radii, ember active edge on expansion,
  focus-glow search field, 44-effective targets (steppers via slop 11/8, segments via slop 4,
  trash via slop 10, chips via slop 8, toggles via slop 10), reduced-motion on modal/sheet,
  tabular numerals on values, clamped names/summaries, radio semantics with `accessibilityState`.

## Global acceptance bar (applies to every item)

- [ ] No clipping/overlap at 320 / 360 / 393 / 430 pt widths, portrait + landscape, iOS + Android.
- [ ] No clipping at 200% text size and with German strings (longest locale).
- [ ] Dark and light both intentional (tokens already per-mode — verify each fix in both).
- [ ] Every dimension a multiple of 4, every interactive visual ≥ 44pt (or `hitSlop` to 44 with no
  neighbour overlap), no dead button-look controls.
- [ ] Numbers locale-formatted, uppercase locale-safe, no hardcoded English in UI.

---

## NX — Cross-cutting (fix once, helps every section)

- [x] **NX01 — dead `text-transform: uppercase` (React Native ignores it).** Problem: same class as
  session SX01 / workout-editor EX01 — section labels render Title Case against ALL-CAPS spec text
  (spec lines 54, 67, 85, 98, 111, 128). Sites: primitives `MicroLabel` (10/700/+1.35,
  `editor-primitives.styles.ts:64-73`; 7 call sites in `exercise-editor-screen.tsx` passing Title
  Case defaults `'Exercise'`, `'Set Configuration'`, `'Detail'`, `'Workout Options'`, `'Resistance'`,
  `'Progression'`, `'Cardio / Time'`) and `SubHead` (9/700/+1.2, styles 76–84; 3 call sites passing
  `'Notes'`, `'External link'`, `'Track'`). Counters/hints are sentence case by design (no change).
  Fix: `toLocaleUpperCase()` at the 10 call sites, delete the dead CSS. Accept: caps match spec in
  EN + DE, no `text-transform` remains in this feature.
- [x] **NX02 — deprecated `theme.font.text` shim.** Problem: ~40 reads across every styles file in
  this feature (screen, primitives, all seven cards, sheet, dialog) — the shim is slated for removal
  (session SX07 / workout-editor EX02 precedent). Fix: resolve through
  `type(theme, 'body').fontFamily`, same metrics. Accept: zero `theme.font` reads remain in this
  feature.
- [x] **NX03 — 1px lines → hairline.** Problem: `Hairline` (primitives styles 53–58, margins 16/16),
  `DialogDividerH/V` (`type-switch-dialog.styles.ts:62-65,78-81`) use literal 1px. Fix:
  `StyleSheet.hairlineWidth` (session SX06 precedent). N04's divider overshoot (below) folds into the
  same patch. Accept: hairlines match reference weight on device.
- [x] **NX04 — fixed ink that must go mode-aware.** Problem: `TrashGlyph` hardcodes `#FF6B60`
  (primitives 108–114 — light needs `#FF3B30`, diff-save/session precedent);
  `ChevronRightGlyph` hardcodes `#48484A` (120–122 — light needs `#C7C7CC`, home/recent precedent);
  `CheckGlyph` defaults `#30D158` (116 — light needs `#34C759` once its usage is confirmed, N12);
  `editor-primitives` `SegmentLabel` unselected `#8E8E93` both modes (190–197 — acceptable iOS gray,
  record keep). Fix: theme-driven inks via `editorPalette` (red already tokenized ✓). Accept: every
  glyph legible + correctly colored both modes.
- [x] **NX05 — locale safety.** Problem: `set-config-card.tsx:79`
  (`'Set {number}'.toUpperCase()` → `toLocaleUpperCase`); `identity-card.tsx:124`
  (`charAt(0).toUpperCase()` → `toLocaleUpperCase`, Turkish-I safe); `weightSuffix` + bodyweight unit
  render `lbs` while the spec shows `lb` (spec S5 line 454 `225 lb`; container
  `session-exercise-editor.tsx:123` passes `'lbs'`, logic `formatBodyweight`
  `exercise-editor-logic.ts:298` hardcodes `'lbs'` — and the spec test asserts `.toContain('lbs')`).
  SI duration units (`formatDurationShort` `s`/`m`, logic 78–89) stay as-is — SI symbols are
  conventionally unlocalized, record keep. Fix: `lb` in both spots + update the spec assertion to
  `toBe('177.7 lb')`; `toLocaleUpperCase` in both glyph/label spots. Accept: DE + TR locales correct,
  spec suite green.
- [ ] **NX06 — dashed borders need an Android verdict.** Problem: `AddRuleButton`
  (`progression-card.styles.ts:93-103`, `border-style: dashed`) and the shared `DropDash` pattern —
  Android historically renders dashed `border-style` as solid (workout-editor E08a already carries
  this verdict item). Fix: verify on Android; fall back to an Svg dashed line if solid. Accept: a
  written per-platform verdict, not an assumption.

## N00 — Shell / container (`session-exercise-editor.tsx` + `.styles.ts`)

- [x] **N00a — aura reads OS theme, not app theme.** `ScreenAura` (31–46) uses `useColorScheme()`
  while everything else reads `useAppTheme().isDark` (in-app override aware) — a forced light/dark
  setting desyncs the aura (green/ember/cyan at .10/.14/.12 vs .06) from the cards. Slice
  (`xMidYMin slice` ✓ keep — already correct, unlike pre-fix home/session) and geometry
  (237,150,r280 ≈ spec A1 per canvas ✓ keep). Fix: `useAppTheme().isDark`. Accept: aura follows the
  in-app theme switch instantly.
- [x] **N00b — `weightSuffix` + Done gating verified, keep shape.** `'lbs'`→`'lb'` folds into NX05;
  `doneDisabled` (blank-name gate ✓ spec S6 Done dimmed), `dirty` strip gating ✓, `avoidKeyboard`
  container (`FullHeightScrollView avoidKeyboard` ✓ — S5 keyboard panel satisfied by construction),
  all-`additive` safe edges ✓ (pushed screen, correct). No other change.

## N01 — Nav row (`exercise-editor-screen.tsx` 146–167 + styles 8–51)

- [x] **N01a — title size + Done technique.** `NavTitle` 17/600/−0.4 vs spec 15/600/−0.3 (spec lines
  48, 262, 517 — all three canvases agree on 15). Fix: 17→15, tracking −0.4→−0.3. `NavDone`
  dims via `opacity: 0.35` when disabled vs spec solid `#48484A` text (S6 line 518) — keep opacity
  (cleaner across themes than a second grey) and record here. `NavRow` 56 fixed (spec content starts
  ~64; fine, no keyboard/overlay interplay) + `NavBack` 44 with −12 optical (chevron lands ≈x20 vs
  spec 28 — 8pt left; nudge margin to land on 28 or record measured keep — decide in patch).
  `NavDoneText` 15/600/−0.2 amber vs spec −0.3: align tracking. Accept: spec type, one decided Done
  technique.

## N02 — Dirty strip + section labels

- [x] **N02a — verified, keep.** Centered 6-dot + 10.5/500 copy ✓ (spec lines 50–51, 9 exact strings
  across canvases); renders only when dirty ✓ (spec decision 9). `SectionGap` 20 + `LabelGap` 8 rhythm
  ✓ consistent throughout. MicroLabel caps via NX01. No change; recorded so the strip isn't reworked.

## N03 — Identity + search (`identity-card/`)

- [x] **N03a — search caret color.** `SearchInput` (styles 78–86) sets no `selectionColor` — iOS falls
  back to the blue caret against the ember-glow field (spec S6 line 526 caret `#FF6A3D`). The plan-name
  input on the sibling screen sets it; this one doesn't. Fix: `selectionColor: ember` (per-mode
  `#FF6A3D`/`#E8542F` — tokens already carry both). Accept: caret matches the glow both modes.
- [x] **N03b — results verified, keep shape.** 44-min rows ✓, 28 tile rx9 ✓, clamped name/subtitle ✓,
  indexed tile accents ✓, hairlines between (weight via NX03; right-edge overshoot: `Hairline`
  margins 16/16 land at absolute 32..361 inside an unpadded card vs spec 32..357 (S6 line 533) —
  fix right margin 16→12 in the NX03 patch). `key name::index` ✓. Clear button 44-effective ✓.
  Empty/no-result hint states ✓. `NameText` 2-line wrap + swap glyph ✓ (spec S6 long-name block).
  `TypePickerPad` 16/16/12/4 + segmented Weighted/Cardio ✓ (spec lines 61–64; label 12 vs 12.5 per
  N08 — single fix location, fold into N08). Accept with the two folded fixes.
- [x] **N03c — tile-accent duplication.** Styles-local `TILE_ACCENTS` (5 entries, styles 372–378) vs
  tokens `tileAccents` (6 entries, tokens 51) — two sources, first-two-match comment only on the
  local one. Fix: delete one (keep the token, extend comment) and import where used. Accept: one
  accent source.

## N04 — Set config (`set-config-card/`)

- [x] **N04a — per-set cell density at 320.** `SetCell` thirds with −4 gutters (styles 56–62) land at
  ≈104pt on 393 (spec line 208: 104×52 ✓ exact) but ≈91pt on 320 while the small stepper row inside
  (`SetCellStepper`: 22 + `min-width: 32` + 22 = 76 + cell padding 20 = 96 minimum) needs 96 → ~5pt
  overflow at 320, worse with 3-digit values. Fix: value `min-width` 32→24 inside cells (13px tabular
  `100` ≈ 25pt — verify on device) and/or cell padding 12→8; keep 52 height + rx14. `SetCellLabel`
  caps via NX05. `TailCaption` copy kept (verified honest ✓). Accept: 9-cell wrap fits 320 with no
  clip, 393 geometry unchanged.
- [x] **N04b — rows verified, keep.** `ConfigRow` 44-min ✓, stepper geometry + disabled states ✓,
  mode captions ✓, `Hairline` weight via NX03. `key={index}` on grid cells: sets only
  append/truncate here (no reorder/remove in weighted config) — safe, record (workout-editor EX04
  same rationale). No change.

## N05 — Detail (`detail-card/`)

- [x] **N05a — subhead caps + counter verified.** `SubHead` caps via NX01 (2 sites); counter 9/500 +
  `maxLength` + live count ✓ (spec line 91 `68 / 280` ✓). Wells: 80-note/48-link min-heights, rx16/14,
  1.6 ember focus vs 0.9 neutral ✓ (spec S5 keyboard panel line 462: 1.6 `br` ✓). `FieldInput`
  12.5/17/500 zero-padding ✓; link row (`keyboardType: url`, no-autocaps/correct ✓), glyph ink via
  tested `linkGlyphColor` ✓, validity hint ✓. Placeholder inks per mode ✓. Accept with NX01/NX02.

## N06 — Options (`options-card/`)

- [x] **N06a — verified, keep.** Rest row (52-min, chip `min-width: 52`×22 + tabular 11/600 value ✓
  spec lines 102–103, chevron ✓) opens the sheet ✓; superset switch row with clamped `Pairs with`
  caption ✓; conditional rest removal when timers off ✓ (spec S5 panel 1 — including the honest
  explanatory caption row the reference draws, page-verification line 441 ✓); toggle reuse ✓.
  `Hairline` weight via NX03. No change; recorded so options aren't reworked.

## N07 — Resistance (`resistance-card/`)

- [x] **N07a — selected label invisible on light.** `ResistanceLabel` (styles 30–37) renders `#FFFFFF`
  when selected **both modes** — on the pale light wash (`selectedWell` light `rgba(232,84,47,0.08)`)
  white-on-wash fails contrast badly; `ResistanceBody` selected `#98989F` both modes has the same
  light problem. Spec canvases are dark-only, so this is a genuine light-mode bug, not a deviation.
  Fix: selected label → per-mode primary (`#FFFFFF` / `#1C1C1E`), selected body → per-mode
  secondary/caption. Unselected radio `#C7C7CC` light ✓, ring/dot ember pair with `emberOnLight`
  ✓ keep. Rows (64-min, 8-inset well, rx16 ✓ spec lines 112–117), explanations with bodyweight
  interpolation ✓. Accept: selected row legible + AA-aspiring both modes.
- [x] **N07b — radio block duplicated.** `Radio`/`RadioDot` (styles 47–63) re-implement primitives'
  `RadioRing`/`RadioDot` (styles 280–301) with the same geometry but separate code — two sources for
  one control. Fix: reuse the primitives (same 20/10 geometry, same ember logic). Accept: one radio
  implementation.

## N08 — Progression (`progression-card/`)

- [x] **N08a — collapsed row + rules verified, keep shape.** 56-min row, clamped summary ✓ (spec
  lines 129–133); `active` ember edge on expand ✓ (spec line 389 `br` .30 — code flat ember .30:
  same honest simplification as workout-editor E08b, record keep); 36-high segmented axis/scope ✓
  (spec lines 395–400); `DeleteRule` 44-min red ✓; dashed `AddRuleButton` (NX06 verdict); `NoLoadWarning`
  copy ✓. `RuleTitle`/`RuleHeader`/`RuleBlock` rhythm ✓. `key={index}` on rules: blocks hold no local
  state (all controlled) → safe, record. Segmented labels 12 vs spec 12.5 (S1 line 64: 12.5/−0.15) —
  align **all** `SegmentLabel` instances to 12.5/−0.15 in one place (primitives fix covers N03's type
  picker + N09's target/unit pickers too). Accept: one label size everywhere.
- [x] **N08b — warning ink + suffix case.** `NoLoadWarning` hardcodes `#ffb340` both modes (styles
  113–121) — poor on white; fix per-mode (dark keep, light deep amber e.g. `#A05A00` — verify AA on
  device). `weightSuffix` `lb` via NX05. Accept: warning legible both modes.

## N09 — Cardio sets (`cardio-set-card/`)

- [x] **N09a — HMS + target row overflow at ≤360.** `TargetLabelWrap` 90 fixed + `UnitWrap` 88 fixed =
  178 fixed against a 288pt inner row at 320; the HMS trio needs ≈248 (3×76 steppers + colons) but
  gets 288−178 = 110 → severe overflow; at 360 (328 inner) it overflows ≈10pt too. `TargetLabel`
  unclamped. Fix: label wrap → `flex-shrink: 1` + `numberOfLines={1}` on the label, `UnitWrap`
  88→80 (42-thumb segmented still fits: 2×~38), HMS value `min-width` 32→24 (14px tabular `00` ≈
  17pt — verify). Keep 90/88 at ≥393 via `min-width` instead of `width` so wide screens don't change.
  Distance row (stepper + unit picker) inherits the fix. Accept: 320/360 no clip, 393 pixel-identical.
- [x] **N09b — track columns too rigid.** `TrackColumnLeft` 196 fixed (styles 132–138) leaves the right
  column ≈92pt at 320 — DE labels (`Widerstand`) + 44 toggle overflow. `TrackLabel` unclamped.
  Fix: columns `flex: 1` each (50/50; 393 geometry ≈ unchanged: 180/180 vs 196/165 — record the 16pt
  left-column shift as accepted), labels `numberOfLines={1}` + `flexShrink: 1`, cells keep 40-min
  (wrap-safe vertically). Spec label positions (lines 289/314: x=36/200) become proportional — same
  accepted shift. Accept: DE labels ellipsize, toggles never squeezed, 393 visually identical.
- [x] **N09c — colon + subhead + trash verified, adjust two inks.** `HMSSub` 8/700/+.5 ✓ (spec line
  312); `HMSColon` uses tertiary `#6C6C70` vs spec `#48484A` (lines 308/310) — align to `#48484A`
  dark (light keeps `#AEAEB2` tertiary, visible ✓). `SubHead` caps via NX01. `SetHeader` 44-min +
  `TrashButton` 24 + slop-10 ✓, trash ink via NX04. `SetTitle` 13.5/600/−0.2 — spec Set 2 shows
  650 (line 301) vs Set 1 600 (278): the 650 is emphasis drift in the mock, keep 600 per the RN
  non-hundred precedent (session W-code precedent) + record. `RestValueRow` 44 pressable ✓.
  Accept: colons + trash per decision, rest kept.

## N10 — Rest sheet (`rest-sheet/`)

- [x] **N10a — handle invisible on light + chip row overflow at 320.** `SheetHandle` white .22 both
  modes (primitives styles 398–406) vanishes on the white sheet — fix mode-aware (`#787880`-family
  on light). `ChipRow` (rest-sheet styles 69–76) centers 5 chips totaling ≈297pt against ≈248pt
  inner at 320 → clipped edges; fix `flexWrap: wrap` + row gap (wraps 3+2 on narrow, single row on
  393 — verify 393 stays single-row). `Sheet` rx24/bg/border/inset-pad ✓, title 15/600/−0.3 ✓ (600
  precedent), 40/−1.6 tabular value ✓ (spec line 377), 44 big steppers ✓, 28 chips + slop-8 ✓,
  apply-all 50 brand + shadow ✓ (spec lines 382–384; `BRAND_GRADIENT` cross-import from the feed
  composer — verify it equals `br`, or repoint to home `brand`; record). Backdrop .55 ✓,
  reduced-motion `none` ✓, radio roles on chips ✓, adjustable role on stepper ✓. Accept: handle
  visible + chips fit 320, 393 unchanged.
- [x] **N10b — preset labels verified, keep.** `30s`/`2m` no-space format matches spec line 381
  exactly (SI-unit keep per NX05). Clamp 15..600 + 15-step snap ✓. `selectedPreset` by minRest
  equality ✓. No change.

## N11 — Type-switch dialog (`type-switch-dialog/`)

- [x] **N11a — confirm ink + action height.** `ConfirmText` hardcodes `#ff6b60` both modes (styles
  92–99) — light needs `#D70015` (diff-save/session destructive precedent). `DialogActionButton`
  52-min vs spec 72-tall actions (spec lines 365–368: divider 180, buttons to 252) — 52 still clears
  44 with room; keep 52, record (iOS alerts sit ≈44; taller would push the dialog). Copy pipeline
  (`typeSwitchCopy` honest lost/kept lines ✓), `role="alert"` ✓, dividers via NX03, title/body/cancel
  inks verified ✓. Accept: red-on-light fixed, height decided in writing.

## N12 — Primitives, glyphs, motion

- [x] **N12a — `CheckGlyph` usage unverified.** Exported default `#30D158` (primitives 116–118) with
  no in-feature call site found during audit (also see the duplicate-name glyphs in feed/trends/
  plan-diff — different components, not shared). Fix: use it with a mode-aware color or delete the
  export (dead exports invite drift). Accept: no dead glyph exports in this feature.
- [x] **N12b — motion + roles verified, keep.** Modal `fade` / sheet `slide` with reduced-motion
  `none` ✓; thumb/segment timings live under the app motion switch via `useAppReducedMotion` in
  gesture builders ✓; segmented `tablist`/`tab` roles + selected states ✓; stepper `adjustable` +
  increase/decrease labels ✓; toggle `switch` + locked `switch-disabled` ✓; locked row never
  pressable ✓ (spec decision 3). Segmented label size folds into N08a. No change.

## Patch order (suggested, smallest-risk first)

1. NX01 caps + NX05 locale (`lb`, `toLocaleUpperCase`, spec-test sync).
2. N07a selected inks + N08b warning ink + N11a confirm ink + NX04 glyph inks (all mode-aware color,
   one review pass).
3. E07-style spec values: N01a title, N08a segment labels, N09c colon/SetTitle note, N03b caret,
   N09a/N09b responsive rows, N10a handle/chips.
4. NX02 font migration + NX03 hairlines + N03c accent dedupe + N07b radio dedupe + E00Aura/N00a hook.
5. N12a dead glyph + NX06 verdict + device-only verifications (320 chips/HMS/tracks, Android dash,
   keyboard, landscape).

## Implementation notes (2026-09-23 — read before device pass)

- **Audit count correction:** 11 caps sites fixed (8 `MicroLabel` + 2 detail `SubHead` + 1 cardio
  `TrackHead`), not the 10 estimated at audit time.
- **N07a hierarchy:** selected body on light is caption `#8E8E93`, not secondary (`#1C1C1E` would
  collide with the selected label) — dark keeps spec `#98989F`.
- **N09a revision:** `UnitWrap` stays 88 (spec) — the label absorbs narrowing instead
  (`min-width: 64` + ellipsis). HMS value floor 28 (not 24): `00` at 13px tabular ≈ 17pt, 24 would
  touch the 22pt buttons' padding.
- **N03c direction:** deleted the token duplicate, kept the styled-local pairs (they encode designed
  bg/fg combinations, not bare colors).
- **N07b swap verified identical:** primitives `RadioRing`/`RadioDot` carry the same 20/10 geometry
  and ember logic (including `emberOnLight`) — zero visual change.
- **N12a deletion verified:** the editor `CheckGlyph` had no in-feature call site (feed/trends/
  plan-diff ship their own); export removed from component + barrel.
- **NX05 spec sync:** bodyweight assertion is now exact (`toBe('177.7 lb')`), stronger than the old
  `toContain`.
- **NX06 open:** Android dashed-border verdict still needs a device.
- **E00a keyboard:** tap-to-focus avoidance unverified without a device; `KeyboardAwareScrollView`
  only on a failing verdict. Focus magic numbers are now named constants.
- **No verification runs yet by user request** (`typecheck`/`lint`/`vitest` skipped). Run them plus
  `exercise-editor-logic.spec` / `dismiss-update.spec` before the device pass.

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Batch 1 caps (11 sites) + `lb` units + casing + spec sync | NX01, NX05 | code review only |
| 2026-09-23 | Batch 2 selected/warning/confirm/glyph inks + dead glyph removal | N07a, N08b, N11a, NX04, N12a | code review only |
| 2026-09-23 | Batch 3 title/segment type + caret + responsive rows + handle/chips | N01a, N08a, N09a/b/c, N03b, N10a | code review only |
| 2026-09-23 | Batch 4 font migration + hairlines + accent/radio dedupe + aura hook | NX02, NX03, N03c, N07b, N00a | code review only |
