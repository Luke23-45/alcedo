# Logo & Brand Name Ledger — LiftLog → Alcedo (by Power Gym)

> **Purpose:** single source of truth so the rebrand does not miss a surface. Every place the old name `LiftLog` / `liftlog` / `limajuice` or green `#046F03` / `#fcfdf6` appears is listed here with its file, current value, target, and status. Update `Status` as you go — the file is the checklist.
>
> **Source logos:** `assets/logo/` (not `app/assets/`):
> - `kingfisher-icon-1024.png` — 1024×1024 RGB composite reference
> - `kingfisher-icon-1024.svg` — vector master
> - `kingfisher-foreground-1024.svg` — bird only (no bg)
> - `kingfisher-background-1024.svg` — bg + halo only
> - `kingfisher-mono-1024.svg` — white/grey mono for themed + notification
>
> **Palette extracted from `kingfisher-*.svg`:**
> - `kfBg` `#0E1B30 → #060C18 → #02040A`
> - `kfHalo` `#2470FF` at 20%
> - `kfBreast` `#B92403 → #F0670F → #FFAE3C`
> - `kfBack` `#0B2CC8 → #1194E4 → #35E0D6`
> - `kfWing` `#051A80 → #0C4CC4`
>
> **New brand:** `Alcedo` (app display name), parent `Power Gym` on splash + welcome + Settings → About. Old name lives on as compat alias for 2 releases (`liftlog://`, `.liftlogplan`, `X-LiftLog-Probe`).
>
> Last updated: 2026-09-21 • Owner: app team — Phase 1 display rebrand implemented. Repo created at `Luke23-45/alcedo`; all repo URLs (app, docs, site, tooling) retargeted from `powergym/alcedo` / `LiamMorrow/LiftLog` to `https://github.com/Luke23-45/alcedo`.

---

## 0. Decisions — mark before Phase 2 ships

| # | Decision | Proposed default | Status | Notes |
|---|----------|------------------|--------|-------|
| D1 | Android `package` / iOS `bundleIdentifier` | `com.powergym.alcedo` | ☐ Deferred | Irrevocable — new Play/App Store listings; keep `com.limajuice.liftlog` on current listing if you want to defer |
| D2 | Hosts | `app.alcedo.app` + `api.alcedo.app` with 301 from `app.liftlog.online` kept 12mo | ☐ Deferred | Keep old DNS 12mo for existing `https://app.liftlog.online/feed/share…` links |
| D3 | Slug / EAS project | `alcedo` creates new EAS project; current `83fbb14a-2940-4b8e-894a-170eb1e23fa3` in `app/app.json:208` + `updates.url https://u.expo.dev/…` | ☐ Deferred | Flip only after `eas project:create` + OTA channel cutover |
| D4 | Colors | `splash/backgroundColor #02040A`, `adaptiveIcon.backgroundColor #02040A`, `primaryColor #0B2CC8` | ☑ Done | Applied at `app/app.json:12,13,48,142` — replaces `#fcfdf6`/`#046F03`/`#dfedda` |
| D5 | `Power Gym` placement | Splash footer `Alcedo — by Power Gym`, `onboarding.welcome.subtitle` suffix, `Settings → About` footer `© 2026 Power Gym — Alcedo v{version}` | ☑ Done | `en.json:337-338` welcome + `settings/index.tsx:132-138` About |
| D6 | Ship strategy | **Phase 1+2 as display-only rebrand** (name + assets), defer D1–D3 to separate store cutover PR | ☑ Done | Phase 1 shipped display-only |

---

## 1. Asset ledger — `app/assets/` (generated from `assets/logo/`)

Legacy assets are **replaced in place** (git shows `M`, path stable for `app.json`). Do not delete the path, only its bytes. Keep `assets/logo/` as source of truth.

