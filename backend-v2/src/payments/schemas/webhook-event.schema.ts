import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Audit + idempotency record for every received provider webhook.
 *
 * The unique `eventId` index is the dedup mechanism: handlers insert before
 * processing, so a provider redelivery (or a racing duplicate) fails the
 * insert with a duplicate-key error and the event is acked as a duplicate
 * instead of being applied twice. These records are never expired — deleting
 * one would re-open the dedup window and let an old event re-apply.
 *
 * `status` separates "seen" from "applied": a transient processing failure
 * releases the claim (deletes the record) so the provider's retry can
 * re-claim and re-process instead of being swallowed as a duplicate.
 */
@Schema({ timestamps: true })
export class WebhookEvent {
  @Prop({ required: true, unique: true, index: true })
  eventId!: string;

  @Prop({ required: true, enum: ['revenuecat', 'web', 'stripe'] })
  provider!: 'revenuecat' | 'web' | 'stripe';

  /** Provider-specific event type, e.g. RENEWAL (RevenueCat) or purchase (web). */
  @Prop({ required: true })
  type!: string;

  /** Google `sub` the event was applied to. */
  @Prop({ required: true, index: true })
  googleSub!: string;

  @Prop({ required: true })
  receivedAt!: Date;

  /** 'claimed' while processing; 'processed' once applied. */
  @Prop({ required: true, enum: ['claimed', 'processed'], default: 'claimed', index: true })
  status!: 'claimed' | 'processed';

  /** Raw event payload, kept for audit. */
  @Prop({ type: Object, required: true })
  payload!: Record<string, unknown>;
}

export type WebhookEventDocument = WebhookEvent & Document;
export const WebhookEventSchema = SchemaFactory.createForClass(WebhookEvent);
