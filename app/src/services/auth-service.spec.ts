import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { googleSigninMock, secureStoreMock } = vi.hoisted(() => ({
  googleSigninMock: {
    configure: vi.fn(),
    hasPlayServices: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  },
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

vi.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: googleSigninMock,
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  },
}));
vi.mock('expo-secure-store', () => secureStoreMock);

vi.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

vi.mock('@/services/auth-config', () => ({
  googleAuthConfig: {
    webClientId: 'test-web-client-id.apps.googleusercontent.com',
    iosClientId: 'test-ios-client-id.apps.googleusercontent.com',
  },
  isGoogleAuthConfigured: () => true,
}));

vi.mock('@/services/api-consts', () => ({
  alcedoApiBaseUrl: 'https://backend-v2.test/api',
}));

import {
  __resetAuthStateForTests,
  AuthError,
  fetchMyProfile,
  getAccessToken,
  hasStoredSession,
  isPremiumActive,
  onSessionInvalidated,
  refreshSession,
  restoreSession,
  signInWithGoogle,
  signOut,
} from '@/services/auth-service';

function tokenPair(overrides: Record<string, unknown> = {}) {
  return {
    accessToken: 'access-1',
    refreshToken: 'refresh-1',
    expiresIn: 3600,
    ...overrides,
  };
}

