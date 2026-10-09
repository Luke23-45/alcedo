import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { OffsetDateTime } from '@js-joda/core';
import BigNumber from 'bignumber.js';
import { useTranslate } from '@tolgee/react';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import { selectRecentlyCompletedExercises } from '@/store/stored-sessions';
import { usePreferredWeightUnit } from '@/hooks/usePreferredWeightUnit';
import { showSnackbar } from '@/store/app';
import {
  RecordedCardioExercise,
  RecordedExercise,
  RecordedWeightedExercise,
  RestTimer as RestTimerModel,
  Session,
  PotentialSet,
  SetType,
  WeightAppliesTo,
} from '@/models/session-models';
import { RecordedSet } from '@/models/session-models/recorded-weighted-exercise';
import { Rest, WeightedExerciseBlueprint } from '@/models/blueprint-models';
import { Weight } from '@/models/weight';
import { RestTimer } from '@/components/presentation/workout/rest-timer';
import { getRestTimerState } from '@/components/presentation/workout/rest-timer-state';
import { SessionNav } from '@/components/presentation/workout/session/session-nav/session-nav';
import SessionMoreMenuComponent from '@/components/smart/session-more-menu-component';
import { useWorkoutClock } from '@/components/presentation/workout/session/use-workout-clock';
import { CardioExercise } from '@/components/presentation/workout/cardio/cardio-exercise';
import {
  deriveExercisePhase,
  resolveFocusState,
  FocusState,
} from '@/components/presentation/workout/session/workout-focus-state';
import { getSessionExerciseHref } from '@/components/smart/session-exercise';
import { getSessionExerciseEditorHref } from '@/components/smart/session-exercise-editor';
import { useAddExercise } from '@/hooks/useAddExercise';
import { DetailAuras } from './detail-auras';
import { FocusCard } from './focus-card';
import { SetRowItem } from './set-log';
import { VsLastTime } from './vs-last-time';
import { PlanCard } from './plan-card';
import { HistoryStrip, HistoryPoint } from './history-strip';
import { ActionBar } from './action-bar';
import * as S from './workout-detail.styles';

export interface WorkoutDetailProps {
  session: Session;
  exerciseIndex: number;
  updateSession: (reducer: (session: Session) => Session) => void;
  onFinishWorkout: () => void;
  onBack: () => void;
}

