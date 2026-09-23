# Settings home polish ledger (source of truth)

Status: **implemented 2026-09-23 — all code patches applied; device pass (320/430,
large text, DE/TR, landscape, empty-identity install) still required before closing
the acceptance bar.** Per instruction no test files were written or run.
Scope: page 13 — settings home (`(tabs)/settings/index.tsx` → `SettingsHome` →
`ProfileHeader`, `AccountGroup`, `TrainingGroup`, `PreferencesGroup`,
`DataSyncGroup`, `CommunityGroup`, `SupportGroup`, shared
`grouped-settings-list` row anatomy + `settings-background` `home` variant)
against `docs/new_design/settings-dark.md` Screen 1 (393 × 1582) + the skill.

Read method: every file in render order, `.tsx` + `.styles.ts` fully, against
the spec SVG geometry. Nothing inferred. `en.json` `settings.home.*` (71 keys)
read to check copy honesty.

## What is already good (not touched by this ledger)

- Fluid cards: `CardEdgeBase margin-horizontal: 16`, no fixed 361 widths — the
  responsive base is already better than the profile-editor loop's start.
- Rows are `min-height: 58` (they grow) with full-width pressables; clamps are
  correct: title 1 line, subtitle 2 lines, value 1 line.
- Toggle geometry is exactly computed: 44 track − 22 knob − 2×2 insets = 18
  travel; offsets 2/20 ✓. Reduced-motion snaps; external sync via effect ✓.
  Touch target 52 high with hitSlop-9 ✓.
- Background is `xMidYMin slice`, auras asymmetric (60,160 / 375,800) at spec
  opacities, dimmed 0.45 in light ✓ (skill: no centered auras, no dead black).
- Honest rows everywhere they matter: Watch static + `hideChevron`, Rate
  "Not available" static, Guidelines static, backup "Never backed up" — no
  fake affordances, no dead links.
- Header a11y label falls back to "Edit profile" when identity is empty ✓.
- Separators already sit at the text column (62/20 = x78→x357 on 393 ✓).
- 4pt grid holds: 28 group gaps, 16/24 margins, 34 wells, 58 rows.

The problems below: one stale footer, one hairline, one fixed header height,
one fixed chevron color, locale-unsafe casing, row-label a11y, and a shim.

## Batch 1 — correctness + scale + clip (SH01–SH08)

- [x] **SH01 — footer is stale brand + hardcoded version.**
  `settings.home.footer` = "Kinetic 1.0.0 (238) · Made with care in
  California", but the app is Alcedo and the real version already exists
  (`support-group.tsx` `appVersion`). Genuine bug, not taste. Fix: rebrand
  the string and interpolate `{version}` from `expo-application` like the
  App Info row does.
- [x] **SH02 — group-label uppercase path unverified.**
  `GroupLabel` uses CSS `text-transform: uppercase` over mixed-case i18n
  ("Your Training", "Data & Sync"). If the native pipeline ignores it,
  labels render mixed-case against the spec's 10/700/+1.35 micro-labels —
  and CSS uppercasing is locale-blind (Turkish dotted-İ). Fix: verify on
  device; if ignored or locale-wrong, uppercase at the call site with
  `toLocaleUpperCase(locale)` and drop the CSS rule.
- [x] **SH03 — 1px separator.** `RowSeparator height: 1px` renders ~2–3
  physical px on @2x/@3x. Fix: `StyleSheet.hairlineWidth`, keep color +
  62/20 insets.
- [x] **SH04 — trailing cluster can squeeze the text column.**
  `RowTrailing` (badge + value + chevron) has no shrink contract while
  `RowText flex: 1` has no `min-width: 0`; a long German value ("Nicht
  angemeldet") + chevron on 320 squeezes titles. Fix: `RowValue
  flex-shrink: 1` + `RowText min-width: 0`; verify on 320 DE. Values stay
  1-line, right-anchored.
- [x] **SH05 — header fixed 80 with empty-identity blank.**
  `HeaderPressable height: 80` + name/subtitle both `numberOfLines={1}`;
  before any identity exists both lines render empty (honest, but a blank
  card). Fix: `min-height: 80` + vertical padding so 200% text grows
  instead of clipping; verify the empty state on device (no fictional
  fallback — that honesty stays).
- [x] **SH06 — chevron fixed dark grey in light mode.** `chevronColor =
  '#48484A'` both modes; iOS light chevrons are `#C7C7CC` (the profile
  tokens already use it). Fix: theme-aware chevron (`#48484A` dark /
  `#C7C7CC` light).
