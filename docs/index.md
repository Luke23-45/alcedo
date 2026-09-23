# Docs index

Every doc in this repo, one line each. Start here before any task — the index tells
you which docs cover the area you're about to touch. Keep this file current: when a
doc is added, removed, renamed, or repurposed, update this index in the same change.

## Process

- [merge_ledger.md](merge_ledger.md) — all-branches merge ledger (source of truth): branch inventory, topology proof, hazards, execution plan + log.
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
- [new_design/backend-editor-dark.svg](new_design/backend-editor-dark.svg) — backend editor (/settings/backends/[id]) redesign mockup (dark).
- [new_design/planner-chat-dark.svg](new_design/planner-chat-dark.svg) — AI planner chat redesign mockup (dark).
- [new_design/onboading/onboarding-1-welcome.svg](new_design/onboading/onboarding-1-welcome.svg) — onboarding reference mockup 1 of 3, welcome (dark).
- [new_design/onboading/onboarding-1-welcome-light.svg](new_design/onboading/onboarding-1-welcome-light.svg) — onboarding reference mockup 1 of 3, welcome (light).
- [new_design/onboading/onboarding-2-localisation.svg](new_design/onboading/onboarding-2-localisation.svg) — onboarding reference mockup 2 of 3, localisation (dark).
- [new_design/onboading/onboarding-2-localisation-light.svg](new_design/onboading/onboarding-2-localisation-light.svg) — onboarding reference mockup 2 of 3, localisation (light).
- [new_design/onboading/onboarding-3-notifications-feed.svg](new_design/onboading/onboarding-3-notifications-feed.svg) — onboarding reference mockup 3 of 3, notifications & feed (dark).
- [new_design/onboading/onboarding-3-notifications-feed-light.svg](new_design/onboading/onboarding-3-notifications-feed-light.svg) — onboarding reference mockup 3 of 3, notifications & feed (light).

## Working notes

- [working/styles_ledger.md](working/styles_ledger.md) — ledger of style decisions.
- [working/logo_brand_name_ledger.md](working/logo_brand_name_ledger.md) — ledger of logo/brand-name decisions.

## Polish (polish_ui/)

