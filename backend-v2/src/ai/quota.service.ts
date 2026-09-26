import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiDailyUsageRepository } from './repositories/ai-daily-usage-repository.interface';

/** Next UTC midnight as an ISO string — when the daily quota resets. */
function nextUtcMidnightIso(): string {
  const d = new Date();
  d.setUTCHours(24, 0, 0, 0);
  return d.toISOString();
}

/**
 * Per-user daily AI quota. The counter lives in the daily-usage repository
 * and is incremented with a single atomic operation, so concurrent requests
 * each observe a distinct post-increment count and at most `limit` of them
 * pass.
 *
 * The caller passes `isPremium` (resolved once per turn from
 * EntitlementService) — this service never reimplements entitlement checks.
 * Reserve ONLY when the model is actually about to be called: blocked
 * off-topic turns and guard rejections must not consume quota.
 */
@Injectable()
export class QuotaService {
  constructor(
    private readonly config: ConfigService,
    private readonly dailyUsage: AiDailyUsageRepository,
  ) {}

  async checkAndReserve(googleSub: string, isPremium: boolean): Promise<void> {
    const limit = isPremium
      ? this.config.get<number>('AI_PREMIUM_DAILY_QUOTA', 200)
      : this.config.get<number>('AI_FREE_DAILY_QUOTA', 20);
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD, UTC
    const count = await this.dailyUsage.incrementAndGet(googleSub, date);
    if (count > limit) {
      throw new HttpException(
        {
          code: 'AI_QUOTA_EXCEEDED',
          details: { limit, resetsAt: nextUtcMidnightIso() },
          message: isPremium
            ? 'Daily AI limit reached. Your limit resets at midnight UTC.'
            : 'Daily AI limit reached. Upgrade to Premium for a higher limit.',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}
