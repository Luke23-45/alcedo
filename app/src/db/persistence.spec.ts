import { describe, expect, it, vi } from 'vitest';
import { LocalDate, OffsetDateTime, ZoneOffset } from '@js-joda/core';
import { v4 as uuid } from 'uuid';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseAsync } from 'expo-sqlite';
import { eq, sql } from 'drizzle-orm';
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { DatabaseMigrationService } from '@/services/database-migration-service';
import { exercisesSchema, feedItemsSchema, programsSchema, sessionsSchema } from '@/db/schema';
import { mapRowsSkippingCorrupt, upsert } from '@/db/helpers';
import { sessionMigrations, programBlueprintMigrations } from '@/models/storage/versions/migrations';
import { ProgramBlueprint, SessionBlueprint, WeightedExerciseBlueprint } from '@/models/blueprint-models';
import { RecordedWeightedExercise, Session } from '@/models/session-models';
import { Weight } from '@/models/weight';
import { ExerciseDescriptor, fromExerciseDescriptorJSON, toExerciseDescriptorJSON } from '@/models/exercise-models';
import { filledPotentialSet, makeWeightedBlueprint } from '@/models/session-models/__test__/helpers';
async function createTestDb(): Promise<ExpoSQLiteDatabase> {
  const expoDb = await openDatabaseAsync(':memory:');
  const db = drizzle(expoDb);
  const migrationService = new DatabaseMigrationService(
    db,
    { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() } as never,
    { importOldData: async () => {} },
  );
  await migrationService.migrate();
  return db;
}

function makeSession(name = 'Round trip'): Session {
  const blueprint = new SessionBlueprint(
    name,
    [
      makeWeightedBlueprint({
        name: `${name} Exercise`,
        sets: 1,
        repsConfig: { type: 'fixed', reps: 5 },
        progression: [],
      }),
    ],
    '',
  );
  const exerciseBlueprint = blueprint.exercises[0] as WeightedExerciseBlueprint;
  const completedAt = OffsetDateTime.of(2026, 9, 21, 18, 30, 0, 0, ZoneOffset.UTC);
  const recorded = new RecordedWeightedExercise(
    exerciseBlueprint,
    [filledPotentialSet(exerciseBlueprint.repsTargetForSet(0).max, completedAt, new Weight(100, 'kilograms'))],
    undefined,
  );
  return new Session(uuid(), blueprint, [recorded], LocalDate.of(2026, 9, 21), undefined, undefined);
}

function makeProgram(name = 'Round trip plan'): ProgramBlueprint {
  return new ProgramBlueprint(name, [new SessionBlueprint('Day 1', [], '')], LocalDate.of(2026, 9, 21));
}

function makeExercise(): ExerciseDescriptor {
  return {
    name: 'Round Trip Press',
    force: 'push',
    level: 'beginner',
    mechanic: 'compound',
    equipment: 'barbell',
    muscles: ['chest'],
    instructions: 'Press the bar.',
    category: 'strength',
  };
}

