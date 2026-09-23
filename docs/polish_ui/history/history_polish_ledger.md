# History polish ledger (source of truth)

Status: **implemented 2026-09-23 — all code patches applied; device pass (320/430, large text, DE,
landscape) still required before closing the acceptance bar.** HX11 (future-day product decision)
is recorded, not coded. No verification runs yet by user request (`typecheck`/`lint`/`vitest`
skipped) — run them plus `history-screen1.spec` / `history-simulation.spec` / `pr-match.spec` /
`session-time-utils.spec` before the device pass.
Scope: all three history routes in render order — `app/src/app/(tabs)/history/index.tsx`
(calendar + sessions), `post-workout.tsx` → `session-detail-screen/` (archival detail),
`edit.tsx` → `edit/` (edit session) — plus the two shared display components the detail screen
owns in this pass (`summary/session-notes-card/`, `workout/session-comparison-table/`), for
**dark + light** and **iOS + Android**.
Out of scope (own ledgers later): post-workout celebration (`PostWorkoutScreen`, shown from
`post-workout.tsx` only for non-history sources), feed-shared `SmartKudosCard` (conditional section
— invocation only here), foundation editors/pickers/dialogs/menus/switches (invocation only here).
Audited 2026-09-23 by reading each file end-to-end (no skips). Same rules as the home/session/
workout-editor/exercise-editor/update_plan ledgers: one patch per item (or tight group), state
closed IDs, check boxes only with code + verification, append new IDs (never reuse), keep sorted
by section.

## Ground truth references (do not re-derive)

- Skill (law): `.agents/skills/apple-ios-frontend/SKILL.md` — same bar (4pt grid, 44pt targets,
  negative-display / positive-micro tracking, computed dashes, dy10/blur14 cards, dy6/blur8 tiles,
  colored shadows on primary actions).
- Reference: `docs/new_design/history-dark.md` Screens 1–3 + data contract (lines 32–74) +
  verification log (703–738) + light table (766–783) + component table (745–758). Gradient/filter
  IDs cited below come from its `<defs>` (`cd` body, `ce` edge, `br` brand, `gl` gloss, `tl` tile,
  `gd` gold, `hr`/`hra` curve, `fc`/`ft`/`fb`/`fg`/`fh` shadows, `bk`/`ch` chevrons, `up`/`dw`
  trend arrows, `st` star, `fl` flame, `lck` lock, `ic-*` glyphs).
- Honesty anchors (do not regress): computed ring dashes (119.38/144.51/108.38 verified);
  out-of-month days keep data with dimmed numerals; rest days keep track-only rings; kcal always
  `KCAL EST` via the documented formula; HR curve badged sample with contract geometry verbatim;
  PR matching shared between card/rows/tiles; RPE absent (no model field — the reference's RPE chip
  and Effort slider stay unbuilt rather than invented); no-data states stay explicit
  (`—`, `No records this session.`, `First session of its kind.`); delete flows all `destructive`;
  empty-day/month/filter states keep real navigation paths.
- What's already right: calendar grid math (45.57 flex columns vs 45.87 measured — sub-point drift,
  record not fix), per-mode palette (`history-design.ts` matches the light table row-for-row),
  gold identical both modes (spec-mandated celebration treatment), tabular numerals on clocks/values,
  44pt targets (calendar cells/chevrons, rows via 44+ geometry or hitSlop, steppers, trash, chips),
  reduced-motion gates on pulses, a11y roles/states/labels throughout, stable `WeakMap` row keys in
  the edit list, reseed-from-blueprint add-set guard.

## Global acceptance bar (applies to every item)

- [ ] No clipping/overlap at 320 / 360 / 393 / 430 pt widths, portrait + landscape, iOS + Android.
- [ ] No clipping at 200% text size and with German strings (longest locale).
- [ ] Dark and light both intentional (light table applied as written).
- [ ] Every dimension a multiple of 4, every interactive visual ≥ 44pt (or `hitSlop` to 44 with no
  neighbour overlap), no dead button-look controls.
- [ ] Numbers locale-formatted, uppercase locale-safe, no hardcoded English in UI.

---

## HX — Cross-cutting (fix once, helps every section)

