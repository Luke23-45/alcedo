import { SyncMutationDto } from './dto/push-mutations.dto';
import { PushResult, SyncService } from './sync.service';
import {
  ApplyStatus,
  CursorPoint,
  IdempotencyOutcome,
  SyncIdempotencyStore,
  WorkoutData,
  WorkoutRecord,
  WorkoutRepository,
} from './repositories/workout-repository.interface';

const SUB = 'sub-1';
const CLIENT_ID = '22222222-2222-4222-8222-222222222222';
const KEY_1 = '33333333-3333-4333-8333-333333333333';

let seq = 0;
/** 24-hex strings: valid ObjectIds, lexicographic order == numeric order. */
function nextId(): string {
  seq += 1;
  return String(seq).padStart(24, '0');
}

function record(overrides: Partial<WorkoutRecord> = {}): WorkoutRecord {
  const now = new Date();
  return {
    clientId: CLIENT_ID,
    date: new Date('2026-09-22'),
    deletedAt: null,
    exercises: [],
    id: nextId(),
    name: 'Push day',
    serverUpdatedAt: now,
    userId: SUB,
    version: 1,
    ...overrides,
  };
}

class FakeWorkoutRepo extends WorkoutRepository {
  readonly store = new Map<string, WorkoutRecord>();

  async findByClientId(_sub: string, clientId: string): Promise<WorkoutRecord | null> {
    return this.store.get(clientId) ?? null;
  }

  async create(
    _sub: string,
    clientId: string,
    data: WorkoutData,
    version: number,
  ): Promise<WorkoutRecord> {
    if (this.store.has(clientId)) {
      const err = new Error('E11000 duplicate key') as Error & { code: number };
      err.code = 11000;
      throw err;
    }
    const r = record({
      clientId,
      date: new Date(data.date),
      deletedAt: data.deleted === true ? new Date() : null,
      exercises: data.exercises ?? [],
      name: data.name,
      version,
    });
    this.store.set(clientId, r);
    return r;
  }

  async applyIfVersionMatches(
    _sub: string,
    clientId: string,
    baseVersion: number,
    data: WorkoutData,
  ): Promise<{ status: ApplyStatus; record: WorkoutRecord | null }> {
    const current = this.store.get(clientId);
    if (!current || current.version !== baseVersion) {
      return { record: null, status: 'conflict' };
    }
    const next = record({
      ...current,
      date: new Date(data.date),
      deletedAt: data.deleted === true ? new Date() : data.deleted === false ? null : current.deletedAt,
      exercises: data.exercises ?? [],
      name: data.name,
      serverUpdatedAt: new Date(),
      version: current.version + 1,
    });
    this.store.set(clientId, next);
    return { record: next, status: 'applied' };
  }

  async findChangedSince(
    _sub: string,
    since: CursorPoint | null,
    limit: number,
  ): Promise<WorkoutRecord[]> {
    const all = [...this.store.values()].sort(
      (a, b) =>
        a.serverUpdatedAt.getTime() - b.serverUpdatedAt.getTime() || (a.id < b.id ? -1 : 1),
    );
    const filtered = since
      ? all.filter(
          (r) =>
            r.serverUpdatedAt > since.t ||
            (r.serverUpdatedAt.getTime() === since.t.getTime() && r.id > since.id),
        )
      : all;
    return filtered.slice(0, limit);
  }

  async list(): Promise<WorkoutRecord[]> {
    return [];
  }

  async update(): Promise<WorkoutRecord | null> {
    return null;
  }

  async softDelete(): Promise<WorkoutRecord | null> {
    return null;
  }

  async purgeTombstones(): Promise<number> {
    return 0;
  }
}

class FakeIdempotencyStore extends SyncIdempotencyStore {
  readonly claimed = new Map<string, Date>();
  readonly outcomes = new Map<string, IdempotencyOutcome>();

  async claim(key: string): Promise<boolean> {
    if (this.claimed.has(key)) return false;
    this.claimed.set(key, new Date());
    return true;
  }

