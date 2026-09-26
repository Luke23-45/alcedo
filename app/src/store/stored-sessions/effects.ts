import { AddEffectFn } from '@/store/store';
import {
  deleteExercise,
  deleteStoredSession,
  initializeStoredSessionsStateSlice,
  putStoredSession,
  restoreExercise,
  selectSession,
  sessionFinished,
  setActiveSessionId,
  setBuiltInExercises,
  setExercises,
  setHiddenBuiltInIds,
  setIsHydrated,
  setStoredSessions,
  updateExercise,
  updateStoredSession,
  upsertExercises,
  upsertStoredSessions,
} from './index';
import { fetchUpcomingSessions } from '@/store/program';
import { addUnpublishedSessionId } from '@/store/feed';
import { setStatsIsDirty } from '@/store/stats';
import { setPreferredLanguage } from '@/store/settings';
import { Session } from '@/models/session-models';
import { sessionMigrations } from '@/models/storage/versions/migrations';
import { exercisesSchema, sessionsSchema } from '@/db/schema';
import { mapRowsSkippingCorrupt } from '@/db/helpers';
import { eq, sql } from 'drizzle-orm';
import { toRecord } from '@/utils/reduce';
import { fromExerciseDescriptorJSON, toExerciseDescriptorJSON } from '@/models/exercise-models';
import { loadBuiltInExercises } from '@/services/exercise-catalog';
import { migrateLegacyCurrentSession } from '@/store/stored-sessions/legacy-current-session';
import { awaitSessionWritesFlushed, trackSessionWrite } from '@/store/stored-sessions/session-persistence';
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import type { AppDispatch, RootState } from '@/store/store';
import type { HealthExportService } from '@/services/health-export-service-shared';
import type { Logger } from '@/services/logger';

// Built-ins the user deleted, so they stay hidden across restarts and locale switches.
const hiddenBuiltInExerciseIdsStorageKey = 'HiddenBuiltInExerciseIdList';

/**
 * Clears the active-session flag in the database. Finish awaits this directly
 * (instead of relying on the setActiveSessionId effect) so killing the app
 * right after Finish can never resurrect the workout as active on restart.
 */
async function clearActiveSessionFlag(db: ExpoSQLiteDatabase): Promise<void> {
  await db.update(sessionsSchema).set({ active: false }).where(eq(sessionsSchema.active, true));
}

/**
 * Serializes every write to the sessions `active` flag through a single queue, so two
 * activations can never interleave their clear-then-set transactions. The staleness
 * guard runs at execution time: only the latest dispatch owns the flag, so a start
 * whose write runs after a finish, a superseding start, or a delete can never resurrect
 * its row as active. Reducers run synchronously on dispatch, so comparing the payload
 * against current state is exact.
 */
let activeFlagQueue: Promise<void> = Promise.resolve();

function enqueueActiveFlagWrite(
  payload: string | undefined,
  getState: () => RootState,
  db: ExpoSQLiteDatabase,
): Promise<void> {
  const run = activeFlagQueue.then(async () => {
    if (getState().storedSessions.activeSessionId !== payload) {
      return;
    }
    await db.transaction(async (tx) => {
      await tx.update(sessionsSchema).set({ active: false }).where(eq(sessionsSchema.active, true));
      if (payload === undefined) {
        return;
      }
      const session = selectSession(getState(), payload);
      if (!session) {
        return;
      }
      await tx
        .insert(sessionsSchema)
        .values({ id: session.id, active: true, payload: session.toJSON() })
        .onConflictDoUpdate({ target: sessionsSchema.id, set: { active: true } });
    });
  });
  // A failed write must not jam the queue for later writes.
  activeFlagQueue = run.catch(() => {});
  return trackSessionWrite(run);
}
/**
 * Serialized finish persistence. Every step that makes Finish durable is awaited here,
 * in order, so the UI can await {@link awaitSessionFinished} before navigating away:
 *
 * 1. The final content write lands first (tracked, awaited). A racing edit write can only
 *    ever persist payload - never the active flag - so it cannot undo the finish.
 * 2. Any racing content writes are drained; each persists the latest in-memory state,
 *    so their ordering relative to step 1 is harmless.
 * 3. The active flag is cleared with a single atomic UPDATE and awaited; the in-memory id
 *    is then cleared and the serialized flag writer re-asserts the clear. Only after this
 *    resolves is the finished state crash-safe: a kill before this point leaves the
 *    workout active (correct - the user was still "in" it), a kill after leaves it finished.
 */
