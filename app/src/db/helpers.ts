import { Column, sql } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { AnySQLiteTable, IndexColumn } from 'drizzle-orm/sqlite-core';

type JsonTableValue<T, K> = {
  id: K;
  payload: T;
};

/**
 * Batched upsert for the simple `{ id, payload }` tables (sessions, exercises,
 * feed tables). Every other column on the schema must have a default or be
 * nullable — the insert only carries `id` and `payload`, and the conflict
 * path only refreshes `payload`. Do NOT use this for `programsSchema`: its
 * `active` column is NOT NULL without a default, so omitting it throws.
 */
export async function upsert<T, K>(
  db: ExpoSQLiteDatabase,
  schema: AnySQLiteTable & {
    id: IndexColumn;
    payload: Column & { _: { $type: T } };
  },
  values: JsonTableValue<T, K>[],
) {
  if (!values.length) {
    return;
  }
  await db
    .insert(schema)
    .values(values)
    .onConflictDoUpdate({
      target: schema.id,
      set: {
        payload: sql.raw(`excluded.${schema.payload.name}`),
      },
    });
}

/**
 * Maps hydrated rows through a fallible parser, isolating row-level corruption:
 * a payload that fails to migrate or decode (e.g. a backup restored from a
 * newer app version) is logged and skipped instead of failing the whole
 * hydration — which would leave the store unusable and the app stuck. Skipped
 * rows stay in the database; only the in-memory load drops them, so a future
 * fix can still recover them.
 */
export function mapRowsSkippingCorrupt<T, R>(
  rows: readonly T[],
  parse: (row: T) => R,
  onCorrupt: (row: T, error: unknown) => void,
): R[] {
  const parsed: R[] = [];
  for (const row of rows) {
    try {
      parsed.push(parse(row));
    } catch (error) {
      onCorrupt(row, error);
    }
  }
  return parsed;
}
