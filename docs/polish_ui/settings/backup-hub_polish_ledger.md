# Backup hub polish ledger (source of truth)

Status: **implemented 2026-09-23 — all code patches applied; device pass (320/430,
large text, DE + TR, landscape, no-backend + error-variant states) still required
before closing the acceptance bar.** Per instruction no test files were written or run
(the export spec's two brand strings were updated to match the renamed effect —
string upkeep, not test logic).
Scope: page 18 — backup hub (`backup-and-restore/index` → `BackupScreen` →
`BackupCard`, `StorageCard`, `ReleaseCard`, `AboutCard`), remote backup
(`DestinationCard`, `LastTestedCard`, `TestFooter`, `Caption`,
`HonestNotes`), choose-server (`NoneOption`, `ServerList`), plaintext
export (screen + 9 cards), import-from-other-apps (screen + 5 cards),
backends list/editor routes — against `docs/new_design/backup-redesign.md`
(S1–S5) + `settings-dark.md` Screen 6 + the skill.

Read method: hub/remote/server/export-screen/import-screen/backends-list
read fully (tsx + key styles); the long tail of small cards
(`export-caption`, `whats-in-file-card`, `not-in-file-card`,
`json-shape-card`, `privacy-note-card`, `filename-card.styles`,
`export-action.styles`, `import-apps-header`, `import-button`,
`not-supported-card`, `about-card`, `backup-dialogs`,
`backend-services-group`, `backends/[id]` editor) skimmed only — they are
L-items below, not claimed findings. Nothing inferred.

## What is already good (not touched by this ledger)

- Storage bar is flex-exact (9.6 + 252.3 + 59.1 = 321, unit-tested), the 3%
  sliver never inflated, estimates labelled ≈ ✓ (skill real numbers).
- Radio roles + states on every selectable row; incomplete backends inert
  + tagged; built-in excluded from the picker ✓.
- Test honesty: in-flight spinner + disabled, variant-mapped errors with
  Retry, persisted last-test (success AND error) ✓.
- Release card uses real version/build; NEW pill gated on unread ✓.
- Preview renders em-dash before load — never claims an unmeasured zero ✓.
- Filename is 1-line + shrinks-to-fit + selectable ✓.
- Newer files use `typeStyle(theme, …)` (the non-shim API) with tabular
  numerals on `StatValue` ✓.
- Chevron rotation + reduced-motion accordion on "How it works" ✓.

The problems below: one light-mode invisible control, hairlines, locale
paths, rebrand residue, clamps, and a progressbar missing its value.

## Batch 1 — correctness + light mode (BK01–BK06)

- [x] **BK01 — CSV/JSON track invisible in light mode.**
  `format-segmented.styles.ts` `SegmentTrack` + selected pill are fixed
  white-6% / white-13% both modes — on the pale card they nearly vanish.
  Fix: theme-aware fills (light: black-5 track, white pill + shadow, same
  pattern as the small `PreferenceSegmented`).
- [x] **BK02 — 1px dividers.** `BackupSeparator`, `StatDivider width: 1px`,
  choose-server/import-apps `RowSeparator`/`OptionSeparator` at `1px`.
  Fix: one sweep to `StyleSheet.hairlineWidth` across
  `backup*/`, `choose-server/`, `import-apps/`, `plaintext-export/`
  styles (audit each file in the patch — do not blanket-replace spec
  edges).
- [x] **BK03 — counts use the device locale.** `will-export-card.tsx`
  `stat.count.toLocaleString()` ignores `preferredLanguage` (every other
  loop passes it explicitly). Fix: select the language and pass it.
- [x] **BK04 — INCOMPLETE tag uppercases blind.**
  `server-list.tsx` `.toUpperCase()` (same class as SH08/AP05/PR07).
  Fix: `toLocaleUpperCase(preferredLanguage)`.
- [x] **BK05 — rebrand residue in the filename.**
  `filename-card.tsx` `kinetic-export.` (same sweep as SH01/PR08). Fix:
  `alcedo-export.` + sweep settings copy for `Kinetic`.
- [x] **BK06 — storage bar has no value.** `StorageBarTrack` is a
  `progressbar` with label but no `accessibilityValue`. Fix: min/max/now
  + text (estimates labelled as estimates, same law as the visuals).

