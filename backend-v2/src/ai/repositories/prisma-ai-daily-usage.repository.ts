import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AiDailyUsageRepository } from './ai-daily-usage-repository.interface';

@Injectable()
export class PrismaAiDailyUsageRepository extends AiDailyUsageRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async incrementAndGet(userId: string, date: string): Promise<number> {
    // Single-statement INSERT ... ON CONFLICT DO UPDATE — concurrent callers
    // each observe a distinct post-increment count, exactly like the Mongo
    // findOneAndUpdate upsert.
    const row = await this.prisma.aiDailyUsage.upsert({
      create: { count: 1, date, userId },
      update: { count: { increment: 1 } },
      where: { userId_date: { date, userId } },
    });
    return row.count;
  }

  async purgeBefore(cutoff: Date): Promise<number> {
    const { count } = await this.prisma.aiDailyUsage.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });
    return count;
  }
}