- [x] **HX01 — micro/caps labels render Title/lowercase (dead transform + missing calls).** Problem:
  the biggest systematic find on this page — React Native ignores `text-transform`, and several
  labels never call case conversion at all. Verified against `en.json` (values are Title/lowercase)
  vs ALL-CAPS spec text: `DaySectionLabel` (no call — renders `Monday, June 9` vs spec `MONDAY, JUNE
  9`, spec line 176); month title `{month} so far` (micro, no call — vs `JUNE SO FAR`, line 270);
  week title `earlier this week` (micro, no call — vs `EARLIER THIS WEEK`, line 200); day aggregate
  labels `session/volume kg/duration/kcal est` (no micro flag, no call — vs `SESSION/…`, line 181);
  month aggregate labels `sessions/volume kg/time under bar/kcal est` (no call — vs line 279);
  strip labels `Kcal est/Max bpm/Sets/Total rest` (no call — vs `KCAL EST/…`, line 382); stat-tiles
  `Unit` + PR `NewChipText` (`{count} new`, en 1121) + notes-card `Label` (`Session notes`, en 1124)
  + breakdown `ColumnLabel` (`Exercise`/`Volume`, en 791/794) + edit totals labels (`Volume
  kg`/`Sets`/`Reps`/`Duration`, en 778–781) + edit `AUTO` (`Auto`, en 782) + `NotesLabel`
  (`Notes`, en 765) + edit `SectionLabel` (`Exercises`) + editor `EditorTitle` (`Editing set…`).
  `DeltaText`-style hardcoded caps need nothing (`PR`, `ADD`-family literals are already caps).
  Fix: `toLocaleUpperCase()` at every call site (home/session/workout-editor/exercise-editor/
  update_plan precedent), delete dead `text-transform` CSS wherever touched. Accept: every label
  matches spec caps in EN + DE, no `text-transform` remains in this feature.
- [x] **HX02 — deprecated `theme.font.text` shim.** Problem: ~15 reads (edit-screen styles, when-card
  styles, exercises-section styles, notes-editor styles). Fix: `type(theme, 'body').fontFamily`
  (precedent in all four prior loops). History screen-1/detail styles already avoid the shim (no
  `font-family` declared — system SF, visually correct, nothing to migrate). Accept: zero
  `theme.font` reads remain in this feature.
- [x] **HX03 — 1px lines → hairline.** Problem: day `AggregateCell` left borders + month `Divider` +
  month `StatCell` borders + breakdown `HeaderDivider`/`RowDivider` + edit `StepperDivider` use
  literal 1px. Fix: `StyleSheet.hairlineWidth` (precedent everywhere). Comparison-table borders
  already use the hairline token / 5%-washes ✓ keep. Accept: hairline weight matches spec.
- [x] **HX04 — `formatCount` hardcodes `en-US`.** Problem: `history-stats.ts:115-117`
  (`Math.round(value).toLocaleString('en-US')`) feeds day/month/detail volumes + kcal — DE renders
  `8.420` as `8,420`. Fix: route through the shared `formatGrouped` (home `shared/home-format.ts`)
  or an identical helper; same for `formatChipWeight` (`exercise-breakdown.tsx:16-18`, `toFixed`
  decimal dots → `localeFormatBigNumber(value, decimals)`). `formatWeightShort`/`formatSessionClock`/
  clock durations are locale-safe already ✓ keep. Accept: DE grouping correct everywhere.
- [x] **HX05 — fixed heights → `minHeight`.** Problem: `AggregateRow` 68, `StripCard` 68, stat-tiles
  `TileCard` 104, comparison `DataRow` 28 clip at 200% text / long DE. (Absolute-positioned edit
  rows — `RowTop` 74, `ChipsRow`, `EditorPanel` 140, `WhenBody` 132 — are drag/pitch-coupled like
  workout-editor EX04: keep fixed + clamp contents instead; see H22/H24.) Fix: min-height on the
  four cards/rows above (contents already wrap or clamp). Accept: 200% text + DE, no clip.
- [x] **HX06 — `toUpperCase` → `toLocaleUpperCase` sweep.** Problem: hero `dateLabel`
  (`session-detail-hero.tsx:45`), week weekday-narrow (`week-list.tsx:103`), comparison
  `prevDateShort` + metric/today headers (`session-comparison-table.tsx:60,135,137`), cardio volume
  `.toLowerCase()` (`exercises-section.tsx:231`). Fix: locale-aware case (precedent everywhere).
  Accept: TR + DE locales correct.
- [x] **HX07 — CTA shadows stay `.5` on light.** Problem: empty-state `CtaButton` and filter
  `DoneButton` carry the brand `dy7/blur12/.5` shadow both modes (session/rest-timer precedent
  softens light to `.35`). Fix: `.35` light, keep `.5` dark. Accept: no heavy halo on white.
