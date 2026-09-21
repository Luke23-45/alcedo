import { Duration, OffsetDateTime } from '@js-joda/core';
import { Rest } from '@/models/blueprint-models';

export type RestTimerPhase = 'resting' | 'ready' | 'over';

export interface RestTimerState {
  phase: RestTimerPhase;
  windowStart: number;
  windowEnd: number | undefined;
  elapsedMs: number;
  remainingMs: number;
  restProgress: number;
}

/**
 * Pure countdown state machine behind the rest timer. Resting runs down the
 * first segment; ready fills the window between min and max rest; over fires
 * once the max is passed. A failed set earns a single, longer rest, and a
 * fixed rest (min === max) is a target rather than a window, so neither has a
 * second segment to fill. Kept free of React Native imports so the simulation
 * suite can drive every phase without a device.
 */
export function getRestTimerState(args: {
  rest: Rest;
  startTime: OffsetDateTime;
  pausedAt: OffsetDateTime | undefined;
  failed: boolean;
  adjustMs: number;
  now: OffsetDateTime;
}): RestTimerState {
  const { rest, startTime, pausedAt, failed, adjustMs, now } = args;
  // A paused timer freezes the countdown at the pause moment — time that
  // passes afterwards never reaches the state machine.
  const frozenNow = pausedAt ?? now;
  const elapsed = Math.max(0, Duration.between(startTime, frozenNow).toMillis() + adjustMs);
  const windowStart = (failed ? rest.failureRest : rest.minRest).toMillis();
  const windowEnd = failed || rest.minRest.equals(rest.maxRest) ? undefined : rest.maxRest.toMillis();

  if (elapsed < windowStart) {
    return {
      phase: 'resting',
      windowStart,
      windowEnd,
      elapsedMs: elapsed,
      remainingMs: windowStart - elapsed,
      restProgress: elapsed / windowStart,
    };
  }
  if (windowEnd !== undefined && elapsed < windowEnd) {
    return {
      phase: 'ready',
      windowStart,
      windowEnd,
      elapsedMs: elapsed,
      remainingMs: 0,
      restProgress: 1,
    };
  }
  return {
    phase: 'over',
    windowStart,
    windowEnd,
    elapsedMs: elapsed,
    remainingMs: 0,
    restProgress: 1,
  };
}
