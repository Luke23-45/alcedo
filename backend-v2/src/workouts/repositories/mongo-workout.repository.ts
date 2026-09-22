import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { SyncIdempotencyDocument, SyncIdempotencyRecord } from '../schemas/sync-idempotency.schema';
import {
  Workout,
  WorkoutDocument,
  WorkoutExercise,
  WorkoutSet,
} from '../schemas/workout.schema';
import {
  ApplyStatus,
  CursorPoint,
  IdempotencyOutcome,
  SyncIdempotencyStore,
  WorkoutData,
  WorkoutRecord,
  WorkoutRepository,
} from './workout-repository.interface';

export function isDuplicateKeyError(error: unknown): boolean {
  return (
    error instanceof Error && (error as { code?: unknown }).code === 11000
  );
}

function toPlainSet(s: WorkoutSet): WorkoutSet {
  const out: WorkoutSet = {};
  if (typeof s.reps === 'number') out.reps = s.reps;
  if (typeof s.weight === 'number') out.weight = s.weight;
  if (typeof s.unit === 'string') out.unit = s.unit;
  if (typeof s.rpe === 'number') out.rpe = s.rpe;
  return out;
}

function toPlainExercise(e: WorkoutExercise): WorkoutExercise {
  const out: WorkoutExercise = {
    exerciseId: e.exerciseId,
    sets: (e.sets ?? []).map(toPlainSet),
  };
  if (typeof e.notes === 'string') out.notes = e.notes;
  return out;
}

function toRecord(doc: WorkoutDocument): WorkoutRecord {
  return {
    clientId: doc.clientId,
    date: doc.date,
    deletedAt: doc.deletedAt ?? null,
    exercises: (doc.exercises ?? []).map(toPlainExercise),
    id: doc._id.toHexString(),
    name: doc.name,
    serverUpdatedAt: doc.serverUpdatedAt,
    userId: doc.userId,
    version: doc.version,
  };
}

/**
 * Maps sync data onto a Mongo update. `deleted` is tri-state on purpose:
 * true marks the tombstone, false clears it, undefined leaves it alone.
 */
interface WorkoutFieldSet {
  date: Date;
  exercises: WorkoutExercise[];
  name: string;
  serverUpdatedAt: Date;
  deletedAt?: Date;
}

function buildUpdate(data: WorkoutData): { set: WorkoutFieldSet; unset: { deletedAt?: 1 } } {
  const set: WorkoutFieldSet = {
    date: new Date(data.date),
    exercises: data.exercises ?? [],
    name: data.name,
    serverUpdatedAt: new Date(),
  };
  const unset: { deletedAt?: 1 } = {};
  if (data.deleted === true) set.deletedAt = new Date();
  else if (data.deleted === false) unset.deletedAt = 1;
  return { set, unset };
}

function changedSinceFilter(
  googleSub: string,
  since: CursorPoint | null,
): FilterQuery<WorkoutDocument> {
  if (!since) return { userId: googleSub };
  return {
    userId: googleSub,
    $or: [
      { serverUpdatedAt: { $gt: since.t } },
      { serverUpdatedAt: since.t, _id: { $gt: new Types.ObjectId(since.id) } },
    ],
  };
}

function listFilter(
  googleSub: string,
  opts: { before: CursorPoint | null; includeDeleted: boolean },
): FilterQuery<WorkoutDocument> {
  const filter: FilterQuery<WorkoutDocument> = { userId: googleSub };
  if (!opts.includeDeleted) filter.deletedAt = null;
  const { before } = opts;
  if (before) {
    filter.$or = [
      { serverUpdatedAt: { $lt: before.t } },
      { serverUpdatedAt: before.t, _id: { $lt: new Types.ObjectId(before.id) } },
    ];
  }
  return filter;
}

@Injectable()
export class MongoWorkoutRepository extends WorkoutRepository {
  constructor(@InjectModel(Workout.name) private readonly model: Model<WorkoutDocument>) {
    super();
  }

  async findByClientId(googleSub: string, clientId: string): Promise<WorkoutRecord | null> {
    const doc = await this.model.findOne({ clientId, userId: googleSub }).exec();
    return doc ? toRecord(doc) : null;
  }

  async create(
    googleSub: string,
    clientId: string,
    data: WorkoutData,
    version: number,
  ): Promise<WorkoutRecord> {
    // The unique { userId, clientId } index makes concurrent creates race-safe:
    // the loser gets a 11000, which the caller turns into a conflict.
    const { set } = buildUpdate(data);
    const doc = await this.model.create({
      clientId,
      deletedAt: set.deletedAt ?? null,
      userId: googleSub,
      version,
      ...set,
    });
    return toRecord(doc);
  }

