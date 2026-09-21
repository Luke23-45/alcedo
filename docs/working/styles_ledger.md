# Styles Migration Ledger — Material3 → Alcedo `app/styles/` + `styled-components`

> **Purpose:** single source so the move from `app/src/hooks/useAppTheme.tsx` (Material3 `seedColor` + `@pchmn/expo-material3-theme` + `@material/material-color-utilities` HCT) to `app/styles/theme.ts` (Alcedo kingfisher tokens + `styled-components/native` + `SemanticColors`) happens page-by-page, without visual or a11y regression. This file is the checklist — update `Status` as you go.
>
> **Design source:** `app/styles/theme.ts:1` (857 lines, 6 sections) + `app/styles/theme.usage.tsx:1` (229 lines, canonical primitives) + `app/styles/styled.d.ts:12` (typed `DefaultTheme`).
>
> **Current:** `app/src/hooks/useAppTheme.tsx:1` (296 lines) provides `spacing:16` (0–64) + `font:49` (`text-2xs`..`text-4xl`) + `rounding:10` + `AppThemeColors:98` (`Material3Scheme` + `ActivityRampColors` + 13 `colorPair` orange/red… via `colorPair():277` + `activityRamp():263` HCT iterative) + `AppTheme:136` (`colors`, `colorScheme`) + `AppThemeProvider:155` (`PaperProvider` + `NavigationThemeProvider` + `MsIconSrc`). **147 files import `@/hooks/useAppTheme`** (~210 `colors.` refs, `spacing[` in 115 files) — see inventory below.
>
> Last updated: 2026-09-20 • Owner: app team — Alcedo rebrand, best-quality path

---

## 0. Design tokens at a glance (`app/styles/theme.ts`)

**1. Primitives `palette:27`:** `ink:29` 0→1000 (0 `#FFFFFF` 1000 `#02040A` trench), `kingfisher:49` 50-900 (600 `#0A76C2` tint, 700 `#0A5C9C`), `cobalt:63` (600 `#0B2CC8` wing, 900 `#051A80`), `turquoise:77` (400 `#35E0D6` recovery), `ember:90` (300 `#FFAE3C` beak, 650 `#CE4A08` CTA 4.56:1, 700 `#B92403`). `systemColors:111` iOS verbatim, for destructive/system uses only.

**2. Typography `textStyles:192`:** iOS Large-type scale (`largeTitle 34/41` … `caption2 11/13`) + Alcedo `metricXL 64/68 bold rounded`, `metricL 40/44`, `metricM 22/26`, `metricUnit 15/20` + `tabularNumbers:223` for timers. Helpers `type(theme,name):813`, `scaleType():834` (clamp 1.6), `fontWeight:162` strings.

**3. Metrics `space:230` 4pt grid (`xs 4` `base 16` `huge 56`), `radius:249` 6→sheet 24→full 9999 (always `borderCurve:'continuous'` on iOS), `borderWidth:263`, `layout:272` (touch 44, navBar 44, tabBar 49, listRow 44→TwoLine 60, separatorInset 16, screenPadding 16/20, sectionGap 32), `zIndex:294`, `opacity:306` (pressed 0.72), `motion:320` (spring `press/enter/sheet/bouncy` + easing).

**4. Semantic `SemanticColors:362`:** `background:363` (base/secondary/tertiary/grouped/elevated/scrim), `content:375` (primary/secondary/tertiary/quaternary/inverse/onAccent/onTint), `interactive:385` (tint `kingfisher600`, tintPressed 700, accent `ember650`, accentPressed 700, accentBright 500 graphics-only, disabled), `fill:397` (primary→quaternary `rgba(104,119,143,0.18…)`), `border:403` (hairline `rgba(28,42,64,0.16)`), `status:411` (Tone base/content/surface/border), `zone:416` (recovery→max), `graph:423` (grid/axis/series[6]). `lightColors:431` vs `darkColors:498` (dark `background.base #02040A`, `elevated #141E2F`, `onTint #04121D`).

**5. Components `components:696`:** `button height 32/44/50 radius sm/lg/xl`, `input 44`, `card padding 16 radius 16`, `listRow 44→60`, `sheet radius 24`, `tabBar 49 icon 26`.

**6. Assembly `createTheme():776`:** `(mode, platform) → AppTheme:752` (isDark, `color: SemanticColors`, `palette/system/font/text/space/radius/layout/motion/elevation/material:633/lightMaterials:633/darkMaterials:642/gradient:661 trench/crown/breast/wing/material`). Shadows `lightElevation:599` vs `darkElevation:608` (dark is hairline, not shadow).

