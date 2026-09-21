# Offline-First Plan — Alcedo

**Status:** audit + plan only. Nothing implemented.
**User requirement (verbatim):** offline-first; the app must work seamlessly with no internet using local SQLite, for privacy; sync is opt-in from Settings — the user chooses whether and where to sync; Feed needs internet; everything else must run fully offline. "At least we need to try to do this."

---

## 1. Current-state audit (grounded in code)

### 1.1 Where data lives today

- **Local SQLite is the database.** Opened in `app/src/components/smart/services-provider.tsx:14-20` via `openDatabaseAsync('db.db')` (expo-sqlite), wrapped with drizzle-orm. Tables in `app/src/db/schema.ts`:
  - `session` (id, active flag, versioned JSON payload), `exercise` (id, payload), `program` (id, active, payload) — workouts, library, plans.
  - Feed tables: `feed_identity`, `feed_followed_user`, `feed_pending_user`, `feed_items`, `feed_follower_user`, `feed_follow_request`, `feed_reaction`, `feed_sent_reaction`, `feed_revoked_follow_secrets`, `feed_unpublished_sessions`.
  - `backend`, `backend_header`, `backend_assignment` — backend configs and feature→backend mapping.
  - `data_migration` — migration ledger.
- **SQLite is already the source of truth for domain data, not a cache.** Redux slices hydrate from SQLite at startup (`app/src/store/stored-sessions/effects.ts:46-65`, `app/src/store/program/effects.ts:39`, `app/src/store/backends/effects.ts:18-45`) and write back through listener-middleware effects ("We manually do persistence", `app/src/store/store.ts:49-51`). The Redux store is an in-memory mirror.
- **Preferences are NOT in SQLite.** They live in `KeyValueStore` (`app/src/services/key-value-store.ts`) — one file per key under expo-file-system — driven by the typed `preferenceRegistry` in `app/src/store/settings/registry.ts` (~70 prefs) with generic hydrate/persist effects in `app/src/store/settings/effects.ts`. Anything sync-related (toggles, timestamps) would naturally become new registry prefs.
- Net effect: **the app already runs its core fully offline.** No login wall, no startup network probe, no feature gating on connectivity anywhere in the code. `NetInfo`/`expo-network` are not used at all.

### 1.2 The backends system

Model: `app/src/models/backend.ts`.

- `BackendKind = 'liftlog' | 'backupEndpoint'`. `BackendFeature = 'feed' | 'aiPlanner' | 'backup'`.
- One built-in backend: id `'liftlog'`, name "Alcedo", url = `apiBaseUrl` (`app/src/store/backends/index.ts:23-30`, `app/src/services/api-consts.ts:3`). The server is the .NET Web API in `backend/`.
- **Fresh installs assign `feed` and `aiPlanner` to the built-in backend; `backup` gets no assignment** (`app/src/services/data-migrations/seed-backend-assignments.ts:11-18`). Only `backup` may be set to "no backend" (`canBeSetToNoBackend`, `models/backend.ts:27-29`) — feed/aiPlanner always point somewhere.
- Assignment storage: `backend_assignment` table, `feature` (text PK) → `backendId` (`app/src/db/schema.ts:126-130`). "A missing row means the feature has no backend and does not run" — backup silently no-ops; feed throws `NoFeedBackendError` on first request (`app/src/services/feed-api.ts:47-50`); AI planner posts a "No backend is configured" chat message (`app/src/services/ai-chat-service-v2.ts:92-99`).

**The LiftLog backend speaks three protocols:**
1. **Feed — REST + E2E encryption, bidirectional.** `POST /events` (pull), `PUT /event` (publish own sessions), `POST /users`, `PUT /user`, inbox/follow-secret endpoints (`app/src/services/feed-api.ts:66-181`). Payloads carry `encryptedEventPayload`/`encryptedEventIV`; the server holds ciphertext only.
2. **AI planner — SignalR realtime chat** at `{base}/ai-chat-v2` (`app/src/services/ai-chat-service-v2.ts:17,105`). Server-side generation.
3. **Backup — upload-only.** `POST {base}/backup`, `Content-Type: application/octet-stream` (`app/src/store/settings/remote-backup-effects.ts:250-254`).