async function persistSessionFinish(
  sessionId: string,
  api: {
    dispatch: AppDispatch;
    getState: () => RootState;
    db: ExpoSQLiteDatabase;
    healthExportService: HealthExportService;
    logger: Logger;
  },
): Promise<void> {
  const { dispatch, getState, db, healthExportService, logger } = api;
  const workout = selectSession(getState(), sessionId);
  if (!workout) {
    return;
  }

  try {
    await trackSessionWrite(
      db
        .insert(sessionsSchema)
        .values({
          id: workout.id,
          active: false,
          payload: workout.toJSON(),
        })
        .onConflictDoUpdate({
          target: sessionsSchema.id,
          set: {
            payload: sql.raw(`excluded.${sessionsSchema.payload.name}`),
          },
        }),
    );
    await awaitSessionWritesFlushed();

    if (getState().storedSessions.activeSessionId === workout.id) {
      // The flag clear is the durability-critical write: it runs directly (a single atomic
      // UPDATE), not delegated to a nested dispatch. The dispatch below updates the
      // in-memory id and lets the serialized flag writer re-assert the clear.
      await trackSessionWrite(clearActiveSessionFlag(db));
      dispatch(setActiveSessionId(undefined));
      await awaitSessionWritesFlushed();
    }
  } catch (e) {
    // Persistence must never strand the user on the workout screen: log the failure and
    // continue with the in-memory finish. The next successful write heals the row.
    logger.error('Failed to persist finished session', e);
  }
  dispatch(addUnpublishedSessionId(workout.id));
  dispatch(setStatsIsDirty(true));
  dispatch(fetchUpcomingSessions());

  if (!getState().settings.exportToHealthAggregator || !healthExportService.canExport()) {
    return;
  }
  try {
    await healthExportService.exportWorkout(workout);
  } catch (e) {
    logger.error('Failed to sync to health aggregator', e);
  }
}

// Finish promises keyed by session id. Registered synchronously inside the listener
// (the effect body runs sync until its first await), so a caller awaiting immediately
// after dispatch never misses the promise.
const finishPromises = new Map<string, Promise<void>>();

/**
 * Resolves when the finish persistence for the session has completed - final content
 * written and active flag cleared. Resolves immediately when no finish is in flight.
 * Persistence failures are logged inside the finish flow and never reject here, so
 * awaiting is always safe before navigating.
 */
