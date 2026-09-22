/**
 * Page 13/20 — Settings home simulation.
 *
 * The settings home is presentational (React Native is stubbed out in the
 * repo's test setup), so the simulation runs at the model/logic level the
 * same way the page-1..12 suites did:
 *
 * A. Pure identity derivation behind the profile header (real name /
 *    username only — no fictional fallback, no bare "@", VoiceOver-safe
 *    accessibility label).
 * B. i18n completeness: every settingsKey used in the home folder resolves
 *    in en.json (a raw key string reaching a user is a defect).
 * C. Icon-glyph validity: every `icon="…"` used here is a real
 *    MaterialSymbols/CustomIcons key — a wider blank-icon risk flagged on
 *    page 12; this page proves its own icons resolve.
 * D. Navigation correctness: every router.push target in the home folder
 *    resolves to a real expo-router route file; every openUrl literal is a
 *    valid https URL; copyLogs is exported from the app store slice.
 * E. Spec order: YOUR TRAINING renders before PREFERENCES
 *    (settings-dark.md Screen 1).
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { deriveProfileHeaderData } from './profile-header-data';

const HOME_DIR = __dirname;
const SRC = join(HOME_DIR, '..', '..', '..', '..');
const APP_DIR = join(SRC, 'app', '(tabs)');

function homeSourceFiles(): { name: string; text: string }[] {
  return readdirSync(HOME_DIR)
    .filter((f) => f.endsWith('.tsx') && !f.endsWith('.spec.tsx'))
    .map((name) => ({ name, text: readFileSync(join(HOME_DIR, name), 'utf8') }));
}

describe('profile header identity derivation', () => {
  it('shows the real name with the @username handle', () => {
    expect(deriveProfileHeaderData('Jordan', 'jordanlifts')).toEqual({
      title: 'Jordan',
      handle: '@jordanlifts',
    });
  });

  it('falls back to @username when the name is empty', () => {
    expect(deriveProfileHeaderData('', 'jordanlifts')).toEqual({
      title: '@jordanlifts',
      handle: '@jordanlifts',
    });
  });

  it('shows no handle line when the username is empty', () => {
    expect(deriveProfileHeaderData('Jordan', '')).toEqual({ title: 'Jordan', handle: '' });
  });

  it('renders nothing (never fiction) when both are empty', () => {
    expect(deriveProfileHeaderData('', '')).toEqual({ title: '', handle: '' });
  });

  it('treats whitespace-only identity as empty', () => {
    expect(deriveProfileHeaderData('   ', '  ')).toEqual({ title: '', handle: '' });
  });

  it('strips stray leading @ signs so "@" never renders alone', () => {
    expect(deriveProfileHeaderData('', '@@jordan')).toEqual({
      title: '@jordan',
      handle: '@jordan',
    });
  });

  it('trims a padded username before display', () => {
    expect(deriveProfileHeaderData('', '  @spam  ')).toEqual({ title: '@spam', handle: '@spam' });
  });

  it('accepts undefined inputs without inventing identity', () => {
    expect(deriveProfileHeaderData(undefined, undefined)).toEqual({ title: '', handle: '' });
  });

  it('trims the display name', () => {
    expect(deriveProfileHeaderData('  Jordan  ', 'jordanlifts').title).toBe('Jordan');
  });
});

describe('i18n completeness (settings home)', () => {
  const en = JSON.parse(readFileSync(join(SRC, 'i18n', 'en.json'), 'utf8')) as Record<string, unknown>;
  const used = new Set<string>();
  for (const { text } of homeSourceFiles()) {
    for (const match of text.matchAll(/settingsKey\('([^']+)'\)/g)) {
      const key = match[1];
      if (key) used.add(key);
    }
  }

  it('uses settings keys from this folder', () => {
    expect(used.size).toBeGreaterThan(0);
  });

  for (const key of [...used].sort()) {
    it(`resolves "${key}" in en.json`, () => {
      expect(Object.prototype.hasOwnProperty.call(en, key), `missing i18n key: ${key}`).toBe(true);
    });
  }
});

describe('icon glyph validity (settings home)', () => {
  const iconSource = readFileSync(join(SRC, 'components', 'presentation', 'foundation', 'ms-icon-source.tsx'), 'utf8');
  const symbolsBlock = iconSource.slice(
    iconSource.indexOf('const MaterialSymbols = {'),
    iconSource.indexOf('};', iconSource.indexOf('const MaterialSymbols = {')),
  );
  const valid = new Set<string>(['plusMinus']);
  for (const match of symbolsBlock.matchAll(/^\s{2}([A-Za-z][A-Za-z0-9]*):/gm)) {
    const key = match[1];
    if (key) valid.add(key);
  }

  const used = new Set<string>();
  for (const { text } of homeSourceFiles()) {
    for (const match of text.matchAll(/icon="([A-Za-z]+)"/g)) {
      const icon = match[1];
      if (icon) used.add(icon);
    }
  }

  it('uses icons from this folder', () => {
    expect(used.size).toBeGreaterThan(0);
  });

  for (const icon of [...used].sort()) {
    it(`"${icon}" is a registered MaterialSymbols key`, () => {
      expect(valid.has(icon), `unknown icon glyph: ${icon}`).toBe(true);
    });
  }
});

describe('navigation targets (settings home)', () => {
  function routeFileExists(target: string): boolean {
    const segments = target.split('/').filter(Boolean);
    const last = segments[segments.length - 1];
    if (!last) {
      return false;
    }
    let dir = APP_DIR;
    for (const seg of segments.slice(0, -1)) {
      const next = join(dir, seg);
      if (!existsSync(next) || !statSync(next).isDirectory()) {
        return false;
      }
      dir = next;
    }
    return existsSync(join(dir, `${last}.tsx`)) || existsSync(join(dir, last, 'index.tsx'));
  }

  const pushes = new Set<string>();
  const openUrls = new Set<string>();
  for (const { text } of homeSourceFiles()) {
    for (const match of text.matchAll(/push\('([^']+)'\)/g)) {
      const target = match[1];
      if (target) pushes.add(target);
    }
    for (const match of text.matchAll(/openUrl\('([^']+)'\)/g)) {
      const url = match[1];
      if (url) openUrls.add(url);
    }
  }

  it('navigates from this page', () => {
    expect(pushes.size).toBeGreaterThan(0);
  });

  for (const target of [...pushes].sort()) {
    it(`"${target}" resolves to a real route`, () => {
      expect(routeFileExists(target), `no route file for: ${target}`).toBe(true);
    });
  }

  for (const url of [...openUrls].sort()) {
    it(`"${url}" is a valid https URL`, () => {
      expect(() => new URL(url)).not.toThrow();
      expect(url.startsWith('https://')).toBe(true);
      expect(url).not.toContain(' ');
    });
  }

  it('copyLogs is a real exported action (Copy Logs row)', () => {
    const appStore = readFileSync(join(SRC, 'store', 'app', 'index.ts'), 'utf8');
    expect(appStore).toMatch(/export (const|function) copyLogs/);
  });
});

describe('spec section order (settings home)', () => {
  it('renders YOUR TRAINING before PREFERENCES (settings-dark.md Screen 1)', () => {
    const text = readFileSync(join(HOME_DIR, 'settings-home.tsx'), 'utf8');
    const training = text.indexOf('<TrainingGroup />');
    const preferences = text.indexOf('<PreferencesGroup />');
    expect(training).toBeGreaterThan(-1);
    expect(preferences).toBeGreaterThan(-1);
    expect(training).toBeLessThan(preferences);
  });
});