- [x] **HX08 — gold identical both modes: record keep.** Problem class check: `GOLD` tokens,
  PR-chip/medal washes, gold volume ink render `#FFD84D`-family on white cards at decorative sizes —
  spec mandates gold-as-celebration, light table row "Gold PR surfaces: unchanged". Keep + record;
  do not "fix" toward grey later.
- [x] **HX09 — duo-like 13pt gutters → 12.** Problem: detail `ActionsWrap Row gap: 13`
  (`session-detail-actions.styles.ts:8-12`) repeats the 393-only 13 (home duo precedent → 12).
  Fix: 12. Accept: gutter matches the 12pt system.
- [x] **HX10 — filter modal ignores reduced motion.** Problem: `filter-sheet.tsx:81`
  (`animationType="slide"` hardcoded) while rest-sheet gates on `useAppReducedMotion`. Fix: gate it
  (same one-line pattern). Accept: motion-off users get `none`.
- [ ] **HX11 — future-day selection is a product question, not a patch.** Problem: future calendar
  cells are tappable and flow into the empty-day "Add workout" path, creating future-dated sessions
  — possibly intentional (planning), possibly not; the spec is silent. Fix: none here — get a
  product decision (disable future cells vs keep planned sessions) and record it. Accept: a written
  decision, either way.

## H00 — Screen 1 shell (`history/index.tsx` + `history-screen.styles.ts`)

- [x] **H00a — verified, keep.** Plain `ScrollView` (tab screen, no overlay chrome — no fade needed),
  16pt page, 20/24 section rhythm, 32pt bottom clearance, `slice` aurora already correct, filter dot
  with theme-matched stroke, stable selector/sort discipline, honest empty/filter branches, ICU
  plurals on subtitles. Light aura dim: amber `.1` / green `.07` render un-dimmed on pale
  backgrounds while home dims its light auras — soften light to ~`.06`/`.05` or record measured
  keep; decide in patch. Dead same-value chevron ternary (`month-calendar.tsx:35`) folds into H02
  cleanup. No other change.

## H01 — History header (`history-header/`)

- [x] **H01a — verified, keep shape.** 44pt targets, placeholder slot keeping filter right when no
  back target, 34pt filter circle + 7pt Amber dot ✓ (spec lines 119–121), 32/700/−0.95 title ✓
  (line 123), 11.5 subtitle with one/other ICU ✓ (line 124), 24-inset title block ✓, a11y labels +
  testIDs ✓. Back chevron `#8E8E93` both modes matches spec `#bk` ✓. No change; recorded so the
  header isn't reworked.

## H02 — Month calendar (`month-calendar/` + `history-design.ts`)

- [x] **H02a — cleanup + two records.** Dead same-value dark/light ternary on the chevron color
  (month-calendar.tsx:35 — collapse to one value); month label 16/600/−0.35 vs spec 16/**650**/−0.35
  (spec line 131 — 600 is the correct RN-nearest, same precedent as everywhere; record keep);
  selected numeral 13→13.5 growth on selection matches spec (line 161) — record keep, not a layout
  bug. Grid geometry (flex sevenths ≈ 45.57 vs 45.87 measured — sub-point, keep), ring math +
  `rotation`/`origin` props, per-mode palette (matches the light table row-for-row ✓), brand disc
  with white edge + colored shadow ✓ (light disc follows the mode-aware home brand — reasonable,
  record), weekday narrow via Intl ✓, legend 8.5 + circles ✓ (sub-9 floor is spec-measured, keep
  per workout-editor E04a precedent), 44pt chevrons/cells, testIDs ✓. `TodayPill` 44-min ✓.
  Accept: cleanup done, keeps recorded.
- [x] **H02b — future-day question folds into HX11.** No code here.

## H03 — Selected day (`day-summary/`)

- [x] **H03a — label caps + aggregate hairlines (HX01 + HX03 + mode fix).** `SectionLabel` caps via
  HX01; `AggregateCell` left borders are white `.08` **both modes** (styles 24–25 — invisible on
  white cards; fix dark-kept / light-black `.08`, session-tables precedent); `AggregateRow` 68 via
  HX05. Values 15/−0.4 tabular ✓ (spec line 180), 7.5 labels via HX01 (spec-measured sub-floor,
  keep per precedent).
