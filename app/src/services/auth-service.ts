import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { alcedoApiBaseUrl } from './api-consts';
import { googleAuthConfig, isGoogleAuthConfigured } from './auth-config';

export interface AuthProfile {
  name: string | null;
  email: string | null;
  photo: string | null;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export type AuthErrorCode =
  | 'not-configured'
  | 'cancelled'
  | 'in-progress'
  | 'play-services-unavailable'
  | 'no-id-token'
  | 'network'
  | 'rejected'
  | 'session-expired';

export class AuthError extends Error {
  readonly code: AuthErrorCode;
  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

interface StoredSession {
  refreshToken: string;
  profile: AuthProfile;
}

const SECURE_STORE_KEY = 'alcedo.auth.session';
/** Refresh the access token this far ahead of its expiry. */
const REFRESH_SKEW_SECONDS = 60;

let configured = false;
let accessToken: string | null = null;
let accessTokenExpiresAt = 0;
let refreshPromise: Promise<boolean> | null = null;
const sessionListeners = new Set<() => void>();

function ensureConfigured(): void {
  if (configured) {
    return;
  }
  GoogleSignin.configure({
    webClientId: googleAuthConfig.webClientId,
    iosClientId: googleAuthConfig.iosClientId,
  });
  configured = true;
}

function notifySessionInvalidated(): void {
  for (const listener of sessionListeners) {
    listener();
  }
}

/** Subscribe to session invalidation (refresh failed / revoked). Returns an unsubscribe function. */
export function onSessionInvalidated(listener: () => void): () => void {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}

async function readStoredSession(): Promise<StoredSession | null> {
  const raw = await SecureStore.getItemAsync(SECURE_STORE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<StoredSession>;
    if (typeof parsed.refreshToken !== 'string' || !parsed.refreshToken) {
      // Deterministic cleanup: a value we cannot parse is corrupt and must
      // never be presented again.
      await SecureStore.deleteItemAsync(SECURE_STORE_KEY);
      return null;
    }
    return {
      refreshToken: parsed.refreshToken,
      profile: {
        name: parsed.profile?.name ?? null,
        email: parsed.profile?.email ?? null,
        photo: parsed.profile?.photo ?? null,
      },
    };
  } catch {
    await SecureStore.deleteItemAsync(SECURE_STORE_KEY);
    return null;
  }
}

async function writeStoredSession(session: StoredSession): Promise<void> {
  await SecureStore.setItemAsync(SECURE_STORE_KEY, JSON.stringify(session));
}

async function clearStoredSession(): Promise<void> {
  accessToken = null;
  accessTokenExpiresAt = 0;
  await SecureStore.deleteItemAsync(SECURE_STORE_KEY);
}

function isValidTokenPair(value: unknown): value is TokenPair {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const pair = value as Partial<TokenPair>;
  return (
    typeof pair.accessToken === 'string' &&
    pair.accessToken.length > 0 &&
    typeof pair.refreshToken === 'string' &&
    pair.refreshToken.length > 0 &&
    typeof pair.expiresIn === 'number' &&
    Number.isFinite(pair.expiresIn) &&
    pair.expiresIn > 0
  );
}

function applyTokenPair(pair: TokenPair): void {
  accessToken = pair.accessToken;
  accessTokenExpiresAt = Date.now() + Math.max(0, pair.expiresIn - REFRESH_SKEW_SECONDS) * 1000;
}

async function postJson(path: string, body: unknown, token?: string): Promise<Response> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(`${alcedoApiBaseUrl}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

function mapGoogleSignInError(error: unknown): AuthError {
  const code = (error as { code?: string })?.code;
  if (code === statusCodes.SIGN_IN_CANCELLED) {
    return new AuthError('cancelled', 'Sign-in was cancelled.');
  }
  if (code === statusCodes.IN_PROGRESS) {
    return new AuthError('in-progress', 'Sign-in is already in progress.');
  }
  if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    return new AuthError('play-services-unavailable', 'Google Play services are not available.');
  }
  return new AuthError('network', error instanceof Error ? error.message : 'Google sign-in failed.');
}

/**
 * Google-only sign-in. Collects a Google ID token on-device, exchanges it
 * with backend-v2 (`POST /auth/google`), and persists the session.
 *
 * The refresh token lives in the OS secure store; the access token is kept
 * in memory only and never written to disk.
 */
export async function signInWithGoogle(): Promise<AuthProfile> {
  if (!isGoogleAuthConfigured()) {
    throw new AuthError('not-configured', 'Google sign-in is not configured yet.');
  }
  ensureConfigured();
  let idToken: string | null;
  let profile: AuthProfile;
  try {
    if (Platform.OS === 'android') {
      await GoogleSignin.hasPlayServices();
    }
    const response = await GoogleSignin.signIn();
    if (response.type === 'cancelled') {
      throw new AuthError('cancelled', 'Sign-in was cancelled.');
    }
    idToken = response.data.idToken;
    profile = {
      name: response.data.user.name,
      email: response.data.user.email,
      photo: response.data.user.photo,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw mapGoogleSignInError(error);
  }
  if (!idToken) {
    throw new AuthError('no-id-token', 'Google did not return an ID token.');
  }

  let http: Response;
  try {
    http = await postJson('/auth/google', { idToken });
  } catch (error) {
    throw new AuthError('network', error instanceof Error ? error.message : 'Could not reach the server.');
  }
  if (!http.ok) {
    throw new AuthError('rejected', `The server rejected the sign-in (HTTP ${http.status}).`);
  }
  const pair: unknown = await http.json();
  if (!isValidTokenPair(pair)) {
    throw new AuthError('rejected', 'The server returned an invalid session.');
  }
  applyTokenPair(pair);
  await writeStoredSession({ refreshToken: pair.refreshToken, profile });
  return profile;
}

/**
 * Rotates the refresh token (`POST /auth/refresh`). Concurrent callers share
 * a single in-flight refresh — the backend revokes the whole token family on
 * reuse, so double-refreshing would log the user out.
 *
 * Returns false when there is no stored session or the backend rejects the
 * refresh token. Throws `AuthError('network')` when the server is
 * unreachable — a dropped network must never be mistaken for a dead session.
 */
export async function refreshSession(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }
  refreshPromise = (async () => {
    try {
      const stored = await readStoredSession();
      if (!stored) {
        return false;
      }
      let http: Response;
      try {
        http = await postJson('/auth/refresh', { refreshToken: stored.refreshToken });
      } catch (error) {
        throw new AuthError(
          'network',
          error instanceof Error ? error.message : 'Could not reach the server.',
        );
      }
      if (!http.ok) {
        return false;
      }
      const pair: unknown = await http.json();
      if (!isValidTokenPair(pair)) {
        return false;
      }
      applyTokenPair(pair);
      await writeStoredSession({ refreshToken: pair.refreshToken, profile: stored.profile });
      return true;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

/** True when the refresh failure means "the network dropped", not "the session died". */
function isNetworkAuthError(error: unknown): boolean {
  return error instanceof AuthError && error.code === 'network';
}

/** Returns a usable access token, refreshing first when it is missing or near expiry. */
export async function getAccessToken(): Promise<string | null> {
  if (accessToken && Date.now() < accessTokenExpiresAt) {
    return accessToken;
  }
  let ok: boolean;
  try {
    ok = await refreshSession();
  } catch (error) {
    if (isNetworkAuthError(error)) {
      // Offline: the stored session is untouched, there is just no usable
      // token right now. Callers treat null as "try again later", never as
      // "signed out".
      return null;
    }
    throw error;
  }
  if (!ok) {
    await clearStoredSession();
    notifySessionInvalidated();
    return null;
  }
  return accessToken;
}

/**
 * Forces a token rotation regardless of local expiry — used after a 401 so
 * the retried request never reuses the token the server just rejected.
 * Single-flight via `refreshSession()`; on failure the session is cleared
 * and listeners are notified, exactly like `getAccessToken()`.
 */
export async function forceRefreshAccessToken(): Promise<string | null> {
  accessToken = null;
  accessTokenExpiresAt = 0;
  let ok: boolean;
  try {
    ok = await refreshSession();
  } catch (error) {
    if (isNetworkAuthError(error)) {
      return null;
    }
    throw error;
  }
  if (!ok) {
    await clearStoredSession();
    notifySessionInvalidated();
    return null;
  }
  return accessToken;
}

/** True when this device holds a refresh token — i.e. the user has not signed out. */
export async function hasStoredSession(): Promise<boolean> {
  const stored = await readStoredSession().catch(() => null);
  return stored !== null;
}

/**
 * Signs out everywhere this device knows about: revokes the refresh token on
 * the backend (best effort — a network failure still clears local state),
 * signs out of Google on-device, and wipes the stored session.
 */
export async function signOut(): Promise<void> {
  const stored = await readStoredSession().catch(() => null);
  if (stored && accessToken) {
    try {
      await postJson('/auth/logout', { refreshToken: stored.refreshToken }, accessToken);
    } catch {
      // Best effort: local state is cleared regardless.
    }
  }
  try {
    if (isGoogleAuthConfigured()) {
      ensureConfigured();
      await GoogleSignin.signOut();
    }
  } catch {
    // Best effort: the native Google session may not exist.
  }
  await clearStoredSession();
}

/** Restores a previous session on app start. Returns the profile when signed in. */
export async function restoreSession(): Promise<AuthProfile | null> {
  const stored = await readStoredSession().catch(() => null);
  if (!stored) {
    return null;
  }
  try {
    const ok = await refreshSession();
    if (!ok) {
      await clearStoredSession();
      return null;
    }
  } catch (error) {
    if (isNetworkAuthError(error)) {
      // Offline on launch: the session is intact, only the refresh could not
      // run. Return the cached identity so the app still knows who the user
      // is; the first authenticated call refreshes once the network is back.
      return stored.profile;
    }
    throw error;
  }
  return stored.profile;
}

/** For tests: resets all in-memory auth state. */
export function __resetAuthStateForTests(): void {
  accessToken = null;
  accessTokenExpiresAt = 0;
  refreshPromise = null;
  configured = false;
  sessionListeners.clear();
}

export interface PremiumEntitlement {
  /** Canonical premium status from the backend: 'active' | 'expired' | 'none'. */
  status: string;
  source: string | null;
  expiresAt: string | null;
}

export interface MyProfile {
  googleSub: string;
  email: string | null;
  name: string | null;
  picture: string | null;
  isAdmin: boolean;
  premium: PremiumEntitlement;
}

function isValidPremium(value: unknown): value is PremiumEntitlement {
  if (typeof value !== 'object' || value === null) return false;
  const p = value as Partial<PremiumEntitlement>;
  return (
    typeof p.status === 'string' &&
    (p.source === null || p.source === undefined || typeof p.source === 'string') &&
    (p.expiresAt === null || p.expiresAt === undefined || typeof p.expiresAt === 'string')
  );
}

function isValidMyProfile(value: unknown): value is MyProfile {
  if (typeof value !== 'object' || value === null) return false;
  const m = value as Partial<MyProfile>;
  return (
    typeof m.googleSub === 'string' &&
    m.googleSub.length > 0 &&
    isValidPremium(m.premium)
  );
}

/**
 * Reads the canonical user profile + premium entitlement from the backend
 * (`GET /auth/me`). The website purchase flow grants premium to the Google
 * `sub`, so a website purchase unlocks premium here automatically once the
 * backend confirms it — never claim premium until this call says so.
 *
 * Returns null when not signed in or when the backend is unreachable; callers
 * must treat null as "premium unknown", not "premium inactive".
 */
export async function fetchMyProfile(): Promise<MyProfile | null> {
  const token = await getAccessToken();
  if (!token) return null;
  let http: Response;
  try {
    http = await fetch(`${alcedoApiBaseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return null;
  }
  if (http.status === 401) {
    // The token the server just rejected might be stale — rotate once and retry.
    const rotated = await forceRefreshAccessToken();
    if (!rotated) return null;
    try {
      http = await fetch(`${alcedoApiBaseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${rotated}` },
      });
    } catch {
      return null;
    }
    if (!http.ok) return null;
  } else if (!http.ok) {
    return null;
  }
  let data: unknown;
  try {
    data = await http.json();
  } catch {
    return null;
  }
  if (!isValidMyProfile(data)) return null;
  return {
    email: data.email ?? null,
    googleSub: data.googleSub,
    isAdmin: data.isAdmin === true,
    name: data.name ?? null,
    picture: data.picture ?? null,
    premium: {
      expiresAt: data.premium.expiresAt ?? null,
      source: data.premium.source ?? null,
      status: data.premium.status,
    },
  };
}

/**
 * Convenience wrapper: true only when the backend confirms an active premium
 * entitlement. False covers both "known inactive" and "unknown" — the UI
 * must not distinguish them (never show premium-gated content on unknown).
 */
export async function isPremiumActive(): Promise<boolean> {
  const profile = await fetchMyProfile();
  return profile?.premium.status === 'active';
}
