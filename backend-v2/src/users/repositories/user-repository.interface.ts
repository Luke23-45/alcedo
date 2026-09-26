import type { PremiumSource, PremiumStatus } from '../schemas/user.schema';

export interface EntitlementRecord {
  status: PremiumStatus;
  source?: PremiumSource;
  expiresAt?: Date | null;
  updatedAt: Date;
}

export interface UserRecord {
  id: string;
  googleSub: string;
  email?: string;
  name?: string;
  picture?: string;
  units: 'metric' | 'imperial';
  premium: EntitlementRecord;
  isAdmin: boolean;
  /** Stripe linkage, present once the billing flow has created a customer. */
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  googleSub: string;
  email?: string;
  name?: string;
  picture?: string;
}

export interface UpdateProfileInput {
  name?: string;
  picture?: string;
  units?: 'metric' | 'imperial';
}

export interface UpdateEntitlementInput {
  status: PremiumStatus;
  source: PremiumSource;
  expiresAt?: Date;
}

/**
 * Repository contract. The abstract class doubles as the NestJS DI token —
 * implementations bind to it in the module, no custom container involved.
 *
 * Beyond the core profile/entitlement operations, the contract covers the
 * admin, billing, and entitlement operations that used to reach past it into
 * the driver (exists-checks for the admin guard, user listing/counts for the
 * admin console, Stripe customer linkage for billing). Both the MongoDB and
 * PostgreSQL implementations satisfy every method; parity is enforced by the
 * contract tests in test/parity/.
 */
export abstract class UserRepository {
  abstract findByGoogleSub(googleSub: string): Promise<UserRecord | null>;
  abstract findByStripeCustomerId(customerId: string): Promise<UserRecord | null>;
  abstract create(input: CreateUserInput): Promise<UserRecord>;
  abstract updateProfile(googleSub: string, patch: UpdateProfileInput): Promise<UserRecord | null>;
  abstract updateEntitlement(
    googleSub: string,
    entitlement: UpdateEntitlementInput,
  ): Promise<UserRecord | null>;
  abstract setAdmin(googleSub: string, isAdmin: boolean): Promise<UserRecord | null>;
  /**
   * Links Stripe customer/subscription IDs to the user (idempotent overwrite
   * of whichever IDs are provided). Used by the billing flow.
   */
  abstract linkStripeCustomer(
    googleSub: string,
    ids: { customerId?: string | null; subscriptionId?: string | null },
  ): Promise<UserRecord | null>;
  /** Cheap existence check for the admin guard — no document is returned. */
  abstract isAdmin(googleSub: string): Promise<boolean>;
  /** Newest users first, for the admin console. */
  abstract listRecent(limit: number, offset?: number): Promise<UserRecord[]>;
  abstract count(): Promise<number>;
  abstract countAdmins(): Promise<number>;
  /**
   * Grants premium, creating the user row if missing (login may not have
   * created one yet when a webhook arrives first). Always sets status
   * 'active' with a fresh updatedAt.
   */
  abstract grantEntitlement(
    googleSub: string,
    source: PremiumSource,
    expiresAt: Date | null,
  ): Promise<UserRecord>;
  /**
   * Expires premium, but only when the recorded source matches and the
   * status is currently 'active' — a provider must never revoke another
   * provider's grant. Returns null when nothing matched.
   */
  abstract expireEntitlement(
    googleSub: string,
    source: PremiumSource,
  ): Promise<UserRecord | null>;
}
