import {
  makeCardioBlueprint,
  makeRecordedExercise,
  makeSession,
  makeWeightedBlueprint,
  tickAt,
} from '@/models/session-models/__test__/helpers';
import { RecordedCardioExercise, RecordedCardioExerciseSet } from '@/models/session-models/recorded-cardio-exercise';
import { RecordedWeightedExercise } from '@/models/session-models/recorded-weighted-exercise';
import { Session } from '@/models/session-models/session';
import { SessionBlueprint } from '@/models/blueprint-models';
import { Weight } from '@/models/weight';
import { Duration, LocalDate, YearMonth } from '@js-joda/core';
import { UnknownAction } from '@reduxjs/toolkit';
import { describe, expect, it, vi } from 'vitest';
import { v4 as uuid } from 'uuid';

/**
 * trends-overview-data cannot load under vitest (a transitive import uses
 * syntax the test transform rejects — pre-existing, unrelated to history).
 * history-stats delegates volume to it in production; here we stub the same
 * contract (effectiveWeight × completed reps, zero weights skipped) so the
 * aggregation wiring is still tested. Mirrors history-screen1.spec.ts.
 */
vi.mock('@/components/presentation/stats/trends/overview/trends-overview-data', () => ({
  sessionVolumeKg: (session: {
    bodyweight: unknown;
    recordedExercises: Array<{
      potentialSets?: Array<{ set?: { repsCompleted?: number } | undefined }>;
      effectiveWeight?: (
        ps: { set?: { repsCompleted?: number } | undefined },
        bodyweight: unknown,
      ) => { value: { isZero(): boolean }; multipliedBy(n: number): unknown };
    }>;
  }) => {
    let total = 0;
    for (const exercise of session.recordedExercises) {
      if (typeof exercise.effectiveWeight !== 'function' || !exercise.potentialSets) {
        continue;
      }
      for (const ps of exercise.potentialSets) {
        if (!ps.set?.repsCompleted) {
          continue;
        }
        const weight = exercise.effectiveWeight(ps, session.bodyweight) as {
          value: { isZero(): boolean; toNumber(): number };
          multipliedBy(n: number): {
            convertTo(unit: string): { value: { toNumber(): number } };
          };
        };
        if (weight.value.isZero()) {
          continue;
        }
        total += weight.multipliedBy(ps.set.repsCompleted).convertTo('kilograms').value.toNumber();
      }
    }
    return total;
  },
}));

import {
  estimateSessionKcal,
  formatClockDuration,
  hasCompletedSets,
  sessionActiveRest,
  sessionTotalReps,
  sessionTotalSets,
  sessionVolumeKg,
} from './history-stats';
import {
  deleteStoredSession,
  putStoredSession,
  selectPreviousComparableSession,
  selectSession,
  selectSessionsInMonth,
  storedSessionsReducer,
  updateStoredSession,
} from '@/store/stored-sessions';

/** A weighted session: Squat 100kg × 5/5/5 completed on the session's date, 10:00–10:10. */
function weightedSession(date = LocalDate.of(2026, 6, 9)) {
  const blueprint = makeWeightedBlueprint({ name: 'Squat' });
  const at = (i: number) =>
    tickAt(10, i * 5)
      .withYear(date.year())
      .withMonth(date.monthValue())
      .withDayOfMonth(date.dayOfMonth());
  const recorded = makeRecordedExercise(blueprint, [5, 5, 5], new Weight(100, 'kilograms'), at);
  return new SessionBuilder(date, 'Push Day').withRecorded([recorded], [blueprint]).build();
}

/** A cardio-only session: two completed 10-minute row sets on the session's date, 09:00 and 09:12. */
function cardioSession(date = LocalDate.of(2026, 6, 10)) {
  const blueprint = makeCardioBlueprint(2);
  const sets = [0, 12].map((minute, i) => {
    const t = tickAt(9, minute).withYear(date.year()).withMonth(date.monthValue()).withDayOfMonth(date.dayOfMonth());
    return RecordedCardioExerciseSet.empty(blueprint.sets[i]!).with({
      completionDateTime: t,
      duration: Duration.ofMinutes(10),
    });
  });
  const recorded = new RecordedCardioExercise(blueprint, sets, undefined);
  return new SessionBuilder(date, 'Cardio').withRecorded([recorded], [blueprint]).build();
}

