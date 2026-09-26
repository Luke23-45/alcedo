// Must be the first import: loads .env files and validates the environment
// (including DB_PROVIDER) before any module decorator is evaluated.
import './config/bootstrap-env';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AdminModule } from './admin/admin.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { AppConfigModule } from './config/app-config.module';
import { PersistenceModule } from './database/persistence.module';
import { FeaturesModule } from './features/features.module';
import { HealthModule } from './health/health.module';
import { PaymentsModule } from './payments/payments.module';
import { SiteConfigModule } from './site-config/site-config.module';
import { SocialModule } from './social/social.module';
import { UsersModule } from './users/users.module';
import { WorkoutsModule } from './workouts/workouts.module';

@Module({
  imports: [
    AppConfigModule,
    // Global defaults from validated env; stricter limits are applied
    // per-endpoint (AI). Webhook routes opt out with @SkipThrottle.
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          limit: config.get<number>('THROTTLE_LIMIT', 120),
          ttl: config.get<number>('THROTTLE_TTL_SECONDS', 60) * 1000,
        },
      ],
    }),
    // Owns every repository binding and selects the MongoDB or PostgreSQL
    // implementation per DB_PROVIDER. Replaces the old DatabaseModule import.
    PersistenceModule.forRoot(),
    CommonModule,
    HealthModule,
    FeaturesModule,
    AuthModule,
    UsersModule,
    WorkoutsModule,
    SocialModule,
    PaymentsModule,
    SiteConfigModule,
    AdminModule,
    AiModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
