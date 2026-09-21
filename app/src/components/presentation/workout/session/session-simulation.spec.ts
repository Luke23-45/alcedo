/**
 * Page 2/20 — Active workout flow simulation.
 *
 * Drives the live session's pure logic the way the real screen does:
 * empty vs populated vs mixed sessions, the stat strip, the Finish gate,
 * the exercise "n of m" header, and the elapsed clock. React Native is
 * stubbed out in this repo's test setup, so the simulation runs at the
 * model/hook-logic level — the same level the shipped page-1 suite used.
 */
import { describe, expect, it, vi } from 'vitest';
import { Duration, LocalDate, OffsetDateTime, ZoneOffset } from '@js-joda/core';
import BigNumber from 'bignumber.js';
import { v4 as uuid } from 'uuid';
import { SessionBlueprint } from '@/models/blueprint-models';
import { RecordedExercise, Session } from '@/models/session-models';
import { RecordedCardioExercise } from '@/models/session-models/recorded-cardio-exercise';
import { RecordedWeightedExercise } from '@/models/session-models/recorded-weighted-exercise';
import { Weight } from '@/models/weight';
import {
  filledPotentialSet,
  makeCardioBlueprint,
  makeRecordedExercise,
  makeWeightedBlueprint,
  tick,
} from '@/models/session-models/__test__/helpers';
import { computeSessionStats, sessionHasLoggedSet, sessionStartedExerciseCount } from './session-stats';
import { formatElapsed } from './use-elapsed-seconds';
import { formatTimeSpan } from '../timer-format';

vi.mock('expo-localization', () => ({
  getLocales: () => [{ decimalSeparator: '.' }],
}));

const date = LocalDate.of(2025, 4, 5);
const at = (hour: number, minute = 0) => OffsetDateTime.of(2025, 4, 5, hour, minute, 0, 0, ZoneOffset.UTC);

function sessionWith(exercises: RecordedExercise[], name = 'Push Day'): Session {
  return new Session(
    uuid(),
    new SessionBlueprint(
      name,
      exercises.map((ex) => ex.blueprint),
      '',
    ),
    exercises,
    date,
    undefined,
    undefined,
  );
}

const benchBlueprint = () => makeWeightedBlueprint({ name: 'Bench Press' });
const squatBlueprint = () => makeWeightedBlueprint({ name: 'Squat' });

function bench(logged: (number | undefined)[], weightKg = 100): RecordedWeightedExercise {
  return makeRecordedExercise(benchBlueprint(), logged, new Weight(weightKg, 'kilograms'), (index) => tickAt(index));
}

function tickAt(index: number): OffsetDateTime {
  return at(10, 0).plusSeconds(index * 90);
}

function rowing(filledSets: number, totalSets = 2): RecordedCardioExercise {
  const distance = { value: BigNumber(5), unit: 'kilometre' as const };
  let exercise = RecordedCardioExercise.empty(makeCardioBlueprint(totalSets));
  for (let i = 0; i < filledSets; i++) {
    exercise = exercise.withSet(i, (s) =>
      s.with({
        duration: Duration.ofMinutes(5),
        distance,
        completionDateTime: tick(),
      }),
    );
  }
  return exercise;
}

describe('elapsed clock', () => {
  it('renders 00:00 before any set is logged — the honest empty state', () => {
    expect(formatElapsed(0)).toBe('00:00');
  });

  it('formats sub-hour durations as MM:SS', () => {
    expect(formatElapsed(59)).toBe('00:59');
    expect(formatElapsed(60)).toBe('01:00');
    expect(formatElapsed(2712)).toBe('45:12'); // the spec's canonical mid-session elapsed
  });

  it('grows to H:MM:SS past the hour', () => {
    expect(formatElapsed(3600)).toBe('1:00:00');
    expect(formatElapsed(3723)).toBe('1:02:03');
  });
});

describe('empty session', () => {
  const session = sessionWith([]);

  it('shows zeroed stats', () => {
    const stats = computeSessionStats(session);
    expect(stats.setsCompleted).toBe(0);
    expect(stats.setsTotal).toBe(0);
    expect(stats.volume).toBe('0');
    expect(stats.reps).toBe('0');
  });

  it('cannot finish — Finish stays disabled until real work exists', () => {
    expect(sessionHasLoggedSet(session)).toBe(false);
  });

  it('counts no started exercises for the header', () => {
    expect(sessionStartedExerciseCount(session)).toBe(0);
  });
});

describe('populated weighted session', () => {
  // Bench 100kg: 10, 8 logged + one empty; Squat 120kg: 5 logged.
  const session = sessionWith([
    bench([10, 8, undefined]),
    makeRecordedExercise(squatBlueprint(), [5], new Weight(120, 'kilograms'), (i) => tickAt(i)),
  ]);

  it('counts completed vs total sets', () => {
    const stats = computeSessionStats(session);
    expect(stats.setsCompleted).toBe(3);
    expect(stats.setsTotal).toBe(4);
  });

  it('sums tonnage and reps from logged sets only', () => {
    const stats = computeSessionStats(session);
    // 100×10 + 100×8 + 120×5 = 2400 kg
    expect(stats.volume).toBe('2,400');
    expect(stats.reps).toBe('23');
  });

  it('enables Finish once any set is logged', () => {
    expect(sessionHasLoggedSet(session)).toBe(true);
  });

  it('counts started exercises for the "n of m" header', () => {
    expect(sessionStartedExerciseCount(session)).toBe(2);
  });
});

