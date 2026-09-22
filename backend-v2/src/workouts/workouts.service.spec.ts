import { randomUUID } from 'crypto';
import { CreateWorkoutDto } from './dto/workout.dto';
import { WorkoutsService } from './workouts.service';
import {
  ApplyStatus,
  CursorPoint,
  WorkoutData,
  WorkoutRecord,
  WorkoutRepository,
} from './repositories/workout-repository.interface';

const SUB_A = 'sub-a';
const SUB_B = 'sub-b';

let seq = 100;
function nextId(): string {
  seq += 1;
  return String(seq).padStart(24, '0');
}

function record(overrides: Partial<WorkoutRecord> = {}): WorkoutRecord {
  return {
    clientId: randomUUID(),
    date: new Date('2026-09-22'),
    deletedAt: null,
    exercises: [],
    id: nextId(),
    name: 'Leg day',
    serverUpdatedAt: new Date(),
    userId: SUB_A,
    version: 0,
    ...overrides,
  };
}

function duplicateKey(): Error {
  const err = new Error('E11000 duplicate key') as Error & { code: number };
  err.code = 11000;
  return err;
}

class FakeWorkoutRepo extends WorkoutRepository {
  readonly store = new Map<string, WorkoutRecord>();
  lastPurgeCutoff: Date | null = null;

  private key(sub: string, clientId: string): string {
    return `${sub}:${clientId}`;
  }

  async findByClientId(sub: string, clientId: string): Promise<WorkoutRecord | null> {
    return this.store.get(this.key(sub, clientId)) ?? null;
  }

  async create(
    sub: string,
    clientId: string,
    data: WorkoutData,
    version: number,
  ): Promise<WorkoutRecord> {
    if (this.store.has(this.key(sub, clientId))) throw duplicateKey();
    const r = record({
      clientId,
      date: new Date(data.date),
      exercises: data.exercises ?? [],
      name: data.name,
      userId: sub,
      version,
    });
    this.store.set(this.key(sub, clientId), r);
    return r;
  }

  async applyIfVersionMatches(): Promise<{ status: ApplyStatus; record: WorkoutRecord | null }> {
    return { record: null, status: 'conflict' };
  }

  async findChangedSince(): Promise<WorkoutRecord[]> {
    return [];
  }

  async list(
    sub: string,
    opts: { before: CursorPoint | null; limit: number; includeDeleted: boolean },
  ): Promise<WorkoutRecord[]> {
    const all = [...this.store.values()]
      .filter((r) => r.userId === sub)
      .filter((r) => opts.includeDeleted || !r.deletedAt)
      .sort(
        (a, b) =>
          b.serverUpdatedAt.getTime() - a.serverUpdatedAt.getTime() || (a.id < b.id ? 1 : -1),
      );
    const filtered = opts.before
      ? all.filter(
          (r) =>
            r.serverUpdatedAt < opts.before!.t ||
            (r.serverUpdatedAt.getTime() === opts.before!.t.getTime() && r.id < opts.before!.id),
        )
      : all;
    return filtered.slice(0, opts.limit);
  }

  async update(
    sub: string,
    clientId: string,
    data: Partial<WorkoutData>,
  ): Promise<WorkoutRecord | null> {
    const current = await this.findByClientId(sub, clientId);
    if (!current || current.deletedAt) return null;
    const next = {
      ...current,
      date: data.date ? new Date(data.date) : current.date,
      exercises: data.exercises ?? current.exercises,
      name: data.name ?? current.name,
      serverUpdatedAt: new Date(),
      version: current.version + 1,
    };
    this.store.set(this.key(sub, clientId), next);
    return next;
  }

  async softDelete(sub: string, clientId: string): Promise<WorkoutRecord | null> {
    const current = await this.findByClientId(sub, clientId);
    if (!current || current.deletedAt) return null;
    const next = {
      ...current,
      deletedAt: new Date(),
      serverUpdatedAt: new Date(),
      version: current.version + 1,
    };
    this.store.set(this.key(sub, clientId), next);
    return next;
  }

