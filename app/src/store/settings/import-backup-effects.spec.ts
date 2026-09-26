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

/** Chainable drizzle-insert mock. `onConflictDoUpdate` records each completed write. */
function mockDbWithInsert(writes: string[], gate?: Promise<void>) {
  const chain = {
    values: () => chain,
    onConflictDoUpdate: () => {
      writes.push('insert');
      return gate ?? Promise.resolve();
    },
  };
  return {
    delete: () => ({ where: () => Promise.resolve() }),
    insert: () => chain,
  } as never;
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
  it('skips a corrupt session in a proto backup instead of aborting the restore', async () => {
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
    const protoAction = testBed.getDispatchedAction(importDataProto);
    // Corrupt one session in the parsed backup.
    (protoAction.payload.dao.sessions as unknown[])[0] = null;

    await testBed.dispatchHandled(protoAction);

    // 85 sessions in the fixture, minus the corrupt one — the restore proceeds.
    const dispatchedImport = testBed.getDispatchedAction(importBackupData);
    expect(dispatchedImport.payload.workouts).toHaveLength(84);
  });
  it('dispatches the appropriate actions when importing', async () => {
    const writes: string[] = [];
    const testBed = createAddEffectTestBed({
      services: {
        tolgee: { t: (s: string) => s },
        db: mockDbWithInsert(writes),
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
    // sessions + exercises written directly; programs skipped when empty.
    expect(writes).toEqual(['insert', 'insert']);
  });

  it('does not announce success until the imported rows are durable', async () => {
    let releaseWrites!: () => void;
    const gate = new Promise<void>((resolve) => {
      releaseWrites = resolve;
    });
    const writes: string[] = [];
    const testBed = createAddEffectTestBed({
      services: {
        tolgee: { t: (s: string) => s },
        db: mockDbWithInsert(writes, gate),
        databaseMigrationService: { migrate: vi.fn() } as never,
      },
    });
    addImportBackupEffects(testBed.addEffect);

    const pending = testBed.dispatchHandled(
      importBackupData({
        workouts: [EmptySession],
        programs: {},
        successMessage: 'Restore complete!',
      }),
    );
    // Let the effect reach the gated write.
    await new Promise((resolve) => setTimeout(resolve, 10));
    testBed.expectNotDispatched(showSnackbar);
    releaseWrites();
    await pending;
    expect(snackbarText(testBed.getDispatchedAction(showSnackbar).payload)).toBe('Restore complete!');
    expect(writes).toEqual(['insert']);
  });

  it('records last-import metadata after the upserts commit, for external imports', async () => {
    const writes: string[] = [];
    const testBed = createAddEffectTestBed({
      services: {
        tolgee: { t: (s: string) => s },
        db: mockDbWithInsert(writes),
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

  it('rejects an oversized file before reading it, without starting an import', async () => {
    const testBed = createAddEffectTestBed({
      services: {
        filePickerService: {
          pickFile: vi.fn().mockResolvedValue('too-large'),
        },
        tolgee: { t: (s: string) => s },
      },
    });
    addImportBackupEffects(testBed.addEffect);

    await testBed.dispatchHandled(importData());

    expect(snackbarText(testBed.getDispatchedAction(showSnackbar).payload)).toBe(
      'Could not import data: file is too large.',
    );
    testBed.expectNotDispatched(importDataProto);
    testBed.expectNotDispatched(importDataSql);
  });
});
