import { Backend, backendHeaderRecord, backupUrl } from '@/models/backend';
import { RemoteData } from '@/models/remote';
import { selectBackendForFeature } from '@/store/backends';
import { AddEffectFn, RootState } from '@/store/store';
import {
  executeRemoteBackup,
  remoteBackupSucceeded,
  retryRemoteBackup,
  setLastBackup,
  setLastRemoteBackupTest,
  setTestInFlight,
} from '@/store/settings';
import { RemoteBackupErrorKind } from '@/store/settings/registry';
import { showSnackbar } from '@/store/app';
import { toUrlSafeHexString } from '@/utils/to-url-safe-hex-string';
import { formatBackupBytes, formatBackupDuration } from '@/utils/backup-format';
import { Instant } from '@js-joda/core';
import 'compression-streams-polyfill';
import { TaskAbortError } from '@reduxjs/toolkit';
import { getBackupBytes } from '@/store/settings/util';

type EffectApi = Parameters<Parameters<AddEffectFn>[1]>[1];

interface BackupTarget {
  backend: Backend;
  url: string;
  headers: Record<string, string>;
}

/**
 * The payload computed by the last manual Test run. Retry re-sends these exact
 * bytes to the exact target without recomputing anything — the point of Retry
 * is to answer "was it the network?" without paying for the database work again.
 * In-memory only; a fresh app launch has nothing to retry.
 */
interface CachedTestPayload {
  bytes: Uint8Array;
  hash: string;
  rawBytes: number;
  target: BackupTarget;
}

let cachedTestPayload: CachedTestPayload | undefined;

/**
 * Test-only reset for the in-memory retry cache. The cache is module state —
 * without a reset, one spec's Test run would leak a retryable payload into the
 * next spec's "empty cache" case.
 */
export function resetRemoteBackupTestCache(): void {
  cachedTestPayload = undefined;
}

/**
 * Guards testInFlight against a superseded run: a cancelled run must not clear
 * the flag a newer run just set.
 */
let testRunToken = 0;

/** Honest classification of a failed upload, so error copy names the real cause. */
export function classifyRemoteBackupError(error: unknown): {
  kind: RemoteBackupErrorKind;
  code?: number;
} {
  if (error instanceof Error) {
    const statusMatch = /HTTP (\d+)/.exec(error.message);
    if (statusMatch?.[1] !== undefined) {
      const code = parseInt(statusMatch[1], 10);
      if (code === 401) {
        return { kind: 'http401' };
      }
      if (code === 500) {
        return { kind: 'http500' };
      }
      if (code === 413) {
        return { kind: 'http413' };
      }
      return { kind: 'httpOther', code };
    }
    if (/fetch|network request failed|networkerror|failed to fetch/i.test(error.message)) {
      return { kind: 'connection' };
    }
    return { kind: 'unknown' };
  }
  return { kind: 'unknown' };
}

export function addRemoteBackupEffects(addEffect: AddEffectFn) {
  addEffect(executeRemoteBackup, async ({ payload: { backend, force } }, api) => {
    api.cancelActiveListeners();
    await runRemoteBackup(api, { backend, force: !!force, reuseCache: false });
  });
  addEffect(retryRemoteBackup, async (_, api) => {
    api.cancelActiveListeners();
    await runRemoteBackup(api, { backend: undefined, force: true, reuseCache: true });
  });
}

interface RunOptions {
  backend?: Backend;
  force: boolean;
  /** Retry: reuse the cached payload instead of rebuilding it. */
  reuseCache: boolean;
}

async function runRemoteBackup(api: EffectApi, options: RunOptions) {
  const {
    getState,
    extra: { logger, encryptionService, expoDb },
    throwIfCancelled,
  } = api;

  if (options.reuseCache) {
    // Retry: the cache is consulted before anything else — no backend lookup,
    // no state reads, no recomputation. An empty cache is a silent no-op.
    const cached = cachedTestPayload;
    if (!cached) {
      return;
    }
    await sendPayload(api, cached, { force: true });
    return;
  }

  const token = ++testRunToken;
  const start = performance.now();

  try {
    throwIfCancelled();

    const target = options.backend
      ? {
          backend: options.backend,
          url: backupUrl(options.backend),
          headers: backendHeaderRecord(options.backend),
        }
      : resolveBackendTarget(getState());
    if (!target) {
      return;
    }

    const includeFeedAccount = getState().settings.backupIncludeFeedAccount;

    const { bytes, rawBytes } = await getBackupBytes({
      includeFeed: includeFeedAccount,
      expoDb,
    });

    throwIfCancelled();

    // Calculate hash (CPU intensive)
    const hash = await encryptionService.sha256(bytes);
    const hashString = toUrlSafeHexString(hash);

    throwIfCancelled();

    // Check if backup is needed (unless forced)
    const lastBackupData = getState().settings.lastBackup.match({
      success: (data) => data,
      error: () => null,
      loading: () => null,
      notAsked: () => null,
    });

    const sameBackend = lastBackupData?.backendId === target.backend.id;
    if (!options.force && sameBackend && lastBackupData?.lastSuccessfulRemoteBackupHash === hashString) {
      return;
    }

    throwIfCancelled();

    const payload: CachedTestPayload = { bytes, hash: hashString, rawBytes, target };
    // A manual Test always refreshes the retry cache, so Retry re-sends
    // exactly what the last Test built.
    cachedTestPayload = payload;

    await sendPayload(api, payload, { force: options.force, token, start });
  } catch (error) {
    if (error instanceof TaskAbortError) {
      logger.info('Cancelled due to concurrent remote backup');
      return; // Don't show error message for user-initiated cancellation
    }
    throw error;
  } finally {
    logger.log(`executeRemoteBackup took ${(performance.now() - start).toFixed(2)}ms`);
  }
}

