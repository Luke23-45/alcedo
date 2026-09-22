import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { Types } from 'mongoose';
import { decodeCursor, encodeCursor } from '../common/pagination/cursor-pagination';
import { newId } from '../common/utils/ids';
import { isDuplicateKeyError } from './repositories/mongo-workout.repository';
import {
  CursorPoint,
  WorkoutRecord,
  WorkoutRepository,
} from './repositories/workout-repository.interface';
import { CreateWorkoutDto, UpdateWorkoutDto } from './dto/workout.dto';
import { WorkoutExercise } from './schemas/workout.schema';

export interface WorkoutView {
  /** The stable client-generated UUID — use it as the workout's id everywhere. */
  id: string;
  name: string;
  date: string;
  exercises: WorkoutExercise[];
  version: number;
  deletedAt: string | null;
  serverUpdatedAt: string;
}

export interface WorkoutPage {
  items: WorkoutView[];
  cursor: string | null;
  hasMore: boolean;
  serverTime: string;
}

const DEFAULT_LIST_LIMIT = 50;
const MAX_LIST_LIMIT = 200;

function notFound(): NotFoundException {
  // Never 403 and never a hint that the doc exists — ownership failures are 404.
  return new NotFoundException({ code: 'WORKOUT_NOT_FOUND', message: 'Workout not found.' });
}

function toView(r: WorkoutRecord): WorkoutView {
  return {
    date: r.date.toISOString(),
    deletedAt: r.deletedAt ? r.deletedAt.toISOString() : null,
    exercises: r.exercises,
    id: r.clientId,
    name: r.name,
    serverUpdatedAt: r.serverUpdatedAt.toISOString(),
    version: r.version,
  };
}

function decodeListCursor(cursor: string | undefined): CursorPoint | null {
  if (!cursor) return null;
  try {
    const { timestamp, tiebreakerId } = decodeCursor(cursor);
    if (Number.isNaN(timestamp.getTime()) || !Types.ObjectId.isValid(tiebreakerId)) {
      throw new Error('bad cursor');
    }
    return { id: tiebreakerId, t: timestamp };
  } catch {
    throw new BadRequestException({ code: 'WORKOUT_BAD_CURSOR', message: 'Invalid cursor.' });
  }
}

function assertClientId(clientId: string): void {
  if (!isUUID(clientId)) {
    throw new BadRequestException({ code: 'WORKOUT_BAD_ID', message: 'Invalid workout id.' });
  }
}

@Injectable()
export class WorkoutsService {
  constructor(private readonly workouts: WorkoutRepository) {}

  async getOne(googleSub: string, clientId: string): Promise<WorkoutView> {
    assertClientId(clientId);
    const record = await this.workouts.findByClientId(googleSub, clientId);
    if (!record || record.deletedAt) throw notFound();
    return toView(record);
  }

  async list(
    googleSub: string,
    query: { cursor?: string; limit?: number; includeDeleted?: boolean },
  ): Promise<WorkoutPage> {
    const before = decodeListCursor(query.cursor);
    const safeLimit = Math.min(Math.max(query.limit ?? DEFAULT_LIST_LIMIT, 1), MAX_LIST_LIMIT);
    const records = await this.workouts.list(googleSub, {
      before,
      includeDeleted: query.includeDeleted ?? false,
      limit: safeLimit,
    });
    const items = records.map(toView);
    const last = records[records.length - 1];
    return {
      cursor: last
        ? encodeCursor(last.serverUpdatedAt.toISOString(), last.id)
        : (query.cursor ?? null),
      hasMore: records.length === safeLimit,
      items,
      serverTime: new Date().toISOString(),
    };
  }

  async create(googleSub: string, dto: CreateWorkoutDto): Promise<WorkoutView> {
    const clientId = dto.clientId ?? newId();
    try {
      const record = await this.workouts.create(
        googleSub,
        clientId,
        { date: dto.date, exercises: dto.exercises, name: dto.name },
        0,
      );
      return toView(record);
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        throw new ConflictException({
          code: 'WORKOUT_CLIENT_ID_CONFLICT',
          message: 'A workout with this clientId already exists.',
        });
      }
      throw error;
    }
  }

  async update(
    googleSub: string,
    clientId: string,
    dto: UpdateWorkoutDto,
  ): Promise<WorkoutView> {
    assertClientId(clientId);
    const record = await this.workouts.update(googleSub, clientId, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.date !== undefined ? { date: dto.date } : {}),
      ...(dto.exercises !== undefined ? { exercises: dto.exercises } : {}),
    });
    if (!record) throw notFound();
    return toView(record);
  }

  async remove(googleSub: string, clientId: string): Promise<WorkoutView> {
    assertClientId(clientId);
    // Soft delete only: the tombstone still flows through pull sync so
    // offline clients can purge their local copy.
    const record = await this.workouts.softDelete(googleSub, clientId);
    if (!record) throw notFound();
    return toView(record);
  }

  /**
   * Hard-deletes tombstones older than the retention window. Tombstones are
   * kept for TOMBSTONE_RETENTION_DAYS (default 90) so offline clients have
   * time to pull the delete before the row disappears for good — a client
   * that has been offline longer than the window must do a full re-sync.
   *
   * No scheduler is wired here on purpose; call this from a daily cron or
   * worker in the deployment layer.
   */
  async purgeTombstones(): Promise<{ purged: number }> {
    const raw = Number(process.env.TOMBSTONE_RETENTION_DAYS ?? 90);
    const days = Number.isFinite(raw) && raw > 0 ? raw : 90;
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return { purged: await this.workouts.purgeTombstones(cutoff) };
  }
}
