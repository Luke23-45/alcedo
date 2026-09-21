import { Session } from "@/models/session-models/session";
import { RootState } from "@/store";
import { selectSessions } from "@/store/stored-sessions";
import { LocalDate, TemporalAdjusters } from "@js-joda/core";
import { createSelector } from "@reduxjs/toolkit";

export interface ProfileStats {
  /** Finished, started sessions. */
  sessionCount: number;
  /** Consecutive trained days ending today (or yesterday — the streak stays alive). */
  streakDays: number;
  /** Lifetime lifted kilograms. */
  lifetimeKg: number;
  /** Kilograms lifted since the start of the current week. */
  thisWeekKg: number;
}

/**
 * Consecutive trained days ending on today; when today isn't trained yet the
 * streak is counted through yesterday so it stays alive. Anything older than
 * yesterday breaks it. Pure, so the spec pins the edge cases.
 */
export function calculateDayStreak(trainedEpochDays: number[], todayEpochDay: number): number {
  const trained = new Set(trainedEpochDays);
  let day = todayEpochDay;
  if (!trained.has(day)) {
    day -= 1;
  }
  let streak = 0;
  while (trained.has(day)) {
    streak += 1;
    day -= 1;
  }
  return streak;
}

function sessionKg(session: Session): number {
  return session.totalWeightLifted.convertTo("kilograms").value.toNumber();
}

const selectStartedSessions = createSelector([selectSessions], (sessions) =>
  sessions.filter((session) => session.isStarted),
);

export const selectProfileStats = createSelector(
  [selectStartedSessions, (state: RootState) => state.settings.firstDayOfWeek],
  (sessions, firstDayOfWeek): ProfileStats => {
    const today = LocalDate.now();
    const todayEpoch = today.toEpochDay();
    const epochDays = sessions.map((session) => session.date.toEpochDay());
    const weekStart = today.with(TemporalAdjusters.previousOrSame(firstDayOfWeek)).toEpochDay();
    let lifetimeKg = 0;
    let thisWeekKg = 0;
    for (const session of sessions) {
      const kg = sessionKg(session);
      lifetimeKg += kg;
      if (session.date.toEpochDay() >= weekStart) {
        thisWeekKg += kg;
      }
    }
    return {
      sessionCount: sessions.length,
      streakDays: calculateDayStreak(epochDays, todayEpoch),
      lifetimeKg,
      thisWeekKg,
    };
  },
);
