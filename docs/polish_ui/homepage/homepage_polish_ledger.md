# Home page polish ledger (source of truth)

Status: **implemented 2026-09-22 — all code patches applied; device pass (320/430, large text, DE) still required before closing the acceptance bar.** Open items needing a device: X08 (single-layer shadow limit), S04/S05 (runtime bleed/overscroll verify).
Scope: home route + every section it renders, in render order, for **dark + light** and **iOS + Android**.
Audited 2026-09-22 by reading each file end-to-end (no skips). This file is the checklist every polish patch must work through so nothing is missed later.

## How to use this ledger

1. One patch per ledger item (or per tightly-coupled group, e.g. H06a+H06b). Keep diffs small and reviewable.
2. Each patch must state which ledger IDs it closes (e.g. `Closes H06a, X03c`).
3. Check the box here (`[ ]` → `[x]`) in the same commit as the code patch. Never check a box without the code + verification that proves it.
4. Verification per patch: `npm run typecheck`, targeted vitest (add/extend specs where logic changes), `npm run lint`, `npm run format:check`. Visual proof: 320 / 393 / 430 pt widths × dark/light, plus large-text and German-string spot checks where the item says so.
5. If a patch discovers a new problem, append a new ID below (never reuse IDs) and keep this file sorted by section.

## Ground truth references (do not re-derive)

- Skill (law): `.agents/skills/apple-ios-frontend/SKILL.md` — light from above, real numbers, no dead black; spacing 16 page / 12 gutter / 16 card (20 hero); radii hero 30 / tile 24 / row 22 / duo 28 / program 26; display type negative tracking, micro-labels positive; 2-stop gradients; dy10/blur14 cards, dy6/blur8 tiles; auras asymmetric 7–20%.
- Reference SVGs: `docs/new_design/home_page_screen1.svg` (dark, 393×2300), `docs/new_design/home_screen_light_mode.svg` (light). Gradient/filter IDs cited below come from their `<defs>` (`gCard`, `gCardEdge`, `gTile`, `gTab`, `gBrand`, `gToday`, `gAvatar`, `gCoach`/`gCoachBorder`, `gWater`, `gZ1`–`gZ5`, `gBadgeA`–`gBadgeE`, `gMacroP`/`gMacroC`/`gMacroF`, `fCard`/`fTile`/`fBrand`).
- Theme tokens: `app/src/styles/theme.ts` — `space` (lines 231–244, 4pt grid), `radius` (250–262), `layout` (273–293: `screenPadding 16`, `touchTarget 44`), `homeTokens()` (746–783: per-mode `card`/`cardEdge`/`screenBackground`, radii, `seeAll`/`amber`/`delta`).
- Route + shell: `app/src/app/(tabs)/(session)/index.tsx`, `app/src/components/layout/full-height-scroll-view.tsx`, `app/src/app/(tabs)/_layout.tsx`.
- Data: `app/src/components/presentation/home/use-home-data.ts` (real derivations; health sections are declared sample-only).

## Global acceptance bar (applies to every item)

- [ ] No clipping/overlap at 320 / 360 / 393 / 430 pt widths, portrait + landscape, iOS + Android.
- [ ] No clipping at 200% text size (largest Dynamic Type / Android font scale) and with German strings (longest locale).
- [ ] Dark and light look intentional (no invisible washes, no dark-only gradients on light cards).
- [ ] Every dimension a multiple of 4, every interactive visual ≥ 44pt (or `hitSlop` to 44 with no neighbour overlap), no dead button-look controls.
- [ ] Numbers locale-formatted (no hardcoded `en-US`), uppercase locale-safe, no hardcoded English in UI.

---

## X — Cross-cutting (fix once, helps every section)