---

## 1. Token mapping — old → new (mechanical, do not eyeball)

| Old (`useAppTheme.tsx`) | New (`theme.ts`) | Notes |
|---|---|---|
| `spacing[0]=0 … spacing[64]=256` | `space:230` (`none 0` `xs 4` `sm 8` `md 12` `base 16` `lg 20` `xl 24` … `giant 72`) | `spacing[2]=8→space.sm`, `[4]=16→space.base`, `pageHorizontalMargin 16→layout.screenPadding:285` |
| `spacing.pageHorizontalMargin:17` | `layout.screenPadding:285` / `screenPaddingRegular:287` | Use `layout` not literals |
| `rounding.roundedRectangleRadius 10` etc | `radius:249` (`md 10` `lg 12` `xl 16` `sheet 24`) | Always `borderCurve:'continuous'` |
| `font['text-sm'] 14/20` … `text-4xl 40/50` | `textStyles:192` (`body 17/22` `subheadline 15/20` `footnote 13/18` `caption1 12/16` …) via `type(theme,'body'):813` | Map `text-sm→footnote`, `text-base→body`, `text-xl→title3`, `text-2xl→title2` etc.; metrics use `metricXL/L/M` |
| `colors.primary, secondary, surface, onSurface, surfaceContainer…` (Material3Scheme) | `color.interactive.tint:452` (`kingfisher600` / `kingfisher300` dark), `color.background.base:433/500`, `color.content.primary:443/510` | Most of ~210 refs: `primary→tint`, `onPrimary→onTint/onAccent`, `surface→background.base`, `surfaceContainer→background.secondary`, `onSurface→content.primary`, `onSurfaceVariant→content.secondary`, `outline→border.hairline`, `outlineVariant→border.hairline`, `error→status.danger.base` |
| `colors.orange/onOrange, red/onRed … 13 pairs` via `colorPair():277` | `palette.*` + `systemColors:111` | Brand moments use `palette.ember[650]` directly; system destructive stays `systemColors.red` |
| `colors.activityLevel1..4 / onActivityLevel1..4` via `activityRamp():263` (HCT tones 92/80/62/45 light, 28/40/55/72 dark) | `zone:416` + `graph:423` or keep HCT ramp but seed `color.interactive.tint` hue via `palette.kingfisher[600]` | Decision: either port `activityRamp` into `theme.ts` (reads `tint` hue) or replace calendar dots with `zone/graph.series` |
| `colors.seedColor:127` / `sourceColor` (android tonal, ios `schemedTheme.primary`) | `palette` is fixed — no seed; `theme-chooser.tsx:34` 8 seeds → `palette` swatches | Delete or map seed → accent choice |
| `colors.scheme:129` | `AppTheme.mode/isDark:753` + `color.content` | |
| `elevation` (shadow) from `floatingShadowStyle` | `lightElevation:599` / `darkElevation:608` + `color.background.elevated:439/506` (dark is hairline, not shadow per `566`) | On dark, do not rely on shadow opacity 0.36→0.60 |
| `material` intensity fallback | `lightMaterials:633` / `darkMaterials:642` (`ultraThin`…`chrome`) for blur | `expo-blur` + `color.border` |
| `gradients` (ad-hoc) | `gradients:661` (`crown` 3-stop `cobalt600→kingfisher500→turquoise400`, `breast`, `wing`, `trench`) | Headers/hero use `crown`, progress `breast`, background `trench` |

> Rule: never `colors.primary+'CC'` string hacks — use `alpha(hex,value):850`.

---

## 2. Dependencies & config ledger

| # | What | File | Current | Target | Status |
|---|------|------|---------|--------|--------|
| S0 | Location | `app/styles/*` | outside `src/` | move to `app/src/styles/` so `@/styles/*` resolves, or add `app/styles` to `tsconfig.json:17 include` + `paths` | ☑ Done — copied `app/styles/{theme.ts,theme.usage.tsx,styled.d.ts:12}` → `app/src/styles/` (both locations kept) |
| S1 | Deps | `app/package.json:28` | `react-native-paper 5.15.3`, `@pchmn/expo-material3-theme 1.4.0`, `@material/material-color-utilities` | add `styled-components ^6.1.8` + `babel-plugin-styled-components` (web) | ☑ Done — `styled-components ^6.1.8` added `app/package.json:102` |
| S2 | Babel | `app/babel.config.js` | `react-compiler`, `inline-import` | add web `plugins: ['babel-plugin-styled-components']` if `platform==='web'` | ☐ Deferred — RN needs no plugin, web plugin added later if needed |
| S3 | Types | `app/styles/styled.d.ts:12` | augments `styled-components/native` | keep, ensure `tsconfig.json` `include` covers it; `app/src/styles/styled.d.ts` after move | ☑ Done — `app/src/styles/styled.d.ts` augments `DefaultTheme extends AppTheme:753` |
| S4 | Lint | `app/.eslintrc` | `react-compiler` only | optional `eslint-plugin-styled-components` later | ☐ Pending — deferred to Phase 9 |
| S5 | Generation | `app/assets` | `sharp` for branding | already `sharp 0.35.4` in `package.json:127` | ☑ Done |

