import {
  BadRequestException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { decodeCursor, encodeCursor } from '../common/pagination/cursor-pagination';
import { PushMutationsDto, SyncMutationDto } from './dto/push-mutations.dto';
import { isDuplicateKeyError } from './repositories/mongo-workout.repository';
import type { WorkoutExercise } from './schemas/workout.schema';
import {
  CursorPoint,
  IdempotencyOutcome,
  SyncIdempotencyStore,
  WorkoutData,
  WorkoutRecord,
  WorkoutRepository,
} from './repositories/workout-repository.interface';

export type PushItemStatus = 'applied' | 'conflict' | 'duplicate' | 'error' | 'unsupported';

/** Full server state handed back on conflicts so the client can merge. */
export interface WorkoutSnapshot {
  clientId: string;
  name: string;
  date: string;
  exercises: WorkoutExercise[];
  version: number;
  deleted: boolean;
  deletedAt: string | null;
  serverUpdatedAt: string;
}

export interface PushItemResult {
  clientId: string;
  entityId: string;
  status: PushItemStatus;
  /** Server version after processing (or the conflicting one). */
  serverVersion?: number;
  /** Full server doc on conflict; null when the doc does not exist. */
  serverDoc?: WorkoutSnapshot | null;
  /** Present only when status is 'error'. */
  code?: string;
}

export interface PushResult {
  results: PushItemResult[];
  /** Top-level conflict count so single-mutation conflicts are visible. */
  conflicts: number;
  serverTime: string;
}

export interface PullResult {
  items: WorkoutSnapshot[];
  cursor: string | null;
  hasMore: boolean;
  serverTime: string;
}

const DEFAULT_PULL_LIMIT = 200;
const MAX_PULL_LIMIT = 500;

function snapshot(r: WorkoutRecord): WorkoutSnapshot {
  return {
    clientId: r.clientId,
    date: r.date.toISOString(),
    deleted: !!r.deletedAt,
    deletedAt: r.deletedAt ? r.deletedAt.toISOString() : null,
    exercises: r.exercises,
    name: r.name,
    serverUpdatedAt: r.serverUpdatedAt.toISOString(),
    version: r.version,
  };
}

function badData(message: string): BadRequestException {
  return new BadRequestException({ code: 'SYNC_BAD_DATA', message });
}

function errorCodeOf(error: unknown): string {
  if (error instanceof HttpException) {
    const body = error.getResponse();
    if (typeof body === 'object' && body !== null) {
      const code = (body as Record<string, unknown>).code;
      if (typeof code === 'string' && code.length > 0) return code;
    }
  }
  return 'SYNC_INTERNAL_ERROR';
}

@Injectable()
export class SyncService {
  constructor(
    private readonly workouts: WorkoutRepository,
    private readonly idempotency: SyncIdempotencyStore,
  ) {}

  /**
   * Applies a batch of client mutations in array order. The batch itself
   * always returns HTTP 200 — failures are per-item (`conflict`, `duplicate`,
   * `error`), never a 409 for the whole batch, so one bad mutation cannot
   * poison the rest.
   */
  async push(googleSub: string, dto: PushMutationsDto): Promise<PushResult> {
    const results: PushItemResult[] = [];
    for (const mutation of dto.mutations) {
      results.push(await this.applyOne(googleSub, mutation));
    }
    return {
      conflicts: results.filter((r) => r.status === 'conflict').length,
      results,
      serverTime: new Date().toISOString(),
    };
  }

  private async applyOne(googleSub: string, m: SyncMutationDto): Promise<PushItemResult> {
    try {
      return await this.applyOneInner(googleSub, m);
    } catch (error) {
      return { clientId: m.clientId, code: errorCodeOf(error), entityId: m.entityId, status: 'error' };
    }
  }

  private async applyOneInner(googleSub: string, m: SyncMutationDto): Promise<PushItemResult> {
    if (m.entityType !== 'workout') {
      return { clientId: m.clientId, entityId: m.entityId, status: 'unsupported' };
    }

    // Claim first: a duplicate key means this exact mutation already ran —
    // return the stored outcome without re-applying.
    const fresh = await this.idempotency.claim(m.idempotencyKey, googleSub);
    if (!fresh) {
      const seen = await this.idempotency.find(m.idempotencyKey);
      const doc = await this.workouts.findByClientId(googleSub, m.entityId);
      return {
        clientId: m.clientId,
        entityId: m.entityId,
        serverVersion: seen?.serverVersion ?? doc?.version ?? 0,
        status: 'duplicate',
      };
    }

    const data = this.toWorkoutData(m.data);
    const existing = await this.workouts.findByClientId(googleSub, m.entityId);

    let outcome: IdempotencyOutcome & { serverDoc?: WorkoutSnapshot | null };
    if (!existing) {
      // A client that never synced this entity must base the mutation on
      // version 0 (brand new) or 1 (created locally, edited before first
      // sync). A higher baseVersion on a server-unknown doc means the
      // client's history forked from the server's — surface a conflict so
      // the client reconciles instead of resurrecting a divergent copy.
      if (m.baseVersion > 1) {
        outcome = { entityId: m.entityId, serverDoc: null, serverVersion: 0, status: 'conflict' };
      } else {
        try {
          const created = await this.workouts.create(googleSub, m.entityId, data, m.baseVersion + 1);
          outcome = {
            entityId: m.entityId,
            serverDoc: snapshot(created),
            serverVersion: created.version,
            status: 'applied',
          };
        } catch (error) {
          if (!isDuplicateKeyError(error)) throw error;
          // Lost a create race with another request — report the winner as a conflict.
          const raced = await this.workouts.findByClientId(googleSub, m.entityId);
          outcome = {
            entityId: m.entityId,
            serverDoc: raced ? snapshot(raced) : null,
            serverVersion: raced?.version ?? 0,
            status: 'conflict',
          };
        }
      }
    } else if (existing.version !== m.baseVersion) {
      outcome = {
        entityId: m.entityId,
        serverDoc: snapshot(existing),
        serverVersion: existing.version,
        status: 'conflict',
      };
    } else {
      const { record, status } = await this.workouts.applyIfVersionMatches(
        googleSub,
        m.entityId,
        m.baseVersion,
        data,
      );
      if (status === 'applied' && record) {
        outcome = {
          entityId: m.entityId,
          serverDoc: snapshot(record),
          serverVersion: record.version,
          status: 'applied',
        };
      } else {
        // The version moved between the read and the atomic guard — re-read
        // so the conflict carries the truth, not a stale snapshot.
        const current = await this.workouts.findByClientId(googleSub, m.entityId);
        outcome = {
          entityId: m.entityId,
          serverDoc: current ? snapshot(current) : null,
          serverVersion: current?.version ?? 0,
          status: 'conflict',
        };
      }
    }

    await this.idempotency.save(m.idempotencyKey, googleSub, {
      entityId: outcome.entityId,
      serverVersion: outcome.serverVersion,
      status: outcome.status,
    });
    return {
      clientId: m.clientId,
      entityId: outcome.entityId,
      serverDoc: outcome.serverDoc,
      serverVersion: outcome.serverVersion,
      status: outcome.status,
    };
  }

  /** Incremental pull: everything the server changed since `cursor`, tombstones included. */
  async pull(
    googleSub: string,
    cursor: string | undefined,
    limit: number | undefined,
  ): Promise<PullResult> {
    const since = this.decodePullCursor(cursor);
    const safeLimit = Math.min(Math.max(limit ?? DEFAULT_PULL_LIMIT, 1), MAX_PULL_LIMIT);
    const records = await this.workouts.findChangedSince(googleSub, since, safeLimit);

    const items = records.map(snapshot);
    const last = records[records.length - 1];
    return {
      cursor: last ? encodeCursor(last.serverUpdatedAt.toISOString(), last.id) : (cursor ?? null),
      hasMore: records.length === safeLimit,
      items,
      serverTime: new Date().toISOString(),
    };
  }

  private decodePullCursor(cursor: string | undefined): CursorPoint | null {
    if (!cursor) return null;
    try {
      const { timestamp, tiebreakerId } = decodeCursor(cursor);
      if (Number.isNaN(timestamp.getTime()) || !Types.ObjectId.isValid(tiebreakerId)) {
        throw new Error('bad cursor');
      }
      return { id: tiebreakerId, t: timestamp };
    } catch {
      throw new BadRequestException({ code: 'SYNC_BAD_CURSOR', message: 'Invalid sync cursor.' });
    }
  }

  /**
   * Strictly validates mutation payloads. Sync data bypasses the CRUD DTOs
   * (it mirrors the client's SQLite rows), so this is the trust boundary.
   */
  private toWorkoutData(raw: Record<string, unknown>): WorkoutData {
    if (!raw || typeof raw !== 'object') throw badData('Mutation data must be an object.');
    const name = typeof raw.name === 'string' ? raw.name.trim() : '';
    if (name.length < 1 || name.length > 120) {
      throw badData('Mutation data requires a name of 1..120 characters.');
    }
    const date =
      raw.date instanceof Date ? raw.date : typeof raw.date === 'string' ? new Date(raw.date) : null;
    if (!date || Number.isNaN(date.getTime())) {
      throw badData('Mutation data requires a valid ISO date.');
    }
    const exercises = raw.exercises === undefined ? [] : raw.exercises;
    if (!Array.isArray(exercises) || exercises.length > 200) {
      throw badData('Mutation exercises must be an array of at most 200 items.');
    }
    let deleted: boolean | undefined;
    if (raw.deleted !== undefined) {
      if (typeof raw.deleted !== 'boolean') throw badData('Mutation "deleted" must be a boolean.');
      deleted = raw.deleted;
    }
    return {
      date: date.toISOString(),
      deleted,
      exercises: exercises.map((e) => this.toExerciseData(e)),
      name,
    };
  }

  private toExerciseData(raw: unknown): WorkoutExercise {
    if (!raw || typeof raw !== 'object') throw badData('Each exercise must be an object.');
    const e = raw as Record<string, unknown>;
    if (typeof e.exerciseId !== 'string' || e.exerciseId.length < 1 || e.exerciseId.length > 128) {
      throw badData('Each exercise requires an exerciseId of 1..128 characters.');
    }
    const sets = e.sets === undefined ? [] : e.sets;
    if (!Array.isArray(sets) || sets.length > 500) {
      throw badData('Exercise sets must be an array of at most 500 items.');
    }
    if (e.notes !== undefined && (typeof e.notes !== 'string' || e.notes.length > 2000)) {
      throw badData('Exercise notes must be a string of at most 2000 characters.');
    }
    const out: WorkoutExercise = {
      exerciseId: e.exerciseId,
      sets: sets.map((s) => this.toSetData(s)),
    };
    if (typeof e.notes === 'string') out.notes = e.notes;
    return out;
  }

  private toSetData(raw: unknown): WorkoutExercise['sets'][number] {
    if (!raw || typeof raw !== 'object') throw badData('Each set must be an object.');
    const s = raw as Record<string, unknown>;
    const out: WorkoutExercise['sets'][number] = {};
    if (s.reps !== undefined) {
      if (typeof s.reps !== 'number' || !Number.isFinite(s.reps) || s.reps < 0)
        throw badData('Set reps must be a finite number >= 0.');
      out.reps = s.reps;
    }
    if (s.weight !== undefined) {
      if (typeof s.weight !== 'number' || !Number.isFinite(s.weight) || s.weight < 0) {
        throw badData('Set weight must be a finite number >= 0.');
      }
      out.weight = s.weight;
    }
    if (s.unit !== undefined) {
      if (typeof s.unit !== 'string' || s.unit.length > 8) {
        throw badData('Set unit must be a string of at most 8 characters.');
      }
      out.unit = s.unit;
    }
    if (s.rpe !== undefined) {
      if (typeof s.rpe !== 'number' || !Number.isFinite(s.rpe) || s.rpe < 0 || s.rpe > 10) {
        throw badData('Set rpe must be a finite number between 0 and 10.');
      }
      out.rpe = s.rpe;
    }
    return out;
  }
}
