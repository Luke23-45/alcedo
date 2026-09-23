# What's New polish ledger (source of truth)

Status: **implemented 2026-09-23 — all code patches applied; device pass (320/430,
large text, DE, landscape, all-adopted state, Reduce Motion ON) still required before
closing the acceptance bar.** Per instruction no test files were written or run.
Scope: page 19 — What's New (`whats-new.tsx` → `WhatsNewScreen` →
`WhatsNewEntryCard`, shared `ReleaseCard`, `models/whats-new.ts` entries)
against `settings-dark.md` Screen 6 family + the skill.

Read method: all four files fully. Nothing inferred.

## What is already good (not touched by this ledger)

- Unread pills snapshot at open — they survive the mark-seen effect
  mid-read instead of vanishing ✓ (with a comment explaining why).
- Conditions respected + newest-first; CTAs route to real screens ✓.
- Footer interpolates the real version/build (the honest pattern SH01's
  footer should follow) ✓.
- CTA row is 48pt with named labels; tile/well language matches the
  settings icon wells ✓.
- Empty-applicable (all conditions false) renders release card only — no
  filler ✓ recorded keep.

The problems below: one motion-source inconsistency, clamps, the shim, and
a micro-detail.

## Batch 1 — motion + clip (WN01–WN03)

- [x] **WN01 — scroll respects the OS setting, not the app's.**
  `whats-new-screen.tsx` uses reanimated's `useReducedMotion` (OS-level
  only) while the rest of settings uses `useAppReducedMotion` (which also
  honors the in-app Reduce Motion toggle). Fix: `useAppReducedMotion`
  for `scrollToEntries`.
- [x] **WN02 — title/body/CTA clamps.** `EntryTitle` (flex:1 beside the
  pill), `EntryBody`, `EntryCtaText` unclamped. Fix: title 2 lines, body
  no clamp (grows by design — record), CTA 2 lines. No height changes;
  header/body already grow.
- [x] **WN03 — unguarded entries-Y setState.** `onLayout` sets state on
  every pass (same class as PF09/AP14). Fix: guard unchanged values.

## Batch 2 — migrate (WN04)

- [x] **WN04 — legacy shim in entry styles.** `theme.font.text` /
  `theme.weight.*` in `whats-new-entry-card.styles.ts`. Fix: fold into
  the PF06 migration patch (same one-line pattern).

## Batch 3 — verify-only (no code expected)

- [ ] **L01 — unknown-icon fallback.** `ENTRY_WELLS[icon] ?? blue` — new
  entry icons without a well entry read blue, never crash. Recorded keep.
- [ ] **L02 — append-only discipline.** `whats-new.ts` monotonic ids +
  announce-sparingly rule in the file comment. New settings features
  from loops 13–18 (quiet-hours editor? byte accounting?) do NOT earn
  entries unless they need opt-in. Recorded.

## Implementation notes (2026-09-23 — read before device pass)

- **WN01 verified against the hook's own doc** ("every animation that
  honors the OS setting must read this hook instead") — the migration is
  mandated, not optional.
- **WN04 mapping:** title → `subheadline` 600 + 15/−0.3 kept; body →
  `footnote` 400 exact (gains −0.08 Apple tracking, recorded); CTA →
  `footnote` 600 + −0.2 kept.
- **Extra (same files, same classes):** entry chevron on
  `useChevronColor()` (SH06 family — this loop owns the file), footer
  rebranded Alcedo (SH01 class — screen already passed version+build).
- **Gates:** `typecheck` clean on all touched files (remaining errors
  pre-exist in untouched files).

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Motion hook, layout guard, clamps, shim, chevron, footer brand | WN01–WN04 | typecheck (touched files clean) |
| 2026-09-23 | Cross-cutting brand sweep: Kinetic → Alcedo user-facing copy | settings.whatsnew.footer | en.json string-only, zero layout risk |

## Verification (owed before close)

- 320/393/430 × dark/light, 200% text + DE, landscape; all-read +
  all-adopted (entries empty) states; Reduce Motion ON scroll;
  VoiceOver on pills + CTAs; `npm run typecheck`.