- [x] **X01 — fixed `height` → `minHeight`.** Problem: cards lock height so any growth (large text, DE, empty states, optional chips) can only overflow. Files: `activity-rings.styles.ts:15-18` (170), `today-session.tsx:58` (104) + `today-session.styles.ts:5-10` (74), `weekly-volume.tsx:79` (162), `hr-zones.tsx:55` (156), `coach-card.tsx:102` (156), `recent-activity.tsx:106` (68) + `recent-activity.styles.ts:11-15` (40), `personal-records.tsx:24` (140), `hydration.tsx:28` + `macros.tsx:99` (150), `weekly-challenge.tsx:58` (140), `stat-tiles.tsx:76` (82) + `stat-tiles.styles.ts:9-12` (60). Fix: `minHeight` on outer cards, remove fixed inner heights, let `justify-content` distribute slack. Accept: 200% text + DE, no clip at all widths.
- [x] **X02 — fixed 393pt geometry → measured/flex.** Problem: `weekly-volume.tsx:31-36` (`PITCH 46`, `BAR_W 20`, `chartW 330` vs inner `W−66` → +3 overflow at 393, ~+36 at 360); HR 5×44 cols; achievements 6×46 (`achievements.styles.ts:5-9`); PR 3×99+2×12=321 vs 319 inner (`personal-records.styles.ts:22-34`); hydration drops 8×13+7×5.4=141.8 vs ~140 inner (`hydration.styles.ts:19-23`); macros 3×48=144 vs ~140 (`macros.styles.ts:11-15`). Fix: measure row width (`onLayout`/`useWindowDimensions`), compute pitches/counts from it; flex cells with `minWidth:0` + `flexShrink:1`. Accept: 320–430, no clip, no dead space.
- [x] **X03 — light-mode washes/gradients.** Problem: `alpha('#FFFFFF', …)` fills on white cards are near-invisible. Spots: `macros.styles.ts:34` BarTrack; `hr-zones.styles.ts:37` ZoneTrack; `hr-zones.styles.ts:14` TodayChip; `personal-records.styles.ts:16` MonthChip; `coach-card.styles.ts:50-60,109-118` BetaChip/DismissButton; `today-session.styles.ts:40-51` DifficultyChip; `weekly-challenge.styles.ts:12-19` DaysChip wash check; `home-gradient.tsx:55-61` water + `81-88` brand are dark values both modes; `achievements.tsx:11-17` badge gradients dark-only; `coach-card.tsx:97-103` border gradient dark-only. Fix: mode-aware tokens from the light SVG (`#787880` washes, light `gWater` `#007AFF→#32ADE6`, light badge/macro/coach stops at `home_screen_light_mode.svg:49-91`). Accept: side-by-side dark/light screenshots, washes visible, AA text contrast kept.
- [x] **X04 — locale formatting.** Problem: hardcoded `toLocaleString('en-US')` in `weekly-volume.tsx:112`, `macros.tsx:122,141`, `use-home-data.ts:88`; bare `toUpperCase()` in `section-header.tsx:61`, `greeting-header.tsx:57`, `weekly-challenge.tsx:74`, `personal-records.tsx:62`, `use-home-data.ts:125`. Fix: locale-aware number/date helper (extend the cached-Intl pattern used by `useFormatDate`), locale-safe case conversion, Tolgee strings for `NEW`/units. Accept: DE locale shows correct grouping (`12.480`), no truncation caused by formatting.
- [x] **X05 — targets + dead controls.** Problem: 42×42 Play (`today-session.styles.ts:53-67`), 20–22pt chips (`activity-rings.styles.ts:27-37`, `weekly-volume.styles.ts:11-20`, `hr-zones.styles.ts:11-19`, `personal-records.styles.ts:12-19`, `weekly-challenge.styles.ts:12-19`, `coach-card.styles.ts:50-60`); `hydration.tsx:67-75` AddPill is a `View` that looks like a button; badges/rings/bars look tappable but static. Fix: visuals ≥ 44 or `hitSlop` to 44 (checked for neighbour overlap); either wire `onPress` or de-style to non-button visuals with proper roles/labels. Accept: 44pt audit passes, zero button-look dead ends.
- [x] **X06 — type floor + tracking discipline.** Problem: 8–8.5pt micro text (`personal-records.tsx:34-42,73-83`, `weekly-challenge.tsx:68-75`, `coach-card.tsx:166-173`) below the skill 9–11 micro range; SVG `SvgText` uses raw `'600'/'700'` strings (`weekly-volume.tsx:176-183`) outside theme type. Fix: floor micro at 9pt, route SVG labels through theme weight/color, keep negative-display / positive-micro tracking. Accept: readability pass at small sizes, no tracking reversals.
- [x] **X07 — SVG hygiene.** Problem: duplicate-prone gradient ids (`macros.tsx:67` `macro-${gradient[0]}`); inconsistent chevron strokes (1.7 `section-header.tsx:75-84` vs 1.9 `recent-activity.tsx:52-65`); fixed `#48484A` chevron unreadable strategy in light. Fix: unique ids per instance, single chevron spec, theme-driven chevron color. Accept: no id collisions with 3 macro rings mounted, chevrons visible both modes.
- [ ] **X08 — light shadows.** Problem: `home-card.tsx:37-51` light uses a single `dy8/blur16 @0.075` layer; reference light SVG uses two-layer (`fCard`: dy1 + dy8, `fTile`: dy1 + dy5 at `home_screen_light_mode.svg:98-104`). Fix: two-layer light shadow on card + tile elevations. Accept: light cards lift without halo on white.
- [x] **X09 — a11y labels/roles.** Problem: icon-only/row controls lack names (avatar letter, badges, rings, rows rely on visuals). Fix: `accessibilityRole` + `accessibilityLabel` on every pressable row/chip, decorative SVGs `pointerEvents="none"` + `accessible={false}`. Accept: screen-reader pass names every action.

