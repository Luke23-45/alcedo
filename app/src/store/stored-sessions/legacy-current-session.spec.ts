import { describe, it, expect, vi, beforeEach } from 'vitest';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { openDatabaseAsync } from 'expo-sqlite';
import { DatabaseMigrationService } from '@/services/database-migration-service';
import { migrateLegacyCurrentSession } from '@/store/stored-sessions/legacy-current-session';
import { sessionsSchema } from '@/db/schema';
import { toJsonString } from '@/models/storage/versions/latest';
import { EmptySession, Session } from '@/models/session-models';

async function createTestDb(): Promise<ExpoSQLiteDatabase> {
  const expoDb = await openDatabaseAsync(':memory:');
  const db = drizzle(expoDb);
  await new DatabaseMigrationService(
    db,
    { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn(), time: vi.fn() } as never,
    { importOldData: async () => {} },
  ).migrate();
  return db;
}

/** Mirrors the real KeyValueStore: absent keys resolve to undefined, not null. */
function makeKvStore(initial: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(initial));
  return {
    getItem: vi.fn().mockImplementation((key: string) => Promise.resolve(store.get(key))),
    getItemBytes: vi.fn().mockResolvedValue(undefined),
    setItem: vi.fn().mockImplementation((key: string, val: string) => {
      store.set(key, val);
      return Promise.resolve();
    }),
    removeItem: vi.fn().mockImplementation((key: string) => {
      store.delete(key);
      return Promise.resolve();
    }),
    raw: store,
  };
}

function makeHarness(kv: ReturnType<typeof makeKvStore>, db: ExpoSQLiteDatabase) {
  const dispatched: unknown[] = [];
  const dispatch = vi.fn((action: unknown) => {
    dispatched.push(action);
    return action;
  });
  // No live active session in state; settings provides the weight-unit default.
  const getState = vi.fn(() => ({
    storedSessions: { activeSessionId: undefined },
    settings: { useImperialUnits: false },
  })) as never;
  const logger = { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() } as never;
  return {
    run: () => migrateLegacyCurrentSession(dispatch as never, getState, kv as never, db, logger),
    dispatched,
    dispatch,
    logger,
  };
}

describe('migrateLegacyCurrentSession', () => {
  let db: ExpoSQLiteDatabase;

  beforeEach(async () => {
    db = await createTestDb();
  });

  it('is a no-op when the legacy keys are absent (getItem resolves undefined)', async () => {
    const kv = makeKvStore();
    const { run, dispatch } = makeHarness(kv, db);

    await run();

    // The byte read is part of the absence check; after it resolves empty,
    // nothing else may happen: no decode, no DB writes, no key removals.
    expect(kv.getItemBytes).toHaveBeenCalledWith('CurrentSessionStateV1');
    expect(await db.select().from(sessionsSchema)).toEqual([]);
    expect(kv.removeItem).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('clears a torn version key without a payload instead of decoding garbage', async () => {
    const kv = makeKvStore({ 'CurrentSessionStateV1-Version': '3' });
    const { run } = makeHarness(kv, db);

    await run();

    expect(await db.select().from(sessionsSchema)).toEqual([]);
    expect(kv.raw.has('CurrentSessionStateV1')).toBe(false);
    expect(kv.raw.has('CurrentSessionStateV1-Version')).toBe(false);
  });

  it('migrates a v3 workout payload and takes the active flag when nothing is live', async () => {
    // A real serialized session guarantees a shape the migrator accepts.
    const sessionJson = Session.getEmptySession(EmptySession.blueprint, 'kilograms').toJSON();
    const kv = makeKvStore({
      'CurrentSessionStateV1-Version': '3',
      CurrentSessionStateV1: toJsonString(sessionJson as never),
    });
    const { run, dispatched } = makeHarness(kv, db);

    await run();

    const rows = await db.select().from(sessionsSchema);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.id).toBe(sessionJson.id);
    expect(rows[0]!.active).toBe(true);
    expect(dispatched.some((a) => (a as { type?: string }).type === 'storedSessions/putStoredSession')).toBe(true);
    expect(dispatched.some((a) => (a as { type?: string }).type === 'storedSessions/setActiveSessionId')).toBe(
      true,
    );
    expect(kv.raw.has('CurrentSessionStateV1')).toBe(false);
  });
});
