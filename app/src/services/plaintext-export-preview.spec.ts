import { describe, expect, it } from 'vitest';
import { LocalDate, OffsetDateTime, ZoneOffset } from '@js-joda/core';
import { v4 as uuid } from 'uuid';
import { SessionBlueprint, CardioExerciseBlueprint, CardioExerciseSetBlueprint } from '@/models/blueprint-models';
import { Weight } from '@/models/weight';
import { Session } from '@/models/session-models/session';
import { RecordedWeightedExercise } from '@/models/session-models/recorded-weighted-exercise';
import { RecordedCardioExercise } from '@/models/session-models/recorded-cardio-exercise';
import { makeRecordedExercise, makeWeightedBlueprint } from '@/models/session-models/__test__/helpers';
import Enumerable from 'linq';
import { computeExportPreviewCounts } from '@/services/plaintext-export-preview';

const t = OffsetDateTime.of(2024, 1, 15, 10, 0, 0, 0, ZoneOffset.UTC);

function makeWeightedExercise(name: string, reps: (number | undefined)[]): RecordedWeightedExercise {
  const blueprint = makeWeightedBlueprint({ name, sets: reps.length, repsConfig: { type: 'fixed', reps: 10 } });
  return makeRecordedExercise(blueprint, reps, new Weight(100, 'kilograms'), (i) => t.plusSeconds(i * 60));
}

function makeSession(exercises: (RecordedWeightedExercise | RecordedCardioExercise)[]): Session {
  return new Session(
    uuid(),
    new SessionBlueprint(
      'Day',
      exercises.map((e) => e.blueprint),
      '',
    ),
    exercises,
    LocalDate.of(2024, 1, 15),
    undefined,
    undefined,
  );
}

function makeCardioExercise(): RecordedCardioExercise {
  return RecordedCardioExercise.empty(
    new CardioExerciseBlueprint('Treadmill', [CardioExerciseSetBlueprint.empty()], '', ''),
  );
}

describe('computeExportPreviewCounts', () => {
  it('counts sessions, completed weighted sets, and distinct exercises', () => {
    const sessions = [
      makeSession([makeWeightedExercise('Bench Press', [10, 10, 10])]),
      makeSession([makeWeightedExercise('Bench Press', [8, 8]), makeWeightedExercise('Squat', [5])]),
    ];

    expect(computeExportPreviewCounts(Enumerable.from(sessions))).toEqual({
      sessions: 2,
      completedSets: 6,
      exercises: 2,
    });
  });

  it('excludes incomplete sets and cardio, exactly like the CSV exporter', () => {
    const sessions = [makeSession([makeWeightedExercise('Bench Press', [10, undefined, 10]), makeCardioExercise()])];

    const counts = computeExportPreviewCounts(Enumerable.from(sessions));
    expect(counts.sessions).toBe(1);
    expect(counts.completedSets).toBe(2);
    expect(counts.exercises).toBe(1);
  });

  it('returns zeros when there is nothing to export', () => {
    expect(computeExportPreviewCounts(Enumerable.from<Session>([]))).toEqual({
      sessions: 0,
      completedSets: 0,
      exercises: 0,
    });
  });
});