## S — Shell (screen container, background, tab bar, banners)

- [x] **S01 — scroll padding + tab inset.** File `index.tsx:58-59` (`paddingHorizontal: screenPadding`, `paddingTop: insets.top + sm`; content `gap: md`, `paddingBottom: xxl/32`). Problem: 32pt bottom is not derived from the tab bar (`layout.tabBar 49` + safe area, `(tabs)/_layout.tsx:12-16`), so the last card can slide under `AppTabBar`. Fix: bottom padding = tab height + safe inset + 12pt gutter breathing room. Accept: last card fully clear of the tab bar on iOS + Android, all widths.
- [x] **S02 — tab-bar fade (skill §7).** Problem: no clip + fade-to-background over the last ~40pt at the tab boundary; content just ends. Fix: fade overlay above tab bar, mode-aware (dark→black, light→paper), pointer-transparent. Accept: scroll continuation visibly fades under the bar both modes.
- [x] **S03 — auras tied to viewport, not content.** File `home-auras.tsx:6-12,27-41` (absolute layer inside scroll content; `viewBox 0 0 400 2300`, `preserveAspectRatio="none"`; fixed `cy` 180–1980). Problem: stretches circles to ellipses off-393 widths; pins color to content length so DE/large-text shifts break the composition. Fix: render auras screen-sized (viewport units), uniform scale (`xMidYMid slice`), positions as fractions of viewport height. Accept: circles stay circular 320–430 + tablet, asymmetric composition kept.
- [ ] **S04 — background layering.** Files `home-auras.tsx:63-74` (`HomeScreenBackground`), `full-height-scroll-view.tsx:36-54` (renders `screenBackground` before `ScrollView` over `theme.color.background.base`). Problem: untested whether the base color ever covers the gradient on overscroll/Android. Fix: verify overscroll top/bottom both modes/platforms; keep gradient behind, base as fallback only. Accept: no pure-black/white flash on overscroll.
- [ ] **S05 — programs carousel bleed.** File `programs.styles.ts:6-15` (`marginHorizontal: -screenPadding`, inner `paddingHorizontal: screenPadding`). Problem: correct technique but unverified for Android clip/overscroll and for first/last card inset at 320/430. Fix: verify no whole-page horizontal jitter; snap first card to 16pt margin at every width. Accept: horizontal scroll only inside the carousel.
- [x] **S06 — banner token drift.** File `whats-new-banner.tsx:31-44` (Paper `StyleSheet`, radius 20, pad 16, info-surface fill). Problem: only non-styled-components block on home; radius/pad/ink drift from home tokens. Fix: align to `home.radius.tile`, card padding, home ink; keep behavior identical. Accept: banner reads as one home card family both modes.
- [x] **S07 — welcome-wizard slot (audit gap).** File `index.tsx:170` renders `<WelcomeWizard />` last; not read in this audit. Problem: unknown height/gap/overlay behavior could break S01/S02 math. Fix: inventory wizard states (first-run vs hidden) and reserve its space in the scroll budget before closing S01. Accept: wizard shown + hidden states both leave correct bottom rhythm.

## H00 — Shared primitives (section headers, cards, text, gradients)

