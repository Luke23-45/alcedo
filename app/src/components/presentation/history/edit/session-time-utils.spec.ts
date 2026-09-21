import { describe, expect, it } from 'vitest';
import { Duration, LocalDate, LocalDateTime, OffsetDateTime, ZoneOffset } from '@js-joda/core';
import { v4 as uuid } from 'uuid';
import { Weight } from '@/models/weight';
import { RecordedWeightedExercise } from '@/models/session-models/recorded-weighted-exercise';
import { Session } from '@/models/session-models/session';
import {
  createExerciseBlueprint,
  createSessionBlueprint,
  emptyPotentialSet,
  filledPotentialSet,
} from '@/models/session-models/__test__/helpers';
import {
  applySessionDateTime,
  formatCompactDuration,
  offsetDateTimeAt,
  shiftSetTimestamps,
} from './session-time-utils';

const OFFSET = ZoneOffset.of('+02:00');

function odt(day: number, hour: number, minute: number): OffsetDateTime {
  return OffsetDateTime.of(LocalDateTime.of(2026, 6, 9, hour, minute), OFFSET);
}

/** Two weighted exercises: one completed set each (09:41, 10:26) plus an empty set. */
function makeSession(): Session {
  const exerciseBlueprints = [createExerciseBlueprint(0, false), createExerciseBlueprint(1, false)];
  const blueprint = createSessionBlueprint(exerciseBlueprints);
  const recorded = exerciseBlueprints.map((exerciseBlueprint, index) => {
    const done = index === 0 ? odt(9, 9, 41) : odt(9, 10, 26);
    return new RecordedWeightedExercise(
      exerciseBlueprint,
      [filledPotentialSet(10, done, new Weight(60, 'kilograms')), emptyPotentialSet(60)],
      undefined,
    );
  });
  return new Session(uuid(), blueprint, recorded, LocalDate.of(2026, 6, 9), undefined, undefined);
}

function completedTimes(session: Session): (OffsetDateTime | undefined)[] {
  return session.recordedExercises.flatMap((recorded) =>
    recorded instanceof RecordedWeightedExercise
      ? recorded.potentialSets.map((potential) => potential.set?.completionDateTime)
      : [],
  );
}

describe('shiftSetTimestamps', () => {
  it('shifts every completed weighted set by the delta', () => {
    const shifted = shiftSetTimestamps(makeSession(), 19 * 60);
    expect(completedTimes(shifted).map((t) => t?.toString())).toEqual([
      odt(9, 10, 0).toString(),
      undefined,
      odt(9, 10, 45).toString(),
      undefined,
    ]);
  });

  it('leaves uncompleted sets untouched and returns the same session for a zero delta', () => {
    const session = makeSession();
    expect(shiftSetTimestamps(session, 0)).toBe(session);
    const shifted = shiftSetTimestamps(session, -60);
    expect(completedTimes(shifted)[1]).toBeUndefined();
  });
});

describe('applySessionDateTime', () => {
  it('moves the start anchor onto the chosen time and preserves duration', () => {
    const session = makeSession();
    const before = session.duration;
    const next = applySessionDateTime(session, 'start', OffsetDateTime.of(LocalDateTime.of(2026, 6, 9, 10, 0), OFFSET));
    expect(next.firstExercise?.earliestTime?.toString()).toBe(odt(9, 10, 0).toString());
    expect(next.lastExercise?.latestTime?.toString()).toBe(odt(9, 10, 45).toString());
    expect(next.duration?.toMillis()).toBe(before?.toMillis());
  });

  it('moves the end anchor onto the chosen time', () => {
    const session = makeSession();
    const next = applySessionDateTime(session, 'end', OffsetDateTime.of(LocalDateTime.of(2026, 6, 9, 11, 0), OFFSET));
    expect(next.lastExercise?.latestTime?.toString()).toBe(
      OffsetDateTime.of(LocalDateTime.of(2026, 6, 9, 11, 0), OFFSET).toString(),
    );
    expect(next.firstExercise?.earliestTime?.toString()).toBe(odt(9, 10, 15).toString());
  });

  it('applies date changes through withUpdatedDate semantics', () => {
    const session = makeSession();
    const next = applySessionDateTime(
      session,
      'start',
      OffsetDateTime.of(LocalDateTime.of(2026, 6, 10, 9, 41), OFFSET),
    );
    expect(next.date.toString()).toBe('2026-06-10');
    expect(next.firstExercise?.earliestTime?.toLocalDate().toString()).toBe('2026-06-10');
  });
});

describe('offsetDateTimeAt', () => {
  it('builds the anchor-offset date-time from a JS date and hours/minutes', () => {
    const picked = new Date(2026, 5, 10, 0, 0, 0);
    const result = offsetDateTimeAt(picked, 9, 30, OFFSET);
    expect(result.toLocalDate().toString()).toBe('2026-06-10');
    expect(result.hour()).toBe(9);
    expect(result.minute()).toBe(30);
    expect(result.offset()).toBe(OFFSET);
  });
});

describe('formatCompactDuration', () => {
  it('formats minutes and hours compactly', () => {
    expect(formatCompactDuration(Duration.ofMinutes(45).plusSeconds(12))).toBe('45:12');
    expect(formatCompactDuration(Duration.ofHours(1).plusMinutes(5).plusSeconds(9))).toBe('1:05:09');
    expect(formatCompactDuration(undefined)).toBe('—');
  });
});
