import { SessionBlueprint, WeightedExerciseBlueprint } from '@/models/blueprint-models';
import { ExerciseDescriptor } from '@/models/exercise-models';
import { PotentialSet, RecordedSet, RecordedWeightedExercise, Session } from '@/models/session-models';
import { Weight } from '@/models/weight';
import { DayOfWeek, LocalDate, OffsetDateTime } from '@js-joda/core';
import { describe, expect, it } from 'vitest';
import {
  formatMonthDay,
  formatRpeValue,
  formatWeekdayMonthDay,
  mondayOfWeek,
  muscleLoadThisWeek,
  nextSessionAvailability,
  nextSessionName,
  nextTrainingDay,
  resolveDeloadWeek,
  sessionVolumeKg,
  volumeChangePercent,
  weekdayShort,
  weeklyVolumeKg,
} from './planner-data';

function recordedSet(reps: number, weightKg: number): PotentialSet {
  return PotentialSet.of({
    set: RecordedSet.of({ repsCompleted: reps, completionDateTime: OffsetDateTime.now() }),
    weight: new Weight(weightKg, 'kilograms'),
  });
}

function sessionOn(date: LocalDate, sets: PotentialSet[], exerciseName = 'Bench Press'): Session {
  const blueprint = new SessionBlueprint(
    'Push',
    [WeightedExerciseBlueprint.of({ name: exerciseName, sets: sets.length })],
    '',
  );
  const recorded = new RecordedWeightedExercise(WeightedExerciseBlueprint.of({ name: exerciseName }), sets, undefined);
  return new Session('id', blueprint, [recorded], date, undefined, undefined);
}

const descriptor = (name: string, muscles: string[]): ExerciseDescriptor => ({
  name,
  category: '',
  equipment: null,
  force: null,
  instructions: '',
  level: 'beginner',
  mechanic: 'compound',
  muscles,
});

