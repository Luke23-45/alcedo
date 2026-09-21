import { LiftLog } from '@/gen/proto';
import { Logger } from '@/services/logger';
import { showSnackbar } from '@/store/app';
import { AddEffectFn } from '@/store/store';
import { upsertSavedPlans } from '@/store/program';
import {
  beginFeedImport,
  importBackupData,
  importData,
  importDataProto,
  importDataSql,
  setLastExternalImport,
} from '@/store/settings';
import { upsertExercises, upsertStoredSessions } from '@/store/stored-sessions';
import { Instant } from '@js-joda/core';
import { streamToUint8Array, writeInChunks } from '@/utils/stream';
import { sleep } from '@/utils/sleep';
import { Session } from '@/models/session-models';
import { ProgramBlueprint } from '@/models/blueprint-models';
import { ProtobufToJsonV1Migrator } from '@/models/storage/versions/initial/protobuf-migrator';
import {
  FeedIdentity,
  FollowerFeedUser,
  FollowRequestInboxMessage,
  fromFeedUserJSON,
  SessionUserEvent,
} from '@/models/feed-models';
import { deserializeDatabaseAsync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { eq, sql } from 'drizzle-orm';
import { DatabaseMigrationService } from '@/services/database-migration-service';
import { FeedBackupData } from '@/models/backup';
import {
  dataMigrationsSchema,
  exercisesSchema,
  feedFollowedUsersSchema,
  feedFollowerUsersSchema,
  feedFollowRequestsSchema,
  feedIdentitySchema,
  feedItemsSchema,
  feedPendingUsersSchema,
  programsSchema,
  sessionsSchema,
} from '@/db/schema';
import { migrateNilWeightUnitsDataMigration } from '@/services/data-migrations/migrate-nil-weight-units';
import { toRecord } from '@/utils/reduce';
import {
  followRequestInboxMessageMigrations,
  feedIdentityMigrations,
  sessionUserEventMigrations,
  followedFeedUserMigrations,
  followerFeedUserMigrations,
  exerciseDescriptorMigrations,
  programBlueprintMigrations,
  sessionMigrations,
  pendingFeedUserMigrations,
} from '@/models/storage/versions/migrations';
import { FeedUserJSON } from '@/models/storage/versions/latest';
import { fromExerciseDescriptorJSON, toExerciseDescriptorJSON } from '@/models/exercise-models';
import { mapRowsSkippingCorrupt, upsert } from '@/db/helpers';

export function addImportBackupEffects(addEffect: AddEffectFn) {
  addEffect(importData, async (_, { dispatch, extra: { filePickerService, logger, tolgee } }) => {
    const file = await filePickerService.pickFile();
    if (!file) {
      return;
    }
    dispatch(
      showSnackbar({
        text: tolgee.t('Beginning restore'),
      }),
    );
    await sleep(200);
    const gunzipped = await unGzipIfZipped(file.bytes, logger);
    const parsedProto = tryParseProto(gunzipped, logger);
    if (parsedProto) {
      dispatch(importDataProto({ dao: parsedProto }));
      return;
    } else {
      logger.warn('Failed to deserialize data into proto, trying sqlite', {});
    }
    try {
      const db = await deserializeDatabaseAsync(gunzipped);
      dispatch(importDataSql({ db }));
    } catch (err) {
      logger.warn('Failed to deserialize sql', { err });
      dispatch(
        showSnackbar({
          text: 'Could not import data: Unexpected format.',
        }),
      );
    }
  });

  addEffect(importBackupData, async ({ payload }, { dispatch, extra: { db, databaseMigrationService } }) => {
    const { workouts, programs, exercises, feed, successMessage, externalImport } = payload;
    // Durable first: write the imported rows to SQLite and await them, so the
    // success announcement below is never a lie. The store actions dispatched
    // next update Redux state; their persistence effects re-upsert identical
    // data (payload-only conflict path, idempotent), so a later effect run
    // changes nothing.
    await upsert(
      db,
      sessionsSchema,
      workouts.map((x) => ({ id: x.id, payload: x.toJSON() })),
    );
    // programs.active is NOT NULL without a default, so it must be carried
    // explicitly. Restored programs are never the active plan — an import must
    // not switch the user's current plan; the state persist effect rewrites
    // the correct active flags from Redux afterwards. The conflict path
    // preserves the existing active flag, exactly like the upsert helper.
    if (Object.keys(programs).length) {
      await db
        .insert(programsSchema)
        .values(
          Object.entries(programs).map(([id, program]) => ({
            id,
            active: false,
            payload: program.toJSON(),
          })),
        )
        .onConflictDoUpdate({
          target: programsSchema.id,
          set: {
            payload: sql.raw(`excluded.${programsSchema.payload.name}`),
          },
        });
    }
    if (exercises) {
      await upsert(
        db,
        exercisesSchema,
        Object.entries(exercises).map(([id, exercise]) => ({ id, payload: toExerciseDescriptorJSON(exercise) })),
      );
    }
    dispatch(upsertStoredSessions(workouts));
    dispatch(upsertSavedPlans(programs));
    if (exercises) {
      dispatch(upsertExercises(exercises));
    }
    if (externalImport) {
      // The sessions are in the store now — this is the real success point
      // for the last-imported card, not the dispatch of the import request.
      dispatch(
        setLastExternalImport({
          time: Instant.now(),
          workoutCount: externalImport.workoutCount,
          format: externalImport.format,
          setCount: externalImport.setCount,
        }),
      );
    }
    dispatch(
      showSnackbar({
        text: successMessage,
      }),
    );
    // Let the data migration re-run on next launch so imported nil-unit weights get coalesced
    await db.delete(dataMigrationsSchema).where(eq(dataMigrationsSchema.id, migrateNilWeightUnitsDataMigration));
    await databaseMigrationService.migrate();
    if (feed) {
      dispatch(beginFeedImport(feed));
    }
  });

  addEffect(importDataSql, async (action, { dispatch, extra: { logger, tolgee } }) => {
    try {
      const {
        payload: { db: backupDb },
      } = action;
      const drizzleBackupDb = drizzle(backupDb);
      const migrator = new DatabaseMigrationService(drizzleBackupDb, logger, {
        importOldData: async () => {},
      });

      await migrator.migrate();
      // One unreadable row in the backup file must not abort the whole restore;
      // corrupt payloads are logged and skipped, the rest still imports.
      const workouts = mapRowsSkippingCorrupt(
        await drizzleBackupDb.select().from(sessionsSchema),
        (x) => Session.fromJSON(sessionMigrations.migrate(x.payload)),
        (row, error) => logger.warn('Skipping unreadable session in backup file', { id: row.id, error }),
      );
      const programs = mapRowsSkippingCorrupt(
        await drizzleBackupDb.select().from(programsSchema),
        (x) => ({ id: x.id, program: ProgramBlueprint.fromJSON(programBlueprintMigrations.migrate(x.payload)) }),
        (row, error) => logger.warn('Skipping unreadable program in backup file', { id: row.id, error }),
      ).reduce(
        toRecord(
          (x) => x.id,
          (x) => x.program,
        ),
        {},
      );
      const exercises = mapRowsSkippingCorrupt(
        await drizzleBackupDb.select().from(exercisesSchema),
        (x) => ({ id: x.id, exercise: fromExerciseDescriptorJSON(exerciseDescriptorMigrations.migrate(x.payload)) }),
        (row, error) => logger.warn('Skipping unreadable exercise in backup file', { id: row.id, error }),
      ).reduce(
        toRecord(
          (x) => x.id,
          (x) => x.exercise,
        ),
        {},
      );
      const feedIdentityDb = (await drizzleBackupDb.select().from(feedIdentitySchema)).at(0);

      let feed: FeedBackupData | undefined;
      if (feedIdentityDb) {
        feed = {
          identity: FeedIdentity.fromJSON(feedIdentityDb.payload),
          feedItems: mapRowsSkippingCorrupt(
            await drizzleBackupDb.select().from(feedItemsSchema),
            (x) => SessionUserEvent.fromJSON(sessionUserEventMigrations.migrate(x.payload)),
            (row, error) => logger.warn('Skipping unreadable feed item in backup file', { id: row.id, error }),
          ),
          followRequests: mapRowsSkippingCorrupt(
            await drizzleBackupDb.select().from(feedFollowRequestsSchema),
            (x) => FollowRequestInboxMessage.fromJSON(x.payload),
            (row, error) => logger.warn('Skipping unreadable follow request in backup file', { id: row.id, error }),
          ),
          followed: mapRowsSkippingCorrupt(
            (
              (await drizzleBackupDb.select().from(feedFollowedUsersSchema)) as {
                payload: FeedUserJSON;
              }[]
            ).concat(await drizzleBackupDb.select().from(feedPendingUsersSchema)),
            (x) => fromFeedUserJSON(x.payload),
            (_, error) => logger.warn('Skipping unreadable followed user in backup file', error),
          ),
          followers: mapRowsSkippingCorrupt(
            await drizzleBackupDb.select().from(feedFollowerUsersSchema),
            (x) => FollowerFeedUser.fromJSON(x.payload),
            (row, error) => logger.warn('Skipping unreadable follower in backup file', { id: row.id, error }),
          ),
        };
      }

      dispatch(
        importBackupData({
          programs,
          exercises,
          workouts,
          feed,
          successMessage: tolgee.t('Restore complete!'),
        }),
      );
    } finally {
      await action.payload.db.closeAsync();
    }
  });

  addEffect(importDataProto, async ({ payload: { dao } }, { dispatch, extra: { logger, tolgee } }) => {
    // One unreadable entry in the backup file must not abort the whole restore;
    // corrupt entries are logged and skipped, the rest still imports.
    const workouts = mapRowsSkippingCorrupt(
      dao.sessions,
      (s) => Session.fromJSON(sessionMigrations.migrate(ProtobufToJsonV1Migrator.migrateSession(s))),
      (_, error) => logger.warn('Skipping unreadable session in backup file', error),
    );
    const programs = Object.fromEntries(
      mapRowsSkippingCorrupt(
        Object.entries(dao.savedPrograms),
        ([id, program]) =>
          [
            id,
            ProgramBlueprint.fromJSON(
              programBlueprintMigrations.migrate(ProtobufToJsonV1Migrator.migrateProgramBlueprint(program)),
            ),
          ] as const,
        ([id], error) => logger.warn('Skipping unreadable program in backup file', { id, error }),
      ),
    );
    let feed: FeedBackupData | undefined;
    if (dao.feedState?.identity) {
      feed = {
        identity: FeedIdentity.fromJSON(
          feedIdentityMigrations.migrate(ProtobufToJsonV1Migrator.migrateFeedIdentity(dao.feedState.identity)),
        ),
        feedItems: mapRowsSkippingCorrupt(
          dao.feedState.feedItems ?? [],
          (x) =>
            SessionUserEvent.fromJSON(
              sessionUserEventMigrations.migrate(ProtobufToJsonV1Migrator.migrateSessionUserEvent(x)),
            ),
          (_, error) => logger.warn('Skipping unreadable feed item in backup file', error),
        ),
        followed: mapRowsSkippingCorrupt(
          dao.feedState.followedUsers ?? [],
          (x) => {
            const json = ProtobufToJsonV1Migrator.migrateFollowedUser(x);
            return fromFeedUserJSON(
              json.type === 'FollowedFeedUser'
                ? followedFeedUserMigrations.migrate(json)
                : pendingFeedUserMigrations.migrate(json),
            );
          },
          (_, error) => logger.warn('Skipping unreadable followed user in backup file', error),
        ),
        followers: mapRowsSkippingCorrupt(
          dao.feedState.followers ?? [],
          (x) =>
            FollowerFeedUser.fromJSON(
              followerFeedUserMigrations.migrate(ProtobufToJsonV1Migrator.migrateFollowerUser(x)),
            ),
          (_, error) => logger.warn('Skipping unreadable follower in backup file', error),
        ),
        followRequests: mapRowsSkippingCorrupt(
          dao.feedState.followRequests ?? [],
          (x) =>
            FollowRequestInboxMessage.fromJSON(
              followRequestInboxMessageMigrations.migrate(ProtobufToJsonV1Migrator.migrateFollowRequest(x)),
            ),
          (_, error) => logger.warn('Skipping unreadable follow request in backup file', error),
        ),
      };
    }
    dispatch(
      importBackupData({
        workouts,
        programs,
        feed,
        successMessage: tolgee.t('Restore complete!'),
      }),
    );
  });
}

function tryParseProto(
  bytes: Uint8Array,
  logger: Logger,
): LiftLog.Ui.Models.ExportedDataDao.ExportedDataDaoV2 | undefined {
  try {
    return LiftLog.Ui.Models.ExportedDataDao.ExportedDataDaoV2.decode(bytes);
  } catch (e) {
    logger.warn('Could not parse bytes as proto', e);
    return undefined;
  }
}

async function unGzipIfZipped(bytes: Uint8Array, logger: Logger): Promise<Uint8Array> {
  try {
    const stream = new DecompressionStream('gzip');

    const writer = stream.writable.getWriter();

    // Start reading from the stream immediately
    const decompressPromise = streamToUint8Array(stream.readable);
    await writeInChunks(writer, bytes);
    await writer.close();
    const gunzipped = await decompressPromise;
    return gunzipped;
  } catch (e) {
    logger.warn('Could not unzip bytes', e);
    return bytes;
  }
}
