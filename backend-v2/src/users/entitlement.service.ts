import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

export type EntitlementStatusValue = 'none' | 'active' | 'expired';
export type EntitlementSource = 'revenuecat' | 'web' | 'stripe' | 'manual';

export interface EntitlementStatus {
  status: EntitlementStatusValue;
  source: EntitlementSource | null;
  expiresAt: Date | null;
}

/**
 * Single owner of the user's premium entitlement state machine.
 * Persisted in the `premium` subdocument on the user record (kept under its
 * historic field name so stored documents and the billing pipeline keep working).
 */
@Injectable()
export class EntitlementService {
  constructor(@InjectModel(User.name) private readonly model: Model<UserDocument>) {}

  async getStatus(googleSub: string): Promise<EntitlementStatus> {
    const user = await this.model.findOne({ googleSub }).select('premium').lean().exec();
    const premium = user?.premium;
    return {
      expiresAt: premium?.expiresAt ?? null,
      source: premium?.source ?? null,
      status: premium?.status ?? 'none',
    };
  }

  /** True iff status is 'active' and the entitlement hasn't lapsed. */
  async isPremiumActive(googleSub: string): Promise<boolean> {
    const { expiresAt, status } = await this.getStatus(googleSub);
    if (status !== 'active') return false;
    return !expiresAt || expiresAt.getTime() > Date.now();
  }

  /** Sets the entitlement to 'active'; creates the user document if missing. */
  async grant(
    googleSub: string,
    source: EntitlementSource,
    expiresAt: Date | null,
  ): Promise<void> {
    await this.model
      .findOneAndUpdate(
        { googleSub },
        {
          $set: {
            premium: { expiresAt, source, status: 'active', updatedAt: new Date() },
          },
        },
        { new: true, setDefaultsOnInsert: true, upsert: true },
      )
      .exec();
  }

  /**
   * Sets the entitlement to 'expired'. The source is kept (it records which
   * pipeline last touched the entitlement — audit trail) and expiresAt is
   * left untouched; only status and updatedAt change.
   */
  /**
   * Expires premium, but only when the currently recorded source matches the
   * caller. A Stripe cancellation must never revoke a RevenueCat grant (or
   * vice versa) — each provider only revokes its own entitlements.
   */
  async expire(googleSub: string, source: EntitlementSource): Promise<void> {
    await this.model
      .findOneAndUpdate(
        { googleSub, 'premium.source': source, 'premium.status': 'active' },
        {
          $set: {
            'premium.status': 'expired',
            'premium.updatedAt': new Date(),
          },
        },
        { new: true },
      )
      .exec();
  }

  /** Links Stripe customer/subscription IDs to the user for the billing portal. */
  async linkStripeCustomer(
    googleSub: string,
    customerId: string | null,
    subscriptionId: string | null,
  ): Promise<void> {
    const set: Record<string, string> = {};
    if (customerId) set['stripeCustomerId'] = customerId;
    if (subscriptionId) set['stripeSubscriptionId'] = subscriptionId;
    if (Object.keys(set).length === 0) return;
    await this.model.findOneAndUpdate({ googleSub }, { $set: set }, { new: true }).exec();
  }
}