class SessionBuilder {
  private recorded: Array<RecordedWeightedExercise | RecordedCardioExercise> = [];
  private blueprints: Array<ReturnType<typeof makeWeightedBlueprint> | ReturnType<typeof makeCardioBlueprint>> = [];
  constructor(
    private date: LocalDate,
    private name: string,
  ) {}
  withRecorded(
    recorded: Array<RecordedWeightedExercise | RecordedCardioExercise>,
    blueprints: Array<ReturnType<typeof makeWeightedBlueprint> | ReturnType<typeof makeCardioBlueprint>>,
  ) {
    this.recorded = recorded;
    this.blueprints = blueprints;
    return this;
  }
  build() {
    return new Session(
      uuid(),
      new SessionBlueprint(this.name, this.blueprints as never, ''),
      this.recorded,
      this.date,
      undefined,
      undefined,
    );
  }
}

function reduce(...actions: UnknownAction[]) {
  let state = storedSessionsReducer(undefined, { type: '@@init' });
  for (const action of actions) {
    state = storedSessionsReducer(state, action);
  }
  return state;
}

function stateWith(...sessions: Array<ReturnType<typeof weightedSession>>) {
  return { storedSessions: reduce(...sessions.map((s) => putStoredSession(s))) } as never;
}

describe('history aggregates: populated, empty, and partial sessions', () => {
  it('renders an empty session as honest zeros, never fake values', () => {
    const session = makeSession([]);
    expect(sessionVolumeKg(session)).toBe(0);
    expect(sessionTotalSets(session)).toBe(0);
    expect(sessionTotalReps(session)).toBe(0);
    expect(estimateSessionKcal(session)).toBe(0);
    expect(hasCompletedSets(session)).toBe(false);
    expect(sessionActiveRest(session)).toBeUndefined();
    expect(formatClockDuration(session.duration)).toBe('—');
  });

  it('ignores planned-but-unlogged sets in every aggregate', () => {
    const blueprint = makeWeightedBlueprint({ name: 'Squat' });
    const recorded = makeRecordedExercise(blueprint, [undefined, undefined]);
    const session = new SessionBuilder(LocalDate.of(2026, 6, 9), 'Push Day')
      .withRecorded([recorded], [blueprint])
      .build();
    expect(sessionVolumeKg(session)).toBe(0);
    expect(sessionTotalSets(session)).toBe(0);
    expect(sessionTotalReps(session)).toBe(0);
    expect(hasCompletedSets(session)).toBe(false);
  });

  it('aggregates a weighted session from real completed sets', () => {
    const session = weightedSession();
    expect(sessionVolumeKg(session)).toBe(1500);
    expect(sessionTotalSets(session)).toBe(3);
    expect(sessionTotalReps(session)).toBe(15);
    expect(hasCompletedSets(session)).toBe(true);
    // 3.5 × 10 min + 0.028 × 1500 kg = 77
    expect(estimateSessionKcal(session)).toBe(77);
    expect(formatClockDuration(session.duration)).toBe('10:00');
  });

  it('aggregates a cardio-only session with zero volume and no reps', () => {
    const session = cardioSession();
    expect(sessionVolumeKg(session)).toBe(0);
    expect(sessionTotalSets(session)).toBe(2);
    expect(sessionTotalReps(session)).toBe(0);
    expect(hasCompletedSets(session)).toBe(true);
    // kcal comes from duration alone: 3.5 × 12 min = 42
    expect(estimateSessionKcal(session)).toBe(42);
    expect(formatClockDuration(session.duration)).toBe('12:00');
  });

  it('aggregates a mixed weighted + cardio session', () => {
    const weighted = weightedSession();
    const cardio = cardioSession();
    const mixed = weighted.with({
      blueprint: weighted.blueprint.with({
        exercises: [...weighted.blueprint.exercises, ...cardio.blueprint.exercises],
      }),
      recordedExercises: [...weighted.recordedExercises, ...cardio.recordedExercises],
    });
    expect(sessionVolumeKg(mixed)).toBe(1500);
    expect(sessionTotalSets(mixed)).toBe(5);
    expect(sessionTotalReps(mixed)).toBe(15);
    expect(hasCompletedSets(mixed)).toBe(true);
  });

  it('splits active time and rest from real set timestamps', () => {
    const session = weightedSession();
    const split = sessionActiveRest(session);
    expect(split).toBeDefined();
    // Single exercise spans 10:00–10:10, so the whole session is active.
    expect(split!.active.toMinutes()).toBe(10);
    expect(split!.rest.toMinutes()).toBe(0);
  });

  it('returns undefined when there is no usable timing data', () => {
    const session = makeSession([]);
    expect(sessionActiveRest(session)).toBeUndefined();
  });
});

