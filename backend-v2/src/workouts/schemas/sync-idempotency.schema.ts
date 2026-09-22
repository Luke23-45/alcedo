import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SyncItemOutcome = 'applied' | 'conflict' | 'duplicate';

/**
 * Remembered outcome of a processed mutation so client retries are safe.
 * Keys are client-generated UUIDs, unique globally; records expire via TTL
 * so the dedupe table never grows without bound.
 *
 * The claim insert carries only the key — the outcome fields are filled in
 * by `save()` after the mutation is processed. A record without an outcome
 * means the first attempt crashed mid-flight; the retry path then re-derives
 * the server version from the workout itself.
 */
@Schema({ timestamps: true })
export class SyncIdempotencyRecord {
  @Prop({ required: true, unique: true })
  idempotencyKey!: string;

  @Prop({ required: true })
  userId!: string;

  @Prop({ required: false })
  status?: SyncItemOutcome;

  /** The workout clientId this mutation acted on. */
  @Prop({ required: false })
  entityId?: string;

  /** Server version after (or during) processing. */
  @Prop({ required: false })
  serverVersion?: number;

  createdAt!: Date;
  updatedAt!: Date;
}

export type SyncIdempotencyDocument = HydratedDocument<SyncIdempotencyRecord>;
export const SyncIdempotencySchema = SchemaFactory.createForClass(SyncIdempotencyRecord);
// Dedupe state only matters while a client might retry: reap after 30 days.
// NOTE: MongoDB TTL indexes must be single-field — the TTL lives on
// `createdAt` alone, with a separate plain index for per-user lookups.
SyncIdempotencySchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
SyncIdempotencySchema.index({ userId: 1 });
