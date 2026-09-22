import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Per-message AI usage log: token counts and cost for every model call.
 * costUsd comes from the upstream `x-litellm-cost` response header when the
 * proxy reports it, else null — it is never invented.
 */
@Schema({ collection: 'ai_usage', timestamps: true })
export class AiUsage {
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  conversationId!: string;

  /** The assistant message this usage belongs to (uuid). */
  @Prop({ required: true })
  messageId!: string;

  @Prop({ type: Number, required: false })
  promptTokens?: number;

  @Prop({ type: Number, required: false })
  completionTokens?: number;

  @Prop({ type: Number, required: false, default: null })
  costUsd?: number | null;

  /** Skill names injected into the prompt for this turn (observability). */
  @Prop({ type: [String], required: false, default: undefined })
  skillNames?: string[];

  /** Set by mongoose timestamps; declared for typed access. */
  createdAt!: Date;
  updatedAt!: Date;
}

export type AiUsageDocument = HydratedDocument<AiUsage>;
export const AiUsageSchema = SchemaFactory.createForClass(AiUsage);
AiUsageSchema.index({ userId: 1, createdAt: -1 });
