import {
  beginFeedImport,
  importBackupData,
  importData,
  importDataProto,
  importDataSql,
  setLastExternalImport,
} from '@/store/settings';
import { addImportBackupEffects } from '@/store/settings/import-backup-effects';
import { createAddEffectTestBed } from '@/utils/__test__/add-effect-testbed';
import { describe, expect, it, vi } from 'vitest';
import { readFile } from 'node:fs/promises';
import { resolve } from 'path';
import { FeedBackupData } from '@/models/backup';
import { FeedIdentity } from '@/models/feed-models';
import { ProgramBlueprint } from '@/models/blueprint-models';
import { EmptySession, Session } from '@/models/session-models';
import { uuid } from '@/utils/uuid';
import { upsertExercises, upsertStoredSessions } from '@/store/stored-sessions';
import { upsertSavedPlans } from '@/store/program';
import { showSnackbar, SnackbarDescriptor } from '@/store/app';

/** Narrows the snackbar union to its one-line text (these specs only assert legacy snackbars). */
function snackbarText(payload: SnackbarDescriptor): string | undefined {
  return 'text' in payload ? payload.text : undefined;
}

describe('import-backup-effects', () => {
  it('dispatches a valid import when the sqlite db is there', async () => {
    const realBytes = await readFile(resolve(__dirname, '../../utils/__test__/export.liftlogbackup.sqlite.gz'));
    const testBed = createAddEffectTestBed({
      services: {
        filePickerService: {
          pickFile: vi.fn().mockResolvedValue({ bytes: realBytes }),
        },
        tolgee: { t: (s: string) => s },
      },
    });

    addImportBackupEffects(testBed.addEffect);
    await testBed.dispatchHandled(importData());
    const importDataSqlAction = testBed.getDispatchedAction(importDataSql);

    await testBed.dispatchHandled(importDataSqlAction);

    const dispatchedImport = testBed.getDispatchedAction(importBackupData);
    expect(dispatchedImport.payload.workouts).toHaveLength(420);
    expect(dispatchedImport.payload.feed).toBeDefined();
    expect(Object.values(dispatchedImport.payload.programs)).toHaveLength(13);
    expect(Object.values(dispatchedImport.payload.exercises ?? {})).toHaveLength(962);
    expect(dispatchedImport.payload.successMessage).toBe('Restore complete!');
  });

  it('dispatches a valid import when it is a proto', async () => {
    const realBytes = await readFile(resolve(__dirname, '../../utils/__test__/export.liftlogbackup.protobuf.gz'));
    const testBed = createAddEffectTestBed({
      services: {
        filePickerService: {
          pickFile: vi.fn().mockResolvedValue({ bytes: realBytes }),
        },
        tolgee: { t: (s: string) => s },
      },
    });

    addImportBackupEffects(testBed.addEffect);
    await testBed.dispatchHandled(importData());
    const importDataSqlAction = testBed.getDispatchedAction(importDataProto);

    await testBed.dispatchHandled(importDataSqlAction);

    const dispatchedImport = testBed.getDispatchedAction(importBackupData);
    expect(dispatchedImport.payload.workouts).toHaveLength(85);
    expect(dispatchedImport.payload.feed).toBeUndefined();
    expect(Object.values(dispatchedImport.payload.programs)).toHaveLength(0);
    expect(dispatchedImport.payload.successMessage).toBe('Restore complete!');
  });
  it('dispatches the appropriate actions when importing', async () => {
    const testBed = createAddEffectTestBed({
      services: {
        tolgee: { t: (s: string) => s },
        db: { delete: () => ({ where: () => Promise.resolve() }) } as never,
        databaseMigrationService: { migrate: vi.fn() } as never,
      },
    });
    addImportBackupEffects(testBed.addEffect);

    const mockWorkouts = [EmptySession, EmptySession.with({ id: uuid() })] as Session[];
    const mockPrograms = {} as Record<string, ProgramBlueprint>;
    const mockExercises = {
      custom: {
        name: 'Custom exercise',
        force: null,
        level: '',
        mechanic: null,
        equipment: null,
        muscles: [],
        instructions: '',
        category: '',
      },
    };
    const mockFeed: FeedBackupData = {
      identity: {} as FeedIdentity,
      feedItems: [],
      followRequests: [],
      followed: [],
      followers: [],
    };

    await testBed.dispatchHandled(
      importBackupData({
        workouts: mockWorkouts,
        programs: mockPrograms,
        exercises: mockExercises,
        feed: mockFeed,
        successMessage: 'Restore complete!',
      }),
    );

    expect(testBed.getDispatchedAction(upsertStoredSessions).payload).toBe(mockWorkouts);
    expect(testBed.getDispatchedAction(upsertSavedPlans).payload).toBe(mockPrograms);
    expect(testBed.getDispatchedAction(upsertExercises).payload).toBe(mockExercises);
    expect(snackbarText(testBed.getDispatchedAction(showSnackbar).payload)).toBe('Restore complete!');
    expect(testBed.getDispatchedAction(beginFeedImport).payload).toBe(mockFeed);
  });

  it('records last-import metadata after the upserts commit, for external imports', async () => {
    const testBed = createAddEffectTestBed({
      services: {
        tolgee: { t: (s: string) => s },
        db: { delete: () => ({ where: () => Promise.resolve() }) } as never,
        databaseMigrationService: { migrate: vi.fn() } as never,
      },
    });
    addImportBackupEffects(testBed.addEffect);

    await testBed.dispatchHandled(
      importBackupData({
        workouts: [EmptySession],
        programs: {},
        successMessage: 'Imported 1 workout(s)',
        externalImport: { format: 'StrongLifts', workoutCount: 1, setCount: 5 },
      }),
    );

    const lastImport = testBed.getDispatchedAction(setLastExternalImport).payload!;
    expect(lastImport).toMatchObject({
      workoutCount: 1,
      format: 'StrongLifts',
      setCount: 5,
    });
    expect(lastImport.time).toBeDefined();

    // The metadata lands after the sessions hit the store — the real success
    // point, not the dispatch of the import request.
    const types = testBed.dispatchedActions.map((a) => a.type);
    expect(types.indexOf(upsertStoredSessions.type)).toBeLessThan(types.indexOf(setLastExternalImport.type));
  });

  it('does not record last-import metadata for full backup restores', async () => {
    const testBed = createAddEffectTestBed({
      services: {
        tolgee: { t: (s: string) => s },
        db: { delete: () => ({ where: () => Promise.resolve() }) } as never,
        databaseMigrationService: { migrate: vi.fn() } as never,
      },
    });
    addImportBackupEffects(testBed.addEffect);

    await testBed.dispatchHandled(
      importBackupData({
        workouts: [EmptySession],
        programs: {},
        successMessage: 'Restore complete!',
      }),
    );

    expect(() => testBed.getDispatchedAction(setLastExternalImport)).toThrow();
  });

  it('shows the provided successMessage', async () => {
    const testBed = createAddEffectTestBed({
      services: {
        tolgee: { t: (s: string) => s },
        db: { delete: () => ({ where: () => Promise.resolve() }) } as never,
        databaseMigrationService: { migrate: vi.fn() } as never,
      },
    });
    addImportBackupEffects(testBed.addEffect);

    await testBed.dispatchHandled(
      importBackupData({
        workouts: [],
        programs: {},
        successMessage: 'Imported 3 workout(s)',
      }),
    );

    expect(snackbarText(testBed.getDispatchedAction(showSnackbar).payload)).toBe('Imported 3 workout(s)');
  });

  it('does not dispatch beginFeedImport when feed is absent', async () => {
    const testBed = createAddEffectTestBed({
      services: {
        tolgee: { t: (s: string) => s },
      },
    });
    addImportBackupEffects(testBed.addEffect);

    await testBed.dispatchHandled(
      importBackupData({
        workouts: [],
        programs: {},
        feed: undefined,
        successMessage: 'Restore complete!',
      }),
    );

    testBed.expectNotDispatched(beginFeedImport);
  });
});
