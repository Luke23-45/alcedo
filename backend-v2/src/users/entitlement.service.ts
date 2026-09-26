import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user-repository.interface';
import type { PremiumSource } from './schemas/user.schema';

export type EntitlementStatusValue = 'none' | 'active' | 'expired';
export type EntitlementSource = 'revenuecat' | 'web' | 'stripe' | 'manual';

export interface EntitlementStatus {
  status: EntitlementStatusValue;
  source: EntitlementSource | null;
  expiresAt: Date | null;
}

/**
 * Single owner of the user's premium entitlement state machine.
 * Persists through the UserRepository so it works identically on MongoDB and
 * PostgreSQL — the premium fields keep their historic names on both backends
 * so stored data and the billing pipeline keep working.
 */
@Injectable()
export class EntitlementService {
  constructor(private readonly users: UserRepository) {}

  async getStatus(googleSub: string): Promise<EntitlementStatus> {
    const user = await this.users.findByGoogleSub(googleSub);
    const premium = user?.premium;
    return {
      expiresAt: premium?.expiresAt ?? null,
      source: (premium?.source as EntitlementSource | undefined) ?? null,
      status: (premium?.status as EntitlementStatusValue | undefined) ?? 'none',
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
    await this.users.grantEntitlement(googleSub, source as PremiumSource, expiresAt);
  }

  /**
   * Expires premium, but only when the currently recorded source matches the
   * caller. A Stripe cancellation must never revoke a RevenueCat grant (or
   * vice versa) — each provider only revokes its own entitlements.
   */
  async expire(googleSub: string, source: EntitlementSource): Promise<void> {
    await this.users.expireEntitlement(googleSub, source as PremiumSource);
  }

  /** Links Stripe customer/subscription IDs to the user for the billing portal. */
  async linkStripeCustomer(
    googleSub: string,
    customerId: string | null,
    subscriptionId: string | null,
  ): Promise<void> {
    if (!customerId && !subscriptionId) return;
    await this.users.linkStripeCustomer(googleSub, { customerId, subscriptionId });
  }
}