---

## 3. File inventory — 147 files import `useAppTheme` (~210 `colors.`)

All paths absolute `C:\Users\Hellx\Documents\Programming\python\Project\personal\LiftLog\app\src\…`

| Group | Files | Themed | Top usage | Effort |
|-------|-------|--------|-----------|--------|
| **App shell** | `app/_layout.tsx`, `app/(tabs)/_layout.tsx` (2) | 2 | `PaperProvider` 7 keys + `seedColor Host` 15 | **High** — provider swap blocks all |
| **Foundation** | `components/presentation/foundation/*` (80) | 45 | `spacing` 45, `rounding` 11, `seedColor` 15 | **High** — blocks all pages |
| **Layout** | `components/layout/{full-height-scroll-view,stack-with-header}` (2) | 2 | `surface→background.base` | Low |
| **Calendar** | `components/presentation/calendar/*` (6: `activity-colors.ts`, `activity-calendar`, `activity-day-cell`, `activity-week-cell`, `activity-legend`, `week-activity-strip`) | 3 | `activityLevel`, `teal/orange` | Medium — ramp decision |
| **Stats** | `components/presentation/stats/*` (10: `line-graph-props`, `session-stat-graph-card`, `statistic-{line,bar}-chart`, `reps-bar-chart`, `single-value-statistic-card`, `bodyweight-stat-graph-card`, `weighted-exercise-*`) | 6 | `primary` 11-color array | Medium — graph mapping |
| **Workout** | `components/presentation/workout*` + `workout-editor/*` (26) | 22 | `spacing[2]` ×35, `font` 8, `rounding` 6 | **High** — timer/shadow |
| **Other presentation** | `presentation/{feed,ai-planner,backends,summary}` (15) | 8 | `spacing` | Low |
| **Smart** | `components/smart/*` (25: `welcome-wizard`, `whats-new-banner`, `feed*`, `history-activity-calendar`, `session-component`…) | 14 | `secondaryContainer`, `tertiaryContainer`, `activityLevel` | Medium |
| **Routes tabs** | `app/(tabs)/*` (46: `(session)/index`, `history/*`, `stats/*`, `feed/*`, `settings/*`, `manage-workouts/*`) | 22 | `surfaceContainer`, `spacing` | Medium |
| **Hooks** | `hooks/useAppTheme.tsx`, `useScrollListener.tsx` (2) | 2 | `elevation`, `scheme` | **High** — bridge |
| **Total** | ~214 files in `app/src` | **147** | `spacing[` 115 files | |

> Candidate “page” units for the ledger (one PR each, no mixing):
> `tabs/(session)`, `history`, `stats`, `feed`, `settings/*` (each sub-route),plus `foundation` and `layout` as shared.

---

## 4. Phased execution — one phase/PR, one set of pages, no compromise

### Phase 0 — Setup (no UI change, just plumbing)

| # | File | Action | Status |
|---|------|--------|--------|
| 0.1 | `app/package.json` | add `styled-components`, web `babel-plugin-styled-components` | ☑ Done — `styled-components ^6.1.8` |
| 0.2 | `app/styles/` → `app/src/styles/` | move `theme.ts:1`, `theme.usage.tsx:1`, `styled.d.ts:12`; update `ThemeProvider` import path | ☑ Done — copied to `app/src/styles/` (`@/styles/theme` now resolves) |
| 0.3 | `tsconfig.json` | ensure `src/styles` in `include`, `@/styles/*` path, `styled.d.ts` covered | ☑ Done — `**/*.ts` includes `src/styles`, `@/*→src/*` covers `@/styles/theme:10` |
| 0.4 | `app/src/styles/theme.ts` | optional: port `activityRamp():263` HCT helper into new `theme.ts` (read `color.interactive.tint` hue) vs use `zone/graph` — decide here | ☐ Deferred — kept legacy `activityRamp:263` inside `useAppTheme.tsx` harmonized to `alcedo.color.interactive.tint` for now |
| 0.5 | Verify | `npm run typecheck` (`tsgo --noEmit`), `npm run lint` green | ☐ Deferred — per instruction no test run |

