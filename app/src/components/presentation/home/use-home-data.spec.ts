import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { LocalDate, OffsetDateTime } from '@js-joda/core';
import { useAppSelector } from '@/store';
import type { PersonalRecord } from '@/store/stats/personal-records';
import { findPersonalRecords } from '@/store/stats/personal-records';
import { RecordedWeightedExercise, Session } from '@/models/session-models';
import { SessionBlueprint } from '@/models/blueprint-models';
import { Weight } from '@/models/weight';
import {
  filledPotentialSet,
  makeCardioBlueprint,
  makeSession,
  makeWeightedBlueprint,
} from '@/models/session-models/__test__/helpers';
import { useHomeData } from './use-home-data';

interface FakeState {
  sessions: Session[];
  records: Map<string, PersonalRecord[]>;
  program: {
    savedPrograms: Record<string, { name: string; sessions: unknown[] }>;
    activePlanId: string;
  };
  settings: { preferredLanguage: string };
}

let fakeState: FakeState;

vi.mock('expo-localization', () => ({ getLocales: () => [{ decimalSeparator: '.' }] }));
vi.mock('@/store', () => ({ useAppSelector: vi.fn() }));
vi.mock('@/store/stored-sessions', () => ({
  selectSessions: (s: FakeState) => s.sessions,
  selectHistoryPersonalRecords: (s: FakeState) => s.records,
}));
// Deterministic stub: echoes the key and params so assertions stay honest
// about which strings the hook requests.
vi.mock('@tolgee/react', () => ({
  useTranslate: () => ({
    t: (key: string, params?: Record<string, string | number>) =>
      params
        ? `${key}(${Object.entries(params)
            .map(([k, v]) => `${k}=${v}`)
            .join(',')})`
        : key,
  }),
}));

const kg = (n: number) => new Weight(n, 'kilograms');
const at = (day: number, hour = 10) =>
  OffsetDateTime.parse(`2026-09-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:00:00Z`);

/** A session with the given filled weighted sets, all stamped at the same time. */
function liftedSession(
  id: string,
  date: LocalDate,
  name: string,
  sets: { weightKg: number; reps: number }[],
  time: OffsetDateTime,
): Session {
  const blueprint = makeWeightedBlueprint({ name, repsConfig: { type: 'fixed', reps: 5 } });
  const exercise = new RecordedWeightedExercise(
    blueprint,
    sets.map((s) => filledPotentialSet(s.reps, time, kg(s.weightKg))),
    undefined,
  );
  return new Session(id, new SessionBlueprint(name, [], ''), [exercise], date, undefined, undefined);
}

function blankState(): FakeState {
  return {
    sessions: [],
    records: new Map(),
    program: { savedPrograms: {}, activePlanId: 'none' },
    settings: { preferredLanguage: 'en-US' },
  };
}

beforeEach(() => {
  fakeState = blankState();
  vi.mocked(useAppSelector).mockImplementation(((selector: (s: FakeState) => unknown) => selector(fakeState)) as never);
  // The hook reads the clock for greeting + date label; pin it to a known Tuesday morning.
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 8, 22, 9, 30, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useHomeData — first run / empty', () => {
  it('reports no data anywhere and stays honest', () => {
    const { result } = renderHook(() => useHomeData(undefined));

    expect(result.current.todaySession).toBeUndefined();
    expect(result.current.weeklyVolume.hasData).toBe(false);
    expect(result.current.weeklyVolume.totalKg).toBe(0);
    expect(result.current.weeklyVolume.sessionCount).toBe(0);
    expect(result.current.weeklyVolume.deltaPct).toBeNull();
    expect(result.current.recentActivity).toEqual([]);
    expect(result.current.personalRecords).toEqual([]);
    expect(result.current.programs).toEqual([]);
  });

  it('greets by time of day and labels the date', () => {
    const { result } = renderHook(() => useHomeData(undefined));

    expect(result.current.greeting).toBe('home.greeting.morning');
    expect(result.current.dateLabel).toBe('TUESDAY, SEPTEMBER 22');
  });

  it('uses the first upcoming session as today’s session', () => {
    const upcoming = liftedSession('u1', LocalDate.of(2026, 9, 22), 'Push Day', [{ weightKg: 100, reps: 5 }], at(22));
    const { result } = renderHook(() => useHomeData([upcoming]));

    expect(result.current.todaySession?.id).toBe('u1');
    expect(result.current.todayExerciseCount).toBe(1);
  });
});

