import {
  backendAssignmentsSchema,
  backendHeadersSchema,
  backendsSchema,
  dataMigrationsSchema,
} from '@/db/schema';
import { sql } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

export const migrateBackendKindToAlcedoDataMigration = 'MIGRATE_BACKEND_KIND_TO_ALCEDO';

/**
 * The `BackendKind` discriminator and the built-in backend id were renamed
 * from `'liftlog'` to `'alcedo'`. Rows written by older app versions still
 * carry the old values, so rewrite them in place:
 * - `backend.id` / `backend.kind`: `'liftlog'` -> `'alcedo'`
 * - `backend_header.backendId`: `'liftlog'` -> `'alcedo'`
 * - `backend_assignment.backendId`: `'liftlog'` -> `'alcedo'`
 *
 * Raw SQL string matches are used deliberately: the drizzle `$type` no
 * longer includes the old literal, so typed equality would not compile.
 */
export async function migrateBackendKindToAlcedo(db: ExpoSQLiteDatabase) {
  await db.transaction(async (tx) => {
    await tx
      .update(backendsSchema)
      .set({ id: 'alcedo', kind: 'alcedo' })
      .where(sql`${backendsSchema.id} = 'liftlog'`);
    await tx
      .update(backendHeadersSchema)
      .set({ backendId: 'alcedo' })
      .where(sql`${backendHeadersSchema.backendId} = 'liftlog'`);
    await tx
      .update(backendAssignmentsSchema)
      .set({ backendId: 'alcedo' })
      .where(sql`${backendAssignmentsSchema.backendId} = 'liftlog'`);
    await tx.insert(dataMigrationsSchema).values({ id: migrateBackendKindToAlcedoDataMigration });
  });
}
