# Docs index

Every doc in this repo, one line each. Start here before any task — the index tells
you which docs cover the area you're about to touch. Keep this file current: when a
doc is added, removed, renamed, or repurposed, update this index in the same change.

## Process

- [new_design/page-verification.md](new_design/page-verification.md) — page-by-page flow simulation protocol: inventory, state matrix, trace, simulate, patch, verify, record; status table and per-page log for all 20 pages.
- [new_design/offline-first-plan.md](new_design/offline-first-plan.md) — offline-first architecture plan: SQLite hardening, privacy-first backup modes (Off/Automatic/Manual).

## Design specs (new_design/)

- [new_design/home_page_screen1.svg](new_design/home_page_screen1.svg) — Home page reference mockup (dark).
- [new_design/home_screen_light_mode.svg](new_design/home_screen_light_mode.svg) — Home page reference mockup (light).
- [new_design/settings-dark.md](new_design/settings-dark.md) — Settings redesign spec (all six screens).
- [new_design/history-dark.md](new_design/history-dark.md) — History redesign spec.
- [new_design/social-dark.md](new_design/social-dark.md) — Feed (social) redesign spec: timeline, post detail, share composer, profile editor.
- [new_design/diff-save-redesign.md](new_design/diff-save-redesign.md) — "Update Plan" (/diff-save) redesign spec.
- [new_design/exercise-editor-redesign.md](new_design/exercise-editor-redesign.md) — exercise editor redesign spec (six canvases).
- [new_design/tab-bar-icons.svg](new_design/tab-bar-icons.svg) — bottom tab bar icon system spec (5 custom glyphs, outline + filled, runtime rigs).
- [new_design/trends-dark.md](new_design/trends-dark.md) — Trends redesign spec.
- [new_design/workout-flow-dark.md](new_design/workout-flow-dark.md) — workout flow spec.
- [new_design/workout-flow-brief.md](new_design/workout-flow-brief.md) — workout flow brief.
- [new_design/workout-editor-redesign.md](new_design/workout-editor-redesign.md) — workout editor redesign spec.
- [new_design/backup-redesign.md](new_design/backup-redesign.md) — backup hub redesign spec.
- [new_design/diff-save-dark.svg](new_design/diff-save-dark.svg) — /diff-save reference mockup (dark).

## Working notes

- [working/styles_ledger.md](working/styles_ledger.md) — ledger of style decisions.
- [working/logo_brand_name_ledger.md](working/logo_brand_name_ledger.md) — ledger of logo/brand-name decisions.

## Generated

- [schemas/](schemas/) — generated JSON schemas (ai-plan, program-blueprint, workout-worker). Regenerate with `npm run json-schema`; do not hand-edit.
- [img/includedexcludedplaintext.png](img/includedexcludedplaintext.png) — reference image.

## App docs (app/)

Package-level docs live under `app/` (commands, architecture notes). The agent guide at
the repo root ([AGENTS.md](../AGENTS.md)) is the entry point for how to work here.
