import { Fragment, ReactNode } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslate } from '@tolgee/react';
import Svg, { Path } from 'react-native-svg';
import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { SurfaceText } from '@/components/presentation/foundation/surface-text';
import { HomeScreenBackground } from '@/components/presentation/home/shared/home-auras';
import { RecordedWeightedExercise, Session } from '@/models/session-models';
import { useAppSelectorWithArg } from '@/store';
import { selectRecentlyCompletedExercises } from '@/store/stored-sessions';
import { useAppTheme } from '@/hooks/useAppTheme';
import { getSessionExerciseHref } from '@/components/smart/session-exercise';
import { SessionNav } from '../session-nav/session-nav';
import { SessionAuras } from '../session-auras/session-auras';
import { TotalsGrid } from '../totals-grid';
import { ExerciseCard, SupersetConnector, SupersetLine } from '../exercise-card';
import { ExercisesHeader } from '../exercises-header/exercises-header';
import { EmptySession } from '../empty-session/empty-session';
import { SessionFooter } from '../session-footer/session-footer';
import {
  computeSessionTotals,
  sessionHasLoggedSet,
  sessionStartedExerciseCount,
} from '../session-stats';
import { formatElapsed } from '../use-elapsed-seconds';
import { useWorkoutClock } from '../use-workout-clock';
import {
  AddExerciseButton,
  BodySection,
  ExerciseList,
  ProgressLineText,
  ProgressLineWrap,
  StickyHeaderWrap,
} from './session-list.styles';

export interface SessionListProps {
  session: Session;
  onAddExercise: () => void;
  onFinishWorkout: () => void;
  menu?: ReactNode;
  notesComponent?: ReactNode;
}

/**
 * Redesigned Active Session overview list page:
 * - Session Nav (name + ⋯ menu)
 * - Sticky 2×2 totals grid (TIME · SETS · VOLUME KG · REPS)
 * - Exercises header (EXERCISES n / m)
 * - Exercise navigation rows (single Pressable pushing exercise detail)
 * - Add exercise dashed row
 * - Notes card
 * - Progress line ("n sets to go")
 * - Finish card (timer removed, brand CTA)
 */
export function SessionList({
  session,
  onAddExercise,
  onFinishWorkout,
  menu,
  notesComponent,
}: SessionListProps) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const clock = useWorkoutClock(session);
  const timeFormatted = formatElapsed(clock.elapsedSeconds);
  const totals = computeSessionTotals(session);
  const isEmpty = session.recordedExercises.length === 0;

  const recentlyCompletedExercises = useAppSelectorWithArg(
    selectRecentlyCompletedExercises,
    session.id,
  );

  return (
    <FullHeightScrollView
      screenBackground={
        <>
          <HomeScreenBackground />
          <SessionAuras />
        </>
      }
      stickyHeaderIndices={isEmpty ? undefined : [1]}
    >
      {/* 0: Nav */}
      <View style={{ paddingTop: insets.top }}>
        <SessionNav title={session.blueprint.name} onBack={router.back} menu={menu} />
      </View>

      {/* 1: Totals Grid (sticky) */}
      <StickyHeaderWrap $topInset={insets.top}>
        <TotalsGrid
          stats={totals}
          timeFormatted={timeFormatted}
          dimmed={isEmpty}
        />
      </StickyHeaderWrap>

      {/* Body */}
      {isEmpty ? (
        <EmptySession onAddExercise={onAddExercise} />
      ) : (
        <BodySection>
          {/* 2: Exercises Header */}
          <ExercisesHeader
            done={sessionStartedExerciseCount(session)}
            total={session.recordedExercises.length}
          />

          {/* 3: Exercise Rows */}
          <ExerciseList>
            {session.recordedExercises.map((exercise, index) => {
              const isCurrent = session.nextExercise === exercise;
              const prevExercise = recentlyCompletedExercises(exercise.movementKey())[0];

              const nextExercise = session.recordedExercises[index + 1];
              const prevExerciseInSession = index > 0 ? session.recordedExercises[index - 1] : undefined;

              const isWeighted = exercise instanceof RecordedWeightedExercise;
              const prevIsWeighted = prevExerciseInSession instanceof RecordedWeightedExercise;

              let supersetPartnerName: string | undefined = undefined;
              if (isWeighted && exercise.blueprint.supersetWithNext && nextExercise) {
                supersetPartnerName = nextExercise.blueprint.name;
              } else if (prevIsWeighted && prevExerciseInSession.blueprint.supersetWithNext) {
                supersetPartnerName = prevExerciseInSession.blueprint.name;
              }

              const hasSupersetConnector =
                isWeighted &&
                exercise.blueprint.supersetWithNext &&
                index < session.recordedExercises.length - 1;

              return (
                <Fragment key={`${exercise.movementKey()}-${index}`}>
                  <ExerciseCard
                    exercise={exercise}
                    index={index}
                    isCurrent={isCurrent}
                    previousExercise={prevExercise}
                    supersetPartnerName={supersetPartnerName}
                    onPress={() => router.push(getSessionExerciseHref(session.id, index))}
                  />
                  {hasSupersetConnector && (
                    <SupersetConnector>
                      <SupersetLine />
                    </SupersetConnector>
                  )}
                </Fragment>
              );
            })}
          </ExerciseList>

          {/* 4: In-flow Add Exercise Button */}
          <AddExerciseButton
            onPress={onAddExercise}
            accessibilityRole="button"
            accessibilityLabel={t('exercise.add.title')}
            testID="session-add-exercise"
            hitSlop={{ top: 6, bottom: 6 }}
          >
            <Svg width={12} height={12} viewBox="-6 -6 12 12">
              <Path
                d="M-6 0 H6 M0 -6 V6"
                stroke={theme.color.interactive.tint}
                strokeWidth={2.2}
                strokeLinecap="round"
                fill="none"
              />
            </Svg>
            <SurfaceText>{t('exercise.add.title')}</SurfaceText>
          </AddExerciseButton>

          {/* 5: Notes Card */}
          {notesComponent}

          {/* 6: Progress Line ("n sets to go") */}
          {totals.setsTotal > 0 && (
            <ProgressLineWrap>
              <ProgressLineText>
                {totals.setsRemaining > 0
                  ? t('workout.session.sets_to_go', {
                      count: totals.setsRemaining,
                      defaultValue: `${totals.setsRemaining} sets to go`,
                    })
                  : t('workout.session.all_sets_completed', {
                      defaultValue: 'All sets completed!',
                    })}
              </ProgressLineText>
            </ProgressLineWrap>
          )}
        </BodySection>
      )}

      {/* 7: Finish Card (timer slot empty per P5j) */}
      <SessionFooter
        canFinish={sessionHasLoggedSet(session)}
        onFinish={onFinishWorkout}
      />
    </FullHeightScrollView>
  );
}