  async find(key: string): Promise<IdempotencyOutcome | null> {
    return this.outcomes.get(key) ?? null;
  }

  async save(key: string, _sub: string, outcome: IdempotencyOutcome): Promise<void> {
    this.outcomes.set(key, outcome);
  }

  async purgeExpired(cutoff: Date): Promise<number> {
    let removed = 0;
    for (const [key, claimedAt] of this.claimed) {
      if (claimedAt < cutoff) {
        this.claimed.delete(key);
        this.outcomes.delete(key);
        removed++;
      }
    }
    return removed;
  }
}

function mutation(overrides: Partial<SyncMutationDto> = {}): SyncMutationDto {
  return {
    baseVersion: 0,
    clientId: '11111111-1111-4111-8111-111111111111',
    data: { date: '2026-09-22', exercises: [], name: 'Push day' },
    entityId: CLIENT_ID,
    entityType: 'workout',
    idempotencyKey: KEY_1,
    ...overrides,
  };
}

describe('SyncService', () => {
  let service: SyncService;
  let repos: FakeWorkoutRepo;
  let idempotency: FakeIdempotencyStore;

  beforeEach(() => {
    seq = 0;
    repos = new FakeWorkoutRepo();
    idempotency = new FakeIdempotencyStore();
    service = new SyncService(repos, idempotency);
  });

  async function push(mutations: SyncMutationDto[]): Promise<PushResult> {
    return service.push(SUB, { mutations });
  }

  it('applies a create mutation at version baseVersion + 1', async () => {
    const { results, conflicts } = await push([mutation()]);
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ status: 'applied', serverVersion: 1 });
    expect(conflicts).toBe(0);
  });

  it('dedupes retries by idempotency key without re-applying', async () => {
    const dto = [mutation()];
    const first = await push(dto);
    const second = await push(dto);
    expect(first.results[0].status).toBe('applied');
    expect(second.results[0]).toMatchObject({ status: 'duplicate', serverVersion: 1 });
    expect(second.conflicts).toBe(0);
    expect(repos.store.get(CLIENT_ID)?.version).toBe(1);
    expect(repos.store.get(CLIENT_ID)?.name).toBe('Push day');
  });

  it('returns conflict with serverVersion and serverDoc on a stale baseVersion, without applying', async () => {
    await push([mutation()]);
    const { results, conflicts } = await push([
      mutation({
        baseVersion: 0,
        data: { date: '2026-09-22', exercises: [], name: 'Stale write' },
        idempotencyKey: '44444444-4444-4444-8444-444444444444',
      }),
    ]);
    expect(conflicts).toBe(1);
    expect(results[0].status).toBe('conflict');
    expect(results[0].serverVersion).toBe(1);
    expect(results[0].serverDoc).toMatchObject({ name: 'Push day', version: 1 });
    // The stale write must not have landed.
    expect(repos.store.get(CLIENT_ID)?.name).toBe('Push day');
    expect(repos.store.get(CLIENT_ID)?.version).toBe(1);
  });

  it('treats a missing doc with baseVersion > 0 as a conflict with serverVersion 0', async () => {
    const { results } = await push([mutation({ baseVersion: 3 })]);
    expect(results[0]).toMatchObject({
      status: 'conflict',
      serverVersion: 0,
      serverDoc: null,
    });
  });

  it('applies an update when the baseVersion matches', async () => {
    await push([mutation()]);
    const { results } = await push([
      mutation({
        baseVersion: 1,
        data: { date: '2026-09-22', exercises: [], name: 'Push day v2' },
        idempotencyKey: '55555555-5555-4555-8555-555555555555',
      }),
    ]);
    expect(results[0]).toMatchObject({ status: 'applied', serverVersion: 2 });
    expect(repos.store.get(CLIENT_ID)?.name).toBe('Push day v2');
  });

  it('marks unknown entity types as unsupported', async () => {
    const { results } = await push([mutation({ entityType: 'meal' })]);
    expect(results[0].status).toBe('unsupported');
  });

  it('reports per-mutation errors without failing the batch', async () => {
    const good = mutation({ idempotencyKey: '66666666-6666-4666-8666-666666666666' });
    const bad = mutation({
      data: { date: '2026-09-22', exercises: [], name: '' },
      entityId: '77777777-7777-4777-8777-777777777777',
      idempotencyKey: '88888888-8888-4888-8888-888888888888',
    });
    const { results } = await push([good, bad]);
    expect(results[0].status).toBe('applied');
    expect(results[1]).toMatchObject({ status: 'error', code: 'SYNC_BAD_DATA' });
  });

  it('rejects non-finite set numbers (NaN, Infinity) as bad data', async () => {
    const nanReps = mutation({
      data: {
        date: '2026-09-22',
        exercises: [{ exerciseId: 'bench', sets: [{ reps: NaN }] }],
        name: 'Push day',
      },
      entityId: '99999999-9999-4999-8999-999999999999',
      idempotencyKey: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    });
    const infWeight = mutation({
      data: {
        date: '2026-09-22',
        exercises: [{ exerciseId: 'bench', sets: [{ reps: 5, weight: Infinity }] }],
        name: 'Push day',
      },
      entityId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      idempotencyKey: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    });
    const { results } = await push([nanReps, infWeight]);
    expect(results[0]).toMatchObject({ status: 'error', code: 'SYNC_BAD_DATA' });
    expect(results[1]).toMatchObject({ status: 'error', code: 'SYNC_BAD_DATA' });
  });

  it('includes tombstones in pull with deleted: true', async () => {
    await push([mutation()]);
    await push([
      mutation({
        baseVersion: 1,
        data: { date: '2026-09-22', deleted: true, exercises: [], name: 'Push day' },
        idempotencyKey: '99999999-9999-4999-8999-999999999999',
      }),
    ]);
    const { items } = await service.pull(SUB, undefined, 200);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ clientId: CLIENT_ID, deleted: true });
    expect(items[0].deletedAt).not.toBeNull();
  });

  it('round-trips the pull cursor across pages', async () => {
    const base = new Date('2026-09-22T10:00:00.000Z');
    for (let i = 0; i < 3; i += 1) {
      repos.store.set(`client-${i}`, record({
        clientId: `client-${i}`,
        serverUpdatedAt: new Date(base.getTime() + i * 1000),
      }));
    }
    const page1 = await service.pull(SUB, undefined, 2);
    expect(page1.items).toHaveLength(2);
    expect(page1.hasMore).toBe(true);
    expect(page1.cursor).not.toBeNull();

    const page2 = await service.pull(SUB, page1.cursor ?? undefined, 2);
    expect(page2.items).toHaveLength(1);
    expect(page2.hasMore).toBe(false);
    expect(page2.items[0].clientId).toBe('client-2');

    // Same cursor when nothing changed.
    const page3 = await service.pull(SUB, page2.cursor ?? undefined, 2);
    expect(page3.items).toHaveLength(0);
    expect(page3.cursor).toBe(page2.cursor);
  });

  it('rejects an invalid pull cursor with SYNC_BAD_CURSOR', async () => {
    await expect(service.pull(SUB, 'not-a-cursor', 200)).rejects.toMatchObject({
      response: { code: 'SYNC_BAD_CURSOR' },
    });
    const badJson = Buffer.from(JSON.stringify({ t: 'junk', id: 'x' }), 'utf8').toString('base64url');
    await expect(service.pull(SUB, badJson, 200)).rejects.toMatchObject({
      response: { code: 'SYNC_BAD_CURSOR' },
    });
  });

  it('surfaces single-mutation conflicts in the top-level count', async () => {
    await push([mutation()]);
    const res = await push([
      mutation({ baseVersion: 0, idempotencyKey: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' }),
      mutation({
        baseVersion: 1,
        data: { date: '2026-09-22', exercises: [], name: 'ok' },
        entityId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
        idempotencyKey: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      }),
    ]);
    expect(res.conflicts).toBe(1);
    expect(res.results.map((r) => r.status)).toEqual(['conflict', 'applied']);
    expect(typeof res.serverTime).toBe('string');
  });
});
