import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  UpdateEntitlementInput,
  UserRecord,
  UserRepository,
} from './repositories/user-repository.interface';

/** Profile fields collected from the verified Google ID token. */
export interface GoogleProfile {
  email?: string;
  name?: string;
  picture?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly users: UserRepository) {}

  findByGoogleSub(googleSub: string): Promise<UserRecord | null> {
    return this.users.findByGoogleSub(googleSub);
  }

  /** Find-or-create keyed by the Google `sub` claim. Email is metadata only. */
  async getOrCreate(googleSub: string, profile: GoogleProfile = {}): Promise<UserRecord> {
    const existing = await this.users.findByGoogleSub(googleSub);
    if (existing) return existing;
    return this.users.create({ googleSub, ...profile });
  }

  /** Own profile; throws a coded 404 when the account doesn't exist. */
  async getProfile(googleSub: string): Promise<UserRecord> {
    const user = await this.users.findByGoogleSub(googleSub);
    if (!user) {
      throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found.' });
    }
    return user;
  }

  updateProfile(googleSub: string, dto: UpdateProfileDto): Promise<UserRecord | null> {
    return this.users.updateProfile(googleSub, dto);
  }

  setEntitlement(googleSub: string, entitlement: UpdateEntitlementInput): Promise<UserRecord | null> {
    return this.users.updateEntitlement(googleSub, entitlement);
  }

  setAdmin(googleSub: string, isAdmin: boolean): Promise<UserRecord | null> {
    return this.users.setAdmin(googleSub, isAdmin);
  }

  /** Server-side premium check used by the AI module and billing status. */
  async isPremium(googleSub: string): Promise<boolean> {
    const user = await this.users.findByGoogleSub(googleSub);
    if (!user) return false;
    if (user.premium.status !== 'active') return false;
    if (user.premium.expiresAt && user.premium.expiresAt.getTime() <= Date.now()) return false;
    return true;
  }
}
