import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deserializeDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import { gunzipSync } from 'zlib';
import { readFile } from 'fs/promises';
import { resolve } from 'node:path';
import { createAddEffectTestBed } from '@/utils/__test__/add-effect-testbed';
import {
  addRemoteBackupEffects,
  classifyRemoteBackupError,
  resetRemoteBackupTestCache,
} from '@/store/settings/remote-backup-effects';
import { getBackupBytes } from '@/store/settings/util';
import { executeRemoteBackup, retryRemoteBackup, setLastRemoteBackupTest, setTestInFlight } from '@/store/settings';
import { showSnackbar } from '@/store/app';
import { Backend } from '@/models/backend';
import { RemoteData } from '@/models/remote';
import en from '@/i18n/en.json';
import 'compression-streams-polyfill';

vi.mock('@/store/settings/util', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/store/settings/util')>();
  return { ...original, getBackupBytes: vi.fn(original.getBackupBytes) };
});

const getBackupBytesMock = vi.mocked(getBackupBytes);

async function createSeededDb(): Promise<SQLiteDatabase> {
  const bytes = await readFile(resolve(__dirname, '../../utils/__test__/export.liftlogbackup.sqlite.gz'));
  return deserializeDatabaseAsync(gunzipSync(bytes));
}

function makeTolgee() {
  const strings = en as Record<string, string>;
  return {
    t: vi.fn((key: string, params?: Record<string, string | number>) => {
      let result: string = strings[key] ?? key;
      for (const [k, v] of Object.entries(params ?? {})) {
        result = result.replace(`{${k}}`, String(v));
      }
      return result;
    }),
  };
}

function makeLogger() {
  return {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    log: vi.fn(),
    debug: vi.fn(),
  };
}

const testBackend: Backend = {
  id: 'backup-1',
  name: 'Home server',
  url: 'https://backup.example.com',
  kind: 'liftlog',
  headers: [],
};

function makeBed(expoDb: SQLiteDatabase, withBackendAssignment = false) {
  const fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  const testBed = createAddEffectTestBed({
    initialState: {
      settings: {
        backupIncludeFeedAccount: false,
        lastBackup: RemoteData.notAsked(),
      },
      ...(withBackendAssignment
        ? {
            backends: {
              backends: [testBackend],
              assignments: { backup: testBackend.id },
              isHydrated: true,
            },
          }
        : {}),
    },
    services: {
      expoDb,
      encryptionService: { sha256: vi.fn(async () => new Uint8Array([1, 2, 3])) } as never,
      tolgee: makeTolgee() as never,
      logger: makeLogger() as never,
    },
  });
  addRemoteBackupEffects(testBed.addEffect);
  return { testBed, fetchMock };
}

function checksum(bytes: Uint8Array): number {
  let sum = 0;
  for (const b of bytes) {
    sum = (sum + b) % 1_000_000_007;
  }
  return sum;
}

describe('classifyRemoteBackupError', () => {
  it('maps network failures to connection', () => {
    expect(classifyRemoteBackupError(new TypeError('Network request failed')).kind).toBe('connection');
    expect(classifyRemoteBackupError(new Error('fetch failed')).kind).toBe('connection');
  });

  it('maps HTTP statuses to their variants', () => {
    expect(classifyRemoteBackupError(new Error('HTTP 401: Unauthorized')).kind).toBe('http401');
    expect(classifyRemoteBackupError(new Error('HTTP 500: boom')).kind).toBe('http500');
    expect(classifyRemoteBackupError(new Error('HTTP 413: too big')).kind).toBe('http413');
    expect(classifyRemoteBackupError(new Error('HTTP 418: teapot'))).toEqual({
      kind: 'httpOther',
      code: 418,
    });
  });

  it('maps anything else to unknown', () => {
    expect(classifyRemoteBackupError(new Error('weird')).kind).toBe('unknown');
    expect(classifyRemoteBackupError('a string')).toEqual({ kind: 'unknown' });
  });
});

