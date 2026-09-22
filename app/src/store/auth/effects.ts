import { onSessionInvalidated, restoreSession } from '@/services/auth-service';
import { initializeAppStateSlice } from '@/store/app';
import { sessionExpired, sessionRestored, signedOut } from '@/store/auth';
import type { AddEffectFn } from '@/store/store';

/**
 * Auth lifecycle effects:
 * - On app initialization, restores a previously stored session (refresh
 *   token → fresh token pair). No stored session means signed-out; the app
 *   works fully offline either way.
 * - When the auth service reports the session was invalidated (refresh
 *   failed or the token family was revoked), the UI state follows.
 */
export function applyAuthEffects(addEffect: AddEffectFn) {
  addEffect(initializeAppStateSlice, async (_, { dispatch }) => {
    // Lives for the app's lifetime: any refresh failure or revocation must
    // always move the UI back to signed-out.
    onSessionInvalidated(() => {
      dispatch(sessionExpired());
    });
    try {
      const profile = await restoreSession();
      dispatch(profile ? sessionRestored(profile) : signedOut());
    } catch {
      dispatch(signedOut());
    }
  });
}
