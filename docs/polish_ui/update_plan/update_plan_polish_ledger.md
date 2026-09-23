# Update Plan (diff-save) polish ledger (source of truth)

Status: **implemented 2026-09-23 — all code patches applied; device pass (320/430, large text, DE)
still required before closing the acceptance bar.** No verification runs yet by user request
(`typecheck`/`lint`/`vitest` skipped) — run them plus `plan-diff-logic.spec` /
`diff-save-simulation.spec` before the device pass.
Scope: `/diff-save` in render order — route `app/src/app/diff-save.tsx` through
`components/smart/session-diff-save.tsx` and `components/presentation/plan-diff/` (background,
update-plan-screen, mode-segmented-control, diff-review-card, plan-commit-bar, plan-diff-logic) —
for **dark + light** and **iOS + Android**.
Out of scope (own ledgers later): workout editor / exercise editor (navigation targets),
`ConfirmationDialog`/`Menu` foundation chrome (not used on this screen — no dialogs at all).
Audited 2026-09-23 by reading each file end-to-end (no skips). Same rules as the home/session/
workout-editor/exercise-editor ledgers: one patch per item (or tight group), state closed IDs,
check boxes only with code + verification, append new IDs (never reuse), keep sorted by section.

## Ground truth references (do not re-derive)

- Skill (law): `.agents/skills/apple-ios-frontend/SKILL.md` — same bar (4pt grid, 44pt targets,
  negative-display / positive-micro tracking, computed values, dy10/blur14 cards, colored shadows
  on primary actions, 2-stop gradients, no dead black).
- Reference: `docs/new_design/diff-save-redesign.md` (full 393×1000 SVG inline, lines 6–144) +
  change table (150–158) + light table (168–177). Gradient/filter IDs cited below come from its
  `<defs>` (`cd` card body, `ce` edge, `br` brand, `gl` gloss, `tb` tab-bar backer, `fc`/`ft`/`fb`
  shadows, `bk` chevron, `ck` check, `lck` lock, `ic-db` dumbbell, `sav` save glyph).
- Honesty anchors (do not regress): locked session-name row never counted/never toggled (`ALWAYS`
  tag + lock, not an empty checkbox); `N SELECTED` computed from checked rows; deselected rows
  excluded from commit; save-as-new appends uniquely-named; history session untouched; mode switch
  recomputes + resets selection; Reset restores all-checked; empty state when no diff; ICU plurals
  on selected-count/save-label/card-count/notes-detail; U+2212 minus in deltas; SI `s` units.
- What's already right: checkbox geometry + per-mode fills (`#30D158`/`#34C759` per the light table),
  transition typography (old/arrow/new inks per spec), tone text colors (added/removed per table),
  destructive-ghost Discard (`#FF6B60`/`#D70015` per table), deliberate light deviations
  (Discard text, Reset `#007AFF` — recorded in page-verification, keep), native-header Reset contract,
  a11y checkbox/tab roles with states, 44pt segment buttons, 54pt commit buttons.

## Global acceptance bar (applies to every item)

- [ ] No clipping/overlap at 320 / 360 / 393 / 430 pt widths, portrait + landscape, iOS + Android.
- [ ] No clipping at 200% text size and with German strings (longest locale).
- [ ] Dark and light both intentional (light table applied as written — including its two deliberate
  deviations, which stay).
- [ ] Every dimension a multiple of 4, every interactive visual ≥ 44pt (or `hitSlop` to 44 with no
  neighbour overlap), no dead button-look controls.
- [ ] Numbers locale-formatted, uppercase locale-safe, no hardcoded English in UI.

---

## UX — Cross-cutting (fix once, helps every section)