describe('useHomeData — weekly volume', () => {
  it('totals the rolling 7-day window and compares against the previous 7 days', () => {
    // Today: 100kg x 5 x 2 = 1000kg. Yesterday: 50kg x 10 = 500kg.
    // 8 days ago (previous window): 200kg x 5 = 1000kg.
    fakeState.sessions = [
      liftedSession(
        'a',
        LocalDate.of(2026, 9, 22),
        'Push Day',
        [
          { weightKg: 100, reps: 5 },
          { weightKg: 100, reps: 5 },
        ],
        at(22),
      ),
      liftedSession('b', LocalDate.of(2026, 9, 21), 'Leg Day', [{ weightKg: 50, reps: 10 }], at(21)),
      liftedSession('c', LocalDate.of(2026, 9, 14), 'Pull Day', [{ weightKg: 200, reps: 5 }], at(14)),
    ];
    const { result } = renderHook(() => useHomeData(undefined));
    const volume = result.current.weeklyVolume;

    expect(volume.hasData).toBe(true);
    expect(volume.totalKg).toBe(1500);
    expect(volume.sessionCount).toBe(2);
    expect(volume.averageKg).toBeCloseTo(1500 / 7, 5);
    // (1500 - 1000) / 1000 = +50%.
    expect(volume.deltaPct).toBe(50);
    const today = volume.days.find((d) => d.isToday);
    expect(today?.valueKg).toBe(1000);
    expect(volume.days).toHaveLength(7);
  });

  it('reports a null delta when the previous week has no data', () => {
    fakeState.sessions = [
      liftedSession('a', LocalDate.of(2026, 9, 22), 'Push Day', [{ weightKg: 100, reps: 5 }], at(22)),
    ];
    const { result } = renderHook(() => useHomeData(undefined));

    expect(result.current.weeklyVolume.deltaPct).toBeNull();
  });

  it('ignores unlogged sets in the volume math', () => {
    const blueprint = makeWeightedBlueprint({ name: 'Bench', repsConfig: { type: 'fixed', reps: 5 } });
    const logged = new RecordedWeightedExercise(blueprint, [filledPotentialSet(5, at(22), kg(100))], undefined);
    const planned = makeSession([blueprint], LocalDate.of(2026, 9, 22));
    const session = new Session(
      'a',
      new SessionBlueprint('Push Day', [], ''),
      [logged, ...planned.recordedExercises],
      LocalDate.of(2026, 9, 22),
      undefined,
      undefined,
    );
    fakeState.sessions = [session];
    const { result } = renderHook(() => useHomeData(undefined));

    expect(result.current.weeklyVolume.totalKg).toBe(500);
  });
});