describe('unstarted session with exercises but no logged sets', () => {
  const session = sessionWith([bench([undefined, undefined])]);

  it('keeps Finish disabled', () => {
    expect(sessionHasLoggedSet(session)).toBe(false);
  });

  it('reports zero started exercises', () => {
    expect(sessionStartedExerciseCount(session)).toBe(0);
  });

  it('counts all sets as total, none as completed', () => {
    const stats = computeSessionStats(session);
    expect(stats.setsCompleted).toBe(0);
    expect(stats.setsTotal).toBe(2);
  });
});

describe('cardio session', () => {
  it('counts filled cardio sets toward the strip and the Finish gate', () => {
    const session = sessionWith([rowing(1, 2)]);
    const stats = computeSessionStats(session);
    expect(stats.setsCompleted).toBe(1);
    expect(stats.setsTotal).toBe(2);
    expect(sessionHasLoggedSet(session)).toBe(true);
    expect(sessionStartedExerciseCount(session)).toBe(1);
  });

  it('an empty cardio exercise does not gate Finish', () => {
    const session = sessionWith([rowing(0, 2)]);
    expect(sessionHasLoggedSet(session)).toBe(false);
  });
});

describe('mixed weighted + cardio session', () => {
  const session = sessionWith([bench([10]), rowing(1, 2)]);

  it('aggregates both exercise kinds into one strip', () => {
    const stats = computeSessionStats(session);
    expect(stats.setsCompleted).toBe(2);
    expect(stats.setsTotal).toBe(3);
    expect(stats.volume).toBe('1,000');
    expect(stats.reps).toBe('10');
  });
});

describe('cardio timer readouts', () => {
  it('formats the count-up clock as M:SS', () => {
    expect(formatTimeSpan(0)).toBe('0:00');
    expect(formatTimeSpan(90_000)).toBe('1:30');
    expect(formatTimeSpan(5 * 60_000 + 30_000)).toBe('5:30');
  });

  it('rounds sub-second remainders up, never showing a negative clock', () => {
    expect(formatTimeSpan(1)).toBe('0:01');
    expect(formatTimeSpan(-500)).toBe('0:00');
  });

  it('elapsedAt banks persisted time plus the live block', () => {
    const set = RecordedCardioExercise.empty(makeCardioBlueprint(1)).sets[0]!;
    // Banked 5 minutes, then a live block running for 30 seconds.
    const banked = set.with({ duration: Duration.ofMinutes(5) });
    const running = banked.withTimerStarted(at(10, 0));
    expect(running.elapsedAt(at(10, 0).plusSeconds(30)).toMillis()).toBe(5 * 60_000 + 30_000);
    // A stopped timer holds exactly what it banked.
    expect(banked.elapsedAt(at(11, 0)).toMillis()).toBe(5 * 60_000);
  });

  it('stopping a running set banks the elapsed time so a kill loses at most one interval', () => {
    const set = RecordedCardioExercise.empty(makeCardioBlueprint(1)).sets[0]!;
    const running = set.withTimerStarted(at(10, 0));
    const stopped = running.withTimerStopped(at(10, 0).plusSeconds(135));
    expect(stopped.currentBlockStartTime).toBeUndefined();
    expect(stopped.duration!.toMillis()).toBe(135_000);
  });
});

describe('heart-rate sample honesty', () => {
  it('keeps avg bpm as the labeled sample — never presented as measured data', () => {
    const session = sessionWith([bench([10])]);
    expect(computeSessionStats(session).avgBpm).toBe('128');
  });
});

describe('partially completed exercise', () => {
  it('a single logged set starts the exercise and enables Finish', () => {
    const exercise = makeRecordedExercise(benchBlueprint(), [undefined, 12], new Weight(60, 'kilograms'), (i) =>
      tickAt(i),
    );
    const session = sessionWith([exercise]);
    expect(sessionStartedExerciseCount(session)).toBe(1);
    expect(sessionHasLoggedSet(session)).toBe(true);
    expect(computeSessionStats(session).reps).toBe('12');
  });

  it('logging a set stamps real completion time for the elapsed clock', () => {
    const exercise = bench([9]);
    const logged = exercise.potentialSets[0]!.set!;
    expect(logged.completionDateTime).toBeDefined();
    expect(logged.repsCompleted).toBe(9);
  });

  it('a filled helper set carries its weight, reps, and target', () => {
    const set = filledPotentialSet(10, at(10), new Weight(100, 'kilograms'));
    expect(set.set).toBeDefined();
    expect(set.set!.repsCompleted).toBe(10);
    expect(set.weight.convertTo('kilograms').value.toNumber()).toBe(100);
  });
});