| # | Target path | Source | Spec | Size | Currently `app/assets/` | Status |
|---|-------------|--------|------|------|-------------------------|--------|
| A1 | `app/assets/icon.png` | `assets/logo/kingfisher-icon-1024.png` re-export | 1024×1024 RGBA, 512px safe circle | 118943B new | ☑ Done | Generated via `app/scripts/generate-branding.mjs` (sharp 0.35.4) |
| A2 | `app/assets/icon_foreground.png` | `assets/logo/kingfisher-foreground-1024.svg` | 432×432 transparent, bird centered `translate(517.5,528.5) rotate(-26) scale(1.26)` | 11150B new | ☑ Done | |
| A3 | `app/assets/icon_monochrome.png` | `assets/logo/kingfisher-mono-1024.svg` recolored | 432×432 monochrome, breast/back `#FFFFFF`, wing `#FFFFFF` 60% | 6686B new | ☑ Done | Android 13 themed icon |
| A4 | `app/assets/splash.png` | `kingfisher-foreground` tight crop | 432×432 transparent on `backgroundColor #02040A` | 11150B new | ☑ Done | `expo-splash-screen resizeMode contain` |
| A5 | `app/assets/notification.png` | `kingfisher-mono` white-only | 96×96 **pure #FFFFFF on transparent** | 944B new | ☑ Done | Android small icon must be white — now 4-channel 96×96 white-on-transparent |

Generate via `app/scripts/generate-branding.mjs` (sharp/resvg). After generation run `npx expo-doctor` + `npx expo export --platform android` (3478 modules) + `npx expo prebuild --clean --no-install`.

---

## 2. Expo config — `app/app.json`

| # | Key | Line | Current | Target (Phase 1 immediate) | Target (Phase 6 deferred, keep compat) | Status |
|---|-----|------|---------|----------------------------|----------------------------------------|--------|
| C1 | `expo.name` | 3 | `LiftLog` | `Alcedo` | — | ☑ Done |
| C2 | `expo.icon` | 11 | `./assets/icon.png` | keep path, new bytes (A1) | — | ☑ Done |
| C3 | `expo.backgroundColor` | 12 | `#fcfdf6` | `#02040A` | — | ☑ Done |
| C4 | `expo.primaryColor` | 13 | `#046F03` | `#0B2CC8` | — | ☑ Done |
| C5 | `expo-notifications.icon` | 41 | `./assets/notification.png` | keep path, new bytes (A5) | — | ☑ Done |
| C6 | `expo-splash-screen backgroundColor` | 48 | `#fcfdf6` | `#02040A` | — | ☑ Done |
| C7 | `expo-splash-screen image` | 49 | `./assets/splash.png` | keep path, new bytes (A4) | — | ☑ Done |
| C8 | `NSHealthUpdateUsageDescription` | 27 | `LiftLog would like…` | `Alcedo would like to share your workout and/or body weight with Apple Health.` | Add `by Power Gym` if legal approves | ☑ Done |
| C9 | `adaptiveIcon.backgroundColor` | 142 | `#dfedda` | `#02040A` | — | ☑ Done |
| C10 | `adaptiveIcon.foregroundImage` | 143 | `./assets/icon_foreground.png` | keep path, new bytes (A2) | — | ☑ Done |
| C11 | `adaptiveIcon.monochromeImage` | 144 | `./assets/icon_monochrome.png` | keep path, new bytes (A3) | — | ☑ Done |
| C12 | `expo.slug` | 4 | `liftlog` | keep `liftlog` for Phase 1 | `alcedo` + dashboard redirect | ☐ Deferred — keep `liftlog` |
| C13 | `expo.scheme` | 59 | `liftlog` | `alcedo` + keep `liftlog` alias (`["alcedo","liftlog"]` or second intentFilter) | — | ☑ Done — `["alcedo","liftlog"]` |
| C14 | `android.package` | 63 | `com.limajuice.liftlog` | keep for Phase 1 | `com.powergym.alcedo` + new listings | ☐ Deferred |
| C15 | `android.intentFilters host` | 78 | `app.liftlog.online` | keep Phase 1 | `app.alcedo.app` + keep old 301 | ☐ Deferred |
| C16 | `android.intentFilters pathPattern` | 130,136 | `.*\\.liftlogplan` | add alongside `.*\\.alcedoplan` | dual 2 releases | ☑ Done — dual |
| C17 | `ios.bundleIdentifier` | 148 | `com.limajuice.liftlog` | keep Phase 1 | `com.powergym.alcedo` | ☐ Deferred |
| C18 | `ios.associatedDomains` | 150 | `applinks:app.liftlog.online` | keep Phase 1 | `applinks:app.alcedo.app` + keep old | ☐ Deferred |
| C19 | `CFBundleDocumentTypes / UTTypeIdentifier` | 157,162,166,168 | `LiftLog Plan` / `com.limajuice.liftlog.plan` | keep Phase 1 | `Alcedo Plan` / `com.powergym.alcedo.plan` + keep old | ☐ Deferred |
| C20 | `public.filename-extension` | 175 | `liftlogplan` | `["liftlogplan","alcedoplan"]` dual | — | ☑ Done |
| C21 | `extra.eas.projectId` / `updates.url` | 208-216 | `83fbb14a…` / `https://u.expo.dev/83fbb14a…` | keep Phase 1 | new projectId after `eas project:create` | ☐ Deferred |
| C22 | `ios.appleTeamId` | 202 | `""` | set to Power Gym team when D1 flips | — | ☐ Deferred |