**The `backupEndpoint` backend** is a bare backup-protocol server: its `url` is the literal POST target, backup is the only feature it can serve (`models/backend.ts:74-76`). Body = **gzip-compressed serialized SQLite database** (`app/src/store/settings/util.ts:44-77`).

**What breaks if the backend is unreachable:** core does not break. Feed sync fails (sessions queue locally in `feed_unpublished_sessions`, retried on home-focus — `app/(tabs)/(session)/index.tsx:50`); AI planner chat shows an error; backup fails silently (auto) or with an error card (manual Test). Feed publishing is additionally gated on the user's own `identity.publishWorkouts` flag (`app/src/store/feed/feed-items-effects.ts:186-212`) — nothing auto-publishes.

### 1.3 Auto-backup (hash-based) today

- **What:** SHA-256 (via `encryptionService.sha256`) of the **gzipped backup bytes** (`app/src/store/settings/remote-backup-effects.ts:149-150`).
- **Trigger:** `executeRemoteBackup({})` dispatched from the home/session tab's `useFocusEffect` — **every home-tab focus** (`app/(tabs)/(session)/index.tsx:48-52`). There is no cron, no background task, no network-change listener; screen focus *is* the scheduler.
- **Change detection:** non-forced runs skip the upload when `lastBackup.lastSuccessfulRemoteBackupHash === hash` for the same backend id.
- **Offline behavior:** no connectivity check. `fetch` throws → classified `'connection'`. Silent for auto-backup: no snackbar, no retry, no queue — the next home-focus recomputes the whole payload from scratch (`remote-backup-effects.ts:89-92, 304-310`).
- **Payload is plaintext gzip.** Feed tables are stripped unless the user opts in (`backupIncludeFeedAccount`), and backend credential tables are stripped "because the blob is plaintext gzip sitting on the very server whose credentials it would carry" (`app/src/store/settings/util.ts:56-63`). **Privacy implication: anyone holding the backup URL/target can read the user's full workout data.**
- **Test buttons are real network probes**, not stubs (`app/src/services/backend-probe.ts`): `GET {base}/features`, and `POST` empty body with `X-Alcedo-Probe: true` to a backup endpoint.
- **No download path exists.** Backup is upload-only; restore reads a local file the user picks (`import-backup-effects.ts:71-100`). There is currently **no protocol for pulling data back from a server** — this is the single biggest blocker for true sync (see §6).

### 1.4 Network dependencies by feature

| Feature | Network? | Offline behavior today |
|---|---|---|
| Workouts, plans, history, trends, exercise library, settings, local export/import, plaintext export, Health Connect export | None — pure SQLite/Redux | Fully functional |
| Feed (timeline, inbox, reactions, comments, follow, profile publish) | Required — all content is server-side | Background refresh fails silently, keeps last-loaded items; manual refresh shows a snackbar (`app/src/store/feed/effects.ts:287`); no retry loop |
| Feed identity bootstrap | Auto `POST /user/create` at first startup after backends hydrate | If offline at first launch: silent `RemoteData.error`, app does not gate; no user-visible retry affordance (`app/src/store/feed/effects.ts:136-141, 324`) |
| AI planner chat | Required — server-side generation | "Failed to connect…" message; also calls RevenueCat `syncPurchases()` on start failure |
| Plan/session share links (`https://app.liftlog.online/feed/shared-item/<id>`) | Inherently online | Error state with Retry button |
| Remote backup | Optional, upload-only | Silent skip/fail on auto; error card on manual Test |
| Welcome wizard | None — no remote plan import exists; plan import is a local file picker | N/A |

