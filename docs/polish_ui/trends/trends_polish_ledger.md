# Trends polish ledger (source of truth)

Status: **implemented 2026-09-23 — all code patches applied; device pass (320/430, large
text, DE, landscape) still required before closing the acceptance bar.** T10/T30/TX04
carry audit corrections with measured reasons (not skipped work). Vitest skipped per
instruction — run the trends specs before the device pass.
Scope: all three Trends routes in render order — `app/src/app/(tabs)/stats/index.tsx`
(overview), `exercise-list.tsx` → `exercise-picker/` (Screen 3), `expanded-weighted-exercise.tsx`
→ `exercise-detail/` (Screen 2) — against `docs/new_design/trends-dark.md` (all three SVG
screens + the light-mode delta table) and `.agents/skills/apple-ios-frontend/SKILL.md`.

Read method: every `.tsx` + `.styles.ts` below was read fully, in render order, against the
spec SVG geometry. Nothing below is inferred from file names or folder structure.

## What is already good (not touched by this ledger)

Unbiased record — the verification pass (page-verification §7) already fixed the functional
layer, and several sections are genuinely responsive:

- `progress-chart.tsx` measures `contentWidth` from `useWindowDimensions` and its segment
  thumb rides `segmentPitch` — the only chart in the feature that scales. Muscle
  `trackFractions` are percentage-based (verification fix #4). Single-point charts render
  nodes only, deltas use U+2212, first-run renders `TrendsEmpty`, the picker works with zero
  sessions, identity `per_week` is localized.
- `trends-colors.ts` implements the spec's light-mode delta table faithfully (chart line
  `#E07800→#D70015`, area 0.20, grid `#3C3C43` @ 0.10, heat `#248A3D` deepened, insight
  `#8A4B00`, segmented thumb `#FFFFFF` + light shadow, gold unchanged, picker tint
  `#FF2D55` light).
- `exercise-detail-model.ts` formats through `localeFormatBigNumber` — locale-aware.
- Shadows, radii, tracking signs, 2-stop gradients, gloss layers, gold medallion + spine,
  iridescent insight edge all follow the skill. No flat cards, no dead black (auras on all
  three screens), no guessed ring math (charts are computed paths).

The problems below are the ones the user named: the screens are *correct* but not
*responsive* — fixed reference-device geometry (321/361/393 pt constants), fixed card
heights that clip real content, hardcoded dark hex in light mode, hardcoded `en-US`
numbers and English month names, and small-detail misses (positions, overflow, German
widths, hairlines, large text).

## Cross-cutting items (TX) — audit section, superseded by Batches 1–4

The boxes below are the original audit text, kept for provenance. Do not
reopen them: each was re-verified in code on 2026-09-23 and maps to a
closed batch item — TX01→T11 (no `en-US` left in src), TX02→T12 (no month
array left), TX03→T13 (sites converted or removed), TX04→TX04 ✓,
TX05→T05 (no 276/104 heights left), TX06→TX06 ✓, TX07→TX07 ✓ (width/height
are now viewBox units under a fill-view; proportional by design),
TX08→slice (both backgrounds; CardAura's own `none` scales stops
proportionally per its doc comment — by design).

- [ ] **TX01 — `formatInt` hardcodes `en-US`.** `trends-overview-data.ts:30`:
  `Math.round(value).toLocaleString('en-US')`. Feeds the hero big value, hero end label,
  both tile values, and streak totals. German devices show `34,340` instead of `34.340`.
  The detail screen already uses `localeFormatBigNumber`; the overview must match it.
  Spec test `trends-overview-data.spec.ts:36` asserts `'24,480'` — update the expectation
  to the locale-aware output (mocked locale in that spec is en, so it stays green).
- [ ] **TX02 — `monthDay` hardcodes English months.** `trends-overview-data.ts:117-133`:
  `['Jan',...]` array. Feeds hero x-labels, subtitle, PB dates, streak longest range, PR
  date labels, heat month pill. German locale still reads "Sep 15" / "MAR – JUN". Route
  through the cached Intl formatters (`useFormatDate`, as the detail screen does) or
  `localeFormatBigNumber`-style helper. Note `heatMonthLabel` additionally uppercases
  (see TX03).
