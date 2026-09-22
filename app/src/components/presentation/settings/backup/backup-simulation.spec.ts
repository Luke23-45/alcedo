/**
 * Page 18/20 — Backup hub + child routes simulation
 * (Settings → Backup & Restore).
 *
 * Presentational coverage runs at the model/logic level (React Native is
 * stubbed in this repo's test setup), the same pattern as pages 13–17:
 *
 * A. i18n completeness: every literal key passed to t()/settingsKey() in
 *    the backup, backup-remote, choose-server, plaintext-export, and
 *    import-apps folders resolves in en.json.
 * B. Navigation correctness: every router.push target in those folders
 *    resolves to a real expo-router route file.
 * C. Version honesty: the release card renders the real native
 *    version/build from expo-application — the fabricated
 *    "June 2025 · build 238" is gone from every layer.
 * D. Focus-effect robustness: the plaintext-export screen's
 *    useFocusEffect callback has a stable identity (without useCallback
 *    it re-subscribed on every render and the DB read + dispatch looped
 *    forever while focused).
 * E. Backup-mode contract: the Off/Automatic/Manual mode key persists
 *    through the settings registry.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { preferenceRegistry } from '@/store/settings/registry';

const SETTINGS_DIR = resolve(__dirname, '..');
const SRC = resolve(SETTINGS_DIR, '..', '..', '..');
const ROUTES_DIR = join(SRC, 'app', '(tabs)');
const BACKUP_FOLDERS = ['backup', 'backup-remote', 'choose-server', 'plaintext-export', 'import-apps'].map((f) =>
  join(SETTINGS_DIR, f),
);

function readSourcesRecursive(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...readSourcesRecursive(full));
    } else if (entry.endsWith('.tsx') && !entry.endsWith('.spec.tsx')) {
      out.push(readFileSync(full, 'utf8'));
    }
  }
  return out;
}

const SOURCES = BACKUP_FOLDERS.flatMap(readSourcesRecursive).join('\n');

describe('backup i18n completeness', () => {
  it('resolves every literal key used by the backup surface in en.json', () => {
    const en = JSON.parse(readFileSync(join(SRC, 'i18n', 'en.json'), 'utf8')) as Record<string, unknown>;
    const keys = new Set<string>();
    for (const m of SOURCES.matchAll(/(?:settingsKey|(?<![\w$])t)\('([^']+)'\)/g)) {
      keys.add(m[1]!);
    }
    // Dynamic bullet keys: settingsKey(key) over BULLET_KEYS.
    for (let i = 1; i <= 5; i++) {
      keys.add(`settings.backup.release.bullet_${i}`);
    }
    expect(keys.size).toBeGreaterThan(0);
    const missing = [...keys].filter((k) => !(k in en));
    expect(missing).toEqual([]);
  });
});

describe('backup navigation', () => {
  it('pushes only to real route files', () => {
    const targets = [...SOURCES.matchAll(/push\('([^']+)'\)/g)].map((m) => m[1]!);
    expect(targets.length).toBeGreaterThan(0);
    for (const target of targets) {
      const asFile = join(ROUTES_DIR, `${target}.tsx`);
      const asIndex = join(ROUTES_DIR, target, 'index.tsx');
      expect(existsSync(asFile) || existsSync(asIndex), target).toBe(true);
    }
  });
});

describe('release version honesty', () => {
  it('reads the real native version/build instead of a fabricated string', () => {
    const source = readFileSync(join(SETTINGS_DIR, 'backup', 'release-card.tsx'), 'utf8');
    expect(source).toMatch(/expo-application/);
    expect(source).toMatch(/nativeApplicationVersion/);
    expect(source).toMatch(/nativeBuildVersion/);
    expect(source).not.toMatch(/build 238/);
    expect(source).not.toMatch(/June 2025/);
  });

  it('keeps the fabricated strings out of every backup layer', () => {
    expect(SOURCES).not.toMatch(/build 238/);
    expect(SOURCES).not.toMatch(/June 2025/);
    const en = readFileSync(join(SRC, 'i18n', 'en.json'), 'utf8');
    expect(en).not.toMatch(/build 238/);
    expect(en).not.toMatch(/June 2025/);
  });

  it('parameterizes the release title/meta on the real values', () => {
    const en = JSON.parse(readFileSync(join(SRC, 'i18n', 'en.json'), 'utf8')) as Record<string, string>;
    expect(en['settings.backup.release.title']).toContain('{version}');
    expect(en['settings.backup.release.meta']).toContain('{build}');
  });
});

describe('plaintext export focus effect', () => {
  it('gives the focus callback a stable identity', () => {
    const source = readFileSync(join(SETTINGS_DIR, 'plaintext-export', 'plaintext-export-screen.tsx'), 'utf8');
    expect(source).toMatch(/useCallback\(\(\) => \{\s*dispatch\(refreshExportPreview\(\)\);?\s*\}, \[dispatch\]\)/);
    expect(source).toMatch(/useFocusEffect\(\w+\)/);
  });
});

describe('backup-mode persistence contract', () => {
  it('persists the consent mode and last test run through the registry', () => {
    for (const key of ['backupMode', 'lastRemoteBackupTest'] as const) {
      expect(preferenceRegistry[key].codec, key).toBeDefined();
      expect(preferenceRegistry[key].persist ?? true, key).toBe(true);
    }
    expect(preferenceRegistry['backupMode'].default).toBe('off');
  });

  it('keeps lastBackup on bespoke manual hydration (persisted only on success)', () => {
    expect(preferenceRegistry['lastBackup'].persist).toBe(false);
    expect(preferenceRegistry['lastBackup'].hydrate).toBe('manual');
  });
});