  async applyIfVersionMatches(
    googleSub: string,
    clientId: string,
    baseVersion: number,
    data: WorkoutData,
  ): Promise<{ status: ApplyStatus; record: WorkoutRecord | null }> {
    const { set, unset } = buildUpdate(data);
    const update: {
      $set: WorkoutFieldSet;
      $inc: { version: number };
      $unset?: { deletedAt: 1 };
    } = { $set: set, $inc: { version: 1 } };
    if (unset.deletedAt) update.$unset = { deletedAt: 1 };
    const updated = await this.model
      .findOneAndUpdate({ clientId, userId: googleSub, version: baseVersion }, update, {
        new: true,
      })
      .exec();
    if (updated) return { record: toRecord(updated), status: 'applied' };
    // Guard failed: either the version moved or the doc is gone. The caller
    // re-reads to distinguish a real conflict from a missing doc.
    return { record: null, status: 'conflict' };
  }

  async findChangedSince(
    googleSub: string,
    since: CursorPoint | null,
    limit: number,
  ): Promise<WorkoutRecord[]> {
    const docs = await this.model
      .find(changedSinceFilter(googleSub, since))
      .sort({ serverUpdatedAt: 1, _id: 1 })
      .limit(limit)
      .exec();
    return docs.map(toRecord);
  }

  async list(
    googleSub: string,
    opts: { before: CursorPoint | null; limit: number; includeDeleted: boolean },
  ): Promise<WorkoutRecord[]> {
    const docs = await this.model
      .find(listFilter(googleSub, opts))
      .sort({ serverUpdatedAt: -1, _id: -1 })
      .limit(opts.limit)
      .exec();
    return docs.map(toRecord);
  }

  async update(
    googleSub: string,
    clientId: string,
    data: Partial<WorkoutData>,
  ): Promise<WorkoutRecord | null> {
    const set: {
      serverUpdatedAt: Date;
      name?: string;
      date?: Date;
      exercises?: WorkoutExercise[];
    } = { serverUpdatedAt: new Date() };
    if (data.name !== undefined) set.name = data.name;
    if (data.date !== undefined) set.date = new Date(data.date);
    if (data.exercises !== undefined) set.exercises = data.exercises;
    const doc = await this.model
      .findOneAndUpdate(
        { clientId, deletedAt: null, userId: googleSub },
        { $set: set, $inc: { version: 1 } },
        { new: true },
      )
      .exec();
    return doc ? toRecord(doc) : null;
  }

  async softDelete(googleSub: string, clientId: string): Promise<WorkoutRecord | null> {
    const doc = await this.model
      .findOneAndUpdate(
        { clientId, deletedAt: null, userId: googleSub },
        {
          $set: { deletedAt: new Date(), serverUpdatedAt: new Date() },
          $inc: { version: 1 },
        },
        { new: true },
      )
      .exec();
    return doc ? toRecord(doc) : null;
  }

  async purgeTombstones(cutoff: Date): Promise<number> {
    const res = await this.model
      .deleteMany({ deletedAt: { $ne: null, $lt: cutoff } })
      .exec();
    return res.deletedCount ?? 0;
  }
}

@Injectable()
export class MongoSyncIdempotencyStore extends SyncIdempotencyStore {
  constructor(
    @InjectModel(SyncIdempotencyRecord.name)
    private readonly model: Model<SyncIdempotencyDocument>,
  ) {
    super();
  }

  async claim(key: string, googleSub: string): Promise<boolean> {
    try {
      await this.model.create({ idempotencyKey: key, userId: googleSub });
      return true;
    } catch (error) {
      if (isDuplicateKeyError(error)) return false;
      throw error;
    }
  }

  async find(key: string): Promise<IdempotencyOutcome | null> {
    const doc = await this.model.findOne({ idempotencyKey: key }).exec();
    if (!doc || !doc.status || doc.entityId === undefined || doc.serverVersion === undefined) {
      return null;
    }
    return { entityId: doc.entityId, serverVersion: doc.serverVersion, status: doc.status };
  }

  async save(key: string, googleSub: string, outcome: IdempotencyOutcome): Promise<void> {
    await this.model
      .updateOne(
        { idempotencyKey: key },
        { $set: { ...outcome, idempotencyKey: key, userId: googleSub } },
        { upsert: true },
      )
      .exec();
  }
}