describe('planner-data', () => {
  it('formats contract dates in English', () => {
    expect(formatMonthDay(LocalDate.of(2026, 6, 30), 'en')).toBe('Jun 30');
    expect(formatWeekdayMonthDay(LocalDate.of(2026, 6, 10), 'en')).toBe('Wed, Jun 10');
  });

  it('formats short weekday names in the requested locale', () => {
    expect(weekdayShort(DayOfWeek.THURSDAY, 'en')).toBe('Thu');
    expect(weekdayShort(DayOfWeek.SUNDAY, 'en')).toBe('Sun');
  });

  it('falls back to the device locale without throwing when none is given', () => {
    expect(() => formatMonthDay(LocalDate.of(2026, 6, 30))).not.toThrow();
    expect(() => formatWeekdayMonthDay(LocalDate.of(2026, 6, 10))).not.toThrow();
    expect(() => weekdayShort(DayOfWeek.MONDAY)).not.toThrow();
  });

  it('formats RPE values with the locale decimal separator', () => {
    expect(formatRpeValue(8, 'en')).toBe('8');
    expect(formatRpeValue(7.5, 'en')).toBe('7.5');
    expect(formatRpeValue(8.5, 'de')).toContain('8');
  });

  it('derives the next-session availability matrix', () => {
    expect(nextSessionAvailability(true, true, 5, 3)).toBe('ready');
    expect(nextSessionAvailability(false, true, 5, 3)).toBe('planner-off');
    expect(nextSessionAvailability(false, false, 0, 0)).toBe('planner-off');
    expect(nextSessionAvailability(true, false, 5, 0)).toBe('no-program');
    expect(nextSessionAvailability(true, true, 5, 0)).toBe('no-sessions');
    expect(nextSessionAvailability(true, true, 0, 3)).toBe('no-training-days');
  });

  it('finds the Monday of a week', () => {
    expect(mondayOfWeek(LocalDate.of(2026, 6, 9)).toString()).toBe('2026-06-08');
    expect(mondayOfWeek(LocalDate.of(2026, 6, 8)).toString()).toBe('2026-06-08');
  });

  it('sums completed-set volume in kilograms', () => {
    const session = sessionOn(LocalDate.of(2026, 6, 9), [recordedSet(5, 100), recordedSet(5, 100)]);
    expect(sessionVolumeKg(session)).toBe(1000);
  });

  it('ignores uncompleted potential sets', () => {
    const session = sessionOn(LocalDate.of(2026, 6, 9), [
      recordedSet(5, 100),
      PotentialSet.of({ set: undefined, weight: new Weight(100, 'kilograms') }),
    ]);
    expect(sessionVolumeKg(session)).toBe(500);
  });

  it('sums only the requested week', () => {
    const sessions = [
      sessionOn(LocalDate.of(2026, 6, 8), [recordedSet(5, 100)]), // Monday this week
      sessionOn(LocalDate.of(2026, 6, 7), [recordedSet(5, 100)]), // Sunday last week
    ];
    expect(weeklyVolumeKg(sessions, LocalDate.of(2026, 6, 8))).toBe(500);
  });

  it('computes the contract 18% insight from real weekly volumes', () => {
    // (34,340 − 29,100) / 29,100 = 18%
    expect(volumeChangePercent(34340, 29100)).toBe(18);
  });

  it('returns undefined when a week has no volume', () => {
    expect(volumeChangePercent(0, 29100)).toBeUndefined();
    expect(volumeChangePercent(34340, 0)).toBeUndefined();
  });

  it('ranks muscle load by completed sets', () => {
    const sessions = [
      sessionOn(LocalDate.of(2026, 6, 9), [recordedSet(5, 100), recordedSet(5, 100)], 'Bench Press'),
      sessionOn(LocalDate.of(2026, 6, 10), [recordedSet(8, 60)], 'Barbell Row'),
    ];
    const descriptors = {
      a: descriptor('Bench Press', ['chest', 'triceps']),
      b: descriptor('Barbell Row', ['back', 'biceps']),
    };
    expect(muscleLoadThisWeek(sessions, LocalDate.of(2026, 6, 8), descriptors)).toEqual([
      { muscle: 'chest', sets: 2 },
      { muscle: 'triceps', sets: 2 },
      { muscle: 'back', sets: 1 },
      { muscle: 'biceps', sets: 1 },
    ]);
  });

  it('finds the next training day after today', () => {
    const training = [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY];
    // Mon Jun 8 2026 -> Tue Jun 9
    expect(nextTrainingDay(LocalDate.of(2026, 6, 8), training).toString()).toBe('2026-06-09');
    // Wed Jun 10 -> Fri Jun 12 (skips rest Thursday)
    expect(nextTrainingDay(LocalDate.of(2026, 6, 10), training).toString()).toBe('2026-06-12');
    // Sat Jun 13 -> Mon Jun 15 (skips rest Sunday)
    expect(nextTrainingDay(LocalDate.of(2026, 6, 13), training).toString()).toBe('2026-06-15');
  });

  it('picks the next unscheduled session in the rotation', () => {
    const sessions = [
      new SessionBlueprint('Push', [], ''),
      new SessionBlueprint('Pull', [], ''),
      new SessionBlueprint('Legs', [], ''),
    ];
    expect(nextSessionName(sessions, ['Push'])).toBe('Pull');
    expect(nextSessionName(sessions, ['Push', 'Pull', 'Legs'])).toBe('Push');
    expect(nextSessionName([], [])).toBeUndefined();
  });

  it('resolves the deload week from the stored date or three weeks out', () => {
    expect(resolveDeloadWeek('2026-06-30', LocalDate.of(2026, 6, 9)).toString()).toBe('2026-06-30');
    expect(resolveDeloadWeek(undefined, LocalDate.of(2026, 6, 9)).toString()).toBe('2026-06-30');
    expect(resolveDeloadWeek('garbage', LocalDate.of(2026, 6, 9)).toString()).toBe('2026-06-30');
  });
});
