import { backendAssignmentsSchema, backendsSchema, dataMigrationsSchema } from '@/db/schema';
import { DatabaseMigrationService } from '@/services/database-migration-service';
import {
  migrateBackendKindToAlcedo,
  migrateBackendKindToAlcedoDataMigration,
} from '@/services/data-migrations/migrate-backend-kind-to-alcedo';
import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { openDatabaseAsync } from 'expo-sqlite';
import { describe, expect, it, vi } from 'vitest';

async function createTestDb(): Promise<ExpoSQLiteDatabase> {
  const db = drizzle(await openDatabaseAsync(':memory:'));
  await new DatabaseMigrationService(db, { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() } as never, {
    importOldData: async () => {},
  }).migrate();
  return db;
}

function createTestKeyValueStore(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: async (key: string) => map.get(key),
    setItem: async (key: string, value: string) => {
      map.set(key, value);
    },
    removeItem: async (key: string) => {
      map.delete(key);
    },
    __map: map,
  };
}

describe('migrateBackendKindToAlcedo', () => {
  it('renames stored liftlog kinds and backend ids to alcedo', async () => {
    const db = await createTestDb();
    // Rows as written by older app versions — the old literals no longer
    // typecheck, so insert them as raw values.
    await db.insert(backendsSchema).values({
      id: 'liftlog',
      kind: 'liftlog',
      name: 'Built-in',
      url: 'https://example.com',
    } as never);
    await db.insert(backendsSchema).values({
      id: 'mine',
      kind: 'backupEndpoint',
      name: 'Mine',
      url: 'https://example.com/backup',
    });
    await db.insert(backendAssignmentsSchema).values({ feature: 'backup', backendId: 'liftlog' });

    await migrateBackendKindToAlcedo(db, createTestKeyValueStore() as never);

    expect(await db.select().from(backendsSchema)).toEqual([
      { id: 'alcedo', kind: 'alcedo', name: 'Built-in', url: 'https://example.com' },
      { id: 'mine', kind: 'backupEndpoint', name: 'Mine', url: 'https://example.com/backup' },
    ]);
    expect(await db.select().from(backendAssignmentsSchema)).toEqual([
      { feature: 'backup', backendId: 'alcedo' },
    ]);
  });

  it('merges instead of violating the primary key when both rows exist', async () => {
    const db = await createTestDb();
    await db.insert(backendsSchema).values({
      id: 'liftlog',
      kind: 'liftlog',
      name: 'Built-in',
      url: 'https://old.example.com',
    } as never);
    await db.insert(backendsSchema).values({
      id: 'alcedo',
      kind: 'alcedo',
      name: 'Built-in',
      url: 'https://new.example.com',
    });
    await db.insert(backendAssignmentsSchema).values({ feature: 'backup', backendId: 'liftlog' });
    const kv = createTestKeyValueStore({ lastBackupBackendId: 'liftlog' });

    await migrateBackendKindToAlcedo(db, kv as never);

    // The canonical alcedo row survives untouched; the legacy row is gone.
    expect(await db.select().from(backendsSchema)).toEqual([
      { id: 'alcedo', kind: 'alcedo', name: 'Built-in', url: 'https://new.example.com' },
    ]);
    expect(await db.select().from(backendAssignmentsSchema)).toEqual([
      { feature: 'backup', backendId: 'alcedo' },
    ]);
    expect(await kv.getItem('lastBackupBackendId')).toBe('alcedo');
  });

  it('is a no-op when nothing uses the old values', async () => {
    const db = await createTestDb();

    await migrateBackendKindToAlcedo(db, createTestKeyValueStore() as never);

    expect(await db.select().from(backendsSchema)).toEqual([]);
    expect(await db.select().from(backendAssignmentsSchema)).toEqual([]);
  });

  it('records the migration id', async () => {
    const db = await createTestDb();

    await migrateBackendKindToAlcedo(db, createTestKeyValueStore() as never);

    const ids = (await db.select().from(dataMigrationsSchema)).map((x) => x.id);
    expect(ids).toContain(migrateBackendKindToAlcedoDataMigration);
  });

  it('does not record the migration when the key-value write fails, so it retries', async () => {
    const db = await createTestDb();
    const store = createTestKeyValueStore({ lastBackupBackendId: 'liftlog' });
    store.setItem = async () => {
      throw new Error('disk full');
    };

    await expect(migrateBackendKindToAlcedo(db, store as never)).rejects.toThrow('disk full');

    const ids = (await db.select().from(dataMigrationsSchema)).map((x) => x.id);
    expect(ids).not.toContain(migrateBackendKindToAlcedoDataMigration);
    expect(store.__map.get('lastBackupBackendId')).toBe('liftlog');
  });
});
