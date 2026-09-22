/**
 * Page 14 — Settings → Preferences simulation.
 *
 * Drives the pure logic behind every Preferences card without a device:
 * language resolution (the app ships more translation bundles than the
 * six curated picker rows — the Language row must never claim English
 * while the app runs in another language), the accent-seed ramp, the
 * segmented-control thumb math, the units bodyweight caption, plus
 * repo-wide honesty scans (every settingsKey resolves in en.json; every
 * Icon source is a registered Material Symbols key; the Ember gradient
 * comes from the seed, not a hard-coded constant).
 */
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';

vi.mock('expo-localization', () => ({
  getLocales: () => [{ decimalSeparator: '.' }],
}));
import { ACCENT_SEED_IDS, ACCENT_SEEDS, accentSeedFor } from '@/styles/accent-seeds';
import { Weight } from '@/models/weight';
import { activeLanguageFor, languageRowValue, PICKER_LANGUAGES, pickerRowSelected } from './language-data';
import { formatUnitsBodyweight } from './units-bodyweight';
import { segmentedIndex, segmentedThumb } from './preference-segmented-math';

const here = dirname(fileURLToPath(import.meta.url));
const read = (rel: string) => readFileSync(join(here, rel), 'utf8');

// ─── activeLanguageFor ────────────────────────────────────────────────────

describe('activeLanguageFor', () => {
  it('resolves the curated six with native name and region', () => {
    const en = activeLanguageFor('en');
    expect(en).toEqual({ nativeName: 'English', regionCode: 'US', regionName: 'United States', curated: true });
    expect(activeLanguageFor('es').nativeName).toBe('Español');
    expect(activeLanguageFor('fr').regionName).toBe('France');
    expect(activeLanguageFor('de').regionCode).toBe('DE');
    expect(activeLanguageFor('pt').nativeName).toBe('Português (Brasil)');
  });

  it('keeps disabled Japanese curated (it has a picker row)', () => {
    const ja = activeLanguageFor('ja');
    expect(ja.curated).toBe(true);
    expect(ja.nativeName).toBe('日本語');
  });

  it('resolves a supported-but-non-curated language to its real native label', () => {
    // Russian ships a full translation bundle but has no picker row: the
    // Language row must show Русский, never pretend it is English (US).
    const ru = activeLanguageFor('ru');
    expect(ru.nativeName).toBe('Русский');
    expect(ru.curated).toBe(false);
    expect(ru.regionCode).toBeUndefined();
    expect(ru.regionName).toBeUndefined();
  });

  it('falls back to English for unknown or missing codes', () => {
    expect(activeLanguageFor('xx').nativeName).toBe('English');
    expect(activeLanguageFor('xx').curated).toBe(true);
    expect(activeLanguageFor(undefined).nativeName).toBe('English');
  });
});

describe('languageRowValue', () => {
  it('shows "English (US)" for curated languages', () => {
    expect(languageRowValue(activeLanguageFor('en'))).toBe('English (US)');
    expect(languageRowValue(activeLanguageFor('de'))).toBe('Deutsch (DE)');
  });

  it('shows the bare native label for non-curated languages (no invented region)', () => {
    expect(languageRowValue(activeLanguageFor('ru'))).toBe('Русский');
  });
});

describe('pickerRowSelected', () => {
  const byCode = (code: string) => PICKER_LANGUAGES.find((l) => l.code === code)!;

  it('checks the exact enabled match', () => {
    expect(pickerRowSelected(byCode('en'), 'en')).toBe(true);
    expect(pickerRowSelected(byCode('es'), 'en')).toBe(false);
  });

  it('checks nothing when the active language has no picker row', () => {
    for (const row of PICKER_LANGUAGES) {
      expect(pickerRowSelected(row, 'ru')).toBe(false);
    }
  });

  it('never checks the disabled Japanese row', () => {
    expect(pickerRowSelected(byCode('ja'), 'ja')).toBe(false);
  });
});

// ─── accent seeds ─────────────────────────────────────────────────────────

describe('accentSeedFor', () => {
  it('maps the default sentinel to ember', () => {
    expect(accentSeedFor('default').id).toBe('ember');
  });

  it('round-trips every seed swatch', () => {
    for (const id of ACCENT_SEED_IDS) {
      expect(accentSeedFor(ACCENT_SEEDS[id].swatch).id).toBe(id);
    }
  });

  it('matches case-insensitively and falls back to ember for unknown hex', () => {
    expect(accentSeedFor(ACCENT_SEEDS.blue.swatch.toLowerCase()).id).toBe('blue');
    expect(accentSeedFor('#123456').id).toBe('ember');
    expect(accentSeedFor(undefined).id).toBe('ember');
  });

  it('renders the brand gradient only for ember', () => {
    expect(ACCENT_SEEDS.ember.gradient).toEqual(['#FFB03A', '#FF6A3D', '#FF2D55']);
    for (const id of ACCENT_SEED_IDS) {
      if (id !== 'ember') {
        expect(ACCENT_SEEDS[id].gradient).toBeUndefined();
      }
    }
  });

  it('renders the gradient from the seed, not a hard-coded constant', () => {
    const card = read('appearance-card.tsx');
    const styles = read('appearance-card.styles.ts');
    expect(styles).not.toContain('EMBER_GRADIENT_COLORS');
    expect(card).toContain('[...seed.gradient]');
  });
});