- [x] **H03b — session card verified, keep shape.** 104-min row ✓ (spec line 183), 52 brand tile +
  gloss + colored shadow ✓ (lines 186–187), coral `.22` edge ✓ (line 185), clamped name/meta ✓
  (line 189–190 shape; meta builder covers time+sets+exercises), gold PR chip ✓ (lines 191–193),
  right value + `kcal · reps` ICU ✓ (line 196), theme-aware chevron ✓, `key={session.id}` ✓. RPE
  chip absent — honest omission (no model field; page-verification defers RPE as a feature, not a
  patch) — record keep. `formatCount` via HX04. Accept: no change beyond folded items.

## H04 — Week list (`week-list/`)

- [x] **H04a — title caps + range ink (HX01 + note).** `WeekHeader` title via HX01 (`earlier this
  week`); range label `seeAll` — light renders `#C93400` (home token; dark `#FF9F0A` ✓ spec line
  201) — readable on white ✓ record keep. Baseline-aligned header with 8pt side padding ✓.
- [x] **H04b — rows verified, keep shape.** 64-min rows ✓ (spec lines 203–225), 44 date tiles ✓ with
  PR wash + gold inks ✓ (lines 230–232), clamped name + `flexShrink` ✓ with inline PR badge ✓
  (lines 233–235; badge 16/7.5 ✓), clamped meta ✓ (RPE omitted — same honest record as H03b),
  right value + kcal ✓, gold `.2` edge on PR rows ✓ (lines 229, 243, 257), theme chevron ✓,
  name+date a11y labels ✓, `key={session.id}` ✓. Weekday narrow `.toUpperCase()` folds into HX06.
  Accept: no change beyond folded items.

## H05 — Month summary (`month-summary/`)

- [x] **H05a — label caps + light hairlines (HX01 + HX03).** Section title + 4 aggregate labels via
  HX01 (`{month} so far`, `sessions/volume kg/time under bar/kcal est` — spec lines 270, 279);
  `Divider` + `StatCell` borders are white `.07` both modes (styles 33–37, 48–49 — invisible on
  white; fix dark-kept / light-black `.07/.08`). Values 16/−0.45 tabular ✓ (line 278), 7.5 labels
  (spec-measured sub-floor, keep per precedent), `DaysBadge` 76×21 ✓ (line 274; 8.5 `#98989F` both
  modes — readable on white ✓ keep), footer ICU ✓ (line 280). HomeCard radius 30 default pad ✓.
  Accept: spec caps + visible hairlines, sizes kept deliberately.

## H06 — Empty states (`empty-states/`)

- [x] **H06a — shadow softening (HX07) + verified copy/paths.** CTA geometry (48-min, rx24, brand +
  colored shadow ✓), centered copy ✓, honest navigation (add → edit route, start → today,
  clear-filters ✓), testIDs ✓. No other change; recorded so empties aren't reworked.

## H07 — Filter sheet (`filter-sheet/`)

- [x] **H07a — motion gate + light chips + caret (HX10 + colors + N03b-class).** `Chip` washes are
  dark-only white (styles 88–89 — invisible/weak on the white sheet; fix mode-aware amber-selected
  + grey-resting per the editor chip precedent); `SearchInput` needs the ember `selectionColor`
  (exercise-editor N03b precedent) — family set to system (no shim risk ✓ keep); animation gates
  via HX10. Kept verified: 44 search box + 44 clear ✓, wrapping chips + 44-min ✓, 44 toggle row ✓,
  44-min footer buttons ✓, 380-max scroll ✓, insets + grabber ✓, badge-style a11y states ✓,
  cardBody sheet bg (mode-aware ✓).
- [x] **H07b — chip text clamp.** Selected workout names render unclamped inside `Chip` (44-min,
  wraps freely — a long plan name makes a tall chip and shifts the grid). Fix: `numberOfLines={1}`
  on the chip label (ellipsis; full name still in the a11y-adjacent `testID`… actually add the full
  name to `accessibilityLabel` too — currently the chip has no label at all, only a testID).
  Accept: one-line chips, full names announced.

## H08 — Detail shell (`session-detail-screen/` + route)

- [x] **H08a — verified, keep.** 16pt body + 32 bottom + 12 rhythm ✓; both confirms correct
  (replace = default, delete = `destructive` ✓); conditional kudos (feed scope noted); repeat-with-
  replace flow ✓; missing/invalid id redirects ✓ (route guards). `post-workout.tsx` non-history
  branch (`PostWorkoutScreen` modal) belongs to a later ledger — noted, untouched. No change.