### Phase 1 — Provider bridge (blocks everything)

| # | File | Action | Status |
|---|------|--------|--------|
| 1.1 | `app/src/hooks/useAppTheme.tsx:155` | rewrite `AppThemeProvider` to `createTheme(mode, platform):776` (`mode` from `themeMode:158` + `systemColorScheme:160`, `platform` from `Platform.OS`), memoised. Keep `Appearance.setColorScheme` | ☑ Done — `createTheme(colorScheme, Platform.OS as AlcedoPlatform):776` memoised + `trueBlack` override `#000000` |
| 1.2 | `hooks/useAppTheme.tsx:238` | wrap `ThemeProvider (styled) > PaperProvider > NavigationThemeProvider`; derive `paperTheme` from `alcedo.color.background`/`content` (keep `MD3LightTheme` shape but fill from `lightColors:431`/`darkColors:498`), `navigationTheme` from `paperTheme` | ☑ Done — `StyledThemeProvider` outer, `paperTheme` maps `primary→color.interactive.tint:452`, `background→background.base:433` etc., `navigationTheme` from `paperTheme` |
| 1.3 | `hooks/useAppTheme.tsx:10` | create compat shim so old `colors.primary` etc. keep compiling: `primary→color.interactive.tint:452`, `onPrimary→color.content.onTint`, `surface→color.background.base`, `onSurface→color.content.primary`, `outline→color.border.hairline:466`, etc. Export both `useAppTheme()` (compat) and `useTheme<AppTheme>()` (styled) | ☑ Done — `AppTheme:136` now `{colors: AppThemeColors, colorScheme, alcedo: AlcedoTheme:752}` + `useAlcedoTheme():753` + `spacing:16`/`font:49`/`rounding:10` kept for compat, `seedColor` now `Platform.select tint` |
| 1.4 | `app/src/app/_layout.tsx:37` | keep `<AppThemeProvider>` in same place; verify `seedColor` Hosts still receive `Platform.select android→undefined/ios→alcedo.color.interactive.tint` | ☑ Done — `_layout.tsx:37` unchanged, `seedColor` now `alcedo.color.interactive.tint` for both platforms |

*Exit:* `rg -n "from '@/hooks/useAppTheme'" app/src | wc -l` unchanged count, but `styled ThemeProvider` mounts; `npx expo export` bundles.

### Phase 2 — Foundation primitives (unlocks all pages)

`components/presentation/foundation/*` (45 themed) — do in one PR, smallest surface, biggest leverage.

| # | Primitive | Old tokens | New | Status |
|---|-----------|------------|-----|--------|
| 2.1 | `Text` (`surface-text.tsx:11` `font:49` + `ColorChoice`) | `font['text-sm']` etc. | `theme.usage.tsx:48 Text` `variant: TextVariant` + `Tone` via `type():813` + `tabularNumbers:223` | ☑ Done — `surface-text.tsx:1` legacy `FontChoice→TextStyleName` map (`text-base→body` etc.) + `resolveColor:14` (`onSurface→content.primary`, `primary→tint`, `error→status.danger.content`) via `type(theme,variant)`, `item-title.tsx:1` `title3` + `weight-format.tsx:1` same |
| 2.2 | `Card` (`card-list.tsx`, `glass-background.tsx:16`) | `colors.surfaceContainer` + literal radius 10 | `Card:153` `background.elevated` + `elevation.sm:602` (dark hairline `borderWidth.thin` `border.hairline`) + `components.card.radius 16` | ☑ Done — `card-list.tsx:1` `spacing[2]→theme.space.sm:8`, `glass-background.tsx:16` `colorScheme→theme.mode` |
| 2.3 | `Button` (`native-button*`, `page-actions*`) | `primary/onPrimary`, `secondaryContainer`, hardcoded 44pt | `Button:84` `variant accent/tint/subtle/plain` + `size sm/md/lg` `components.button.height 32/44/50` + `motion.spring.press:331` + `hitSlopFor():844` | ☑ Done — `native-button.tsx:25` + `.android.tsx:17` `seedColor/scheme→theme.color.interactive.tint/mode`, `tint` `filled→accent` else `tint`, `spacing[2]→space.sm` |
| 2.4 | `Segmented/List` (`segmented-list.tsx:87`, `switch`, `select-picker`, `menu*`, `pager.tsx:39`) | `secondaryContainer/onSecondaryContainer`, `rounding.segmentedBetweenRadius` | `fill.secondary:460` + `border.hairline:466` + `radius.lg 12` + `borderCurve:'continuous'` | ☑ Done — `segmented-list.tsx`, `switch/*`, `select-picker/*`, `menu/*`, `pager.tsx` migrated to `interactive.tint`, `mode`, `border.hairline`, `space.*` |
| 2.5 | `Separator` | `hairlineWidth` + `outlineVariant` | `Separator:177` `color.border.hairline` + `layout.separatorInset 16` | ☑ Done — `Separator:177` in `theme.usage.tsx` |
| 2.6 | `StatusChip` | ad-hoc error/success | `StatusChip:187` `Tone` `status.success/warning/danger/info:411` via `ChipSurface:195` | ☑ Done — `StatusChip:187` in `theme.usage.tsx` |
| 2.7 | Editors (`color-picker-dialog 70`, `theme-chooser 34`, `duration-editor 22`, `weight-display 3`) | `createMaterial3Theme` + `colorSchemeSeed` | `palette:27` swatches (`kingfisher600`, `cobalt600`, `turquoise500`, `ember650`) + `trueBlack→palette.ink[1000]` | ☑ Done — `color-picker-dialog.tsx`, `theme-chooser.tsx` (brand palette swatches), `duration-editor.tsx`, `weight-display.tsx` migrated to pure Alcedo tokens |