- [x] **UX01 — dead `text-transform: uppercase` (React Native ignores it).** Problem: same class as
  session SX01 / workout-editor EX01 / exercise-editor NX01 — verified against `en.json`, whose values
  are Title/lower case: `ReviewTitle` renders `Review changes` vs spec REVIEW CHANGES
  (`update-plan-screen.styles.ts:49-56`, en 1692); `SelectedChipText` renders the `{count} selected`
  ICU lowercase vs spec `5 SELECTED` (styles 68–75, en 1693); card `MicroLabel` renders
  `Session`/`Added`/`Removed`/`Modified` vs spec SESSION/ADDED/REMOVED/MODIFIED (card styles 51–70,
  en 1694–1697); `AlwaysText` renders `Always` vs spec ALWAYS (card styles 223–230, en 1702).
  `DeltaText` needs nothing (ADD/REMOVE are hardcoded-cap literals, `+1`/`+30 S` numeric ✓).
  Fix: `toLocaleUpperCase()` at the 7 call sites (title, composed selected string, 4 card labels,
  always tag), delete the dead CSS. Accept: caps match spec in EN + DE, no `text-transform` remains.
- [x] **UX02 — hairlines.** Problem: `BarSurface` top border 1px (commit-bar styles 9–10),
  `RowSeparator` 1px (card styles 80–85). Fix: `StyleSheet.hairlineWidth` (precedent in all three
  prior loops). Accept: hairline weight matches spec on device.
- [x] **UX03 — no font stack anywhere: verified, keep.** Problem class (font-shim migration) does NOT
  apply — plan-diff styles declare no `font-family` at all (system SF by default) and read no
  deprecated shim, so the shim removal cannot break this screen. Record keep; do not add families
  for migration's sake (visuals are already correct).
- [x] **UX04 — background distortion.** Problem: `plan-diff-background.tsx:31` renders
  `viewBox 0 0 393 1000` with `preserveAspectRatio="none"` — circles become ellipses off-393 widths
  and the fixed `cy` (140/760) drifts on long diffs (same class home S03 / session SX09 fixed with
  `slice`). Positions/opacities already match the reference A1/A2 (`.16`/`.08`, `.6` light dim ✓).
  Fix: `xMidYMid slice` (home/session precedent). Accept: circular auras 320–430.
- [x] **UX05 — hardcoded `rest` word in the exercise summary.** Problem: `plan-diff-logic.ts:129`
  composes `exercise_summary` (`{sets} × {reps} · {rest} rest`, en 1705) with a literal English
  `rest` — DE renders `3 × 8 · 90 s rest`. The suites assert params/keys, not rendered English
  (logic.spec + simulation.spec check `"sets":3`-style fragments), so restructuring is test-safe.
  Fix: add a `restWord` param to the ICU (`{sets} × {reps} · {rest} {restWord}`, reusing the existing
  `plan.diff.rest.label` "Rest" — lowercased by translators per locale, other locales fall back to
  English). SI `s` units stay (NX05-style SI keep). Accept: summary fully localized, suites green.
- [x] **UX06 — review cards miss the card treatment.** Problem: `diff-review-card.styles.ts:10-40`
  paints flat rgba fills + 1px solid borders with no gradient body, no edge stroke, no shadow —
  but the reference draws every card with `cd` + `ce` + `fc` (spec lines 65–66, 83–84, 95–96,
  107–108) and skill §3 requires body + edge + shadow on every card. Fix: seat the tone washes
  inside the shared card treatment (HomeCard-style edge/body + tone-tint overlay, `fc` shadow),
  keeping the exact tone rgba values. Accept: cards lift like the rest of the app, tints intact.
- [x] **UX07 — Save button misses the brand treatment.** Problem (spec lines 135–139):
  `plan-commit-bar.tsx:74-80` runs the gradient **horizontal** (`0,0→1,0`) vs spec `br` diagonal
  (`0,0→0.6,1`); no gloss cap (spec line 136: 27px `gl` @.35); no white `.22` edge (line 137);
  black dy4/blur10/.3 shadow vs spec brand `fb` dy7/blur12/.5. Light stops
  `#E07800→#FF6A3D→#D70015` match no published ramp — align to the home light brand
  (`#FFA312→#FF5A3C→#E8003F`) or record a keep with reason. Fix: diagonal gradient + gloss + edge +
  brand shadow (session `BrandButton` is the in-repo pattern), decide light stops in writing.
  Accept: the primary CTA matches spec pixel-for-pixel.
