import { SurfaceText } from '@/components/presentation/foundation/surface-text';
import { PrBadgesCard, PrCardRecord } from '@/components/presentation/summary/pr-badges-card/pr-badges-card';
import { formatWeightShort } from '@/components/presentation/summary/post-workout-format';
import { useFormatDate } from '@/hooks/useFormatDate';
import { rounding, spacing, useAppTheme } from '@/hooks/useAppTheme';
import { MovementKey } from '@/models/blueprint-models';
import { RecordedWeightedExercise } from '@/models/session-models/recorded-weighted-exercise';
import { Session } from '@/models/session-models/session';
import { Weight } from '@/models/weight';
import { useAppSelector, useAppSelectorWhenFocused, useAppSelectorWithArg } from '@/store';
import { selectFeedPersonalRecords } from '@/store/activity';
import { PersonalRecord } from '@/store/stats/personal-records';
import {
  getSessionReferenceTime,
  selectHistoryPersonalRecords,
  selectSession,
  selectSessions,
} from '@/store/stored-sessions';
import { useTranslate } from '@tolgee/react';
import { LocalDate } from '@js-joda/core';
import { View } from 'react-native';
import { Icon } from 'react-native-paper';

export function FeedPrBadges({ eventId }: { eventId: string }) {
  const records = useAppSelector(selectFeedPersonalRecords).get(eventId);

  // Only the 90-day feed window is knowable, so this can never claim to be an all-time best.
  return <PrBadges records={records} labelKey="feed.pr_badge.label" />;
}

export function HistoryPrBadges({ sessionId }: { sessionId: string }) {
  const records = useAppSelectorWhenFocused(selectHistoryPersonalRecords).get(sessionId);

  return <PrBadges records={records} labelKey="history.pr_badge.label" />;
}

/**
 * The post-workout PR card. Detection is computed from the session's real
 * history, not from labels: a volume PR when this session's total beats every
 * previous session's, and an exercise PR when this session's heaviest recorded
 * set for a movement beats that movement's previous best. Ties are not PRs.
 */
export function PostWorkoutPrBadges({ sessionId }: { sessionId: string }) {
  const { t } = useTranslate();
  const formatDate = useFormatDate();
  const session = useAppSelectorWithArg(selectSession, sessionId);
  const sessions = useAppSelector(selectSessions);

  const records = session
    ? findSessionPrDetails(session, sessions, {
        volumeTitle: t('workout.post_workout.volume_pr.title'),
        volumeDetail: (volume: string, delta: string, date: string) =>
          t('workout.post_workout.volume_pr.detail', { volume, delta, date }),
        exerciseDetail: (weight: string, reps: string, prev: string) =>
          t('workout.post_workout.exercise_pr.detail', { weight, reps, prev }),
        shortDate: (date: LocalDate) => formatDate(date, { month: 'short', day: 'numeric' }),
      })
    : [];

  return <PrBadgesCard records={records} />;
}

interface PrCopy {
  volumeTitle: string;
  volumeDetail: (volume: string, delta: string, date: string) => string;
  exerciseDetail: (weight: string, reps: string, prev: string) => string;
  shortDate: (date: LocalDate) => string;
}

function findSessionPrDetails(session: Session, sessions: Session[], copy: PrCopy): PrCardRecord[] {
  const referenceTime = getSessionReferenceTime(session);
  const previous = sessions.filter(
    (s) => s.id !== session.id && getSessionReferenceTime(s).toEpochSecond() < referenceTime.toEpochSecond(),
  );

  const records: PrCardRecord[] = [];

  // Volume PR: this session's total beats every previous session's total.
  let prevBestTotal: { weight: Weight; date: LocalDate } | undefined;
  for (const s of previous) {
    const total = s.totalWeightLifted;
    if (!prevBestTotal || total.isGreaterThan(prevBestTotal.weight)) {
      prevBestTotal = { weight: total, date: s.date };
    }
  }
  const total = session.totalWeightLifted;
  if (prevBestTotal && total.isGreaterThan(prevBestTotal.weight)) {
    records.push({
      key: 'volume',
      title: copy.volumeTitle,
      detail: copy.volumeDetail(
        formatWeightShort(total),
        formatWeightShort(total.minus(prevBestTotal.weight)),
        copy.shortDate(prevBestTotal.date),
      ),
    });
  }

  // Exercise PRs: this session's heaviest recorded set for a movement beats
  // that movement's previous best recorded set weight.
  const prevBestByMovement = new Map<MovementKey, Weight>();
  for (const s of previous) {
    for (const exercise of s.recordedExercises) {
      if (!(exercise instanceof RecordedWeightedExercise) || !exercise.isStarted || !exercise.tracksResistance) {
        continue;
      }
      const key = exercise.movementKey();
      for (const ps of exercise.potentialSets) {
        if (!ps.set) {
          continue;
        }
        const current = prevBestByMovement.get(key);
        if (!current || ps.weight.isGreaterThan(current)) {
          prevBestByMovement.set(key, ps.weight);
        }
      }
    }
  }

  for (const exercise of session.recordedExercises) {
    if (!(exercise instanceof RecordedWeightedExercise) || !exercise.isStarted || !exercise.tracksResistance) {
      continue;
    }
    let bestSet: { weight: Weight; reps: number } | undefined;
    for (const ps of exercise.potentialSets) {
      if (!ps.set) {
        continue;
      }
      if (!bestSet || ps.weight.isGreaterThan(bestSet.weight)) {
        bestSet = { weight: ps.weight, reps: ps.set.repsCompleted };
      }
    }
    const prevBest = prevBestByMovement.get(exercise.movementKey());
    if (bestSet && prevBest && bestSet.weight.isGreaterThan(prevBest)) {
      records.push({
        key: `exercise-${exercise.movementKey()}`,
        title: `${exercise.blueprint.name} PR`,
        detail: copy.exerciseDetail(
          formatWeightShort(bestSet.weight),
          bestSet.reps.toString(),
          formatWeightShort(prevBest),
        ),
      });
    }
  }

  return records;
}

function PrBadges({
  records,
  labelKey,
}: {
  records: PersonalRecord[] | undefined;
  labelKey: 'feed.pr_badge.label' | 'history.pr_badge.label';
}) {
  const { t } = useTranslate();
  const { colors } = useAppTheme();

  if (!records?.length) {
    return null;
  }

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[1] }}>
      {records.map((record) => (
        <View
          key={record.exerciseName}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing[1],
            paddingVertical: spacing[1],
            paddingHorizontal: spacing[2],
            borderRadius: rounding.roundedRectangleRadius,
            backgroundColor: colors.tertiaryContainer,
          }}
        >
          <Icon source="trendingUp" size={14} color={colors.onTertiaryContainer} />
          <SurfaceText font="text-xs" color="onTertiaryContainer">
            {t(labelKey, { exercise: record.exerciseName })}
          </SurfaceText>
        </View>
      ))}
    </View>
  );
}
