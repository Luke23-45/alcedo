# Alcedo Backend v2

NestJS 11 + TypeScript modular monolith with **two production-grade persistence
backends — MongoDB (Mongoose) and PostgreSQL (Prisma)**. Exactly one backend is
active per deployment, selected by `DB_PROVIDER`; both implement the same
repository contracts (see "Database providers" below). Migration target for the
legacy .NET backend in `~/workspace/alcedo/backend` (which this project does not touch).

Identity is **Google-only OAuth**, keyed by the stable Google `sub` claim — never by email.
Premium is granted by **RevenueCat** (native purchases) and a **signed website-checkout
webhook** tied to the same Google account. There is no Stripe integration, by design.

## Module architecture

```
src/
├── main.ts                  # bootstrap: global prefix /api, validation, filters, helmet, CORS
├── app.module.ts            # module wiring + startup database probe (either provider)
├── config/                  # strict env validation (env.validation.ts), LiteLLM yaml template
├── common/                  # request-id middleware, logging, AllExceptionsFilter,
│                            #   JwtAuthGuard (global), cursor pagination helpers,
│                            #   CurrentUserSub decorator, health checks
├── auth/                    # Google token verification, access JWT, refresh-token rotation
├── users/                   # profile CRUD + EntitlementService (premium state machine)
├── workouts/                # workout CRUD + offline-first sync (push/pull, idempotency, tombstones)
├── social/                  # follows, posts, feed
├── ai/                      # coach conversations via self-hosted LiteLLM (alias coach-primary)
├── payments/                # RevenueCat + website-checkout webhooks, billing status
└── health/                  # Terminus health checks (database, heap)
```

All errors are returned through `AllExceptionsFilter` as:

```json
{ "error": { "code": "MACHINE_READABLE_CODE", "message": "Safe human message", "details": [] } }
```

Every request gets an `X-Request-Id` (UUID). Authenticated routes require
`Authorization: Bearer <access-jwt>`; the global `JwtAuthGuard` rejects anything that is
not a valid access token with coded failures (`AUTH_*`).

## Endpoints

Global prefix: `/api`. Webhook routes are public; everything else needs a Bearer token.

| Method | Path | Description |
| ------ | ---- | ----------- |
| POST | `/api/auth/google` | Exchange a Google ID token for access + refresh tokens |
| POST | `/api/auth/refresh` | Rotate a refresh token (reuse revokes the whole family) |
| POST | `/api/auth/logout` | Revoke a refresh token (idempotent) |
| GET | `/api/auth/me` | Current identity |
| GET | `/api/users/me` | Profile |
| PATCH | `/api/users/me` | Update profile (strict DTO) |
| GET | `/api/workouts` | List own workouts, cursor-paginated |
| POST | `/api/workouts` | Create workout (starts at version 0) |
| GET | `/api/workouts/:id` | One workout (owner only; others get 404) |
| PATCH | `/api/workouts/:id` | Update workout (owner only) |
| DELETE | `/api/workouts/:id` | Soft delete → tombstone (owner only) |
| POST | `/api/sync/push` | Push offline mutations (idempotent, always 200) |
| GET | `/api/sync/pull` | Pull changes since cursor (live docs + tombstones) |
| POST | `/api/social/follow` | Follow a user (idempotent; self-follow rejected) |
| DELETE | `/api/social/follow/:userId` | Unfollow (idempotent) |
| GET | `/api/social/followers` | Cursor-paginated followers |
| GET | `/api/social/following` | Cursor-paginated following |
| POST | `/api/social/posts` | Create post (1–2000 chars, ≤4 HTTPS media URLs) |
| GET | `/api/social/feed` | Posts from followed users, newest first |
| DELETE | `/api/social/posts/:id` | Author-only soft delete (others get 404, no leak) |
| POST | `/api/webhooks/revenuecat` | RevenueCat webhook (public, Bearer-secret auth) |
| POST | `/api/webhooks/web-checkout` | Website checkout webhook (public, HMAC auth) |
| GET | `/api/billing/status` | `{ premium, status, source, expiresAt }` |
| POST | `/api/ai/conversations` | New conversation |
| GET | `/api/ai/conversations` | List conversations, cursor-paginated |
| GET | `/api/ai/conversations/:id/messages` | Cursor-paginated messages |
| DELETE | `/api/ai/conversations/:id` | Delete conversation + its messages (204) |
| POST | `/api/ai/conversations/:id/messages` | Send a message, get the coach reply (30/min) |
| POST | `/api/ai/conversations/:id/messages/stream` | SSE stream of the reply (20/min, premium-gated) |
| GET | `/api/healthz` | Liveness + database (active provider) + heap checks |

Default rate limit: 120 requests / 60s per IP. Webhook routes skip throttling (bursty
provider delivery); auth login/refresh and AI message routes have tighter per-route limits.

