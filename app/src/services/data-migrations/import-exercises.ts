import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { KeyValueStore } from '../key-value-store';
import { dataMigrationsSchema, exercisesSchema } from '@/db/schema';
import { ExerciseDescriptor } from '@/models/exercise-models';
import { exerciseDescriptorMigrations } from '@/models/storage/versions/migrations';

export const importExercisesDataMigration = 'IMPORT_EXERCISES';

const storageKey = 'ExerciseList';
export async function importExercises(db: ExpoSQLiteDatabase, keyValueStore: KeyValueStore) {
  // A corrupt or wrong-shaped value must not abort startup: treat it as empty and still
  // record the migration id so the failure is not retried on every launch.
  let savedExercises: Record<string, ExerciseDescriptor> = {};
  try {
    const raw = await keyValueStore.getItem(storageKey);
    const parsed: unknown = raw == null ? {} : JSON.parse(raw);
    if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
      savedExercises = parsed as Record<string, ExerciseDescriptor>;
    }
  } catch {
    savedExercises = {};
  }
  const converted: (typeof exercisesSchema.$inferInsert)[] = Object.entries(savedExercises).map(
    ([id, pojo]) =>
      ({
        id,
        payload: exerciseDescriptorMigrations.migrate(pojo),
      }) satisfies typeof exercisesSchema.$inferInsert,
  );

  await db.transaction(async (tx) => {
    if (converted.length) {
      await tx.insert(exercisesSchema).values(converted);
    }
    await tx.insert(dataMigrationsSchema).values({ id: importExercisesDataMigration });
  });
}
