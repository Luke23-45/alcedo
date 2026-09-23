# Session (workout flow) polish ledger (source of truth)

Status: **implemented 2026-09-23 — all code patches applied; device pass (320/430, large text, DE,
native stop buttons, landscape timer) still required before closing the acceptance bar.** Open items
needing a device: W12c (native stop-button 44pt/labels), W11e-landscape + rest-timer landscape verify.
No verification runs yet by user request (`typecheck`/`lint`/`vitest` skipped) — run them plus the
session suites (`session-simulation.spec`, `rest-timer-state.spec`, `session-restore.spec`) before the
device pass.
Scope: the **active** workout flow in render order — route `app/src/app/(tabs)/(session)/session/index.tsx`
through `components/smart/session-component.tsx` (`ActiveSessionView`) and every section it renders —
for **dark + light** and **iOS + Android**. Sections 4–7 of `docs/new_design/workout-flow-dark.md`
(workout editor, add-exercise/search, exercise history, post-workout summary) are **separate pages with
their own ledgers** and are out of scope here, except where named below.
Audited 2026-09-23 by reading each file end-to-end (no skips). Same rules as the home ledger:
one patch per item (or tight group), state closed IDs, check boxes only with code + verification,
append new IDs (never reuse), keep sorted by section.

## Ground truth references (do not re-derive)

- Skill (law): `.agents/skills/apple-ios-frontend/SKILL.md` — same bar as home (4pt grid, 44pt
  targets, negative-display / positive-micro tracking, computed dashes, dy10/blur14 cards).
- Reference: `docs/new_design/workout-flow-dark.md` §§1–3 + light table (lines 941–953). Gradient/filter
  IDs cited below come from its `<defs>` (`cd` card body, `ce` edge, `br` brand, `rs` rest ring,
  `go` done ring, `gl` gloss, `fd`/`tb` footer fade + bar, `db` dumbbell, `ck` check, `ch` chevron,
  `dn` nav chevron, `fc`/`ft`/`fb`/`fr2`/`fs` shadows). Data contract (lines 20–50) + verification log
  (914–933) pin every number; the 00:42-of-60 ring (dash 114.35 of 163.36) is already exact in code.
- Tokens: `components/presentation/workout/session/session-tokens.ts` (`sessionPalette(isDark)` —
  explicit per-mode values, no translucency math). Light deltas for this flow come **only** from the
  spec light table, not from home's light mapping.
- Container: `components/smart/session-component.tsx` (`ActiveSessionView` 65–126, active wiring
  128–406). Classic/read-only path (408–468, Paper Cards + `ItemList` + `PageActions`) is **legacy
  scope**: logic-verified per `docs/new_design/page-verification.md`, design-frozen until its own pass.
- What's already right (do not regress): computed ring dashes (`rest-timer.tsx:102`), exact control
  gaps (−15/+15/Skip 8/12, paused resume+10/+8 per spec lines 188–193, 335–340), tabular numerals on
  clocks/values, `hitSlop`-to-44 on all timer controls, reduced-motion handling in `use-pulse.ts`,
  honest AVG BPM `SampleBadge`, the 44pt tab fade (`BottomFade`, spec `fd`), the deliberate 30px set-row
  density trade-off (page-verification: primary log action still meets 44 via `hitSlop={11}`).

## Global acceptance bar (applies to every item)

- [ ] No clipping/overlap at 320 / 360 / 393 / 430 pt widths, portrait + landscape, iOS + Android.
- [ ] No clipping at 200% text size and with German strings (longest locale).
- [ ] Dark and light both intentional (spec light table applied, no dark-only ink on light cards).
- [ ] Every dimension a multiple of 4, every interactive visual ≥ 44pt (or `hitSlop` to 44 with no
  neighbour overlap), no dead button-look controls.
- [ ] Numbers locale-formatted, uppercase locale-safe, no hardcoded English in UI.

---

## SX — Cross-cutting (fix once, helps every section)