---

## 3. Copy — i18n `app/src/i18n/en.json` (19 locales)

Single source is `en.json:20-538`; replicate to `ar,cs,de,es,fi,fr,hu,it,ko,nl,pl,pt,ru,sr,sv,tr,uk,zh-hans.json` (same offsets ±2). Script the replace (`rg LiftLog → Alcedo`) then hand-review; leave retranslations to Weblate.

| # | Key | en.json line | Contains | Target | Status |
|---|-----|--------------|----------|--------|--------|
| I1 | `backends.built_in.subtitle` | 20 | `The backend LiftLog runs.` | `The backend Alcedo runs.` | ☑ Done |
| I2 | `backends.kind.liftlog.label` | 32 | `LiftLog backend` | `Alcedo backend` (keep key `liftlog` for storage compat, label only) | ☑ Done |
| I3 | `backends.kind.liftlog.body` | 33 | `Serves the feed…` | keep | ☑ — |
| I4 | `backends.test.not_liftlog` | 53 | `Not a LiftLog server.` | `Not an Alcedo server.` | ☑ Done |
| I5 | `backends.explanation` | 63 | `Point LiftLog at your own server.` | `Point Alcedo at your own server.` | ☑ Done |
| I6 | `whats_new.backends.body` | 67 | `LiftLog can now point…` | `Alcedo can now…` | ☑ Done |
| I7 | `backup.plaintext_export.explanation` | 77 | `LiftLog cannot restore…` | `Alcedo cannot restore…` | ☑ Done |
| I8 | `backup.remote.explanation` | 82 | `enables LiftLog to send…` | `enables Alcedo to send…` | ☑ Done |
| I9 | `onboarding.open_source.body` | 333 | `LiftLog is crafted… Github.` | `Alcedo by Power Gym is crafted… View source…` | ☑ Done |
| I10 | `onboarding.welcome.title` | 339 | `Welcome to LiftLog!` | `Welcome to Alcedo!` | ☑ Done |
| I11 | `onboarding.welcome.subtitle` | 338 | `Let's get a few things set up` | append `— by Power Gym` | ☑ Done |
| I12 | `plan.import.error.needs_newer_app.message` | 408 | `newer version of LiftLog` | `newer version of Alcedo` | ☑ Done |
| I13 | `plan.import.explanation` | 409 | `Plans are shared as .liftlogplan files.` | `Plans are shared as .alcedoplan files (and legacy .liftlogplan).` | ☑ Done |
| I14 | `rating.enjoying.title` | 435 | `Enjoying LiftLog?` | `Enjoying Alcedo?` | ☑ Done |
| I15 | `settings.feature_request.subtitle` | 465 | `LiftLog should have!` | `Alcedo should have!` | ☑ Done |
| I16 | `settings.localisation.subtitle` | 469 | `Set LiftLog's language…` | `Set Alcedo's language…` | ☑ Done |
| I17 | `weight.migrate.explanation` | 535 | `LiftLog now supports…` | `Alcedo now supports…` | ☑ Done |
| I18 | `whats_new.eyebrow` | 538 | `New in LiftLog` | `New in Alcedo` | ☑ Done |
| I19 | `backends.built_in.*` other locales | — | 18 files × 13 keys | same replaces | ☑ Done — `cs.json:22` Liftlog→Alcedo, `tr.json:24` Liftlog→Alcedo, `it/ru` .alcedoplan etc. |

---

## 4. Hardcoded strings — `app/src/` (non-generated)

