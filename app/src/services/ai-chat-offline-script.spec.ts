/**
 * Offline coach script for greetings.
 *
 * When the coach is unreachable — signed out, or the network is down — a
 * greeting gets a brief natural reply, immediately labeled as a local
 * fallback (it must never pretend a remote AI answered), followed by the
 * honest reason. Greetings the coach *can* answer go to the server, so this
 * script only fires on the failure paths the service detects.
 */
import { describe, expect, it } from 'vitest';
import { isGreeting, offlineCoachScript } from '@/services/ai-chat-offline-script';

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
  it('labels the reply as local and explains the sign-out', () => {
    const script = offlineCoachScript('session-expired');

    expect(script).toHaveLength(2);
    expect(script[0]).toEqual({ type: 'messageResponse', message: 'Hey — good to see you.' });
    expect(script[1]!.type).toBe('messageResponse');
    expect((script[1]! as { message: string }).message).toContain('locally');
    expect((script[1]! as { message: string }).message).toContain('signed out');
    // The greeting fills the loading bubble; the explanation opens its own
    // bubble so it never overwrites the greeting.
    expect(script[0]).not.toHaveProperty('appendAsNew');
    expect(script[1]).toHaveProperty('appendAsNew', true);
  });

  it('labels the reply as local and explains the outage', () => {
    const script = offlineCoachScript('network');

    expect(script).toHaveLength(2);
    expect((script[1]! as { message: string }).message).toContain("can't reach the servers");
  });
});
