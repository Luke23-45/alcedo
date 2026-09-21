import { OffsetDateTime } from '@js-joda/core';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useDispatch, useStore } from 'react-redux';
import { RootState, useAppSelector } from '@/store';
import { updateStoredSession } from '@/store/stored-sessions';

/**
 * Auto-pause on Phone Lock (Settings → Notifications → Workout).
 *
 * When the app drops to the background mid-workout with a rest timer running,
 * the timer is paused at that instant — the countdown must not silently burn
 * while the phone is in a pocket. The paused state is explicit: the timer
 * shows paused when the user returns and resumes with one tap.
 */
export function AutoPauseOnLock() {
  const dispatch = useDispatch();
  const store = useStore<RootState>();
  const enabled = useAppSelector((state) => state.settings.autoPauseOnPhoneLock);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    const onChange = (status: AppStateStatus) => {
      if (status !== 'background' || !enabledRef.current) {
        return;
      }
      const state = store.getState();
      const sessionId = state.storedSessions.activeSessionId;
      const session = sessionId ? state.storedSessions.sessions[sessionId] : undefined;
      const restTimer = session?.restTimer;
      if (!session || !restTimer || restTimer.isPaused) {
        return;
      }
      const now = OffsetDateTime.now();
      dispatch(
        updateStoredSession({
          sessionId: session.id,
          update: (current) =>
            current.restTimer && !current.restTimer.isPaused
              ? current.with({ restTimer: current.restTimer.pause(now) })
              : current,
        }),
      );
    };
    const subscription = AppState.addEventListener('change', onChange);
    return () => subscription.remove();
  }, [dispatch, store]);

  return null;
}
