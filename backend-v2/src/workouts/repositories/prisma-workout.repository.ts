import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import type { WorkoutExercise } from '../schemas/workout.schema';
import { normalizeExercises } from './workout-record.util';
import {
  ApplyStatus,
  CursorPoint,
  IdempotencyOutcome,
  SyncIdempotencyStore,
  WorkoutData,
  WorkoutRecord,
  WorkoutRepository,
} from './workout-repository.interface';

type WorkoutRow = Prisma.WorkoutGetPayload<object>;

/**
 * Normalized exercises are plain JSON-compatible data; the cast bridges the
 * domain type to Prisma's JSON input type.
 */
function toJsonInput(value: WorkoutExercise[]): Prisma.InputJsonValue {
  return value as unknown as Prisma.InputJsonValue;
}

function toRecord(row: WorkoutRow): WorkoutRecord {
  return {
    clientId: row.clientId,
    date: row.date,
    deletedAt: row.deletedAt,
    exercises: normalizeExercises(row.exercises),
    id: row.id.toString(),
    name: row.name,
    serverUpdatedAt: row.serverUpdatedAt,
    userId: row.userId,
    version: row.version,
  };
}

/**
 * Maps sync data onto Prisma writes. `deleted` is tri-state on purpose:
 * true marks the tombstone, false clears it, undefined leaves it alone —
 * identical to the Mongo implementation.
 */
function buildData(data: WorkoutData): {
  date: Date;
  exercises: Prisma.InputJsonValue;
  name: string;
  serverUpdatedAt: Date;
  deletedAt?: Date | null;
} {
  const out: {
    date: Date;
    exercises: Prisma.InputJsonValue;
    name: string;
    serverUpdatedAt: Date;
    deletedAt?: Date | null;
  } = {
    date: new Date(data.date),
    exercises: toJsonInput(normalizeExercises(data.exercises)),
    name: data.name,
    serverUpdatedAt: new Date(),
  };
  if (data.deleted === true) out.deletedAt = new Date();
  else if (data.deleted === false) out.deletedAt = null;
  return out;
}

function changedSinceWhere(
  googleSub: string,
  since: CursorPoint | null,
): Prisma.WorkoutWhereInput {
  if (!since) return { userId: googleSub };
  const id = BigInt(since.id);
  return {
    AND: [
      { userId: googleSub },
      {
        OR: [
          { serverUpdatedAt: { gt: since.t } },
          { serverUpdatedAt: { equals: since.t }, id: { gt: id } },
        ],
      },
    ],
  };
}

function listWhere(
  googleSub: string,
  opts: { before: CursorPoint | null; includeDeleted: boolean },
): Prisma.WorkoutWhereInput {
  const and: Prisma.WorkoutWhereInput[] = [{ userId: googleSub }];
  if (!opts.includeDeleted) and.push({ deletedAt: null });
  if (opts.before) {
    const id = BigInt(opts.before.id);
    and.push({
      OR: [
        { serverUpdatedAt: { lt: opts.before.t } },
        { serverUpdatedAt: { equals: opts.before.t }, id: { lt: id } },
      ],
    });
  }
  return { AND: and };
}