describe('SQLite persistence round-trips (save → fetch through the real schema)', () => {
  it('round-trips a session through the sessions table', async () => {
    const db = await createTestDb();
    const session = makeSession();

    await upsert(db, sessionsSchema, [{ id: session.id, payload: session.toJSON() }]);

    const rows = await db.select().from(sessionsSchema).where(eq(sessionsSchema.id, session.id));
    expect(rows).toHaveLength(1);
    const fetched = Session.fromJSON(sessionMigrations.migrate(rows[0]!.payload));
    expect(fetched.toJSON()).toEqual(session.toJSON());
  });

  it('round-trips updated session payloads via upsert (no duplicate rows)', async () => {
    const db = await createTestDb();
    const session = makeSession();
    await upsert(db, sessionsSchema, [{ id: session.id, payload: session.toJSON() }]);
    await upsert(db, sessionsSchema, [{ id: session.id, payload: session.toJSON() }]);

    const rows = await db.select().from(sessionsSchema);
    expect(rows).toHaveLength(1);
  });

  it('round-trips a program blueprint through the programs table', async () => {
    const db = await createTestDb();
    const program = makeProgram();

    // programs.active is NOT NULL without a default, so the row must carry it
    // explicitly; the conflict path preserves the existing active flag.
    // This mirrors the production import write path.
    await db
      .insert(programsSchema)
      .values([{ id: 'plan-1', active: false, payload: program.toJSON() }])
      .onConflictDoUpdate({
        target: programsSchema.id,
        set: {
          payload: sql.raw(`excluded.${programsSchema.payload.name}`),
        },
      });

    const rows = await db.select().from(programsSchema).where(eq(programsSchema.id, 'plan-1'));
    expect(rows).toHaveLength(1);
    expect(rows[0]!.active).toBe(false);
    const fetched = ProgramBlueprint.fromJSON(programBlueprintMigrations.migrate(rows[0]!.payload));
    expect(fetched.toJSON()).toEqual(program.toJSON());
  });

  it('preserves the active program flag when re-importing a program row', async () => {
    const db = await createTestDb();
    const program = makeProgram();

    await db.insert(programsSchema).values([{ id: 'plan-1', active: true, payload: program.toJSON() }]);
    await db
      .insert(programsSchema)
      .values([{ id: 'plan-1', active: false, payload: program.toJSON() }])
      .onConflictDoUpdate({
        target: programsSchema.id,
        set: {
          payload: sql.raw(`excluded.${programsSchema.payload.name}`),
        },
      });

    const rows = await db.select().from(programsSchema).where(eq(programsSchema.id, 'plan-1'));
    expect(rows).toHaveLength(1);
    expect(rows[0]!.active).toBe(true);
  });

  it('round-trips a custom exercise through the exercises table', async () => {
    const db = await createTestDb();
    const exercise = makeExercise();

    await upsert(db, exercisesSchema, [{ id: 'round-trip-exercise', payload: toExerciseDescriptorJSON(exercise) }]);

    const rows = await db.select().from(exercisesSchema).where(eq(exercisesSchema.id, 'round-trip-exercise'));
    expect(rows).toHaveLength(1);
    const fetched = fromExerciseDescriptorJSON(rows[0]!.payload);
    expect(toExerciseDescriptorJSON(fetched)).toEqual(toExerciseDescriptorJSON(exercise));
  });

  it('round-trips a feed item payload byte-for-byte', async () => {
    const db = await createTestDb();
    const payload = {
      version: 1,
      type: 'sessionCompleted',
      id: 'evt-1',
      userId: 'user-1',
      occurredAt: '2026-09-21T18:30:00Z',
      // Payload fidelity at the DB layer; the typed model parse is covered
      // by the feed effects specs.
    } as never;

    await upsert(db, feedItemsSchema, [{ id: 'evt-1', payload }]);

    const rows = await db.select().from(feedItemsSchema).where(eq(feedItemsSchema.id, 'evt-1'));
    expect(rows).toHaveLength(1);
    expect(rows[0]!.payload).toEqual(payload);
  });

  it('isolates a corrupt row: the good session still hydrates', async () => {
    const db = await createTestDb();
    const good = makeSession('Good session');
    await upsert(db, sessionsSchema, [{ id: good.id, payload: good.toJSON() }]);
    // Valid JSON that no session migration/model version can decode.
    await db.insert(sessionsSchema).values({ id: 'corrupt-row', payload: { __corrupt: true } as never });

    const rows = await db.select().from(sessionsSchema);
    expect(rows).toHaveLength(2);
    const errors: unknown[] = [];
    const hydrated = mapRowsSkippingCorrupt(
      rows,
      (row) => Session.fromJSON(sessionMigrations.migrate(row.payload)),
      (_row, error) => errors.push(error),
    );
    expect(hydrated).toHaveLength(1);
    expect(hydrated[0]!.toJSON()).toEqual(good.toJSON());
    expect(errors).toHaveLength(1);
  });
});

describe('mapRowsSkippingCorrupt', () => {
  it('parses every row when none are corrupt', () => {
    const seen: string[] = [];
    const result = mapRowsSkippingCorrupt(
      [1, 2, 3],
      (n) => n * 2,
      (_row, e) => seen.push(String(e)),
    );
    expect(result).toEqual([2, 4, 6]);
    expect(seen).toEqual([]);
  });

  it('skips throwing rows and reports them', () => {
    const corrupt: Array<{ id: string }> = [];
    const result = mapRowsSkippingCorrupt(
      [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
      (row) => {
        if (row.id === 'b') {
          throw new Error('boom');
        }
        return row.id;
      },
      (row, _error) => corrupt.push(row),
    );
    expect(result).toEqual(['a', 'c']);
    expect(corrupt).toEqual([{ id: 'b' }]);
  });
});
