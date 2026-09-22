import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiDailyUsage, AiDailyUsageDocument } from './schemas/ai-daily-usage.schema';

/** Next UTC midnight as an ISO string — when the daily quota resets. */
function nextUtcMidnightIso(): string {
  const d = new Date();
  d.setUTCHours(24, 0, 0, 0);
  return d.toISOString();
}

/**
 * Per-user daily AI quota. The counter lives in `ai_daily_usage` and is
 * incremented with a single atomic findOneAndUpdate (upsert + $inc), so
 * concurrent requests each observe a distinct post-increment count and at
 * most `limit` of them pass.
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
    @InjectModel(AiDailyUsage.name) private readonly daily: Model<AiDailyUsageDocument>,
  ) {}

  async checkAndReserve(googleSub: string, isPremium: boolean): Promise<void> {
    const limit = isPremium
      ? this.config.get<number>('AI_PREMIUM_DAILY_QUOTA', 200)
      : this.config.get<number>('AI_FREE_DAILY_QUOTA', 20);
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD, UTC
    const doc = await this.daily
      .findOneAndUpdate(
        { date, userId: googleSub },
        { $inc: { count: 1 } },
        { new: true, setDefaultsOnInsert: true, upsert: true },
      )
      .exec();
    if ((doc?.count ?? 0) > limit) {
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