- [x] **SX01 — dead `text-transform: uppercase` (React Native ignores it).** Problem: micro-labels rely
  on CSS uppercasing that never runs, so they render Title Case against an ALL-CAPS spec. Verified
  against `en.json` (values are Title Case): `elapsed-card.styles.ts:15-25` (`Elapsed` vs spec ELAPSED),
  `stat-strip.styles.ts:61-72` (`Sets`/`Volume kg`/`Reps`/`Avg bpm` vs SETS/VOLUME KG/REPS/AVG BPM),
  `exercises-header.styles.ts:12-21` (`Exercises` vs EXERCISES),
  `session-footer.styles.ts:39-47` (`Rest timer` vs REST TIMER). (Timer-pane status has the same dead
  rule — covered in W12.) Fix: locale-uppercase at the call site (`toLocaleUpperCase()`, home
  precedent) and delete the dead CSS so no future reader trusts it. Accept: labels match spec caps in
  EN + DE, no `text-transform` remains in session styles.
- [x] **SX02 — fixed heights → `minHeight`.** Problem: cards lock height so large text / DE / wrapped
  copy can only overflow. Files: `elapsed-card.styles.ts:4-7` (102), `stat-strip.styles.ts:4-7` (68),
  `exercise-section.styles.ts:9-13` (CardHeader 22), `potential-set-counter.styles.ts:16-20` (SetRow 32),
  `session-footer.tsx:34` (idle card 88), `rest-timer.styles.ts:117-123` (CardRow 88). Button heights
  (BrandButton `height` prop, chips, pills) stay fixed — single-line labels by contract — except where
  named (W06 chip, W09 idle). Fix: `min-height` on outer rows/cards, keep inner rhythm. Accept: 200%
  text + DE, no clip at all widths.
- [x] **SX03 — fixed row widths + missing line clamps.** Problem: set-row metric widths are 393-locked
  and several texts can wrap inside fixed-height rows: `potential-set-counter.styles.ts:40-64`
  (Weight 78 / Reps 65 fixed; `WeightText` no `numberOfLines`), `PrevText` (`66-76`, flex but no clamp —
  `prev 12 · 22.5` wraps and clips in the 32pt row at 320), `exercise-section.styles.ts:45-68`
  (`ChipPill` `min-width` 93/79 + `ChipText` no clamp — DE chip text wraps inside the 20pt pill).
  Fix: `numberOfLines={1}` on Weight/Reps/Prev/Chip texts, keep fixed metric widths (reference pitch),
  chip keeps `min-width` but grows via padding (coach precedent). Accept: 320 + DE, rows stay 32pt.
- [x] **SX04 — light deltas missing vs spec light table.** Problem: several inks are dark-only while the
  spec light table (lines 941–953) deepens them: rest-timer PAUSED `#FFB84D` (`rest-timer.tsx:286`) and
  READY `#C3F53C` (`:306`) chip text both modes; `session-tokens.ts:92-98` brand `from/mid/to` fixed
  (home light brand is `#FFA312→#FF5A3C→#E8003F` — record an explicit keep-or-align decision, the flow
  light table does not list brand); done-ring `go` `#7BE000→#D6FF52` fixed both modes (table silent —
  same decision). Handled already and correct: rest progress/track, check fills, dim states, footer
  tokens, empty tokens. Fix: mode-aware PAUSED/READY chip ink; written keep-or-align notes for brand +
  done-ring. Accept: light screenshots show luminous chips/rings, decisions recorded here.
- [x] **SX05 — locale safety.** Problem: `.toUpperCase()` on localizable text
  (`exercise-section.tsx:63` DONE chip; `rest-timer.tsx:286,306` PAUSED/READY);
  `rest-timer.tsx:213-217` builds `REST · 60S PRESCRIBED` from ordered parts + hardcoded `S` suffix
  (word order frozen to EN, seconds unit untranslated — needs a single ICU string, e.g.
  `rest_timer.label.prescription`); hardcoded English a11y/copy: `session-nav.tsx:18` (`Back`),
  `dots-trigger.tsx:14` (`More options`), `exercise-notes-display.tsx:22` (`Last time: ` prefix).
  Fix: `toLocaleUpperCase`, one ICU prescription string (add `en.json` key, other locales fall back),
  Tolgee keys for Back / More-options / Last-time. Accept: DE + TR device locales correct.