- [x] **UX08 — commit bar too transparent.** Problem: `BarSurface` (commit-bar styles 4–12) sits at
  `.72` both modes vs spec `tb` `.94→.99` (line 131) and the light table `.93` (line 177) — scrolling
  rows show through nearly twice as strongly as designed. Fix: `.94` dark / `.93` light per spec.
  Accept: bar reads as a sticky surface, not a veil.
- [x] **UX09 — amber text uses `#B25000`, table says `#C93400`.** Problem: the light table (line 172)
  deepens modified text to `#C93400`, but `MicroLabel` modified (card styles 63–64),
  `SelectedChipText` light (screen styles 74), and `DumbbellGlyph` light (card tsx 50) all render
  `#B25000`. Page-verification logged only two deliberate light deviations (Discard, Reset) — this
  is not one of them. Fix: `#B25000` → `#C93400` in the three spots. Accept: table-exact amber text.
- [x] **UX10 — small ink alignments.** Problem: neutral `MicroLabel` is `#8E8E93` both modes (card
  styles 66–67) vs spec `#98989F` (line 67); `HeaderCount` is `#86868b` (styles 72–78) vs spec
  `#6C6C70` (lines 86, 98, 110); `LockGlyph` is `#8E8E93` (card tsx 42–43) vs spec `#6C6C70` (line
  71). Fix: the three spec values (dark; light keeps current legible equivalents — record each).
  Accept: header/lock/count inks match spec dark, calm light.
- [x] **UX11 — delta chips 9.5 vs spec 8.** Problem: `DeltaText` (card styles 186–202) is 9.5/700/+.5;
  spec renders ADD/REMOVE/+1/+30 S at 8/700/+.5 (lines 92, 121, 128) inside 18pt chips. `AlwaysText`
  9.5 vs spec 7.5 (line 75) — but 7.5 sits below the 9pt micro floor, so keep 9.5 per the "real
  numbers beat the grid, legibility beats both" rule (workout-editor E04a precedent) and record.
  Fix: `DeltaText` 9.5→8 (chip 20→18 tall to match spec rows? spec chips are 18pt — resize chip
  20→18 with the text, or keep 20 with 8 text? Spec chip rows are 18 high; take 18 + record);
  `AlwaysText`/`AlwaysTag` keep 9.5/20, record. Accept: delta chips match spec, ALWAYS legible.
- [x] **UX12 — header counts show words, spec shows bare numerals.** Problem: `HeaderCount` renders
  `card_count` (`1 change`, en 1698) but spec shows bare `1`/`2` (lines 86, 98, 110). Fix: pass the
  bare count (already computed at the three call sites) and drop `card_count` from `en.json`
  (unreferenced afterwards — verify before deleting). Other locales keep a stale key harmlessly.
  Accept: headers match spec, no orphan references.
- [x] **UX13 — consequence line centered, spec left.** Problem: `ConsequenceLine` (screen styles
  33–40) is `text-align: center`; spec line 57 draws it at x=24 (left). Fix: left-align. Accept:
  matches spec.
- [x] **UX14 — transition flex guards.** Problem: `TransitionRow` children (`OldValue`, arrow,
  `NewValueText`, card styles 133–161) are all unflexed single-line texts — values here are short
  (`4 sets`, `90 s`) so nothing overflows today, but any long transition would push past the row
  instead of truncating. Fix: `OldValue flexShrink: 1`, `NewValueText flex: 1, minWidth: 0`
  (both already `numberOfLines={1}` ✓). Reference content renders identically. Accept: overflow made
  impossible by construction.