describe('history month store: grouping, editing, deleting', () => {
  it('groups sessions by month for the calendar and month summary', () => {
    const juneA = weightedSession(LocalDate.of(2026, 6, 9));
    const juneB = cardioSession(LocalDate.of(2026, 6, 30));
    const july = weightedSession(LocalDate.of(2026, 7, 1));
    const state = stateWith(juneA, juneB, july);
    expect(
      selectSessionsInMonth(state, YearMonth.of(2026, 6))
        .map((s) => s.id)
        .sort(),
    ).toEqual([juneA.id, juneB.id].sort());
    expect(selectSessionsInMonth(state, YearMonth.of(2026, 7)).map((s) => s.id)).toEqual([july.id]);
    expect(selectSessionsInMonth(state, YearMonth.of(2026, 8))).toEqual([]);
  });

  it('applies an edit-screen update to the stored session only', () => {
    const target = weightedSession(LocalDate.of(2026, 6, 9));
    const bystander = cardioSession(LocalDate.of(2026, 6, 10));
    const state = reduce(
      putStoredSession(target),
      putStoredSession(bystander),
      updateStoredSession({
        sessionId: target.id,
        update: (s) => s.with({ blueprint: s.blueprint.with({ notes: 'Felt strong' }) }),
      }),
    );
    expect(state.sessions[target.id]!.blueprint.notes).toBe('Felt strong');
    expect(state.sessions[bystander.id]).toBe(bystander);
  });

  it('removes a deleted session so the detail screen can no longer find it', () => {
    const session = weightedSession();
    const state = reduce(putStoredSession(session), deleteStoredSession(session.id));
    expect(selectSession({ storedSessions: state } as never, session.id)).toBeUndefined();
  });

  it('picks the most recent earlier session with the same name as the previous comparable', () => {
    const pushDayOld = weightedSession(LocalDate.of(2026, 6, 1));
    const pullDay = cardioSession(LocalDate.of(2026, 6, 8));
    const pushDayNew = weightedSession(LocalDate.of(2026, 6, 15));
    const state = stateWith(pushDayOld, pullDay, pushDayNew);
    expect(selectPreviousComparableSession(state, pushDayNew)?.id).toBe(pushDayOld.id);
    expect(selectPreviousComparableSession(state, pullDay)).toBeUndefined();
    expect(selectPreviousComparableSession(state, pushDayOld)).toBeUndefined();
    expect(selectPreviousComparableSession(state, undefined)).toBeUndefined();
  });
});

describe('history edit: exercise mutations', () => {
  it('deleting every set keeps the exercise row; adding reseeds it from the blueprint', () => {
    const session = weightedSession();
    const index = 0;
    const emptied = session.with({
      recordedExercises: session.recordedExercises.with(
        index,
        (session.recordedExercises[index] as RecordedWeightedExercise).with({ potentialSets: [] }),
      ),
    });
    const reseed = (emptied.recordedExercises[index] as RecordedWeightedExercise).withAddedSet('kilograms');
    expect(reseed.potentialSets.length).toBe(1);
    expect(reseed.potentialSets[0]!.set).toBeUndefined();
    expect(reseed.potentialSets[0]!.weight.unit).toBe('kilograms');
  });

  it('updating notes writes through to the stored session blueprint', () => {
    const session = weightedSession();
    const state = reduce(
      putStoredSession(session),
      updateStoredSession({
        sessionId: session.id,
        update: (s) => s.with({ blueprint: s.blueprint.with({ notes: 'Deload week' }) }),
      }),
    );
    expect(state.sessions[session.id]!.blueprint.notes).toBe('Deload week');
  });
});