- [x] **SX06 — 1px lines → hairline.** Problem: `height: 1px` divider/hairline renders heavy on 3x iOS:
  `stat-strip.styles.ts:23-27` (40pt column dividers), `exercise-section.styles.ts:70-75` (card divider),
  `session-footer.styles.ts:12-15` (footer hairline). Fix: `StyleSheet.hairlineWidth` (weekly-challenge
  precedent). Accept: hairlines match reference weight on device.
- [x] **SX07 — deprecated `theme.font.text` shim.** Problem: every session style reads
  `theme.font.text`, a deprecated shim (`hooks/useAppTheme.tsx:33-42`) slated for removal — session
  would break under the migration. Fix: resolve through `type(theme, …)` (home `HomeText` precedent)
  per file, same metrics. Accept: zero `theme.font` reads remain in `presentation/workout`.
- [x] **SX08 — index keys.** Problem: `key={index}` reorders state when rows shift:
  `session-component.tsx:116-118` (exercise list), `weighted-exercise.tsx:51-55` (sets),
  `cardio-exercise.tsx:66-76` (sets, `key={setIndex}`). Set rows/editors hold dialog state
  (`potential-set-counter.tsx:128-137`). Fix: key by stable identity (movement/blueprint key + set
  position fallback — record the chosen key). Accept: add/remove mid-list never misattributes editor
  state (regression test).
- [x] **SX09 — session auras distort + misalign.** Problem: `session-auras.tsx:29` renders
  `viewBox 0 0 393 852` with `preserveAspectRatio="none"` inside scrolling content — circles become
  ellipses off-393 widths and the fixed `cy` (150/480) drifts on long sessions (home fixed this with
  `slice`). Fix: home S03 pattern (`xMidYMid slice`, viewport-fraction positions). Accept: circular
  auras 320–430, asymmetric composition kept.
- [x] **SX10 — Paper-vs-Alcedo material split.** Problem: legacy Paper surfaces inside Alcedo cards —
  `session-component.tsx:188-209` notes `Card` + `271-298` bodyweight `Card` (flat `contained`, no
  edge/gradient/shadow), `potential-set-counter.tsx:203-245` weight `WeightDialog` + Paper `Chip`s,
  `cardio-value-tile.tsx:68-76` flat tiles (`fill.secondary/quaternary`, rx10), `CardioTimerButton`
  (`cardio-exercise.tsx:281-294`, Paper `contained-tonal`), `TimerPane` glass (`timer-pane.tsx:51-63`,
  different chrome from the Alcedo rest-timer card it sits beside in the same footer slot). Fix: bring
  notes/bodyweight tiles onto `HomeCard` + session radius/shadow; restyle cardio tiles/buttons to
  session-tokens; unify `TimerPane` chrome with the rest-timer card (or record an explicit keep-glass
  decision). Classic path (`session-component.tsx:422-468`) stays frozen — out of scope. Accept:
  side-by-side screenshots, one material language per state.

## W00 — Shell / container (`session-component.tsx`, route `session/index.tsx`)

- [x] **W00a — no screen padding discipline.** `ActiveSessionView` (84–126) passes no
  `scrollStyle`/`contentContainerStyle` — every section carries its own hardcoded 16 (elapsed
  `CardWrap`, strip `StripWrap`, exercise-section root) while `ExercisesHeader` uses 24 and the scroll
  has no gap/bottom rhythm (home passes padding + `gap: md` + 72 bottom). Fix: single source —
  `scrollStyle paddingHorizontal: screenPadding`, content `gap: md`, bottom clearance for the floating
  footer fade; sections drop their own horizontals to 0 (header keeps its 24↔16 optical if measured).
  Accept: uniform 16/12 rhythm, last exercise clears the footer fade at all widths.
- [x] **W00b — notes/bodyweight Paper cards.** `session-component.tsx:188-209,271-298` (`mode="contained"`
  Paper, `marginHorizontal: screenPadding`). Fix: SX10 (HomeCard treatment, keep behavior). Accept:
  notes/bodyweight read as session cards both modes.
