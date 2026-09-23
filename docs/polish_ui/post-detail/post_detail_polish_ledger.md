# Post detail polish ledger (source of truth)

Status: **implemented 2026-09-23 — all code patches applied; device pass (320/430, large
text, DE, landscape) still required before closing the acceptance bar.** D02 elbow
kept as-is deliberately (recorded, needs eyes not arithmetic). Vitest skipped per
instruction — run the post-detail suites before the device pass.
Scope: Screen 2 only — `app/src/app/(tabs)/feed/item/[id].tsx` →
`post-detail-screen.tsx` (glass header, scroll body, sticky comment bar,
delete/report dialogs, unavailable state) → `post-detail.tsx` (author row,
poster, caption, meta, kudos row, detail action pills, thread, footer) +
`comment-thread`, `comment-bar`, `milestone-poster`, detail glyphs — against
`docs/new_design/social-dark.md` Screen 2 (393×1080) + the spec's light-mode
delta table + `.agents/skills/apple-ios-frontend/SKILL.md`.

Out of scope (other loops): timeline (Screen 1, done), share composer
(Screen 3), profile editor (Screen 4). Shared files (`share-poster`,
`kudos-stack` styles, feed glyphs) are already covered by the feed ledger —
only detail-local findings live here.

Read method: route, screen, and every section in render order, `.tsx` +
`.styles.ts` fully, against the spec SVG geometry. Nothing inferred.

## What is already good (not touched by this ledger)

- Light table faithfully implemented: comment bar `#FBFBFD→#F2F2F5` + hairline
  `#3C3C43` @ .16, comment inks per mode, kudo'd `#FF2D55`/`#D70015` with
  weight change, elbow white .14 / `#3C3C43` @ .20, posters + gold unthemed.
- Geometry verified exact: poster/divider/action row full-bleed at 16pt screen
  margins (`paddingHorizontal: 24` with `-8` inner margins), kudos "6 kudos"
  ending 36pt from the edge (= spec x=357), avatar 44/28/24/32 per slot,
  input pill 38 with the 66pt left inset, send 34 at 50% when empty, scroll
  bottom clearance 156/200 over the sticky bar.
- Thread honesty (empty state, no invented comments), shared `'alex'` thread +
  kudos state with the timeline, real-session poster derivation, draft caption
  parity, locale-aware meta line (settings locale + 12/24h), real session id in
  the footer, 44pt targets on every comment action, reply strip + cancel,
  trimmed-empty sends ignored.
- Glyphs traced from the Screen 2 defs (up-arrow, ellipsis, chevron).

The problems below: two fixed-width overflows, English-only strings, and
small-detail misses.

## Cross-cutting items (PX)

- [x] **PX01 — detail divider 0.67px.** `post-detail.styles.ts` `Divider height:
  0.67px` — a hand guess between hairline and point. Fix:
  `StyleSheet.hairlineWidth`, keep theme colors (spec line is white .08;
  light uses the theme hairline already).
