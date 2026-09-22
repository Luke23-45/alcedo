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
 */
export abstract class UserRepository {
  abstract findByGoogleSub(googleSub: string): Promise<UserRecord | null>;
  abstract create(input: CreateUserInput): Promise<UserRecord>;
  abstract updateProfile(googleSub: string, patch: UpdateProfileInput): Promise<UserRecord | null>;
  abstract updateEntitlement(
    googleSub: string,
    entitlement: UpdateEntitlementInput,
  ): Promise<UserRecord | null>;
  abstract setAdmin(googleSub: string, isAdmin: boolean): Promise<UserRecord | null>;
}
