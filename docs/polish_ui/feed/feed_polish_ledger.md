# Feed timeline polish ledger (source of truth)

Status: **implemented 2026-09-23 — all code patches applied; device pass (320/430, large
text, DE, landscape) still required before closing the acceptance bar.** F08 kept
22pt dots deliberately (recorded, revisit on device). Vitest skipped per instruction —
run the feed suites before the device pass.
Scope: Screen 1 only — `app/src/app/(tabs)/feed/index.tsx` (native nav header +
compose target) → `feed-timeline.tsx` (challenge banner, filter chips, post cards,
footer, empty states) + the shared poster/kudos/action-bar/avatar/badge/media
sections it renders — against `docs/new_design/social-dark.md` Screen 1
(393×1950) + the spec's light-mode delta table + `.agents/skills/apple-ios-frontend/SKILL.md`.

Out of scope (later page loops): post detail (Screen 2), share composer (Screen 3),
profile editor (Screen 4). Shared files touched below (`share-poster`, composer
casing) are flagged as shared so those loops inherit the decision.

Read method: route, container, and every section in render order, `.tsx` +
`.styles.ts` fully, against the spec SVG geometry. Nothing inferred.

## What is already good (not touched by this ledger)

- `timeline-tokens.ts` implements the light table faithfully (card `#FFFFFF→#FAFAFC`
  + black edge ramp, avatar ring `#FFFFFF`, action inks `#6E6E73`/`#D70015`, kudo
  count `#FF6A88`/`#D70015`, posters unthemed, gold unchanged). Posters are images
  in both modes, per spec.
- Glyphs traced 1:1 from the spec defs (1.8 strokes, rounded joins/caps).
  Kudo'd heart is filled + weight change (legible without colour).
