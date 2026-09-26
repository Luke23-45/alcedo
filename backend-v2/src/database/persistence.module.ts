import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database.module';
import { PrismaModule } from './prisma.module';
import { DatabaseHealthIndicator } from './database-health.indicator';
import { MaintenanceService } from './maintenance.service';
import type { DbProvider } from '../config/env.validation';

// Domain schemas (Mongo registration)
import { User, UserSchema } from '../users/schemas/user.schema';
import { RefreshToken, RefreshTokenSchema } from '../auth/schemas/refresh-token.schema';
import { WebhookEvent, WebhookEventSchema } from '../payments/schemas/webhook-event.schema';
import { SiteConfig, SiteConfigSchema } from '../site-config/site-config.schema';
import { Post, PostSchema } from '../social/schemas/post.schema';
import { Follow, FollowSchema } from '../social/schemas/follow.schema';
import { Workout, WorkoutSchema } from '../workouts/schemas/workout.schema';
import {
  SyncIdempotencyRecord,
  SyncIdempotencySchema,
} from '../workouts/schemas/sync-idempotency.schema';
import { Conversation, ConversationSchema } from '../ai/schemas/conversation.schema';
import { Message, MessageSchema } from '../ai/schemas/message.schema';
import { AiUsage, AiUsageSchema } from '../ai/schemas/ai-usage.schema';
import {
  AiDailyUsage,
  AiDailyUsageSchema,
} from '../ai/schemas/ai-daily-usage.schema';

// Repository tokens
import { UserRepository } from '../users/repositories/user-repository.interface';
import {
  SyncIdempotencyStore,
  WorkoutRepository,
} from '../workouts/repositories/workout-repository.interface';
import { PostRepository } from '../social/repositories/post-repository.interface';
import { FollowRepository } from '../social/repositories/follow-repository.interface';
import {
  AiUsageRepository,
  ConversationRepository,
  MessageRepository,
} from '../ai/repositories/ai-repository.interface';
import { RefreshTokenRepository } from '../auth/repositories/refresh-token-repository.interface';
import { WebhookEventRepository } from '../payments/repositories/webhook-event-repository.interface';
import { SiteConfigRepository } from '../site-config/repositories/site-config-repository.interface';
import { AiDailyUsageRepository } from '../ai/repositories/ai-daily-usage-repository.interface';

// Mongo implementations
import { MongoUserRepository } from '../users/repositories/mongo-user.repository';
import {
  MongoSyncIdempotencyStore,
  MongoWorkoutRepository,
} from '../workouts/repositories/mongo-workout.repository';
import { MongoPostRepository } from '../social/repositories/mongo-post.repository';
import { MongoFollowRepository } from '../social/repositories/mongo-follow.repository';
import {
  MongoAiUsageRepository,
  MongoConversationRepository,
  MongoMessageRepository,
} from '../ai/repositories/mongo-ai.repository';
import { MongoRefreshTokenRepository } from '../auth/repositories/mongo-refresh-token.repository';
import { MongoWebhookEventRepository } from '../payments/repositories/mongo-webhook-event.repository';
import { MongoSiteConfigRepository } from '../site-config/repositories/mongo-site-config.repository';
import { MongoAiDailyUsageRepository } from '../ai/repositories/mongo-ai-daily-usage.repository';

// Prisma (PostgreSQL) implementations
import { PrismaUserRepository } from '../users/repositories/prisma-user.repository';
import {
  PrismaSyncIdempotencyStore,
  PrismaWorkoutRepository,
} from '../workouts/repositories/prisma-workout.repository';
import { PrismaPostRepository } from '../social/repositories/prisma-post.repository';
import { PrismaFollowRepository } from '../social/repositories/prisma-follow.repository';
import {
  PrismaAiUsageRepository,
  PrismaConversationRepository,
  PrismaMessageRepository,
} from '../ai/repositories/prisma-ai.repository';
import { PrismaRefreshTokenRepository } from '../auth/repositories/prisma-refresh-token.repository';
import { PrismaWebhookEventRepository } from '../payments/repositories/prisma-webhook-event.repository';
import { PrismaSiteConfigRepository } from '../site-config/repositories/prisma-site-config.repository';
import { PrismaAiDailyUsageRepository } from '../ai/repositories/prisma-ai-daily-usage.repository';

/**
 * Every Mongoose model the application uses. Registered in one place so no
 * domain module needs its own `MongooseModule.forFeature` — the persistence
 * layer owns all driver wiring.
 */