## Batch 2 — clamps (BK07–BK09)

- [x] **BK07 — backend names/URLs unclamped.** `DestinationRowValue`,
  `ServerSubtitle` (full URLs!), `LegendTitle` (real backend names).
  Fix: `numberOfLines={1}` everywhere + `flex-shrink: 1`; extend the
  choose-server radio labels to name + URL (the URL is currently silent).
- [x] **BK08 — fixed-button labels.** `BackupCtaText` (50), `ButtonLabel`
  (export/import stickies), `TestLabel`, `ManageLabel` — no clamps.
  Fix: `numberOfLines={1}` + verify 320 DE.
- [x] **BK09 — wrapping-text clamps.** `BackupSubtitle`, `ModeHintText`,
  `LegendSub`, `LastTestedTitle` (1 line), `LastTestedDetail` (2 lines),
  `ReleaseBulletText` (grows ✓, keep). Bodies are min-height — no height
  changes.

## Batch 3 — verify-only (no code expected)

- [ ] **L01 — skimmed tail.** `export-caption`, `whats-in-file-card`,
  `not-in-file-card`, `json-shape-card`, `privacy-note-card`,
  `import-apps-header`, `import-button`, `not-supported-card`,
  `about-card`, `backup-dialogs`, `backend-services-group`,
  `backends/[id]` editor: deep-read each before its patch; current
  ledger makes no claims about them.
- [ ] **L02 — bytes/duration locale.** `formatBackupBytes` /
  `formatBackupDuration` ("1.4 GB · 2.1s") — verify decimal separator +
  unit localization, else a BK03-class patch.
- [ ] **L03 — accordion curve.** `AccordionItem duration 200` — verify it
  rides the standard deceleration curve (skill §5).
- [ ] **L04 — segmented a11y parity.** Export CSV/JSON uses custom
  `SegmentButton`s (44pt ✓) while backup mode reuses
  `PreferenceSegmented` — verify both announce identically.

## Implementation notes (2026-09-23 — read before device pass)

- **BK05 done honestly.** The effect hardcoded `kinetic-export.` too — a
  preview-only rename would have made the preview lie. Renamed effect +
  preview + the spec's two brand regexes together. Verified by grep: no
  `kinetic-export` remains in src.
- **BK06 text-only by design.** Numeric now/max would fabricate precision
  the ≈ estimates deliberately avoid; the voice string composes the same
  localized legend titles + values the sighted row shows (new
  `settings.backup.storage.voice` key, en-only per the fragment pattern).
- **BK02 scope kept honest.** Converted only verified content dividers
  (BackupSeparator, StatDivider, server RowSeparator, OptionSeparator).
  Bar top edges (FooterBar, BarHairline) are spec edges — kept, same class
  as the profile sheet-edge decision.
- **Extra (same files, same defect class):** choose-server micro-labels
  use `toGroupLabelCase` (SH02 family), `IncompleteTagText` off the shim,
  `ServerRowText min-width: 0`, tag `flex-shrink: 0`, radio labels voice
  name + URL, backup footer rebranded with real version (SH01 class),
  HowItWorks chevron on `useChevronColor()`. Import-apps/plaintext
  `SectionLabel`s keep CSS casing until a loop owns those files.
- **Gates:** `typecheck` clean on all touched files (remaining errors
  pre-exist in untouched files).

## Patch log

| Date | Patch | Closes | Verified |
| ---- | ----- | ------ | -------- |
| 2026-09-23 | Light segmented, hairlines, locale counts, tag casing, filename+effect, progressbar voice | BK01–BK06 | typecheck (touched files clean) |
| 2026-09-23 | Clamps across hub/remote/server, footer, chevron, micro-label extras | BK07–BK09 | typecheck (touched files clean) |
| 2026-09-23 | Sweep: 3-key rebrand + about-card chevron/labels/clamp + release-title light contrast fix + shim (backup/storage/release/about) + micro-label JS casing (SectionLabels, StatLabel, DropsLabel, InnerLabels) | BK-extra | typecheck (touched files clean) |

## Verification (owed before close)

- 320/393/430 × dark/light, 200% text + DE + TR, landscape; no-backend +
  incomplete-only + error-variant states; share-sheet cancel; VoiceOver on
  radios/progressbar/stickies; `npm run typecheck`.
