import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiDailyUsage, AiDailyUsageDocument } from '../schemas/ai-daily-usage.schema';
import { AiDailyUsageRepository } from './ai-daily-usage-repository.interface';

@Injectable()
export class MongoAiDailyUsageRepository extends AiDailyUsageRepository {
  constructor(
    @InjectModel(AiDailyUsage.name) private readonly model: Model<AiDailyUsageDocument>,
  ) {
    super();
  }

  async incrementAndGet(userId: string, date: string): Promise<number> {
    const doc = await this.model
      .findOneAndUpdate(
        { date, userId },
        { $inc: { count: 1 } },
        { new: true, setDefaultsOnInsert: true, upsert: true },
      )
      .exec();
    return doc?.count ?? 0;
  }

  async purgeBefore(cutoff: Date): Promise<number> {
    const res = await this.model.deleteMany({ createdAt: { $lt: cutoff } }).exec();
    return res.deletedCount ?? 0;
  }
}