export function awaitSessionFinished(sessionId: string): Promise<void> {
  return finishPromises.get(sessionId) ?? Promise.resolve();
}
export function applyStoredSessionsEffects(addEffect: AddEffectFn) {
  // Dispatched AFTER settings, so we can safely access settings
  addEffect(
    initializeStoredSessionsStateSlice,
    async (_, { cancelActiveListeners, getState, dispatch, onFail, extra: { keyValueStore, db, logger } }) => {
      cancelActiveListeners();
      // A hydration failure must never strand the app on the loading screen.
      onFail(() => dispatch(setIsHydrated(true)));
      // Invariant: the settings effect dispatches this action only after its
      // essential hydration (generic preferences + preferredLanguage). Full
      // settings.isHydrated is NOT required — the backup-status/pro-token
      // tail runs in parallel with this effect's DB reads.
      await logger.time('initializeStoredSessions', async () => {
        // The two table reads are independent, so they run concurrently
        // instead of two sequential round-trips.
        const [rows, exerciseRows] = await Promise.all([
          db.select().from(sessionsSchema),
          db.select().from(exercisesSchema),
        ]);
        // One corrupt payload (e.g. a backup restored from a newer app version)
        // must not fail the whole hydration and brick the app.
        const storedSessions = mapRowsSkippingCorrupt(
          rows,
          (row) => ({ id: row.id, session: Session.fromJSON(sessionMigrations.migrate(row.payload)) }),
          (row, error) => logger.error(`Skipping unreadable session row ${row.id} during hydration`, error),
        ).reduce(
          toRecord(
            (x) => x.id,
            (x) => x.session,
          ),
          {},
        );
        dispatch(setStoredSessions(storedSessions));
        // Only when there is one: dispatching `undefined` would clear every flag in the table, and a
        // kill between that write and the migration below would lose the workout in progress.
        const activeRowId = rows.find((x) => x.active)?.id;
        if (activeRowId && storedSessions[activeRowId]) {
          dispatch(setActiveSessionId(activeRowId));
        } else if (activeRowId) {
          // The active row's payload was corrupt and skipped: don't strand an
          // un-clearable orphan id — clear the flag in the DB too.
          logger.warn(`Clearing active flag on unreadable session row ${activeRowId}`, {});
          await db
            .update(sessionsSchema)
            .set({ active: false })
            .where(eq(sessionsSchema.id, activeRowId));
        }
        const savedExercises = mapRowsSkippingCorrupt(
          exerciseRows,
          (x) => ({ id: x.id, exercise: fromExerciseDescriptorJSON(x.payload) }),
          (row, error) => logger.error(`Skipping unreadable exercise row ${row.id} during hydration`, error),
        ).reduce(
          toRecord(
            (x) => x.id,
            (x) => x.exercise,
          ),
          {},
        );
        dispatch(setExercises(savedExercises));
      });

      await migrateLegacyCurrentSession(dispatch, getState, keyValueStore, db, logger);

      try {
        const builtInExercises = await loadBuiltInExercises(getState().settings.preferredLanguage);
        dispatch(setBuiltInExercises(builtInExercises));
      } catch (e) {
        logger.error('Failed to load built-in exercises, using empty catalog', e);
        dispatch(setBuiltInExercises({}));
      }

      // One corrupt key-value entry must never brick startup: validate the shape and
      // fall back to an empty list so hydration always completes.
      let hiddenBuiltInIds: string[] = [];
      try {
        const raw = await keyValueStore.getItem(hiddenBuiltInExerciseIdsStorageKey);
        const parsed: unknown = raw == null ? [] : JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
          hiddenBuiltInIds = parsed;
        } else {
          logger.warn('Ignoring malformed hidden built-in exercise id list; resetting to []', {});
        }
      } catch (e) {
        logger.error('Failed to parse hidden built-in exercise id list; resetting to []', e);
      }
      dispatch(setHiddenBuiltInIds(hiddenBuiltInIds));

      dispatch(setIsHydrated(true));
      dispatch(fetchUpcomingSessions());
    },
  );

  // Re-resolve the built-in catalog when the language changes (startup load is handled above).
  addEffect(setPreferredLanguage, async (action, { getState, dispatch }) => {
    if (!getState().storedSessions.isHydrated) {
      return;
    }
    dispatch(setBuiltInExercises(await loadBuiltInExercises(action.payload)));
  });

  // Completion, not content: a session is only exported and queued for the feed once the user is done
  // with it, otherwise every recorded set would fire a health export.
  addEffect(sessionFinished, (action, { dispatch, getState, extra: { db, healthExportService, logger } }) => {
    const done = persistSessionFinish(action.payload, {
      dispatch,
      getState,
      db,
      healthExportService,
      logger,
    });
    finishPromises.set(action.payload, done);
    return done.finally(() => {
      if (finishPromises.get(action.payload) === done) {
        finishPromises.delete(action.payload);
      }
    });
  });


  addEffect(deleteStoredSession, async (action, { extra: { logger, db } }) => {
    await logger.time('deleteStoredSession', async () => {
      await db.delete(sessionsSchema).where(eq(sessionsSchema.id, action.payload));
    });
  });
  addEffect(deleteStoredSession, async (action, { stateAfterReduce, extra: { healthExportService, logger } }) => {
    const workoutId = action.payload;
    if (!stateAfterReduce.settings.exportToHealthAggregator || !healthExportService.canExport()) {
      return;
    }
    try {
      await healthExportService.deleteWorkout(workoutId);
    } catch (e) {
      logger.error('Failed to delete workout from HealthConnect', e);
    }
  });

  // Content only. The `active` flag has a single writer below, so a recorded set never touches it.
  addEffect([putStoredSession, updateStoredSession], (action, { getState, extra: { db, logger } }) => {
    const sessionId = putStoredSession.match(action)
      ? action.payload.id
      : updateStoredSession.match(action)
        ? action.payload.sessionId
        : undefined;
    // Read at write time rather than from stateAfterReduce, so a slow write still stores the newest
    // payload if a later edit overtakes it.
    const session = sessionId === undefined ? undefined : selectSession(getState(), sessionId);
    if (!session) {
      return;
    }
    // Registered synchronously: the effect body runs sync until its first await, so a Finish
    // dispatched in the same tick still sees (and drains) this write.
    const write = trackSessionWrite(
      db
        .insert(sessionsSchema)
        .values({
          id: session.id,
          active: false,
          payload: session.toJSON(),
        })
        .onConflictDoUpdate({
          target: sessionsSchema.id,
          set: {
            payload: sql.raw(`excluded.${sessionsSchema.payload.name}`),
          },
        }),
    );
    return logger.time('persistStoredSession', async () => {
      await write;
    });
  });

  // The only writer of `active`. It upserts rather than updates so it does not depend on the row having
  // been written by the effect above first - the two are dispatched together and race.
  // Flag writes are serialized through enqueueActiveFlagWrite; its staleness guard runs at
  // execution time so only the latest dispatch wins.
  addEffect(setActiveSessionId, (action, { getState, extra: { db, logger } }) => {
    // logger.time invokes the callback synchronously, so the write is enqueued in dispatch
    // order even though the effect itself is async.
    return logger.time('setActiveSessionId', () => enqueueActiveFlagWrite(action.payload, getState, db));
  });

  addEffect(upsertStoredSessions, async (action, { cancelActiveListeners, extra: { db, logger } }) => {
    cancelActiveListeners();
    await logger.time('upsertStoredSessions', async () => {
      // Restored sessions are never active - a backup should not resume someone else's workout, and an
      // in-progress workout on this device keeps its flag because the conflict path only sets payload.
      const toUpsert = action.payload.map((x) => ({
        id: x.id,
        active: false,
        payload: x.toJSON(),
      }));
      await db
        .insert(sessionsSchema)
        .values(toUpsert)
        .onConflictDoUpdate({
          target: sessionsSchema.id,
          set: {
            payload: sql.raw(`excluded.${sessionsSchema.payload.name}`),
          },
        });
    });
  });

  addEffect(deleteExercise, async (action, { stateAfterReduce, extra: { db, keyValueStore } }) => {
    if (stateAfterReduce.storedSessions.builtInExercises[action.payload]) {
      // Built-ins are tombstoned rather than removed; their override row (if any) is kept for undo.
      await keyValueStore.setItem(
        hiddenBuiltInExerciseIdsStorageKey,
        JSON.stringify(stateAfterReduce.storedSessions.hiddenBuiltInIds),
      );
    } else {
      await db.delete(exercisesSchema).where(eq(exercisesSchema.id, action.payload));
    }
  });

  addEffect(restoreExercise, async (_, { stateAfterReduce, extra: { keyValueStore } }) => {
    await keyValueStore.setItem(
      hiddenBuiltInExerciseIdsStorageKey,
      JSON.stringify(stateAfterReduce.storedSessions.hiddenBuiltInIds),
    );
  });

  addEffect(updateExercise, async (action, { extra: { db } }) => {
    await db
      .insert(exercisesSchema)
      .values({
        id: action.payload.id,
        payload: toExerciseDescriptorJSON(action.payload.exercise),
      })
      .onConflictDoUpdate({
        target: exercisesSchema.id,
        set: {
          payload: sql.raw(`excluded.${exercisesSchema.payload.name}`),
        },
      });
  });

  addEffect(upsertExercises, async (action, { extra: { db } }) => {
    const exercises = Object.entries(action.payload).map(([id, exercise]) => ({
      id,
      payload: toExerciseDescriptorJSON(exercise),
    }));
    if (!exercises.length) {
      return;
    }
    await db
      .insert(exercisesSchema)
      .values(exercises)
      .onConflictDoUpdate({
        target: exercisesSchema.id,
        set: {
          payload: sql.raw(`excluded.${exercisesSchema.payload.name}`),
        },
      });
  });

  addEffect(setExercises, async (action, { stateAfterReduce, extra: { db } }) => {
    if (!stateAfterReduce.storedSessions.isHydrated) {
      return;
    }
    await db.transaction(async (tx) => {
      await tx.delete(exercisesSchema);
      await tx.insert(exercisesSchema).values(
        Object.entries(action.payload).map(([id, exercise]) => ({
          id,
          payload: toExerciseDescriptorJSON(exercise),
        })),
      );
    });
  });
}