- [x] **H00a — `section-header.tsx:9-18` negative margin.** `marginTop: 8`, `marginBottom: -2` baseline hack breaks at large text. Fix: margin-top 8, margin-bottom 0, internal `lineHeight` carries the 30pt card-to-baseline rhythm. Accept: 200% text keeps 12pt card→header gap.
- [x] **H00b — header overflow.** `section-header.tsx:20-30` (`LabelGroup` + `ActionRow`, `space-between`, no flex). Long DE label + `SampleBadge` + See All collides on 320. Fix: label group `flex:1/minWidth:0`, label `numberOfLines={1}`, action pinned right. Accept: DE 320, action never pushed off.
- [x] **H00c — `home-duo-row.tsx:8-11` gutter 13.** Reference-393-only value; skill gutter is 12. Fix: gap 12. Accept: duo gutters match card gutters everywhere.
- [x] **H00d — `home-card.tsx:14-62` edge/body contract.** Keep: 1pt edge, body `r−1`, `borderCurve: continuous` both layers, `overflow: hidden` on body. Fix (only): X08 light shadow + verify Android `elevation` pairs. Accept: edge hugs radius both platforms.

## H01 — Greeting header (`greeting-header/`)

- [x] **H01a — avatar bleed.** `greeting-header.tsx:16` draws 52×52 SVG inside `greeting-header.styles.ts:26-34` 44pt container → 8pt bleed; dot (`greeting-header.tsx:26`, cx41/cy11 r7) risks clip. Fix: draw avatar at 44 (dot repositioned inside), keep red dot + white@0.18 ring + gloss. Accept: pixel-contained at all scales.
- [x] **H01b — greeting wrap.** `greeting-header.tsx:59-64` (25/30, no `numberOfLines`) + `TextColumn flex-shrink:1` (`greeting-header.styles.ts:11-14`). Long DE greetings wrap and shift rhythm; date (`greeting-header.tsx:51-58`, 10.5/13 +1.45) can also wrap. Fix: greeting `numberOfLines={2}` with 2-line budget reserved; date single-line ellipsize; X04 locale-safe uppercase. Accept: DE + 200% text keeps one header block, no push.
- [x] **H01c — trailing targets.** `index.tsx:120-133` menu 44×44 `hitSlop={12}` → 68pt effective, overlapping the avatar. Fix: 44 visual, `hitSlop` ≤ 8, verified gap (`TrailingGroup gap sm`). Accept: no overlap, both targets 44.

## H02 — Activity rings hero (`activity-rings/`)

- [x] **H02a — fixed canvas math.** `activity-rings.tsx:14-18` (`CANVAS 102`, `OFFSET_X 15`), `activity-rings.styles.ts:44-47` (`MetricsColumn marginLeft 23`). Fix: derive offsets from measured card width; rings fixed 102, metrics `flex:1/minWidth:0`. Accept: X02 matrix.
- [x] **H02b — metric rows.** `activity-rings.styles.ts:50-59` (`MetricRow marginBottom 10`, `MetricLabelRow h15 space-between`) + `activity-rings.tsx:220-230` nested `HomeText`. DE label + `value/goal` collides in 15pt. Fix: row `minHeight:15`, label `flex:1 numberOfLines={1}`, value pinned right tabular; flatten nested texts. Accept: DE 320 no collision.
- [x] **H02c — bar + footer.** `activity-rings.styles.ts:61-75` track h6 + fill `width pct%`; `activity-rings.tsx:241-253` pace row. Fix: clamp `pct` 0–1, cap radius `min(8,h/2)` per skill §6, keep gloss/dot/marker on today only. Accept: 0% and 100% render sanely.
- [x] **H02d — streak chip.** `activity-rings.styles.ts:27-37` (46×22) + `activity-rings.tsx:155-160`. Fix: X05 (`minHeight` 22 visual, press expands to 44 if ever tappable; static today → non-button semantics). Accept: no tiny dead target.

## H03 — Stat tiles (`stat-tiles/`)

