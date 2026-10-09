import { useAppSelector } from '@/store';
import { selectActiveSession, updateStoredSession } from '@/store/stored-sessions';
import { useDispatch } from 'react-redux';
import { OffsetDateTime } from '@js-joda/core';
import { useCallback, useEffect, useState } from 'react';
import { Session } from '@/models/session-models/session';

/**
 * Live workout clock driving the active workout session.
 * Exposes workoutPhase ('idle' | 'running' | 'paused'), elapsed seconds computed from the
 * persisted startedAt/pausedAt/pausedTotalMs timestamps, and start/pause/resume actions.
 */
export function useWorkoutClock(sessionOverride?: Session) {
  const activeSession = useAppSelector(selectActiveSession);
  const session = sessionOverride ?? activeSession;
  const dispatch = useDispatch();
  const [now, setNow] = useState(() => OffsetDateTime.now());

  const isRunning = session?.workoutPhase === 'running';

  useEffect(() => {
    if (!isRunning) {
      return;
    }
    const id = setInterval(() => setNow(OffsetDateTime.now()), 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const phase = session?.workoutPhase ?? 'idle';
  const elapsedSeconds = session ? Math.floor(session.elapsedMsAt(now) / 1000) : 0;

  const start = useCallback(() => {
    if (!session) return;
    const currentNow = OffsetDateTime.now();
    dispatch(
      updateStoredSession({
        sessionId: session.id,
        update: (s) => s.withStartedAt(currentNow),
      }),
    );
  }, [dispatch, session]);

  const pause = useCallback(() => {
    if (!session) return;
    const currentNow = OffsetDateTime.now();
    dispatch(
      updateStoredSession({
        sessionId: session.id,
        update: (s) => s.withPaused(currentNow),
      }),
    );
  }, [dispatch, session]);

  const resume = useCallback(() => {
    if (!session) return;
    const currentNow = OffsetDateTime.now();
    dispatch(
      updateStoredSession({
        sessionId: session.id,
        update: (s) => s.withResumed(currentNow),
      }),
    );
  }, [dispatch, session]);

  return {
    phase,
    elapsedSeconds,
    start,
    pause,
    resume,
  };
}