- [x] **W00c — finish-dialog copy path.** Route `session/index.tsx:64-71` (`ConfirmationDialog` without
  `destructive` — finishing is not destructive, correct) vs exercise-remove (W14). No change; recorded
  so the dialog audit is complete.

## W01 — SessionNav (`session-nav/`)

- [x] **W01a — hardcoded "Back" label.** `session-nav.tsx:18` (`accessibilityLabel="Back"`). Fix: Tolgee key
  (SX05 batch). Accept: screen reader speaks the locale.
- [x] **W01b — geometry verified, keep.** Row 52, 44pt targets, symmetric ±10 optical margins, centered
  15/600/−0.3 title with ellipsis, `#8E8E93` chevron/dots per spec lines 95–97. The down-chevron glyph
  matches reference `#dn` (dismiss semantics on a tab root). No change; recorded so nav is not
  re-audited later.

## W02 — ElapsedCard (`elapsed-card/`)

- [x] **W02a — fixed 102 card.** `elapsed-card.styles.ts:4-7` (`CardWrap height: 102`). Content budget
  21+12+8+50 = 91 + 11 = 102 — zero slack; 42pt timer at 200% text overflows. Fix: SX02
  (`min-height: 102`). Accept: card grows, LIVE pill stays pinned.
- [x] **W02b — dead uppercase + fragile optical centering.** `Label` (`15-25`): dead `text-transform`
  (SX01) + `margin-right: 33` compensating the LIVE pill width — pill width varies by locale
  (`LIVE`→`EN DIRECT`+), breaking the x=180 centering (spec line 106). Fix: SX01 for caps; measure the
  pill or accept true-center (record decision — true-center is 29pt off at most, vs broken-by-locale).
  Accept: EN + DE labels centered within 4pt of spec.
- [x] **W02c — pulse verified, keep.** `use-pulse.ts` 1600ms/0.25 matches spec `1.6s values 1;.25;1`
  (spec line 104); reduced-motion freezes at 1. Tabular 42/−1.6 `formatElapsed` h:mm:ss past the hour.
  No change.

## W03 — StatStrip (`stat-strip/`)

- [x] **W03a — fixed 68 strip.** `stat-strip.styles.ts:4-7`. Fix: SX02 (`min-height: 68`). Accept: wrapped
  labels (W03b) grow the strip instead of clipping.
- [x] **W03b — AVG column overflows at 320.** `LabelRow` (54–59, `gap: 4`) holds `VOLUME KG` (~50pt at
  8px) + compact `SampleBadge` (~40) = ~94 vs ~71pt column ((320−32−3)/4). No wrap, no shrink. Fix:
  label `numberOfLines={1}` + `flexShrink: 1`, badge pinned (activity-rings precedent); or stack badge
  under the label (record decision). Accept: 320, no overlap, badge always visible.
- [x] **W03c — dead uppercase + 1px dividers.** Labels (SX01), `DividerLine` 1×40 (SX06). Reference
  dividers at quarter points (spec line 112) — flex columns + 3 lines approximate; record accept.
  Fix: SX01 + SX06 batch. Accept: caps + hairline weight match spec.
- [x] **W03d — values verified, keep.** 16/700/−0.4 tabular, 12/600 suffix, dimmed `0/0/—` empty state,
  volume via `localeFormatBigNumber` (locale-aware ✓), `avgBpm '128'` badged sample ✓. No change.

## W04 — EmptySession (`empty-session/`)

- [x] **W04a — fixed CTA + loose top rhythm.** `empty-session.tsx:38-49` (`BrandButton` 241×48 fixed;
  fits 320 today: 241 < 288, but DE `Übung hinzufügen` + 200% text wraps inside fixed 48 → clip) and
  `empty-session.styles.ts:4-8` (`padding-top: 46`, off-grid). Fix: CTA `min-width: 241` + label
  `numberOfLines={1}` (BrandButton W10), top padding onto the 4pt grid (44/48) with the 144 illustration
  centered per spec lines 261–266. Accept: 320 + DE + 200% text, grid-clean.
