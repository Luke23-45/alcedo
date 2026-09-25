import { backendAssignmentsSchema, dataMigrationsSchema } from '@/db/schema';
import { builtInBackendId } from '@/models/backend';
import { DatabaseMigrationService } from '@/services/database-migration-service';
import { migrateAiPlannerToV2 } from '@/services/data-migrations/migrate-ai-planner-to-v2';
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

describe('migrateAiPlannerToV2', () => {
  it('drops aiPlanner assignments and keeps feed-on-user-backend and backup', async () => {
    const db = await createTestDb();
    await db.insert(backendAssignmentsSchema).values({ feature: 'feed', backendId: 'self-hosted' });
    await db.insert(backendAssignmentsSchema).values({ feature: 'backup', backendId: 'my-endpoint' });
    // 'aiPlanner' is not a BackendFeature anymore, but older app versions
    // wrote it — insert the raw row the way the old seed did.
    await db.insert(backendAssignmentsSchema).values({ feature: 'aiPlanner', backendId: builtInBackendId } as never);

    await migrateAiPlannerToV2(db);

    expect(await db.select().from(backendAssignmentsSchema)).toEqual([
      { feature: 'feed', backendId: 'self-hosted' },
      { feature: 'backup', backendId: 'my-endpoint' },
    ]);
  });

  it('removes a feed assignment pointing at the built-in backend', async () => {
    const db = await createTestDb();
    await db.insert(backendAssignmentsSchema).values({ feature: 'feed', backendId: builtInBackendId });

    await migrateAiPlannerToV2(db);

    expect(await db.select().from(backendAssignmentsSchema)).toEqual([]);
  });

  it('records the migration id', async () => {
    const db = await createTestDb();

    await migrateAiPlannerToV2(db);

    const ids = (await db.select().from(dataMigrationsSchema)).map((x) => x.id);
    expect(ids).toContain('MIGRATE_AI_PLANNER_TO_V2');
  });
});