| # | File | Line | Current | Target | Risk | Status |
|---|------|------|---------|--------|------|--------|
| H1 | `app/src/components/smart/welcome-wizard.tsx` | 115,118 | `t('onboarding.welcome.*')` renders LiftLog branding | `Alcedo` + `by Power Gym` | safe | ☑ Done — via I9-I11 |
| H2 | `app/src/components/smart/welcome-wizard.tsx` | 131 | `https://github.com/LiamMorrow/LiftLog` | `https://github.com/Luke23-45/alcedo` | safe | ☑ Done |
| H3 | `app/src/components/smart/welcome-wizard.tsx` | 137 | `https://liftlog.online/privacy.html` | `https://alcedo.app/privacy.html` | safe | ☑ Done |
| H4 | `app/src/components/smart/app-state-provider.tsx` | 67 | `bugReportUrl …/LiamMorrow/LiftLog/issues/new…` | new repo / keep alias | safe | ☑ Done |
| H5 | `app/src/app/(tabs)/settings/index.tsx` | 33 | same `bugReportUrl` | — | safe | ☑ Done |
| H6 | `app/src/app/(tabs)/settings/index.tsx` | 86 | `https://github.com/LiamMorrow/LiftLog/discussions` | new repo | safe | ☑ Done |
| H7 | `app/src/app/(tabs)/settings/index.tsx` | 99 | `https://translate.liftlog.online` | `https://translate.alcedo.app` or keep Weblate alias | safe | ☑ Done |
| H8 | `app/src/app/(tabs)/settings/index.tsx` | 130-138 | `LiftLog is an entirely open source app… AGPL-3.0` + `<Link href="…LiamMorrow/LiftLog">` + `LiftLog is currently version {v}` | `Alcedo by Power Gym…` + `Alcedo is currently version {v}` + footer `© 2026 Power Gym` | safe | ☑ Done |
| H9 | `app/src/app/(tabs)/(session)/index.tsx` | 265 | `title: 'LiftLog'` | `Alcedo` | safe | ☑ Done |
| H10 | `app/src/components/presentation/foundation/documentation-row.tsx` | 6 | `docsBaseUrl = 'https://github.com/LiamMorrow/LiftLog/blob/main/docs/'` | new repo | safe | ☑ Done |
| H11 | `app/src/store/feed/shared-item-effects.ts` | 77 | `Please update LiftLog.` | `Please update Alcedo.` | safe | ☑ Done |
| H12 | `app/src/store/feed/shared-item-effects.ts` | 101 | `https://app.liftlog.online/feed/shared-item/…` | `https://app.alcedo.app/feed/shared-item/…` + keep old 301 | deferred | ☐ Deferred — keep old host |
| H13 | `app/src/store/feed/index.ts` | 235 | `https://app.liftlog.online/feed/share?id=…` | `https://app.alcedo.app/feed/share?id=…` + keep old | deferred | ☐ Deferred |
| H14 | `app/src/services/api-consts.ts` | 7 | `https://api.liftlog.online` | `https://api.alcedo.app` + keep DNS alias | deferred | ☐ Deferred |
| H15 | `app/src/services/backend-probe.ts` | 35,52,66,75,86 | `LiftLog backend` strings + `status: 'notLiftLog'` + `backupProbeHeader = 'X-LiftLog-Probe'` | `Alcedo backend` + keep `'notLiftLog'` compat or dual check, send both `X-Alcedo-Probe` + `X-LiftLog-Probe` 6mo | safe/compat | ☑ Done — comments Alcedo + `backupProbeHeader='X-Alcedo-Probe'` + `legacyBackupProbeHeader='X-LiftLog-Probe'` dual send |
| H16 | `app/src/app/(tabs)/settings/backends/[id].tsx` | 124 | `case 'notLiftLog'` | dual case | — | ☑ Done — kept `'notLiftLog'` literal (type compat) |
| H17 | `app/src/services/backend-probe.spec.ts` | 76-141 | same | — | test | ☑ Done — dual header expect + comment Alcedo |
| H18 | `app/src/hooks/useIncomingPlanFile.ts` | 12 | `Ingests a .liftlogplan file` | dual `.liftlogplan` + `.alcedoplan` | safe | ☑ Done |
| H19 | `app/src/models/plan-file.ts` | 28 | `Parses the bytes of a .liftlogplan` | dual | safe | ☑ Done — `PLAN_FILE_EXTENSION='alcedoplan'` + `LEGACY='liftlogplan'` |
| H20 | `app/src/models/plan-file.spec.ts` | 173 | `.liftlogplan` example path `plugins/liftlog-plan-builder/…` | dual fixture | test | ☐ Deferred — legacy fixture `.liftlogplan` still valid |
| H21 | `app/src/store/settings/*` (`export-*.ts`) | — | `liftlog-export.*`, `export.liftlogbackup.*` display filenames | `alcedo-export.*`, `export.alcedobackup.*` keep import of old | safe | ☑ Done — `alcedo-export.*` + `export.alcedobackup.*` + specs updated |

