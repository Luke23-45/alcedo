/**
 * Page 19/20 — What's New simulation (Settings → What's New).
 *
 * Presentational coverage runs at the model/logic level (React Native is
 * stubbed in this repo's test setup), the same pattern as pages 13–18:
 *
 * A. i18n completeness: every literal key in the whats-new folder plus
 *    every dynamic title/body/CTA key declared in whats-new.ts resolves
 *    in en.json.
 * B. Entry contract: ids are monotonic (the highest id drives the unread
 *    state), latestWhatsNewId matches, and every entry icon resolves in
 *    the material-symbols icon map.
 * C. CTA navigation: every entry CTA route resolves to a real
 *    expo-router route file.
 * D. Version honesty: the fabricated "(238)" is gone from the footer —
 *    it renders the real native version/build from expo-application.
 * E. Entry wells: every entry icon has its own tint (no silent fallback
 *    to another entry's color).
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { latestWhatsNewId, whatsNewEntries } from '@/models/whats-new';

const WHATSNEW_DIR = __dirname;
const SRC = resolve(WHATSNEW_DIR, '..', '..', '..', '..');
const ROUTES_DIR = join(SRC, 'app', '(tabs)');

function sources(): string {
  return readdirSync(WHATSNEW_DIR)
    .filter((f) => f.endsWith('.tsx') && !f.endsWith('.spec.tsx'))
    .map((f) => readFileSync(join(WHATSNEW_DIR, f), 'utf8'))
    .join('\n');
}

describe('whats-new i18n completeness', () => {
  it('resolves every literal and entry key in en.json', () => {
    const en = JSON.parse(readFileSync(join(SRC, 'i18n', 'en.json'), 'utf8')) as Record<string, unknown>;
    const keys = new Set<string>();
    for (const m of sources().matchAll(/(?:settingsKey|(?<![\w$])t)\('([^']+)'\)/g)) {
      keys.add(m[1]!);
    }
    for (const entry of whatsNewEntries) {
      keys.add(entry.titleKey);
      keys.add(entry.bodyKey);
      if (entry.cta) {
        keys.add(entry.cta.labelKey);
      }
    }
    expect(keys.size).toBeGreaterThan(0);
    const missing = [...keys].filter((k) => !(k in en));
    expect(missing).toEqual([]);
  });
});

describe('whats-new entry contract', () => {
  it('keeps ids monotonic and latestWhatsNewId truthful', () => {
    const ids = whatsNewEntries.map((e) => e.id);
    expect(ids).toEqual([...ids].sort((a, b) => a - b));
    expect(new Set(ids).size).toBe(ids.length);
    expect(latestWhatsNewId).toBe(Math.max(...ids));
  });

  it('resolves every entry icon in the material-symbols map', () => {
    const iconSource = readFileSync(join(SRC, 'components', 'presentation', 'foundation', 'ms-icon-source.tsx'), 'utf8');
    for (const entry of whatsNewEntries) {
      expect(iconSource, String(entry.icon)).toMatch(new RegExp(`^\\s*${String(entry.icon)}:`, 'm'));
    }
  });

  it('routes every entry CTA to a real route file', () => {
    for (const entry of whatsNewEntries) {
      if (!entry.cta) {
        continue;
      }
      const target = String(entry.cta.route);
      const asFile = join(ROUTES_DIR, `${target}.tsx`);
      const asIndex = join(ROUTES_DIR, target, 'index.tsx');
      expect(existsSync(asFile) || existsSync(asIndex), target).toBe(true);
    }
  });

  it('gives every entry icon its own well tint', () => {
    const card = readFileSync(join(WHATSNEW_DIR, 'whats-new-entry-card.tsx'), 'utf8');
    for (const entry of whatsNewEntries) {
      expect(card, String(entry.icon)).toMatch(new RegExp(`${String(entry.icon)}: \\{ hue:`));
    }
  });
});

describe('whats-new version honesty', () => {
  it('renders the real native version/build in the footer', () => {
    const screen = readFileSync(join(WHATSNEW_DIR, 'whats-new-screen.tsx'), 'utf8');
    expect(screen).toMatch(/expo-application/);
    expect(screen).toMatch(/nativeApplicationVersion/);
    expect(screen).toMatch(/nativeBuildVersion/);
    const en = JSON.parse(readFileSync(join(SRC, 'i18n', 'en.json'), 'utf8')) as Record<string, string>;
    expect(en['settings.whatsnew.footer']).toContain('{version}');
    expect(en['settings.whatsnew.footer']).toContain('{build}');
    expect(en['settings.whatsnew.footer']).not.toMatch(/\(238\)/);
  });

  it('keeps the fabricated build number out of the whats-new surface', () => {
    expect(sources()).not.toMatch(/\(238\)/);
  });
});
