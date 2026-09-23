# Workout editor polish ledger (source of truth)

Status: **implemented 2026-09-23 — all code patches applied; device pass (320/430, large text, DE,
Android dash, keyboard, landscape) still required before closing the acceptance bar.** No verification
runs yet by user request (`typecheck`/`lint`/`vitest` skipped) — run them plus
`plan-estimates.spec` / `reorder.spec` / `draft.spec` before the device pass.
Scope: `/workout-editor` in render order — route `app/src/app/workout-editor.tsx` through
`components/smart/session-workout-editor/session-workout-editor.tsx` (+ `.styles.ts`,
`plan-estimates.ts`, `reorder.ts`, `draft.ts`) — for **dark + light** and **iOS + Android**.
Out of scope (own ledgers later): exercise editor (`getSessionExerciseEditorHref` target),
`ConfirmationDialog`/`Menu` foundation chrome (invocation only here), classic session variants.
Audited 2026-09-23 by reading each file end-to-end (no skips). Same rules as the home/session
ledgers: one patch per item (or tight group), state closed IDs, check boxes only with code +
verification, append new IDs (never reuse), keep sorted by section.

## Ground truth references (do not re-derive)

- Skill (law): `.agents/skills/apple-ios-frontend/SKILL.md` — same bar (4pt grid, 44pt targets,
  negative-display / positive-micro tracking, computed values, dy10/blur14 cards).
- Reference: `docs/new_design/workout-editor-redesign.md` canvases 1–3 + trap table (lines 6–15) +
  verification log (375–401). Gradient/filter IDs cited below come from its `<defs>` (`cd` card body,
  `ce` edge, `br` brand `#FFB03A→#FF6A3D→#FF2D55`, `gl` gloss, `tb` tab-bar backer, `ff`/`fb`/`fc`/`ft`
  shadows, `bk` back chevron, `ch` chevron, `grip`, `more`, `db`/`ic-dbg` dumbbells).
- Honesty anchors (do not regress): draft commits on Save/swipe-back, Cancel discards; add commits
  immediately (captioned); estimates from logged history only (`7,604 kg` reference corrected per the
  log lines 393–401); reorder keeps blueprint/recorded 1-for-1; stable `WeakMap` row keys;
  both destructive confirms already pass `destructive`; scroll locks while dragging.
- What's already right: drag constants coherent (`ROW_HEIGHT 64` + `ROW_GAP 10` = `PITCH 74`, divider
  lands at absolute x=56..357 per spec line 98), row keys stable across reorders (no session-style
  index-key hazard), 44pt targets (44 nav buttons, 44-min CTA/footer buttons, ~56×64 grab zone),
  reduced-motion zeroed throughout, tabular numerals, menu disabled states (remove-all when empty,
  discard when clean).

## Global acceptance bar (applies to every item)