---

## 5. Technical identifiers — persisted / OS contracts (defer behind compat, flip together)

| # | File | Line | Current | Target | Migration | Status |
|---|------|------|---------|--------|-----------|--------|
| T1 | `app/src/models/backend.ts` | 7,11,55 | `BackendKind='liftlog'`, `builtInBackendId='liftlog'` | keep literal `liftlog` for Phase 1, display `Alcedo`; later `createMigrations()` mapping `liftlog→alcedo` with `dependsOn` | `models/storage/versions/` `createMigrations()` | ☐ Deferred — keep literal |
| T2 | `app/src/store/backends/index.ts` | 20-22 | `builtInBackend: {name:'LiftLog', id:'liftlog', kind:'liftlog'}` | `name:'Alcedo'` keep `id` until T1 migration | — | ☑ Done — name Alcedo |
| T3 | `app/src/models/plan-file.ts` | 8 | `PLAN_FILE_EXTENSION='liftlogplan'` | `'alcedoplan'` + accept both | `parseProgramBlueprintFile` | ☑ Done — see H19 |
| T4 | `app/src/services/backend-probe.ts` | 86 | `X-LiftLog-Probe` server contract | `X-Alcedo-Probe` + send both | server must accept both headers | ☑ Done — dual |
| T5 | `modules/workout-worker/android/build.gradle` | 56 | `packageName='com.limajuice.liftlog'` | `com.powergym.alcedo` | proto re-emit | ☐ Deferred |
| T6 | `modules/workout-worker/android/proguard-rules.pro` | 1,8 | `com.limajuice.liftlog.**` | new namespace | — | ☐ Deferred |
| T7 | `modules/workout-worker/android/src/main/java/expo/modules/workoutworker/*.kt` (7 files) | 15 | `import com.limajuice.liftlog.*` DTOs | new package after proto re-emit | `npm run json-schema` | ☐ Deferred (KEEP phase 1) |
| T8 | `app/scripts/build-plan-validator.mjs` | 4 | Builds `.liftlogplan` validator | dual `.alcedoplan` | tooling | ☑ Done |
| T9 | `app/package.json` | 2 | `name: "liftlog-react"` | `alcedo-react` (or `alcedo`) | — | ☑ Done — `alcedo-react` |

---

## 6. Foreclosed — do NOT rename in this ledger

| Path | Reason |
|------|--------|
| `backend/LiftLog.Api/**`, `LiftLog.Lib/**`, `LiftLog.sln`, `*.csproj`, `Dockerfile:2,8,9,11,14` | C# namespace / image `ghcr.io/liammorrow/liftlog:api` — internal, huge churn, out of scope for display rebrand |
| `app/src/gen/proto*` (~2300 lines `LiftLog.Ui.Models…`) + `app/src/models/storage/versions/initial/protobuf-migrator.ts:51-527` + `store/stored-sessions/*`, `store/settings/import-backup-effects.ts:235`, `services/data-migrations/*` | Protobuf generated — mirrors `com.limajuice.liftlog` DTOs, regenerated via proto build only |
| `app/test/shims/expo-sqlite.ts liftlog-test-*.db` | temp files |
| `app/src/store/backends/*spec.ts` referencing `liftlog` literals | keep until T1 migration |

---

## 7. Docs / site / workflows (confirm scope with D1–D2)

Out of scope for minimal display rebrand; track here so nothing slips if you expand scope. Repo links only (`github.com/…`) were retargeted to `https://github.com/Luke23-45/alcedo` on 2026-09-21 (README, `site/index.html`, `CONTRIBUTING.md`, `scripts/create-release.ts`, `plugins/liftlog-plan-builder`, app deep links); the display-name/host rows below remain pending:

| # | File | Lines | Current | Target | Status |
|---|------|-------|---------|--------|--------|
| D7 | `README.md` | 1,4-6,10-12,19,25,37-39,71,83,97,103-107,122,124,132,136 | `LiftLog`, screenshots `AppScreens-LiftLog…`, Play `id=com.limajuice.liftlog`, `translate.liftlog.online` | `Alcedo by Power Gym` | ☐ Pending — out of scope Phase 1 |
| D8 | `docs/*` `PlanFileFormat.md:3,5,7,13`, `SelfHosting.md:1,10,14,19`, `RemoteBackup.md:3,13`, `FeedProcess.md:3,21`, `Backends.md:3-4,17`, `CsvImport.md:3-4` | — | `.liftlogplan` narrative, `liftlog:api`, `app.liftlog.online` | dual / new hosts | ☐ Pending |
| D9 | `site/index.html` | 6,752,759,762,777,801,824,932,957,984,1044,1060,1091,1099,1140 | `<title>LiftLog`, Play `com.limajuice.liftlog`, footer `© LiftLog` | `Alcedo` / `© 2026 Power Gym` | ☐ Pending |
| D10 | `site/privacy.html` | 18,25,48,54,67 | `Liam Morrow built the LiftLog app`, `support@liftlog.online` | `Power Gym builds Alcedo`, `support@alcedo.app` | ☐ Pending |
| D11 | `plugins/liftlog-plan-builder/README.md`, `skills/create-liftlog-plan/SKILL.md` | 1-48 | `liftlog-plan-builder` | `alcedo-plan-builder` + keep alias | ☐ Pending |
| D12 | `.maestro/config.yaml:1` + 5 flows | 1 | `appId: com.limajuice.liftlog` | `com.powergym.alcedo` after D1 | ☐ Deferred |
| D13 | `.github/workflows/android-publish.yml:72,90-91,113`, `ios-publish.yml:127-128,159` | — | `liftlog.keystore`, `alias liftlog`, `LiftLog.xcworkspace` | `alcedo.*` | ☐ Deferred |

---

## 8. Execution order (phased)

1. **A1–A5** — generate assets from `assets/logo/`; commit `app/scripts/generate-branding.mjs` if created — ☑ Done
2. **C1–C11 + C16,C20** — `app/app.json` display-only (keep `slug`/`package`/`hosts`/`projectId`); `Metro` already fixed — no `unstable_enablePackageExports` override — ☑ Done
3. **I1–I19 + H1–H11,H18–H21** — i18n (scripted `rg` en→Alcedo) + hardcoded strings + `Power Gym` footers; `npm run json-schema` not needed (no model shape change) — ☑ Done
4. **T2–T3,T8–T9** — safe technical (name-only / dual file accept) without stored migration — ☑ Done
5. **Verify** (§9) then merge Phase 1 — next
6. **D1–D4 + T1,T4–T7 + C12–C15,C17–C19,C21–C22 + D12–D13** — package/host/scheme/store cutover as second PR once D1–D2 decided; introduce `createMigrations()` for `liftlog→alcedo` and dual probe headers — deferred

---

## 9. Verification — must pass before marking Phase 1 done

```
cd app
npx expo-doctor                    # 21/21, validates 1024/432/96 dimensions
npx expo export --platform android # Bundles ~3478 modules, 48 assets including new icons
npx expo prebuild --clean --no-install # check adaptiveIcon/splash/backgroundColor applied
npm test ; npm run typecheck ; npm run lint ; npm run format:check
# visual: npx expo start --dev-client --clear → splash #02040A with Power Gym, launcher icon, themed monochrome, notification white, welcome "Welcome to Alcedo — by Power Gym", Settings → About "Alcedo by Power Gym"
# maestro: npx maestro test .maestro/ (after D12)
```

- Legacy deletion check: `Get-ChildItem app/assets` — only new kingfisher PNGs + `exercises/` remain; `rg -n "LiftLog|limajuice|#046F03|#fcfdf6" app --glob "!node_modules"` (excluding `gen/proto`, `backend`, `*.lock`) returns 0 for display strings after I+H.
- Dual compat check: open legacy `.liftlogplan` + `liftlog://` link still imports.

---

## 10. How to use this ledger

- Check `☐ Pending` → `☐ In progress` → `☑ Done` as you edit. Keep the line number reference — re-run `rg` before marking `☑`.
- If you add/remove a doc, update `docs/index.md` in the same change (per `AGENTS.md`).
- This file lives at `docs/working/logo_brand_name_ledger.md` and is **not** shipped in production — it is the working checklist so no surface is missed.
