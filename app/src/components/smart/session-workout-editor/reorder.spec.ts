import { describe, expect, it, vi } from 'vitest';
import { makeSession, makeWeightedBlueprint } from '@/models/session-models/__test__/helpers';
import { RecordedExercise } from '@/models/session-models/recorded-exercise';
import { Session } from '@/models/session-models/session';
import { storedSessionsReducer, putStoredSession, updateStoredSession } from '@/store/stored-sessions';
import { reorderExercises } from './reorder';

vi.mock('expo-localization', () => ({ getLocales: () => [{ decimalSeparator: '.' }] }));

function threeExerciseSession() {
  const names = ['Squat', 'Bench Press', 'Deadlift'];
  return makeSession(names.map((name) => makeWeightedBlueprint({ name })));
}

function blueprintNames(session: Session): string[] {
  return session.blueprint.exercises.map((b) => b.name);
}

/** The recorded exercise each row summary reads, by index. */
function recordedNames(session: Session): string[] {
  return session.recordedExercises.map((r: RecordedExercise) => r.blueprint.name);
}

/** Row i's summary must describe blueprint[i]: the alignment the UI relies on. */
function alignmentHolds(session: Session): boolean[] {
  return session.recordedExercises.map(
    (r: RecordedExercise, i) => r.blueprint.name === session.blueprint.exercises[i]!.name,
  );
}

describe('reorderExercises', () => {
  it('is identity when from === to', () => {
    const session = threeExerciseSession();
    expect(reorderExercises(session, 1, 1)).toBe(session);
  });

  it('moves the first exercise to the last, keeping blueprint and recorded exercises aligned', () => {
    const session = threeExerciseSession();
    const next = reorderExercises(session, 0, 2);
    expect(blueprintNames(next)).toEqual(['Bench Press', 'Deadlift', 'Squat']);
    expect(recordedNames(next)).toEqual(['Bench Press', 'Deadlift', 'Squat']);
  });

  it('moves the last exercise to the first', () => {
    const session = threeExerciseSession();
    const next = reorderExercises(session, 2, 0);
    expect(blueprintNames(next)).toEqual(['Deadlift', 'Squat', 'Bench Press']);
    expect(recordedNames(next)).toEqual(['Deadlift', 'Squat', 'Bench Press']);
  });

  it('swaps adjacent exercises', () => {
    const session = threeExerciseSession();
    const next = reorderExercises(session, 0, 1);
    expect(blueprintNames(next)).toEqual(['Bench Press', 'Squat', 'Deadlift']);
  });

  it('does not mutate the original session', () => {
    const session = threeExerciseSession();
    reorderExercises(session, 0, 2);
    expect(blueprintNames(session)).toEqual(['Squat', 'Bench Press', 'Deadlift']);
  });

  it('commits through the real store with blueprint and recorded exercises still 1-for-1', () => {
    const session = threeExerciseSession();
    const state = storedSessionsReducer(undefined, putStoredSession(session));
    const next = storedSessionsReducer(
      state,
      updateStoredSession({ sessionId: session.id, update: (s) => reorderExercises(s, 0, 2) }),
    );
    const stored = next.sessions[session.id]!;
    expect(blueprintNames(stored)).toEqual(['Bench Press', 'Deadlift', 'Squat']);
    expect(recordedNames(stored)).toEqual(['Bench Press', 'Deadlift', 'Squat']);
    // Index alignment the row summary relies on: recorded[i] describes blueprint[i].
    expect(alignmentHolds(stored)).toEqual([true, true, true]);
  });
});

describe('remove all exercises', () => {
  it('clears both arrays through the real store while keeping name and notes', () => {
    const base = threeExerciseSession();
    const named = base.with({ blueprint: base.blueprint.with({ name: 'Push Day', notes: 'Tight shoulder' }) });
    const state = storedSessionsReducer(undefined, putStoredSession(named));
    const next = storedSessionsReducer(
      state,
      updateStoredSession({
        sessionId: named.id,
        update: (s) => s.with({ blueprint: s.blueprint.with({ exercises: [] }), recordedExercises: [] }),
      }),
    );
    const stored = next.sessions[named.id]!;
    expect(stored.blueprint.exercises).toHaveLength(0);
    expect(stored.recordedExercises).toHaveLength(0);
    expect(stored.blueprint.name).toBe('Push Day');
    expect(stored.blueprint.notes).toBe('Tight shoulder');
  });

  it('removing one exercise keeps the rest aligned', () => {
    const session = threeExerciseSession();
    const state = storedSessionsReducer(undefined, putStoredSession(session));
    const next = storedSessionsReducer(
      state,
      updateStoredSession({ sessionId: session.id, update: (s) => s.withRemovedExercise(1) }),
    );
    const stored = next.sessions[session.id]!;
    expect(blueprintNames(stored)).toEqual(['Squat', 'Deadlift']);
    expect(recordedNames(stored)).toEqual(['Squat', 'Deadlift']);
    expect(alignmentHolds(stored)).toEqual([true, true]);
  });
});