*Exit:* Foundation Storybook/visual diff light/dark at 1.0×/1.6× `fontScale`, 44pt touch.

### Phase 3 — Layout scaffolding

| # | File | Old | New | Status |
|---|------|-----|-----|--------|
| 3.1 | `components/layout/full-height-scroll-view.tsx:26` `colors.surface` | `surface` | `background.base` | ☑ Done — `surface → background.base` |
| 3.2 | `components/layout/stack-with-header.tsx:17` `colors.surfaceContainer` | — | `background.secondary` | ☑ Done — `surfaceContainer → background.secondary`, `surface → background.base` |
| 3.3 | `app/(tabs)/_layout.tsx:9` tabBar `colors` 11 refs | `primary`, `outline`, `surface` | `interactive.tint`, `border.hairline`, `background.base` + `tabBar:730 height 49 icon 26` | ☑ Done — `NativeTabs` mapped to `fill.secondary`, `alpha(content.primary, 0.1)`, `background.base`, `content.secondary` |

### Phase 4 — Session / Workout (hottest path — timers, glass, rings)

`app/(tabs)/(session)/index.tsx`, `session/post-workout.tsx` + `components/presentation/workout*` (26) + `smart/session-*`

| # | File | Old | New | Status |
|---|------|-----|-----|--------|
| 4.1 | `timer-pane.tsx:33` `spacing[5]=20` + `surfaceContainerHigh` + `floatingShadowStyle` + `ColorChoice` | spacing, surface, shadow | `space.lg 20`, `background.elevated`, `elevation.sm`, `content.primary` + `gradient.breast` for fills, `alpha()` not `+ 'CC'` | ☑ Done — `timer-pane.tsx` already `space`/`elevated`/`elevation.sm`/`alpha` (2026-09-20) |
| 4.2 | `rest-timer-controls*` / `cardio-timer-controls*` (android + ios splits) `Host seedColor` | `seedColor` | `color.interactive.tint` + `mode` | ☑ Done — `rest-timer-controls.tsx:23` + `.android.tsx:18` + `cardio/cardio-timer-controls*.tsx:18` `seedColor={theme.color.interactive.tint} colorScheme={theme.mode}` + `space.xs` |
| 4.3 | `cardio-value-tile:45` `spacing[20]=80` | huge spacing | `space.giant 72` or literal 80 (keep) + `metricM/Unit` typography | ☑ Done — `cardio-value-tile.tsx:51` `typeHelper(theme,'title3')` + `space.md/sm` + `radius.md` + `fill` tokens |
| 4.4 | `potential-set-display/counter`, `weighted-exercise`, `cardio-exercise` | `spacing`, `rounding`, `font` | `space/radius` + `type('metricM')` + `border.hairline` | ☑ Done — `potential-set-display.tsx:70` `radius.md`/`tint`/`fill`/`typeHelper`, `potential-set-counter.tsx:45` `radius.lg`/`space.sm/xs`, `weighted-exercise.tsx:43` `space.sm`, `cardio-exercise.tsx:57` `space.base/sm` + `status` |
| 4.5 | `session-component.tsx:57` `font['text-xl']` | font bag | `type('title3')` | ☑ Done — `session-component.tsx:192` `typeHelper(theme,'title3')` + `space.sm/base/2xl` + `layout.screenPadding` + `content.primary`/`tint`; `session-workout-editor.tsx:61` `layout.screenPadding`/`space.sm`; `session-diff-save.tsx:138` `space.sm`/`layout.screenPadding`; `(session)/index.tsx:67` `space.sm/base/xxl`/ `content.secondary` + `(session)/session/post-workout.tsx:70` `space.base` |
| 4.6 | `session-diff-view.tsx:171` `theme = useAppTheme()` raw | — | typed `AppTheme` + `status.*` tones | ☑ Done — `session-diff-view.tsx:23` `theme = useAppTheme()` + `space.base/sm` + `status.success/danger.base` for `added`/`removed` |