- [x] **SH07 — rows announce title only.** `SettingsRow` sets
  `accessibilityLabel={row.title}` — the value ("Dark", "Connected",
  "5:30 PM") and BETA/NEW badge are silent. Fix: label = title +
  (value ?? subtitle ?? '') + (badge ?? '').
- [x] **SH08 — locale-unsafe capitalization.** `preferences-group.tsx`
  `accentLabel` and `community-group.tsx` `visibilityLabel` use
  `charAt(0).toUpperCase()`. Fix: locale-aware casing with
  `settings.preferredLanguage` (same rule as the HX/TX/PX loops).

## Batch 2 — migrate + micro-detail (SH09–SH11)

- [x] **SH09 — legacy shim in the App Info dialog.**
  `support-group.tsx` dialog styles use `theme.font.text` /
  `theme.weight.*` — the deprecated shim (AGENTS.md: new code must not use
  it). Fix: migrate to `type(theme, …)` + theme weight tokens.
- [x] **SH10 — duplicated aura comment.** `settings-background.tsx` lines
  26–30 repeat the 18–24 comment block almost verbatim. Fix: delete the
  duplicate (comment-only cleanup).
- [x] **SH11 — avatar 1px ring recorded as keep.** `AvatarBase border-width:
  1px` is a 1pt ring — correct iOS behavior, not the divider hairline
  issue. No change; recorded so a later loop doesn't "fix" it.

## Batch 3 — verify-only (no code expected)

- [ ] **L01 — light rows.** Toggle OFF fill, footer `#AEAEB2`, value
  `#8E8E93`, gold badge identical both modes, fixed `#86868B` subtitles.
  Verify on device against the phase-6 light deltas.
- [ ] **L02 — BETA/NEW stay Latin.** Universal tags, spec-micro-labels.
  Recorded keep.
- [ ] **L03 — storage subtitle claims categories only.** "iCloud · Local ·
  Health" with no byte accounting — honest as far as it goes (the
  data-sync comment says so explicitly). Recorded; byte accounting is a
  feature, not this loop.
- [ ] **L04 — `ownPersonInitial('', '')` empty state.** Verify what renders
  (blank vs placeholder) on a fresh install before SH05 lands.

## Implementation notes (2026-09-23 — read before device pass)

- **SH02 verified, then fixed properly.** `css-to-react-native` camelizes
  unknown props, so `text-transform: uppercase` DID reach native as
  `textTransform` — labels were never broken, but the casing followed the
  *device* locale, not the app language. The JS `toGroupLabelCase` path
  (preferredLanguage) is strictly more correct. The CSS rule stays until
  loops 18/19 migrate the direct `GroupLabel` users (`backup-screen`,
  `whats-new-screen`) — dropping it now would regress them to mixed-case.
- **SH05 empty state confirmed honest.** `ownPersonInitial('', '')` returns
  `•`, so a fresh install shows dot + blank lines — no fiction. The
  min-height + 12pt vertical padding keeps 80pt exact at reference
  (48 avatar + 24 padding = 72 ≤ 80).
- **SH06 deferred sites (kept compiling on the old const):**
  `destination-card` HowItWorks (loop 18), `whats-new-entry-card`
  (loop 19), `program-hero-card` inline SVG stroke (loop 17),
  `language-region-card` + display-card restart literals (PF05, loop 14).
  Each loop migrates its own call sites to `useChevronColor()`.
- **SH09 mapping:** title → `headline` (17/22/600 exact), body →
  `footnote` + 14/20 overrides (was 14/20 exactly), close →
  `callout` 600 (was 16/600). Title/body gain Apple tracking
  (−0.43/−0.08) per the skill — deliberate, not drift.
- **Gates:** `typecheck` clean on all touched files (remaining errors
  pre-exist in untouched files).

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Shared anatomy: hairline separator, shrink contract, value-voicing labels, locale group labels, chevron hook | SH02, SH03, SH04, SH06 (part), SH07 | typecheck (touched files clean) |
| 2026-09-23 | Header min-height + chevron, accent/visibility casing, footer version+brand, dialog shim, aura comment | SH01, SH05, SH06 (part), SH08, SH09, SH10 | typecheck (touched files clean) |
| 2026-09-23 | Sweep: rate-title rebrand + shim migration (grouped-settings-list, profile-header), visuals preserved via spec overrides | SH-extra | typecheck (touched files clean) |

## Verification (owed before close)

- 320/393/430 × dark/light, 200% text + DE, landscape; empty-identity fresh
  install; VoiceOver row announcement (title + value); `npm run typecheck`.