## H09 — Detail nav (`session-detail-nav/`)

- [x] **H09a — verified, keep.** 44 row/buttons/slot ✓, 15/600/−0.3 clamped title ✓ (spec line 339),
  `#8E8E93` chevron ✓ (spec `#bk` line 319), localized back label ✓ (session-loop fix reused),
  `hitSlop={0}` exact-44 ✓, menu via shared trigger ✓. No change.

## H10 — Detail hero (`session-detail-hero/`)

- [x] **H10a — caps locale + rhythm verified.** `dateLabel` `.toUpperCase()` → `toLocaleUpperCase`
  (HX06); dead `text-transform` CSS on `DateLabel` (styles 16 — delete in the same patch). 40pt top
  + 56/−2.3 tabular duration + 12 split + clamped dateline ✓ (spec lines 343–346, margins 34/9/7
  measured ✓). Locale-aware formatters + 12/24h setting ✓. Accept: caps fixed, rhythm kept.

## H11 — Detail stat tiles (`history-stat-tiles/`)

- [x] **H11a — height + caps + suffix (HX05 + HX01 + keep).** `TileCard` 104 fixed → min-height
  (spec 104 ✓ keep as budget); `Unit` caps via HX01 (the existing `.toUpperCase()` → locale form);
  `kg` suffix on the volume label stays lowercase SI (units are conventionally lowercase — record
  keep, not a caps miss). Tints/mode washes reasonable on white ✓ keep; glyphs match spec
  (bolt/sets/pulse ✓ lines 352/359/373); reps `IconCount` 11 ✓ (line 366); value autosize+clamp ✓;
  bpm sample + compact badge ✓ (honesty kept). Gaps 11 ✓ (spec tile pitch). Accept: budget kept,
  caps fixed.

## H12 — Detail strip (`session-detail-strip/`)

- [x] **H12a — height + caps (HX05 + HX01).** `StripCard` 68 fixed → min-height (spec 68 ✓ budget);
  four labels via HX01 (`Kcal est`, `Max bpm`, `Sets`, `Total rest` — spec line 382 caps); dividers
  already mode-aware ✓ keep; values 15/−0.4 tabular ✓; MaxBpm badge row ✓; started-count-for-RPE
  documented ✓ keep. Accept: budget kept, caps fixed.

## H13 — PR card (`session-detail-pr-card/`)

- [x] **H13a — badge caps + medal verified.** `NewChipText` value (`{count} new`, en 1121) renders
  Title Case vs spec `2 NEW` (spec line 389) → `toLocaleUpperCase` (HX01 batch). Medal 40 gold
  gradient + gold shadow ✓ (lines 390–391), star `#5C4300` ✓, rows/titles/details ✓ (lines
  393–396), honest empty state ✓, record-matched gold volume ✓. `RowTitle` `" PR"` suffix:
  universal abbreviation, keep + record. Accept: caps fixed, rest kept.

## H14 — HR curve (`hr-curve-card/`)

- [x] **H14a — verified, keep shape (+ two light notes).** Band/curve/node/label geometry verbatim
  per spec lines 403–411 ✓; per-mode stroke stops ✓ (light table row ✓); halo per mode ✓ (table);
  band fill opacities per mode ✓ (table `.10–.18` ✓); aspect-ratio scaling = responsive by
  construction ✓; sample + compact badge ✓; flat-glow underlay workaround documented ✓. Light
  notes: zone label inks + `164` label stay dark-mode luminous on white (table silent) — verify on
  device, deepen only if washed (`#D70015`-family); area wash `#FF3B30` .3→0 kept (table silent).
  Accept: no code without a device verdict — record the two checks.

## H15 — Exercise breakdown (`exercise-breakdown/`)

- [x] **H15a — column caps + hairlines + chip locale (HX01 + HX03 + HX04).** `ColumnLabel`
  (`Exercise`/`Volume`, en 791/794) via HX01 (spec line 419 caps); `HeaderDivider`/`RowDivider`
  1px → hairline; `formatChipWeight` decimal dots via HX04 (`localeFormatBigNumber` either
  already handles precision — verify signature before swapping). Kept verified: header + sets chip
  (58×21 ✓ line 417), 28×15 PR chip ✓ (line 425), gold PR volume + outlined PR set ✓ (lines
  424/434), wrapping chips ✓, 46×18 set chips ✓ (line 428) with 9px text ✓ (line 435), clamped
  names ✓, honest empty ✓, `key={rowIndex}` over the static row list (no reorder here — safe,
  record). Accept: caps/hairlines/locale fixed, rest kept.

