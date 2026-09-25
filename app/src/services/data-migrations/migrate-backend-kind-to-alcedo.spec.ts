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

    await migrateBackendKindToAlcedo(db);

    expect(await db.select().from(backendsSchema)).toEqual([
      { id: 'alcedo', kind: 'alcedo', name: 'Built-in', url: 'https://example.com' },
      { id: 'mine', kind: 'backupEndpoint', name: 'Mine', url: 'https://example.com/backup' },
    ]);
    expect(await db.select().from(backendAssignmentsSchema)).toEqual([
      { feature: 'backup', backendId: 'alcedo' },
    ]);
  });

  it('is a no-op when nothing uses the old values', async () => {
    const db = await createTestDb();

    await migrateBackendKindToAlcedo(db);

    expect(await db.select().from(backendsSchema)).toEqual([]);
    expect(await db.select().from(backendAssignmentsSchema)).toEqual([]);
  });

  it('records the migration id', async () => {
    const db = await createTestDb();

    await migrateBackendKindToAlcedo(db);

    const ids = (await db.select().from(dataMigrationsSchema)).map((x) => x.id);
    expect(ids).toContain(migrateBackendKindToAlcedoDataMigration);
  });
});
