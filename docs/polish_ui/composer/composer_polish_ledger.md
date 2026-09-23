# Share composer polish ledger (source of truth)

Status: **implemented 2026-09-23 — all code patches applied; device pass (320/430, large
text, DE, landscape) still required before closing the acceptance bar.** Vitest skipped
per instruction — run the composer suites before the device pass.
Scope: Screen 3 only — `app/src/app/(tabs)/feed/share.tsx` without `?id=` →
`smart/feed-share-composer.tsx` state into `composer/share-composer.tsx` (nav,
author + audience, attached session, swatches, stat chips, live preview,
caption, attach row, tagged chips, sticky CTA, both sheets) + `composer-post-card`
(published posts, timeline-rendered but composer-owned) — against
`docs/new_design/social-dark.md` Screen 3 (393×1112) + the spec's light-mode
delta table + `.agents/skills/apple-ios-frontend/SKILL.md`.

Explicitly out of scope: the `?id=` share-request branch in `share.tsx`
(verification's recorded open item — another loop), post detail (Screen 2,
done), profile editor (Screen 4). Shared files already fixed in the feed loop
(`share-poster` pills/labels, composer casing, video a11y) are not re-listed.

Read method: container and every section in render order, `.tsx` + `.styles.ts`
fully, against the spec SVG geometry. Nothing inferred.

## What is already good (not touched by this ledger)

- Light table rows verified in code: swatch ring deepened `#FF9500→#D70015`,
  ON chips `#34C759` @ .16 / `#248A3D`, OFF chips `#787880` @ .12 / `#6E6E73`,
  nav + sheet Done `#007AFF` (iOS light convention ✓), sheets/caption/attach
  surfaces theme-aware, posters unthemed.
- Honesty architecture intact: empty caption + zero tags by default,
  session-scoped drafts, one-shot share guard, real mutual counts with
  count-free fallbacks, no photo/location dead controls, detach keeps
  theme/stat/caption, no-session state disables Share.
- Reduced-motion LIVE freeze, 44pt targets (nav, audience hitSlop, remove
  hitSlop, sheet Done, reply/cancel, comment actions), 50% disabled states,
  trimmed-empty guards, draft caption parity with timeline/detail.
- Section rhythm is spec-measured throughout (30/32/12/12/30 gaps all match
  the SVG) — do not "normalize" them.
- Glyphs traced 1:1 from the Screen 3 defs; selection ring inset −3.5 so it
  never touches the swatch corner (spec pin).

The problems below: one fixed-width overflow, dark-only shadows, fixed chip
widths, and small-detail misses.

## Cross-cutting items (CX)

- [x] **CX01 — stat chips fixed widths.** `composer-types.ts` `STAT_DEFS.width`
  (79/91/66/66/61/103/73/61, English-measured) + `stat-chips.styles.ts` fixed
  `width`. Wrap saves the row, but German labels overflow their chip:
  "Herzfrequenz" ≈ 78pt + icon 12 + gap 7 + padding 28 = 125 > 103 → text wraps
  inside the 28pt chip and clips (`ChipLabel` has no clamp). Fix: `width` →
  `min-width` (reference widths as floors, padding already 14/14). Same class
  as trends T27 / feed T27.
- [x] **CX02 — dark-only card shadows in light.** `attached-session-card`
  `CardShadow` (black .42, dy6/blur8) and `composer-post-card` `CardShadow`
  (black .5, dy10/blur14) have no light branch — heavy slabs on pale surfaces
  against the softened app language (trends light: .075/.06). Fix: theme-aware
  (`$dark` prop; light `#14142b` @ .06–.075, matching the HomeCard scale).
- [x] **CX03 — large-text policy.** Recorded, not coded: fixed 72/100/190
  heights + fixed pills assume reference sizes. Containments below prevent
  overlap; the 200% + German device pass is still owed.
## Batch 1 — scale + clip (C01–C08)

