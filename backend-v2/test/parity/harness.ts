/**
 * Shared harness for the repository parity contracts.
 *
 * Each contract (`*.contract.ts`) is a provider-agnostic jest suite written
 * against the repository interfaces. The two provider specs
 * (`mongodb.parity.spec.ts`, `postgres.parity.spec.ts`) build a
 * `RepositoryBundle` for their backend and run every contract against it.
 * A contract passes on both providers only when behavior is identical.
 */
import type { ConfigService } from '@nestjs/config';
import { createConnection, type Connection } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as fs from 'node:fs';
import { PrismaService } from '../../src/database/prisma.service';

// Schemas (Mongo)
import { User, UserSchema } from '../../src/users/schemas/user.schema';
import { Workout, WorkoutSchema } from '../../src/workouts/schemas/workout.schema';
import {
  SyncIdempotencyRecord,
  SyncIdempotencySchema,
} from '../../src/workouts/schemas/sync-idempotency.schema';
import { Post, PostSchema } from '../../src/social/schemas/post.schema';
import { Follow, FollowSchema } from '../../src/social/schemas/follow.schema';
import { Conversation, ConversationSchema } from '../../src/ai/schemas/conversation.schema';
import { Message, MessageSchema } from '../../src/ai/schemas/message.schema';
import { AiUsage, AiUsageSchema } from '../../src/ai/schemas/ai-usage.schema';
import {
  AiDailyUsage,
  AiDailyUsageSchema,
} from '../../src/ai/schemas/ai-daily-usage.schema';
import { RefreshToken, RefreshTokenSchema } from '../../src/auth/schemas/refresh-token.schema';
import { WebhookEvent, WebhookEventSchema } from '../../src/payments/schemas/webhook-event.schema';
import { SiteConfig } from '../../src/site-config/site-config.schema';
import { SiteConfigSchema } from '../../src/site-config/site-config.schema';

// Repository interfaces
import type { UserRepository } from '../../src/users/repositories/user-repository.interface';
import type {
  SyncIdempotencyStore,
  WorkoutRepository,
} from '../../src/workouts/repositories/workout-repository.interface';
import type { PostRepository } from '../../src/social/repositories/post-repository.interface';
import type { FollowRepository } from '../../src/social/repositories/follow-repository.interface';
import type {
  AiUsageRepository,
  ConversationRepository,
  MessageRepository,
} from '../../src/ai/repositories/ai-repository.interface';
import type { AiDailyUsageRepository } from '../../src/ai/repositories/ai-daily-usage-repository.interface';
import type { RefreshTokenRepository } from '../../src/auth/repositories/refresh-token-repository.interface';
import type { WebhookEventRepository } from '../../src/payments/repositories/webhook-event-repository.interface';
import type { SiteConfigRepository } from '../../src/site-config/repositories/site-config-repository.interface';

// Mongo implementations
import { MongoUserRepository } from '../../src/users/repositories/mongo-user.repository';
import {
  MongoSyncIdempotencyStore,
  MongoWorkoutRepository,
} from '../../src/workouts/repositories/mongo-workout.repository';
import { MongoPostRepository } from '../../src/social/repositories/mongo-post.repository';
import { MongoFollowRepository } from '../../src/social/repositories/mongo-follow.repository';
import {
  MongoAiUsageRepository,
  MongoConversationRepository,
  MongoMessageRepository,
} from '../../src/ai/repositories/mongo-ai.repository';
import { MongoAiDailyUsageRepository } from '../../src/ai/repositories/mongo-ai-daily-usage.repository';
import { MongoRefreshTokenRepository } from '../../src/auth/repositories/mongo-refresh-token.repository';
import { MongoWebhookEventRepository } from '../../src/payments/repositories/mongo-webhook-event.repository';
import { MongoSiteConfigRepository } from '../../src/site-config/repositories/mongo-site-config.repository';

// Prisma implementations
import { PrismaUserRepository } from '../../src/users/repositories/prisma-user.repository';
import {
  PrismaSyncIdempotencyStore,
  PrismaWorkoutRepository,
} from '../../src/workouts/repositories/prisma-workout.repository';
import { PrismaPostRepository } from '../../src/social/repositories/prisma-post.repository';
import { PrismaFollowRepository } from '../../src/social/repositories/prisma-follow.repository';
import {
  PrismaAiUsageRepository,
  PrismaConversationRepository,
  PrismaMessageRepository,
} from '../../src/ai/repositories/prisma-ai.repository';
import { PrismaAiDailyUsageRepository } from '../../src/ai/repositories/prisma-ai-daily-usage.repository';
import { PrismaRefreshTokenRepository } from '../../src/auth/repositories/prisma-refresh-token.repository';
import { PrismaWebhookEventRepository } from '../../src/payments/repositories/prisma-webhook-event.repository';
import { PrismaSiteConfigRepository } from '../../src/site-config/repositories/prisma-site-config.repository';