- [polish_ui/homepage/homepage_polish_ledger.md](polish_ui/homepage/homepage_polish_ledger.md) — home page polish ledger (source of truth): per-section responsive/overflow/light-mode punch list + patch order.
- [polish_ui/session/session_polish_ledger.md](polish_ui/session/session_polish_ledger.md) — session (workout flow) polish ledger (source of truth): active-path sections, rest/cardio timers, footer, menus + patch order.
- [polish_ui/workout-editor/workout-editor_polish_ledger.md](polish_ui/workout-editor/workout-editor_polish_ledger.md) — workout editor polish ledger (source of truth): nav, draft, name, meta, notes, rows, drag, empty, footer, dialogs + patch order.
- [polish_ui/exercise-editor/exercise-editor_polish_ledger.md](polish_ui/exercise-editor/exercise-editor_polish_ledger.md) — exercise editor polish ledger (source of truth): nav, identity/search, set config, detail, options, resistance, progression, cardio, rest sheet, type-switch + patch order.
- [polish_ui/update_plan/update_plan_polish_ledger.md](polish_ui/update_plan/update_plan_polish_ledger.md) — update plan (diff-save) polish ledger (source of truth): intro, mode segmented, review cards, commit bar, background + patch order.
- [polish_ui/history/history_polish_ledger.md](polish_ui/history/history_polish_ledger.md) — history polish ledger (source of truth): calendar, day/week/month sections, detail hero/tiles/strip/PR/curve/breakdown/compare/notes/actions, edit screen + patch order.
- [polish_ui/trends/trends_polish_ledger.md](polish_ui/trends/trends_polish_ledger.md) — trends polish ledger (source of truth): overview header/range/hero/tiles/PB/muscle/heatmap/streaks/PR/insights/export/empty, exercise picker, exercise detail + patch order.
- [polish_ui/feed/feed_polish_ledger.md](polish_ui/feed/feed_polish_ledger.md) — feed timeline polish ledger (source of truth): nav/compose, challenge banner, filter chips, post frame/poster/kudos/action bar, milestone/media heroes, footer/empty states + patch order.
- [polish_ui/post-detail/post_detail_polish_ledger.md](polish_ui/post-detail/post_detail_polish_ledger.md) — post detail polish ledger (source of truth): glass header, author/poster/caption/meta, kudos row, action pills, comment thread + elbow, sticky comment bar, dialogs/unavailable + patch order.
- [polish_ui/composer/composer_polish_ledger.md](polish_ui/composer/composer_polish_ledger.md) — share composer polish ledger (source of truth): nav, author/audience, attached session, swatches, stat chips, live preview, caption, attach/tagged, sticky CTA, sheets, published card + patch order.
- [polish_ui/profile-editor/profile_editor_polish_ledger.md](polish_ui/profile-editor/profile_editor_polish_ledger.md) — profile editor polish ledger (source of truth): nav, avatar, stats strip, identity, goals + slider + ring sheet, units, privacy + toggles + blocked sheet, connected, footer; page-12 share-request recorded out of scope + patch order.
- [polish_ui/settings/settings-home_polish_ledger.md](polish_ui/settings/settings-home_polish_ledger.md) — settings home polish ledger (page 13, source of truth): profile header, account/training/preferences/data-sync/community/support groups, shared row anatomy, background + patch order.
- [polish_ui/settings/preferences_polish_ledger.md](polish_ui/settings/preferences_polish_ledger.md) — preferences polish ledger (page 14, source of truth): appearance + swatches, units, language/region + picker, display toggles, measured segmented + patch order.
- [polish_ui/settings/notifications_polish_ledger.md](polish_ui/settings/notifications_polish_ledger.md) — notifications polish ledger (page 15, source of truth): reminder day-chips + time pill, results/social inert toggles, delivery + patch order.
- [polish_ui/settings/ai-planner_polish_ledger.md](polish_ui/settings/ai-planner_polish_ledger.md) — AI planner polish ledger (page 16, source of truth): coach hero, training-day circles, sliders, focus chips, recovery, stepper, next session + patch order.
- [polish_ui/settings/programs-import_polish_ledger.md](polish_ui/settings/programs-import_polish_ledger.md) — programs & import polish ledger (page 17, source of truth): hero/rows, parser, review, program/session editors' owned chrome + patch order.
- [polish_ui/settings/backup-hub_polish_ledger.md](polish_ui/settings/backup-hub_polish_ledger.md) — backup hub polish ledger (page 18, source of truth): backup/storage/release cards, remote backup + test states, server picker, export, import, backends + patch order.
- [polish_ui/settings/whats-new_polish_ledger.md](polish_ui/settings/whats-new_polish_ledger.md) — What's New polish ledger (page 19, source of truth): release card, entry cards, motion source, clamps + patch order.
- [polish_ui/settings/exercise-search_polish_ledger.md](polish_ui/settings/exercise-search_polish_ledger.md) — exercise search polish ledger (page 21, source of truth): search field, filter chips, result rows, recents/suggested, empty state, fade + patch order.
- [polish_ui/settings/exercise-history_polish_ledger.md](polish_ui/settings/exercise-history_polish_ledger.md) — exercise history polish ledger (page 22, source of truth): nav, PR banner, top-set chart, session rows, locale paths + patch order.
- [polish_ui/settings/manage-exercises_polish_ledger.md](polish_ui/settings/manage-exercises_polish_ledger.md) — manage exercises polish ledger (page 23, source of truth): dead insets, delete naming, stale-row hole; Paper body stays un-restyled + patch order.
- [polish_ui/settings/ai-planner-chat_polish_ledger.md](polish_ui/settings/ai-planner-chat_polish_ledger.md) — AI planner chat polish ledger (page 24, source of truth): bubbles, day dividers, composer, motion source, hardcoded plural + patch order.

## Generated

- [schemas/](schemas/) — generated JSON schemas (ai-plan, program-blueprint, workout-worker). Regenerate with `npm run json-schema`; do not hand-edit.
- [img/includedexcludedplaintext.png](img/includedexcludedplaintext.png) — reference image.

## App docs (app/)

Package-level docs live under `app/` (commands, architecture notes). The agent guide at
the repo root ([AGENTS.md](../AGENTS.md)) is the entry point for how to work here.
