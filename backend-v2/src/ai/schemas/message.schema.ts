import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageRole = 'user' | 'assistant' | 'system';

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: String, required: true })
  _id!: string;

  @Prop({ required: true, index: true })
  conversationId!: string;

  @Prop({ required: true, index: true })
  userId!: string;

  @Prop({ required: true, enum: ['user', 'assistant', 'system'] })
  role!: MessageRole;

  @Prop({ required: true })
  content!: string;

  @Prop({ type: Object, required: false })
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    costUsd?: number;
    model?: string;
  };

  /** Set when guardrails intervened (blocked topic, redaction, …). */
  @Prop({ default: false })
  flagged?: boolean;

  /** Set by mongoose timestamps; declared for typed access. */
  createdAt!: Date;
  updatedAt!: Date;
}

export type MessageDocument = HydratedDocument<Message>;
export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.index({ conversationId: 1, createdAt: 1 });