## Auth flow

1. The client signs the user in with Google and sends the **ID token** to
   `POST /api/auth/google`.
2. The server verifies the token with `google-auth-library`: signature, expiry, **audience
   allowlist** (`GOOGLE_CLIENT_ID` plus `GOOGLE_EXTRA_AUDIENCES`), and **issuer allowlist** (`accounts.google.com` /
   `https://accounts.google.com`). Identity is the token's `sub` claim; the email is
   unverified for identity purposes (an unverified email is logged, never trusted).
3. The server issues a short-lived **access JWT** (`{ sub, googleSub, type: 'access' }`,
   explicit TTL) and a 256-bit random **refresh token**. Only the SHA-256 hash of the
   refresh token is stored, in a token family (`familyId`).
4. `POST /api/auth/refresh` rotates: the presented token is consumed and a new pair is
   issued. **Reuse detection**: presenting an already-rotated token revokes the entire
   family (`AUTH_REFRESH_REUSED`) — the standard response to token theft.
5. `POST /api/auth/logout` revokes the presented token's family; it is idempotent.

Token hashes carry a unique index; `{ userId, familyId }` and expiry TTL indexes make
cleanup and revocation cheap.

## Workouts

### CRUD

Ownership-scoped: every query is filtered by the caller's Google `sub`, and another user's
workout is indistinguishable from a missing one (`404 WORKOUT_NOT_FOUND`). The stable
client identity is `clientId` (a UUID generated on the device); Mongo `_id` is only a
cursor tiebreaker. Documents carry a monotonically increasing `version`.

### Sync (`/api/sync/push`, `/api/sync/pull`)

Designed for offline-first clients:

- **Push** accepts a batch of mutations and always returns HTTP 200 with per-item results:
  `applied` / `conflict` / `duplicate` / `unsupported` / `error`. Conflicts carry the full
  current `serverDoc` so the client can merge.