**Assumed-always-online edges found (no blockers, but sloppy):** silent errored feed identity on offline first launch; AI planner defaults to Pro-gated (`requiresPro ?? true`) when no backend is configured (`ai-chat-service-v2.ts:85`); feed spinners/snackbars imply "loading" rather than stating "offline".

### 1.5 Settings structure — where Sync fits

- Settings home (`app/src/components/presentation/settings/home/settings-home.tsx`) renders groups: Preferences, Training, **Data & Sync**, Community, Support.
- `DataSyncGroup` (`data-sync-group.tsx`) already owns the DATA & SYNC section: Health, Watch (honestly unavailable), **Backup** (→ `/settings/backup-and-restore`), Storage (→ same hub). A **Sync** row belongs here or inside the backup hub.
- The backup hub (`app/src/components/presentation/settings/backup/backup-screen.tsx`) has Backup card (remote backup), Storage card, About card. The remote-backup screen (`backup-remote/`) has destination card, last-tested card, honest notes, test footer.
- Backend management lives at `/settings/backends` (list) and `/settings/backends/[id]` (editor, deliberately design-deferred). The backend picker and Test probes are reusable as-is for a sync target chooser.
- Per `AGENTS.md`, an opt-in feature like Sync should also get a **What's New** entry (`app/src/models/whats-new.ts`) and be considered for the **welcome wizard** (`app/src/components/smart/welcome-wizard.tsx`), since fresh installs never see the banner.

---

## 2. Target architecture

**Local SQLite is the single source of truth. Sync is an optional, user-controlled layer on top — never a requirement.**

Concretely, this is 80% true already; the work is to make it *explicit and contractual*:

1. **All reads come from SQLite** (via the existing Redux mirror). No screen may render remote state as primary; remote data is only ever a refresh of a local cache (Feed keeps this pattern but must say so).
2. **All writes go to SQLite first, then optionally outward.** Writes never await the network. Outbound work (feed publish, backup upload, future sync push) moves to a durable local queue with retry — the existing `feed_unpublished_sessions` pattern generalizes.
3. **No feature may gate on connectivity.** The two violations to fix: feed-identity bootstrap has no retry affordance when first launch is offline; AI planner's `requiresPro ?? true` default.
4. **Connectivity is a state the UI names, not an error it hides.** Add one connectivity source (NetInfo) and derive honest states: "You're offline — showing your saved data" for Feed; disabled-with-explanation for AI planner; queued-with-count for backup/sync.

### 2.1 Offline-capable vs online-only

| Area | Target | Honest UI state |
|---|---|---|
| Workouts, plans, history, trends, exercise library, settings, timers, notifications | Fully offline | No change — already work |
| Local backup export / import, plaintext export | Fully offline | Already work |
| Feed timeline/inbox/reactions/follows | Online-only (content lives on the server) | Cached items remain browsable offline with a clear "Offline — showing saved items" banner; pull-to-refresh offline says "You're offline" instead of spinning; never fake content |
| Feed publishing (share a session) | Queue offline, send when online | "Will publish when you're back online" state on the queued session |
| AI planner | Online-only | Disabled composer with "AI planner needs an internet connection" — not a spinner, not a fake error |
| Share links | Online-only | Unchanged (already has error + Retry) |
| Backup / Sync | Opt-in; local always works | Queue with pending count; "Last synced <time> · N changes pending" |

---

## 3. Sync design

### 3.1 Opt-in and placement

- **Settings → DATA & SYNC gets a "Sync" row** (new screen, e.g. `/settings/sync`), alongside Backup. Screen contents:
  - Master toggle: **Sync — Off by default.** First-run enable shows a privacy disclosure sheet (see §4) with explicit "Enable sync" confirmation.
  - **Sync target:** reuse the existing backend picker (`/settings/backends`) — user chooses which of their backends receives sync. Only `liftlog` backends can sync (bidirectional); `backupEndpoint` stays backup-only and is hidden/disabled here with an explanation.
  - **Sync now** button (manual trigger).
  - Status: last successful sync time, pending-change count, per-failure message with Retry.
  - **What's included** list (sessions, programs, exercises, settings?) with honest scope.
