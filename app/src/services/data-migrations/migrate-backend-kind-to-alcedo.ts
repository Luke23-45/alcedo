import {
  backendAssignmentsSchema,
  backendHeadersSchema,
  backendsSchema,
  dataMigrationsSchema,
} from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { KeyValueStore } from '../key-value-store';

export const migrateBackendKindToAlcedoDataMigration = 'MIGRATE_BACKEND_KIND_TO_ALCEDO';

/**
 * The `BackendKind` discriminator and the built-in backend id were renamed
 * from `'liftlog'` to `'alcedo'`. Rows written by older app versions still
 * carry the old values, so rewrite them in place:
 * - `backend.id` / `backend.kind`: `'liftlog'` -> `'alcedo'`
 * - `backend_header.backendId`: `'liftlog'` -> `'alcedo'`
 * - `backend_assignment.backendId`: `'liftlog'` -> `'alcedo'`
 * - the `lastBackupBackendId` key-value entry: `'liftlog'` -> `'alcedo'`
 *
 * Raw SQL string matches are used deliberately: the drizzle `$type` no
 * longer includes the old literal, so typed equality would not compile.
 *
 * Conflict handling: if an `'alcedo'` row already exists (e.g. the new app
 * wrote its built-in backend before this migration ran), the old `'liftlog'`
 * row is merged into it instead of violating the primary key — the
 * `'alcedo'` row is canonical, and only non-conflicting headers/assignments
 * are carried over.
 */
export async function migrateBackendKindToAlcedo(db: ExpoSQLiteDatabase, keyValueStore: KeyValueStore) {
  // Key-value first: if this write fails the migration throws before the SQL
  // marker below is recorded, so the stale key is retried on the next launch
  // instead of being stranded behind a completed marker.
  const lastBackupBackendId = await keyValueStore.getItem('lastBackupBackendId');
  if (lastBackupBackendId === 'liftlog') {
    await keyValueStore.setItem('lastBackupBackendId', 'alcedo');
  }

  await db.transaction(async (tx) => {
    // Belt and braces: foreign keys are not enforced today (no PRAGMA
    // foreign_keys anywhere), but deferring keeps the PK rename below valid
    // if enforcement is ever switched on. run() is synchronous — no await.
    tx.run(sql`PRAGMA defer_foreign_keys = ON`);
    const [legacyRows, currentRows] = await Promise.all([
      tx
        .select()
        .from(backendsSchema)
        .where(sql`${backendsSchema.id} = 'liftlog'`),
      tx
        .select()
        .from(backendsSchema)
        .where(eq(backendsSchema.id, 'alcedo')),
    ]);
    const hasLegacy = legacyRows.length > 0;
    const hasCurrent = currentRows.length > 0;

    if (hasLegacy && hasCurrent) {
      // Merge the legacy row into the canonical one. Dependents first, then the
      // parent row, so no dangling references can exist at any point.
      const legacyHeaders = await tx
        .select()
        .from(backendHeadersSchema)
        .where(sql`${backendHeadersSchema.backendId} = 'liftlog'`);
      for (const header of legacyHeaders) {
        await tx
          .insert(backendHeadersSchema)
          .values({ backendId: 'alcedo', name: header.name, value: header.value })
          .onConflictDoNothing({ target: [backendHeadersSchema.backendId, backendHeadersSchema.name] });
      }
      await tx
        .delete(backendHeadersSchema)
        .where(sql`${backendHeadersSchema.backendId} = 'liftlog'`);

      const legacyAssignments = await tx
        .select()
        .from(backendAssignmentsSchema)
        .where(sql`${backendAssignmentsSchema.backendId} = 'liftlog'`);
      const currentAssignments = await tx
        .select()
        .from(backendAssignmentsSchema)
        .where(eq(backendAssignmentsSchema.backendId, 'alcedo'));
      const currentFeatures = new Set(currentAssignments.map((a) => a.feature));
      for (const assignment of legacyAssignments) {
        if (currentFeatures.has(assignment.feature)) {
          await tx
            .delete(backendAssignmentsSchema)
            .where(eq(backendAssignmentsSchema.feature, assignment.feature));
        } else {
          await tx
            .update(backendAssignmentsSchema)
            .set({ backendId: 'alcedo' })
            .where(eq(backendAssignmentsSchema.feature, assignment.feature));
        }
      }

      await tx.delete(backendsSchema).where(sql`${backendsSchema.id} = 'liftlog'`);
    } else if (hasLegacy) {
      // Simple rename: dependents first, then the parent row.
      await tx
        .update(backendHeadersSchema)
        .set({ backendId: 'alcedo' })
        .where(sql`${backendHeadersSchema.backendId} = 'liftlog'`);
      await tx
        .update(backendAssignmentsSchema)
        .set({ backendId: 'alcedo' })
        .where(sql`${backendAssignmentsSchema.backendId} = 'liftlog'`);
      await tx
        .update(backendsSchema)
        .set({ id: 'alcedo', kind: 'alcedo' })
        .where(sql`${backendsSchema.id} = 'liftlog'`);
    }

    await tx.insert(dataMigrationsSchema).values({ id: migrateBackendKindToAlcedoDataMigration });
  });
}