- [x] **PX02 — locale batch (4 sites).**
  - `relative-time.ts` `relativeAgeLong` hardcodes English ("21 minutes ago",
    "just now") on every author subline — the timeline's ages are
    locale-aware, the detail's are not. Fix: `Intl.RelativeTimeFormat(locale,
    { style: 'long' })` ("21 minutes ago" ✓ spec wording) with
    `preferredLanguage`; `relativeAge` compact forms (`18m/2h/1d`) stay —
    numbers + single letters are locale-neutral, recorded.
  - `comment-thread.tsx:91` a11y `` `Kudos, ${n}` `` + `:101` `` `Reply to
    ${name}` `` hardcoded English. Fix: fragment keys
    (`feed.detail.comment.a11y.kudos/reply_to`) with English fallback.
  - `comment-bar.tsx:39` own avatar `personById('alex')` — the contract person,
    not the user's real identity (own-identity law: timeline/detail cards
    resolve through `useOwnPerson`). Fix: `useOwnPerson()` for the avatar
    (the `addComment authorId: 'alex'` thread key stays — it is a local record
    key, not an identity claim). Returns-null risk goes away with it.
  - `milestone-poster` texts unclamped (see P04).
- [x] **PX03 — large-text policy.** Recorded, not coded: no fixed text heights
  here (rows size to content — good), but   the 190 heroes + fixed pills assume
  reference sizes. Containments below prevent overlap; the 200% + German device
  pass is still owed.

## Batch 1 — scale + clip (P01–P05)

- [x] **P01 — action pills fixed 115.** `feed-action-bar.styles.ts` `Pill width:
  115px` ×3 + gap 8 = 361 fixed; the detail container is 361 only on 393
  (345 content + 16 bleed) — 73pt overflow on 320. Fix: `flex: 1` (drop 115);
  German labels ("Kommentieren" ≈ 75pt) fit flex thirds (~90pt on 320).
  Reference canvas renders identically (361/3 thirds). Timeline card variant
  (flex thirds already) untouched.
- [x] **P02 — send button sits 18pt off spec.** `InputRow padding-right: 17` +
  `SendButton margin-right: -5` lands the 34 circle 17pt from the screen edge;
  spec circle spans 324..358 = 35pt. Fix: padding-right 17 → 30, drop the −5
  margin (30 + 5 centering inset = 35 ✓). Input loses ~13pt of flex width —
  correct trade, spec-measured.
- [x] **P03 — author/comment names unclamped.** Detail `Name`, thread `Name`
  have no `numberOfLines` — long user-set names wrap and push timestamps and
  badges. Fix: `numberOfLines={1} ellipsizeMode="tail"` on both (full names
  stay exposed via a11y labels).
- [x] **P04 — milestone poster texts unclamped.** `MedalValue/Unit/Subtitle/Range`
  wrap and break the fixed 190 hero (`overflow: hidden` clips mid-glyph; same
  class as feed F06, but this file is detail-local). Fix: `numberOfLines={1}`
  on all four.
- [x] **P05 — reply strip label.** `ReplyLabel` already clamps ✓; `CancelButton`
  44pt ✓. No change — recorded verified.

## Batch 2 — locale (PX02 call sites)

Implements the PX02 batch (no new test files per instruction; update spec
expectations only where signatures change).

1. `relative-time.ts`: `relativeAgeLong(fromMs, nowMs?, locale?)` via cached
   `Intl.RelativeTimeFormat(locale, { style: 'long', numeric: 'auto' })` —
   "21 minutes ago", "just now" per spec wording in the app language.
   `comment-thread.tsx` passes `preferredLanguage`. `relativeAge` untouched.
2. `comment-thread.tsx:91,101` → `feed.detail.comment.a11y.kudos`
   (`'Kudos, {count}'`), `feed.detail.comment.a11y.reply_to`
   (`'Reply to {name}'`) in `feed.detail.json` with English fallback.
3. `comment-bar.tsx:39` → `useOwnPerson()` avatar (record key unchanged).
4. P04 clamps (above) cover the milestone casing path; poster pill casing was
   fixed in the feed loop (shared `composer-data`).

## Batch 3 — light mode + spec fidelity: verify-only (no code expected)

Each row checked during the audit:

- [x] **L01 — comment bar material** `#FBFBFD→#F2F2F5` @ .95 + hairline
  `#3C3C43` @ .16 (`comment-bar.styles.ts`, screen `:286`). Verified.
- [x] **L02 — kudo'd heart/count** `#FF2D55`/`#FF6A88` dark, `#D70015` both roles
  light (thread `:80-81`, styles `:92-93,101-102`). Verified — matches the
  spec's filled-Jon treatment in both modes.
- [x] **L03 — idle heart/bubble** `#86868B` dark / `#6E6E73` light. Verified
  (spec-outline-grey in both modes).
- [x] **L04 — elbow** white .14 / `#3C3C43` @ .20 (`comment-thread.tsx:139`).
  Verified.
