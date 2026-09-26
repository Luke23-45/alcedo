import type { WorkoutExercise } from '../schemas/workout.schema';

/** Opaque page position: a timestamp plus the tiebreaker document id. */
export interface CursorPoint {
  t: Date;
  id: string;
}

export interface WorkoutData {
  name: string;
  date: string | Date;
  exercises?: WorkoutExercise[];
  /**
   * Sync-only tombstone flag: true marks deletedAt, false clears it.
   * Undefined leaves the delete state untouched.
   */
  deleted?: boolean;
}

export interface WorkoutRecord {
  /**
   * Internal cursor tiebreaker only, opaque to clients: the Mongo `_id` hex
   * on MongoDB, the decimal row id on PostgreSQL. Never compared
   * lexicographically across providers — repositories order by the native
   * column type.
   */
  id: string;
  /** Client-generated UUID — the stable identity clients sync on. */
  clientId: string;
  userId: string;
  name: string;
  date: Date;
  exercises: WorkoutExercise[];
  version: number;
  deletedAt?: Date | null;
  serverUpdatedAt: Date;
}

export type ApplyStatus = 'applied' | 'conflict';

export abstract class WorkoutRepository {
  abstract findByClientId(googleSub: string, clientId: string): Promise<WorkoutRecord | null>;
  abstract create(
    googleSub: string,
    clientId: string,
    data: WorkoutData,
    version: number,
  ): Promise<WorkoutRecord>;
  /**
   * Atomically applies a mutation only if the stored version still equals
   * baseVersion (and sets version = baseVersion + 1). On mismatch returns
   * `conflict` with a null record — the caller re-reads (findByClientId) to
   * distinguish a version conflict from a missing row.
   */
  abstract applyIfVersionMatches(
    googleSub: string,
    clientId: string,
    baseVersion: number,
    data: WorkoutData,
  ): Promise<{ status: ApplyStatus; record: WorkoutRecord | null }>;
  /** Incremental sync window, ascending by (serverUpdatedAt, _id). */
  abstract findChangedSince(
    googleSub: string,
    since: CursorPoint | null,
    limit: number,
  ): Promise<WorkoutRecord[]>;
  /** CRUD list, newest first. `before` pages backwards through the cursor. */
  abstract list(
    googleSub: string,
    opts: { before: CursorPoint | null; limit: number; includeDeleted: boolean },
  ): Promise<WorkoutRecord[]>;
  /** Partial CRUD update; bumps version by one. Null when missing/deleted. */
  abstract update(
    googleSub: string,
    clientId: string,
    data: Partial<WorkoutData>,
  ): Promise<WorkoutRecord | null>;
  /** Soft delete: sets deletedAt, bumps version. Null when missing/deleted. */
  abstract softDelete(googleSub: string, clientId: string): Promise<WorkoutRecord | null>;
  /** Hard-deletes tombstones older than `cutoff`. Returns the removed count. */
  abstract purgeTombstones(cutoff: Date): Promise<number>;
}

export interface IdempotencyOutcome {
  status: 'applied' | 'conflict' | 'duplicate';
  entityId: string;
  serverVersion: number;
}

export abstract class SyncIdempotencyStore {
  /**
   * Atomically inserts the claim. Returns true when this caller won the
   * insert (must process the mutation), false when the key was already
   * claimed (a retry — return the stored outcome, never re-apply).
   */
  abstract claim(key: string, googleSub: string): Promise<boolean>;
  abstract find(key: string): Promise<IdempotencyOutcome | null>;
  abstract save(key: string, googleSub: string, outcome: IdempotencyOutcome): Promise<void>;
  /**
   * Deletes claims created before `cutoff` — mirrors the Mongo TTL on
   * `createdAt` (30 days). Returns the removed count.
   */
  abstract purgeExpired(cutoff: Date): Promise<number>;
}