- [x] **W04b — copy/illustration verified, keep.** Dashed 144 illustration (`4 7` dash per spec line 263),
  19/600 title (spec-650→600 RN note kept), 12.5 body, `testID="empty-session-add-exercise"`. No change.

## W05 — ExercisesHeader (`exercises-header/`)

- [x] **W05a — dead uppercase + off-grid bottom.** `exercises-header.styles.ts:4-10` (`margin-bottom: 7`,
  not a multiple of 4; reference header baseline 316 → cards 326). Title caps dead (SX01). Fix: SX01
  for caps; `margin-bottom: 7→8` unless the 7 measures exactly against card top on device (record).
  24px horizontal matches spec x=24 — keep. Accept: grid-clean, caps correct.
- [x] **W05b — count verified, keep.** `flex: 1` right-aligned tabular `5 of 6` (`{done} of {total}` ICU
  ✓). No change.

## W06 — ExerciseSection card (`exercise-section.tsx` + `.styles.ts`)

- [x] **W06a — fixed header row + unclamped chip.** `CardHeader height: 22` (styles 9–13) with 20pt pill
  + 14.5/20 name; `ChipPill min-width 93/79` (45–47) + `ChipText` no clamp — DE chip text
  (`3 × 12 · FERTIG`) wraps inside the fixed pill. Name ellipsizes correctly (`numberOfLines={1}` ✓)
  but surrenders to the fixed chip at 320 (name lane ≈ 122pt for `Triceps Rope Pushdown`). Fix: SX02
  header → `min-height: 22`; chip keeps `min-width`, grows via padding, text `numberOfLines={1}`
  (coach-button precedent). Accept: 320 + DE, chip never wraps, name ellipsizes.
- [x] **W06b — Add Set row fragility.** `AddSetRow height: 26` + `align-items: flex-start` (82–89) with
  `AddSetLabel margin-top: -2` optical (91–101, flex:1, no clamp) — wrapped label clips in the fixed
  row; `hitSlop={{top:6,bottom:6}}` gives 38 effective, under 44. Fix: row → `min-height: 26`,
  `align-items: center`, drop the −2 hack (re-baseline by construction); `hitSlop` vertical 6→9
  (44 effective, checked against neighbours). Accept: wrapped label grows the row, 44 target.
- [x] **W06c — magic bottom spacers.** `exercise-section.tsx:248` (`height: onAddSet ? 7 : 41`). Fix:
  tokenize (`space.xs` / explicit end-cap constant with comment) — behavior identical. Accept: no
  magic numbers in the card.
- [x] **W06d — done-name delta verified, keep.** `nameDone #F5F5F7` vs `#FFFFFF` half-step (tokens
  37–38) per spec lines 128/149. `marginHorizontal: 16` hardcoded — folds into W00a. No other change.

## W07 — Set rows (`potential-set-counter.tsx` + `.styles.ts`)

- [x] **W07a — row height + unclamped texts.** `SetRow height: 32` (styles 16–20) + `PrevText`/`WeightText`
  no `numberOfLines` (SX03). Fix: SX02 (`min-height: 32`) + SX03 clamps. Targets already 44-effective
  (Weight/Reps `hitSlop` 6/6/4/4 → 44 vertical; check `hitSlop={11}` → 44 ✓). Accept: 320 + DE + 200%
  text, rows stay 32pt at reference content.
- [x] **W07b — check-size switch verified, keep.** Done 22 vs current/upcoming 26 SVG boxes, all r=11
  (spec lines 136–137, 164, 170); `CheckPressable` 22×22 centers the 26 art so rows never shift;
  `CurrentSetDot` absolute (9,9) centers the breathing dot per spec line 165. No change.
- [x] **W07c — Paper dialog inside Alcedo flow.** `WeightDialog` + Paper `Chip`s (203–245) break material
  (SX10). Fix: SX10 batch (dialog chrome + chips to session treatment, behavior identical). Accept:
  one material language.

