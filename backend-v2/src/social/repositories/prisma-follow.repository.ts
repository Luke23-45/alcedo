import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import {
  FollowCursor,
  FollowRecord,
  FollowRepository,
} from './follow-repository.interface';

type FollowRow = Prisma.FollowGetPayload<object>;

function toRecord(row: FollowRow): FollowRecord {
  return {
    createdAt: row.createdAt,
    followeeId: row.followeeId,
    followerId: row.followerId,
    id: row.id.toString(),
  };
}

function pageWhere(
  party: { followerId?: string; followeeId?: string },
  after: FollowCursor | null,
): Prisma.FollowWhereInput {
  const and: Prisma.FollowWhereInput[] = [{ ...party }];
  if (after) {
    and.push({
      OR: [
        { createdAt: { lt: after.t } },
        { createdAt: { equals: after.t }, id: { lt: BigInt(after.id) } },
      ],
    });
  }
  return { AND: and };
}

@Injectable()
export class PrismaFollowRepository extends FollowRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async follow(followerId: string, followeeId: string): Promise<void> {
    // The unique compound index makes this atomic and idempotent.
    await this.prisma.follow.upsert({
      create: { followerId, followeeId },
      update: {},
      where: { followerId_followeeId: { followerId, followeeId } },
    });
  }

  async unfollow(followerId: string, followeeId: string): Promise<void> {
    await this.prisma.follow.deleteMany({ where: { followerId, followeeId } });
  }

  async isFollowing(followerId: string, followeeId: string): Promise<boolean> {
    const row = await this.prisma.follow.findUnique({
      select: { id: true },
      where: { followerId_followeeId: { followerId, followeeId } },
    });
    return row !== null;
  }

  async followingIds(followerId: string): Promise<string[]> {
    const rows = await this.prisma.follow.findMany({
      select: { followeeId: true },
      where: { followerId },
    });
    return rows.map((r) => r.followeeId);
  }

  async listFollowers(
    followeeId: string,
    after: FollowCursor | null,
    limit: number,
  ): Promise<FollowRecord[]> {
    const rows = await this.prisma.follow.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit,
      where: pageWhere({ followeeId }, after),
    });
    return rows.map(toRecord);
  }

  async listFollowing(
    followerId: string,
    after: FollowCursor | null,
    limit: number,
  ): Promise<FollowRecord[]> {
    const rows = await this.prisma.follow.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit,
      where: pageWhere({ followerId }, after),
    });
    return rows.map(toRecord);
  }
}