describe('addRemoteBackupEffects', () => {
  let expoDb: SQLiteDatabase;

  beforeEach(async () => {
    expoDb = await createSeededDb();
    getBackupBytesMock.mockClear();
    resetRemoteBackupTestCache();
    vi.unstubAllGlobals();
  });

  it('retry with an empty cache is a silent no-op', async () => {
    const { testBed, fetchMock } = makeBed(expoDb, true);

    await testBed.dispatchHandled(retryRemoteBackup());

    // No database work, no network, no snackbar, no last-tested write.
    expect(getBackupBytesMock).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(testBed.dispatchedActions.filter((a) => a.type === showSnackbar.type)).toHaveLength(0);
    expect(testBed.dispatchedActions.filter((a) => a.type === setLastRemoteBackupTest.type)).toHaveLength(0);
  });

  it('manual Test records last-tested success with real byte sizes and shows the success toast', async () => {
    const { testBed, fetchMock } = makeBed(expoDb);
    fetchMock.mockResolvedValue({ ok: true, status: 200, statusText: 'OK' });

    await testBed.dispatchHandled(executeRemoteBackup({ backend: testBackend, force: true }));

    const lastTest = testBed.getDispatchedAction(setLastRemoteBackupTest).payload!;
    expect(lastTest.status).toBe('success');
    expect(lastTest.uploadedBytes).toBeGreaterThan(0);
    expect(lastTest.gzipBytes).toBeGreaterThan(0);
    expect(lastTest.gzipBytes).toBeLessThanOrEqual(lastTest.uploadedBytes!);
    expect(lastTest.durationMs).toBeGreaterThanOrEqual(0);

    const snackbar = testBed.getDispatchedAction(showSnackbar).payload;
    expect(snackbar).toMatchObject({ title: 'Backup sent successfully', tone: 'success' });
    expect('subtitle' in snackbar && snackbar.subtitle).toMatch(/gzip/);

    const inFlight = testBed.dispatchedActions
      .filter((a) => a.type === setTestInFlight.type)
      .map((a) => (a as ReturnType<typeof setTestInFlight>).payload);
    expect(inFlight).toEqual([true, false]);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, { headers: Record<string, string> }];
    expect(url).toBe('https://backup.example.com/backup');
    expect(init.headers['Content-Type']).toBe('application/octet-stream');
  });

  it('Retry re-sends the cached payload without recomputing it', async () => {
    const { testBed, fetchMock } = makeBed(expoDb, true);
    fetchMock.mockResolvedValue({ ok: true, status: 200, statusText: 'OK' });

    await testBed.dispatchHandled(executeRemoteBackup({ backend: testBackend, force: true }));
    const firstBody = (fetchMock.mock.calls[0] as [string, { body: Uint8Array }])[1].body;
    expect(getBackupBytesMock).toHaveBeenCalledTimes(1);

    fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'));
    await testBed.dispatchHandled(retryRemoteBackup());

    // No database work for the retry — the exact cached bytes go out again.
    expect(getBackupBytesMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const retryBody = (fetchMock.mock.calls[1] as [string, { body: Uint8Array }])[1].body;
    expect(retryBody.byteLength).toBe(firstBody.byteLength);
    expect(checksum(retryBody)).toBe(checksum(firstBody));

    // The failed retry records the error as the last test, with a Retry action.
    const lastTest = testBed.dispatchedActions
      .filter((a) => a.type === setLastRemoteBackupTest.type)
      .pop()! as ReturnType<typeof setLastRemoteBackupTest>;
    expect(lastTest.payload!.status).toBe('error');
    expect(lastTest.payload!.errorVariant).toBe('connection');

    const snackbar = testBed.dispatchedActions.filter((a) => a.type === showSnackbar.type).pop()!.payload as {
      title: string;
      tone: string;
      action?: string;
      dispatchAction?: unknown;
    };
    expect(snackbar).toMatchObject({ title: 'Failed to backup to remote', tone: 'error' });
    expect('action' in snackbar && snackbar.action).toBe('Retry');
    expect('dispatchAction' in snackbar && snackbar.dispatchAction).toEqual(retryRemoteBackup());
  });

  it('Retry uses the cached target directly, even with no backend assigned', async () => {
    const first = makeBed(expoDb);
    first.fetchMock.mockResolvedValue({ ok: true, status: 200, statusText: 'OK' });
    await first.testBed.dispatchHandled(executeRemoteBackup({ backend: testBackend, force: true }));
    const firstBody = (first.fetchMock.mock.calls[0] as [string, { body: Uint8Array }])[1].body;
    expect(getBackupBytesMock).toHaveBeenCalledTimes(1);

    // A fresh bed with no backend assignment: resolving the target from state
    // would fail, but Retry must not consult state at all.
    const second = makeBed(expoDb);
    second.fetchMock.mockResolvedValue({ ok: true, status: 200, statusText: 'OK' });
    await second.testBed.dispatchHandled(retryRemoteBackup());

    expect(getBackupBytesMock).toHaveBeenCalledTimes(1);
    expect(second.fetchMock).toHaveBeenCalledOnce();
    const [url, init] = second.fetchMock.mock.calls[0] as [string, { body: Uint8Array }];
    expect(url).toBe('https://backup.example.com/backup');
    expect(checksum(init.body)).toBe(checksum(firstBody));
  });

  it('automatic backup never writes last-tested and stays silent', async () => {
    const { testBed, fetchMock } = makeBed(expoDb);
    fetchMock.mockResolvedValue({ ok: true, status: 200, statusText: 'OK' });

    // force: false — the silent auto-backup path.
    await testBed.dispatchHandled(executeRemoteBackup({ backend: testBackend }));

    expect(fetchMock).toHaveBeenCalledOnce();
    // No last-tested write, no snackbar: auto-backup is silent.
    expect(testBed.dispatchedActions.filter((a) => a.type === setLastRemoteBackupTest.type)).toHaveLength(0);
    expect(testBed.dispatchedActions.filter((a) => a.type === showSnackbar.type)).toHaveLength(0);
  });

  it('maps a 401 failure to the unauthorized variant', async () => {
    const { testBed, fetchMock } = makeBed(expoDb);
    fetchMock.mockResolvedValue({ ok: false, status: 401, statusText: 'Unauthorized' });

    await testBed.dispatchHandled(executeRemoteBackup({ backend: testBackend, force: true }));

    const lastTest = testBed.getDispatchedAction(setLastRemoteBackupTest).payload!;
    expect(lastTest.status).toBe('error');
    expect(lastTest.errorVariant).toBe('http401');

    const snackbar = testBed.getDispatchedAction(showSnackbar).payload;
    expect(snackbar).toMatchObject({ tone: 'error' });
    expect('subtitle' in snackbar && snackbar.subtitle).toContain('401');
  });

  it('silent auto-backup (non-force) never touches last-tested and shows no snackbar', async () => {
    const { testBed, fetchMock } = makeBed(expoDb);
    fetchMock.mockResolvedValue({ ok: true, status: 200, statusText: 'OK' });

    await testBed.dispatchHandled(executeRemoteBackup({ backend: testBackend }));

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(() => testBed.getDispatchedAction(setLastRemoteBackupTest)).toThrow();
    expect(() => testBed.getDispatchedAction(showSnackbar)).toThrow();
  });

  it('silent auto-backup failure shows no snackbar and records no last-tested entry', async () => {
    const { testBed, fetchMock } = makeBed(expoDb);
    fetchMock.mockResolvedValue({ ok: false, status: 500, statusText: 'Error' });

    await testBed.dispatchHandled(executeRemoteBackup({ backend: testBackend }));

    expect(() => testBed.getDispatchedAction(setLastRemoteBackupTest)).toThrow();
    expect(() => testBed.getDispatchedAction(showSnackbar)).toThrow();
  });
});
