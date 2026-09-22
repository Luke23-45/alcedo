import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PremiumStatus = 'none' | 'active' | 'expired';
export type PremiumSource = 'revenuecat' | 'web' | 'stripe' | 'manual';

@Schema({ _id: false })
export class PremiumEntitlement {
  @Prop({ enum: ['none', 'active', 'expired'], default: 'none' })
  status!: PremiumStatus;

  @Prop({ enum: ['revenuecat', 'web', 'stripe', 'manual'], required: false })
  source?: PremiumSource;

  @Prop({ required: false, type: Date })
  expiresAt?: Date | null;

  @Prop({ default: () => new Date() })
  updatedAt!: Date;
}

export const PremiumEntitlementSchema = SchemaFactory.createForClass(PremiumEntitlement);

@Schema({ timestamps: true })
export class User {
  /**
   * Stable Google identity. Users are keyed by the OIDC `sub` claim —
   * email addresses can change and be re-issued, `sub` cannot.
   */
  @Prop({ required: true, unique: true, index: true })
  googleSub!: string;

  @Prop({ required: false })
  email?: string;

  @Prop({ required: false })
  name?: string;

  @Prop({ required: false })
  picture?: string;

  @Prop({ enum: ['metric', 'imperial'], default: 'metric' })
  units!: 'metric' | 'imperial';

  /**
   * Premium entitlement state. Named `premium` (not `entitlement`) to stay
   * compatible with stored documents and the billing pipeline.
   */
  @Prop({ type: PremiumEntitlementSchema, default: () => ({}) })
  premium!: PremiumEntitlement;

  /** Stripe customer ID, set on first checkout. Used for the billing portal. */
  @Prop({ required: false })
  stripeCustomerId?: string;

  /** Active Stripe subscription ID, if any. */
  @Prop({ required: false })
  stripeSubscriptionId?: string;

  /** Admin flag. Bootstrapped from ADMIN_EMAILS on login; manageable via /admin. */
  @Prop({ default: false })
  isAdmin!: boolean;

  /** Set by mongoose timestamps; declared for typed access. */
  createdAt!: Date;
  updatedAt!: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
