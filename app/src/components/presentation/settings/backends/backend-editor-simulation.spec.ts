/**
 * Page 20/20 — `/settings/backends/[id]` editor simulation.
 *
 * REDESIGNED 2026-09-22: Apple-inspired grouped editor (Connection card with
 * label-above-field rows, native segmented server type, HTTP headers list
 * with an iOS add/edit sheet, probe result card, bottom Delete action).
 * This spec verifies the editor contract (audited 2026-09-21) at the
 * model/store level plus static checks over the route and editor files:
 *
 * A. Completeness contract: `isBackendComplete` = trimmed non-empty name
 *    and URL matching `^https?://.+`.
 * B. URL normalization: trim + strip trailing slashes (on-blur behavior).
 * C. Deletion: `removeBackend` removes the backend and clears every
 *    feature assignment that pointed at it (no undo, no dangling refs).
 * D. Built-in backend: virtual (`builtInBackend`), never stored, never
 *    serves backup; the editor route redirects unknown ids (including the
 *    built-in id) to /settings/backends.
 * E. No unshipped scope: no S3/WebDAV/FTP/scheduling/restore in the editor.
 * F. i18n completeness: every literal key used by the [id] route resolves
 *    in en.json.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  Backend,
  backendSupportsFeature,
  backendUrlIsValid,
  builtInBackendId,
  isBackendComplete,
  normalizeBackendUrl,
} from '@/models/backend';
import { backendsReducer, builtInBackend, putBackend, removeBackend, setBackendAssignment } from '@/store/backends';

const APP_DIR = resolve(__dirname, '..', '..', '..', '..', 'app', '(tabs)');
const BACKENDS_PRESENTATION_DIR = resolve(__dirname, '..', '..', '..', '..', 'components', 'presentation', 'backends');
const SRC = resolve(__dirname, '..', '..', '..', '..');

const editorSource = () =>
  readFileSync(join(APP_DIR, 'settings', 'backends', '[id].tsx'), 'utf8') +
  readFileSync(join(BACKENDS_PRESENTATION_DIR, 'backend-header-editor.tsx'), 'utf8');

const backend = (overrides: Partial<Backend> = {}): Backend => ({
  id: 'b1',
  name: 'Home server',
  url: 'https://liftlog.example.com',
  kind: 'liftlog',
  headers: [],
  ...overrides,
});

describe('backend completeness contract', () => {
  it('requires a trimmed non-empty name and an http(s) URL', () => {
    expect(isBackendComplete(backend())).toBe(true);
    expect(isBackendComplete(backend({ name: '  ' }))).toBe(false);
    expect(isBackendComplete(backend({ url: '  ' }))).toBe(false);
    expect(isBackendComplete(backend({ url: 'ftp://x.example.com' }))).toBe(false);
    expect(isBackendComplete(backend({ url: 'liftlog.example.com' }))).toBe(false);
    expect(isBackendComplete(backend({ url: 'http://x.example.com' }))).toBe(true);
    expect(isBackendComplete(backend({ url: '  https://x.example.com  ' }))).toBe(true);
  });

  it('validates URLs exactly like the contract regex ^https?://.+', () => {
    expect(backendUrlIsValid('https://x')).toBe(true);
    expect(backendUrlIsValid('http://x')).toBe(true);
    expect(backendUrlIsValid('')).toBe(false);
    expect(backendUrlIsValid('gopher://x')).toBe(false);
    expect(backendUrlIsValid('https://')).toBe(false);
  });

  it('trims and removes trailing slashes on blur', () => {
    expect(normalizeBackendUrl('  https://x.example.com/  ')).toBe('https://x.example.com');
    expect(normalizeBackendUrl('https://x.example.com///')).toBe('https://x.example.com');
    expect(normalizeBackendUrl('https://x.example.com/base/')).toBe('https://x.example.com/base');
  });
});

describe('backend deletion contract', () => {
  it('removes the backend and every assignment that pointed at it', () => {
    let state = backendsReducer(undefined, putBackend(backend({ id: 'b1' })));
    state = backendsReducer(state, putBackend(backend({ id: 'b2' })));
    state = backendsReducer(state, setBackendAssignment({ feature: 'feed', backendId: 'b1' }));
    state = backendsReducer(state, setBackendAssignment({ feature: 'backup', backendId: 'b2' }));
    state = backendsReducer(state, removeBackend('b1'));
    expect(state.backends.map((b) => b.id)).toEqual(['b2']);
    expect(state.assignments['feed']).toBeUndefined();
    expect(state.assignments['backup']).toBe('b2');
  });

  it('deletes the header records with the backend (no dangling secrets)', () => {
    let state = backendsReducer(undefined, putBackend(backend({ headers: [{ name: 'Authorization', value: 'Bearer x' }] })));
    state = backendsReducer(state, removeBackend('b1'));
    expect(state.backends).toEqual([]);
  });
});

describe('built-in backend contract', () => {
  it('is virtual, never stored, and serves nothing through the assignment model', () => {
    expect(builtInBackendId).toBe('liftlog');
    expect(builtInBackend.id).toBe(builtInBackendId);
    expect(builtInBackend.headers).toEqual([]);
    // backend-v2 serves auth, sync, and the AI coach natively — feed and
    // backup need a backend the user adds themselves.
    expect(backendSupportsFeature(builtInBackend, 'backup')).toBe(false);
    expect(backendSupportsFeature(builtInBackend, 'feed')).toBe(false);
    expect(backendSupportsFeature(backend({ kind: 'backupEndpoint' }), 'feed')).toBe(false);
    expect(backendSupportsFeature(backend({ kind: 'backupEndpoint' }), 'backup')).toBe(true);
  });

  it('redirects unknown ids (including the built-in id) away from the editor', () => {
    const route = readFileSync(join(APP_DIR, 'settings', 'backends', '[id].tsx'), 'utf8');
    expect(route).toMatch(/if \(!backend\)/);
    expect(route).toMatch(/<Redirect href=\{'\/settings\/backends'\}/);
    // The lookup runs over the *stored* list only — the virtual built-in can never match.
    expect(route).toMatch(/s\.backends\.backends\.find/);
  });
});

describe('editor scope honesty', () => {
  it('has no S3/WebDAV/FTP/scheduling/restore surface', () => {
    const source = editorSource().toLowerCase();
    for (const word of ['s3', 'webdav', 'ftp', 'schedule', 'restore']) {
      expect(source).not.toContain(word);
    }
  });

  it('autosaves every change (no Save/Cancel action)', () => {
    const route = readFileSync(join(APP_DIR, 'settings', 'backends', '[id].tsx'), 'utf8');
    expect(route).toMatch(/dispatch\(putBackend\(\{\s*\.\.\.backend,\s*\.\.\.changes/);
    // The page itself has no save/cancel flow: the only Cancel on it belongs
    // to the native delete confirmation, and there is no Save at all.
    expect(route).not.toMatch(/generic\.save\.button/);
    expect(route.match(/generic\.cancel\.button/g)?.length).toBe(1);
    expect(route).toMatch(/Alert\.alert\([\s\S]*?generic\.cancel\.button/);
  });

  it('masks sensitive header values', () => {
    const headerEditor = readFileSync(join(BACKENDS_PRESENTATION_DIR, 'backend-header-editor.tsx'), 'utf8');
    const headerSheet = readFileSync(
      join(BACKENDS_PRESENTATION_DIR, 'header-sheet', 'header-sheet.tsx'),
      'utf8',
    );
    expect(headerEditor).toMatch(/isSecretHeader/);
    expect(headerEditor + headerSheet).toMatch(/secureTextEntry/);
  });
});

describe('backend editor i18n completeness', () => {
  it('resolves every literal key used by the editor in en.json', () => {
    const en = JSON.parse(readFileSync(join(SRC, 'i18n', 'en.json'), 'utf8')) as Record<string, unknown>;
    const keys = new Set<string>();
    const sources = [
      readFileSync(join(APP_DIR, 'settings', 'backends', '[id].tsx'), 'utf8'),
      readFileSync(join(BACKENDS_PRESENTATION_DIR, 'backend-header-editor.tsx'), 'utf8'),
      readFileSync(join(BACKENDS_PRESENTATION_DIR, 'connection-card', 'connection-card.tsx'), 'utf8'),
      readFileSync(join(BACKENDS_PRESENTATION_DIR, 'kind-section', 'kind-section.tsx'), 'utf8'),
      readFileSync(join(BACKENDS_PRESENTATION_DIR, 'probe-status-card', 'probe-status-card.tsx'), 'utf8'),
      readFileSync(join(BACKENDS_PRESENTATION_DIR, 'header-sheet', 'header-sheet.tsx'), 'utf8'),
    ];
    for (const source of sources) {
      for (const m of source.matchAll(/(?:settingsKey|(?<![\w$])t)\('([^']+)'\)/g)) {
        keys.add(m[1]!);
      }
    }
    expect(keys.size).toBeGreaterThan(0);
    const missing = [...keys].filter((k) => !(k in en));
    expect(missing).toEqual([]);
  });
});
