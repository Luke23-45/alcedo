# Exercise search polish ledger (source of truth)

Status: **implemented 2026-09-23 — all code patches applied; device pass (320/430,
large text, DE, landscape, cold-start deep link, language switch) still required
before closing the acceptance bar.** Per instruction no test files were written or run.
Scope: page 21 — exercise search (`app/exercise-search.tsx` →
`smart/exercise-search.tsx` + styles: glyphs, search field, filter chips,
results LegendList, recents/suggested idle, empty state, scroll fade).
The requester (`exercise-searcher.tsx`) is a boundary, not this loop.
No design SVG ships for this screen — the code's own spec comments
(393×852 reference) are the geometry source, checked against the skill.

Read method: both files fully, in render order. Nothing inferred.

## What is already good (not touched by this ledger)

- Aura is `xMidYMin slice`, single asymmetric blue aura at spec opacity,
  calmed in light ✓ (skill: no centered auras).
- Scroll fade is the last-40pt gradient, not an arrow ✓ (skill §7).
- Clamps correct everywhere text meets fixed heights (names/subs/titles
  1 line); list gaps/padding on the 4pt grid (8/12/16/56).
- Touch targets honest: chips 28 + vertical hitSlop 8 (→ 44), field 38 +
  hitSlop 3 (→ 44), add 30 + hitSlop 7 (→ 44), Cancel hitSlop 14, Clear
  hitSlop 16.
- Behavior honesty intact: exact-match suppresses create, RECENTS capped
  at 3 with Clear, equipment chips only for present values, debounce 100,
  stale-catalog re-resolve, per-instance requestId flow.
- Glyphs are spec-measured with scale comments; accents stable per id
  (hash, not random); `glyphKind` defaults unknown equipment to plate
  rather than crashing.
- Pressable rows carry `borderCurve: 'continuous'` ✓.

The problems below: one genuine 320pt overflow, one fixed card height,
locale-blind micro-labels, a fixed chevron, the shim, and a11y names.

## Batch 1 — scale + clip (ES01–ES03)

- [x] **ES01 — search field overflows ~70pt on 320.** `SearchOuter width:
  310` fixed + gap 6 + Cancel; 16 + 310 + 6 + ~50 Cancel ≈ 382 > 320.
  Computed. Fix: `SearchOuter flex: 1; min-width: 0; max-width: 310` +
  Cancel `flex-shrink: 0` (Cancel already right-aligns in a `flex: 1`
  pressable). 393 EN renders ~307 (3pt under spec — recorded, acceptable);
  DE/long locales shrink the field instead of clipping.
- [x] **ES02 — result card fixed 52.** `HomeCard style={{ height: 52 }}`
  + `RowPressable height: 50`; at 200% text two 1-line rows total ~52pt
  and clip 2pt. Fix: card `minHeight: 52`, pressable `min-height: 50`
  (reference rendering identical; worst case grows 2pt instead of
  clipping).
- [x] **ES03 — chip labels unclamped.** `ChipText` (12pt muscle/equipment
  names) in fixed-28 chips. Fix: `numberOfLines={1}` + full-name
  `accessibilityLabel` on the chip (role button currently voicing
  truncated text).

## Batch 2 — locale + light + shim (ES04–ES06)

- [x] **ES04 — micro-labels rely on pre-uppercased translations.**
  `SectionLabel` has tracking but no transform; fallbacks ship uppercase
  ("RECENTS", "SUGGESTED FOR PUSH DAY") but translated values may not
  be — same class as SH02. Fix: `toGroupLabelCase(label, locale)` at the
  three call sites (import the shared helper or relocate it neutral —
  decide in the patch, don't duplicate the logic).
- [x] **ES05 — chevron fixed dark grey.** `ChevronGlyph stroke="#48484A"`
  both modes (SH06 class). Fix: theme-aware (`#48484A` / `#C7C7CC`).
- [x] **ES06 — legacy shim in search styles.** `theme.font.text` across
  `SearchInput`, `CancelText`, `ChipText`, `SectionLabel`, `ClearText`,
  `RowName`, `RowSub`, `CreateTitle`, `CreateSub`, `EmptyTitle`,
  `EmptySub` (the `fontWeight` token import itself is fine — only the
  `theme.font` shim goes). Fix: `type(theme, …)` + spec-size overrides
  per the PF06 pattern; visuals pixel-identical.

## Batch 3 — a11y names (ES07–ES08)

- [x] **ES07 — rows and add buttons are unnamed.** `RowPressable` (role
  button, no label) + nested `AddButton` (role button, no label) — two
  nested nameless buttons. Fix: row label = exercise name; add-button
  label = "Add {name}" (new fragment key or `exercise.search.add_x`
  if it exists — check before inventing).
- [x] **ES08 — search field has no label.** Only `testID`. Fix:
  `accessibilityLabel` reusing the placeholder string.

## Batch 4 — verify-only (no code expected)

- [ ] **L01 — light rows.** Chip active pill (white + hairline edge per
  the home mapping), search fill, placeholder `#AEAEB2`, row ink,
  create-row edge — verify on device.
- [ ] **L02 — SafeArea base colors.** Hardcoded `#0B0B0E` / `#F8F8FC` —
  verify against `theme.home.screenBackground`; adopt the token if it
  matches, else record why the screen diverges.
- [ ] **L03 — nested add-button double-fire.** Row + inner add run the
  same `onSelect` — harmless today. Recorded; only rework if the row
  action ever diverges from add.
- [ ] **L04 — `autoCapitalize="words"`.** Fine for proper-noun exercise
  names, matching case-insensitive; verify with "e-z curl" style names
  on device before changing.

## Implementation notes (2026-09-23 — read before device pass)

- **ES01 arithmetic.** 393 content is 361; Cancel EN ≈ 48 → field ≈ 307
  (3pt under the 310 spec — recorded, acceptable). Cancel lost `flex: 1`
  deliberately: a second flexer would halve the field; its hitSlop-14
  keeps the target generous.
- **ES04 import direction.** `toGroupLabelCase` imported from the
  settings shared module (single source of truth beats a duplicated
  one-liner; the module is pure + already store-backed).
- **ES06 visuals preserved.** Every migrated style keeps its spec size /
  tracking / line-height as overrides; `fontWeight` import removed
  (zero remaining uses — verified by grep).
- **ES07 key:** new `exercise.search.add_exercise` = "Add {name}" (en +
  fallback, established pattern).
- **Gates:** `typecheck` clean on all touched files (remaining errors
  pre-exist in untouched files).

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Flex field, min-height card, chip clamp, locale labels, chevron, row/add/field names | ES01–ES05, ES07, ES08 | typecheck (touched files clean) |
| 2026-09-23 | Full shim migration + new add_exercise key | ES06 | typecheck (touched files clean) |

## Verification (owed before close)

- 320/393/430 × dark/light, 200% text + DE, landscape; VoiceOver on
  field/chips/rows/add buttons; cold-start deep link with pre-filled
  name; language switch mid-search; `npm run typecheck`.