### Phase 5 — History / Calendar

`app/(tabs)/history/{index,edit,post-workout}` + `calendar/*` + `smart/history-activity-calendar`

| # | File | Old | New | Status |
|---|------|-----|-----|--------|
| 5.1 | `activity-colors.ts:1` `AppThemeColors` + `activityLevel` ramp | HCT ramp `activityRamp:263` | `palette.kingfisher` brand ramp (100/300→600/700) + `onTint`/`ink1000` contrast, `markerColor` → 8 Alcedo swatches | ☑ Done — `activity-colors.ts:1` `levelColor(level, theme: AppTheme)` `palette.kingfisher[100/300/600/700]` + `markerColor(userId, theme)` `MARKER_PALETTE(theme)` (kingfisher/cobalt/turquoise/ember) |
| 5.2 | `activity-day-cell:30`, `activity-week-cell:18`, `activity-legend:14`, `activity-calendar:2` | `primary`, `outlineVariant`, `teal/orange` dots | `palette`/`zone` + `border.hairline` + `space` | ☑ Done — `activity-day-cell.tsx:30` `levelColor(cell.level,theme)`/`markerColor(id,theme)` + `tint`/`hairline`/`secondary`; `activity-week-cell.tsx:18` `radius.sm`+`elevated`+`tint`; `activity-legend.tsx:37` `space.xs/md`+`hairline`+`palette.turquoise/ember`; `activity-calendar.tsx:73` `space.xs` + `week-activity-strip.tsx:43` `space.xs` |
| 5.3 | `history/index.tsx:14` `spacing[2,4]` | spacing array | `space.sm/base` | ☑ Done — `history-activity-calendar.tsx:87` `space.sm/md`+`radius.md`+`elevated`+`accent`; `history/index.tsx:124` `layout.screenPadding`+`space.sm/base`; `history/edit.tsx:81` `layout.screenPadding`; `history/post-workout.tsx:63` `space.base`+`layout.screenPadding` |

### Phase 6 — Stats (graphs)

`app/(tabs)/stats/{index,expanded-weighted-exercise}` + `presentation/stats/*`

| # | File | Old | New | Status |
|---|------|-----|-----|--------|
| 6.1 | `line-graph-props.ts:1` `AppThemeColors` 15 colors | `textColor`, `rulesColor`, `referenceLineColor` | `content.primary`, `border.hairline`, `status.*.base` + `graph.grid/axis` | ☑ Done — `line-graph-props.ts:4` `(theme:AppTheme,width,points)` `text→content.primary`, `axis→graph.axis`, `rules→graph.grid`, `reference→interactive.tint` |
| 6.2 | `session-stat-graph-card:18` 11-color array | `primary + 'CC'` etc. | `graph.series[6]` + `zone` ordered, `alpha(tint,0.8)` | ☑ Done — `session-stat-graph-card.tsx:19` `pointColors=[...graph.series, zone.recovery/muscle/strength/peak/threshold]` (11), `space.sm/xs`+`hairline`+`content.primary`, `lineGraphProps(theme,width)` |
| 6.3 | `statistic-{line,bar}-chart:19`, `reps-bar-chart:12` | `primary + 'CC'` | `alpha(theme.color.interactive.tint,0.18)` + `fill` tokens | ☑ Done — `statistic-line-chart.tsx:61` `tint`+`alpha(tint,0.1)` fill, `space.xs`+`elevated`+`hairline`, `statistic-bar-chart.tsx:45`+`reps-bar-chart.tsx:34` `alpha(tint,0.8)`+`space.sm`+`lineGraphProps(theme,width)` |
| 6.4 | `single-value-statistic-card:15` etc. | spacing | `space/radius` | ☑ Done — `single-value-statistic-card.tsx:22` `space.xs/base/sm`+`tint`, `single-value-statistics-grid.tsx:8` `space.sm`, `titled-section.tsx:14` `layout.screenPadding`+`space.sm`, `weighted-exercise-stat-summary.tsx:22` `space.base/sm`, `weighted-exercise-list-searcher.tsx:31` `layout.screenPadding`+`space.sm`, `bodyweight-stat-graph-card.tsx:22` `tint`+`space.sm`+`lineGraphProps(theme)`; `stats/index.tsx:33`+`expanded-weighted-exercise.tsx:37` `space.sm/base/xxl`+`background.secondary` |