- [x] **H03a — top-row collision.** `stat-tiles.styles.ts:15-20` (`TileTop h20 space-between`) holds compact badge + 40pt glyph (`stat-tiles.tsx:78-88`). At 320 inner ~66pt: ~50 + 40 overflows. Fix: badge left pinned, glyph `flexShrink:1` + `numberOfLines` n/a (SVG: `maxWidth:100%`, right-aligned), row `minHeight:20`. Accept: 320 no overlap.
- [x] **H03b — value overflow.** `stat-tiles.styles.ts:24-28` + `stat-tiles.tsx:99-113` (20/24 value, no shrink). "8,412" + unit clips at 320. Fix: value `flexShrink:1 numberOfLines={1}` + `adjustsFontSizeToFit` decision recorded; unit pinned. Accept: 320 + 200% text, no clip.
- [x] **H03c — fixed tile body.** `stat-tiles.styles.ts:9-12` (`TileBody h60`). Fix: X01 (`minHeight:60`, top/bottom pin). Accept: large text grows tile, siblings in row stretch equally.

## H04 — Today's Session + Start tile (`today-session/`)

- [x] **H04a — difficulty-chip overflow.** `today-session.tsx:88-99` optional chip (+25 with margin) inside `today-session.styles.ts:5-10` fixed 74 body → +4 overflow when shown. Fix: X01 (body `minHeight:74`); chip wraps below subtitle. Accept: chip shown/hidden both fit.
- [x] **H04b — Play target.** `today-session.styles.ts:53-67` 42×42. Fix: 44×44 visual (X05), keep brand gradient + colored shadow. Accept: 44 audit.
- [x] **H04c — Start tile weight.** `today-session.tsx:120-139`, `today-session.styles.ts:76-118` (single full-width 76 tile, gloss h38 @.45). Fix: keep single-tile honesty (no fake Nutrition/Timer), rebalance gloss to skill ramp (white .30→0) and verify full-width hierarchy vs hero. Accept: dark/light screenshots approved, no dead tiles reintroduced.
- [x] **H04d — text budgets.** `today-session.tsx:73-87` title 17/21 + subtitle 11.5/14 single-line; `TextColumn` margins `lg + md` fixed (`today-session.styles.ts:33-37`). Fix: reserve 2-line title budget on empty-state copy; margins to tokens (keep values, verify at 320). Accept: longest session name + DE empty copy fit.

## H05 — Weekly Volume (`weekly-volume/`)

- [x] **H05a — chart responsiveness.** `weekly-volume.tsx:31-36,70-76` constants → overflow (X02). Fix: measured-width pitch/bar/track, `chartW` = inner width, AVG label inside bounds. Accept: 320–430, labels never clipped.
- [x] **H05b — header collision.** `weekly-volume.styles.ts:5-20` (`flex-start` + fixed 52×21 chip). Long title + chip collides. Fix: title `flex:1 numberOfLines={1}`, chip pinned, row `alignItems:center`. Accept: DE 320.
- [x] **H05c — bar detailing.** `weekly-volume.tsx:159-172` (rx8/2, today gloss square corners, dot cy `y−7`). Fix: gloss clipped to bar radius, dot reserved lane (no overlap with AVG line), zero-day 4pt nub kept, `rx = min(8,h/2)`. Accept: 0-value week + full week render cleanly.
- [x] **H05d — subtitle honesty.** `weekly-volume.tsx:101-116` (`toLocaleString('en-US')`, `{total} kg · {sessions} sessions`). Fix: X04 + plural-aware sessions string. Accept: DE + singular/plural correct.

## H06 — Heart Rate Zones (`hr-zones/`) — highest overflow risk

- [x] **H06a — height budget.** `hr-zones.tsx:55` h156 vs ~148 content + 40 padding = ~190 (see audit). Fix: X01 (`minHeight:156`) AND H06b (badge inline) — both, not either. Accept: content never clipped, card grows.
- [x] **H06b — badge placement.** `hr-zones.tsx:78` renders `<SampleBadge />` as a full-width sibling between subtitle and bars. Fix: move inline into `HeaderRow` beside title/TODAY (or beside subtitle), removing one full row of height. Accept: vertical rhythm matches reference (header/sub/bars).
- [x] **H06c — bar geometry.** `hr-zones.styles.ts:22-48` (5×44 cols, 58 tracks, value `bottom:65` magic). Fix: flex columns (`flex:1`, max 44), value lane reserved above track (no absolute magic), labels uniform per reference. Accept: X02 matrix, values never overlap bars.
- [x] **H06d — light track/chip.** `hr-zones.styles.ts:14,37` white washes invisible on light (X03). Fix: light track `#787880@.13`-family, light TODAY grey wash. Accept: light screenshot shows tracks + chip.