- [x] **L05 — meta/timestamps** `#6C6C70` / `#8E8E93` (spec light table row).
  Verified. Author subline uses `relativeAgeLong` (Batch 2 makes it locale-true).
- [x] **L06 — posters + gold + kudos knockout `#17171A`/`#FFFFFF`** (`post-detail.tsx
  :118-122`, spec pin, not page bg). Verified. Author/comment avatars correctly
  use page bg (they sit on the page — no knockout needed).
- [x] **L07 — header glyphs `#8E8E93` both modes.** Spec dark value; acceptable
  on the light glass header. Record only.
- [x] **L08 — thread name 600 vs spec 650.** iOS has no 650 weight; 600 semibold
  is the honest mapping. Record only, do not "fix".

## Batch 4 — details + verify-only notes

- [x] **D01 — PX01 hairline.** Divider `0.67px` → `StyleSheet.hairlineWidth`.
- [x] **D02 — elbow joint.** Path matches the spec's `M38…H52` proportions, but
  the horizontal lands ~3pt short of the reply avatar edge; vertical anchoring
  (`top: -24`) is layout-relative. Verify on device before touching — recorded,
  no code.
- [x] **D03 — comment header tracking.** `10/700/+1.35` + CSS uppercase =
  skill micro-label law ✓. Record only.
- [x] **D04 — thread text colors.** Body `#E5E5EA`/`#1C1C1E`, time `#6C6C70`/
  `#8E8E93` — both spec rows. Record only.
- [x] **D05 — send affordance.** 34 circle + brand gradient + colored shadow,
  50% opacity empty, `disabled` + a11y state, trimmed-empty guard. Record only.
- [x] **D06 — unavailable state.** Foundation `EmptyInfo` + honest copy; header
  kept for back navigation. Out of scope (foundation control). Record only.
- [x] **D07 — footer session id.** Real `model.sessionId`, never the contract
  `S-0609-A`. Record only (honesty check, already correct).

## Verification gates (run at implementation)

`npm run typecheck` 0 new errors · touched-file vitest suites (`post-detail-*`,
`relative-time`-adjacent) · `oxlint`/`oxfmt` on touched files · device pass
320/430 × dark/light + 200% text + DE before closing.

## Implementation notes (2026-09-23 — read before device pass)

- **P02 math:** padding-right 30 + 5 centering inset = 35 ✓ spec. Input gives up
  ~13pt of flex width — the spec-measured trade, not a regression.
- **P01 on 393:** (361−16)/3 = 115.0 exact thirds — reference canvas pixel-identical.
- **`relativeAgeLong` sub-minute** keeps spec-pinned `'just now'` (its spec pins the
  literal); minutes/hours/days are locale-true. Documented, not skipped.
- **Comment-bar avatar:** `useOwnPerson()` always returns a person, so the old
  `personById('alex')` null-guard (which could hide the entire composer) is gone
  by construction. Thread `authorId: 'alex'` record key unchanged.
- **Gates:** `typecheck` clean on all touched files (remaining errors pre-exist in
  untouched files). Vitest skipped per instruction — run `post-detail-*` suites
  before the device pass.

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Batch 1: flex pills, send inset, name/milestone clamps | P01–P04 | typecheck (touched files clean) |
| 2026-09-23 | Batch 2: relativeAgeLong locale, comment a11y keys, own avatar | PX02 | typecheck (touched files clean) |
| 2026-09-23 | Batch 3: light table verified row by row | L01–L08 | code review (no changes) |
| 2026-09-23 | Batch 4: divider hairline | D01 (PX01) | typecheck (touched files clean) |
| 2026-09-23 | Cross-cutting brand sweep: Kinetic → Alcedo user-facing copy | feed.detail.share.* (4 keys) | en.json string-only, zero layout risk |
| 2026-09-23 | Sweep 2: fragment + share-text fallbacks (same brand) | feed.detail.json, post-detail-screen | typecheck (touched files clean) |