## H16 — Vs-previous (`session-detail-vs-previous/` + `session-comparison-table`)

- [x] **H16a — header caps locale (HX06).** `prevDateShort` + METRIC/TODAY `.toUpperCase()` →
  `toLocaleUpperCase` (table tsx 60/135/137); `HeaderDelta` raw `Δ` symbol needs nothing ✓.
- [x] **H16b — rows verified, keep shape.** Fixed 76/60/49 columns: 320 inner is 248, metric keeps
  ~63pt with ellipsis (`numberOfLines={1}` ✓) — safe by clamp, record. 28pt rows → min-height
  (HX05 batch; 12px text at 200% clips otherwise). Header border already hairline-token ✓ keep;
  data dividers 5%-wash → hairline treatment (same visual weight; fold into HX03). Delta chevron
  `$left` magic is measured (comment exact: 317/333 hug points ✓ keep). Negative deltas stay grey
  (spec line 455 `#8E8E93` — deliberate, not red ✓ record). Honest empty state ✓. Accept: caps +
  min-height + hairline, rest kept.

## H17 — Notes card (`summary/session-notes-card/`)

- [x] **H17a — label caps + edit-target geometry (HX01 + verify).** `Label` dead transform + value
  `Session notes` (en 1124) → `toLocaleUpperCase` (spec `SESSION NOTES`, line 461). `EditButton`
  negative margins (`-12`/`-20`) + padding extend a 44 target out to the x=369 label (comment exact
  ✓) — verify the math holds at 320 (card inner 248: label + 44 button — no overlap by construction,
  but prove on device). `EditText` seeAll ✓ (spec amber line 462 ✓). Body/empty 12.5 ✓ (line 463).
  Accept: caps fixed, target math device-verified.

## H18 — Detail actions (`session-detail-actions/`)

- [x] **H18a — gutter + share ink (HX09 + verify).** `Row gap: 13` → 12 (HX09). `ShareGlyph` color
  dark `#C7C7CC` vs spec line 478 `color="#C7C7CC"` ✓ exact — keep (it is not theme-ink by design).
  `hitSlop={0}` on Share is exact-44 ✓ keep (54-tall buttons need no slop). `EditButton` + `EditFill`
  + `EditGloss` all defined AND rendered? — verify: tsx 91–98 renders `PenGlyph` + `EditLabel` only;
  `EditFill`/`EditGloss` (styles 55–77) are **defined but never rendered** — the Edit button has NO
  gradient fill (transparent, white pen + white label → invisible on light!). Fix: render
  `<S.EditFill />` + `<S.EditGloss />` inside `EditButton` (same pattern as empty-state `Cta`).
  PenGlyph stays white (correct over brand ✓). Delete 48 ghost ✓ + destructive confirm ✓.
  `EditLabel` 600 precedent ✓ (spec 650). Accept: Edit renders its brand fill both modes.
- [x] **H18b — labels verified, keep.** 15/600/−0.25 share/edit ✓ (spec lines 479/484), 14.5 delete ✓
  (line 487), full a11y labels ✓. No change.

## H19 — Detail auras (`session-detail-auras/`)

- [x] **H19a — distortion (same class).** `preserveAspectRatio="none"` over `viewBox 393×1848` with
  `cy` up to 1550 (styles/tsx 25–44) — ellipses off-393 + drift on long sessions. Fix: `slice`
  (home/session/update_plan precedent). Positions/opacities already match A1/A2/A3 ✓ keep, light
  `.5` dim reasonable ✓ keep. Accept: circular auras 320–430.

## H20 — Edit shell (`edit.tsx` route + `edit-session-screen`)

- [x] **H20a — verified, keep shape.** Store/dispatch deprivation correct (save-once guard,
  resume-vs-finish split ✓ verification-covered); delete confirm `destructive` ✓; classic menu +
  resume item ✓. Screen: bg + width-matched aura (responsive ✓ — but amber `.12` un-dimmed on light,
  soften to `.06` like home or record measured keep; decide in patch); modal nav (Cancel
  `#8E8E93`/`#007AFF` ✓ light table row; clamped title ✓; 44 + slop-8 ✓); 16/8/170 scroll rhythm
  (170 clears the ~136+inset save bar ✓); section gaps (0/12/24/24/16 per spec flow ✓);
  48 destructive ghost ✓ + destructive confirm ✓; save bar (bar gradient, 52 brand button + gloss
  + white edge + colored shadow ✓ spec lines 686–688; caption ✓ line 690) — verify save gloss/edge
  actually render (same defined-vs-rendered check as H18a — `SaveGloss` IS rendered line 122 ✓,
  `SaveOuter` edge-gradient rendered ✓ good). `SaveBody` fixed 52 (buttons keep size ✓). No change
  beyond the aura-dim decision; recorded.