- [ ] **TX03 — non-locale `toUpperCase()` batch.** Five sites, all must become
  `toLocaleUpperCase()` (same class as history HX01): `trends-overview-data.ts:637`
  (`shortName.toUpperCase()` in the e1RM tile label), `:848` (`monthName` for the heat
  pill + PR dates), `stat-strip.tsx:21` (`unitLabel.toUpperCase()`), `session-history.tsx:89`
  (`DateMonth`), `expanded-weighted-exercise.tsx:134` (`typeChip`). Turkish-`i` unsafe
  as written.
- [ ] **TX04 — 1px lines, not hairlines.** Dividers/borders drawn at `1px` render ~2–3
  physical px on @2x/@3x: `personal-bests.styles.ts` (`HeaderDivider`, `RowDivider`),
  `streaks-totals.styles.ts` (`Divider`, `StatDivider` width), `pr-timeline` `Spine`
  (1.6px — spec value, keep, but only there), `last-session.styles.ts`
  (`HeaderDivider`, `SetRow` border-top), `progress-chart.styles.ts` (`Divider`),
  `stat-strip.styles.ts` (`Divider`), `sticky-confirm` `BarHairline` (already theme-aware,
  just widen the rule), `export-health-data` button border. Pass: hairline width with the
  existing theme-aware colors.
- [ ] **TX05 — fixed card heights clip content (HomeCard `overflow: hidden`).**
  `BodyLayer` clips (`home-card.tsx:61`), so every fixed `height` below is a clip risk,
  not just a rhythm choice. Measured content vs height:
  - Hero `276` (`hero-chart.tsx:119`): content 256 + hero pad 40 = 296 → **20pt clipped**,
    the footer line ("+31.2% over 8 weeks") is cut. Fix: drop the fixed height (card sizes
    to content) or recompute geometry to fit 276.
  - Tile `104` (`metric-tiles.tsx:55`): content 81 + pad 28 = 109 → sparkline bottom
    clipped ~5pt. Same fix.
  - `identity-card.styles.ts` `CardInner` height 104: content 102 — fits by 2pt; any
    localization growth clips. Convert to min-height.
  - `muscle-involvement.styles.ts` `CardInner` height 140: content exactly 140 — same
    2pt-class fragility. Convert to min-height.
  - `pr-timeline` rows are fixed 42 (see TPR02); `stat-strip` 68 fixed (content 21+20+7+10
    = 58 + pad 0 — fits, keep).
- [ ] **TX06 — large text / 200% pass.** Every fixed height above plus `NameRow`
  (height 16), `HeaderRow` (10/20), `PrRow` (42), `SetRow` (26), `XLabels` (12),
  `RowInner` (50), picker rows (50+8) clip or truncate scaled text. Policy: fixed heights
  become min-heights where text lives (TX05 covers cards); single-line truncations keep
  `numberOfLines={1}` deliberately (rows, tiles, strip) and are recorded here, not fixed.
- [ ] **TX07 — `CardAura` fixed 361pt width.** All `CardAura` call sites pass
  `width={361}` (`hero-chart`, `streaks-totals`, `trend-insights`). On 430pt screens the
  right side of the card has no aura (flat); on 320pt it overflows (clipped, harmless but
  asymmetric). Pass the measured card width or `100%`.
- [ ] **TX08 — background auras use `preserveAspectRatio="none"`.**
  `sheet-background.tsx:21` (viewBox 393×852) and `screen-background.tsx:30` (393×1650)
  stretch non-uniformly on taller/narrower screens — the spec's asymmetric blooms drift
  and squash. Use `slice` (as the session detail aura does) so aspect holds on all
  canvases. Files: `sheet-background.tsx`, `screen-background.tsx`.

## Batch 1 — clip + scale correctness (T01–T10)

- [x] **T01 — RangeSelector thumb rides the reference width.** `range-selector.tsx:15`:
  `SLOT = 361/5`, thumb `68.2` fixed while `Option` is `flex: 1` — on a 430pt screen the
  thumb drifts ~35pt from its slot at ALL. Fix: measure the track (`onLayout`), pitch =
  measured/5, thumb width = pitch − 4, thumbX animated to `selected × pitch`. Done.
