# Merge ledger — all branches to `main` (source of truth)

Status: **MERGED 2026-09-22.** `main` = `83b1f55`, pushed to `origin/main`.
All branches merged. This file remains the permanent record. Safety net
retained: `..\LiftLog-merge-backup-2026-09-22\` (verified bundle + worktree
patches + untracked copies) and `backup/*` branches.

Verified: 2026-09-22, live against this repo (`git branch -a -vv`,
`git for-each-ref`, `git rev-parse`, `git merge-base`, `git rev-list
--left-right --count`, `git log`, `git diff --name-only`, `git status
--porcelain=v1 -uall`, `git stash list`, `git ls-tree`, `git show` for tip
contents and per-codebase `package.json` scripts). Arithmetic cross-checked:
878 + 13 = 891 (`main..HEAD`), 878 + 176 = 1054 (`main..verification`),
31 + 1 = 32 (redesign + verification tip). Current `HEAD`:
`redesign/backup-and-restore` at `f989506`, worktree dirty (see §5).

## 1. Branch inventory (verified)

| # | Ref | Short | Full SHA | Date | Subject |
|---|---|-------|----------|------|---------|
| 1 | `main` (local) | `8491720` | `8491720a51902e6f19892bf416e96d274019c4a5` | 2026-09-21 | feat(): .agent design |
| 2 | `origin/main` | `8491720` | same as above | 2026-09-21 | in sync with local `main` |
| 3 | `origin/redesign/backup-and-restore` | `af29a5e` | `af29a5e73d9c1cf5e87f8d41d7cdaec29d665906` | 2026-09-22 | Feed fallback catalog and AI planner offline greeting |
| 4 | `redesign/backup-and-restore` (local, `HEAD`) | `f989506` | `f989506ed68b8c27e8cc59c86c84db8f0dc2ce43` | 2026-09-22 | render fix — 1 ahead of `origin/redesign`, worktree dirty |
| 5 | `origin/verification/final-2026-09-22` | `ce8ef59` | `ce8ef59c0eaa70f047154f41b527c03323d81689` | 2026-09-22 | Final verification: backend-v2, website, and mobile auth hardening |

No other branches exist locally or on `origin`. `git stash list` is empty.
`origin/HEAD` is unset (`fatal: ref refs/remotes/origin/HEAD is not a symbolic
ref`) — harmless; do not depend on it in commands.

Junk refs (Cline AI checkpoints, not branches, never merge):
`cline/checkpoints/session_1789981475554_3f0tj/2` (`a6e58d4`),
`cline/checkpoints/session_1790095869598_ubm9n/1` (`3f7b183`),
`.../2` (`e182339`), `.../3` (`1824b89`). Delete after a verified backup (§8).

## 2. Topology proof

Merge-bases (exact, re-verified):
- `merge-base main origin/redesign/backup-and-restore` = `8491720` (tip of `main`).
- `merge-base main origin/verification/final-2026-09-22` = `8491720`.
- `merge-base origin/redesign origin/verification` = `af29a5e`.

Divergence (`git rev-list --left-right --count`):
- `main...origin/redesign` = `0 31` — redesign is `main` + 31, `main` contributes nothing new.
- `main...origin/verification` = `0 32` — verification is `main` + 32.
- `origin/redesign...origin/verification` = `0 1` — verification is redesign + 1.
- `origin/redesign...HEAD` = `0 1` — local is origin/redesign + 1 (different commit).

Consequence: there are NOT three divergent lines. There is one line
(`main` → 31 redesign commits → verification tip) plus one local fork
(`f989506` + dirty WIP, forked at `af29a5e`). Merging verification covers
redesign automatically; only verification + local work need reconciling.

## 3. Commit catalog

`main` (4 commits, oldest first): `2eeca0d` initial Alcedo import (~1916 files),
`f0da774` styled-components standard, `cac2e7c` home page design, `8491720`
.agent design.

`main..origin/redesign` (31 commits, oldest first): `36e3f3d` backup hub,
`b9c4f24` workout-editor rebuild, `8c98c89` SQLite hardening, `6af7be6` home
p1/20, `a4abc1b` Intl formatters, `ea17ca6` workout flow p2, `4fcf71f` workout
editor p3, `d72769f` exercise editor p4, `661297d` diff-save p5, `a3d5316`
history p6, `fa32ca5` trends p7, `05af681` feed timeline p8, `a2263b2` post
detail p9, `975a2f1` share composer p10, `39793ec` profile editor p11,
`3fde478` shared-item p12, `716b65b` settings home p13, `9ddd0f5` preferences
p14, `24f0e6f` notifications p15, `04bfb5c` AI planner p16, `28334c3` programs
p17, `89a8975` backup hub p18, `ed8c261` What's New p19/20, `43e9080` exercise
search p21/24, `cb2c61b` tracker 24-page sweep, `fd30b12` exercise history p22,
`20a88e6` manage exercises p23, `c9ad2c6` planner chat p24, `ed71521` tab-bar
icons, `4c5e476` backend-editor/planner-chat redesign, `af29a5e` feed fallback
+ offline greeting.

`origin/redesign..origin/verification` (1 commit): `ce8ef59` — +183 files,
+32k lines: new `backend-v2/` (NestJS auth/AI/payments/social/workouts), new
`website/` (Next.js), `settings/account/*`, `auth-service.ts`,
`authenticated-fetch.ts`, `store/auth/*`, `app.json`/`package.json` bumps.

`origin/redesign..HEAD` (1 commit): `f989506` render fix — 27 files:
`app/metro.config.js`, `app/package-lock.json`, `app/package.json`
(+`@expo/ngrok`, `@tolgee/core`, `@tolgee/web` — see §6),
`app/patches/styled-components+6.1.8.patch`, `app/polyfills/styled-shim.js`,
`app/tsconfig.json`, 1–3 line fixes (`tolgee.ts`, `exercise-catalog.ts`,
`workout-worker.ts`, `date-locale.ts`, `language-detector.ts`,
`tab-bar.styles.ts`, etc.), and **`error.md` (+2344 lines, expo log dump —
must be removed before merge, §7)**.

## 4. File-set analysis (verified counts)

- `main..HEAD`: 891 files. `main..verification`: 1054 files. Overlap: 878.
- Only-HEAD (13): `app/metro.config.js`,
  `app/patches/styled-components+6.1.8.patch`, `app/polyfills/styled-shim.js`,
  `app/src/models/backend.ts`, `app/src/models/blueprint-diff.ts`,
  `app/src/services/exercise-catalog.ts`, `app/src/services/tolgee.ts`,
  `app/src/services/workout-worker.ts`, `app/src/store/tolgee.d.ts`,
  `app/src/utils/date-locale.ts`, `app/src/utils/language-detector.ts`,
  `app/tsconfig.json`, `error.md` (to be deleted).
- Only-verification (176): `app/.../settings/account/*`,
  `app/src/services/api-consts.ts`, `auth-config.ts`, `auth-service.ts`,
  `authenticated-fetch.ts` (+specs), `app/src/store/auth/*`, all of
  `backend-v2/**` and `website/**`. Additive — expected to auto-merge.

## 5. Dirty worktree (71 status lines, verified `git status -uall`)

Staged (index — see hazard H1): 5 pure renames
(`planner-chat.styles.ts`, `backend-editor.styles.ts`,
`history-screen.styles.ts`, `share-request-flow.ts`,
`share-request-simulation.spec.ts`, all R100) + `D
.../foundation/editors/theme-chooser.tsx` (replaced by untracked split folder).

Unstaged (~54 modified): full `presentation/home/*` polish (achievements,
activity-rings, coach-card, greeting-header, hr-zones, hydration, macros,
personal-records, programs, recent-activity, shared/*, stat-tiles,
today-session, use-home-data, weekly-challenge, weekly-volume),
`feed/shared/share-poster.tsx`, `timeline/feed-card.tsx`,
`timeline-tokens.ts`, `(session)/index.tsx`, `feed/share.tsx`,
`history/index.tsx`, `planner-chat.tsx`, `backends/[id].tsx`,
`settings/home/preferences-group.tsx`, `settings/planner/next-session.tsx`,
`planner-data.ts` (+2 specs), `smart/welcome-wizard.tsx`,
`whats-new-banner.tsx`, `i18n/en.json`, `services/logger.ts`,
`notification-scheduler.ts` (+spec), `docs/index.md`,
`docs/new_design/page-verification.md`.

Untracked (11): `theme-chooser/` x3 (`index.tsx`,
`theme-chooser.styles.ts`, `theme-chooser.tsx` — intended split),
`home/shared/home-format.ts`, `home/shared/home-tab-fade.tsx`,
`docs/polish_ui/homepage/homepage_polish_ledger.md` (keep; update
`docs/index.md` per repo rule), `app/tmp-lint.err`, `app/tmp-tsgo.err`,
`app/tmp-tsgo2.err`, `app/tmp-vitest.err`, `app/tmp-vitest2.err` (junk —
delete, never commit).

## 6. Known conflict surface

`app/package.json` is modified on BOTH sides with DIFFERENT dependencies and
will conflict: verification adds `@react-native-google-signin/google-signin`,
`expo-secure-store`, `expo-video`; local adds `@expo/ngrok`, `@tolgee/core`,
`@tolgee/web`. Must be merged line-by-line — never take one side wholesale
(hazard H4). `app/package-lock.json` and `app/app.json` are also touched on
both sides; for the lockfile take verification's copy and regenerate via
`npm install`, never hand-edit. Everything else is expected to merge cleanly
or with small textual conflicts; `backend-v2/` and `website/` are
additive-only.

## 7. Hazard register (all independently confirmed)

- H1 — Staged-index amend trap (CONFIRMED: 6 staged entries listed in §5).
  `git rm error.md; git commit --amend` would silently fold the staged WIP
  into `f989506`. Fix: `git reset` first, verify only the `error.md` removal
  is staged, then amend.
- H2 — Bundle gap (CONFIRMED: 71 dirty lines, empty stash). `git bundle
  --all` covers only committed refs, NOT the dirty tree or untracked files.
  Fix: filesystem backup (`Compress-Archive`) alongside the bundle, and
  `git bundle verify` immediately.
- H3 — Dry-run handoff (structural). A `--no-commit` merge left in progress
  blocks the real merge (`MERGE_HEAD` exists). Fix: Phase 2 ALWAYS ends with
  `git merge --abort`; resolution happens fresh in Phase 3.
- H4 — `package.json` two-sided adds (CONFIRMED with diffs, §6). Fix: manual
  union of dependency/script entries, then lockfile regen.
- H5 — Unverified codebases (CONFIRMED: `backend-v2` scripts
  `build/lint/start/test/test:cov/typecheck`; `website` scripts
  `dev/build/start/lint`). Fix: gate every codebase, not just `app/`.
- H6 — Cleanup placeholders. Fix: concrete delete loop for the four cline
  refs in §1, `git bundle verify <file>` with filename, and re-fetch `main`
  before the final fast-forward.

## 8. Execution plan (corrected; PowerShell 5.1 — no `&&`, no `head`)

Phase 0 — safety:
```powershell
git fetch --prune origin
git bundle create backup-2026-09-22.bundle --all
git bundle verify backup-2026-09-22.bundle
Compress-Archive -Path * -DestinationPath ..\repo-full-backup-2026-09-22.zip -Force
git branch backup/redesign-backup-and-restore redesign/backup-and-restore
git branch backup/verification-final origin/verification/final-2026-09-22
git branch backup/main-before-merge main
git status --porcelain=v1 -uall
```
Do not proceed without the verified bundle AND the zip.

Phase 1 — triage (H1, H2):
```powershell
Remove-Item app\tmp-lint.err, app\tmp-tsgo.err, app\tmp-tsgo2.err, app\tmp-vitest.err, app\tmp-vitest2.err
git reset
git rm error.md
git status --porcelain
git commit --amend --no-edit
git add -A
git status --porcelain
git commit -m "wip: homepage polish + staged renames before all-branch merge"
git push -u origin redesign/backup-and-restore
```
`git status` must be clean before Phase 2. (If the WIP is not committable:
`git reset` first, then `git stash push -u -m "pre-merge wip"` instead.)

Phase 2 — dry run, diagnosis ONLY (H3):
```powershell
git checkout -b integrate/all-to-main origin/verification/final-2026-09-22
git merge --no-commit --no-ff redesign/backup-and-restore
git status --porcelain=v1 -uall
git diff --name-only --diff-filter=U
git merge --abort
```
Record conflicts here (§9). More than ~15 conflicted files: stop, re-triage.

Phase 3 — real merge (H4, H5):
```powershell
git merge --no-ff redesign/backup-and-restore -m "merge(all): redesign + verification/final-2026-09-22 into main line"
```
Resolve: `app/package.json` union by hand; `app/package-lock.json` via
`git checkout --ours app/package-lock.json` then `npm install` in `app/`;
everything else keep both sides, no wholesale `--ours`/`--theirs`.
`git add <resolved>`; `git commit`. Then gate every codebase:
```powershell
cd app
npm run typecheck; if ($?) { npm run lint }; if ($?) { npm run format:check }; if ($?) { npm test }
cd ..\backend-v2
npm run typecheck; if ($?) { npm run lint }; if ($?) { npm test }
cd ..\website
npm run lint; if ($?) { npm run build }
cd ..
```
`npm run json-schema` (in `app/`) only if `models/storage/versions/` changed.
Keep `docs/index.md` current if `docs/polish_ui/` or this ledger changed.

Phase 4 — land, push, clean (H6):
```powershell
git fetch origin main
git checkout main
git merge --ff-only integrate/all-to-main
git push origin main
git branch -d redesign/backup-and-restore
git push origin --delete verification/final-2026-09-22
git for-each-ref --format="%(refname)" refs/heads/cline
git branch -D cline/checkpoints/session_1789981475554_3f0tj/2
git branch -D cline/checkpoints/session_1790095869598_ubm9n/1
git branch -D cline/checkpoints/session_1790095869598_ubm9n/2
git branch -D cline/checkpoints/session_1790095869598_ubm9n/3
```

Rollback: before commit `git merge --abort`; after commit
`git reset --hard backup/main-before-merge` (bundle + zip + backup branches
from Phase 0 make this lossless for committed work; uncommitted work is
protected by the Phase 0 zip and the Phase 1 commit/stash).

Decision record: `merge --no-ff` on an integration branch seeded from
verification (the most advanced line) preserves the 31 + 1 + 1 commit history
for bisect/revert. Rebase is rejected (rewrites 32 published commits, breaks
`origin/*`). Squash is rejected (destroys per-page simulation history).
Merging directly into `main` is rejected (no isolated verification gate;
`--ff-only` landing keeps `main` linear and reviewable).

## 9. Execution log

- 2026-09-22 Phase 0 DONE (verified). `git fetch --prune origin`: all tips
  unchanged (`main`/`origin/main` `8491720`, `origin/redesign` `af29a5e`,
  `origin/verification` `ce8ef59`, local `HEAD` `f989506`). Bundle
  `..\LiftLog-merge-backup-2026-09-22\backup-2026-09-22.bundle` (26,566,280
  bytes): `git bundle verify` → "is okay", complete history, all 10 refs with
  ledger-matching SHAs. Deviation (deliberate): no full-tree zip —
  `app/node_modules` exists, so a `Compress-Archive -Path *` would be
  gigabytes; instead byte-level targeted backup of exactly the at-risk data:
  `worktree-unstaged.patch` (108,483 bytes), `worktree-staged.patch`
  (9,146 bytes, via `git diff --output` to avoid PowerShell UTF-16 `>`
  mangling), and all 12 untracked files under `untracked/` (size-verified
  12/12 OK; 4 `tmp-*.err` are genuinely 0 bytes in the repo). Backup branches
  verified by SHA: `backup/main-before-merge`=`8491720`,
  `backup/redesign-backup-and-restore`=`f989506`,
  `backup/verification-final`=`ce8ef59`.

- 2026-09-22 Phase 1 DONE (verified). INCIDENT: first ledger-commit attempt
  (`9cf1a97`) swept the 6 pre-staged H1 entries into the commit — the exact
  trap H1 warned about (I added docs files without clearing the index first).
  Caught on post-commit review (8 files vs expected 2), before any push.
  Recovered with `git reset --soft f989506` (HEAD restored, history clean),
  then `git reset` (index emptied; worktree byte-intact, renames correctly
  showing as D+?? pairs). Redo, clean order: tmp junk deleted (5 files, were
  backed up in Phase 0); index verified empty; `git rm error.md` staged only
  `D error.md`; `git commit --amend` → `f18b748` "render fix" (parent still
  `af29a5e`, 26 files, `error.md` confirmed absent via `ls-tree`); ledger
  commit → `82bb2a2` (exactly 2 files); `git add -A` reviewed entry-by-entry
  (no `error.md`, no `tmp-*`, 5 R100 renames + theme-chooser split + 3 new
  files) → WIP commit `e94107e` (64 files); tree confirmed clean.
  `git push origin redesign/backup-and-restore` → `af29a5e..e94107e`,
  local/remote in sync. Lesson recorded: verify `git diff --cached` is empty
  BEFORE every `git add`, not just before amend.

- 2026-09-22 Phase 2 DONE (verified). Dry run on `integrate/all-to-main`
  (seeded at `ce8ef59`): `git merge --no-commit --no-ff
  redesign/backup-and-restore` auto-merged everything (`app/package.json`,
  `app/package-lock.json`, `app/src/i18n/en.json` included) with ZERO
  unmerged paths (`git diff --name-only --diff-filter=U` empty). Always ended
  with `git merge --abort`; HEAD verified back at `ce8ef59`, tree clean.

- 2026-09-22 Phase 3 merge DONE (`2bedab1`, parents `ce8ef59`+`e60ca88`, 91
  files, tree clean). Post-merge verification: all 6 `package.json` deps
  present on both sides; `error.md` absent (`ls-tree`); `npm install` in
  `app/` clean (lock already consistent, no diff). Typecheck gate: first run
  surfaced 1 parse error (WIP `weekly-challenge.tsx` `</>` vs `<Fragment>`,
  fixed in `d6bd7d9`); full run then showed ~140 errors, so a baseline was
  established via `git worktree` at `ce8ef59` sharing `node_modules` (167
  errors) — gate was red BEFORE the merge. Line-normalized diff proves the
  merge introduces ZERO new typecheck errors and FIXES 27 (render-fix Tolgee
  deps/shim); the 90 remaining are pre-existing (drizzle-orm 0.45.2 ships no
  root `index.d.ts`, only `.d.cts`; stale gitignored `.expo` router types).
  Two genuinely new errors were fixed on the branch (`951b0c7`: `(p: any)`
  matching the file's documented any-boundary; drop `accessibilityRole` the
  gradient component cannot accept). A naive line-number diff briefly blamed
  `stored-sessions/effects.ts` `tx` errors on the merge — disproven: baseline
  has the identical errors 5 lines higher (render-fix try/catch shifted them).
  Lint gate: merge 5251 vs baseline 4859; per-file diff shows the ONLY new
  file is `polyfills/styled-shim.js` (+500, render-fix DOM polyfill under
  type-aware rules) with the rest at parity-or-better (Tolgee fixes removed
  ~150). Format gate: environmental — `core.autocrlf=true` gives CRLF
  worktrees, pristine untouched files fail `oxfmt --check`; `format --write`
  deliberately NOT run (would churn 1269 files). Tests (`npx vitest run`,
  never watch-mode `npm test`): merge 2144/2146 (140 files); both failures
  exonerated — `backup-status.spec.ts` fails identically at baseline,
  `stream.spec.ts` is byte-identical since the initial commit and passes 6/6
  in isolation (order-dependent flake under full-suite load). backend-v2:
  typecheck clean, oxlint 0/0, jest 213/213 (19 suites). website: eslint
  clean, `next build` succeeds. `backend-v2/package-lock.json` regenerated by
  fresh install (130 nested-dupe deletions, same versions) and committed as
  `c9b428c`. Test-run artifacts (redirect logs, 2 CRLF-only snap rewrites,
  `tsbuildinfo`) were all reverted/deleted; tree verified clean after each.
  OPEN DECISIONS for owner: (a) `  styled-shim.js` +500 lint errors — add
  `polyfills` to oxlint `ignorePatterns` (consistent with existing
  `migrations.js`/`dom.slim.d.ts` exclusions) or leave red; (b) land on
  `main` with typecheck/lint red-but-at-parity (proven: nothing new, 27
  fixed) vs holding the merge for the 90 pre-existing errors.

- 2026-09-22 Phase 4 DONE (verified). Owner decisions: leave
  `polyfills/styled-shim.js` fully untouched (it is the styled-components
  runtime fix — no lint exclusion, no edit); LAND NOW. `git fetch origin
  main` confirmed `main` unmoved at `8491720`; `git checkout main` +
  `git merge --ff-only integrate/all-to-main` → `main` = `83b1f55`, tree
  clean; `git push origin main` → `8491720..83b1f55` confirmed. Cleanup:
  local `redesign/backup-and-restore` deleted (was `e60ca88`, fully merged);
  remote `origin/verification/final-2026-09-22` deleted; 4 `refs/cline/*`
  refs deleted via `git update-ref -d` (`git branch -D` cannot address that
  namespace — first attempt correctly failed); baseline worktree removed
  (junction unlinked with `rmdir` so the real `node_modules` survived
  verified-intact, then directory deleted). Final state: `main` ==
  `origin/main` == `83b1f55`, 1 worktree, 0 cline refs, clean tree.
  Retained safety net: `backup/main-before-merge` (`8491720`),
  `backup/redesign-backup-and-restore` (`f989506`, includes removed
  `error.md`), `backup/verification-final` (`ce8ef59`), verified bundle +
  patches in `..\LiftLog-merge-backup-2026-09-22\`. Remote
  `origin/redesign/backup-and-restore` (`e60ca88`) intentionally left for
  owner to delete. Follow-ups (pre-existing, NOT merge-caused): drizzle-orm
  root types, stale `.expo` router types, CRLF format environment,
  `backup-status.spec.ts`, `stream.spec.ts` flake.