const MONGO_SCHEMAS = [
  { name: User.name, schema: UserSchema },
  { name: RefreshToken.name, schema: RefreshTokenSchema },
  { name: WebhookEvent.name, schema: WebhookEventSchema },
  { name: SiteConfig.name, schema: SiteConfigSchema },
  { name: Post.name, schema: PostSchema },
  { name: Follow.name, schema: FollowSchema },
  { name: Workout.name, schema: WorkoutSchema },
  { name: SyncIdempotencyRecord.name, schema: SyncIdempotencySchema },
  { name: Conversation.name, schema: ConversationSchema },
  { name: Message.name, schema: MessageSchema },
  { name: AiUsage.name, schema: AiUsageSchema },
  { name: AiDailyUsage.name, schema: AiDailyUsageSchema },
];

/**
 * The single seam between the domain and the database. Each entry binds one
 * repository token to its MongoDB and PostgreSQL implementations; exactly one
 * is instantiated per deployment, chosen by DB_PROVIDER.
 *
 * Behavioral parity between the two implementations is enforced by the
 * repository contract tests (`test/parity/`), which run the same suite
 * against both backends.
 */
const REPOSITORY_BINDINGS = [
  { token: UserRepository, mongo: MongoUserRepository, prisma: PrismaUserRepository },
  { token: WorkoutRepository, mongo: MongoWorkoutRepository, prisma: PrismaWorkoutRepository },
  {
    token: SyncIdempotencyStore,
    mongo: MongoSyncIdempotencyStore,
    prisma: PrismaSyncIdempotencyStore,
  },
  { token: PostRepository, mongo: MongoPostRepository, prisma: PrismaPostRepository },
  { token: FollowRepository, mongo: MongoFollowRepository, prisma: PrismaFollowRepository },
  {
    token: ConversationRepository,
    mongo: MongoConversationRepository,
    prisma: PrismaConversationRepository,
  },
  { token: MessageRepository, mongo: MongoMessageRepository, prisma: PrismaMessageRepository },
  { token: AiUsageRepository, mongo: MongoAiUsageRepository, prisma: PrismaAiUsageRepository },
  {
    token: RefreshTokenRepository,
    mongo: MongoRefreshTokenRepository,
    prisma: PrismaRefreshTokenRepository,
  },
  {
    token: WebhookEventRepository,
    mongo: MongoWebhookEventRepository,
    prisma: PrismaWebhookEventRepository,
  },
  {
    token: SiteConfigRepository,
    mongo: MongoSiteConfigRepository,
    prisma: PrismaSiteConfigRepository,
  },
  {
    token: AiDailyUsageRepository,
    mongo: MongoAiDailyUsageRepository,
    prisma: PrismaAiDailyUsageRepository,
  },
];

/**
 * Reads the active database provider. Evaluated when `forRoot()` is called
 * during `AppModule` decoration — by then `bootstrap-env.ts` (imported first
 * in `app.module.ts`) has already loaded and validated the environment, so
 * this always sees the final value. Defaults to 'mongodb' when unset (e.g. in
 * unit tests that never boot the full module graph).
 */
export function activeDbProvider(): DbProvider {
  return process.env.DB_PROVIDER === 'postgres' ? 'postgres' : 'mongodb';
}

/**
 * Global persistence module. Owns every repository binding, every Mongoose
 * model registration, the Prisma client, the provider-aware health indicator,
 * and the expiry sweeper. Domain modules inject repository tokens directly —
 * they never touch Mongoose or Prisma themselves.
 */
@Module({})
export class PersistenceModule {
  static forRoot(): DynamicModule {
    const usePostgres = activeDbProvider() === 'postgres';

    const providers = REPOSITORY_BINDINGS.map(({ token, mongo, prisma }) => ({
      provide: token,
      useClass: usePostgres ? prisma : mongo,
    }));

    return {
      module: PersistenceModule,
      global: true,
      imports: [
        ScheduleModule.forRoot(),
        PrismaModule,
        // The Mongo connection and models exist only when mongodb is active.
        ...(usePostgres ? [] : [DatabaseModule, MongooseModule.forFeature(MONGO_SCHEMAS)]),
      ],
      providers: [...providers, DatabaseHealthIndicator, MaintenanceService],
      exports: [
        ...REPOSITORY_BINDINGS.map(({ token }) => token),
        DatabaseHealthIndicator,
      ],
    };
  }
}
