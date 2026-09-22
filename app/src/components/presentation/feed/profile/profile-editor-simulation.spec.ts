import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import en from '@/i18n/en.json';
import { PEOPLE } from '../shared/people';
import { buildOwnPerson, identityNameChanged, normalizeIdentityName, ownPersonInitial } from '../shared/own-person';
import { cleanBlockedUsername } from './blocked-accounts';

const here = dirname(fileURLToPath(import.meta.url));

describe('own person derivation', () => {
  it('uses the real identity name and username, never the contract fiction', () => {
    const person = buildOwnPerson({ name: 'Jordan Lee', username: 'jordanlifts' });
    expect(person.name).toBe('Jordan Lee');
    expect(person.handle).toBe('@jordanlifts');
    expect(person.initial).toBe('J');
    expect(person.name).not.toBe('Alex Rivera');
    expect(person.handle).not.toBe('@alexr');
  });

  it('falls back to the username when no display name is set', () => {
    const person = buildOwnPerson({ name: '', username: 'jordanlifts' });
    expect(person.name).toBe('jordanlifts');
    expect(person.handle).toBe('@jordanlifts');
    expect(person.initial).toBe('J');
  });

  it('keeps the contract violet visual identity for the own user', () => {
    const person = buildOwnPerson({ name: 'Jordan Lee', username: 'jordanlifts' });
    expect(person.id).toBe('alex');
    expect(person.gradient).toEqual(PEOPLE.alex!.gradient);
    expect(person.color).toBe(PEOPLE.alex!.color);
  });

  it('trims whitespace and strips stray @ from the username', () => {
    const person = buildOwnPerson({ name: '  Jordan Lee  ', username: '@@jordanlifts' });
    expect(person.name).toBe('Jordan Lee');
    expect(person.handle).toBe('@jordanlifts');
  });

  it('renders an honest empty identity when nothing is set', () => {
    const person = buildOwnPerson({ name: '   ', username: '' });
    expect(person.name).toBe('');
    expect(person.handle).toBe('');
    expect(person.initial).toBe('•');
  });
});

describe('ownPersonInitial', () => {
  it('prefers the name, then the username', () => {
    expect(ownPersonInitial('Jordan Lee', 'jordanlifts')).toBe('J');
    expect(ownPersonInitial('', 'jordanlifts')).toBe('J');
    expect(ownPersonInitial('   ', '@jordanlifts')).toBe('J');
  });

  it('uppercases the first alphanumeric character', () => {
    expect(ownPersonInitial('émile', '')).toBe('É');
    expect(ownPersonInitial('23luke', '')).toBe('2');
  });

  it('never invents a letter when the source has none', () => {
    expect(ownPersonInitial('', '')).toBe('•');
    expect(ownPersonInitial('🎉 party', '')).toBe('•');
  });
});

describe('identity name sync gating', () => {
  it('detects a real change ignoring surrounding whitespace', () => {
    expect(identityNameChanged('Jordan Lee', 'Jordan')).toBe(true);
    expect(identityNameChanged('  Jordan  ', 'Jordan')).toBe(false);
    expect(identityNameChanged('', '')).toBe(false);
  });

  it('normalizes the draft name, clearing it when emptied', () => {
    expect(normalizeIdentityName('  Jordan Lee  ')).toBe('Jordan Lee');
    expect(normalizeIdentityName('   ')).toBeUndefined();
  });

  it('does not fire a remote update for an unchanged name', () => {
    // The container only dispatches updateFeedIdentity when this returns true;
    // an unchanged name must never queue an outbox entry or risk a rollback.
    expect(identityNameChanged('Jordan', ' Jordan ')).toBe(false);
  });
});

describe('blocked username normalization', () => {
  it('strips @, whitespace, and lowercases', () => {
    expect(cleanBlockedUsername('@SpamBot_99')).toBe('spambot_99');
    expect(cleanBlockedUsername('  @Spam Bot ')).toBe('spambot');
  });

  it('rejects empty and duplicate entries', () => {
    expect(cleanBlockedUsername('   ')).toBe('');
    expect(cleanBlockedUsername('@@@')).toBe('');
    const blocked = ['spambot_99'];
    expect(blocked.includes(cleanBlockedUsername('@SpamBot_99'))).toBe(true);
  });
});

describe('profile i18n completeness', () => {
  it('every feedKey used by the profile components resolves in en.json', () => {
    const keyPattern = /feedKey\("([^"]+)"\)/g;
    const used = new Set<string>();
    const files = readdirSync(here).filter((f) => f.endsWith('.tsx') && !f.endsWith('.spec.tsx'));
    for (const file of files) {
      const source = readFileSync(join(here, file), 'utf8');
      for (const match of source.matchAll(keyPattern)) {
        used.add(match[1]!);
      }
    }
    expect(used.size).toBeGreaterThan(0);
    const missing = [...used].filter((key) => !(key in en));
    expect(missing).toEqual([]);
  });
});
