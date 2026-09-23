import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { HomeScreenBackground } from '@/components/presentation/home/shared/home-auras';
import { ExerciseEditorScreen } from '@/components/presentation/exercise-editor/exercise-editor-screen/exercise-editor-screen';
import { blueprintsEqual, kindOf } from '@/components/presentation/exercise-editor/exercise-editor-logic';
import { ExerciseBlueprint } from '@/models/blueprint-models';
import { exerciseEditorDismissUpdate } from './dismiss-update';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import { selectExercises, selectSession, updateStoredSession } from '@/store/stored-sessions';
import { Href, Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useOnDismiss } from '@/hooks/useOnDismiss';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import { useAppTheme } from '@/hooks/useAppTheme';
import * as S from './session-exercise-editor.styles';

export function getSessionExerciseEditorHref(sessionId: string, index: number, opts?: { isNew?: boolean }): Href {
  return `/exercise-editor?sessionId=${encodeURIComponent(sessionId)}&index=${index}${opts?.isNew ? '&isNew=1' : ''}` as Href;
}

type AuraMode = 'add' | 'weighted' | 'cardio';

const AURA_COLORS: Record<AuraMode, string> = {
  add: '#30D158',
  weighted: '#FF6A3D',
  cardio: '#00D9E9',
};

function ScreenAura({ mode }: { mode: AuraMode }) {
  const { isDark: dark } = useAppTheme();
  const color = AURA_COLORS[mode];
  const opacity = dark ? (mode === 'add' ? 0.1 : mode === 'weighted' ? 0.14 : 0.12) : 0.06;
  return (
    <S.AuraWrap pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 393 852" preserveAspectRatio="xMidYMin slice">
        <Defs>
          <RadialGradient id="exerciseEditorAura" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={color} stopOpacity={opacity} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={237} cy={150} rx={280} ry={280} fill="url(#exerciseEditorAura)" />
      </Svg>
    </S.AuraWrap>
  );
}

export function SessionExerciseEditor(props: { sessionId: string; index: number; isNew?: boolean }) {
  const exerciseIndex = props.index;
  const isNew = props.isNew;
  const useImperialUnits = useAppSelector((x) => x.settings.useImperialUnits);
  const restTimersEnabled = useAppSelector((x) => x.settings.restTimersEnabled);
  const session = useAppSelectorWithArg(selectSession, props.sessionId);
  const catalog = useAppSelector(selectExercises);
  const dispatch = useDispatch();
  const { dismiss } = useRouter();

  const exercise = session?.recordedExercises[exerciseIndex]?.blueprint;

  // The draft is held locally and committed to the session when the route is dismissed.
  const [draft, setDraft] = useState<ExerciseBlueprint | undefined>(undefined);
  const draftRef = useRef<ExerciseBlueprint | undefined>(undefined);
  const updateDraft = (updated: ExerciseBlueprint) => {
    draftRef.current = updated;
    setDraft(updated);
  };

  useOnDismiss(() => {
    const update = exerciseEditorDismissUpdate(exerciseIndex, draftRef.current, useImperialUnits);
    if (update) {
      dispatch(
        updateStoredSession({
          sessionId: props.sessionId,
          update,
        }),
      );
    }
  });

  const hasExercise = !!exercise;
  useEffect(() => {
    if (!hasExercise) {
      dismiss();
    }
  }, [hasExercise, dismiss]);

  const current = draft ?? exercise;
  const dirty = draft !== undefined && !blueprintsEqual(draft, exercise);
  const auraMode: AuraMode = isNew ? 'add' : current ? kindOf(current) : 'weighted';
  const nextExerciseName = session?.recordedExercises[exerciseIndex + 1]?.blueprint.name;

  return (
    <FullHeightScrollView
      safeAreaEdges={{
        left: 'additive',
        right: 'additive',
        top: 'additive',
        bottom: 'additive',
      }}
      avoidKeyboard
      screenBackground={
        <>
          <HomeScreenBackground />
          <ScreenAura mode={auraMode} />
        </>
      }
    >
      <Stack.Screen options={{ headerShown: false }} />
      {current ? (
        <ExerciseEditorScreen
          isNew={!!isNew}
          exercise={current}
          onExerciseChange={updateDraft}
          dirty={dirty}
          doneDisabled={!!isNew && current.name.trim() === ''}
          onDone={() => dismiss()}
          onBack={() => dismiss()}
          restTimersEnabled={restTimersEnabled}
          useImperialUnits={useImperialUnits}
          bodyweight={session?.bodyweight}
          nextExerciseName={nextExerciseName}
          catalog={catalog}
          weightSuffix={useImperialUnits ? 'lb' : 'kg'}
        />
      ) : null}
    </FullHeightScrollView>
  );
}