  async purgeTombstones(cutoff: Date): Promise<number> {
    this.lastPurgeCutoff = cutoff;
    let n = 0;
    for (const [k, r] of this.store) {
      if (r.deletedAt && r.deletedAt < cutoff) {
        this.store.delete(k);
        n += 1;
      }
    }
    return n;
  }
}

function createDto(overrides: Partial<CreateWorkoutDto> = {}): CreateWorkoutDto {
  return {
    date: '2026-09-22',
    exercises: [],
    name: 'Leg day',
    ...overrides,
  } as CreateWorkoutDto;
}

describe('WorkoutsService', () => {
  let service: WorkoutsService;
  let repos: FakeWorkoutRepo;

  beforeEach(() => {
    seq = 100;
    repos = new FakeWorkoutRepo();
    service = new WorkoutsService(repos);
  });

  it('creates a workout at version 0, minting a clientId when omitted', async () => {
    const view = await service.create(SUB_A, createDto());
    expect(view.version).toBe(0);
    expect(view.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(view.name).toBe('Leg day');
  });

  it('rejects a duplicate clientId with a coded conflict', async () => {
    const clientId = randomUUID();
    await service.create(SUB_A, createDto({ clientId }));
    await expect(service.create(SUB_A, createDto({ clientId }))).rejects.toMatchObject({
      response: { code: 'WORKOUT_CLIENT_ID_CONFLICT' },
    });
  });

  it('getOne returns the own doc', async () => {
    const created = await service.create(SUB_A, createDto());
    const view = await service.getOne(SUB_A, created.id);
    expect(view.id).toBe(created.id);
  });

  it('getOne 404s with WORKOUT_NOT_FOUND for another user’s doc (ownership isolation)', async () => {
    const created = await service.create(SUB_A, createDto());
    await expect(service.getOne(SUB_B, created.id)).rejects.toMatchObject({
      response: { code: 'WORKOUT_NOT_FOUND' },
    });
  });

  it('getOne 404s for missing docs and tombstones alike', async () => {
    await expect(service.getOne(SUB_A, randomUUID())).rejects.toMatchObject({
      response: { code: 'WORKOUT_NOT_FOUND' },
    });
    const created = await service.create(SUB_A, createDto());
    await service.remove(SUB_A, created.id);
    await expect(service.getOne(SUB_A, created.id)).rejects.toMatchObject({
      response: { code: 'WORKOUT_NOT_FOUND' },
    });
  });

  it('rejects a non-UUID id with WORKOUT_BAD_ID', async () => {
    await expect(service.getOne(SUB_A, 'not-a-uuid')).rejects.toMatchObject({
      response: { code: 'WORKOUT_BAD_ID' },
    });
  });

  it('list excludes tombstones by default and includes them on request', async () => {
    const kept = await service.create(SUB_A, createDto({ name: 'kept' }));
    const gone = await service.create(SUB_A, createDto({ name: 'gone' }));
    await service.remove(SUB_A, gone.id);

    const def = await service.list(SUB_A, {});
    expect(def.items.map((i) => i.id)).toEqual([kept.id]);

    const withDeleted = await service.list(SUB_A, { includeDeleted: true });
    expect(withDeleted.items.map((i) => i.id).sort()).toEqual([kept.id, gone.id].sort());
  });

  it('list only returns the caller’s own docs', async () => {
    await service.create(SUB_A, createDto({ name: 'mine' }));
    await service.create(SUB_B, createDto({ name: 'theirs' }));
    const page = await service.list(SUB_A, {});
    expect(page.items).toHaveLength(1);
    expect(page.items[0].name).toBe('mine');
  });

  it('list paginates newest-first with a round-trippable cursor', async () => {
    for (let i = 0; i < 3; i += 1) {
      const v = await service.create(SUB_A, createDto({ name: `w${i}` }));
      // Force distinct serverUpdatedAt ordering (newest last-created).
      const stored = repos.store.get(`${SUB_A}:${v.id}`);
      if (stored) stored.serverUpdatedAt = new Date(Date.now() + i * 1000);
    }
    const page1 = await service.list(SUB_A, { limit: 2 });
    expect(page1.items.map((i) => i.name)).toEqual(['w2', 'w1']);
    expect(page1.hasMore).toBe(true);

    const page2 = await service.list(SUB_A, { cursor: page1.cursor ?? undefined, limit: 2 });
    expect(page2.items.map((i) => i.name)).toEqual(['w0']);
    expect(page2.hasMore).toBe(false);
  });

  it('rejects a bad list cursor with WORKOUT_BAD_CURSOR', async () => {
    await expect(service.list(SUB_A, { cursor: 'junk' })).rejects.toMatchObject({
      response: { code: 'WORKOUT_BAD_CURSOR' },
    });
  });

  it('update bumps the version and applies partial changes', async () => {
    const created = await service.create(SUB_A, createDto());
    const updated = await service.update(SUB_A, created.id, { name: 'Leg day v2' });
    expect(updated.name).toBe('Leg day v2');
    expect(updated.version).toBe(1);
  });

  it('update 404s for another user’s doc', async () => {
    const created = await service.create(SUB_A, createDto());
    await expect(service.update(SUB_B, created.id, { name: 'hijack' })).rejects.toMatchObject({
      response: { code: 'WORKOUT_NOT_FOUND' },
    });
  });

  it('remove soft-deletes: sets deletedAt and bumps the version', async () => {
    const created = await service.create(SUB_A, createDto());
    const view = await service.remove(SUB_A, created.id);
    expect(view.deletedAt).not.toBeNull();
    expect(view.version).toBe(1);
    // The tombstone is still in the store (pull sync needs it).
    const stored = repos.store.get(`${SUB_A}:${created.id}`);
    expect(stored?.deletedAt).toBeInstanceOf(Date);
  });

  it('remove is not repeatable and cannot touch another user’s doc', async () => {
    const created = await service.create(SUB_A, createDto());
    await service.remove(SUB_A, created.id);
    await expect(service.remove(SUB_A, created.id)).rejects.toMatchObject({
      response: { code: 'WORKOUT_NOT_FOUND' },
    });
    const other = await service.create(SUB_B, createDto());
    await expect(service.remove(SUB_A, other.id)).rejects.toMatchObject({
      response: { code: 'WORKOUT_NOT_FOUND' },
    });
  });

  it('purgeTombstones defaults to a 90-day retention window', async () => {
    delete process.env.TOMBSTONE_RETENTION_DAYS;
    const before = Date.now();
    const { purged } = await service.purgeTombstones();
    expect(purged).toBe(0);
    expect(repos.lastPurgeCutoff).toBeInstanceOf(Date);
    const ageDays =
      (before - (repos.lastPurgeCutoff as Date).getTime()) / (24 * 60 * 60 * 1000);
    expect(ageDays).toBeGreaterThan(89);
    expect(ageDays).toBeLessThan(91);
  });

  it('purgeTombstones honors TOMBSTONE_RETENTION_DAYS and hard-deletes only old tombstones', async () => {
    process.env.TOMBSTONE_RETENTION_DAYS = '7';
    try {
      const old = await service.create(SUB_A, createDto({ name: 'old' }));
      await service.remove(SUB_A, old.id);
      const stored = repos.store.get(`${SUB_A}:${old.id}`);
      if (stored?.deletedAt) stored.deletedAt = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);

      const fresh = await service.create(SUB_A, createDto({ name: 'fresh' }));
      await service.remove(SUB_A, fresh.id);

      const { purged } = await service.purgeTombstones();
      expect(purged).toBe(1);
      expect(repos.store.has(`${SUB_A}:${old.id}`)).toBe(false);
      expect(repos.store.has(`${SUB_A}:${fresh.id}`)).toBe(true);
    } finally {
      delete process.env.TOMBSTONE_RETENTION_DAYS;
    }
  });
});