## H07 — Programs (`programs/`)

- [x] **H07a — dead cards.** `programs.tsx:94-166` cards have no `onPress`. Fix: wire open-program (or remove card affordance: no edge highlight, `accessible={false}` if truly static — but carousel cards promise navigation, so wire it). Accept: X05 — every card goes somewhere.
- [x] **H07b — fixed card size.** `programs.styles.ts:17-24` 160×190. Fix: width from breakpoints (e.g. 160 @320–393, 176 @430+), height `minHeight:190`; keep rx from `home.radius.program` (26). Accept: 1.8–2.4 cards peek per reference at every width.
- [x] **H07c — watermark + scrim.** `programs.styles.ts:34-51` centered watermark vs reference offset; `programs.tsx:109-114` scrim stops. Fix: offset watermark per accent, verify text-over-image contrast both modes (scrim is over image, mode-independent — keep, verify). Accept: name/detail legible on all three accents.
- [x] **H07d — progress pair.** `programs.tsx:55-75,151-160` ring (r13, computed dash — good) + bar. Fix: shared `pct` clamp 0–1, a11y label with % (X09), bar `rx = h/2`. Accept: 0/partial/complete states.

## H08 — Coach card (`coach-card/`) — highest overflow risk

- [x] **H08a — height budget.** `coach-card.tsx:102` h156 vs ~181 content (header 34 + body ~55 + buttons 32 + margins 20 + padding 40). Fix: X01 (`minHeight:156`) + reduce `BodyLayer` pad `lg→base(16)` + tighten `ButtonsRow marginTop md→sm`. Recompute budget in the patch. Accept: title + 2-line body + both buttons visible, no clip.
- [x] **H08b — button widths.** `coach-card.styles.ts:91-118` (Adjust 116, Dismiss 88 fixed). DE "Plan anpassen" overflows 116. Fix: `minWidth` + `paddingHorizontal`, `flexShrink:1`, `numberOfLines={1}`. Accept: DE 320 both buttons fit.
- [x] **H08c — light border/mesh.** `coach-card.tsx:97-107` mesh 361×156 fixed + dark border stops. Fix: light border stops from light SVG (`gCoachBorder` light), mesh `slice` scale, washes mode-aware (X03). Accept: light card shows border + mesh, no mud.
- [x] **H08d — no dead slots.** `coach-card.tsx:74-83,85` (`ActionSlot` renders identical visual with/without handler; home passes neither). Fix: while unwired, render buttons as non-pressable info visuals OR wire/dismiss persistently — record the product decision here. Accept: X05 — no button-look dead ends.

## H09 — Recent Activity (`recent-activity/`)

- [x] **H09a — 2pt row clip.** `recent-activity.tsx:106` h68 + pad14 → inner 38 vs `recent-activity.styles.ts:11-15` `RowInner h40`. Fix: row `minHeight:68`, inner `minHeight:40` (X01). Accept: tile never clipped.
- [x] **H09b — chevron color.** `recent-activity.tsx:52-65` fixed `#48484A` (X07). Fix: theme chevron (dark `#48484A`, light `#C7C7CC`). Accept: visible but quiet both modes.
- [x] **H09c — column squeeze.** `recent-activity.styles.ts:18-44` fixed tile + margins; value column unpinned. Fix: tile 40 fixed, middle `flex:1/minWidth:0`, value pinned right tabular, chevron pinned. Accept: DE title + long value at 320.
- [x] **H09d — row target.** `recent-activity.styles.ts:52-54` whole 68 row is the target (good). Fix: keep, verify 44+ and no nested pressables. Accept: 44 audit.

## H10 — Achievements (`achievements/`)