export function WorkoutDetail({
  session,
  exerciseIndex,
  updateSession,
  onFinishWorkout,
  onBack,
}: WorkoutDetailProps) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslate();
  const preferredUnit = usePreferredWeightUnit();
  const rpeTracking = useAppSelector((x) => x.settings.rpeTracking);
  const restTimersEnabled = useAppSelector((x) => x.settings.restTimersEnabled);
  const recentlyCompletedExercises = useAppSelectorWithArg(selectRecentlyCompletedExercises, session.id);

  const clock = useWorkoutClock(session);
  const exercise = session.recordedExercises[exerciseIndex];

  const isWeighted = exercise instanceof RecordedWeightedExercise;
  const isCardio = exercise instanceof RecordedCardioExercise;

  const weightedEx = isWeighted ? (exercise as RecordedWeightedExercise) : undefined;
  const cardioEx = isCardio ? (exercise as RecordedCardioExercise) : undefined;
  const addExercise = useAddExercise(session.id);

  // Exercise state derivation
  const isComplete = exercise ? exercise.isComplete : false;
  const isCurrent = session.nextExercise === exercise;
  const isStarted = isWeighted
    ? (weightedEx?.potentialSets.some((ps) => ps.set !== undefined) ?? false)
    : (cardioEx?.sets.some((s) => s.isCompletelyFilled) ?? false);

  // Check if timer belongs to this exercise
  const timerOwnsThisExercise =
    session.restTimer !== undefined &&
    (session.restTimer.exerciseIndex === exerciseIndex ||
      (session.restTimer.exerciseIndex === undefined && session.lastExercise === exercise));

  const lastRecordedSet = weightedEx?.lastRecordedSet;
  const isWarmUp = lastRecordedSet?.set?.type === 'warmUp';
  const restConfig = isWarmUp ? Rest.short : weightedEx?.blueprint.restBetweenSets ?? Rest.short;

  const targetMin = lastRecordedSet?.set && weightedEx
    ? weightedEx.repsTargetForSet(weightedEx.potentialSets.indexOf(lastRecordedSet)).min
    : undefined;
  const lastSetFailed =
    targetMin !== undefined &&
    lastRecordedSet?.set !== undefined &&
    lastRecordedSet.set.repsCompleted < targetMin;

  const restTimerState = useMemo(() => {
    if (!timerOwnsThisExercise || !session.restTimer) return undefined;
    return getRestTimerState({
      rest: restConfig,
      startTime: session.restTimer.startedAt,
      pausedAt: session.restTimer.pausedAt,
      failed: !!lastSetFailed,
      adjustMs: 0,
      now: OffsetDateTime.now(),
    });
  }, [timerOwnsThisExercise, session.restTimer, restConfig, lastSetFailed]);

  const restPhase = timerOwnsThisExercise ? restTimerState?.phase : undefined;

  const exercisePhase = deriveExercisePhase({
    isComplete,
    isStarted,
    isCurrent,
    restPhase,
  });

  const hasNextExercise = session.recordedExercises.some((ex, i) => i > exerciseIndex && !ex.isComplete);

  // Next set position for this exercise
  const nextSetPosition = isWeighted
    ? (weightedEx?.potentialSets.findIndex((ps) => !ps.set) ?? 0)
    : 0;

  const currentSetNum = nextSetPosition >= 0 ? nextSetPosition + 1 : (weightedEx?.potentialSets.length ?? 1);

  const focusState = resolveFocusState({
    workoutPhase: session.workoutPhase,
    exercisePhase,
    hasNextExercise,
    currentSetNumber: currentSetNum,
  });

  // Superset partner
  const supersetPartnerName = (() => {
    if (weightedEx?.blueprint.supersetWithNext && exerciseIndex + 1 < session.recordedExercises.length) {
      return session.recordedExercises[exerciseIndex + 1]?.blueprint.name;
    }
    return undefined;
  })();

  // Previous performance history
  const historyExercises = exercise
    ? (recentlyCompletedExercises(exercise.movementKey()) as RecordedWeightedExercise[])
    : [];
  const prevEx = historyExercises[0];

  const historyPoints: HistoryPoint[] = useMemo(() => {
    return historyExercises
      .slice(0, 8)
      .reverse()
      .map((ex) => {
        const topWeight = Math.max(
          ...ex.potentialSets
            .filter((ps) => ps.set && ps.set.type !== 'warmUp')
            .map((ps) => ps.weight.value.toNumber()),
          0,
        );
        return {
          weight: topWeight,
          date: ex.latestTime?.toLocalDate().toString(),
        };
      })
      .filter((p) => p.weight > 0);
  }, [historyExercises]);

  // Log set action
  const handleLogSet = useCallback(() => {
    if (!weightedEx || nextSetPosition < 0) return;
    const now = OffsetDateTime.now();
    updateSession((s) => {
      const ex = s.recordedExercises[exerciseIndex] as RecordedWeightedExercise;
      if (!ex) return s;
      const updated = ex.withCycledRepCount(nextSetPosition, now);
      const withEx = s.withExercise(exerciseIndex, updated);
      if (restTimersEnabled) {
        return withEx.with({
          restTimer: new RestTimerModel(now, undefined, exerciseIndex),
        });
      }
      return withEx;
    });
  }, [weightedEx, nextSetPosition, updateSession, exerciseIndex, restTimersEnabled]);

  // Navigate to next incomplete exercise
  const handleNextExercise = useCallback(() => {
    const nextIdx = session.recordedExercises.findIndex((ex, i) => i > exerciseIndex && !ex.isComplete);
    if (nextIdx >= 0) {
      router.replace(getSessionExerciseHref(session.id, nextIdx));
    } else {
      onFinishWorkout();
    }
  }, [session, exerciseIndex, router, onFinishWorkout]);

  // Primary action dispatch
  const handlePrimaryCTA = () => {
    switch (focusState.primary.verb) {
      case 'startWorkout':
        clock.start();
        break;
      case 'resumeWorkout':
        clock.resume();
        break;
      case 'logSet':
        handleLogSet();
        break;
      case 'nextExercise':
        handleNextExercise();
        break;
      case 'finishWorkout':
        onFinishWorkout();
        break;
      case 'adjustRest':
        // When timer is running, log anyway or adjust
        handleLogSet();
        break;
    }
  };

  // Secondary action dispatch
  const handleSecondaryCTA = () => {
    if (!focusState.secondary) return;
    switch (focusState.secondary.verb) {
      case 'skip':
        // Dismiss rest timer with undo snackbar
        const dismissed = session.restTimer;
        updateSession((s) => s.with({ restTimer: undefined }));
        dispatch(
          showSnackbar({
            text: t('rest_timer.dismissed.message'),
            action: t('generic.undo.button'),
            onAction: () => updateSession((s) => s.with({ restTimer: dismissed })),
          }),
        );
        break;
      case 'finishWorkout':
        onFinishWorkout();
        break;
      case 'addExercise':
        addExercise();
        break;
    }
  };

  if (!exercise) return null;

  // Weighted exercise set calculations
  const nextPotentialSet = weightedEx?.potentialSets[nextSetPosition] ?? weightedEx?.potentialSets[0];
  const nextTargetReps = weightedEx
    ? weightedEx.repsTargetForSet(nextSetPosition >= 0 ? nextSetPosition : 0).max
    : 8;

  const weightStr = nextPotentialSet
    ? `${nextPotentialSet.weight.value.toString()} ${nextPotentialSet.weight.unit}`
    : '0 kg';

  const completedSetsCount = weightedEx?.potentialSets.filter((ps) => ps.set !== undefined).length ?? 0;
  const completedVolume = weightedEx
    ? `${weightedEx.totalWeightLifted.value.toString()} ${weightedEx.totalWeightLifted.unit}`
    : '0 kg';
  const completedReps = weightedEx
    ? weightedEx.potentialSets.reduce((sum, ps) => sum + (ps.set?.repsCompleted ?? 0), 0)
    : 0;

  const showRestTimerCard =
    restTimersEnabled &&
    timerOwnsThisExercise &&
    session.restTimer !== undefined &&
    session.workoutPhase === 'running';

  return (
    <S.ScreenWrapper>
      {/* Phase Auras (P4.0c) */}
      <DetailAuras phase={focusState.kind} />

      {/* Nav */}
      <SessionNav
        title={exercise.blueprint.name}
        onBack={onBack}
        menu={<SessionMoreMenuComponent session={session} isActiveWorkout />}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <S.ScrollContent $bottomInset={insets.bottom}>
          {/* Hero Focus Card (§4.2.1 / P4.1) */}
          <FocusCard
            focusState={focusState}
            exerciseName={exercise.blueprint.name}
            currentSetIndex={nextSetPosition >= 0 ? nextSetPosition : (weightedEx?.potentialSets.length ?? 1) - 1}
            totalSets={weightedEx?.potentialSets.length ?? 1}
            targetReps={nextTargetReps}
            weightText={weightStr}
            restTimeRemainingMs={restTimerState?.remainingMs}
            restTotalMs={restTimerState?.windowStart}
            prescribedRestSec={restConfig.minRest.seconds()}
            completedStats={{
              sets: completedSetsCount,
              volume: completedVolume,
              reps: completedReps,
            }}
            nextExerciseName={
              hasNextExercise
                ? session.recordedExercises.find((ex, i) => i > exerciseIndex && !ex.isComplete)?.blueprint.name
                : undefined
            }
          />

          {/* Sets Logger (§4.2.2 / P4.2) for Weighted */}
          {isWeighted && weightedEx && (
            <View style={{ gap: 8 }}>
              <S.SectionHeader>
                <S.SectionTitle>SETS</S.SectionTitle>
              </S.SectionHeader>

              <S.SetsContainer>
                {weightedEx.potentialSets.map((set, idx) => {
                  const target = weightedEx.repsTargetForSet(idx);
                  const isCurrentSet = idx === nextSetPosition;
                  const prevSet = prevEx?.potentialSets[idx];

                  return (
                    <SetRowItem
                      key={idx}
                      set={set}
                      index={idx}
                      isCurrent={isCurrentSet}
                      resistance={weightedEx.blueprint.resistance}
                      repsTarget={target}
                      weightIncrement={weightedEx.blueprint.weightIncrement}
                      rpeTracking={rpeTracking}
                      previousWeight={prevSet?.weight}
                      previousRepCount={prevSet?.set?.repsCompleted}
                      onTapCheck={() => {
                        const now = OffsetDateTime.now();
                        updateSession((s) => {
                          const ex = s.recordedExercises[exerciseIndex] as RecordedWeightedExercise;
                          const updated = ex.withCycledRepCount(idx, now);
                          const withEx = s.withExercise(exerciseIndex, updated);
                          if (restTimersEnabled) {
                            return withEx.with({
                              restTimer: new RestTimerModel(now, undefined, exerciseIndex),
                            });
                          }
                          return withEx;
                        });
                      }}
                      onUpdateWeight={(w, apply) => {
                        updateSession((s) => {
                          const ex = s.recordedExercises[exerciseIndex] as RecordedWeightedExercise;
                          return s.withExercise(exerciseIndex, ex.withWeight(idx, w, apply));
                        });
                      }}
                      onUpdateReps={(reps) => {
                        const now = OffsetDateTime.now();
                        updateSession((s) => {
                          const ex = s.recordedExercises[exerciseIndex] as RecordedWeightedExercise;
                          return s.withExercise(exerciseIndex, ex.withRepCount(idx, reps, now));
                        });
                      }}
                      onUpdateType={(type: SetType) => {
                        updateSession((s) => {
                          const ex = s.recordedExercises[exerciseIndex] as RecordedWeightedExercise;
                          const ps = ex.potentialSets[idx];
                          if (!ps) return s;
                          const updatedSet = ps.set
                            ? ps.set.withType(type)
                            : new RecordedSet(target.max, OffsetDateTime.now(), type);
                          return s.withExercise(exerciseIndex, ex.withSet(idx, (p) => p.with({ set: updatedSet })));
                        });
                      }}
                      onUpdateRpe={(rpe) => {
                        updateSession((s) => {
                          const ex = s.recordedExercises[exerciseIndex] as RecordedWeightedExercise;
                          const ps = ex.potentialSets[idx];
                          if (!ps) return s;
                          const updatedSet = ps.set
                            ? ps.set.withRpe(rpe)
                            : new RecordedSet(target.max, OffsetDateTime.now(), 'working', rpe);
                          return s.withExercise(exerciseIndex, ex.withSet(idx, (p) => p.with({ set: updatedSet })));
                        });
                      }}
                    />
                  );
                })}

                {/* Add set button */}
                <S.AddSetButton
                  onPress={() => {
                    updateSession((s) => {
                      const ex = s.recordedExercises[exerciseIndex] as RecordedWeightedExercise;
                      return s.withExercise(exerciseIndex, ex.withAddedSet(preferredUnit));
                    });
                  }}
                >
                  <S.AddSetText>+ Add set</S.AddSetText>
                </S.AddSetButton>
              </S.SetsContainer>
            </View>
          )}

          {/* Cardio Exercise section if cardio (P4.8) */}
          {isCardio && cardioEx && (
            <CardioExercise
              recordedExercise={cardioEx}
              previousRecordedExercises={recentlyCompletedExercises(cardioEx.movementKey()) as RecordedCardioExercise[]}
              toStartNext={isCurrent}
              isReadonly={false}
              showPreviousButton={true}
              index={exerciseIndex + 1}
              variant="active"
              updateExercise={(u) => updateSession((s) => s.withExercise(exerciseIndex, u(cardioEx)))}
              updateSet={(setIdx, u) =>
                updateSession((s) => {
                  const now = OffsetDateTime.now();
                  return s.withCardioSet(exerciseIndex, setIdx, u, now);
                })
              }
              onStartTimer={(setIdx) =>
                updateSession((s) => s.withCardioTimerStarted(exerciseIndex, setIdx, OffsetDateTime.now()))
              }
              onEditExercise={() => router.push(getSessionExerciseEditorHref(session.id, exerciseIndex))}
              onRemoveExercise={() => updateSession((s) => s.withRemovedExercise(exerciseIndex))}
            />
          )}

          {/* VS LAST TIME (§4.2.3 / P4.3) for Weighted */}
          {isWeighted && weightedEx && (
            <VsLastTime exercise={weightedEx} previousExercise={prevEx} />
          )}

          {/* PLAN & PROGRESSION (§4.2.4 / P4.4) for Weighted */}
          {isWeighted && weightedEx && (
            <PlanCard
              exercise={weightedEx}
              supersetPartnerName={supersetPartnerName}
              onUpdateRest={(r) => {
                updateSession((s) => {
                  const ex = s.recordedExercises[exerciseIndex] as RecordedWeightedExercise;
                  const newBlueprint = ex.blueprint.with({ restBetweenSets: r });
                  return s.withExercise(exerciseIndex, ex.with({ blueprint: newBlueprint }));
                });
              }}
              onUpdateNotes={(n) => {
                updateSession((s) => {
                  const ex = s.recordedExercises[exerciseIndex] as RecordedWeightedExercise;
                  return s.withExercise(exerciseIndex, ex.with({ notes: n }));
                });
              }}
            />
          )}

          {/* LAST 8 SESSIONS sparkline (§4.2.5 / P4.5) */}
          {isWeighted && (
            <HistoryStrip
              exerciseName={exercise.blueprint.name}
              history={historyPoints}
              unit={preferredUnit}
              onPress={() => router.push(`/exercise-history?name=${encodeURIComponent(exercise.blueprint.name)}&type=weighted`)}
            />
          )}
        </S.ScrollContent>
      </ScrollView>

      {/* Docked Rest Timer (§4.2.6 / P4.6) docked above action bar */}
      {showRestTimerCard && (
        <S.DockedTimerContainer $bottomOffset={insets.bottom + 84}>
          <RestTimer
            rest={restConfig}
            startTime={session.restTimer.startedAt}
            pausedAt={session.restTimer.pausedAt}
            failed={!!lastSetFailed}
            onDismiss={() => {
              const dismissed = session.restTimer;
              updateSession((s) => s.with({ restTimer: undefined }));
              dispatch(
                showSnackbar({
                  text: t('rest_timer.dismissed.message'),
                  action: t('generic.undo.button'),
                  onAction: () => updateSession((s) => s.with({ restTimer: dismissed })),
                }),
              );
            }}
            onTogglePause={() => {
              updateSession((s) => s.with({ restTimer: s.restTimer?.togglePause(OffsetDateTime.now()) }));
            }}
            onLogSet={handleLogSet}
            nextSetTitle={`Set ${currentSetNum} · ${exercise.blueprint.name}`}
            nextSetDetail={`${weightStr} × ${nextTargetReps}`}
          />
        </S.DockedTimerContainer>
      )}

      {/* Pinned Action Bar (§4.2.7 / P4.7) */}
      <ActionBar
        focusState={focusState}
        onPrimary={handlePrimaryCTA}
        onSecondary={handleSecondaryCTA}
        isPaused={session.workoutPhase === 'paused'}
      />
    </S.ScreenWrapper>
  );
}
