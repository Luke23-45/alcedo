import { describe, expect, it, vi } from 'vitest';
import { makeSession, makeWeightedBlueprint } from '@/models/session-models/__test__/helpers';
import { storedSessionsReducer, putStoredSession, updateStoredSession } from '@/store/stored-sessions';
import { buildDraftCommitUpdate, resolveDraftName, shouldCommitDraftOnDismiss } from './draft';

vi.mock('expo-localization', () => ({ getLocales: () => [{ decimalSeparator: '.' }] }));

function stateWithSession() {
  const session = makeSession([makeWeightedBlueprint({ name: 'Squat' })]);
  const withNotes = session.with({ blueprint: session.blueprint.withNotes('Existing notes') });
  const state = storedSessionsReducer(undefined, putStoredSession(withNotes));
  return { state, sessionId: withNotes.id };
}

describe('shouldCommitDraftOnDismiss', () => {
  it('commits on Save', () => {
    expect(shouldCommitDraftOnDismiss('save')).toBe(true);
  });

  it('commits on ordinary dismissal (back chevron, swipe-back)', () => {
    expect(shouldCommitDraftOnDismiss(null)).toBe(true);
  });

  it('discards only on Cancel', () => {
    expect(shouldCommitDraftOnDismiss('cancel')).toBe(false);
  });
});

describe('resolveDraftName', () => {
  it('trims a dirty name', () => {
    expect(resolveDraftName('  Leg Day  ', true, 'Push Day')).toBe('Leg Day');
  });

  it('keeps the stored name when the draft is blank — a plan can never be saved nameless', () => {
    expect(resolveDraftName('   ', true, 'Push Day')).toBe('Push Day');
  });

  it('resolves to undefined when the name was never touched', () => {
    expect(resolveDraftName('Push Day', false, 'Push Day')).toBeUndefined();
  });

  it('commits the blank-name fallback through the real store', () => {
    const { state, sessionId } = stateWithSession();
    const storedName = state.sessions[sessionId]!.blueprint.name;
    const next = storedSessionsReducer(
      state,
      updateStoredSession({
        sessionId,
        update: buildDraftCommitUpdate(resolveDraftName('   ', true, storedName), undefined),
      }),
    );
    expect(next.sessions[sessionId]!.blueprint.name).toBe(storedName);
  });

  it('clearing the notes persists the empty string', () => {
    const { state, sessionId } = stateWithSession();
    const next = storedSessionsReducer(
      state,
      updateStoredSession({ sessionId, update: buildDraftCommitUpdate(undefined, '') }),
    );
    expect(next.sessions[sessionId]!.blueprint.notes).toBe('');
  });
});

describe('buildDraftCommitUpdate', () => {
  it('persists name and notes through the real store', () => {
    const { state, sessionId } = stateWithSession();
    const next = storedSessionsReducer(
      state,
      updateStoredSession({ sessionId, update: buildDraftCommitUpdate('Leg Day', 'Focus on depth') }),
    );
    const session = next.sessions[sessionId]!;
    expect(session.blueprint.name).toBe('Leg Day');
    expect(session.blueprint.notes).toBe('Focus on depth');
  });

  it('leaves untouched fields alone', () => {
    const { state, sessionId } = stateWithSession();
    const next = storedSessionsReducer(
      state,
      updateStoredSession({ sessionId, update: buildDraftCommitUpdate('Leg Day', undefined) }),
    );
    const session = next.sessions[sessionId]!;
    expect(session.blueprint.name).toBe('Leg Day');
    // Notes were never edited: the stored value survives the commit.
    expect(session.blueprint.notes).toBe('Existing notes');
  });

  it('keeps exercises intact when only name/notes commit', () => {
    const { state, sessionId } = stateWithSession();
    const next = storedSessionsReducer(
      state,
      updateStoredSession({ sessionId, update: buildDraftCommitUpdate('Leg Day', 'Notes') }),
    );
    expect(next.sessions[sessionId]!.blueprint.exercises).toHaveLength(1);
  });
});
