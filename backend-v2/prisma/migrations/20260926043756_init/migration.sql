-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "google_sub" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "picture" TEXT,
    "units" TEXT NOT NULL DEFAULT 'metric',
    "premium_status" TEXT NOT NULL DEFAULT 'none',
    "premium_source" TEXT,
    "premium_expires_at" TIMESTAMPTZ,
    "premium_updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "token_hash" TEXT NOT NULL,
    "google_sub" TEXT NOT NULL,
    "family_id" TEXT NOT NULL,
    "issued_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "revoked_at" TIMESTAMPTZ,
    "replaced_by_hash" TEXT,
    "user_agent" TEXT,
    "ip" TEXT,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("token_hash")
);

-- CreateTable
CREATE TABLE "webhook_events" (
    "event_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "google_sub" TEXT NOT NULL,
    "received_at" TIMESTAMPTZ NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'claimed',
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "site_config" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "is_secret" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "site_config_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "workouts" (
    "id" BIGSERIAL NOT NULL,
    "client_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMPTZ NOT NULL,
    "exercises" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMPTZ,
    "server_updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "workouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_idempotency" (
    "idempotency_key" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" TEXT,
    "entity_id" TEXT,
    "server_version" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "sync_idempotency_pkey" PRIMARY KEY ("idempotency_key")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" BIGSERIAL NOT NULL,
    "author_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "media_urls" TEXT[],
    "deleted_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "id" BIGSERIAL NOT NULL,
    "follower_id" TEXT NOT NULL,
    "followee_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT,
    "message_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "usage" JSONB,
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_usage" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "prompt_tokens" INTEGER,
    "completion_tokens" INTEGER,
    "cost_usd" DOUBLE PRECISION,
    "skill_names" TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ai_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_daily_usage" (
    "user_id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ai_daily_usage_pkey" PRIMARY KEY ("user_id","date")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_google_sub_key" ON "users"("google_sub");

-- CreateIndex
CREATE INDEX "refresh_tokens_google_sub_idx" ON "refresh_tokens"("google_sub");

-- CreateIndex
CREATE INDEX "refresh_tokens_family_id_idx" ON "refresh_tokens"("family_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "webhook_events_google_sub_idx" ON "webhook_events"("google_sub");

-- CreateIndex
CREATE INDEX "webhook_events_status_idx" ON "webhook_events"("status");

-- CreateIndex
CREATE INDEX "workouts_user_cursor_idx" ON "workouts"("user_id", "server_updated_at", "id");

-- CreateIndex
CREATE INDEX "workouts_user_deleted_idx" ON "workouts"("user_id", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "workouts_user_client_uidx" ON "workouts"("user_id", "client_id");

-- CreateIndex
CREATE INDEX "sync_idempotency_user_idx" ON "sync_idempotency"("user_id");

-- CreateIndex
CREATE INDEX "posts_author_cursor_idx" ON "posts"("author_id", "created_at" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "follows_followee_idx" ON "follows"("followee_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "follows_edge_uidx" ON "follows"("follower_id", "followee_id");

-- CreateIndex
CREATE INDEX "conversations_user_updated_idx" ON "conversations"("user_id", "updated_at" DESC);

-- CreateIndex
CREATE INDEX "messages_conversation_idx" ON "messages"("conversation_id", "created_at");

-- CreateIndex
CREATE INDEX "messages_user_idx" ON "messages"("user_id");

-- CreateIndex
CREATE INDEX "ai_usage_user_created_idx" ON "ai_usage"("user_id", "created_at" DESC);
