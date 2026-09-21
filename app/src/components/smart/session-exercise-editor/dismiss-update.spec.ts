import { describe, expect, it, vi } from 'vitest';
import { makeSession, makeWeightedBlueprint } from '@/models/session-models/__test__/helpers';
import { WeightedExerciseBlueprint } from '@/models/blueprint-models';
import { storedSessionsReducer, putStoredSession, updateStoredSession } from '@/store/stored-sessions';
import { exerciseEditorDismissUpdate } from './dismiss-update';

vi.mock('expo-localization', () => ({ getLocales: () => [{ decimalSeparator: '.' }] }));

describe('exerciseEditorDismissUpdate', () => {
  it('returns no update when there is no draft: backing out keeps the added exercise with defaults', () => {
    const session = makeSession([makeWeightedBlueprint({ name: 'Squat' })]);
    const state = storedSessionsReducer(undefined, putStoredSession(session));

    // The workout editor inserts a default exercise, then the user backs out
    // of the configuration sheet without touching anything.
    const update = exerciseEditorDismissUpdate(0, undefined, false);
    expect(update).toBeUndefined();

    // Nothing was dispatched, so the placeholder is still in the plan.
    expect(state.sessions[session.id]!.blueprint.exercises).toHaveLength(1);
  });

  it('commits the draft when one exists', () => {
    const session = makeSession([makeWeightedBlueprint({ name: 'Squat' })]);
    const state = storedSessionsReducer(undefined, putStoredSession(session));
    const draft = WeightedExerciseBlueprint.of({ name: 'Front Squat', sets: 3 });

    const update = exerciseEditorDismissUpdate(0, draft, false);
    expect(update).toBeDefined();

    const next = storedSessionsReducer(state, updateStoredSession({ sessionId: session.id, update: update! }));
    expect(next.sessions[session.id]!.blueprint.exercises[0]!.name).toBe('Front Squat');
  });

  it('is a no-op when the exercise was removed while the editor was open', () => {
    const session = makeSession([makeWeightedBlueprint({ name: 'Squat' })]);
    const emptied = session.with({ blueprint: session.blueprint.with({ exercises: [] }), recordedExercises: [] });
    const draft = WeightedExerciseBlueprint.of({ name: 'Front Squat', sets: 3 });

    const update = exerciseEditorDismissUpdate(0, draft, false);
    const next = update!(emptied);
    expect(next.blueprint.exercises).toHaveLength(0);
  });
});