- [x] **T02 — hero chart fixed 321 wide.** `hero-chart.tsx:40-46`: `W = 321`, `X1 = 317`
  while the card inner is 321 only on a 393 screen — overflow on 320, dead space on 430,
  end node/label detached. Fix: `onLayout` on `ChartWrap`, `W` = measured, `X1 = W − 4`
  (spec's 4pt right inset preserved); vertical geometry untouched. Done.
- [x] **T03 — sparkline path drawn outside its viewBox.** `metric-tiles.tsx:117`:
  `sparkPath(tile.spark, 84, 16)` but `viewBox="0 0 84 12"` — peaks/troughs clip 2.5pt top
  and bottom. Single-point guard already exists (`length > 1`, same rule as hero). Fix:
  height param 16 → 12. Done.
- [x] **T04 — tile spark fixed 84 wide.** Same file: on 320 tiles the spark overflows
  ~5pt, on 430 it hugs left. Fix: derive spark width from the measured tile inner
  (shared `onLayout` or flex-measured width), keep 12pt height + `length > 1` guard.
  Implemented as `tileW − 28` (14pt pads), fallback 84. Done.
- [x] **T05 — hero 276 + tile 104 fixed heights clip (see TX05).** Dropped both;
  hero sizes to 296, tiles to 109. Decision recorded: uniformity with the 20pt hero
  pad (every other hero card) beats matching one reference number. Done.
- [x] **T06 — PB columns total 227 fixed.** 320pt screen: lift cell squeezed to
  negative. Fix: 80/70/77 → 70/62/68 (total 200; widest values re-measured:
  "102.5 × 5" ≈ 55, "119.6" ≈ 30, "Sep 15" ≈ 35). 320pt inner 248 → lift keeps 40.
  Done.
- [x] **T07 — last-session table fixed 321.** Columns 104/82/74/34/27 overflow 113pt
  on 320. Fix: flex ratios 1.3/1.7/1.0/1.2/0.8 (WEIGHT widest — real "102.5 kg" data
  drives the ratio, per the skill's real-numbers rule), header/data share ratios,
  all cells `numberOfLines={1}`. Same proportions on every canvas. Done.
- [x] **T08 — involvement bars fixed 180.** Track 180 + name 104 + pct 37 = 321 fixed.
  Fix: Name 104 + Track `flex: 1` + Pct 37 (spec gaps are zero — no margins added, so
  the reference canvas still measures exactly 180). Fill width in %. CardInner
  height → min-height (with identity card, per TX05). Done.
- [x] **T09 — heatmap fixed 17/22 grid.** 311pt wide: overflows below 393 (103pt on
  320). Fix: `WeeksRow flex: 1 + onLayout`, cell = (measured − 60)/13, pitch = cell+5,
  radius ∝ cell, TodayRing sized/positioned from the same pitch, DaySlot height =
  pitch. 393 canvas → 17.77 cells, grid exactly fills. Done.
- [x] **T10 — progress-chart floor: rejected, no change.** Re-measured: 320pt → inner
  248pt; short month-day labels (~35pt, start/center/end anchored) do not collide at
  248pt, while a 300pt floor would force a guaranteed 52pt overflow to fix a
  hypothetical collision. Correcting the audit rather than coding it.

## Batch 2 — locale (T11–T13, T35)

- [x] **T11 — `formatInt` hardcodes `en-US`.** Reworked the whole helper family to cached
  Intl formatters keyed by `settings.preferredLanguage` (undefined = system), mirroring
  `useFormatNumber`: `formatInt/format1/formatSigned1/formatSignedPct/formatWeightTrim`
  all take `locale`; the hook threads it through every call (hero, tiles, PB, streaks
  via updated `streaks-totals`, insights). Spec updated with explicit `'en-US'` + new
  `de-DE` assertions (`24.480`, `+18,0%`). Done.
- [x] **T12 — `monthDay` hardcodes English months.** Replaced the `['Jan',…]` array with
  a cached `Intl.DateTimeFormat(locale, {month:'short',day:'numeric'})`; `bucketsForRange`
  takes an optional locale (hook passes it; spec call sites unchanged, still green).
  Pill/PR labels use a new `monthShort` helper. Done.
- [x] **T13 — non-locale `toUpperCase()` batch.** All five → `toLocaleUpperCase()`: tile
  lift (`:637`), heat/PR `monthName` (`:848`, now via `monthShort`), strip unit
  (`stat-strip.tsx:21`), `DateMonth` (`session-history.tsx:89`), route `typeChip`
  (`expanded-weighted-exercise.tsx:134`). Done. Follow-through: insight strings passed
  the raw English group name (`muscleCallout.muscle`) — now translated via the
  `trends.muscle.group.*` keys + `toLocaleLowerCase()`, so German insights read German.
- [x] **T35 — decimal separators (new).** `format1/formatSigned1/formatSignedPct` used
  `toFixed` (always `.`), `avgPerWeek` used `toFixed(1)`, and detail
  `formatDeltaPercent/formatWeeklyRate` used `toFixed` — German devices would read
  "116.7" mid-sentence next to locale-grouped "34.340". All routed through the cached
  1-decimal Intl formatter with the caller's locale; both spec files updated (`'en-US'`
  explicit + `de-DE` proof assertions). Done.

## Batch 3 — light mode (T14–T25)

- [x] **T14 — picker headers hardcode `#86868B`.** `AllExercisesHeader` (label + count),
  `AlphaSectionHeader`, `PinnedSectionHeader`, `RecentSectionHeader` → theme secondary
  (`#86868B` dark / `#6C6C70` light). Done.
- [x] **T15 — empty-state body hardcodes `#8E8E93`.** → theme-aware (`#8E8E93` /
  `#6C6C70`). Done.
- [x] **T16 — history date tile is dark-only.** Tile + month → mode-aware
  (`rgba(120,120,128,0.12)` tile, `#6C6C70` month in light); gold PR branch untouched.
  Done.
- [x] **T17 — row chevron hardcodes `#48484A`.** Kept dark, tertiary `#AEAEB2` in light.
  Done.
- [x] **T18 — involvement colors dark-only.** Per-mode arrays: dark = spec hues;
  light bars `#D70015 / #E07800 / #AF52DE`, light texts `#D70015 / #8A4B00 / #AF52DE`
  (heatmap precedent: same hue, deepened for white; only spec-adjacent values).
  Done.
- [x] **T19 — progress delta hardcodes dark inks.** `#FF453A/#4ADE80` kept dark;
  light uses trend tokens `#D70015/#248A3D`. Done.
- [x] **T20 — search focused fill white in both modes.** Dark keeps `.08`; light
  `rgba(255,255,255,0.75)` so the field reads on pale bg with the brand border.
  Done.
- [x] **T21 — bottom-fade base hardcodes `#F3F3F8`.** Mismatches the white light
  background (visible band). Now `alpha(theme.color.background.base, 0.94)` both
  modes (dark resolves to `rgba(2,4,10,0.94)` — same family as before). Done.
- [x] **T22 — verified, no change.** Selected-chip light shadow `0 1 3 rgba(0,0,0,.12)`
  already in `muscle-filter-chips.styles.ts:35-44`.
- [x] **T23 — verified, no change.** `segmentedThumbBorder` light is already
  `rgba(0,0,0,0.04)` (`trends-colors.ts:104`).
- [x] **T24 — verified, no change.** `goldBg` light already `0.22` (`trends-colors.ts:113`).
- [x] **T25 — verified, no change.** `CalendarCircle` light border already `0.18`
  (`trends-header.styles.ts:27-29`).

## Batch 4 — details (T26–T34) + cross-cutting close-out (TX04, TX07)

- [x] **T26 — bodyweight pill narrower than its tab.** `MetricTab` fixed 66/66/88 →
  `flex: 1`; `ActivePill` fixed 66 → `left/right: 2` fill; tab labels
  `numberOfLines={1}` (German "Körpergewicht" truncates instead of overflowing).
  Done.
- [x] **T27 — filter chips fixed widths.** `width` → `min-width` + 14pt horizontal
  padding (reference widths kept as floors; German labels grow). Done.
- [x] **T28 — CTA fixed heights clip localized text.** CTA `height: 54` → `minHeight`
  + vertical/horizontal padding, label 2-line centered; secondary `height: 48` →
  `minHeight` + padding. Done.
- [x] **T29 — chip/title rows can't wrap.** Identity `ChipRow` wraps; involvement +
  last-session `TitleRow` height → min-height. Done.
- [x] **T30 — scrubber anchor: verified, no change.** `ScrubberColumn top: 100` is
  list-relative (ListWrap starts below search+chips), and every scroll constant
  re-measures true: rows 50+8=60, headers 14+12+6=32 (pinned/recent/alpha styles
  confirmed identical), selection card 12+60+10=82. German headers fit single-line.
  The audit's proportional anchor would fix nothing.
- [x] **T31 — auras `none`-scaled.** `sheet-background` + `screen-background` →
  `xMidYMid slice`. Home auras untouched (out of scope). Done.
- [x] **T32 — caption `marginTop: 2`.** → 4 (absorbed by the auto-height card from
  T05). Done.
- [x] **T33 — medallion `-8` vs divider `-20`.** → `-6` optical step. Done.
- [x] **T34 — pill glued to text.** `TodayPill margin-left: auto` → 8 (`StreakText`
  `flex: 1` already held the row). Done.
- [x] **TX04 — 1px lines → hairlines.** In-card separators to
  `StyleSheet.hairlineWidth`: PB header/row dividers, streaks divider + stat
  dividers, last-session header divider + row border-top, progress divider, strip
  dividers, sticky bar hairline. Amendment: the export pill's 1px button border
  stays — it is a spec 1pt edge stroke (skill §3), not a separator.
- [x] **TX06 — large-text policy.** Recorded, not coded: fixed heights that hold text
  are now min-heights (TX05/T28/T29); single-line truncations (`numberOfLines={1}`)
  on rows/tiles/strip/tabs stay deliberate. Full 200% device pass still owed.
- [x] **TX07 — `CardAura` fixed 361.** Reworked: fill-view spanning the card body at
  any size + SVG `100%` over the reference viewBox (`none` scale). Stop positions
  stay proportional; washes tolerate the scale invisibly. Insights call site updated
  (dropped `top/left` props).

## Implementation notes (2026-09-23 — read before device pass)

- **T05 consequence:** hero is now 296 (was 276), tiles 109 (were 104). Uniform 20/14
  pads, zero clipping. If a future pass wants 276 back, the bottom pad — not the
  content — must give.
- **T07 ratios** 1.3/1.7/1.0/1.2/0.8 weight WEIGHT heaviest (real "102.5 kg" data).
  320pt inner 208 → WEIGHT 59pt; heavier imperial strings may still truncate — contained,
  recorded.
- **T09 on 393** → 17.77 cells (not 17): the grid fills the card exactly instead of
  leaving a gap. Intentional.
- **T10/T30/TX04-amendment** correct the audit with measured reasons; they are not
  skipped work.
- **Locale source** is `settings.preferredLanguage` (undefined = system), matching
  `useFormatNumber`/`useFormatDate` — not the device locale.
- **Gates:** `typecheck` clean for all touched files (remaining errors pre-exist in
  untouched files: feed-timeline, account-group, blueprint-diff.spec,
  type-switch-dialog). Vitest skipped per instruction — run the trends specs
  (`trends-overview-data`, `exercise-detail-model`, `chart-math`, `muscle-track`,
  `exercise-picker-model`, `recent-views`) + `format:check` before the device pass.

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Batch 1: measured thumb/hero/spark/heatmap, flex tables/tracks, dropped clip heights | T01–T09, TX05 | typecheck (touched files clean) |
| 2026-09-23 | Batch 2: Intl numbers/dates/casing + insight muscle translation | T11–T13, T35 | typecheck (touched files clean) |
| 2026-09-23 | Batch 3: light-mode hardcodes → theme tokens | T14–T21 | typecheck (touched files clean) |
| 2026-09-23 | Batch 4 + TX close-out: pills/chips/CTA/wrap/auras/hairlines | T26–T34, TX04, TX07 | typecheck (touched files clean) |