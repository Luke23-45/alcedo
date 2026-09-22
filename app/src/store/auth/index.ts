import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthProfile } from '@/services/auth-service';

/**
 * Sign-in state for the Alcedo account (backend-v2, Google-only).
 *
 * This slice holds UI state only: whether a session exists and the Google
 * profile to display. Tokens live in the auth service (access token in
 * memory, refresh token in the OS secure store) and never enter redux.
 *
 * Everything in the app works without a session — this state only gates the
 * features that need the backend (sync, AI coach, premium status).
 */
export type AuthStatus = 'unknown' | 'signed-in' | 'signed-out';

export interface AuthState {
  status: AuthStatus;
  profile: AuthProfile | null;
}

const initialState: AuthState = {
  status: 'unknown',
  profile: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionRestored(state, action: PayloadAction<AuthProfile>) {
      state.status = 'signed-in';
      state.profile = action.payload;
    },
    signedIn(state, action: PayloadAction<AuthProfile>) {
      state.status = 'signed-in';
      state.profile = action.payload;
    },
    signedOut(state) {
      state.status = 'signed-out';
      state.profile = null;
    },
    /** The backend rejected the session (refresh failed / revoked). */
    sessionExpired(state) {
      state.status = 'signed-out';
      state.profile = null;
    },
  },
});

export const { sessionRestored, signedIn, signedOut, sessionExpired } = authSlice.actions;
export const authReducer = authSlice.reducer;