- [x] **C01 — swatches fixed 112 wide.** `SwatchPress/Hit/Swatch width: 112px`
  ×3 + gap 24 + padding 33 = 393 exactly — 73pt overflow on 320, dead margins
  nowhere (no scroll container). Fix: `SwatchPress/Hit flex: 1`, `Swatch width:
  100%`; `RingFill` −3.5 insets → `left/right/top/bottom: -3.5` fill (spec −3.5
  inset preserved, never touches the corner at any size); `CheckBadge left: 95`
  → `right: -1` (top-right overlap kept).
- [x] **C02 — attached-card shadow.** CX02, attached file.
- [x] **C03 — published-card shadow.** CX02, post-card file.
- [x] **C04 — attach pill fixed 112.** `attach-row.styles.ts` `width: 112px` —
  German "Markieren" fits, longer locales don't. Fix: `min-width: 112` +
  `padding-horizontal: 20` (reference unchanged).
- [x] **C05 — tagged names unclamped.** `TagName` has no clamp; one very long
  name exceeds the row (chips size to content, row wraps — a single long word
  still overflows). Fix: `TagChip max-width: 100%`, `TagName numberOfLines={1}`
  (chip keeps avatar + close affordance, name ellipsizes).
- [x] **C06 — CTA fixed 54 + uncentered caption.** `CtaButton height: 54px`
  clips long-locale labels ("Im Feed teilen" fits; longer ones don't);
  `CtaCaption` has no `text-align` (multiline wraps left inside a centered
  block — spec line is centered). Fix: `min-height: 54` + vertical padding,
  label 2-line centered; caption `text-align: center`. Same class as trends T28.
- [x] **C07 — published header squeezes.** `HeaderText` has no `flex: 1`;
  `AuthorName` no clamp — a long display name pushes the age out. Fix:
  `HeaderText flex: 1`, `AuthorName numberOfLines={1}` (age always visible).
- [x] **C08 — nav title off-center.** `space-between` with unequal sides
  (Cancel/Abbrechen vs Share/Teilen ≈ 25pt delta in German → title ~12pt off
  true center). Fix: `NavTitle flex: 1; text-align: center` (buttons keep
  min-width 44 + padding, so the title centers on the row, not the residual).

**C01 arithmetic note (corrected, not deleted):** the first draft of this note
claimed flex thirds render 101.3pt — wrong: the swatch row is full-screen width
(393), not card width. 393−33 (pads) −24 (gaps) = 336/3 = **112.0pt exactly =
spec**. Flex thirds are pixel-identical on 393 AND scale everywhere. No trade.
## Batch 2 — locale + micro-type (CX01 + counter)

1. `STAT_DEFS.width` → `min-width` floors (`stat-chips.styles.ts` Chip); German
   "Herzfrequenz" grows instead of wrapping inside 28pt. Reference canvases
   unchanged (widths were measured to content + padding).
2. Counter `{count} / 280` mutates per keystroke in proportional figures —
   tabular numerals (`fontVariant: ['tabular-nums']`, the theme's `tabularNumbers`
   pattern) so the header doesn't jitter. One-line, same class as every timer in
   the app.
3. Micro-label casing (`SAY SOMETHING`, `STATS ON CARD`, …) lives in the English
   source without a CSS uppercase rule — translator's contract to keep them
   uppercase, flagged here so the DE pass checks them. No code.

## Batch 3 — light mode: verify-only (no code expected)

- [x] **L01 — LIVE dot + label** `#30D158` / `#4ADE80` in BOTH modes today —
  washed on pale surfaces. This one is a real patch, not a verify: dot →
  `#34C759`, label → `#248A3D` in light (the ON-chip tokens, same hue family,
  spec-adjacent). Dark unchanged.
- [x] **L02 — swatch ring deepened** `#FF9500→#D70015` light
  (`theme-swatches.tsx:59-61`). Verified.
- [x] **L03 — ON/OFF chips** match the spec rows exactly
  (`stat-chips.styles.ts:50-74`). Verified.
- [x] **L04 — nav + sheet Done** `#007AFF` light (nav `:19-20`, sheet `:75`).
  Verified — iOS convention per the light table.
- [x] **L05 — sheets/caption/attach/tag surfaces** theme-aware throughout
  (gradients, edges, grabbers, fills, placeholders). Verified file by file.
- [x] **L06 — CTA brand glow both modes.** Colored shadow kept in light —
  deliberate energy for the primary action (same call as the trends sticky
  confirm), not an oversight. Record only.
- [x] **L07 — posters + slate swatch unthemed.** Images don't theme; slate
  `#4A4A50→#1C1C1E` identical both modes by design. Record only.
- [x] **L08 — hollow OFF ring `#6C6C70` both modes.** Readable on the pale chip
  (≈ light tertiary). Record only.

## Batch 4 — details + verify-only notes

- [x] **D01 — background aura box.** `Aura top: 280, height: 700` fixed; the Svg
  inside is `width: 100%` with no `preserveAspectRatio` (default `meet` → side
  gaps on wide screens, squash beyond). Fix: `preserveAspectRatio="xMidYMid
  slice"` (trends TX08 / feed FX04 precedent — blooms keep shape; the 280 top
  offset is spec-measured and stays).
- [x] **D02 — Screen `background-color` + light null bg.** `Screen` paints the
  theme base and `ScreenBackground` returns null in light — correct layering,
  no dead black either way. Record only.
- [x] **D03 — caption focus treatment.** 1.8pt brand border + `#FF6A3D` glow +
  `#FF6A3D` caret, idle hairline edge — matches the exercise-picker search
  treatment family. Record only.
- [x] **D04 — send affordance.** 34 circle + brand gradient + colored shadow,
  50% disabled, `disabled` prop, trimmed-empty guard. Record only.
- [x] **D05 — sheet scaffold.** 28pt radii, grabber, theme edge/gradient,
  44pt Done, backdrop dismiss, safe-area bottom. Record only.
- [x] **D06 — tag rows.** 64pt min-height rows, flex text, 22pt select badge
  with brand fill + white check (selected) vs 1.4pt hollow ring. Record only.
- [x] **D07 — tagged avatar ring `transparent`.** Chips carry their own
  background — a knockout would punch a false hole. Correct as-is. Record only.
- [x] **D08 — AddLabel `#ffb84d` lowercase hex.** Cosmetic literal; identical
  color. Normalize case while touching the file, nothing more. Record only.
- [x] **D09 — published caption unclamped.** Own words show in full (unlike the
  timeline's 2-line clamp) — deliberate: never truncate the user's own voice
  on their published card. Record only, do not "fix".
- [x] **D10 — `?id=` share-request branch.** Out of scope (recorded open item
  from verification). Do not touch in this loop.

## Verification gates (run at implementation)

`npm run typecheck` 0 new errors · touched-file vitest suites
(`share-composer-simulation`, `composer-data`, `poster-props`) · `oxlint`/`oxfmt`
on touched files · device pass 320/430 × dark/light + 200% text + DE before
closing.

## Implementation notes (2026-09-23 — read before device pass)

- **C01 corrected mid-audit:** flex thirds are exactly 112.0pt on 393 (row is
  full-screen width) — pixel-identical AND scaling. The wrong 101.3pt claim was
  corrected in-ledger, not hidden.
- **Shadow interpolation** (`shadow-offset`/`elevation` ternaries) emits the same
  CSS text as the literal values — no parse difference, verified via typecheck.
- **Gates:** `typecheck` clean on all touched files (remaining errors pre-exist in
  untouched files). Vitest skipped per instruction — run
  `share-composer-simulation`, `composer-data`, `poster-props` before the device
  pass.

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Batch 1: swatch flex, shadows, pills, clamps, CTA, header, nav title | C01–C08, CX02 | typecheck (touched files clean) |
| 2026-09-23 | Batch 2: chip min-widths, tabular counter | CX01 | typecheck (touched files clean) |
| 2026-09-23 | Batch 3: LIVE light colors | L01 | typecheck (touched files clean) |
| 2026-09-23 | Batch 4: aura slice, hex case | D01, D08 | typecheck (touched files clean) |
| 2026-09-23 | Cross-cutting brand sweep: Kinetic → Alcedo user-facing copy | feed.composer.audience.public.detail | en.json string-only, zero layout risk |
| 2026-09-23 | Sweep 2: fragment + fallback + kicker + spec upkeep (same brand) | feed.composer.json, audience-sheet, composer-data | typecheck (touched files clean) |