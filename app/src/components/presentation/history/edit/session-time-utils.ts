import { RecordedCardioExercise } from '@/models/session-models/recorded-cardio-exercise';
import { RecordedWeightedExercise } from '@/models/session-models/recorded-weighted-exercise';
import { Session } from '@/models/session-models/session';
import { Duration, LocalDateTime, OffsetDateTime, ZoneOffset } from '@js-joda/core';

/**
 * Shifts every recorded set's completion timestamp by a fixed delta, in seconds.
 * Used by the Edit Session WHEN card: after a date change goes through
 * `withUpdatedDate` (which preserves local times and midnight-crossing offsets),
 * the residual time-of-day delta is applied uniformly so duration is preserved.
 */
export function shiftSetTimestamps(session: Session, deltaSeconds: number): Session {
  if (deltaSeconds === 0) {
    return session;
  }
  return session.with({
    recordedExercises: session.recordedExercises.map((recorded) => {
      if (recorded instanceof RecordedWeightedExercise) {
        return recorded.withAllSets((potential) =>
          potential.set?.completionDateTime
            ? potential.with({
                set: potential.set.with({
                  completionDateTime: potential.set.completionDateTime.plusSeconds(deltaSeconds),
                }),
              })
            : potential,
        );
      }
      if (recorded instanceof RecordedCardioExercise) {
        return recorded.withAllSets((set) =>
          set.completionDateTime
            ? set.with({
                completionDateTime: set.completionDateTime.plusSeconds(deltaSeconds),
              })
            : set,
        );
      }
      return recorded;
    }),
  });
}

/**
 * Applies a new session start or end date-time, chosen in the WHEN card editor.
 *
 * - The date component keeps the existing `withUpdatedDate` behavior (absolute
 *   date when all sets share one day, relative offsets otherwise).
 * - The residual time-of-day delta shifts every recorded set timestamp so the
 *   edited anchor lands exactly on the chosen time and duration is preserved.
 * - Sessions with no recorded timestamps have no anchor: only the session date
 *   is updated.
 */
export function applySessionDateTime(session: Session, anchor: 'start' | 'end', newDateTime: OffsetDateTime): Session {
  const oldAnchor = anchor === 'start' ? session.firstExercise?.earliestTime : session.lastExercise?.latestTime;
  if (!oldAnchor) {
    return session.withUpdatedDate(newDateTime.toLocalDate());
  }
  let next = session.withUpdatedDate(newDateTime.toLocalDate());
  const anchorAfter = anchor === 'start' ? next.firstExercise?.earliestTime : next.lastExercise?.latestTime;
  const deltaSeconds = anchorAfter ? newDateTime.toEpochSecond() - anchorAfter.toEpochSecond() : 0;
  next = shiftSetTimestamps(next, deltaSeconds);
  return next;
}

/** Builds an OffsetDateTime on the given JS date at hours:minutes, keeping the anchor's offset. */
export function offsetDateTimeAt(date: Date, hours: number, minutes: number, offset: ZoneOffset): OffsetDateTime {
  return OffsetDateTime.of(
    LocalDateTime.of(date.getFullYear(), date.getMonth() + 1, date.getDate(), hours, minutes),
    offset,
  );
}

/** Compact duration: "45:12", or "1:05:09" past an hour. */
export function formatCompactDuration(duration: Duration | undefined): string {
  if (!duration) {
    return '—';
  }
  const totalSeconds = Math.max(0, Math.floor(duration.toMillis() / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${minutes}:${ss}`;
}