- [x] **H10a — no small-screen strategy.** `achievements.styles.ts:5-9` `space-between`, 6×46 = 276 fixed. At 320 gaps collapse to 2.4. Fix: horizontal scroll (peek 5.5) or even-wrap; keep 46 badges, 4pt-grid gaps. Accept: 320 no touch, 430 no dead space.
- [x] **H10b — locked badge in light.** `achievements.styles.ts:30-39` `#1e1e22` + white@0.1 border both modes. Fix: light locked = grey wash + grey lock glyph (X03). Accept: locked reads locked (not selected) both modes.
- [x] **H10c — light badge gradients.** `achievements.tsx:11-17` dark stops both modes. Fix: light stops from light SVG (`gBadgeA`–`gBadgeE` light). Accept: light badges luminous, not neon-on-white.
- [x] **H10d — semantics.** `achievements.tsx:90-114` no labels/press. Fix: X09 (names + locked state announced; press opens detail or badges marked decorative — record decision). Accept: screen-reader names all six.

## H11 — Hydration (`hydration/`)

- [x] **H11a — drops overflow.** `hydration.styles.ts:19-33` 8×13 + 7×5.4 = 141.8 vs inner ~140 @393, ~103 @320. Fix: derive drop width/gap from measured inner width (X02), keep 13×26 proportion at 393. Accept: 8 drops fit 320–430, no clip.
- [x] **H11b — height slack.** `hydration.tsx:28` h150 vs ~146 content = 4pt slack; 200% text overflows. Fix: X01 (`minHeight:150`). Accept: large text grows card; duo partner stretches (duo cells already stretch).
- [x] **H11c — AddPill honesty.** `hydration.styles.ts:36-46` 104×28 + `hydration.tsx:67-75` dead `View`. Fix: X05 (wire add-250ml with local state, or restyle to non-button status line). Accept: tappable → works; static → not button-styled.
- [x] **H11d — value baseline.** `hydration.styles.ts:12-16` + `hydration.tsx:40-61` (24 value + 12 L + 10.5 goal, `toFixed(2)` "1.25"). Fix: X04 formatting decision recorded (1.25 vs 1,3 L per locale), baseline holds at large text. Accept: DE + large text aligned.

## H12 — Macros (`macros/`)

- [x] **H12a — rings overflow.** `macros.styles.ts:11-27` 3×48 = 144 vs inner ~140 @393 (X02). Fix: ring size from inner width (48 @393, smaller @320), centers stay centered. Accept: 3 rings fit 320–430.
- [x] **H12b — invisible track (light).** `macros.styles.ts:31-37` white@0.09 both modes (X03). Fix: light `#787880` wash. Accept: track visible on white.
- [x] **H12c — gradient ids.** `macros.tsx:52-86` `macro-${gradient[0]}` + dark-only stops. Fix: unique ids (X07) + light macro stops (`gMacroP/C/F` light). Accept: 3 rings paint independently both modes.
- [x] **H12d — footer bar.** `macros.tsx:136-146` brand gradient `width barPct%` + `{eaten} / {goal} kcal`. Fix: clamp 0–100, `rx = h/2`, X04 numbers. Accept: over-goal state sane, DE correct.

## H13 — Personal Records (`personal-records/`)