export interface RepositoryBundle {
  users: UserRepository;
  workouts: WorkoutRepository;
  idempotency: SyncIdempotencyStore;
  posts: PostRepository;
  follows: FollowRepository;
  conversations: ConversationRepository;
  messages: MessageRepository;
  aiUsage: AiUsageRepository;
  aiDailyUsage: AiDailyUsageRepository;
  refreshTokens: RefreshTokenRepository;
  webhookEvents: WebhookEventRepository;
  siteConfig: SiteConfigRepository;
  /** Removes every row/document. Runs before each contract test. */
  reset(): Promise<void>;
}

export interface ProviderContext {
  bundle: RepositoryBundle;
  close(): Promise<void>;
}

export async function mongoContext(): Promise<ProviderContext> {
  // This machine's /tmp is a small tmpfs; keep the ephemeral mongod data on
  // persistent disk instead (MongoDB 8 refuses index builds under 512MB free).
  const dbPath = `${process.env.HOME ?? '/home/hatch'}/.cache/mongo-mem-test`;
  await fs.promises.mkdir(dbPath, { recursive: true });
  const mongod = await MongoMemoryServer.create({ instance: { dbPath } });
  const conn: Connection = await createConnection(mongod.getUri()).asPromise();
  const model = (name: string, schema: unknown) =>
    conn.model(name, schema as Parameters<Connection['model']>[1]);

  const models = [
    model(User.name, UserSchema),
    model(Workout.name, WorkoutSchema),
    model(SyncIdempotencyRecord.name, SyncIdempotencySchema),
    model(Post.name, PostSchema),
    model(Follow.name, FollowSchema),
    model(Conversation.name, ConversationSchema),
    model(Message.name, MessageSchema),
    model(AiUsage.name, AiUsageSchema),
    model(AiDailyUsage.name, AiDailyUsageSchema),
    model(RefreshToken.name, RefreshTokenSchema),
    model(WebhookEvent.name, WebhookEventSchema),
    model(SiteConfig.name, SiteConfigSchema),
  ];
  // Build every index before the first operation — mirroring production,
  // where Mongoose finishes index builds at boot before serving traffic.
  // Without this, unique-claim inserts can race the background index build.
  await Promise.all(models.map((m) => m.init()));

  const bundle: RepositoryBundle = {
    users: new MongoUserRepository(models[0]),
    workouts: new MongoWorkoutRepository(models[1]),
    idempotency: new MongoSyncIdempotencyStore(models[2]),
    posts: new MongoPostRepository(models[3]),
    follows: new MongoFollowRepository(models[4]),
    conversations: new MongoConversationRepository(models[5]),
    messages: new MongoMessageRepository(models[6]),
    aiUsage: new MongoAiUsageRepository(models[7]),
    aiDailyUsage: new MongoAiDailyUsageRepository(models[8]),
    refreshTokens: new MongoRefreshTokenRepository(models[9]),
    webhookEvents: new MongoWebhookEventRepository(models[10]),
    siteConfig: new MongoSiteConfigRepository(models[11]),
    reset: async () => {
      // deleteMany (not dropDatabase) so the indexes built above survive
      // between tests.
      await Promise.all(models.map((m) => m.deleteMany({}).exec()));
    },
  };

  return {
    bundle,
    close: async () => {
      await conn.close();
      await mongod.stop();
    },
  };
}

const PG_TABLES = [
  'ai_daily_usage',
  'ai_usage',
  'conversations',
  'follows',
  'messages',
  'posts',
  'refresh_tokens',
  'site_config',
  'sync_idempotency',
  'users',
  'webhook_events',
  'workouts',
];

/** Minimal ConfigService stub: only what PrismaService reads. */
function pgConfig(): ConfigService {
  const values: Record<string, string> = {
    DB_PROVIDER: 'postgres',
    DATABASE_URL: 'postgresql://alcedo:alcedo@127.0.0.1:5432/alcedo_test',
  };
  return {
    get: (key: string, fallback?: string) => values[key] ?? fallback,
    getOrThrow: (key: string) => {
      const value = values[key];
      if (value === undefined) throw new Error(`Missing config: ${key}`);
      return value;
    },
  } as unknown as ConfigService;
}

export async function postgresContext(): Promise<ProviderContext> {
  const prisma = new PrismaService(pgConfig());
  await prisma.onModuleInit();

  const bundle: RepositoryBundle = {
    users: new PrismaUserRepository(prisma),
    workouts: new PrismaWorkoutRepository(prisma),
    idempotency: new PrismaSyncIdempotencyStore(prisma),
    posts: new PrismaPostRepository(prisma),
    follows: new PrismaFollowRepository(prisma),
    conversations: new PrismaConversationRepository(prisma),
    messages: new PrismaMessageRepository(prisma),
    aiUsage: new PrismaAiUsageRepository(prisma),
    aiDailyUsage: new PrismaAiDailyUsageRepository(prisma),
    refreshTokens: new PrismaRefreshTokenRepository(prisma),
    webhookEvents: new PrismaWebhookEventRepository(prisma),
    siteConfig: new PrismaSiteConfigRepository(prisma),
    reset: async () => {
      await prisma.$executeRawUnsafe(
        `TRUNCATE ${PG_TABLES.map((t) => `"${t}"`).join(', ')} RESTART IDENTITY CASCADE`,
      );
    },
  };

  return {
    bundle,
    close: async () => {
      await prisma.onModuleDestroy();
    },
  };
}