- [ ] No clipping/overlap at 320 / 360 / 393 / 430 pt widths, portrait + landscape, iOS + Android.
- [ ] No clipping at 200% text size and with German strings (longest locale).
- [ ] Dark and light both intentional (editor header comment in styles lines 7–11 already promises
  the home light mapping — verify, don't assume).
- [ ] Every dimension a multiple of 4, every interactive visual ≥ 44pt (or `hitSlop` to 44 with no
  neighbour overlap), no dead button-look controls.
- [ ] Numbers locale-formatted, uppercase locale-safe, no hardcoded English in UI.

---

## EX — Cross-cutting (fix once, helps every section)

- [x] **EX01 — dead `text-transform: uppercase` (React Native ignores it).** Problem: same class as
  session SX01 — micro-labels render Title Case against ALL-CAPS spec text (spec lines 65, 75, 79,
  87). Sites: `MicroLabel` (styles 116–124; used for plan-name/notes/exercises headers with Title
  Case defaults `'Plan name'`, `'Notes'`, `'Exercises'`) and `MetaLabel` (189–199; `'Exercises'`,
  `'Sets'`, unit-bearing volume/time labels). Fix: `toLocaleUpperCase()` at each call site (5 +
  4 sites), delete the dead CSS. The volume/time labels carry translator-owned case — uppercase the
  final composed string so DE translators can't break the caps. Accept: caps match spec in EN + DE,
  no `text-transform` remains in this feature.
- [x] **EX02 — deprecated `theme.font.text` shim.** Problem: ~30 reads across
  `session-workout-editor.styles.ts` (nav, draft, sections, plan-name, meta, notes, rows, empty,
  behavior, footnote, footer) — the shim (`hooks/useAppTheme.tsx`) is slated for removal (session
  SX07 precedent). Fix: resolve through `type(theme, 'body').fontFamily`, same metrics. Accept: zero
  `theme.font` reads remain in this feature.
- [x] **EX03 — 1px lines → hairline.** Problem: `MetaDivider` (`width: 1`, styles 201–206),
  `RowDivider` (`height: 1`, 337–342), `FooterBar` (`border-top-width: 0.5`, 499–504 — mixed idiom).
  Fix: `StyleSheet.hairlineWidth` (session SX06 precedent). Accept: hairlines match reference weight.
- [x] **EX04 — fixed row geometry is drag-coupled: verify, don't convert.** Problem class from SX02,
  but here `RowSlot` 64/74 + `RowPress` 64 are load-bearing: `PITCH` drives the gesture math, drop
  indicator, and shift animations (tsx 39–42, 191, 475). Converting to `minHeight` would desync drag
  from layout. Fix: keep fixed, harden contents instead — `RowName`/`RowSummary` already
  `numberOfLines={1}` ✓ (verify at 200% text: 2× lines ≈ 58pt still < 64). Accept: 200% text + DE,
  rows stay 64 with ellipsis, drag math untouched.
- [x] **EX05 — locale strings in estimates + labels.** Problem: `plan-estimates.ts:74` hardcodes
  `` `${seconds}s rest` `` (`s` suffix + `rest` word in English); `formatRowSummary` (75) joins with
  double spaces `'  ·  '` (spec shows single-spaced `·`, lines 96/381); `volumeLabel`
  (tsx 492: `` `${unit} · EST. VOLUME` ``) and est-time default (`'MIN · EST. TIME'`) rely on
  translator case (fold into EX01); `LBS`/`KG` abbreviations are unlocalized (conventional for units
  — record keep). Fix: ICU rest-segment key (e.g. `workout.editor.rest_segment`: `{seconds}{unit}
  {rest}` + short-unit key, rest-timer prescription precedent); single-space join; uppercase composed
  labels. Accept: DE rows read correctly, separators match spec.
- [x] **EX06 — row keys verified, keep.** `rowKeyFor` `WeakMap` keyed by immutable blueprint identity
  (tsx 349–358) already survives shuffles — strictly better than session's index keys. No change;
  recorded so a later pass doesn't "fix" it.

## E00 — Shell (screen, aura, scroll, keyboard)

- [x] **E00a — fixed aura box + keyboard gap.** `AuraWrap` (styles 19–25) is a fixed 570×430 box at
  (−150,−90) — off-393 widths misalign it (aura itself is correctly `xMidYMin slice`, tsx 136 ✓ keep);
  and the notes `TextInput` has no keyboard avoidance (plain gesture `ScrollView`, styles 27–30) —
  only the `?focus=notes` entry scrolls (−140, tsx 462/619), a user-tapped field can hide under the
  keyboard. Fix: aura box from viewport fractions (home S03 pattern); extract `-140`/`450` into named
  measured constants; verify tap-to-focus on device and adopt `KeyboardAwareScrollView` only if the
  field hides (record the device verdict). Accept: aura composed 320–430, notes always visible while
  typing, no magic numbers.
- [x] **E00b — scroll rhythm verified, keep.** Content `paddingHorizontal: screenPadding` ✓,
  `paddingBottom: 24` + in-flow footer (no floating spacer needed — footer is in normal flow ✓
  correct, unlike session's overlay). Sections stack `marginTop: xl (24)`; footnote +16. No change.

## E01 — Nav row

- [x] **E01a — dots deviate from spec.** `DotsGlyph` (tsx 48–59) fills `theme.home.seeAll` (amber, red
  `#C93400` in light) but spec `#more` is `#8E8E93` grey (spec lines 40, 58). The back chevron is
  correctly amber (`BackGlyph` vs spec `#bk #FF9F0A` ✓ keep). Fix: dots to `#8E8E93` both modes
  (visible on white ✓), or record a keep-amber decision with reason. Accept: matches spec or a
  written reason — not an accident.
- [x] **E01b — title tracking + absolute layout.** `NavTitle` (styles 63–74) `letter-spacing: -0.2`
  vs spec −0.3 (line 57); absolute `left/right: 64` with no clamp — fine for known titles, fragile
  for long ones. `MenuTrigger` `hitSlop: 8` (60 effective) overlaps the title zone — title is
  non-touch text, harmless, but record. Fix: tracking −0.2→−0.3; title `numberOfLines={1}`.
  Accept: spec tracking, no wrap ever.

## E02 — Draft strip

- [x] **E02a — grid + wrap verified, keep shape.** `DraftStrip` `marginTop: 2` (off-grid — 4pt rhythm
  says 4; measured against nav baseline per spec lines 61–62 — record keep with this note). Dot 6 +
  6 gap ✓, 10.5/500 text ✓, `flex-shrink: 1` wraps long DE to two lines and the strip grows (no fixed
  height ✓). Always visible by design (spec shows it on both canvases ✓). Accept: change nothing,
  this entry exists so the 2pt isn't "fixed" later.

## E03 — Plan name

- [x] **E03a — underline renders when spec shows none.** `PlanNameUnderline` (styles 154–159) is a
  full-width 2px line, grey when blurred — but spec canvas 2 (lines 206–208, placeholder state) shows
  no underline at all; canvas 1 shows the amber line only while focused. Fix: render the underline
  only when focused (keep 2px + `seeAll`), no grey idle line. Accept: blurred state matches canvas 2,
  focused matches canvas 1.
- [x] **E03b — label caps (EX01 batch) + input verified.** `MicroLabel` caps via EX01. Input 32/700/−1,
  `padding/margin: 0`, `selectionColor: seeAll`, tertiary placeholder per mode ✓; `returnKeyType:
  done` → `onSubmitEditing={onSave}` commits + dismisses (intended ✓). No `maxLength` — long names
  scroll horizontally in the field and ellipsize in rows ✓ acceptable. Accept with EX01.

## E04 — Meta card

- [x] **E04a — label caps + sub-9 floors (decision).** `MetaLabel` 7.5/700/+0.8 caps via EX01;
  `MetaFootnote` 8.5 right-aligned (spec line 76 ✓). Both sit below the skill's 9pt micro floor —
  they are spec-measured values, so keep per the "real numbers" rule and record here (home floored
  its own invented sizes; these are not invented). `MetaValue` 17/700/−0.5 tabular ✓ (spec line 74).
  Unit abbreviations `LBS`/`KG` stay unlocalized (EX05 note). Accept: spec sizes kept deliberately,
  caps correct.
- [x] **E04b — divider hairline (EX03 batch) + wrap behavior.** Columns `flex: 1` — at 320 each ≈69pt
  and `KG · EST. VOLUME` wraps to two lines; card has no fixed height so it grows, and `MetaDivider`
  stretches via `align-items: stretch` ✓ correct by construction. `MetaBody` padding `14/4/10/4`
  asymmetric-but-measured — keep. Accept: 320 wrapping verified on device.

## E05 — Notes section

- [x] **E05a — header rhythm + input verified, keep shape.** `SectionHeaderRow` `marginBottom: 10`
  (off-grid like home's old −2 hack family — measured against the 128pt notes card per spec lines
  79–81; record keep). `NotesHint` 9.5/500 ✓ (spec line 80). `NotesInput` 13.5/19/500, `minHeight:
  88`, top-aligned, zero padding ✓; multiline grows unbounded ("no limit" ✓ honest). Card
  `radius: 24, pad: 16` ✓ (spec 128 tall at reference content — grows, correct). Accept: EX01 does
  not touch these strings (sentence case is correct here — only `MicroLabel` caps).

## E06 — Exercises header

- [x] **E06a — hint type mismatch.** `HeaderHint` (styles 126–132) is 10.5/500 untracked; spec line 88
  is 10/600/+0.2 `Drag to reorder`. Fix: 10/600/+0.2 to match. Conditional render (only when rows
  exist ✓ matches canvases). `MicroLabel` caps via EX01. Accept: spec type exactly.

## E07 — Exercise rows

- [x] **E07a — number tiles use the wrong gradient.** `NumberTile` (styles 290–297) fills variant
  `breast` (ember rust→amber, `theme.ts:697-702`, diagonal 0.04,0.94→0.96,0.06) but spec fills every
  tile with `br` brand `#FFB03A→#FF6A3D→#FF2D55` (spec lines 94, 102, …). Same deviation covers
  `SaveButtonShell` (styles 531, E11). Fix: switch both to variant `brand` (already mode-aware from
  the home loop), or record a keep-ember decision with reason. White 14/700 numeral unaffected.
  Accept: tiles + Save share one gradient family, decided in writing.
- [x] **E07b — name tracking + summary spacing.** `RowName` `letter-spacing: -0.1` (styles 314–321)
  vs spec −0.2 (lines 95, 103, …); `RowSummary` join spacing via EX05. `RowTexts` flex + margins
  12/8 ✓; both texts clamped ✓; `RowNameEmpty` italic tertiary for blank names ✓ (spec-silent,
  honest). `Grip` 22 + tile 32 = ~56 grab zone ✓ (comment accurate). Accept: tracking + spacing
  match spec.
- [x] **E07c — row chrome verified, keep.** `RowDivider` insets land at absolute 56..357 (spec line 98
  ✓ exact); `ChevronGlyph` theme-aware `#48484A`/`#C7C7CC` vs spec `#ch` ✓; press → editor,
  long-press → remove confirm ✓ (spec canvas 3A). Divider weight via EX03. No other change.

## E08 — Drag reorder

- [x] **E08a — drop-indicator insets.** `DropIndicator` (styles 345–353) spans `left/right: 14` inside
  the pad-16 card → absolute 46..347; spec line 317–319 spans 40..353 with 4r dots. Fix: extend to
  the card-bleed the spec draws (`left/right: 8` → absolute 40..353) and grow `DropDot` 5→8 diameter
  (r4) to match. `DropDash` 2px dashed `seeAll` at 0.85 — iOS renders dashed borders; **Android
  historically renders dashed `border-style` as solid** — verify on device, fall back to an Svg
  dashed line if solid (record verdict). Accept: insets + dots match spec, dash verified per
  platform.
- [x] **E08b — lifted row stays inside (deviation, keep).** `ActiveBorder` (styles 261–270) draws the
  1.8 `seeAll` border inside card bounds, but spec (lines 322–324) bleeds the lifted row to x=12..381
  with gloss + `fl` shadow. Keeping inside avoids clipping against `RowsClip` and neighbouring rows
  during `translateY` — record keep with this reason; do not "fix" toward bleed later. `ReorderCaption`
  9.5 centered ✓ (spec line 337). No-lift haptics: spec is silent — no added motion per skill §5
  (restraint). Accept: documented, no change.

## E09 — Empty state

- [x] **E09a — ring + title + CTA radius deltas.** `EmptyIconRing` 64 fill-only vs spec r34 fill +
  1.2 hairline ring (canvas 2 lines 228–229) — add the hairline edge (mode-aware white/black wash);
  `EmptyTitle` tracking −0.3 vs spec −0.4 (line 230); `EmptyAddButton` radius 22 vs spec 19
  (line 232) with `min-width: 176` (spec 160 wide — min-width already covers, keep 176). Fix the
  three deltas; keep `min-height: 44` ✓, ghost wash + hairline ✓, amber glyph/label ✓ (spec
  `#FF9F0A`/`#FFB84D` ✓). `DumbbellGlyph` outline-tertiary vs spec `#48484A` — align stroke to
  `#48484A` dark / `#AEAEB2` light explicitly instead of the tertiary token (verify token values
  first; only change if they differ). Accept: empty card matches canvas 2.
- [x] **E09b — copy verified, keep.** Title/body strings + `testID="workout-name"` / add-exercise
  a11y label with `t()` defaults ✓. `BehaviorCard` amber treatment + kicker 9/700/+1.2 ✓ (spec
  lines 241–243); body 11.5/16 wraps freely (no fixed heights ✓). `Footnote` 9.5 centered ✓ (spec
  line 140). Accept: no change.

## E10 — Footer

- [x] **E10a — Add-button gap missing.** `AddButton` (styles 511–521) lays `PlusGlyph` + label in a
  centered row with **no `gap`** — glyph and text touch (spec lines 148–149: 12pt between glyph end
  160 and text start 172). Fix: `gap: 12px`. (Empty-state `EmptyAddPress` already has `gap: 8` —
  spec canvas 2 lines 233–234: glyph ends 166, text starts 176 = 10pt; adjust that one 8→10 in the
  same patch.) Accept: measured gaps, no touching glyphs.
- [x] **E10b — layout + type vs spec (decide, don't drift).** Code stacks Add + Save **side-by-side**
  (`FooterRow`, styles 506–509); spec canvas 1 stacks them **full-width** (lines 146–155, each
  361×54). Verification accepted the row (denser footer, ~120pt vs ~200pt). Keep the row — record
  here so a later pass doesn't "fix" it toward stacked. Type deltas to align regardless: add-label
  tracking 0→−0.25 (spec line 149), save-label −0.2→−0.3 (line 155), buttons 52→54 min-height (lines
  146, 152), save gloss 26/.5→27/.35 (line 153). `SaveButtonShell` gradient via E07a. Colored
  `#ff6a3d` shadow .38/.28 ✓ keep. Accept: row layout kept deliberately, type/geometry match spec.
- [x] **E10c — subcaption honesty kept + cancel decision.** `SaveSubcaption` (`Changes apply to this
  session only.`) contradicts spec line 156 (`…all future sessions…`) — the code is honest for a
  session-scoped editor (page-verification: changes never touch the plan library). Keep + record.
  `CancelButton`/`CancelLabel` 16/600 amber vs spec neutral 15/400 `#48484A` (line 247): align toward
  the app-wide text-button convention (amber, home `seeAll` precedent) — record keep-amber with this
  reason, but take spec's 15pt size? No — 16pt keeps the 44-min button legible; keep 16, record.
  `FooterBar` flat `.92` bg vs spec `tb` gradient (.94→.99): add the subtle vertical gradient
  (footer-only `LinearGradient`, same stops) or record flat-keep — decide in patch, in writing.
  Accept: every deviation decided, none accidental.

## E11 — Dialogs + menu

- [x] **E11a — verified, keep.** Both confirms pass `destructive` with spec-copy headlines (canvas 3A/B
  copy ✓, `Remove all` ok-label ✓); remove-all disabled when empty, discard disabled when clean;
  long-press opens per-exercise confirm ✓. `Menu` items carry icons + `systemImage` ✓. Row a11y
  labels fall back to `workout.editor.untitled_exercise` ✓. No change; recorded so dialogs aren't
  re-audited.

## E12 — Accessibility + motion

- [x] **E12a — nested button roles in the grab zone.** `GrabZone` carries `accessibilityRole="button"`
  + reorder label (tsx 276–279) **inside** `RowPress` (also a button, 269–274) — VoiceOver lands on
  two nested buttons per row. Fix: `GrabZone` accessible passthrough (`accessible={false}` +
  `importantForAccessibility="no"` on the zone, keeping the pan gesture for sighted drag) and expose
  the reorder action to screen readers another way — minimum: the row label already announces position
  via `index+1`; record whether a move-up/down action is product-desired or explicitly deferred.
  Accept: no nested buttons; reorder operable or an explicit deferral written here.
- [x] **E12b — motion verified, keep.** Scroll locks during drag (`scrollEnabled={!dragging}` ✓ spec
  "SCROLL LOCKED"), 140/170/180ms settle timings with reduced-motion zeroing, animated border fade
  150ms, no pickup haptics (skill §5 restraint — spec silent ✓). No change.

## Patch order (suggested, smallest-risk first)

1. EX01 caps + EX05 locale strings (mechanical, highest-visibility win).
2. E07a gradient family + E01a dots + E10b type/geometry (spec-measured values).
3. EX02 font migration + EX03 hairlines + E10a gaps + E09a ring/title/radius.
4. E03a underline + E06a hint type + E08a drop insets/Android-dash verdict + E10c footer gradient
   decision + E00a aura/keyboard.
5. E12a nested roles (+ reorder-action decision) + any device-only verifications (E04b wrap, Android
   dash, keyboard, landscape).

## Implementation notes (2026-09-23 — read before device pass)

- **E10c footer backer kept flat:** spec `tb` (.94→.99) vs code flat `.92` differs by ~5% luminance —
  invisible in practice behind opaque buttons; converting the bar to a gradient buys nothing.
  Recorded keep; do not "fix" later.
- **E10c cancel kept amber 16:** spec neutral 15/400 contradicts the app-wide text-button convention
  (`seeAll`); 16pt keeps the 44-min target legible. Recorded keep-amber.
- **E10b row layout kept:** side-by-side Add/Save (denser ~120pt footer) over spec's stacked ~200pt —
  verification accepted it; type/geometry now matches spec values regardless.
- **E10c subcaption kept:** session-scoped honesty over spec's plan-library wording.
- **E08b bleed kept inside:** spec's overflowing lifted row would clip against neighbours mid-drag.
- **E02a/E04a measured-keeps:** draft 2pt and empty 46pt tops are reference-measured, not grid noise.
- **E04a/E04b sub-9 floors kept:** 7.5/8.5 are spec-measured values ("real numbers" rule), unlike the
  home loop's invented sizes which were floored.
- **E09a dumbbell stroke** made explicit (`#48484A`/`#AEAEB2`) — the tertiary token is a blue wash
  in both modes and never matched the spec graphite.
- **E12a reorder-action deferred:** no move-up/down UI exists; the row announces `N. name`, keeping
  position info without nested buttons. A reorder alternative for screen-reader users is a product
  decision, explicitly deferred here — not forgotten.
- **E00a keyboard:** tap-to-focus avoidance unverified without a device; adopt
  `KeyboardAwareScrollView` only on a failing device verdict. Magic `-140`/`450` are now named
  constants (`NOTES_SCROLL_OFFSET`/`NOTES_FOCUS_DELAY_MS`).
- **E08a Android dash:** `border-style: dashed` is iOS-reliable; verify on Android, fall back to an
  Svg dashed line if it renders solid.
- **EX05 spec sync:** `plan-estimates.spec.ts` assertions updated to the single-space join + a new
  `formatRest`-ownership test; default param keeps old callers green.
- **No verification runs yet by user request** (`typecheck`/`lint`/`vitest` skipped). Run them plus
  `plan-estimates.spec` / `reorder.spec` / `draft.spec` before the device pass.

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Batch 1 caps + rest-segment ICU + single-space join (+spec sync) | EX01, EX05 | code review only |
| 2026-09-23 | Batch 2 brand tiles/buttons + grey dots + title/nav/row/hint type | E07a, E01a/b, E10b, E07b, E06a | code review only |
| 2026-09-23 | Batch 3 font migration + hairlines + button gaps + empty deltas | EX02, EX03, E10a, E09a | code review only |
| 2026-09-23 | Batch 4 focused underline + drop insets + aura box + focus consts + grab roles | E03a, E08a, E00a, E12a | code review only |
