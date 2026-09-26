/**
 * Finish durability: the serialized sessionFinished flow.
 *
 * The design demand: tapping Finish must not return (navigate) until the final content
 * and the cleared active flag are durable in SQLite. A kill between navigation and the
 * old fire-and-forget writes resurrected the finished workout on restart. These tests
 * drive the real effects against a real (in-memory) SQLite database.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocalDate } from '@js-joda/core';
import { combineReducers } from '@reduxjs/toolkit';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { openDatabaseAsync } from 'expo-sqlite';
import type { UnknownAction } from '@reduxjs/toolkit';
import { DatabaseMigrationService } from '@/services/database-migration-service';
import { applyStoredSessionsEffects } from '@/store/stored-sessions/effects';
import {
  awaitSessionFinished,
  putStoredSession,
  selectActiveSessionId,
  sessionFinished,
  setActiveSessionId,
  storedSessionsReducer,
} from '@/store/stored-sessions';
import { settingsReducer } from '@/store/settings';
import { createAddEffectTestBed } from '@/utils/__test__/add-effect-testbed';
import { sessionsSchema } from '@/db/schema';
import { Session } from '@/models/session-models';
import type { RootState } from '@/store/store';

// The exercise catalog is irrelevant to finish persistence; keep asset loading out.
vi.mock('@/services/exercise-catalog', () => ({
  loadBuiltInExercises: async () => ({}),
  loadCanonicalBuiltInExercises: async () => ({}),
}));

const testReducer = combineReducers({
  settings: settingsReducer,
  storedSessions: storedSessionsReducer,
});

async function createTestDb(): Promise<ExpoSQLiteDatabase> {
  const expoDb = await openDatabaseAsync(':memory:');
  const db = drizzle(expoDb);
  const timeStub = async (_: string, action: () => unknown) => action();
  await new DatabaseMigrationService(
    db,
    {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
      time: timeStub,
    } as never,
    { importOldData: async () => {} },
  ).migrate();
  return db;
}

function makeKvStore() {
  return {
    getItem: vi.fn().mockResolvedValue(null),
    getItemBytes: vi.fn().mockResolvedValue(null),
    setItem: vi.fn().mockResolvedValue(undefined),
    removeItem: vi.fn().mockResolvedValue(undefined),
  };
}

const timeStub = async (_: string, action: () => unknown) => action();
const logger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  time: timeStub,
};

describe('session finish durability', () => {
  let db: ExpoSQLiteDatabase;

  beforeEach(async () => {
    db = await createTestDb();
    vi.clearAllMocks();
  });

  function liveStore() {
    const testBed = createAddEffectTestBed({
      reducer: testReducer,
      initialState: {
        settings: { isHydrated: true, preferredLanguage: 'en' },
      } as Partial<RootState>,
      services: {
        db,
        logger,
        keyValueStore: makeKvStore(),
        healthExportService: { canExport: () => false },
      },
    });
    applyStoredSessionsEffects(testBed.addEffect);
    return testBed;
  }

  /** Captures the raw listener functions so a test can invoke one out of band. */
  function captureListeners() {
    const listeners = new Map<string, (action: UnknownAction, api: never) => unknown>();
    applyStoredSessionsEffects(((actions: never, effect: never) => {
      for (const a of [actions].flat() as Array<{ type: string }>) {
        listeners.set(a.type, effect as never);
      }
    }) as never);
    return listeners;
  }

  function listenerApiFor(testBed: ReturnType<typeof liveStore>) {
    return {
      dispatch: (a: UnknownAction) => testBed.dispatch(a),
      getState: () => testBed.getState() as unknown as RootState,
      stateBeforeReduce: testBed.getState() as unknown as RootState,
      stateAfterReduce: testBed.getState() as unknown as RootState,
      extra: {
        db,
        logger,
        keyValueStore: makeKvStore(),
        healthExportService: { canExport: () => false },
      },
      signal: new AbortController().signal,
      onFail: () => {},
      cancelActiveListeners: vi.fn(),
      throwIfCancelled: vi.fn(),
    } as never;
  }

  async function activeFlagInDb(sessionId: string): Promise<boolean | undefined> {
    const rows = await db.select().from(sessionsSchema);
    return rows.find((r) => r.id === sessionId)?.active;
  }

  it('finish writes the final content and clears the active flag in the database', async () => {
    const session = Session.freeformSession(LocalDate.of(2026, 9, 26), undefined);
    const store = liveStore();
    await store.dispatchHandled(putStoredSession(session));
    await store.dispatchHandled(setActiveSessionId(session.id));
    expect(await activeFlagInDb(session.id)).toBe(true);

    await store.dispatchHandled(sessionFinished(session.id));

    // Durable: content present, flag cleared, in-memory state cleared.
    expect(await activeFlagInDb(session.id)).toBe(false);
    const rows = await db.select().from(sessionsSchema);
    expect(rows.find((r) => r.id === session.id)).toBeDefined();
    expect(selectActiveSessionId(store.getState() as unknown as RootState)).toBeUndefined();
  });

  it('a stale start effect that runs after finish does not resurrect the workout', async () => {
    const session = Session.freeformSession(LocalDate.of(2026, 9, 26), undefined);
    const store = liveStore();
    const listeners = captureListeners();
    await store.dispatchHandled(putStoredSession(session));
    await store.dispatchHandled(setActiveSessionId(session.id));
    expect(await activeFlagInDb(session.id)).toBe(true);

    await store.dispatchHandled(sessionFinished(session.id));
    expect(await activeFlagInDb(session.id)).toBe(false);

    // The original start's DB effect finally runs - late. It must not flip the row back.
    const startEffect = listeners.get(setActiveSessionId.type);
    expect(startEffect).toBeDefined();
    await startEffect!(setActiveSessionId(session.id), listenerApiFor(store));

    expect(await activeFlagInDb(session.id)).toBe(false);
    expect(selectActiveSessionId(store.getState() as unknown as RootState)).toBeUndefined();
  });

  it('a rapid start A then start B leaves only B active', async () => {
    const sessionA = Session.freeformSession(LocalDate.of(2026, 9, 26), undefined);
    const sessionB = Session.freeformSession(LocalDate.of(2026, 9, 26), undefined);
    const store = liveStore();
    const listeners = captureListeners();
    await store.dispatchHandled(putStoredSession(sessionA));
    await store.dispatchHandled(putStoredSession(sessionB));

    // Both dispatches land before either DB effect runs; the reducer already says B.
    store.dispatch(setActiveSessionId(sessionA.id));
    store.dispatch(setActiveSessionId(sessionB.id));

    const startEffect = listeners.get(setActiveSessionId.type);
    expect(startEffect).toBeDefined();
    await startEffect!(setActiveSessionId(sessionA.id), listenerApiFor(store));
    await startEffect!(setActiveSessionId(sessionB.id), listenerApiFor(store));

    expect(await activeFlagInDb(sessionA.id)).toBe(false);
    expect(await activeFlagInDb(sessionB.id)).toBe(true);
  });

  it('awaitSessionFinished resolves once the finish persistence completes', async () => {
    const session = Session.freeformSession(LocalDate.of(2026, 9, 26), undefined);
    const store = liveStore();
    const listeners = captureListeners();
    await store.dispatchHandled(putStoredSession(session));
    await store.dispatchHandled(setActiveSessionId(session.id));

    // Invoke the listener the way the real middleware does: synchronously on dispatch,
    // without awaiting. Registration must already have happened.
    const finishEffect = listeners.get(sessionFinished.type);
    expect(finishEffect).toBeDefined();
    const api = listenerApiFor(store);
    const effectPromise = finishEffect!(sessionFinished(session.id), api) as Promise<void>;

    // The finish is registered synchronously, but not yet complete: a microtask must
    // not win the race against the real SQLite work.
    const pending = awaitSessionFinished(session.id);
    let settled = false;
    void pending.then(() => {
      settled = true;
    });
    const race = await Promise.race([pending.then(() => 'finish'), Promise.resolve().then(() => 'tick')]);
    expect(race).toBe('tick');
    expect(settled).toBe(false);

    await effectPromise;
    await pending;
    expect(settled).toBe(true);
    expect(await activeFlagInDb(session.id)).toBe(false);
  });

  it('awaitSessionFinished resolves immediately when no finish is in flight', async () => {
    await expect(awaitSessionFinished('no-such-session')).resolves.toBeUndefined();
  });
});