// ─── segmented math ───────────────────────────────────────────────────────

describe('segmentedIndex', () => {
  const options = [{ value: 'light' }, { value: 'dark' }, { value: 'system' }] as const;

  it('finds the selected option', () => {
    expect(segmentedIndex(options, 'light')).toBe(0);
    expect(segmentedIndex(options, 'dark')).toBe(1);
    expect(segmentedIndex(options, 'system')).toBe(2);
  });

  it('clamps an unknown value to the first segment', () => {
    expect(segmentedIndex(options, 'unknown' as 'light')).toBe(0);
  });
});

describe('segmentedThumb', () => {
  it('overshoots the segment by 2pt per side on large (111 in a 107 segment)', () => {
    expect(segmentedThumb(1, 107, 'large')).toEqual({ offset: 105, width: 111 });
    expect(segmentedThumb(0, 107, 'large')).toEqual({ offset: -2, width: 111 });
  });

  it('insets by 2pt on small (56 in a 60 segment)', () => {
    expect(segmentedThumb(0, 60, 'small')).toEqual({ offset: 2, width: 56 });
    expect(segmentedThumb(1, 60, 'small')).toEqual({ offset: 62, width: 56 });
  });
});

// ─── units bodyweight caption ─────────────────────────────────────────────

describe('formatUnitsBodyweight', () => {
  it('returns undefined without a recorded bodyweight (honest fallback caption)', () => {
    expect(formatUnitsBodyweight(undefined, 'kg')).toBeUndefined();
    expect(formatUnitsBodyweight(undefined, 'lb')).toBeUndefined();
  });

  it('formats in the selected unit', () => {
    const bw = new Weight(80.6, 'kilograms');
    expect(formatUnitsBodyweight(bw, 'kg')).toBe('80.6kg');
    // 80.6 kg → 177.66 lb, rounded to one decimal.
    expect(formatUnitsBodyweight(bw, 'lb')).toBe('177.7lbs');
  });
});

// ─── honesty scans ────────────────────────────────────────────────────────

describe('preferences i18n completeness', () => {
  it('resolves every settingsKey used by the preferences folder in en.json', () => {
    const en = JSON.parse(readFileSync(resolve(here, '../../../../i18n/en.json'), 'utf8')) as Record<string, unknown>;
    const sources = [
      'appearance-card',
      'units-card',
      'language-region-card',
      'language-picker-card',
      'display-card',
      'preferences-screen',
    ]
      .map((f) => read(`${f}.tsx`))
      .join('\n');
    const keys = new Set<string>();
    for (const m of sources.matchAll(/settingsKey\('([^']+)'\)/g)) {
      keys.add(m[1]!);
    }
    // Dynamic accent keys: settingsKey(`settings.preferences.accent.${seed.id}`).
    for (const id of ACCENT_SEED_IDS) {
      keys.add(`settings.preferences.accent.${id}`);
    }
    const missing = [...keys].filter((k) => !(k in en));
    expect(missing).toEqual([]);
  });
});

describe('preferences icon registry', () => {
  it('uses only registered Material Symbols icon keys (no blank icons)', () => {
    const registry = read('../../foundation/ms-icon-source.tsx');
    const registered = new Set([...registry.matchAll(/^  (\w+): ms[A-Z]/gm)].map((m) => m[1]));
    expect(registered.size).toBeGreaterThan(0);
    const sources = [
      'appearance-card',
      'units-card',
      'language-region-card',
      'language-picker-card',
      'display-card',
      'preference-segmented',
    ]
      .map((f) => read(`${f}.tsx`))
      .join('\n');
    const used = new Set([...sources.matchAll(/source="(\w+)"/g)].map((m) => m[1]));
    const missing = [...used].filter((s) => !registered.has(s));
    expect(missing).toEqual([]);
  });
});

describe('preferences route wiring', () => {
  it('both legacy routes render the Preferences screen', () => {
    for (const route of ['app-configuration', 'localization']) {
      const src = readFileSync(resolve(here, `../../../../app/(tabs)/settings/${route}.tsx`), 'utf8');
      expect(src).toContain('PreferencesScreen');
    }
  });
});