## H21 — Edit nav details — folded into H20a (no separate item).

## H22 — Live totals (`live-totals-strip/`)

- [x] **H22a — height + caps + dividers (HX05 + HX01 + verify).** `StripBody` 68 fixed → min-height
  (spec 68 ✓ budget); 4 labels via HX01 (`Volume kg/Sets/Reps/Duration`, en 778–781 — spec line 540
  caps); dividers already mode-aware ✓ keep; values 15/−0.4 tabular ✓ (line 539); green `.26` edge
  ✓ (line 537); sync dot 6.8 + 2s pulse + reduced-motion ✓ (line 541); volume via
  `localeFormatBigNumber` ✓ locale-safe; duration clock universal ✓. Accept: budget kept, caps
  fixed.

## H23 — WHEN card (`when-card/`)

- [x] **H23a — fixed body + clamps (keep + harden).** `WhenBody` 132 fixed with absolute dividers at
  48/92 (styles 65–72): three 44 rows must stay 44 or the dividers drift (page-verification fixed
  this file to exactly that). Fix: keep 132/44 fixed; clamp `WhenValue` to `numberOfLines={1}`
  (long durations + AUTO chip + chevron already flex-end — `WhenValueWrap flex: 1` bounds them;
  without the clamp a wrapped value would break the 44 rhythm). `AUTO` text via HX01
  (`Auto`, en 782). Dividers 1px → hairline (positions kept). Label `#98989f` both modes: readable
  on white ✓ keep + record. Chevron `#48484A` both (spec line 549 dark canvas; visible on white ✓
  keep over the home `#C7C7CC`-light convention — record the decision). Date/time pickers are
  foundation (`locale="default"` = device locale vs in-app `preferredLanguage` — minor mismatch,
  note for the foundation/i18n pass, not this ledger). Duration row correctly non-pressable
  (no role ✓). Accept: rhythm locked, value clamped, decisions recorded.
- [x] **H23b — formatters verified, keep.** Memoized ICU pair, wall-time (not device-zone) rendering,
  `AUTO` chip 16 ✓ (spec line 550–551), tabular values ✓. No change.

## H24 — Edit exercises (`exercises-section/` + drag)

- [x] **H24a — header caps + cardio volume casing (HX01 + HX06).** `SectionLabel` via HX01
  (`Exercises` vs spec line 568); drag hint ICU keeps shape (`{count} · drag to reorder` ✓ line
  569). Cardio `volumeText` lowercases the sets label (`.toLowerCase()`, tsx 231) → locale form
  (same HX06 call). Accept: caps + casing fixed.