- Prefs (new `preferenceRegistry` entries): `syncEnabled` (bool, default false), `syncBackendId` (string|undefined), `syncLastSuccess` (manual-hydrate timestamp), `syncAutoOnWifiOnly` (bool, default true — recommended).
- Announce via What's New + welcome-wizard consideration per `AGENTS.md`.

### 3.2 Automatic triggers

- App foreground / home-tab focus (same as today's backup trigger — proven, battery-cheap).
- Connectivity regain (NetInfo listener) when there are queued changes.
- After significant local writes (session saved, program edited) — debounced, not per-keystroke.
- Never on a timer/cron; never in background (no background-task infra exists today).

### 3.3 Recommended conflict policy: **last-write-wins per record**

Justification:
- Workout records are **append-mostly**: finished sessions are immutable; the active session is single-row; programs/exercises change infrequently and rarely concurrently.
- Record-level merge of nested workout JSON is dangerous (a bad merge corrupts training data — a safety issue in a fitness app). LWW is simple, predictable, and explainable in UI: "Kept the newest change (from this device / your other device)."
- Implementation: each synced record needs a reliable `updatedAt` + device id. The versioned payloads (`models/storage/versions/`) already version the *shape*; sync needs a small envelope addition (`updatedAt`, `deviceId`, `deleted` tombstone for deletes) — a data migration, no payload-shape break.
- Deletes: tombstones, so a delete on device A propagates instead of resurrecting.
- Whole-DB-blob sync (what backup does today) is rejected for sync: LWW at DB granularity would silently discard an entire device's day of workouts. Record-level is the minimum honest granularity.

### 3.4 Failure handling

- Local keeps working, always. Failed syncs never block reads/writes.
- Durable outbox table (e.g. `sync_outbox`: record type, id, envelope, attempts, next_retry_at) — generalizes today's `feed_unpublished_sessions` one-off.
- Exponential backoff with jitter; surfaced as pending count, not alarms.
- Manual "Sync now" forces an attempt and shows the real result (success / error kind + Retry), mirroring the existing Test-button honesty.

### 3.5 The hard blocker: the server has no pull path

Today's protocol is **upload-only** (`POST /backup`, no `GET`; restore is local-file only). Bidirectional sync cannot be built app-side alone against the current server. Two honest options:

- **Option A (recommended): add server endpoints.** `GET /backup` (or a record-level `/sync` pull/push protocol) in `backend/` (.NET). This is backend work and needs explicit approval — `AGENTS.md` says `backend/` "usually does not need changing."
- **Option B: sync-via-backup-blobs.** App uploads whole-DB blobs (as today) and downloads the latest blob to restore — still needs a server-side `GET`, so it collapses into Option A with worse conflict behavior. Not recommended.

**Until the pull path exists, do not call anything "Sync".** Ship backup improvements (opt-in, queue, status) labeled as backup.

---

## 4. Privacy story

What the user must be told **before** enabling sync/backup (disclosure sheet, plain language):

1. **What leaves the device:** your workout sessions, programs, and exercise library as stored in the local database. Feed tables are excluded unless you opt in (`backupIncludeFeedAccount`). Backend credentials are never included.
2. **In what form:** a gzip-compressed copy of the database, **not end-to-end encrypted** — the server you choose can read it. (Contrast: Feed posts *are* end-to-end encrypted; the server holds ciphertext only.)
3. **When:** only after you enable it — never automatically before opt-in. Then: on app foreground, when connectivity returns with pending changes, and when you tap "Sync now" / "Test".
4. **Where:** the backend *you* chose in Settings. The built-in Alcedo server cannot receive backups/sync (`backendSupportsFeature` excludes it) — you must add your own server or endpoint.
5. **What never leaves without a separate action:** Feed publishing requires your `publishWorkouts` consent per identity; share links require tapping Share; AI planner sends messages only when you chat.

Recommended copy tone: "Your data stays on this device unless you turn on sync. Nothing is uploaded automatically before you choose a destination."

Open privacy hardening (user decision, §7): encrypt the backup/sync blob client-side before upload (the `encryption-service.ts` primitives exist).

---

## 5. Migration path (each phase independently shippable)

**Phase 0 — Contract (no behavior change).** Adopt this doc as the offline-first contract. Add `NetInfo` as the single connectivity source. No UI changes except plumbing.

**Phase 1 — Offline hardening (app-only, no server).**
- Feed: offline banner on cached content; "You're offline" on pull-to-refresh; queued-publish state ("Will publish when you're back online").
- Feed identity: retry affordance when first-launch bootstrap failed offline (re-attempt on next foreground with connectivity, surfaced in Feed settings rather than silent).
- AI planner: `requiresPro` default fix (no-backend ⇒ not Pro-gated, just unconfigured); offline disabled-composer state.
- Backup: keep upload-only, but queue failed auto-backups (replace silent-drop with the outbox pattern) and keep them labeled "backup".

**Phase 2 — Opt-in Sync screen (app-only).**
- DATA & SYNC → Sync screen: master toggle (default off), backend chooser (liftlog only), Sync now, status (last sync, pending count), included-data list, privacy disclosure on first enable.
- New prefs in `preferenceRegistry`; What's New entry; welcome-wizard consideration.
- Behind the toggle, Phase 2 still performs **backup-protocol upload** (honestly labeled) until the server pull path exists — or ships dark (UI + outbox, no-op transport) if the server work is deferred.

**Phase 3 — True bidirectional sync (needs server endpoints).**
- Server: pull path (`GET /backup` or record-level `/sync`). Requires explicit backend/ approval.
- App: `sync_outbox` table + envelope (`updatedAt`, `deviceId`, tombstones); push/pull; last-write-wins per record; conflict notice UI ("kept the newest change"); initial-sync merge for existing users (see below).

**Phase 4 — Multi-device polish.**
- Device naming/registration, per-device "last synced" visibility, de-duplication safeguards, sync of preferences subset (units, theme — never credentials).

**Existing-user data safety:** Phases 0–2 never restructure the DB; the envelope fields in Phase 3 are additive via the existing `data_migration` mechanism. First sync after upgrade: treat local as authoritative seed (upload-first, then pull), so no existing workout can be clobbered by an empty server state. Every phase keeps full local functionality with sync disabled — there is no point of no return.

---

## 6. Open questions (user decisions needed)

1. **Server work:** is adding a pull endpoint to `backend/` (.NET) acceptable? Without it, true sync is impossible — only backup-upload exists.
2. **Auto-backup today:** it silently uploads on every home-focus once a backup backend is assigned. Should this become opt-in too, given the privacy stance? (Currently assignment = consent, but it's silent.)
3. **Conflict policy:** last-write-wins per record (recommended), or do you want a manual conflict-resolution UI?
4. **Sync scope:** sessions + programs + exercises only, or also preferences (units, theme)? Never credentials — agreed?
5. **Payload encryption:** should the backup/sync blob be client-side encrypted before upload (currently plaintext gzip)?
6. **Feed offline:** keep Feed online-only with honest cached states (recommended), or invest in deeper offline feed?
7. **AI planner:** leave online-only, or is there an offline story wanted?
8. **Sync target UX:** reuse the generic backend picker, or a dedicated simplified "choose sync destination" flow?

---

## 7. Audit notes / caveats

- `docs/index.md` and `docs/RemoteBackup.md` (referenced by `AGENTS.md` and a code comment) do not exist; protocol details beyond code could not be cross-checked.
- UI gating for unreachable backends was traced at the service layer (`feed-api.ts`, `ai-chat-service-v2.ts`), which is definitive for "what works"; per-screen empty states were not exhaustively traced.
- Exact line numbers cited are from the 2026-09-22 tree on branch `redesign/backup-and-restore`.
