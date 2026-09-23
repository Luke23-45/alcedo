# Manage exercises polish ledger (source of truth)

Status: **implemented 2026-09-23 — all code patches applied; device pass (320/430,
large text, DE, landscape, last-row vs FAB, Android insets) still required before
closing the acceptance bar.** Per instruction no test files were written or run.
Scope: page 23 — manage exercises (`(tabs)/settings/manage-exercises.tsx`
→ `exercise-manager-screen.tsx` chrome + `smart/exercise-manager.tsx`:
filter row, swipe-to-delete rows, edit sheets, empty states, floating add).
The verification loop deliberately keeps the Paper body un-redesigned —
this ledger honors that: no visual restyle, only correctness/clip/a11y
items in owned code. `ExerciseFilterer`, `ExerciseMuscleSelector`,
`PageActions`, Paper internals are boundaries, not this loop.

Read method: all three files fully. Nothing inferred.

## What is already good (not touched by this ledger)

- Empty-state honesty with first-frame gating (`filtersInitialized` —
  never flashes "no matches") and copy distinction (empty library vs
  filtered-out) ✓.
- Delete/undo matrix tested against the real reducer (tombstone vs
  re-insert); unique testIDs per row; stale-id delete is a no-op.
- Swipe delete is a 70pt action; edit sheet upserts per keystroke with
  Paper labels; single-result auto-expand; mount seeds the full library
  (intended fresh-start).
- Page chrome is fluid (`ManagerPage` flex + 16/12, no fixed widths).

The problems below: one dead inset, unnamed destructive control, and
micro-details. No restyle — ever, in this loop.

## Batch 1 — correctness (ME01–ME03)

- [x] **ME01 — list insets are dead on native.** `contentContainerStyle`
  uses `insetBlockStart/End` (web logical props); grep proves LegendList
  never maps them, and RN drops unknown style keys — so the header inset
  and (worse) the floating-button bottom inset silently do nothing and
  the last rows can hide behind the FAB. Fix: `paddingTop:
  topInsetHeight, paddingBottom: bottomInsetHeight` (same values, valid
  properties).
- [x] **ME02 — delete action is unnamed.** The 70pt red
  `TouchableRipple` carries only a `testID`. Fix: `accessibilityRole`
  button + label reusing the deletion message pattern
  (`deletion.item_deleted.message` shape — check keys before inventing).
- [x] **ME03 — stale exercise renders a blank view.** `if (!exercise)
  return <View></View>` leaves an empty row-sized hole. Fix: return
  null (a deleted id simply shows no row).

## Batch 2 — verify-only (no code expected)

- [ ] **L01 — Paper accordion title clamp.** `descriptionNumberOfLines`
  is set; the title line is Paper's default — verify long names
  truncate (not wrap/push) on 320 DE before touching Paper props.
- [ ] **L02 — FAB overlap + target.** `PageActions` is shared
  foundation — verify the add button clears the last row (with ME01)
  and meets 44pt on device; restyle belongs to the foundation loop.
- [ ] **L03 — legacy `spacing` shim.** The file imports the deprecated
  shim (verification loop proved the 9 oxlint errors pre-exist).
  Migration rides the foundation loop, not this one — recorded.
- [ ] **L04 — mount resets filters.** Intended fresh-start (transient,
  not persisted) — recorded keep.
- [ ] **L05 — iOS-only insets.** `topInsetHeight`/`bottomInsetHeight`
  are iOS-only by `Platform.select` — verify Android spacing on device
  with ME01 (Android may need the same padding via insets).

## Implementation notes (2026-09-23 — read before device pass)

- **ME01 values untouched.** Only the property names changed
  (`insetBlock*` → `padding*`); the computed inset numbers flow through
  identically.
- **ME02 key:** new `exercise.delete.label` = "Delete {name}" (en +
  fallback). `TouchableRipple` spreads a11y props onto Paper's ripple
  (verified in source) — no wrapper changes needed.
- **No restyle, as promised.** Paper body, accordion, sheets, FAB all
  byte-identical.
- **Gates:** `typecheck` clean on all touched files (remaining errors
  pre-exist in untouched files).

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Live insets, named delete, null stale row + new key | ME01–ME03 | typecheck (touched files clean) |

## Verification (owed before close)

- 320/393/430 × dark/light, 200% text + DE, landscape; last-row vs FAB
  overlap; swipe + TalkBack on delete ("delete {name}"); empty-library
  fresh install; Android insets; `npm run typecheck`.