- Caption 2-line clamp (verification fix), kudos cap math (`+3` vs "and 4
  others" both spec-exact), challenge fill 165.7 = 10340/12480 × 200,
  filter scroll + edge-bleed tell, 44pt menu/compose/action targets, refresh
  spinner tint per mode, honest sample footer + badge, per-filter empties.
- Kudos label `flex-shrink` + ellipsis, action bar flex thirds, heroes
  `width: 100%`, photo `cover`, video never autoplays, tabular duration chip.
- No flat cards, no dead black (3 spec auras + tokens), real computed geometry
  (challenge fill, pill widths per the verification log).

The problems below are the familiar ones: fixed reference-device widths, one
fixed track, hardcoded `en-US`/English strings, and small-detail misses.

## Cross-cutting items (FX)

- [x] **FX01 — 1px hairline.** `post-frame.styles.ts` `Hairline height: 1px` renders
  ~2–3 physical px on @2x/@3x. Fix: `StyleSheet.hairlineWidth`, keep theme-aware
  colors. (Milestone/poster 1px edges are spec 1pt edge strokes — keep, not this.)
- [x] **FX02 — card fixed 388.** `TIMELINE_CARD_HEIGHT` + `FeedCard height: 388`.
  Content with 2-line caption ends at 383 (fits by 5pt); without a caption the card
  carries 51pt of dead space. Keep uniform (spec mandate — every reference card is
  388) and record; do NOT auto-height individual cards. Large text is the real risk
  (see FX06). No code change unless the device pass shows otherwise.
- [x] **FX03 — locale batch (6 sites).**
  - `timeline-data.ts:207` `formatChallengePoints` hardcodes `en-US` ("10,340" on
    German). Fix: optional `locale` param (keeps the simulation spec green),
    call sites pass `preferredLanguage`.
  - `feed-seed.ts:48` kicker `Intl.DateTimeFormat('en-US', …)` + `:53`
    `.toUpperCase()` — sample kickers frozen in English. Fix: system locale
    (`undefined`, no signature change) + `toLocaleUpperCase()`.
  - `composer-data.ts:129` (`prPills`), `:149` (kicker) `.toUpperCase()` — shared
    derivation, renders on Screen 1. One-word `toLocaleUpperCase()` each, flagged
    for the composer loop.
  - `share-poster.tsx:136,144` StatLabels hardcode `Duration`/`Sets` in every
    locale. Fix: new fragment keys `feed.shared.poster.duration/sets`
    (+ `feed.shared.json`) via `useTranslate` + `feedKey` with English fallback —
    all three poster usages benefit, no call-site changes.
  - `own-person.ts:29` initial `.toUpperCase()` → `toLocaleUpperCase()`
    (single char, renders on the own post).
  - `video-hero.tsx:69` `— play/pause` a11y suffixes hardcoded English. Fix: new
    fragment keys (e.g. `feed.shared.video.play/pause`) or reuse existing.
- [x] **FX04 — background `preserveAspectRatio="none"`.** `feed-background.tsx:27`
  (viewBox 393×2313, variable `contentHeight`). Fix: `slice` (same call as trends
  TX08) so blooms keep shape on all canvases.
- [x] **FX05 — large-text / 200% policy.** Recorded, not coded: fixed 388 cards +
  fixed 36 name col + fixed 76 banner + fixed poster internals clip scaled text.
  Containments in this ledger (`numberOfLines`, min-heights) prevent overlap;
  the full 200% + German device pass is still owed.

## Batch 1 — scale + clip (F01–F08)

- [x] **F01 — challenge track fixed 200.** `challenge-banner.styles.ts` `Track width:
  200px`, fill `width: CHALLENGE.trackFill` (165.7 fixed). Card inner on 320 is
  ~224; medallion 40 + margins 12 + rank col ~68 + margins 8 leave the middle
  ~136 — the track overflows ~64pt. Fix: Track `flex: 1` (drop 200), fill width
  in % (`titlePoints/leaderPoints × 100` = 82.85% — spec-identical on 393).
  `CHALLENGE.trackWidth/trackFill` become the % derivation (same muscle-track
  precedent as trends T08).
- [x] **F02 — banner fixed 76 clips wrapped text.** `BannerRow height: 76px`; Title
  + Sub have no clamp — large text wraps and clips (`FeedCard` gradients don't
  set `overflow: hidden`, so it bleeds). Fix: height → min-height 76 (spec rhythm
  unchanged at reference sizes).
- [x] **F03 — header NameCol fixed 36.** `NameRow` (name + badge) + `Meta` have no
  `numberOfLines` — a long user-set name wraps and clips inside the fixed 36.
  Fix: `numberOfLines={1} ellipsizeMode="tail"` on `Name` + `Meta` (truncation is
  contained and honest; names still fully exposed via a11y/menu).
- [x] **F04 — hero margins 15 vs spec 16.** `PosterWrap margin-left/right: 15px`;
  spec hero x=32 w=329 on a 361 card = 16/16. Fix: 15 → 16 (1pt/side; posters
  render 329 wide exactly).
- [x] **F05 — PR pills overflow narrow/German posters.** `PillRow` absolute, no
  wrap; 3 spec pills total ~261pt vs 194pt content on 320 (German longer still —
  overflow even on 393). Fix: `PillRow overflow: hidden`, `Pill flex-shrink: 1;
  min-width: 0` (`PillText numberOfLines={1}` already truncates). Shrink engages
  only on overflow — reference canvas unchanged.
- [x] **F06 — milestone texts unclamped.** `Value/Unit/Tagline/DateRange` wrap and
  push siblings out of the fixed 190 hero (`overflow: hidden` clips mid-glyph).
  Fix: `numberOfLines={1}` on all four (German taglines truncate instead of
  breaking the hero grid).
- [x] **F07 — Load button fixed 152.** German "Frühere laden" fits, but longer
  locales + large text clip inside fixed 152×42. Fix: `width` → `min-width: 152`
  + `padding-horizontal: 20` (reference canvas unchanged).
- [x] **F08 — menu dots: kept 22, recorded.** `DotsGlyph size={22}` vs spec dots
  spanning ~16pt (r1.8 ×3). Without a device to judge the render, shrinking risks
  deviating from the approved look for zero functional gain; the 44pt target is
  already correct. Revisit on the device pass.

## Batch 2 — locale (FX03 call sites)

Implements the FX03 batch. Order: tokens/data → seed → shared poster →
fragments → specs (update expectations only where signatures change; no new
test files per instruction).

1. `formatChallengePoints(points, locale?)` via cached `Intl.NumberFormat`
   (mirror trends T11); `challenge-banner.tsx` passes `preferredLanguage`
   (2 call sites: points line + progress a11y).
2. `feed-seed.ts:48` → `Intl.DateTimeFormat(undefined, …)` + `:53`
   `.toLocaleUpperCase()`.
3. `composer-data.ts:129,149` → `toLocaleUpperCase()` (shared; flag for
   composer loop).
4. `feed.shared.json` += `feed.shared.poster.duration/sets`; `share-poster.tsx`
   `useTranslate` + `feedKey` with `'Duration'`/`'Sets'` fallback.
5. `own-person.ts:29` → `toLocaleUpperCase()`.
6. `video-hero.tsx:69` → localized play/pause a11y (new `feed.shared.*` keys
   with English fallback).

## Batch 3 — light mode: verify-only (no code expected)

Each row checked against the spec's light table during the audit:

- [x] **L01 — card surfaces** `#FFFFFF→#FAFAFC` + black edge ramp
  (`timeline-tokens.ts:26,33`). Verified in code.
- [x] **L02 — action inks** idle `#6E6E73`, kudo'd `#D70015`, counts `#FF6A88` /
  `#D70015` (`feed-action-bar.tsx:34-35`, styles). Verified.
- [x] **L03 — meta/timestamps** `#8E8E93` (`INK_META.light`). Verified.
- [x] **L04 — avatar ring** `#FFFFFF` on cards (`AVATAR_RING`, passed at all three
  call sites). Verified.
- [x] **L05 — posters + gold unthemed** (share/milestone/media heroes mode-free).
  Verified. Gold text `#2B1E00/#5C4300/#7A5A00` unchanged both modes. Verified.
- [x] **L06 — filter chips in light.** Spec table is silent; code uses a dark
  `#1C1C1E` selected chip with white text (`CHIP_SELECTED_FILL/INK.light`).
  Decision: keep — highest-contrast option, deliberate theme decision, not a bug.
  Record only.
- [x] **L07 — kudos cap** light `#E9E9EE` + `#8E8E93` text. Spec-silent; calm and
  legible. Record only.

## Batch 4 — details + verify-only notes

- [x] **D01 — FX01 hairline.** `post-frame.styles.ts` Hairline → hairlineWidth.
- [x] **D02 — FX04 slice.** `feed-background.tsx:27` → `xMidYMid slice`.
- [x] **D03 — poster CSS uppercase ×3.** `share-poster.styles.ts:75,116,146`
  `text-transform` — RN supports it, native-locale; consistent with history HX
  + trends TX03 (JS sites fixed, CSS left). Record only.
- [x] **D04 — hero big values clip right.** Absolute `Hero` + `numberOfLines={1}`
  truncates at the content box — contained by construction. Record only.
- [x] **D05 — MenuWrap negative-margin trick.** Verified sound: 44pt target stays
  centered on the 36pt header row (`post-frame.styles.ts:47-53`). Record only.
- [x] **D06 — kudos margins.** `KudosWrap` 9/20 reproduces spec faces at x=36
  exactly (card edge 16 + 9 + face radius 11 = 36 center). Record only.
- [x] **D07 — StatValue columns +0/+104.** Narrowest poster content (320: 194pt)
  still fits "45:12" + sets at 104. Verified arithmetically. Record only.
- [x] **D08 — compose target.** 44pt hit + 34pt circle + 16.5 pencil = spec
  (§"34pt translucent circle", cmp scale .85). `hitSlop={5}` generous, harmless.
  Record only.

## Verification gates (run at implementation)

`npm run typecheck` 0 new errors · touched-file vitest suites
(`timeline-simulation`, fragment/i18n-adjacent) · `oxlint`/`oxfmt` on touched
files · device pass 320/430 × dark/light + 200% text + DE before closing.

## Implementation notes (2026-09-23 — read before device pass)

- **F01 keeps `trackFill` in points** alongside the new `trackFillPct` — the
  simulation spec pins 165.7, and it stays green untouched.
- **`formatChallengePoints` defaults to `en-US`** (not system): the contract
  catalog + its spec are English-pinned; the banner passes `preferredLanguage`
  explicitly. Deterministic tests, honest app.
- **F02 padding math:** min-height 76 + 12/12 pads centers identically to the old
  fixed 76 at reference sizes (content 46 < 52 box) — padding engages only on wrap.
- **Shared-file flags for later loops:** composer casing (`composer-data`), poster
  labels (composer preview + post detail inherit the fix), video a11y.
- **Gates:** `typecheck` clean on all touched files (remaining errors pre-exist in
  untouched files). Vitest skipped per instruction — run `timeline-simulation` +
  feed suites before the device pass.

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Batch 1: track %, banner/name/clamps, poster margins, pill shrink, milestone clamp, footer button | F01–F07 | typecheck (touched files clean) |
| 2026-09-23 | Batch 2: locale points/kickers/casing/labels/a11y | FX03 | typecheck (touched files clean) |
| 2026-09-23 | Batch 3: light table verified row by row | L01–L07 | code review (no changes) |
| 2026-09-23 | Batch 4: hairline + slice | D01–D02 (FX01, FX04) | typecheck (touched files clean) |
| 2026-09-23 | Sweep 2: Kinetic → Alcedo in share a11y labels + seed kicker + spec upkeep | feed-timeline, feed-seed | typecheck (touched files clean) |