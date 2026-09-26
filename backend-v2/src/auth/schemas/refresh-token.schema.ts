import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Server-side refresh token record. Only the sha256 hash is stored — never the token.
 * Rotation links records through `tokenFamilyId` so reuse of an already-rotated
 * token can be treated as theft and revoke the whole family.
 */
@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ required: true, unique: true, index: true })
  tokenHash!: string;

  /** The user's Google `sub`. */
  @Prop({ required: true, index: true })
  googleSub!: string;

  /** Links a rotated chain; every rotation reuses the family's id. */
  @Prop({ required: true, index: true })
  tokenFamilyId!: string;

  @Prop({ required: true })
  expiresAt!: Date;

  @Prop({ required: false })
  revokedAt?: Date;

  @Prop({ required: false })
  replacedByHash?: string;

  /** Managed by `timestamps: true`; declared for typed access. */
  createdAt!: Date;
}

export type RefreshTokenDocument = RefreshToken & Document;
export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
// Expired tokens are reaped automatically; revoked ones are kept briefly for audit.
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