interface SendContext {
  force: boolean;
  token?: number;
  start?: number;
}

/**
 * Uploads an already-built payload to its cached target and records the
 * outcome. Owns the in-flight flag for both Test (fresh payload) and Retry
 * (cached payload) — both show the same spinner + Sending… UI, snackbars,
 * and last-tested updates.
 */
async function sendPayload(api: EffectApi, payload: CachedTestPayload, ctx: SendContext) {
  const {
    dispatch,
    extra: { logger, tolgee },
    throwIfCancelled,
  } = api;
  const { target } = payload;

  const token = ctx.token ?? ++testRunToken;
  const start = ctx.start ?? performance.now();
  const clearInFlight = () => {
    if (token === testRunToken) {
      dispatch(setTestInFlight(false));
    }
  };
  dispatch(setTestInFlight(true));

  try {
    throwIfCancelled();

    const response = await fetch(target.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream', ...target.headers },
      body: payload.bytes,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    throwIfCancelled();

    const durationMs = performance.now() - start;
    dispatch(
      setLastBackup(
        RemoteData.success({
          lastSuccessfulRemoteBackupHash: payload.hash,
          lastBackupTime: Instant.now(),
          backendId: target.backend.id,
        }),
      ),
    );
    if (ctx.force) {
      // The last-tested card records manual Test runs only — never silent auto-backup.
      dispatch(
        setLastRemoteBackupTest({
          status: 'success',
          time: Instant.now(),
          uploadedBytes: payload.rawBytes,
          gzipBytes: payload.bytes.byteLength,
          durationMs,
        }),
      );
      dispatch(
        showSnackbar({
          title: tolgee.t('backup.sent_successfully.message'),
          subtitle: tolgee.t('backup.sent_successfully.detail', {
            bytes: formatBackupBytes(payload.rawBytes),
            gzip: formatBackupBytes(payload.bytes.byteLength),
            duration: formatBackupDuration(durationMs),
          }),
          tone: 'success',
          duration: 3000,
        }),
      );
    }
    dispatch(remoteBackupSucceeded());

    logger.info('Remote backup completed successfully' + payload.hash);
  } catch (error) {
    if (error instanceof TaskAbortError) {
      logger.info('Cancelled due to concurrent remote backup');
      return; // Don't show error message for user-initiated cancellation
    }

    logger.warn('Failed to backup data to remote server', error);

    const { kind, code } = classifyRemoteBackupError(error);
    const subtitle = tolgee.t(errorSubtitleKey(kind), code === undefined ? {} : { code });

    if (ctx.force) {
      // The last-tested card records the last error too — but only for Test runs.
      // Silent auto-backup failures stay silent here; they surface through lastBackup.
      dispatch(
        setLastRemoteBackupTest({
          status: 'error',
          time: Instant.now(),
          errorVariant: kind,
          errorCode: code,
        }),
      );
      dispatch(
        showSnackbar({
          title: tolgee.t('backup.remote.error.title'),
          subtitle,
          tone: 'error',
          action: tolgee.t('backup.remote.error.retry'),
          dispatchAction: retryRemoteBackup(),
        }),
      );
    }

    // Update state to indicate failure
    dispatch(setLastBackup(RemoteData.error(subtitle)));
  } finally {
    clearInFlight();
    logger.log(`executeRemoteBackup took ${(performance.now() - start).toFixed(2)}ms`);
  }
}

function errorSubtitleKey(kind: RemoteBackupErrorKind): string {
  switch (kind) {
    case 'connection':
      return 'backup.remote.error.connection';
    case 'http401':
      return 'backup.remote.error.unauthorized';
    case 'http500':
      return 'backup.remote.error.server';
    case 'http413':
      return 'backup.remote.error.payload_too_large';
    case 'httpOther':
      return 'backup.remote.error.http_other';
    case 'unknown':
      return 'backup.remote.error.unknown';
  }
}

function resolveBackendTarget(state: RootState) {
  const resolved = selectBackendForFeature(state, 'backup');
  if (!resolved) {
    return undefined;
  }
  return { backend: resolved.backend, url: backupUrl(resolved.backend), headers: resolved.headers };
}
