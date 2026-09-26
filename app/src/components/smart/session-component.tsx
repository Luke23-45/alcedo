import { showSnackbar } from '@/store/app';
import { Card, Icon, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { Fragment, useCallback } from 'react';
import { View } from 'react-native';
import EmptyInfo from '@/components/presentation/foundation/empty-info';
import { useAppTheme } from '@/hooks/useAppTheme';
import { type as typeHelper } from '@/styles/theme';
import { T, useTranslate } from '@tolgee/react';
import ItemList from '@/components/presentation/foundation/item-list';
import {
  RecordedCardioExercise,
  RecordedCardioExerciseSet,
  RecordedExercise,
  RecordedWeightedExercise,
  RestTimer as RestTimerModel,
  Session,
} from '@/models/session-models';
import { Updater } from '@/utils/types';
import { CardioTimer } from '@/components/presentation/workout/cardio/cardio-timer';
import WeightedExercise from '@/components/presentation/workout/weighted/weighted-exercise';
import WeightDisplay from '@/components/presentation/foundation/editors/weight-display';
import BigNumber from 'bignumber.js';
import RestTimer from '@/components/presentation/workout/rest-timer';
import { ReactNode } from 'react';
import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { getSessionExerciseEditorHref } from '@/components/smart/session-exercise-editor';
import { LocalTime, OffsetDateTime, ZoneId } from '@js-joda/core';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import { selectRecentlyCompletedExercises } from '@/store/stored-sessions';
import { PageActions } from '@/components/presentation/foundation/page-actions';
import AddIcon from '@expo/material-symbols/add.xml';
import { SurfaceText } from '@/components/presentation/foundation/surface-text';
import { match, P } from 'ts-pattern';
import { CardioExercise } from '@/components/presentation/workout/cardio/cardio-exercise';
import WeightFormat from '../presentation/foundation/weight-format';
import { shortFormatWeightUnit } from '@/models/weight';
import { formatDuration } from '@/utils/format-date';
import { localeFormatBigNumber } from '@/utils/locale-bignumber';
import { useAddExercise } from '@/hooks/useAddExercise';
import SessionMoreMenuComponent from '@/components/smart/session-more-menu-component';
import { HomeScreenBackground } from '@/components/presentation/home/shared/home-auras';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { SessionNav } from '@/components/presentation/workout/session/session-nav/session-nav';
import { ElapsedCard } from '@/components/presentation/workout/session/elapsed-card/elapsed-card';
import { StatStrip } from '@/components/presentation/workout/session/stat-strip/stat-strip';
import {
  computeSessionStats,
  sessionHasLoggedSet,
  sessionStartedExerciseCount,
} from '@/components/presentation/workout/session/session-stats';
import { ExercisesHeader } from '@/components/presentation/workout/session/exercises-header/exercises-header';
import { EmptySession } from '@/components/presentation/workout/session/empty-session/empty-session';
import { SessionFooter } from '@/components/presentation/workout/session/session-footer/session-footer';
import { SessionAuras } from '@/components/presentation/workout/session/session-auras/session-auras';
import { useElapsedSeconds } from '@/components/presentation/workout/session/use-elapsed-seconds';

function withRestTimerAt(session: Session, time: OffsetDateTime | undefined) {
  return session.with({
    restTimer: time ? new RestTimerModel(time) : undefined,
  });
}

function ActiveSessionView(props: {
  session: Session;
  addExercise: () => void;
  renderItem: (item: RecordedExercise, index: number) => ReactNode;
  notesComponent: ReactNode;
  bodyweight: ReactNode;
  timer: ReactNode;
  showRestSlot: boolean;
  canFinish: boolean;
  onFinishWorkout: () => void;
  menu: ReactNode;
}) {
  const { session } = props;
  const { back } = useRouter();
  const insets = useSafeAreaInsets();
  const elapsed = useElapsedSeconds(session);
  const isEmpty = session.recordedExercises.length === 0;
  const stats = computeSessionStats(session);

  return (
    <FullHeightScrollView
      screenBackground={
        <>
          <HomeScreenBackground />
          <SessionAuras />
        </>
      }
      floatingChildren={
        <SessionFooter
          timer={props.timer}
          showRestSlot={props.showRestSlot}
          canFinish={props.canFinish}
          onFinish={props.onFinishWorkout}
        />
      }
    >
      <View style={{ paddingTop: insets.top }}>
        <SessionNav title={session.blueprint.name} onBack={back} menu={props.menu} />
      </View>
      <View style={{ marginTop: 6 }}>
        <ElapsedCard seconds={elapsed} />
      </View>
      <View style={{ marginTop: 12 }}>
        <StatStrip stats={stats} dimmed={isEmpty} />
      </View>
      {isEmpty ? (
        <EmptySession onAddExercise={props.addExercise} />
      ) : (
        <View>
          <ExercisesHeader done={sessionStartedExerciseCount(session)} total={session.recordedExercises.length} />
          <View style={{ gap: 12 }}>
            {session.recordedExercises.map((item, index) => (
              // Exercises can be removed mid-list (which shifts positions), so the key
              // carries the movement identity — set rows below stay index-keyed: sets are
              // append-only with in-place cycling, never reordered or removed here.
              <Fragment key={`${item.movementKey()}-${index}`}>{props.renderItem(item, index)}</Fragment>
            ))}
          </View>
        </View>
      )}
      {props.notesComponent}
      {props.bodyweight}
    </FullHeightScrollView>
  );
}

export default function SessionComponent(props: {
  session: Session;
  /**
   * Takes a reducer rather than a value so consecutive edits compose against whatever the owner
   * currently holds. Omit it for a session the user does not own, which makes the screen read-only.
   */
  updateSession?: (update: (session: Session) => Session) => void;
  /** The workout being performed right now: rest timers, live timestamps, previous performances. */
  isActiveWorkout?: boolean;
  showBodyweight: boolean;
  header?: ReactNode;
  openPostWorkoutSummary?: () => void;
  /** Active session only: runs the finish flow (confirmation included) from the sticky footer. */
  onFinishWorkout?: () => void;
}) {
  const { session, isActiveWorkout } = props;
  const theme = useAppTheme();
  // Stable across renders: the active-workout clock reads "now" and depends on
  // no session state, so this closure never changes identity when sets are
  // logged — keeping every exercise card memoized. (The inactive branch below
  // captures session, but history sessions are static.)
  const activeTimeProvider = useCallback(() => OffsetDateTime.now(), []);
  const { t } = useTranslate();
  const { push } = useRouter();
  const restTimersEnabled = useAppSelector((x) => x.settings.restTimersEnabled);
  const dispatch = useDispatch();
  const isReadonly = !props.updateSession;
  const editableSessionId = isReadonly ? undefined : session.id;
  const recentlyCompletedExercises = useAppSelectorWithArg(selectRecentlyCompletedExercises, session.id);
  const addExercise = useAddExercise(editableSessionId);
  const updateSession = (reducer: (session: Session) => Session) => props.updateSession?.(reducer);
  const resetTimer = (time: OffsetDateTime | undefined) => {
    updateSession((s) => withRestTimerAt(s, time));
  };
  const dismissTimer = () => {
    const dismissedTimer = session.restTimer;
    resetTimer(undefined);
    dispatch(
      showSnackbar({
        text: t('rest_timer.dismissed.message'),
        action: t('generic.undo.button'),
        onAction: () => updateSession((s) => s.with({ restTimer: dismissedTimer })),
      }),
    );
  };
  const toggleRestTimerPaused = () => {
    updateSession((s) => s.with({ restTimer: s.restTimer?.togglePause(OffsetDateTime.now()) }));
  };

  // Both the set's own tiles and the docked clock write through here, so a set earns its rest
  // whichever way it was filled in.
  const updateCardioSet = (exerciseIndex: number) => (setIndex: number, update: Updater<RecordedCardioExerciseSet>) => {
    const now = OffsetDateTime.now();
    updateSession((s) => {
      const before = s.cardioSetAt(exerciseIndex, setIndex);
      const updated = s.withCardioSet(exerciseIndex, setIndex, update, now);
      return updated.cardioSetAt(exerciseIndex, setIndex)?.earnsRest(before)
        ? withRestTimerAt(updated, updated.lastExercise?.latestTime)
        : updated;
    });
  };

  const startCardioTimer = (exerciseIndex: number) => (setIndex: number) =>
    updateSession((s) => s.withCardioTimerStarted(exerciseIndex, setIndex, OffsetDateTime.now()));

  const notesComponent = session.blueprint.notes ? (
    <HomeCard
      radius={theme.home.radius.row}
      pad={theme.space.base}
      style={{ marginVertical: theme.space.sm, marginHorizontal: theme.layout.screenPadding }}
    >
      <View
        style={{
          gap: theme.space.base,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Icon source={'text'} size={20} />
        <View style={{ flex: 1, paddingRight: theme.space.sm }}>
          <SurfaceText>{session.blueprint.notes}</SurfaceText>
        </View>
      </View>
    </HomeCard>
  ) : null;

  const emptyInfo =
    session.recordedExercises.length === 0 ? (
      <EmptyInfo style={{ marginVertical: theme.space.xxl }}>
        <SurfaceText>
          {t('workout.contains_no_exercises.message')} {'\n'}
        </SurfaceText>
        <SurfaceText>{t('exercise.add_hint.body')}</SurfaceText>
      </EmptyInfo>
    ) : null;

  const renderItem = (variant: 'active' | 'classic') => (item: RecordedExercise, index: number) => {
    return match(item)
      .with(P.instanceOf(RecordedWeightedExercise), (item) => (
        <WeightedExercise
          timeProvider={
            isActiveWorkout
              ? activeTimeProvider
              : () =>
                  session.lastExercise?.latestTime ??
                  session.date.atTime(LocalTime.now()).atZone(ZoneId.systemDefault()).toOffsetDateTime()
          }
          resetSetTimer={() => updateSession((s) => withRestTimerAt(s, s.lastExercise?.latestTime))}
          recordedExercise={item}
          toStartNext={session.nextExercise === item}
          updateExercise={(update) =>
            updateSession((s) => s.withExercise(index, update(s.recordedExercises[index] as RecordedWeightedExercise)))
          }
          onEditExercise={
            editableSessionId ? () => push(getSessionExerciseEditorHref(editableSessionId, index)) : undefined
          }
          onRemoveExercise={() => updateSession((s) => s.withRemovedExercise(index))}
          isReadonly={isReadonly}
          showPreviousButton={!!isActiveWorkout}
          previousRecordedExercises={recentlyCompletedExercises(item.movementKey()) as RecordedWeightedExercise[]}
          variant={variant}
          index={index + 1}
        />
      ))
      .with(P.instanceOf(RecordedCardioExercise), (item) => (
        <CardioExercise
          recordedExercise={item}
          updateExercise={(ex) =>
            updateSession((s) => s.withExercise(index, ex(s.recordedExercises[index] as RecordedCardioExercise)))
          }
          updateSet={updateCardioSet(index)}
          onStartTimer={startCardioTimer(index)}
          toStartNext={session.nextExercise === item}
          onEditExercise={
            editableSessionId ? () => push(getSessionExerciseEditorHref(editableSessionId, index)) : undefined
          }
          onRemoveExercise={() => updateSession((s) => s.withRemovedExercise(index))}
          isReadonly={isReadonly}
          showPreviousButton={!!isActiveWorkout}
          previousRecordedExercises={recentlyCompletedExercises(item.movementKey()) as RecordedCardioExercise[]}
          variant={variant}
          index={index + 1}
        />
      ))
      .exhaustive();
  };

  const bodyweight = props.showBodyweight ? (
    <HomeCard
      radius={theme.home.radius.row}
      pad={theme.space.base}
      style={{ marginHorizontal: theme.layout.screenPadding }}
    >
      <View
        testID="bodyweight-card"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            ...typeHelper(theme, 'body'),
            fontWeight: 'bold',
            color: theme.color.content.primary,
          }}
        >
          {t('exercise.bodyweight.label')}
        </Text>
        <WeightDisplay
          allowNull={true}
          weight={session.bodyweight}
          updateWeight={(bodyweight) => updateSession((s) => s.with({ bodyweight }))}
          increment={new BigNumber('0.1')}
          label={t('exercise.bodyweight.label')}
        />
      </View>
    </HomeCard>
  ) : null;

  const lastExercise = session.lastExercise;
  const lastRecordedSet = lastExercise instanceof RecordedWeightedExercise ? lastExercise?.lastRecordedSet : undefined;
  const nextExercise = session.nextExercise;

  // A weighted exercise rests per exercise; cardio rests per set, and may not rest at all.
  const restBetweenSets = match(lastExercise)
    .with(P.instanceOf(RecordedWeightedExercise), (exercise) => exercise.blueprint.restBetweenSets)
    .with(P.instanceOf(RecordedCardioExercise), (exercise) => exercise.lastCompletedSet?.blueprint.restBetweenSets)
    .otherwise(() => undefined);

  const showRestTimer = restTimersEnabled && isActiveWorkout && nextExercise && restBetweenSets && session.restTimer;
  // Only a weighted set can be failed - cardio has no rep count to fall short of.
  const lastSetFailed =
    lastRecordedSet?.set &&
    lastExercise instanceof RecordedWeightedExercise &&
    lastRecordedSet.set.repsCompleted <
      lastExercise.repsTargetForSet(lastExercise.potentialSets.indexOf(lastRecordedSet)).min;
  // Complete-state "Log Set": mirror tapping the check on the next unlogged set of the next exercise.
  const nextWeightedExercise = nextExercise instanceof RecordedWeightedExercise ? nextExercise : undefined;
  const nextWeightedIndex = nextWeightedExercise ? session.recordedExercises.indexOf(nextWeightedExercise) : -1;
  const nextSetPosition = nextWeightedExercise?.potentialSets.findIndex((potential) => !potential.set) ?? -1;
  const canLogNextSet =
    isActiveWorkout && nextWeightedExercise !== undefined && nextWeightedIndex >= 0 && nextSetPosition >= 0;
  const logNextSet = canLogNextSet
    ? () => {
        const now = OffsetDateTime.now();
        updateSession((s) => {
          const exercise = s.recordedExercises[nextWeightedIndex] as RecordedWeightedExercise;
          const setIndex = exercise.potentialSets.findIndex((potential) => !potential.set);
          if (setIndex < 0) {
            return s;
          }
          return withRestTimerAt(s.withExercise(nextWeightedIndex, exercise.withCycledRepCount(setIndex, now)), now);
        });
      }
    : undefined;
  const nextSetTitle =
    canLogNextSet && nextWeightedExercise !== undefined
      ? t('rest_timer.next_set.title', {
          number: nextSetPosition + 1,
          exercise: nextWeightedExercise.blueprint.name,
        })
      : undefined;
  const nextSetDetail = (() => {
    if (!canLogNextSet || nextWeightedExercise === undefined || nextSetPosition < 0) {
      return undefined;
    }
    const potential = nextWeightedExercise.potentialSets[nextSetPosition];
    if (potential === undefined) {
      return undefined;
    }
    const weightText =
      potential.weight.value.isZero() && nextWeightedExercise.blueprint.resistance === 'bodyweight'
        ? t('exercise.short_bodyweight.label')
        : `${localeFormatBigNumber(potential.weight.value.decimalPlaces(potential.weight.value.isInteger() ? 0 : 1))} ${shortFormatWeightUnit(potential.weight.unit)}`.trim();
    return `${weightText} × ${nextWeightedExercise.repsTargetForSet(nextSetPosition).max}`;
  })();
  const restTimer = showRestTimer ? (
    <RestTimer
      rest={restBetweenSets}
      startTime={session.restTimer.startedAt}
      pausedAt={session.restTimer.pausedAt}
      failed={!!lastSetFailed}
      onDismiss={dismissTimer}
      onTogglePause={toggleRestTimerPaused}
      onLogSet={logNextSet}
      nextSetTitle={nextSetTitle}
      nextSetDetail={nextSetDetail}
    />
  ) : undefined;

  const runningCardio = isActiveWorkout ? session.runningCardioSet : undefined;
  const cardioTimer = runningCardio ? (
    <CardioTimer
      set={runningCardio.set}
      onPersist={() =>
        updateCardioSet(runningCardio.exerciseIndex)(runningCardio.setIndex, (s) =>
          s.withTimerReanchored(OffsetDateTime.now()),
        )
      }
      onStop={() =>
        updateCardioSet(runningCardio.exerciseIndex)(runningCardio.setIndex, (s) =>
          s.withTimerStopped(OffsetDateTime.now()),
        )
      }
    />
  ) : undefined;

  const timer = cardioTimer ?? restTimer;

  if (isActiveWorkout) {
    return (
      <ActiveSessionView
        session={session}
        addExercise={addExercise}
        renderItem={renderItem('active')}
        notesComponent={notesComponent}
        bodyweight={bodyweight}
        timer={timer}
        showRestSlot={restTimersEnabled && !isReadonly}
        canFinish={sessionHasLoggedSet(session)}
        onFinishWorkout={props.onFinishWorkout ?? (() => {})}
        menu={<SessionMoreMenuComponent session={session} isActiveWorkout />}
      />
    );
  }

  // The timer rides above the action, so the action stays put whether or not a rest is running.
  const floatingBottomContainer = isReadonly ? null : (
    <PageActions
      accessory={timer}
      primaryExpanded={!timer}
      primary={{
        label: t('exercise.add.title'),
        icon: AddIcon,
        systemImage: 'plus',
        onPress: addExercise,
      }}
    />
  );

  const workoutSummary = (
    <Card
      mode="contained"
      onPress={isActiveWorkout ? props.openPostWorkoutSummary : undefined}
      style={{ margin: theme.layout.screenPadding }}
    >
      <Card.Content>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text variant="bodyMedium">
            <T keyName="workout.total_weight_lifted.label" />
          </Text>
          <WeightFormat fontWeight="bold" color="primary" weight={session.totalWeightLifted} decimalPlaces={0} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text variant="bodyMedium">
            <T keyName="workout.total_time.label" />
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.color.interactive.tint, fontWeight: 'bold' }}>
            {(session.duration && formatDuration(session.duration, 'hours-mins')) || '-'}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <FullHeightScrollView floatingChildren={floatingBottomContainer}>
      {props.header}
      {notesComponent}
      {emptyInfo}
      <ItemList items={session.recordedExercises} renderItem={renderItem('classic')} />
      {bodyweight}
      {workoutSummary}
    </FullHeightScrollView>
  );
}
