import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { secureStoreMock } = vi.hoisted(() => ({
  secureStoreMock: {
    store: new Map<string, string>(),
    getItemAsync: vi.fn(async (key: string) => secureStoreMock.store.get(key) ?? null),
    setItemAsync: vi.fn(async (key: string, value: string) => {
      secureStoreMock.store.set(key, value);
    }),
    deleteItemAsync: vi.fn(async (key: string) => {
      secureStoreMock.store.delete(key);
    }),
  },
}));

vi.mock('expo-secure-store', () => secureStoreMock);
vi.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: vi.fn(),
    hasPlayServices: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  },
}));
vi.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));
vi.mock('@/services/api-consts', () => ({
  alcedoApiBaseUrl: 'https://backend-v2.test/api',
}));

import { __resetAuthStateForTests, AuthError } from '@/services/auth-service';
import { authenticatedFetch } from '@/services/authenticated-fetch';

function jsonResponse(status: number, body: unknown = {}) {
  return { ok: status >= 200 && status < 300, status, json: async () => body } as Response;
}

beforeEach(() => {
  __resetAuthStateForTests();
  secureStoreMock.store.clear();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function storeSession(refreshToken = 'refresh-1') {
  secureStoreMock.store.set(
    'alcedo.auth.session',
    JSON.stringify({ refreshToken, profile: { name: null, email: null, photo: null } }),
  );
}

describe('authenticatedFetch', () => {
  it('injects the bearer token and targets backend-v2', async () => {
    storeSession();
    const fetchMock = vi.fn(async (url: string, _init: RequestInit) => {
      if (url.endsWith('/auth/refresh')) {
        return jsonResponse(200, { accessToken: 'access-1', refreshToken: 'refresh-2', expiresIn: 3600 });
      }
      return jsonResponse(200, { ok: true });
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await authenticatedFetch('/sync/pull?cursor=abc');
    expect(response.ok).toBe(true);
    const dataCall = fetchMock.mock.calls.find(([callUrl]) => callUrl.includes('/sync/pull'));
    expect(dataCall).toBeDefined();
    const [url, init] = dataCall as [string, RequestInit];
    expect(url).toBe('https://backend-v2.test/api/sync/pull?cursor=abc');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer access-1');
  });

  it('refreshes once and retries the request on 401', async () => {
    storeSession();
    let dataCalls = 0;
    const fetchMock = vi.fn(async (url: string, _init?: RequestInit) => {
      if (url.endsWith('/auth/refresh')) {
        return jsonResponse(200, { accessToken: 'access-2', refreshToken: 'refresh-3', expiresIn: 3600 });
      }
      dataCalls += 1;
      return dataCalls === 1 ? jsonResponse(401) : jsonResponse(200, { ok: true });
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await authenticatedFetch('/ai/conversations');
    expect(response.ok).toBe(true);
    expect(dataCalls).toBe(2);
    const retryCalls = fetchMock.mock.calls.filter(([callUrl]) => callUrl.includes('/ai/conversations'));
    expect(retryCalls).toHaveLength(2);
    const retryInit = retryCalls[1]?.[1];
    expect(retryInit?.headers).toMatchObject({ Authorization: 'Bearer access-2' });
  });

  it('throws session-expired when no session exists', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(authenticatedFetch('/sync/pull')).rejects.toBeInstanceOf(AuthError);
    await expect(authenticatedFetch('/sync/pull')).rejects.toMatchObject({ code: 'session-expired' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('throws session-expired when the refresh is rejected', async () => {
    storeSession('revoked');
    const fetchMock = vi.fn(async (url: string) => {
      if (url.endsWith('/auth/refresh')) {
        return jsonResponse(401);
      }
      return jsonResponse(401);
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(authenticatedFetch('/sync/pull')).rejects.toMatchObject({ code: 'session-expired' });
    // The revoked session is wiped.
    expect(secureStoreMock.store.size).toBe(0);
  });
});

describe('network failures', () => {
  it('throws AuthError(network) when the data fetch fails, keeping the session', async () => {
    storeSession();
    const fetchMock = vi.fn(async (url: string) => {
      if (url.endsWith('/auth/refresh')) {
        return jsonResponse(200, { accessToken: 'access-1', refreshToken: 'refresh-2', expiresIn: 3600 });
      }
      throw new Error('offline');
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(authenticatedFetch('/sync/pull')).rejects.toMatchObject({ code: 'network' });
    expect(secureStoreMock.store.size).toBe(1);
  });

  it('throws AuthError(network) — not session-expired — when the refresh cannot reach the server', async () => {
    storeSession();
    const fetchMock = vi.fn(async () => {
      throw new Error('offline');
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(authenticatedFetch('/sync/pull')).rejects.toMatchObject({ code: 'network' });
    // Offline is not a logout: the session survives for the next attempt.
    expect(secureStoreMock.store.size).toBe(1);
  });

  it('throws AuthError(network) when the 401-retry fetch fails', async () => {
    storeSession();
    let dataCalls = 0;
    const fetchMock = vi.fn(async (url: string) => {
      if (url.endsWith('/auth/refresh')) {
        return jsonResponse(200, { accessToken: 'access-2', refreshToken: 'refresh-3', expiresIn: 3600 });
      }
      dataCalls += 1;
      if (dataCalls === 1) {
        return jsonResponse(401);
      }
      throw new Error('offline');
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(authenticatedFetch('/ai/conversations')).rejects.toMatchObject({ code: 'network' });
    expect(secureStoreMock.store.size).toBe(1);
  });
});