- **Conflict rules** (compare-and-set on `version`):
  - Server doc exists and `mutation.version != mutation.baseVersion` → conflict.
  - No server doc and `baseVersion > 1` → conflict (the client's history forked).
  - No server doc and `baseVersion ∈ {0, 1}` → create (covers create-then-edit-before-sync).
- **Idempotency**: each push batch carries an `idempotencyKey`. The server claims the key
  with an atomic insert-first (`claimed` / `duplicate`); replays return the stored outcome
  without re-applying. Idempotency records never expire (a TTL would silently reopen the
  replay window).
- **Pull** returns a single `items` list of live docs **and tombstones** (`deleted: true`)
  ordered by `(updatedAt, _id)`. Cursors are base64url-encoded `{ t, id }` points;
  an invalid cursor is `400 SYNC_BAD_CURSOR`. Default page 200, cap 500; an empty page
  returns the same cursor back.
- **Tombstones**: deletes are soft (`deletedAt` + version bump) and hard-purged after
  `TOMBSTONE_RETENTION_DAYS` (default 90) by a service-called purge (no scheduler in v1 —
  call `purgeTombstones` from your own cron).

## Social

Follows are immediate (no request/pending state). Follow/unfollow are idempotent;
self-follow is `400 SOCIAL_SELF_FOLLOW`; following a nonexistent user is
`404 SOCIAL_USER_NOT_FOUND`.

Posts: 1–2000 characters, up to 4 HTTPS media URLs. Delete is author-only and soft; any
other caller (or a deleted/missing post) gets `404 SOCIAL_POST_NOT_FOUND` with no
information leak. The feed shows live posts from followed users, newest first, capped at
50 per request with exact `hasMore` (limit+1 probing).

## Payments

No Stripe. Two premium sources, both flowing through the shared `EntitlementService`
(`none` → `active` → `expired`; sources `revenuecat` / `web` / `manual`):

### RevenueCat — `POST /api/webhooks/revenuecat`

- Auth: `Authorization: Bearer ${REVENUECAT_WEBHOOK_SECRET}`, compared with
  `crypto.timingSafeEqual`. Anything else → `401 PAYMENTS_UNAUTHORIZED`.
- Event mapping (`app_user_id` **must be the user's Google `sub`** — set it in
  `Purchases.configure(appUserID: googleSub)` on the client):
  - `INITIAL_PURCHASE` / `RENEWAL` → grant (source `revenuecat`, expiry from the event)
  - `EXPIRATION` → expire
  - `CANCELLATION` → **kept active** (the store honors the paid period to its end)
  - `BILLING_ISSUE` → kept active, logged
  - `TRANSFER` / unknown → logged, ignored
- Only acts when the configured premium entitlement (`REVENUECAT_PREMIUM_ENTITLEMENT`,
  default `premium`) is in the event's `entitlement_ids` (if that field is present).
- Always returns 200 after auth — even when processing throws — to avoid RevenueCat
  retry storms. Every event is stored raw for audit with a unique `eventId`; replays
  return `200 { status: 'duplicate' }` without re-applying.
- Full contract: [`src/payments/WEBHOOK_CONTRACTS.md`](src/payments/WEBHOOK_CONTRACTS.md).

### Website checkout — `POST /api/webhooks/web-checkout`

- Auth: `X-Signature` = lowercase hex HMAC-SHA256 of the **raw request body** keyed with
  `WEB_CHECKOUT_SECRET`, timing-safe compared. Invalid → `401 PAYMENTS_BAD_SIGNATURE`.
- Strict DTO: `{ googleSub, plan: 'monthly'|'yearly'|'lifetime', expiresAt: ISO|null, eventId: uuid }`.
- Grant-only: `{ status: 'ok' | 'duplicate' }`. Processing failures return a coded 500 so
  the (self-controlled) checkout server can retry. Web refunds/cancellations are not in
  the v1 DTO — they need a contract extension or manual handling.

## AI coach

Single model route: the self-hosted LiteLLM alias **`coach-primary`** (see
`config/litellm.yaml`). There is no user-facing provider picker.

### Pipeline (`POST /ai/conversations/:id/messages`)

1. Load conversation with ownership check (`404 AI_CONVERSATION_NOT_FOUND`).
2. Persist the user turn first (append-only — history is never edited in place).
3. **Topic guard**: off-topic or self-harm input gets a fixed safe reply with no model
   call and no quota charge.
4. **Moderation**: when `MODERATION_ENABLED=true`, input is screened via the LiteLLM
   `/v1/moderations` endpoint and any endpoint failure fails closed (`503
   AI_MODERATION_UNAVAILABLE`) — never silently passed through. Off by default.
5. **Quota**: atomic `findOneAndUpdate` reserve on a daily counter
   (`429 AI_QUOTA_EXCEEDED` with `{ limit, resetsAt }`); free and premium limits differ.
6. Prompt assembly: server-owned system prompt + selected **skill blocks** + trusted
   memory facts + last 20 history turns, with the fresh user turn wrapped in
   `<user_message>` delimiters.
7. Model call via `LiteLLMClient` (timeout via `AbortController`, exponential backoff on
   429/5xx only — never on 4xx).
8. **Output check**: prompt-leakage, PED-dosage, self-harm, and email/phone PII patterns;
   blocking findings replace the tail with a safe completion.
9. Persist the assistant turn with token usage; log per-message usage (cost comes from
   the `x-litellm-cost` response header when present, never invented).
10. Fire-and-forget memory extraction (failures only logged).

### Streaming

`POST …/messages/stream` emits SSE events `start` / `token` / `done` / `error` with
`X-Accel-Buffering: no`. Streaming is premium-gated when `AI_STREAM_PREMIUM_ONLY=true`
(`402 AI_STREAM_PREMIUM_ONLY`). Client disconnect aborts the upstream LiteLLM request.

### Coach skills (`src/ai/skills/`)

Skills are named blocks of trusted coaching instructions injected into the prompt when
relevant — this is how the coach gets its domain expertise. Selection is deterministic:
a skill fires when the topic-guard verdict carries one of its `matchGroups`, or when one
of its `matchTerms` regexes hits the message text (so `ambiguous` verdicts still get
relevant skills). Injection is budget-capped (`AI_MAX_SKILLS=3` conditional skills,
`AI_MAX_SKILL_CHARS=6000` chars; lowest priority cut first, cuts logged). Selected
skills render as one delimited `<coach_skills>` system message after the base system
prompt, and their names are recorded on the `ai_usage` document for observability.

Shipped skills: `program-design`, `progression`, `form-check`, `nutrition`,
`recovery`, `conditioning`. To add one: write the skill file under
`src/ai/skills/skills/`, import and append it in `src/ai/skills/skill-definitions.ts`
(the explicit list — nothing is auto-discovered). Skill content is server-owned and
never influenced by user input.

### Memory (Mem0)

`Mem0MemoryService` is a real REST integration against `MEM0_URL` with
`MEM0_TIMEOUT_MS`; it degrades gracefully (warn + empty / no-op) on failure or when
`MEM0_API_KEY` is unset. A relevance gate (non-streaming LLM call, temp 0, JSON fact
list) decides whether an exchange contains durable facts worth storing.

## Environment variables

All required in production; validated at startup with clear errors.

| Variable | Required | Default | Purpose |
| -------- | -------- | ------- | ------- |
| `NODE_ENV` | no | `development` | `production` enables strict behaviors |
| `PORT` | no | `3000` | HTTP port |
| `DB_PROVIDER` | no | `mongodb` | `mongodb` or `postgres` — the persistence backend for this deployment |
| `MONGODB_URI` | **yes, when `DB_PROVIDER=mongodb`** | — | MongoDB connection string |
| `DATABASE_URL` | **yes, when `DB_PROVIDER=postgres`** | — | PostgreSQL connection string, e.g. `postgresql://alcedo:alcedo@localhost:5432/alcedo` |
| `JWT_ACCESS_SECRET` | **yes** | — | ≥32 chars; signs access JWTs |
| `JWT_ACCESS_TTL_SECONDS` | no | `900` | Access token lifetime |
| `JWT_REFRESH_TTL_DAYS` | no | `30` | Refresh token lifetime |
| `GOOGLE_CLIENT_ID` | **yes** | — | Primary allowed Google OAuth audience |
| `GOOGLE_EXTRA_AUDIENCES` | no | — | Comma-separated extra allowed audiences (Android/iOS client IDs) |
| `THROTTLE_TTL_SECONDS` | no | `60` | Rate-limit window |
| `THROTTLE_LIMIT` | no | `120` | Max requests per window per IP |
| `CORS_ORIGINS` | no | — | Comma-separated allowed origins (read raw, not validated) |
| `LITELLM_URL` | no | `http://litellm:4000` | Self-hosted LiteLLM proxy |
| `LITELLM_API_KEY` | no | — | LiteLLM proxy key |
| `LITELLM_MODEL_ALIAS` | no | `coach-primary` | Model alias to call |
| `LITELLM_TIMEOUT_MS` | no | `60000` | Per-request LLM timeout |
| `AI_STREAM_PREMIUM_ONLY` | no | `false` | Gate streaming behind premium |
| `AI_FREE_DAILY_QUOTA` | no | `20` | Free daily coach turns |
| `AI_PREMIUM_DAILY_QUOTA` | no | `200` | Premium daily coach turns |
| `MODERATION_ENABLED` | no | `false` | Screen input via LiteLLM moderations (fail-closed 503) |
| `MEM0_URL` | no | `https://api.mem0.ai/v1` | Mem0 REST base URL |
| `MEM0_API_KEY` | no | — | Mem0 key (memory disabled without it) |
| `MEM0_TIMEOUT_MS` | no | `10000` | Mem0 request timeout |
| `REVENUECAT_WEBHOOK_SECRET` | **yes** | — | ≥16 chars; Bearer auth for RC webhook |
| `REVENUECAT_PREMIUM_ENTITLEMENT` | no | `premium` | Entitlement id that grants premium |
| `WEB_CHECKOUT_SECRET` | **yes** | — | ≥16 chars; HMAC key for web-checkout webhook |
| `TOMBSTONE_RETENTION_DAYS` | no | `90` | Hard-purge age for soft-deleted docs |

Startup probes the active database with six exponential-backoff attempts before
listening; the process exits loudly if it cannot connect.

## Database providers

One provider is active per deployment — never dual-write, never mixed. The
twelve repository contracts in `src/*/repositories/*-repository.interface.ts`
are implemented twice: `mongo-*.repository.ts` (Mongoose) and
`prisma-*.repository.ts` (Prisma + PostgreSQL). `PersistenceModule` binds
exactly one implementation per token based on `DB_PROVIDER`.

Behavioral parity is enforced by contract tests in `test/parity/`, which run
the same suites against a real MongoDB (in-memory server) and a real
PostgreSQL:

```bash
npm run test:parity
```

PostgreSQL schema is managed with Prisma Migrate (`prisma/schema.prisma` →
`prisma/migrations/`). From a clean database:

```bash
# point DATABASE_URL at the target database, then:
npx prisma migrate deploy
```

The compose file runs both databases for local development (`mongo` on 27017,
`postgres` on 5432); pick one per backend instance via `DB_PROVIDER`.

## What is deliberately not in v1

- **Stripe** — rejected; RevenueCat + signed web checkout only.
- Microservices, Kafka, custom event sourcing, multi-region — a modular monolith is the
  whole architecture.
- Web-checkout refunds/cancellations (DTO is grant-only).
- A scheduler for tombstone purges — `purgeTombstones()` exists; wire your own cron.
- Model-controlled tools/function calling — the coach is chat-only.
- Premature queues or caches — backoff + idempotency cover the failure modes instead.

## Development

```bash
npm install
cp .env.example .env   # fill in secrets
npm run start:dev
npm run typecheck      # tsc --noEmit
npx jest               # unit suites
npm run test:parity    # repository parity: real MongoDB + real PostgreSQL
npm run lint           # oxlint, 0 warnings
npm run build
```

Docker: `docker-compose.yml` runs MongoDB and PostgreSQL for local development
(one provider active per backend instance via `DB_PROVIDER`).