## W08 — Cardio sets/tiles (`cardio-exercise.tsx`, `cardio-value-tile.tsx`)

- [x] **W08a — Paper tiles + tonal timer button.** `cardio-value-tile.tsx:68-76` (flat fills, rx10,
  `minWidth: 80`) + `CardioTimerButton` (`cardio-exercise.tsx:281-294`, Paper `contained-tonal`) sit
  inside Alcedo cards (SX10). Tiles wrap responsibly (`flexWrap` + `gap: sm` ✓ keep). Fix: SX10 —
  session-token fills, rx14 tile rhythm (recent-activity precedent), min 44 targets on tiles.
  Accept: cardio sets read as session content both modes.
- [x] **W08b — FocusRing inconsistency.** Cardio timer button keeps `FocusRing` (202–210) while weighted
  active rows deliberately skip it (`potential-set-counter.tsx:250-259`, comment: reference marks
  current via red tile + ring). Fix: one rule — drop `FocusRing` here too (current state already shows
  via `toStartNext` + live clock) or record a kept-difference with reason. Accept: single current-set
  language across weighted + cardio.
- [x] **W08c — index keys + legacy display.** `key={setIndex}` (SX08 batch); `potential-set-display.tsx`
  is classic-variant legacy (Paper tokens, own `Pressable` shim) — frozen with the classic path, not
  this ledger. Accept: scoped, no drift.

## W09 — SessionFooter (`session-footer/`)

- [x] **W09a — fixed idle card.** `session-footer.tsx:34` (`height: 88`) + ring 60 + `IdleSub` 15pt
  (wraps in DE) → clip. Fix: `minHeight: 88` (SX02); `IdleSub` `numberOfLines={2}`. `SkipPill` 64×30
  stays a dimmed static visual (reference-correct; not a button — keep `View`, ensure no role).
  Accept: DE + 200% text, idle card grows.
- [x] **W09b — idle label caps.** `IdleLabel` dead uppercase (SX01 batch). `IdleTexts flex: 1` squeeze
  verified: ring 60 + texts + 64 pill fits 320 (inner ≈ 258: 60+12+~120+64). Accept with SX01.
- [x] **W09c — hairline + hint verified, keep shape.** `Hairline` 1px → SX06 hairline; `Hint` 10/500
  centered +4 (spec line 290 ✓); disabled Finish wash + `#48484A` label per spec lines 288–290 ✓ (light
  table row `Disabled Finish` already matches tokens 77–80 ✓). `FinishPressable` 54 fixed = reference
  button (correct — buttons keep size). Accept: hairline weight only.
- [x] **W09d — footer gradient + fade verified, keep.** `FooterGradient` `tb` stops + `marginBottom:
  -insets.bottom` under-home-indicator extension, `BottomFade` 44pt `fd` wash `pointerEvents="none"`,
  `RestSlot margin-bottom: 12`. Matches spec lines 172–177. No change.

## W10 — BrandButton (`brand-button/`)

- [x] **W10a — fixed geometry + wrappable label.** `BrandPressable` (`width` opt / `height` fixed,
  styles 4–8) + `BrandLabel` no clamp (styles 10–17) — W04a's DE wrap clips at 48. Fix: width →
  `min-width` when provided, height → `min-height`, label `numberOfLines={1}`; gloss `height/2`
  follows (already proportional ✓); keep `br` stops, `.22` edge, `fb` colored shadow, `.35` gloss.
  Call sites: empty CTA 241×48, finish 54×27 — same visuals at reference content. Accept: 320 + DE +
  200% text, identical at reference.
- [x] **W10b — brand light decision.** `session-tokens.ts:92-98` brand fixed both modes (SX04 batch).

## W11 — RestTimer (`rest-timer.tsx`, `rest-timer.styles.ts`, `rest-timer-controls.tsx`)

- [x] **W11a — fixed 88 card row.** `CardRow height: 88` (styles 117–123) + per-state `MiddleColumn`
  `$topPad/$gap` (25/1, 12/5, 12/11). Complete title 19 single-line ✓; running 9-label + 26-clock;
  200% text overflows 88. Fix: row → `min-height: 88` (SX02); keep state paddings (measured 12/33/62
  baselines, styles 175–183). Accept: states grow, baselines hold at reference content.