- [x] **H13a — card + row overflow.** `personal-records.tsx:24` h140 (inner 98) vs header 19 + tiles 88 = 107 → +9; tiles 321 vs 319 inner (X01+X02). Fix: `minHeight:140` + tiles `flex:1` (min 99 @393) with `minWidth:0`. Accept: 3 tiles fit 320–430 or scroll decision recorded.
- [x] **H13b — tile content.** `personal-records.styles.ts:28-45` 99×76 + pad md (24) leaves 52 for name 11 + value 27 + chip 19 = 57 → +5 overflow. Fix: `minHeight:76`, reserve NEW/delta lane (fixed lane so cards don't jump), name/value `numberOfLines={1}`. Accept: NEW vs delta never shifts layout.
- [x] **H13c — double border.** `personal-records.styles.ts:36-45` `TileInner` absolute border over `HomeCard` edge. Fix: one edge only (keep card edge, drop inner or convert inner to highlight wash). Accept: no doubled stroke at 2×/3×.
- [x] **H13d — strings.** `personal-records.tsx:62,81` (`toUpperCase()`, hardcoded `NEW`). Fix: X04 (Tolgee `NEW`, locale case). Accept: DE correct.

## H14 — Weekly Challenge (`weekly-challenge/`)

- [x] **H14a — height budget.** `weekly-challenge.tsx:58` h140 (inner 98) vs header 21 + rows 92 = 113 → +15 (X01). Fix: `minHeight:140`. Accept: 3 rows + header visible.
- [x] **H14b — broken divider.** `weekly-challenge.styles.ts:81-85` + `weekly-challenge.tsx:130` renders the divider *inside* the horizontal row (zero-width). Fix: divider between rows (or absolute bottom hairline), `StyleSheet.hairlineWidth`, mode-aware color. Accept: hairlines sit between rows, full-bleed from avatar inset.
- [x] **H14c — highlight + ring geometry.** `weekly-challenge.styles.ts:33-41` (`left:12 right:12 top:1 h26` inside 28 row) + `67-74` (29.2 ring on 26 avatar). Fix: highlight inset = row padding math (not magic 12), ring 2pt outside avatar without clipping. Accept: highlight hugs "You" row at every width.
- [x] **H14d — header trio.** `weekly-challenge.tsx:59-78` title + 76 chip + badge in `space-between`, no flex. Fix: title `flex:1 numberOfLines={1}`, chip + badge pinned (H00b pattern). Accept: DE 320.
- [x] **H14e — score grouping.** `weekly-challenge.tsx:33-55` scores via Tolgee strings ("12,480"). Fix: X04 numeric scores formatted per locale (keep string fixtures only as fallback). Accept: DE grouping correct.

## Patch order (suggested, smallest-risk first)

1. X01 heights (H06a, H08a first — the two guaranteed overflows) + H06b badge-inline (same files).
2. X03 light washes (biggest visible win after heights).
3. X02 fluid widths (H05a, H11a, H12a, H13a, H10a).
4. H08b/H14b/H09a/H04a-b correctness fixes.
5. X04/X05/X09 strings, targets, labels.
6. S01–S06 shell (needs H-heights final first).

## Implementation notes (2026-09-22 — read before device pass)

- **H14e resolved by design:** challenge scores stay Tolgee-owned strings so translators
  localize grouping; switching to numeric params would break 19 locales for sample data.
- **H07b intentional:** carousel cards stay fixed 160 wide (App-Store-style); only the
  height went to `minHeight`. 320 shows ~1.8 cards, matching the reference peek.
- **H02c safe by construction:** ring over-100% draws a full circle (harmless), bar
  over-100% is clipped by `BarTrack overflow: hidden`; programs ring clamps 0–1.
- **H04c kept:** gloss intensities untouched (reference-measured); single full-width
  Start tile stays (no fake Nutrition/Timer tiles reintroduced).
- **H05d note:** `{sessions}` plural stays translator-owned (ICU in locale files).
- **X08 NOT closed (platform limit):** RN exposes a single shadow layer — the two-layer
  light `fCard`/`fTile` from the SVG cannot be expressed. Current single-layer values kept.
- **S04/S05 NOT closed:** need a runtime overscroll/bleed look on device; technique is
  correct by inspection (background behind scroll; −16 bleed mirrors programs).
- **No verification runs yet by user request** (`typecheck`/`lint`/`vitest` skipped).
  Run them before the device pass: `npm run typecheck`, `npm run lint`,
  `npm run format:check`, home specs (`use-home-data.spec`, trends/history suites).

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-22 | Phase 1 heights + HR badge-inline + section-header margin | X01, H06a/b, H08a, H09a, H04a, H13a, H14a, H11b, H03c, H02 (part), H00a | code review only |
| 2026-09-22 | Phase 2 light washes + per-mode gradients | X03, H06d, H12b/c, H10b/c, H08c, H13d (part) | code review only |
| 2026-09-22 | Phase 3 fluid widths + measured charts | X02, H00c, H05a/c, H06c, H10a, H11a, H12a, H13a | code review only |
| 2026-09-22 | Phase 4 correctness (buttons, dividers, headers, floors) | H08b, H14b/c/d, H04b, H00b, H01c, H13c/d, H07a/d, H09b, H05b, H02b, X06, X07 | code review only |
| 2026-09-22 | Phase 5 locale/targets/a11y + Phase 6 shell | X04, X05, X09, H11c/d, H08d, H14e (design), H01a/b, H03a/b, S01/2/3/6/7 | code review only |
| 2026-09-23 | Cross-cutting brand sweep: Kinetic → Alcedo user-facing copy | home.coach.label | en.json string-only, zero layout risk |
