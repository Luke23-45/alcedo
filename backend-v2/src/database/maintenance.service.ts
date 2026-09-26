import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RefreshTokenRepository } from '../auth/repositories/refresh-token-repository.interface';
import { AiDailyUsageRepository } from '../ai/repositories/ai-daily-usage-repository.interface';
import { SyncIdempotencyStore } from '../workouts/repositories/workout-repository.interface';

/**
 * Replaces MongoDB's TTL indexes for the PostgreSQL backend and makes expiry
 * explicit and observable for both backends.
 *
 * MongoDB reaps expired refresh tokens, sync idempotency records, and daily
 * AI quota rows via TTL indexes. PostgreSQL has no TTL indexes, so this
 * scheduled job purges them daily on whichever backend is active — the
 * repositories are already provider-selected, so the same code runs against
 * both. Retention windows mirror the old TTL values exactly:
 * refresh tokens at their own expiry, idempotency records after 30 days, and
 * daily quota rows after 3 days.
 */
@Injectable()
export class MaintenanceService {
  private readonly logger = new Logger(MaintenanceService.name);

  constructor(
    private readonly refreshTokens: RefreshTokenRepository,
    private readonly idempotency: SyncIdempotencyStore,
    private readonly dailyUsage: AiDailyUsageRepository,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async purgeExpired(): Promise<void> {
    const now = new Date();
    const [tokens, idempotency, quota] = await Promise.all([
      this.refreshTokens.purgeExpired(now),
      this.idempotency.purgeExpired(
        new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      ),
      this.dailyUsage.purgeBefore(
        new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      ),
    ]);
    this.logger.log(
      `Purged expired rows: refreshTokens=${tokens} idempotency=${idempotency} dailyQuota=${quota}`,
    );
  }
}