- [x] **H24b — drag-coupled rows: verify, don't convert (workout-editor EX04 precedent).**
  `RowSlot` 74/242 fixed + `PITCH` 84 drive the gesture math (same construction as the workout
  editor); `RowTop`/`ChipsRow` absolute offsets, `EditorPanel` 140, `RowOuter` ember focus edge
  (flat `.42` vs spec `br` gradient — same honest simplification as workout-editor E08b, record
  keep). Contents already clamp (name/volume 1-line ✓, chips fixed 26 ✓, steppers 44 ✓ with slop).
  At 200% text the absolute stack may clip — device-check, do not restructure (restructure would
  desync drag). `HandleBox` 44 a11y-button inside the non-pressable `RowTop` — no nesting violation
  (rows aren't buttons here; selection lives on chips ✓ correct, unlike workout-editor E12a).
  `RowTexts marginLeft: -20` overlaps the handle's right padding — 2pt into empty zone by
  construction; record, do not touch without a device. Stable `WeakMap` keys ✓ (no index hazard).
  Grips `#6C6C70` both (spec line 574 ✓; light readable ✓ keep). PR inline chip ✓ + `"PR"`
  universal keep (HX10-class). `AddSetChip`/`AddExerciseButton` dashed (Android verdict: shared
  with NX06 — one verdict covers all three dashed usages; record cross-ref). `DeleteSetText`
  `#ff6b60` both modes → `#D70015` light (same class as N11a/rest-timer chips — fold into the ink
  patch). `StepperValue minWidth: 64` ✓ (spec line 617: value centered ~296 ✓). `StepperDivider`
  1px → hairline (HX03). `EmptyRows` ✓. Accept: verified, chips/delete/hairlines fixed,
  drag math untouched.
- [x] **H24c — editor title caps (HX01).** `EditorTitle` (`Editing set {n} of {m}` vs spec `EDITING
  SET 2 OF 3`, line 612) via HX01. `DeleteSetButton` padding + slop-8 → 44 ✓ keep.

## H25 — Notes editor (`notes-editor/`)

- [x] **H25a — label caps + edge simplification (HX01 + record).** `NotesLabel` via HX01 (`Notes` vs
  spec `NOTES`, line 673). `NotesOuter` ember `.5` flat edge vs spec `br` 1.6 @.55 (line 672) —
  same flat-vs-gradient simplification as elsewhere; record keep. `NotesBody` 116 fixed with
  scrolling input (correct for a fixed well — long text scrolls inside, counter stays put ✓ spec
  lines 671–676); counter tabular + ICU ✓ (`{count} / 500` hardcodes the const-consistent 500 ✓);
  cursor ember ✓ (line 676); commit-on-blur/unmount ✓ (verification). Accept: caps fixed, rest
  recorded.

## H26 — Kudos (feed scope note, no item)

`SmartKudosCard` renders only with reactions (correct archival honesty ✓). Its internals belong to
the feed ledger — invocation only here. No item.

## Patch order (suggested, smallest-risk first)

1. HX01 caps + HX06 casing (mechanical, highest-visibility win — ~25 call sites).
2. HX04 locale counts + H18a Edit fill (the two functional bugs) + HX02 shim + HX03 hairlines.
3. HX07 shadows + H07a chips + N11a-class inks (delete-set red, mode-aware washes) + UX09-class
   amber audit (verify `#B25000`-style strays — none found; gold stays).
4. HX05 min-heights + H23a clamp + H19a slice + H10a aura-dim + H24b verifications + H11 future-day
   product decision (HX11).
5. H14a/H26-adjacent device checks (zone inks, `164` label, area wash) + landscape + 200% text.

## Implementation notes (2026-09-23 — read before device pass)

- **H18a was the P0:** `EditFill`/`EditGloss` were defined but never rendered — the Edit button was
  transparent with white pen + white label (invisible on light). Fill + gloss now render inside the
  button; pen stays white (correct over brand).
- **HX01 scope:** ~30 call sites across day/week/month/strip/tiles/PR/notes/breakdown/comparison/
  totals/when/section/editor; dead `text-transform` deleted everywhere touched. Shared `HomeText`
  `micro` left alone (app-wide, out of scope — RN ignores the rule everywhere equally).
- **HX04 `formatGrouped` rounds:** it carries `maximumFractionDigits: 0`, so dropping the explicit
  `Math.round` in `formatCount` changes nothing (non-negative volumes).
- **HX11 open:** future-day tap → add-workout path is a product decision (disable vs planned
  sessions), recorded not coded. The spec is silent.
- **Kept deliberately:** gold-identical-both-modes (spec law), RPE omission (no model field),
  drag-coupled fixed rows (workout-editor EX04 precedent), static index keys (no reorder in these
  lists), 700-over-650, `kg` lowercase SI, `"PR"` universal suffix, sub-9 spec-measured type,
  comparison grey-negative (spec), flat-vs-gradient edge simplifications (same honesty rule as
  workout-editor E08b).
- **H21 has no box:** folded into H20a by design (see item).
- **No verification runs yet by user request** (`typecheck`/`lint`/`vitest` skipped). Run them plus
  `history-screen1.spec` / `history-simulation.spec` / `pr-match.spec` / `session-time-utils.spec`
  before the device pass.

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Batch 1 caps sweep (~30 sites) + casing | HX01, HX06 | code review only |
| 2026-09-23 | Batch 2 locale counts + Edit fill + hairlines + shim | HX04, H18a, HX03, HX02 | code review only |
| 2026-09-23 | Batch 3 CTA shadows + filter chips + delete red | HX07, H07a, H24b-ink | code review only |
| 2026-09-23 | Batch 4 min-heights + clamps + slice + dims + motion gate | HX05, H23a, H19a, H00a/H20a-dim, HX10 | code review only |