@Injectable()
export class PrismaWorkoutRepository extends WorkoutRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByClientId(googleSub: string, clientId: string): Promise<WorkoutRecord | null> {
    const row = await this.prisma.workout.findUnique({
      where: { userId_clientId: { userId: googleSub, clientId } },
    });
    return row ? toRecord(row) : null;
  }

  async create(
    googleSub: string,
    clientId: string,
    data: WorkoutData,
    version: number,
  ): Promise<WorkoutRecord> {
    // The unique (userId, clientId) index makes concurrent creates race-safe:
    // the loser gets a P2002, which the caller turns into a conflict.
    const row = await this.prisma.workout.create({
      data: {
        ...buildData(data),
        clientId,
        userId: googleSub,
        version,
      },
    });
    return toRecord(row);
  }

  async applyIfVersionMatches(
    googleSub: string,
    clientId: string,
    baseVersion: number,
    data: WorkoutData,
  ): Promise<{ status: ApplyStatus; record: WorkoutRecord | null }> {
    // updateManyAndReturn issues a single UPDATE ... WHERE version = $ RETURNING
    // — the guard, the write, and the read are one atomic statement, exactly
    // like the Mongo findOneAndUpdate(new: true) guard. No apply-then-read
    // race: the returned row is precisely what this write produced.
    const rows = await this.prisma.workout.updateManyAndReturn({
      data: { ...buildData(data), version: baseVersion + 1 },
      where: { clientId, userId: googleSub, version: baseVersion },
    });
    if (rows.length === 0) {
      // Guard failed: either the version moved or the row is gone. The
      // caller re-reads to distinguish a real conflict from a missing row.
      return { record: null, status: 'conflict' };
    }
    return { record: toRecord(rows[0]), status: 'applied' };
  }

  async findChangedSince(
    googleSub: string,
    since: CursorPoint | null,
    limit: number,
  ): Promise<WorkoutRecord[]> {
    const rows = await this.prisma.workout.findMany({
      orderBy: [{ serverUpdatedAt: 'asc' }, { id: 'asc' }],
      take: limit,
      where: changedSinceWhere(googleSub, since),
    });
    return rows.map(toRecord);
  }

  async list(
    googleSub: string,
    opts: { before: CursorPoint | null; limit: number; includeDeleted: boolean },
  ): Promise<WorkoutRecord[]> {
    const rows = await this.prisma.workout.findMany({
      orderBy: [{ serverUpdatedAt: 'desc' }, { id: 'desc' }],
      take: opts.limit,
      where: listWhere(googleSub, opts),
    });
    return rows.map(toRecord);
  }

  async update(
    googleSub: string,
    clientId: string,
    data: Partial<WorkoutData>,
  ): Promise<WorkoutRecord | null> {
    const updateData: Prisma.WorkoutUpdateManyMutationInput = { serverUpdatedAt: new Date() };
    if (data.name !== undefined) updateData.name = data.name;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.exercises !== undefined) updateData.exercises = toJsonInput(normalizeExercises(data.exercises));
    const { count } = await this.prisma.workout.updateMany({
      data: { ...updateData, version: { increment: 1 } },
      where: { clientId, deletedAt: null, userId: googleSub },
    });
    if (count === 0) return null;
    const row = await this.prisma.workout.findUnique({
      where: { userId_clientId: { userId: googleSub, clientId } },
    });
    return row ? toRecord(row) : null;
  }

  async softDelete(googleSub: string, clientId: string): Promise<WorkoutRecord | null> {
    const now = new Date();
    const { count } = await this.prisma.workout.updateMany({
      data: { deletedAt: now, serverUpdatedAt: now, version: { increment: 1 } },
      where: { clientId, deletedAt: null, userId: googleSub },
    });
    if (count === 0) return null;
    const row = await this.prisma.workout.findUnique({
      where: { userId_clientId: { userId: googleSub, clientId } },
    });
    return row ? toRecord(row) : null;
  }

  async purgeTombstones(cutoff: Date): Promise<number> {
    const { count } = await this.prisma.workout.deleteMany({
      where: { AND: [{ deletedAt: { not: null } }, { deletedAt: { lt: cutoff } }] },
    });
    return count;
  }
}

@Injectable()
export class PrismaSyncIdempotencyStore extends SyncIdempotencyStore {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async claim(key: string, googleSub: string): Promise<boolean> {
    try {
      await this.prisma.syncIdempotencyRecord.create({
        data: { idempotencyKey: key, userId: googleSub },
      });
      return true;
    } catch (error) {
      // P2002 = the key was already claimed by a concurrent request or a
      // retry — the caller must return the stored outcome, never re-apply.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return false;
      }
      throw error;
    }
  }

  async find(key: string): Promise<IdempotencyOutcome | null> {
    const row = await this.prisma.syncIdempotencyRecord.findUnique({
      where: { idempotencyKey: key },
    });
    if (!row || !row.status || row.entityId === null || row.serverVersion === null) {
      return null;
    }
    return {
      entityId: row.entityId,
      serverVersion: row.serverVersion,
      status: row.status as IdempotencyOutcome['status'],
    };
  }

  async save(key: string, googleSub: string, outcome: IdempotencyOutcome): Promise<void> {
    await this.prisma.syncIdempotencyRecord.upsert({
      create: {
        entityId: outcome.entityId,
        idempotencyKey: key,
        serverVersion: outcome.serverVersion,
        status: outcome.status,
        userId: googleSub,
      },
      update: {
        entityId: outcome.entityId,
        serverVersion: outcome.serverVersion,
        status: outcome.status,
        userId: googleSub,
      },
      where: { idempotencyKey: key },
    });
  }

  async purgeExpired(cutoff: Date): Promise<number> {
    const { count } = await this.prisma.syncIdempotencyRecord.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });
    return count;
  }
}