describe('useHomeData — recent activity', () => {
  it('shows the three latest sessions, newest first', () => {
    fakeState.sessions = [21, 20, 19, 18].map((day) =>
      liftedSession(`s${day}`, LocalDate.of(2026, 9, day), `Day ${day}`, [{ weightKg: 100, reps: 5 }], at(day)),
    );
    const { result } = renderHook(() => useHomeData(undefined));
    const items = result.current.recentActivity;

    expect(items.map((i) => i.id)).toEqual(['s21', 's20', 's19']);
    expect(items[0]?.title).toBe('Day 21');
    expect(items[0]?.value).toBe('500');
    expect(items[0]?.unit).toBe('home.recent.kg_lifted');
  });

  it('classifies the session kind from the blueprint name', () => {
    fakeState.sessions = [
      liftedSession('legs', LocalDate.of(2026, 9, 21), 'Leg Day', [{ weightKg: 100, reps: 5 }], at(21)),
      liftedSession('push', LocalDate.of(2026, 9, 20), 'Push Day', [{ weightKg: 100, reps: 5 }], at(20)),
      liftedSession('cardio', LocalDate.of(2026, 9, 19), 'Easy Run', [], at(19)),
    ];
    // The cardio session needs a recorded cardio exercise to classify as cardio.
    const cardio = makeSession([makeCardioBlueprint()], LocalDate.of(2026, 9, 19));
    fakeState.sessions[2] = new Session(
      'cardio',
      new SessionBlueprint('Easy Run', [], ''),
      cardio.recordedExercises,
      LocalDate.of(2026, 9, 19),
      undefined,
      undefined,
    );
    const { result } = renderHook(() => useHomeData(undefined));
    const kinds = Object.fromEntries(result.current.recentActivity.map((i) => [i.id, i.kind]));

    expect(kinds).toEqual({ legs: 'legs', push: 'upper', cardio: 'cardio' });
  });

  it('shows duration when the session has timestamps, exercise count otherwise', () => {
    // Two sets 45 minutes apart give the session a real duration.
    const blueprint = makeWeightedBlueprint({ name: 'Push Day', repsConfig: { type: 'fixed', reps: 5 } });
    const long = new Session(
      'timed',
      new SessionBlueprint('Push Day', [], ''),
      [
        new RecordedWeightedExercise(
          blueprint,
          [filledPotentialSet(5, at(21, 10), kg(100)), filledPotentialSet(5, at(21, 10).plusMinutes(45), kg(100))],
          undefined,
        ),
      ],
      LocalDate.of(2026, 9, 21),
      undefined,
      undefined,
    );
    const timeless = new Session(
      'timeless',
      new SessionBlueprint('Pull Day', [], ''),
      [],
      LocalDate.of(2026, 9, 20),
      undefined,
      undefined,
    );
    fakeState.sessions = [long, timeless];
    const { result } = renderHook(() => useHomeData(undefined));
    const byId = Object.fromEntries(result.current.recentActivity.map((i) => [i.id, i.subtitle]));

    expect(byId['timed']).toContain('45:00');
    expect(byId['timeless']).toContain('home.today_session.subtitle');
  });
});

