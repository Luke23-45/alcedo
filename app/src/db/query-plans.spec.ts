import { describe, expect, it, vi } from 'vitest';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseAsync } from 'expo-sqlite';
import { eq } from 'drizzle-orm';
import type { Client } from '@libsql/client';
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { DatabaseMigrationService } from '@/services/database-migration-service';
import { feedItemsSchema, programsSchema, sessionsSchema } from '@/db/schema';
import { upsert } from '@/db/helpers';

async function createMigratedDb(): Promise<{ db: ExpoSQLiteDatabase; raw: Client }> {
  // Via the vitest shim, openDatabaseAsync returns a real libsql Client, so
  // EXPLAIN QUERY PLAN below runs against the true SQLite query planner.
  const expoDb = await openDatabaseAsync(':memory:');
  const raw = expoDb as unknown as Client;
  const db = drizzle(expoDb);
  const migrationService = new DatabaseMigrationService(
    db,
    { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() } as never,
    { importOldData: async () => {} },
  );
  await migrationService.migrate();
  return { db, raw };
}

/** Renders a drizzle query's params into its SQL text so EXPLAIN can run it. */
function inlineParams(sqlText: string, params: unknown[]): string {
  let i = 0;
  return sqlText.replace(/\?/g, () => {
    const param = params[i++];
    if (typeof param === 'string') {
      return `'${param.replace(/'/g, "''")}'`;
    }
    if (typeof param === 'boolean') {
      return param ? '1' : '0';
    }
    if (param === null || param === undefined) {
      return 'NULL';
    }
    if (typeof param === 'number' || typeof param === 'bigint') {
      return String(param);
    }
    return JSON.stringify(param) ?? 'NULL';
  });
}

/** The planner's own description of how it will run a drizzle-built query. */
async function explainQueryPlan(raw: Client, query: { toSQL(): { sql: string; params: unknown[] } }) {
  const { sql, params } = query.toSQL();
  const result = await raw.execute(`EXPLAIN QUERY PLAN ${inlineParams(sql, params)}`);
  return result.rows.map((row) => String((row as unknown as unknown[])[3]));
}

/** Counts statements the drizzle driver issues, to prove batching (no N+1). */
function countStatements(raw: Client) {
  let count = 0;
  const original = raw.execute.bind(raw);
  raw.execute = ((...args: Parameters<typeof original>) => {
    count += 1;
    return original(...args);
  }) as typeof raw.execute;
  return {
    restore: () => {
      raw.execute = original;
    },
    count: () => count,
  };
}

describe('SQLite hot-path query plans (real planner, migrated schema)', () => {
  it('session lookup by id uses an index seek, not a table scan', async () => {
    const { db, raw } = await createMigratedDb();
    const plan = await explainQueryPlan(
      raw,
      db.select().from(sessionsSchema).where(eq(sessionsSchema.id, 'session-1')),
    );
    expect(plan.some((line) => /SEARCH/i.test(line))).toBe(true);
    expect(plan.some((line) => /SCAN/i.test(line))).toBe(false);
  });

  it('program lookup by id uses an index seek, not a table scan', async () => {
    const { db, raw } = await createMigratedDb();
    const plan = await explainQueryPlan(raw, db.select().from(programsSchema).where(eq(programsSchema.id, 'plan-1')));
    expect(plan.some((line) => /SEARCH/i.test(line))).toBe(true);
    expect(plan.some((line) => /SCAN/i.test(line))).toBe(false);
  });

  it('feed item lookup by id uses an index seek, not a table scan', async () => {
    const { db, raw } = await createMigratedDb();
    const plan = await explainQueryPlan(raw, db.select().from(feedItemsSchema).where(eq(feedItemsSchema.id, 'evt-1')));
    expect(plan.some((line) => /SEARCH/i.test(line))).toBe(true);
    expect(plan.some((line) => /SCAN/i.test(line))).toBe(false);
  });

  it('clearing the active-session flag uses the partial unique index', async () => {
    const { db, raw } = await createMigratedDb();
    const plan = await explainQueryPlan(
      raw,
      db.update(sessionsSchema).set({ active: false }).where(eq(sessionsSchema.active, true)),
    );
    expect(plan.some((line) => /single_active_session/i.test(line))).toBe(true);
    expect(plan.some((line) => /SCAN/i.test(line))).toBe(false);
  });
});

describe('SQLite write/read efficiency (statement counts)', () => {
  it('upserting 50 sessions issues a single statement', async () => {
    const { db, raw } = await createMigratedDb();
    const counter = countStatements(raw);
    try {
      await upsert(
        db,
        sessionsSchema,
        Array.from({ length: 50 }, (_, i) => ({
          id: `session-${i}`,
          payload: { version: 1, marker: i } as never,
        })),
      );
      expect(counter.count()).toBe(1);
    } finally {
      counter.restore();
    }
    const rows = await db.select().from(sessionsSchema);
    expect(rows).toHaveLength(50);
  });

  it('hydrating the sessions table issues a single statement (no N+1)', async () => {
    const { db, raw } = await createMigratedDb();
    await upsert(
      db,
      sessionsSchema,
      Array.from({ length: 20 }, (_, i) => ({
        id: `session-${i}`,
        payload: { version: 1, marker: i } as never,
      })),
    );
    const counter = countStatements(raw);
    try {
      const rows = await db.select().from(sessionsSchema);
      expect(rows).toHaveLength(20);
      expect(counter.count()).toBe(1);
    } finally {
      counter.restore();
    }
  });
});