function mockFetchOnce(response: { ok: boolean; status: number; body?: unknown }) {
  const fetchMock = vi.fn(
    async () =>
      ({
        ok: response.ok,
        status: response.status,
        json: async () => response.body,
      }) as Response,
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

const googleUser = {
  type: 'success',
  data: {
    idToken: 'google-id-token-1',
    user: { id: 'g1', name: 'Test User', email: 'test@example.com', photo: null, familyName: null, givenName: null },
    scopes: [],
    serverAuthCode: null,
  },
} as const;

beforeEach(() => {
  __resetAuthStateForTests();
  secureStoreMock.store.clear();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('signInWithGoogle', () => {
  it('exchanges the Google ID token and persists the session', async () => {
    googleSigninMock.signIn.mockResolvedValue(googleUser);
    const fetchMock = mockFetchOnce({ ok: true, status: 200, body: tokenPair() });

    const profile = await signInWithGoogle();

    expect(profile).toEqual({ name: 'Test User', email: 'test@example.com', photo: null });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const firstCall = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const [url, init] = firstCall;
    expect(url).toBe('https://backend-v2.test/api/auth/google');
    expect(JSON.parse(init.body as string)).toEqual({ idToken: 'google-id-token-1' });
    const stored = secureStoreMock.store.get('alcedo.auth.session');
    expect(stored).toBeDefined();
    const parsed = JSON.parse(stored!) as { refreshToken?: unknown };
    expect(parsed.refreshToken).toBe('refresh-1');
    // Access token is never written to the secure store payload.
    expect(stored).not.toContain('access-1');
  });

  it('maps user cancellation to a cancelled AuthError without calling the backend', async () => {
    googleSigninMock.signIn.mockResolvedValue({ type: 'cancelled' });
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(signInWithGoogle()).rejects.toMatchObject({ code: 'cancelled' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('maps native cancellation codes to a cancelled AuthError', async () => {
    googleSigninMock.signIn.mockRejectedValue({ code: 'SIGN_IN_CANCELLED' });
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(signInWithGoogle()).rejects.toMatchObject({ code: 'cancelled' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects when Google returns no ID token', async () => {
    googleSigninMock.signIn.mockResolvedValue({
      ...googleUser,
      data: { ...googleUser.data, idToken: null },
    });
    await expect(signInWithGoogle()).rejects.toMatchObject({ code: 'no-id-token' });
  });

  it('rejects with network error when the backend is unreachable', async () => {
    googleSigninMock.signIn.mockResolvedValue(googleUser);
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('Network request failed');
      }),
    );
    await expect(signInWithGoogle()).rejects.toMatchObject({ code: 'network' });
    expect(secureStoreMock.store.size).toBe(0);
  });

  it('rejects when the backend refuses the token', async () => {
    googleSigninMock.signIn.mockResolvedValue(googleUser);
    mockFetchOnce({ ok: false, status: 401 });
    await expect(signInWithGoogle()).rejects.toMatchObject({ code: 'rejected' });
    expect(secureStoreMock.store.size).toBe(0);
  });
});

describe('refreshSession', () => {
  it('shares a single in-flight refresh between concurrent callers', async () => {
    secureStoreMock.store.set(
      'alcedo.auth.session',
      JSON.stringify({ refreshToken: 'refresh-1', profile: { name: null, email: null, photo: null } }),
    );
    let resolveJson!: (v: unknown) => void;
    const jsonGate = new Promise((resolve) => {
      resolveJson = resolve;
    });
    const fetchMock = vi.fn(async () => ({ ok: true, status: 200, json: () => jsonGate }) as Response);
    vi.stubGlobal('fetch', fetchMock);

    const first = refreshSession();
    const second = refreshSession();
    resolveJson(tokenPair({ accessToken: 'access-2', refreshToken: 'refresh-2' }));
    const [r1, r2] = await Promise.all([first, second]);

    expect(r1).toBe(true);
    expect(r2).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const stored = JSON.parse(secureStoreMock.store.get('alcedo.auth.session')!) as { refreshToken?: unknown };
    expect(stored.refreshToken).toBe('refresh-2');
  });

  it('returns false and keeps local state when the backend rejects the refresh token', async () => {
    secureStoreMock.store.set(
      'alcedo.auth.session',
      JSON.stringify({ refreshToken: 'stale', profile: { name: null, email: null, photo: null } }),
    );
    mockFetchOnce({ ok: false, status: 401 });
    expect(await refreshSession()).toBe(false);
  });
});

describe('getAccessToken', () => {
  it('notifies listeners and clears the session when refresh fails', async () => {
    secureStoreMock.store.set(
      'alcedo.auth.session',
      JSON.stringify({ refreshToken: 'stale', profile: { name: null, email: null, photo: null } }),
    );
    mockFetchOnce({ ok: false, status: 401 });
    const listener = vi.fn();
    const unsubscribe = onSessionInvalidated(listener);

    expect(await getAccessToken()).toBeNull();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(secureStoreMock.store.size).toBe(0);
    unsubscribe();
  });
});

describe('restoreSession', () => {
  it('returns null when nothing is stored', async () => {
    expect(await restoreSession()).toBeNull();
  });

  it('restores the profile after a successful refresh', async () => {
    const profile = { name: 'Test User', email: 'test@example.com', photo: null };
    secureStoreMock.store.set('alcedo.auth.session', JSON.stringify({ refreshToken: 'refresh-1', profile }));
    mockFetchOnce({ ok: true, status: 200, body: tokenPair() });
    expect(await restoreSession()).toEqual(profile);
  });

  it('clears a revoked session and returns null', async () => {
    secureStoreMock.store.set(
      'alcedo.auth.session',
      JSON.stringify({ refreshToken: 'revoked', profile: { name: null, email: null, photo: null } }),
    );
    mockFetchOnce({ ok: false, status: 401 });
    expect(await restoreSession()).toBeNull();
    expect(secureStoreMock.store.size).toBe(0);
  });
});

describe('signOut', () => {
  it('revokes on the backend, signs out of Google, and clears local state', async () => {
    secureStoreMock.store.set(
      'alcedo.auth.session',
      JSON.stringify({ refreshToken: 'refresh-1', profile: { name: null, email: null, photo: null } }),
    );
    // Establish an in-memory access token first via a successful refresh.
    mockFetchOnce({ ok: true, status: 200, body: tokenPair() });
    expect(await refreshSession()).toBe(true);

    const logoutFetch = mockFetchOnce({ ok: true, status: 200, body: { ok: true } });
    await signOut();

    expect(logoutFetch).toHaveBeenCalledTimes(1);
    const logoutCall = logoutFetch.mock.calls[0] as unknown as [string, RequestInit];
    const [url, init] = logoutCall;
    expect(url).toBe('https://backend-v2.test/api/auth/logout');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer access-1');
    expect(googleSigninMock.signOut).toHaveBeenCalledTimes(1);
    expect(secureStoreMock.store.size).toBe(0);
  });

  it('still clears local state when the backend logout fails', async () => {
    secureStoreMock.store.set(
      'alcedo.auth.session',
      JSON.stringify({ refreshToken: 'refresh-1', profile: { name: null, email: null, photo: null } }),
    );
    mockFetchOnce({ ok: true, status: 200, body: tokenPair() });
    await refreshSession();

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline');
      }),
    );
    await signOut();
    expect(secureStoreMock.store.size).toBe(0);
    expect(googleSigninMock.signOut).toHaveBeenCalledTimes(1);
  });
});

describe('AuthError', () => {
  it('carries a typed code', () => {
    const error = new AuthError('cancelled', 'nope');
    expect(error.code).toBe('cancelled');
    expect(error).toBeInstanceOf(Error);
  });
});

function meResponse(overrides: Record<string, unknown> = {}) {
  return {
    email: 'test@example.com',
    googleSub: 'google-sub-123',
    isAdmin: false,
    name: 'Test User',
    picture: null,
    premium: { expiresAt: null, source: null, status: 'none' },
    ...overrides,
  };
}

describe('fetchMyProfile', () => {
  it('returns null when there is no session', async () => {
    expect(await fetchMyProfile()).toBeNull();
  });

  it('returns the profile and premium entitlement from /auth/me', async () => {
    // Seed a valid session: signIn stores the refresh token, getAccessToken path uses it.
    googleSigninMock.signIn.mockResolvedValue(googleUser);
    mockFetchOnce({ body: tokenPair(), ok: true, status: 200 });
    await signInWithGoogle();

    const fetchMock = mockFetchOnce({
      body: meResponse({ premium: { expiresAt: '2027-01-01T00:00:00.000Z', source: 'stripe', status: 'active' } }),
      ok: true,
      status: 200,
    });
    const profile = await fetchMyProfile();
    expect(profile?.googleSub).toBe('google-sub-123');
    expect(profile?.premium.status).toBe('active');
    expect(profile?.premium.source).toBe('stripe');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const calls = fetchMock.mock.calls as unknown as Array<[unknown]>;
    const url = String(calls[0]?.[0]);
    expect(url).toContain('/auth/me');
  });

  it('returns null on network failure (premium stays unknown, not inactive)', async () => {
    googleSigninMock.signIn.mockResolvedValue(googleUser);
    mockFetchOnce({ body: tokenPair(), ok: true, status: 200 });
    await signInWithGoogle();

    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }));
    expect(await fetchMyProfile()).toBeNull();
  });

  it('returns null when the backend response is malformed', async () => {
    googleSigninMock.signIn.mockResolvedValue(googleUser);
    mockFetchOnce({ body: tokenPair(), ok: true, status: 200 });
    await signInWithGoogle();

    mockFetchOnce({ body: { nope: true }, ok: true, status: 200 });
    expect(await fetchMyProfile()).toBeNull();
  });
});

describe('isPremiumActive', () => {
  it('is true only when the backend confirms an active entitlement', async () => {
    googleSigninMock.signIn.mockResolvedValue(googleUser);
    mockFetchOnce({ body: tokenPair(), ok: true, status: 200 });
    await signInWithGoogle();

    mockFetchOnce({ body: meResponse({ premium: { expiresAt: null, source: 'stripe', status: 'active' } }), ok: true, status: 200 });
    expect(await isPremiumActive()).toBe(true);
  });

  it('is false when premium is expired', async () => {
    googleSigninMock.signIn.mockResolvedValue(googleUser);
    mockFetchOnce({ body: tokenPair(), ok: true, status: 200 });
    await signInWithGoogle();

    mockFetchOnce({ body: meResponse({ premium: { expiresAt: '2025-01-01T00:00:00.000Z', source: 'stripe', status: 'expired' } }), ok: true, status: 200 });
    expect(await isPremiumActive()).toBe(false);
  });

  it('is false when the entitlement is unknown (offline)', async () => {
    // Never claim premium until the backend confirms it.
    expect(await isPremiumActive()).toBe(false);
  });
});

describe('network failures during refresh', () => {
  function storeSession(refreshToken = 'refresh-1') {
    secureStoreMock.store.set(
      'alcedo.auth.session',
      JSON.stringify({ refreshToken, profile: { name: 'Test User', email: 'test@example.com', photo: null } }),
    );
  }

  function mockOfflineFetch() {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline');
      }),
    );
  }

  it('refreshSession throws AuthError(network) instead of reporting a dead session', async () => {
    storeSession();
    mockOfflineFetch();
    const error = await refreshSession().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(AuthError);
    expect((error as AuthError).code).toBe('network');
  });

  it('getAccessToken returns null but preserves the session and stays silent', async () => {
    storeSession();
    mockOfflineFetch();
    const listener = vi.fn();
    const unsubscribe = onSessionInvalidated(listener);

    expect(await getAccessToken()).toBeNull();
    // The session is intact: going offline must not log the user out.
    expect(secureStoreMock.store.size).toBe(1);
    expect(await hasStoredSession()).toBe(true);
    expect(listener).not.toHaveBeenCalled();
    unsubscribe();
  });

  it('restoreSession returns the cached profile offline without wiping the session', async () => {
    storeSession();
    mockOfflineFetch();
    const profile = await restoreSession();
    expect(profile).toEqual({ name: 'Test User', email: 'test@example.com', photo: null });
    expect(secureStoreMock.store.size).toBe(1);
  });

  it('hasStoredSession is false once the session is cleared', async () => {
    expect(await hasStoredSession()).toBe(false);
    storeSession();
    expect(await hasStoredSession()).toBe(true);
  });
});
