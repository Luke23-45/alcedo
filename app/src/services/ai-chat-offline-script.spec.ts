/**
 * Offline coach script for greetings.
 *
 * When the coach is unreachable — no backend assigned, or the built-in
 * backend without a Pro token — a greeting gets a brief natural reply,
 * immediately labeled as a local fallback (it must never pretend a remote
 * AI answered), followed by the honest reason and the real Pro upgrade
 * response. Greetings to a reachable backend stay remote.
 */
import { describe, expect, it } from 'vitest';
import { Backend } from '@/models/backend';
import { isGreeting, offlineCoachScript } from '@/services/ai-chat-offline-script';
import { RootState } from '@/store';

const customBackend: Backend = { id: 'a', name: 'A', url: 'https://a.example.com', kind: 'liftlog', headers: [] };
const builtInBackend: Backend = {
  id: 'liftlog',
  name: 'Alcedo',
  url: 'https://alcedo.example.com',
  kind: 'liftlog',
  headers: [],
};

function stateWith(assignedId: string | undefined, backends: Backend[] = [customBackend]): RootState {
  return {
    backends: { backends, assignments: assignedId ? { aiPlanner: assignedId } : {}, isHydrated: true },
    settings: { proToken: undefined, preferredWeightUnit: 'kilograms' },
  } as unknown as RootState;
}

describe('isGreeting', () => {
  it('matches plain greetings across case and whitespace', () => {
    for (const text of ['hi', ' Hi ', 'HI', 'hello', 'Hello', 'hey', 'HEY', 'yo', 'sup']) {
      expect(isGreeting(text), text).toBe(true);
    }
  });

  it('matches multi-word greetings', () => {
    expect(isGreeting('good morning')).toBe(true);
    expect(isGreeting('Good Evening')).toBe(true);
  });

  it('rejects sentences and non-greetings', () => {
    for (const text of ['', 'build me a plan', 'hi there how are you', 'history', 'history please', 'h i']) {
      expect(isGreeting(text), text).toBe(false);
    }
  });
});

describe('offlineCoachScript', () => {
  it('returns undefined for non-greetings even with no backend', () => {
    expect(offlineCoachScript(stateWith(undefined), 'build me a plan')).toBeUndefined();
  });

  it('returns undefined for greetings when a reachable custom backend exists', () => {
    expect(offlineCoachScript(stateWith('a'), 'hi')).toBeUndefined();
  });

  it('answers greetings locally with the Pro path when no backend is assigned', () => {
    const script = offlineCoachScript(stateWith(undefined), 'hi');
    expect(script).toHaveLength(3);
    expect(script![0]).toEqual({ type: 'messageResponse', message: 'Hey — good to see you.' });
    expect(script![1]!.type).toBe('messageResponse');
    expect((script![1]! as { message: string }).message).toContain('locally');
    // The greeting fills the loading bubble; the explanation and the Pro CTA
    // each open their own bubble so none overwrites the other.
    expect(script![0]).not.toHaveProperty('appendAsNew');
    expect(script![1]).toHaveProperty('appendAsNew', true);
    expect(script![2]).toEqual({ type: 'purchasePro', appendAsNew: true });
  });

  it('answers greetings locally with the Pro path for the built-in backend without Pro', () => {
    const script = offlineCoachScript(stateWith('liftlog', [builtInBackend]), 'hello');
    expect(script).toHaveLength(3);
    expect(script![2]).toEqual({ type: 'purchasePro', appendAsNew: true });
  });

  it('matches greetings with mixed case and surrounding whitespace', () => {
    expect(offlineCoachScript(stateWith(undefined), '  Hi ')).toHaveLength(3);
  });
});