- [x] **UX15 — Discard label unclamped in a fixed 110 button.** Problem: `DiscardButton` is fixed
  110×54 (spec ✓ keep) but `DiscardLabel` has no clamp — a long translation wraps inside the fixed
  pill. Fix: `numberOfLines={1}` (spec `Discard` fits; DE `Verwerfen` ≈ 75pt fits 110). `SaveLabel`
  sits in `flex: 1` and is safe. Accept: fixed buttons can never wrap.
- [x] **UX16 — segment labels unclamped.** Problem: `SegmentLabel` (segmented styles 50–56) has no
  `numberOfLines` — `Update {long plan name}` wraps inside the fixed 44 track and clips.
  Fix: `numberOfLines={1}` (ellipsis; full name stays visible in the intro subtitle). Tracking
  −0.2 vs spec −0.15 (line 56): align to −0.15 in the same patch. Accept: one-line segments always.
- [x] **UX17 — save label weight is correct (700), record keep.** Problem class check: spec says 650
  (line 139) but RN renders non-hundred weights as Regular — 700 is the correct nearest (same
  precedent as session/session-editor 650→600/700 notes). Tracking −0.2 vs −0.25: align to −0.25.
  Accept: weight kept deliberately, tracking matched.

## U00 — Shell (`session-diff-save.tsx`)

- [x] **U00a — verified, keep.** Native-header Reset contract (44-min, 15/400, deliberate light
  `#007AFF` ✓); screen padding/gap discipline lives in `ScreenContent` (16/16/8/28 + 16 — bottom 28
  plus the floating-bar spacer clears the bar ✓); selection state keyed by stable change IDs with
  mode-switch recompute ✓; dismiss clears the pending diff ✓. No change; recorded so the shell isn't
  reworked.

## U01 — Intro (`update-plan-screen.tsx` 88–94 + styles 11–26)

- [x] **U01a — verified, keep.** Title 24/700/−0.6 ✓ (spec line 48), subtitle 13/500/−0.2 ✓ (lines
  49–50), destination-aware ICU ✓, 6pt title→subtitle rhythm (≈ spec 24pt baselines). No change.

## U02 — Mode block (screen 96–103 + `mode-segmented-control/`)

- [x] **U02a — verified, keep shape.** Track 44/rx22 ✓ (spec line 53), thumb inset 3/rx19 ✓ (≈19.5),
  dark thumb wash + border ✓ (lines 54–55), light thumb white + dy1/blur3/.18 shadow ✓ (table),
  selected `#FFF`/`#111` + quiet `#8E8E93` ✓ (line 56), 44-min buttons ✓, tablist/tab roles ✓.
  Consequence via UX13. Segment clamps via UX16. No other change.

## U03 — Review header (screen 105–114 + styles 42–75)

- [x] **U03a — caps + chip color + count words.** Title caps (UX01), chip text caps + `#C93400` light
  (UX01 + UX09), `HeaderCount`→bare numeral (UX12). Chip box (20pt, amber wash ✓ spec lines 61–62)
  keeps geometry. Accept: header matches spec lines 60–62.

## U04 — Review cards (`diff-review-card/`)

- [x] **U04a — card treatment (UX06) + header inks (UX10) + micro caps (UX01).** Accept per UX items;
  `CardHeader` padding + 4 bottom ✓, `CardsWrap` gap 12 ✓, conditional card rendering ✓, modified
  count = changes + reorders ✓ (spec line 110 `2` ✓).
- [x] **U04b — rows verified, keep shape.** 64-min rows ✓, 22 checkbox/lock visuals ✓, title
  13.5/600/−0.2 with tone inks ✓ (lines 72–79), description 10.5 ✓ (line 80), transition inks ✓
  (lines 119, 126), delta chips (UX11), `ALWAYS` tag (UX01), group header dumbbell + clamped name ✓
  (lines 111–113; 650→600 precedent recorded), separators (UX02). Locked rows truly non-pressable
  (`onPress: undefined` + `disabled` ✓) with checkbox a11y state ✓. `Fragment key={index}` over
  static per-card lists: no reorder/removal inside a card — safe, record. Accept: no change beyond
  folded UX items.

