import type { OffsetDateTimeJSON } from '@/models/storage/versions/libs';

export interface WorkoutClockFields {
  startedAt?: OffsetDateTimeJSON | undefined;
  pausedAt?: OffsetDateTimeJSON | undefined;
  pausedTotalMs?: number | undefined;
}

/**
 * Adds optional workout clock persistence fields to SessionJSON.
 * For pre-v9 sessions, startedAt, pausedAt, and pausedTotalMs pass through as undefined.
 */
export function addWorkoutClock<T>(session: T): T & WorkoutClockFields {
  return {
    ...session,
    startedAt: undefined,
    pausedAt: undefined,
    pausedTotalMs: undefined,
  };
}