### Phase 7 — Feed

`app/(tabs)/feed/*` + `smart/feed*` + `presentation/feed/*`

| # | File | Old | New | Status |
|---|------|-----|-----|--------|
| 7.1 | `feed.tsx:169` `outlineVariant` border | — | `border.hairline` | ☑ Done — `smart/feed.tsx:199` `borderTopColor theme.color.border.hairline` + `space.sm/md`+`layout.screenPadding`+`space.xxl` |
| 7.2 | `reaction-bar:20` `secondaryContainer` | — | `fill.secondary` + `interactive.tint` | ☑ Done — `smart/reaction-bar.tsx:56` `gap theme.space.xs` `padding xs/md` `border tint/hairline` `bg fill.secondary` |
| 7.3 | `person-avatar:21` `ColorChoice` | — | `Tone` | ☑ Done — `presentation/feed/person-avatar.tsx:20` `AVATAR_COLORS→palette` (`turquoise400/cobalt400/kingfisher600/ember300/cobalt600/ember500/success/brown` etc.) `foreground onTint/ink1000`, removed `ColorChoice` |
| 7.4 | Others (`feed-item`, `feed-week-strip`, `shared-item`, `who-else-trained-card`) | `spacing` only | `space/layout` | ☑ Done — `feed-item.tsx:61` `layout.screenPadding`+`space.sm/md/xs`+`hairline`; `feed-week-strip.tsx:35` `space.sm`+`layout`; `shared-item.tsx:61` `layout.screenPadding`+`space.sm`; `who-else-trained-card.tsx:28` `space.sm`; `person-card.tsx:24` `space.md/xxs`; `reaction-summary.tsx:67` `space.xs/sm`; `feed-following.tsx:39`+`feed-followers.tsx:83` `space.sm/base/xs`; `share.tsx:59` `layout.screenPadding`+`space.base/sm` |

### Phase 8 — Settings & system

`app/(tabs)/settings/*` (10+ routes) + `components/smart/{welcome-wizard,whats-new-banner}` + `editors/theme-chooser`

| # | File | Old | New | Status |
|---|------|-----|-----|--------|
| 8.1 | `settings/index.tsx:21` `colors.primary`, `onSurfaceVariant` link | — | `interactive.tint` + `content.secondary` | ☑ Done — `settings/index.tsx:21` `primary→tint:452` `onSurfaceVariant→content.secondary:444` `onSurface→primary`, `gap sm`, `layout.screenPadding` |
| 8.2 | `whats-new.tsx:40` `secondaryContainer/onSecondaryContainer` | — | `status.info.surface/content` or `fill.secondary` | ☑ Done — `whats-new.tsx:40` `secondaryContainer→fill.secondary:461` `onSecondaryContainer→status.info.content:475` `pageHorizontalMargin→layout.screenPadding` `gap md/sm:235` |
| 8.3 | `ai/planner.tsx:32` `surface`, `spacing[2]` | — | `background.base`, `space.sm` | ☑ Done — `ai/planner.tsx:28` `COMPOSER_GAP 8 (sm)`, `gap xxs:232/md/base`, `surface→background.elevated:439` `layout.screenPadding`, `chat-bubble.tsx:36` `primary→tint` `surfaceContainerHighest→elevated` `padding md/base:235` `radius xs/md` |
| 8.4 | `backends/*` `error→red` | — | `status.danger.base` | ☑ Done — `backends/index.tsx:101` `error→status.danger.base:474` `backend-header-editor.tsx:38` `onSurfaceVariant→secondary` `gap sm` |
| 8.5 | `backup-and-restore/*` `emStyles` error | — | `status.danger` Tone | ☑ Done — `backup-and-restore/index.tsx:128` `emStyles danger.content:472` `error→status.danger.base` |
| 8.6 | `welcome-wizard:76` + `whats-new-banner:17` `secondaryContainer` chips | — | `fill`/`status` | ☑ Done — `welcome-wizard.tsx:237` `surface→background.elevated` `pageHorizontalMargin→layout.screenPadding` `gap base/md/xl/xxl`; `whats-new-banner.tsx:31` `tertiaryContainer→status.info.surface:475` `onTertiaryContainer→status.info.content` `tertiary→info.base` `onTertiary→info.content` `padding base/md` `gap xs/md` |
| 8.7 | `theme-chooser.tsx:34` 8 material seeds | `@pchmn/expo-material3-theme` | `palette` swatches (`kingfisher600` `cobalt600` `turquoise400` `ember650`) persisted as `settings.accentChoice` (replace `colorSchemeSeed`) — product decision | ☑ Done — `theme-chooser.tsx:111` `PRESET_SEEDS 8→kingfisher600/cobalt600/turquoise400/ember650/ember300/success/danger/ink1000` `theme.space/radius/border.hairline` already pure (no `@pchmn` seed) |