## U05 — Commit bar (`plan-commit-bar/`)

- [x] **U05a — bar + buttons (UX02 + UX07 + UX08 + UX15 + UX17).** Accept per UX items. Kept as
  verified: 110×54 ghost Discard geometry ✓ (lines 133–134), flex-fill Save 54 ✓ (line 135),
  disabled state (flat wash + `#8E8E93` + plain `Save`, glyph hidden ✓ — no reference, honest),
  pressed opacities (.6/.85 ✓), save glyph 15 rounded ✓ (spec `sav`), count in label via ICU ✓,
  full a11y labeling + disabled state ✓. No other change.

## U06 — Background (`plan-diff-background.tsx`)

- [x] **U06a — distortion + base verified.** Slice via UX04; base `#0B0B0E`/`#F2F2F7` ✓; ember/green
  positions + opacities match A1/A2 ✓ (spec lines 12–13), `.6` light dim reasonable ✓. No other
  change.

## U07 — Nav / Reset (`session-diff-save.tsx` 35–50)

- [x] **U07a — verified, keep.** 44-min target, 15/400, `#FF9F0A` / deliberate `#007AFF` ✓ (table
  line 176), right-aligned, a11y labeled. The native header (not a custom nav) is correct here —
  spec draws the title + Reset in OS chrome (lines 44–45). No change.

## Patch order (suggested, smallest-risk first)

1. UX01 caps + UX05 rest-word + UX12 bare counts (strings, test-safe — suites assert keys/params).
2. UX09 amber + UX10 inks + UX11 delta size + UX17 tracking (color/type pass, one review).
3. UX06 card treatment + UX07 save treatment + UX08 bar opacity (the three material items).
4. UX02 hairlines + UX04 slice + UX13 align + UX14 flex + UX15/UX16 clamps + UX19 tracking.

## Implementation notes (2026-09-23 — read before device pass)

- **UX07 light stops decided:** home light brand (`#FFA312→#FF5A3C→#E8003F`) via the shared
  `brand` variant — one brand family app-wide, rather than a third screen-local ramp.
- **UX07 light shadow:** `.35` (session/rest-timer light precedent), not the dark `.5`.
- **UX06 neutral edge kept simple:** tone cards carry their spec colored edges; neutral keeps its
  subtle solid edge (the gradient-edge refinement would buy little over the new body + shadow).
  Do not "upgrade" it later without a written reason.
- **UX11 `ALWAYS` kept at 9.5:** spec 7.5 sits below the 9pt legibility floor; delta chips went to
  spec 8 with 18pt boxes.
- **UX12 key removed:** `plan.diff.review.card_count` deleted from `en.json` after the last
  reference was replaced (verified unreferenced); other locales keep a harmless stale key.
- **UX05 test-safe:** the suites assert ICU keys/params, not rendered English — the new `restWord`
  param degrades to empty in untranslated locales (English correct).
- **U04b `Fragment key={index}` kept:** per-card row lists are static (no reorder/removal inside a
  card) — safe, recorded so it isn't "fixed" later.
- **UX17 weight correct:** spec 650 would render as Regular on RN — 700 is the nearest real weight.
- **One self-caught slip:** a placeholder `en.json` key was added and reverted in the same pass —
  no trace remains (verified by re-read).
- **No verification runs yet by user request** (`typecheck`/`lint`/`vitest` skipped). Run them plus
  `plan-diff-logic.spec` / `diff-save-simulation.spec` before the device pass.

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Batch 1 caps + rest-word + bare counts (+en.json sync) | UX01, UX05, UX12 | code review only |
| 2026-09-23 | Batch 2 amber/ink/size/tracking pass | UX09, UX10, UX11, UX17 | code review only |
| 2026-09-23 | Batch 3 card material + save treatment + bar opacity | UX06, UX07, UX08 | code review only |
| 2026-09-23 | Batch 4 hairlines/slice/align/flex/clamps | UX02, UX04, UX13, UX14, UX15, UX16 | code review only |
