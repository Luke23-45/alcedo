import { Injectable } from '@nestjs/common';
import { Prisma, User as PrismaUser } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateUserInput,
  UpdateEntitlementInput,
  UpdateProfileInput,
  UserRecord,
  UserRepository,
} from './user-repository.interface';
import type { PremiumSource, PremiumStatus } from '../schemas/user.schema';

function toRecord(row: PrismaUser): UserRecord {
  return {
    createdAt: row.createdAt,
    email: row.email ?? undefined,
    googleSub: row.googleSub,
    id: row.id,
    isAdmin: row.isAdmin,
    name: row.name ?? undefined,
    picture: row.picture ?? undefined,
    premium: {
      expiresAt: row.premiumExpiresAt,
      source: row.premiumSource as PremiumSource | undefined,
      status: row.premiumStatus as PremiumStatus,
      updatedAt: row.premiumUpdatedAt,
    },
    stripeCustomerId: row.stripeCustomerId ?? undefined,
    stripeSubscriptionId: row.stripeSubscriptionId ?? undefined,
    units: row.units as 'metric' | 'imperial',
    updatedAt: row.updatedAt,
  };
}

/**
 * PostgreSQL implementation of {@link UserRepository}, via Prisma.
 * Mirrors {@link MongoUserRepository} method-for-method; behavioral parity is
 * enforced by the contract tests in test/parity/.
 */
@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByGoogleSub(googleSub: string): Promise<UserRecord | null> {
    const row = await this.prisma.user.findUnique({ where: { googleSub } });
    return row ? toRecord(row) : null;
  }

  async findByStripeCustomerId(customerId: string): Promise<UserRecord | null> {
    const row = await this.prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });
    return row ? toRecord(row) : null;
  }

  async create(input: CreateUserInput): Promise<UserRecord> {
    const row = await this.prisma.user.create({
      data: {
        googleSub: input.googleSub,
        email: input.email,
        name: input.name,
        picture: input.picture,
      },
    });
    return toRecord(row);
  }

  async updateProfile(
    googleSub: string,
    patch: UpdateProfileInput,
  ): Promise<UserRecord | null> {
    try {
      const row = await this.prisma.user.update({
        where: { googleSub },
        data: { ...patch },
      });
      return toRecord(row);
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  }

  async updateEntitlement(
    googleSub: string,
    entitlement: UpdateEntitlementInput,
  ): Promise<UserRecord | null> {
    try {
      const row = await this.prisma.user.update({
        where: { googleSub },
        data: {
          premiumStatus: entitlement.status,
          premiumSource: entitlement.source,
          premiumExpiresAt: entitlement.expiresAt ?? null,
          premiumUpdatedAt: new Date(),
        },
      });
      return toRecord(row);
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  }

  async setAdmin(googleSub: string, isAdmin: boolean): Promise<UserRecord | null> {
    try {
      const row = await this.prisma.user.update({
        where: { googleSub },
        data: { isAdmin },
      });
      return toRecord(row);
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  }

  async linkStripeCustomer(
    googleSub: string,
    ids: { customerId?: string | null; subscriptionId?: string | null },
  ): Promise<UserRecord | null> {
    const data: { stripeCustomerId?: string; stripeSubscriptionId?: string } = {};
    if (ids.customerId) data.stripeCustomerId = ids.customerId;
    if (ids.subscriptionId) data.stripeSubscriptionId = ids.subscriptionId;
    try {
      if (Object.keys(data).length === 0) {
        const row = await this.prisma.user.findUnique({ where: { googleSub } });
        return row ? toRecord(row) : null;
      }
      const row = await this.prisma.user.update({ where: { googleSub }, data });
      return toRecord(row);
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  }

  async isAdmin(googleSub: string): Promise<boolean> {
    const row = await this.prisma.user.findUnique({
      where: { googleSub },
      select: { isAdmin: true },
    });
    return row?.isAdmin === true;
  }

  async listRecent(limit: number, offset = 0): Promise<UserRecord[]> {
    const rows = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      skip: Math.max(0, Math.floor(offset)),
      take: Math.max(0, Math.floor(limit)),
    });
    return rows.map(toRecord);
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  async countAdmins(): Promise<number> {
    return this.prisma.user.count({ where: { isAdmin: true } });
  }

  async grantEntitlement(
    googleSub: string,
    source: PremiumSource,
    expiresAt: Date | null,
  ): Promise<UserRecord> {
    const data = {
      premiumStatus: 'active',
      premiumSource: source,
      premiumExpiresAt: expiresAt,
      premiumUpdatedAt: new Date(),
    };
    const row = await this.prisma.user.upsert({
      where: { googleSub },
      create: { googleSub, ...data },
      update: data,
    });
    return toRecord(row);
  }

  async expireEntitlement(
    googleSub: string,
    source: PremiumSource,
  ): Promise<UserRecord | null> {
    // updateMany returns the affected count atomically — the source/status
    // guard and the write happen in one statement, like the Mongo
    // findOneAndUpdate with the same filter.
    const { count } = await this.prisma.user.updateMany({
      where: { googleSub, premiumSource: source, premiumStatus: 'active' },
      data: { premiumStatus: 'expired', premiumUpdatedAt: new Date() },
    });
    if (count === 0) return null;
    const row = await this.prisma.user.findUnique({ where: { googleSub } });
    return row ? toRecord(row) : null;
  }
}

/** Prisma's "record to update was not found" — the update* null contract. */
function isNotFound(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
  );
}