### Phase 9 — Cleanup

| # | Task | File | Status |
|---|------|------|--------|
| 9.1 | Delete shim `hooks/useAppTheme.tsx` legacy `spacing/font/rounding/activityRamp/colorPair` or keep 1 release as `deprecated` re-export | `hooks/useAppTheme.tsx:10-47 + 252-296` | ☐ Pending |
| 9.2 | Remove deps if unused: `react-native-paper` `MD3LightTheme` (keep `react-native-paper-dates` if still used), `@pchmn/expo-material3-theme`, `@material/material-color-utilities` | `package.json:38,58` | ☐ Pending |
| 9.3 | Delete `components/presentation/foundation/floating-shadow.ts` (replaced by `elevation:599`) | — | ☐ Pending |
| 9.4 | Update `docs/index.md` (add `app/src/styles/theme.ts` docs) | `docs/index.md:6` | ☐ Pending |
| 9.5 | Final verify | `npm run typecheck` (`tsgo --noEmit`), `npm run lint`, `npm run test`, `npx expo-doctor`, `npx expo export --platform android`, Maestro + light/dark/trueBlack/system + Dynamic Type 1.0→1.6 + Reduce Motion + RTL | ☐ Pending |

---

## 5. Anti-patterns — do not ship

- Never `colors.primary + 'CC'` — use `alpha(hex,0.8):850` or a `fill` token.
- Never hand-set `fontSize` — use `type(theme,'body'|'metricM'):813`.
- Never `useMemo`/`useCallback` in render — React Compiler is on (`app.json:56` `reactCompiler:true`).
- Never `spacing[7]=28` literal arithmetic — use `space.md:12` etc. (`space[7]` no longer exists; `space` is not an array).
- Dark shadows are invisible — use `color.background.elevated:506` + `border.hairline:534`, not `elevation.xl` opacity 0.60.

---

## 6. How to work this ledger

- Do phases in order — Phase 1 blocks all, Phase 2 blocks all pages. Do not start a page before its foundation token is ready.
- Inside a phase, finish one “page” PR before starting the next — `rg -n "from '@/hooks/useAppTheme'" app/src | wc -l` must shrink per phase, never grow.
- Visual diff per phase in both `light` and `dark` (`trueBlack` on/off), iOS 16+ `borderCurve:'continuous'` check, and `PixelRatio.getFontScale() 1.6` clamp per `scaleType():834`.
- This file lives at `docs/working/styles_ledger.md` — not shipped. If you add/remove a doc, update `docs/index.md` in same change (`AGENTS.md`).

---

## 7. Open decisions (resolve at Phase 0.4 / 8.7)

| # | Question | Options | Default |
|---|----------|---------|---------|
| Q1 | `activityLevel` HCT ramp — keep iterative HCT or switch to `zone/graph`? | Keep HCT seeded by `tint` hue (most faithful) vs `zone.recovery…max` (simpler) | Keep HCT, port to `theme.ts` |
| Q2 | `colorSchemeSeed` — keep 8 seeds or replace? | Delete (Alcedo fixed) vs map seeds → `palette` swatches (`kingfisher`, `cobalt`, `turquoise`, `ember`) | Map to `palette` |
| Q3 | Keep `react-native-paper` for any screens? | Keep for `dates` picker only vs full removal after Phase 9.2 | Keep `paper-dates` only |
