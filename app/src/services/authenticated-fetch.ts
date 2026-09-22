import { alcedoApiBaseUrl } from './api-consts';
import { AuthError, forceRefreshAccessToken, getAccessToken, hasStoredSession } from './auth-service';

/**
 * Authenticated fetch against backend-v2 — the only HTTP client features
 * (sync, AI coach) may use to talk to the new backend.
 *
 * - Injects `Authorization: Bearer <access token>`.
 * - On 401, forces a single token rotation (single-flight in the auth
 *   service) and retries the request exactly once with the new token.
 * - Throws `AuthError('session-expired')` when there is no session or the
 *   refresh fails. Callers treat this as "signed out", never as a crash.
 * - Throws `AuthError('network')` when the server is unreachable, even when
 *   a session exists. Callers treat this as "offline", never as "signed out":
 *   the stored session is preserved and the next call retries.
 *
 * This client never touches the legacy .NET backend: the base URL is
 * `alcedoApiBaseUrl`, independent of the per-feature backend assignments.
 */
export async function authenticatedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();
  if (!token) {
    throw await missingTokenError();
  }
  let response: Response;
  try {
    response = await fetch(`${alcedoApiBaseUrl}${path}`, {
      ...init,
      headers: {
        ...(init.headers as Record<string, string> | undefined),
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new AuthError('network', error instanceof Error ? error.message : 'Could not reach the server.');
  }
  if (response.status !== 401) {
    return response;
  }
  // The server rejected this token: rotate once and retry exactly once.
  const retryToken = await forceRefreshAccessToken();
  if (!retryToken) {
    throw await missingTokenError();
  }
  try {
    return await fetch(`${alcedoApiBaseUrl}${path}`, {
      ...init,
      headers: {
        ...(init.headers as Record<string, string> | undefined),
        Authorization: `Bearer ${retryToken}`,
      },
    });
  } catch (error) {
    throw new AuthError('network', error instanceof Error ? error.message : 'Could not reach the server.');
  }
}

/**
 * A null access token means either "signed out" or "offline". The stored
 * refresh token tells them apart: the auth service only clears it when the
 * backend rejects the session, never on a dropped network.
 */
async function missingTokenError(): Promise<AuthError> {
  const signedIn = await hasStoredSession().catch(() => false);
  return signedIn
    ? new AuthError('network', 'The server is unreachable.')
    : new AuthError('session-expired', 'No signed-in session.');
}
