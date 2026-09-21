import {
  ExerciseDetailLayout,
  Body,
  EmptyWrap,
  EmptyText,
} from '@/components/presentation/stats/trends/exercise-detail/screen-layout/screen-layout';
import { DetailNavBar } from '@/components/presentation/stats/trends/exercise-detail/nav-bar/nav-bar';
import { IdentityCard } from '@/components/presentation/stats/trends/exercise-detail/identity-card/identity-card';
import { StatStrip } from '@/components/presentation/stats/trends/exercise-detail/stat-strip/stat-strip';
import { ProgressChart } from '@/components/presentation/stats/trends/exercise-detail/progress-chart/progress-chart';
import { MuscleInvolvement } from '@/components/presentation/stats/trends/exercise-detail/muscle-involvement/muscle-involvement';
import { LastSessionDetail } from '@/components/presentation/stats/trends/exercise-detail/last-session/last-session';
import { SessionHistory } from '@/components/presentation/stats/trends/exercise-detail/session-history/session-history';
import { ExerciseDetailActions } from '@/components/presentation/stats/trends/exercise-detail/exercise-detail-actions/exercise-detail-actions';
import {
  ExerciseDetailData,
  buildLogSession,
  selectExerciseDetail,
} from '@/components/presentation/stats/trends/exercise-detail/exercise-detail-model';
import { useStartWorkoutWithConfirmation } from '@/hooks/useStartWorkoutWithConfirmation';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import { translateExerciseMeta } from '@/utils/exercise-meta';
import { T, useTranslate } from '@tolgee/react';
import { Href, Stack } from 'expo-router';
import { useLocalSearchParams, useRouter } from 'expo-router/build/hooks';
import { useEffect } from 'react';

/**
 * Exercise Progress Detail (trends-dark Screen 2): all-time detail for one
 * weighted exercise, derived from finished sessions. Geometry follows the
 * reference SVG: 16pt side margins, 12pt card gaps, in-content nav.
 *
 * Navigation stays real: history rows open the session editor, the header's
 * "{n} total" opens the exercise's full history, "Log {name} Session" starts
 * a fresh preloaded session, and "Edit Exercise Details" opens the exercise
 * manager where descriptors are edited. The nav ⋯ menu mirrors those two
 * actions so every control goes somewhere.
 */
export default function ExerciseDetailPage() {
  const { exerciseName } = useLocalSearchParams<{ exerciseName: string }>();
  const { dismissTo, push, back } = useRouter();
  const { t } = useTranslate();
  const useImperialUnits = useAppSelector((x) => x.settings.useImperialUnits);
  const detail = useAppSelectorWithArg(selectExerciseDetail, exerciseName ?? '');
  const { start, confirmationDialog } = useStartWorkoutWithConfirmation();

  useEffect(() => {
    if (!exerciseName) {
      dismissTo('/stats');
    }
  }, [exerciseName, dismissTo]);

  if (!exerciseName) {
    return null;
  }

  const logSession = () => {
    const session = detail ? buildLogSession(detail, useImperialUnits) : null;
    if (session) {
      start(session);
    } else {
      push('/(tabs)/(session)');
    }
  };
  const editDetails = () => push('/(tabs)/settings/manage-exercises' as Href);
  const openSession = (sessionId: string) =>
    push(`/history/edit?sessionId=${encodeURIComponent(sessionId)}` as Href);
  const openFullHistory = () =>
    push(`/exercise-history?name=${encodeURIComponent(exerciseName)}&type=weighted` as Href);

  const shortName = detail?.shortName ?? exerciseName;
  const menuItems = [
    {
      label: t('stats.exercise_detail.actions.log_session', { name: shortName }),
      onPress: logSession,
    },
    { label: t('stats.exercise_detail.actions.edit_details'), onPress: editDetails },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ExerciseDetailLayout>
        <DetailNavBar title={shortName} onBack={back} menuItems={menuItems} />
        {detail ? (
          <LoadedDetail
            detail={detail}
            t={t}
            onSessionPress={openSession}
            onViewAll={openFullHistory}
            onLogSession={logSession}
            onEditDetails={editDetails}
          />
        ) : (
          <EmptyWrap>
            <EmptyText>
              <T keyName="stats.no_data.message" />
            </EmptyText>
          </EmptyWrap>
        )}
      </ExerciseDetailLayout>
      {confirmationDialog}
    </>
  );
}

function LoadedDetail({
  detail,
  t,
  onSessionPress,
  onViewAll,
  onLogSession,
  onEditDetails,
}: {
  detail: ExerciseDetailData;
  t: ReturnType<typeof useTranslate>['t'];
  onSessionPress: (sessionId: string) => void;
  onViewAll: () => void;
  onLogSession: () => void;
  onEditDetails: () => void;
}) {
  const metaLine = [
    detail.equipment ? translateExerciseMeta(t, 'equipment', detail.equipment) : null,
    ...detail.muscles.map((m) => translateExerciseMeta(t, 'muscle', m)),
  ]
    .filter(Boolean)
    .join(' · ');
  const typeChip = detail.mechanic
    ? translateExerciseMeta(t, 'mechanic', detail.mechanic).toUpperCase()
    : null;
  const latest = detail.sessions[0]!;

  return (
    <Body>
      <IdentityCard
        name={detail.exerciseName}
        metaLine={metaLine}
        typeChip={typeChip}
        weeklyFrequency={detail.weeklyFrequency}
      />
      <StatStrip
        values={{
          bestTopSet: detail.bestTopSet,
          bestE1rm: detail.bestE1rm,
          sessionCount: detail.sessionCount,
          trailing7dVolume: detail.trailing7dVolume,
        }}
        unitLabel={detail.unitLabel}
      />
      <ProgressChart
        sessions={detail.sessions}
        bestE1rm={detail.bestE1rm}
        latestBodyweight={detail.latestBodyweight}
        unitLabel={detail.unitLabel}
      />
      {detail.muscles.length > 0 ? <MuscleInvolvement muscles={detail.muscles} /> : null}
      <LastSessionDetail session={latest} unitLabel={detail.unitLabel} />
      <SessionHistory
        sessions={detail.sessions}
        unitLabel={detail.unitLabel}
        sessionCount={detail.sessionCount}
        onSessionPress={onSessionPress}
        onViewAll={onViewAll}
      />
      <ExerciseDetailActions
        shortName={detail.shortName}
        onLogSession={onLogSession}
        onEditDetails={onEditDetails}
      />
    </Body>
  );
}