- [x] **W11b — prescription string + suffix.** `rest-timer.tsx:212-217` (`60S` / `60–90S`, EN word order).
  Fix: SX05 single ICU string. Accept: localizers own the whole line.
- [x] **W11c — chip inks + uppercase.** PAUSED/READY text `.toUpperCase()` + fixed `#FFB84D`/`#C3F53C`
  (SX04/SX05 batch). Chip boxes (66/52×20, 16% fills) match spec lines 332–333, 347–348 — keep boxes.
  Accept: boxes identical, ink + case locale-correct.
- [x] **W11d — dead `onRestart` prop.** `rest-timer.tsx:21-25,137` retained for a host that never calls it
  (reference offers no restart chrome). Fix: remove the prop + call-site pass-through (or wire a
  real affordance — record decision; removal is the honest default). Accept: no dead API on the timer.
- [x] **W11e — verified, keep.** Ring r26/stroke 7, `114.35/163.36` math, −90° start, round caps, full
  green complete ring with no glow (spec: no glow copies ✓), `dimmed` 0.55 paused, 200ms tick,
  ±15s nudge clamped at zero, haptic jiggle, `PauseZone` running-only pause (reference draws no pause
  button — reachability preserved), landscape `flex-end` (keep + verify on device), controls gaps +
  44-effective targets (W-audit above). No change.

## W12 — CardioTimer / TimerPane (`cardio-timer.tsx`, `timer-pane.tsx`, native controls)

- [x] **W12a — glass chrome vs Alcedo card.** `timer-pane.tsx:51-63` (`GlassBackground`, `barRadius 20`,
  iOS `elevation.sm` / Android hairline border) renders beside the Alcedo rest-timer card in the same
  footer slot (SX10). Fix: SX10 decision (Alcedo edge/body/rx26 treatment, keep `formatTimeSpan`,
  curtain + pips, jiggle). Accept: timers are one family.
- [x] **W12b — dead uppercase status.** `timer-pane.tsx:75-88` (`textTransform: 'uppercase'` ignored;
  `Over target`/`Working` render Title Case). Fix: locale-uppercase at `cardio-timer.tsx:40,44`
  (SX01 pattern). Accept: status matches chip-case language.
- [ ] **W12c — native stop buttons need a device pass.** iOS SwiftUI `glassProminent` stop
  (`cardio-timer-controls.tsx`) vs Android Compose `IconButton` +3pt icon
  (`cardio-timer-controls.android.tsx:18`) — asymmetric sizes by platform convention; 44pt + labels
  unverified without a device. Fix: device pass (both platforms, 44pt audit, TalkBack/VoiceOver
  labels `cardio_timer.stop`). No code presumption. Accept: measured 44 + announced correctly.
- [x] **W12d — banking verified, keep.** 1s persist ref-pattern (killed app loses ≤1 interval ✓),
  200ms tick, green-and-stays over-target (never reddens — correct vs rest), distance progress from
  entered distance (honest zero when unknown ✓). No change.

## W13 — ExerciseNotesDisplay (`exercise-notes-display.tsx` + `.styles.ts`)

- [x] **W13a — hardcoded "Last time: " prefix.** Line 22 concatenates English around localized notes.
  Fix: Tolgee key with `{notes}` param (SX05 batch; other locales fall back to English). Accept: no
  English scaffolding in DE/FR.
- [x] **W13b — embedded path verified, keep.** `NotesWrap` +8/gap-4, 13/500 notes, full text (cards grow
  — no clamp needed), `testID`s intact. Classic accordion path frozen with classic scope. No change.

## W14 — Menus + dialogs (`session-more-menu-component.tsx`, `dots-trigger/`, remove confirm)

- [x] **W14a — hardcoded a11y English.** `dots-trigger.tsx:14` (`More options`). Fix: Tolgee key (SX05).
  44pt target + `#8E8E93` dots verified both modes (light: visible on white ✓). Accept: announced in
  locale.
