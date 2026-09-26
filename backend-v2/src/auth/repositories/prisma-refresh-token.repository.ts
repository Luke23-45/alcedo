import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateRefreshTokenInput,
  RefreshTokenRecord,
  RefreshTokenRepository,
} from './refresh-token-repository.interface';

type RefreshTokenRow = Prisma.RefreshTokenGetPayload<object>;

function toRecord(row: RefreshTokenRow): RefreshTokenRecord {
  return {
    createdAt: row.issuedAt,
    expiresAt: row.expiresAt,
    familyId: row.familyId,
    googleSub: row.googleSub,
    replacedByHash: row.replacedByHash ?? undefined,
    revokedAt: row.revokedAt ?? undefined,
    tokenHash: row.tokenHash,
  };
}

/** Matches records that have never been revoked (Mongo `{ $exists: false }`). */
const LIVE: Prisma.RefreshTokenWhereInput = { revokedAt: null };

@Injectable()
export class PrismaRefreshTokenRepository extends RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByHash(tokenHash: string): Promise<RefreshTokenRecord | null> {
    const row = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });
    return row ? toRecord(row) : null;
  }

  async create(input: CreateRefreshTokenInput): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        expiresAt: input.expiresAt,
        familyId: input.familyId,
        googleSub: input.googleSub,
        tokenHash: input.tokenHash,
      },
    });
  }

  async claimRotation(
    tokenHash: string,
    now: Date,
    replacementHash: string,
  ): Promise<boolean> {
    // One atomic UPDATE: only a live, unexpired token can be claimed, so two
    // concurrent refreshes with the same token cannot both succeed.
    const { count } = await this.prisma.refreshToken.updateMany({
      data: { replacedByHash: replacementHash, revokedAt: now },
      where: { ...LIVE, expiresAt: { gt: now }, tokenHash },
    });
    return count === 1;
  }

  async revokeByHash(tokenHash: string, now: Date): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      data: { revokedAt: now },
      where: { ...LIVE, tokenHash },
    });
  }

  async revokeFamily(familyId: string, now: Date): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      data: { revokedAt: now },
      where: { ...LIVE, familyId },
    });
  }

  async revokeAllForUser(googleSub: string, now: Date): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      data: { revokedAt: now },
      where: { ...LIVE, googleSub },
    });
  }

  async purgeExpired(now: Date): Promise<number> {
    const { count } = await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    return count;
  }
}
