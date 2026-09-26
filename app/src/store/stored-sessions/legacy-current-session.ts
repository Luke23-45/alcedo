import { sessionsSchema } from '@/db/schema';
import { Alcedo } from '@/gen/proto';
import { Session } from '@/models/session-models';
import { ProtobufToJsonV1Migrator } from '@/models/storage/versions/initial/protobuf-migrator';
import { fromJsonString, JsonString } from '@/models/storage/versions/latest';
import { AnyVersionSessionJSON } from '@/models/storage/versions/any';
import { sessionMigrations } from '@/models/storage/versions/migrations/session';
import { KeyValueStore } from '@/services/key-value-store';
import { Logger } from '@/services/logger';
import { copyLogs, showSnackbar } from '@/store/app';
import { selectPreferredWeightUnit } from '@/store/settings';
import { putStoredSession, setActiveSessionId } from '@/store/stored-sessions';
import { AppDispatch, RootState } from '@/store/store';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { eq } from 'drizzle-orm';

/**
 * Before the session table owned the in-progress workout, it lived in its own key-value file. This
 * lifts whatever is still there into the table and then removes the keys, so it runs at most once per
 * install. Delete once no supported version can still be carrying one.
 */
const storageKey = 'CurrentSessionStateV1';

export async function migrateLegacyCurrentSession(
  dispatch: AppDispatch,
  getState: () => RootState,
  keyValueStore: KeyValueStore,
  db: ExpoSQLiteDatabase,
  logger: Logger,
) {
  try {
    const version = await keyValueStore.getItem(`${storageKey}-Version`);
    const raw = await keyValueStore.getItem(storageKey);
    // v2 stored raw bytes; only fall back to the byte read when there is no string payload.
    const rawBytes = raw == null ? await keyValueStore.getItemBytes(storageKey) : undefined;
    // getItem resolves absent keys to undefined, not null — compare loosely.
    if (version == null && raw == null && rawBytes == null) {
      return;
    }

    // Only v2 ever left the version key unwritten. A torn version key falls back to
    // payload sniffing instead of blindly feeding JSON bytes to the protobuf decoder.
    const sessions =
      version === '3' || (version !== '2' && isJsonPayload(raw))
        ? readV3Json(raw, getState)
        : await readV2Proto(rawBytes ?? new Uint8Array(), getState);

    // Persist the rows directly BEFORE dispatching and removing the legacy keys: the
    // putStoredSession listener effects write to SQLite fire-and-forget, so a kill in
    // that window would otherwise delete the only copy of the in-progress workout.
    if (sessions.workoutSession) {
      const workout = sessions.workoutSession;
      const payload = workout.toJSON();
      // Decide before writing: when a newer live workout owns the active
      // flag, the legacy row is preserved as history-only and must not steal
      // it (two active rows would violate the partial unique index).
      const liveActiveId = getState().storedSessions.activeSessionId;
      const takeActive = !liveActiveId || liveActiveId === workout.id;
      if (takeActive) {
        await db.update(sessionsSchema).set({ active: false }).where(eq(sessionsSchema.active, true));
      }
      await db
        .insert(sessionsSchema)
        .values({ id: workout.id, active: takeActive, payload })
        .onConflictDoUpdate({ target: sessionsSchema.id, set: { active: takeActive, payload } });
      dispatch(putStoredSession(workout));
      if (takeActive) {
        dispatch(setActiveSessionId(workout.id));
      } else {
        logger.warn('Legacy session migration found a different live active session; keeping it', {});
      }
    }
    // An edit that was open when the app last closed. It shares its id with the row it came from, so
    // storing it preserves the user's work rather than duplicating it.
    if (sessions.historySession) {
      const history = sessions.historySession;
      const payload = history.toJSON();
      await db
        .insert(sessionsSchema)
        .values({ id: history.id, active: false, payload })
        .onConflictDoUpdate({ target: sessionsSchema.id, set: { active: false, payload } });
      dispatch(putStoredSession(history));
    }

    await keyValueStore.removeItem(storageKey);
    await keyValueStore.removeItem(`${storageKey}-Version`);
  } catch (e) {
    logger.error('Failed to migrate the legacy current session', e);
    dispatch(
      showSnackbar({
        text: 'Failed to load current session. Please submit a bug report with your logs in settings!',
        action: 'Copy logs',
        dispatchAction: copyLogs(),
      }),
    );
  }
}

function isJsonPayload(raw: string | null | undefined): boolean {
  return raw != null && raw.trimStart().startsWith('{');
}

async function readV2Proto(bytes: Uint8Array, getState: () => RootState) {
  const dao = Alcedo.Ui.Models.CurrentSessionStateDao.CurrentSessionStateDaoV2.decode(bytes);
  const preferredWeightUnit = selectPreferredWeightUnit(getState());
  const restore = (session: typeof dao.workoutSession) =>
    session
      ? Session.fromJSON(sessionMigrations.migrate(ProtobufToJsonV1Migrator.migrateSession(session))).withNoNilWeights(
          preferredWeightUnit,
        )
      : undefined;

  return {
    workoutSession: restore(dao.workoutSession),
    historySession: restore(dao.historySession),
  };
}

function readV3Json(raw: string | null | undefined, getState: () => RootState) {
  const json = raw ?? 'null';
  const payload = fromJsonString(json as JsonString<AnyVersionSessionJSON | null>);
  const preferredWeightUnit = selectPreferredWeightUnit(getState());

  return {
    workoutSession: payload
      ? Session.fromJSON(sessionMigrations.migrate(payload)).withNoNilWeights(preferredWeightUnit)
      : undefined,
    historySession: undefined,
  };
}
