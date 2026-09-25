import { backendAssignmentsSchema, dataMigrationsSchema } from '@/db/schema';
import { builtInBackendId } from '@/models/backend';
import { and, eq, or, sql } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

export const migrateAiPlannerToV2DataMigration = 'MIGRATE_AI_PLANNER_TO_V2';

/**
 * The AI coach moved off the backend-assignment model onto backend-v2's
 * native REST API, and backend-v2 does not serve the feed protocol — so the
 * built-in backend can no longer back either feature:
 * - drop every `aiPlanner` assignment (the feature is not assignable anymore);
 * - drop `feed` assignments pointing at the built-in backend (it can't serve
 *   the feed; the feed then waits for a backend the user adds).
 *
 * Backup assignments and feed assignments pointing at the user's own backends
 * are untouched.
 */
export async function migrateAiPlannerToV2(db: ExpoSQLiteDatabase) {
  await db.transaction(async (tx) => {
    await tx.delete(backendAssignmentsSchema).where(
      or(
        // 'aiPlanner' is no longer a BackendFeature, but rows written by older
        // app versions may still carry it — match the raw stored value.
        sql`${backendAssignmentsSchema.feature} = 'aiPlanner'`,
        and(
          eq(backendAssignmentsSchema.feature, 'feed'),
          eq(backendAssignmentsSchema.backendId, builtInBackendId),
        ),
      ),
    );
    await tx.insert(dataMigrationsSchema).values({ id: migrateAiPlannerToV2DataMigration });
  });
}
