import { Session } from '@/models/session-models/session';
import { OffsetDateTime } from '@js-joda/core';
import { useEffect, useState } from 'react';

/**
 * Live elapsed workout seconds, ticking once per second.
 *
 * The session anchors on its first logged set: the elapsed time runs from the
 * earliest logged set timestamp to now. Before anything is logged the clock
 * holds at 00:00 — the store keeps no workout-start timestamp, so a running
 * pre-log clock would anchor to view mount and reset on every remount.
 * Never negative.
 */
export function useElapsedSeconds(session: Session): number {
  const [now, setNow] = useState(() => OffsetDateTime.now());

  useEffect(() => {
    const id = setInterval(() => setNow(OffsetDateTime.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const start = session.firstExercise?.earliestTime;
  if (!start) {
    return 0;
  }
  return Math.max(0, Math.floor(now.toEpochSecond() - start.toEpochSecond()));
}

/** Formats elapsed seconds as `mm:ss` (zero-padded, per the reference), or `h:mm:ss` past the hour. */
export function formatElapsed(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}