- [x] **W14b — remove-exercise confirm not destructive.** `exercise-section.tsx:258-269` passes no
  `destructive` although the action deletes (the prop exists — `confirmation-dialog.tsx:16-17`, red
  `#FF6B60`/`#D70015` per line 62). Diff-save precedent: destructive confirms render red. Fix: pass
  `destructive` (finish confirm in route stays default — not destructive ✓ recorded). Accept: red
  remove action both modes.
- [x] **W14c — menu verified, keep.** Active menu (Add exercise / Edit workout + history/notes/stats/link
  rows, icons + systemImages ✓); finishing correctly absent (lives in footer). No change.

## Patch order (suggested, smallest-risk first)

1. SX01 dead-uppercase sweep + SX05 locale strings (mechanical, high-visibility win).
2. SX02 min-heights (W02a, W03a, W09a, W11a first — the guaranteed overflows) + SX03 clamps.
3. W06a/b + W10a card/row/button geometry + W04a CTA.
4. SX04 light inks + W10b brand decision + SX06 hairlines + SX07 `type()` migration.
5. SX10 material unification (notes/bodyweight/cards/dialogs/tiles/TimerPane) + W08b focus rule + W14b
   destructive + W11d prop removal + W13a prefix + SX08 keys (+ regression test).
6. SX09 auras + W00a scroll rhythm + W12c/W11e-landscape device pass.

## Implementation notes (2026-09-23 — read before device pass)

- **W00a verified-no-change:** per-section 16s are already consistent (header 24 is spec-measured);
  centralizing spacing would churn snapshots for zero visual gain. Footer spacer + fade clearance
  already correct by construction.
- **W04a kept 46pt top:** measured from the reference (illustration top 332 − strip end 286), not grid
  noise — measured beats grid per the skill's "real numbers" rule.
- **W08b kept `FocusRing`:** cardio has no red-tile/current-ring language (weighted does), so the ring
  is the only current-set marker — removal would delete information, not slop.
- **W10b resolved:** `BrandButton` fill already follows the mode-aware home `brand` variant; only the
  rest-timer-internal `BrandGradient` (resume/Log Set) was hardcoded — now mode-aware too.
- **SX10 scope cut (honest):** foundation editors/dialogs (`WeightDialog`, value editors, Paper
  `Dialog`/`Chip`) are shared across workout-editor/exercise-editor — their chrome belongs to a
  foundation pass, not this ledger. Session-owned surfaces (notes/bodyweight cards, cardio
  tiles/buttons, `TimerPane` shell) were unified.
- **SX07 remainder** (`exercise-history-list.styles.ts`) ships with the history ledger, not here.
- **SX08 sets stay index-keyed:** set rows are append-only with in-place cycling (reps dialog edits,
  never deletes/reorders) — verified in `potential-sets-addition-actions-dialog.tsx`. Exercises use
  `movementKey-index` since mid-list removal shifts positions.
- **W06c spacers** became named constants (`CARD_END_PAD_WITH_ADD_ROW`/`IDLE`) — same pixels, no magic.
- **W12c open:** native stop buttons need a real device (44pt + TalkBack/VoiceOver).
- **No verification runs yet by user request** (`typecheck`/`lint`/`vitest` skipped). Run them plus
  `session-simulation.spec`, `rest-timer-state.spec`, `session-restore.spec` before the device pass.

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Batch 1 locale strings + dead-uppercase sweep + chip inks | SX01, SX05, SX04 (part), W12b | code review only |
| 2026-09-23 | Batch 2 min-heights + clamps + Add-Set row + card spacers | SX02, SX03, W06b/c, W02a, W03a, W09a, W11a | code review only |
| 2026-09-23 | Batch 3 buttons + hairlines + font-shim migration | W10a, SX06, SX07, rest-timer BrandGradient | code review only |
| 2026-09-23 | Batch 4 material unification + destructive + prop removal + keys + auras | SX10, W14b, W11d, W13a, SX08, SX09, W08a, W12a | code review only |
