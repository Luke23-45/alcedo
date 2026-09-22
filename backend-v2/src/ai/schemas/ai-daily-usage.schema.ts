import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/** Per-user, per-day AI call counter for quota enforcement. */
@Schema({ collection: 'ai_daily_usage', timestamps: true })
export class AiDailyUsage {
  @Prop({ required: true })
  userId!: string;

  /** YYYY-MM-DD in UTC. */
  @Prop({ required: true })
  date!: string;

  @Prop({ default: 0 })
  count!: number;

  /** Set by mongoose timestamps; declared for typed access. */
  createdAt!: Date;
  updatedAt!: Date;
}

export type AiDailyUsageDocument = HydratedDocument<AiDailyUsage>;
export const AiDailyUsageSchema = SchemaFactory.createForClass(AiDailyUsage);
AiDailyUsageSchema.index({ userId: 1, date: 1 }, { unique: true });
// Quota rows are only meaningful for the current day; let old ones expire.
AiDailyUsageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3 * 24 * 60 * 60 });