describe('useHomeData — personal records', () => {
  it('prefers the big three lifts and shows the improvement delta', () => {
    const benchOld = new Session(
      's1',
      new SessionBlueprint('Gym', [], ''),
      [
        new RecordedWeightedExercise(
          makeWeightedBlueprint({ name: 'Bench Press', repsConfig: { type: 'fixed', reps: 5 } }),
          [filledPotentialSet(5, at(1), kg(100))],
          undefined,
        ),
        new RecordedWeightedExercise(
          makeWeightedBlueprint({ name: 'Overhead Press', repsConfig: { type: 'fixed', reps: 5 } }),
          [filledPotentialSet(5, at(1), kg(60))],
          undefined,
        ),
      ],
      LocalDate.of(2026, 9, 1),
      undefined,
      undefined,
    );
    const benchNew = new Session(
      's2',
      new SessionBlueprint('Gym', [], ''),
      [
        new RecordedWeightedExercise(
          makeWeightedBlueprint({ name: 'Bench Press', repsConfig: { type: 'fixed', reps: 5 } }),
          [filledPotentialSet(5, at(20), kg(110))],
          undefined,
        ),
        new RecordedWeightedExercise(
          makeWeightedBlueprint({ name: 'Overhead Press', repsConfig: { type: 'fixed', reps: 5 } }),
          [filledPotentialSet(5, at(20), kg(65))],
          undefined,
        ),
      ],
      LocalDate.of(2026, 9, 20),
      undefined,
      undefined,
    );
    fakeState.records = findPersonalRecords([benchOld, benchNew]);
    const { result } = renderHook(() => useHomeData(undefined));
    const records = result.current.personalRecords;

    expect(records[0]?.name).toBe('Bench Press');
    expect(records[0]?.value).toContain('kg');
    expect(records[0]?.delta).toMatch(/^\+\d[\d.,]*kg$/);
    expect(records[0]?.isNew).toBe(true);
    expect(records.map((r) => r.name)).toContain('Overhead Press');
  });

  it('shows the latest record when a lift PRs more than once', () => {
    const atT = (day: number) => OffsetDateTime.parse(`2026-09-${String(day).padStart(2, '0')}T10:00:00Z`);
    const benchAt = (id: string, day: number, w: number) =>
      new Session(
        id,
        new SessionBlueprint('Gym', [], ''),
        [
          new RecordedWeightedExercise(
            makeWeightedBlueprint({ name: 'Bench Press', repsConfig: { type: 'fixed', reps: 5 } }),
            [filledPotentialSet(5, atT(day), kg(w))],
            undefined,
          ),
        ],
        LocalDate.of(2026, 9, day),
        undefined,
        undefined,
      );
    fakeState.records = findPersonalRecords([benchAt('s1', 1, 100), benchAt('s2', 10, 110), benchAt('s3', 20, 120)]);
    const { result } = renderHook(() => useHomeData(undefined));
    const bench = result.current.personalRecords[0];

    // Epley 120kg x 5 = 140kg, beating the 128.3kg best — not the 110kg row.
    expect(bench?.name).toBe('Bench Press');
    expect(bench?.value).toBe('140kg');
    expect(bench?.delta).toBe('+11.7kg');
    expect(bench?.isNew).toBe(true);
  });

  it('does not mark records from earlier months as new', () => {
    const old1 = new Session(
      's1',
      new SessionBlueprint('Gym', [], ''),
      [
        new RecordedWeightedExercise(
          makeWeightedBlueprint({ name: 'Squat', repsConfig: { type: 'fixed', reps: 5 } }),
          [filledPotentialSet(5, OffsetDateTime.parse('2026-07-01T10:00:00Z'), kg(100))],
          undefined,
        ),
      ],
      LocalDate.of(2026, 7, 1),
      undefined,
      undefined,
    );
    const old2 = new Session(
      's2',
      new SessionBlueprint('Gym', [], ''),
      [
        new RecordedWeightedExercise(
          makeWeightedBlueprint({ name: 'Squat', repsConfig: { type: 'fixed', reps: 5 } }),
          [filledPotentialSet(5, OffsetDateTime.parse('2026-08-01T10:00:00Z'), kg(110))],
          undefined,
        ),
      ],
      LocalDate.of(2026, 8, 1),
      undefined,
      undefined,
    );
    fakeState.records = findPersonalRecords([old1, old2]);
    const { result } = renderHook(() => useHomeData(undefined));

    expect(result.current.personalRecords[0]?.isNew).toBe(false);
    expect(result.current.personalRecords[0]?.delta).toMatch(/^\+/);
  });
});

describe('useHomeData — programs', () => {
  it('lists the active program first with an honest accent and session count', () => {
    fakeState.program = {
      activePlanId: 'p2',
      savedPrograms: {
        p1: { name: 'Metcon Engine', sessions: [1, 2] },
        p2: { name: 'Hypertrophy', sessions: [1] },
        p3: { name: 'Morning Yoga Flow', sessions: [1, 2, 3] },
      },
    };
    const { result } = renderHook(() => useHomeData(undefined));
    const programs = result.current.programs;

    expect(programs.map((p) => p.id)).toEqual(['p2', 'p1', 'p3']);
    expect(programs[0]?.accent).toBe('strength');
    expect(programs[1]?.accent).toBe('conditioning');
    expect(programs[2]?.accent).toBe('mobility');
    expect(programs[1]?.detail).toBe('home.programs.session_count(count=2)');
    // Progress is unknown — the ring must stay hidden, never invented.
    expect(programs.every((p) => p.progressPct === undefined)).toBe(true);
  });
});
