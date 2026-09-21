/**
 * Page 2/20 — Active workout flow simulation: process death and relaunch.
 *
 * The scenario the design demands but no device in the loop can easily
 * prove: a workout is in progress, the OS kills the app mid-set, and the
 * relaunch restores the exact active session — no invented data, no lost
 * sets. This drives the real reducers and effects against a real (in-memory)
 * SQLite database: persist a live session with the active flag, throw the
 * whole store away ("kill"), then run the real startup hydration
 * ("relaunch") and read the session back through the real selectors.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocalDate } from '@js-joda/core';
import { combineReducers } from '@reduxjs/toolkit';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { openDatabaseAsync } from 'expo-sqlite';
import { DatabaseMigrationService } from '@/services/database-migration-service';
import { applyStoredSessionsEffects } from '@/store/stored-sessions/effects';
import {
  initializeStoredSessionsStateSlice,
  putStoredSession,
  selectActiveSession,
  selectActiveSessionId,
  setActiveSessionId,
  storedSessionsReducer,
  updateStoredSession,
} from '@/store/stored-sessions';
import { settingsReducer } from '@/store/settings';
import { createAddEffectTestBed } from '@/utils/__test__/add-effect-testbed';
import { sessionsSchema } from '@/db/schema';
import { Session } from '@/models/session-models';
import type { RootState } from '@/store/store';

// The exercise catalog is irrelevant to session restore; keep asset loading
// out of this simulation.
vi.mock('@/services/exercise-catalog', () => ({
  loadBuiltInExercises: async () => ({}),
  loadCanonicalBuiltInExercises: async () => ({}),
}));

// The slices the restore path touches; the testbed merges the given initial
// state over this so every dispatch runs the real reducers.
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

describe('process death and relaunch', () => {
  let db: ExpoSQLiteDatabase;

  beforeEach(async () => {
    db = await createTestDb();
  });

  /** A live store wired to the shared database, like the running app. */
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

  function stateOf(testBed: ReturnType<typeof liveStore>): RootState {
    return testBed.getState() as unknown as RootState;
  }

  it('restores the exact workout in progress after a kill', async () => {
    const session = Session.freeformSession(LocalDate.of(2026, 9, 22), undefined);
    const beforeKill = liveStore();
    await beforeKill.dispatchHandled(putStoredSession(session));
    await beforeKill.dispatchHandled(setActiveSessionId(session.id));
    // One more set lands right before the kill — this is the write that must not be lost.
    await beforeKill.dispatchHandled(updateStoredSession({ sessionId: session.id, update: (s) => s }));

    // Kill: the entire store is discarded. Only SQLite survives.
    const afterKill = liveStore();

    // Relaunch: the real startup hydration runs.
    await afterKill.dispatchHandled(initializeStoredSessionsStateSlice());

    const state = stateOf(afterKill);
    expect(selectActiveSessionId(state)).toBe(session.id);
    const restored = selectActiveSession(state);
    expect(restored).toBeDefined();
    expect(restored!.id).toBe(session.id);
    expect(restored!.toJSON()).toEqual(session.toJSON());
  });

  it('restores the session payload, not just the id', async () => {
    const session = Session.freeformSession(LocalDate.of(2026, 9, 22), undefined);
    const beforeKill = liveStore();
    await beforeKill.dispatchHandled(putStoredSession(session));
    await beforeKill.dispatchHandled(setActiveSessionId(session.id));

    const afterKill = liveStore();
    await afterKill.dispatchHandled(initializeStoredSessionsStateSlice());

    const restored = selectActiveSession(stateOf(afterKill));
    expect(restored).toBeDefined();
    expect(restored!.date.equals(LocalDate.of(2026, 9, 22))).toBe(true);
  });

  it('does not invent an active session when none was in progress', async () => {
    const session = Session.freeformSession(LocalDate.of(2026, 9, 22), undefined);
    const beforeKill = liveStore();
    await beforeKill.dispatchHandled(putStoredSession(session));
    // No setActiveSessionId: the workout was finished or never started.

    const afterKill = liveStore();
    await afterKill.dispatchHandled(initializeStoredSessionsStateSlice());

    const state = stateOf(afterKill);
    expect(selectActiveSessionId(state)).toBeUndefined();
    expect(selectActiveSession(state)).toBeUndefined();
  });

  it('a finished workout is not resurrected as active after relaunch', async () => {
    const session = Session.freeformSession(LocalDate.of(2026, 9, 22), undefined);
    const beforeKill = liveStore();
    await beforeKill.dispatchHandled(putStoredSession(session));
    await beforeKill.dispatchHandled(setActiveSessionId(session.id));
    // Finish clears the flag in SQLite.
    await beforeKill.dispatchHandled(setActiveSessionId(undefined));

    const afterKill = liveStore();
    await afterKill.dispatchHandled(initializeStoredSessionsStateSlice());

    expect(selectActiveSessionId(stateOf(afterKill))).toBeUndefined();
  });

  it('a mid-set write never steals or drops the active flag', async () => {
    const session = Session.freeformSession(LocalDate.of(2026, 9, 22), undefined);
    const store = liveStore();
    await store.dispatchHandled(putStoredSession(session));
    await store.dispatchHandled(setActiveSessionId(session.id));
    // The content write runs on every keystroke/set log; it must not clear the flag.
    await store.dispatchHandled(updateStoredSession({ sessionId: session.id, update: (s) => s }));

    const rows = await db.select().from(sessionsSchema);
    expect(rows.filter((x) => x.active).map((x) => x.id)).toEqual([session.id]);
  });
});
