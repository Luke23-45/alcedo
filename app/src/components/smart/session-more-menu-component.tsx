import { Session } from '@/models/session-models';
import { useTranslate } from '@tolgee/react';
import { useEffect, useRef, useState } from 'react';
import { getSessionWorkoutEditorHref } from '@/components/smart/session-workout-editor';
import { Tooltip, TooltipHandle } from 'react-native-paper';
import PageMenu from '@/components/presentation/foundation/page-menu';
import Menu, { MenuItem } from '@/components/presentation/foundation/menu';
import { Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Jiggler } from '@/components/presentation/foundation/jiggler';
import IconButton from '@/components/presentation/foundation/icon-button';
import { useAddExercise } from '@/hooks/useAddExercise';
import { DotsTrigger } from '@/components/presentation/workout/session/dots-trigger/dots-trigger';

export default function SessionMoreMenuComponent(props: {
  session: Session;
  isActiveWorkout?: boolean;
  /** Unused in the active session (finishing lives in the sticky footer). Required elsewhere. */
  save?: () => void;
  /** Actions the screen adds below the ones every session has. */
  additionalItems?: MenuItem[];
}) {
  const { save, session, isActiveWorkout, additionalItems } = props;

  if (isActiveWorkout) {
    return <ActiveSessionMenu session={session} additionalItems={additionalItems} />;
  }

  return <ClassicSessionMenu session={session} save={save ?? (() => {})} additionalItems={additionalItems} />;
}

/**
 * The active session's `⋯` menu, rendered in the nav bar: Add exercise and
 * Edit workout. Finishing moved to the sticky footer, so it is not here.
 */
function ActiveSessionMenu({ session, additionalItems }: { session: Session; additionalItems?: MenuItem[] }) {
  const { push } = useRouter();
  const { t } = useTranslate();
  const addExercise = useAddExercise(session.id);

  return (
    <Menu
      testID="session-more"
      trigger={(open) => <DotsTrigger onPress={open} testID="session-more-menu" />}
      items={[
        {
          label: t('exercise.add.title'),
          icon: 'add',
          systemImage: 'plus',
          onPress: addExercise,
        },
        {
          label: t('workout.edit.button'),
          icon: 'edit',
          systemImage: 'pencil',
          onPress: () => push(getSessionWorkoutEditorHref(session.id)),
        },
        ...(additionalItems ?? []),
      ]}
    />
  );
}

function ClassicSessionMenu(props: { session: Session; save: () => void; additionalItems?: MenuItem[] }) {
  const { save, session, additionalItems } = props;
  const { push } = useRouter();
  const { t } = useTranslate();

  const finishText = t('generic.save.button');

  const handleEditWorkout = () => push(getSessionWorkoutEditorHref(session.id));

  return (
    <PageMenu
      testID="session-more"
      actions={Platform.select({
        // The toolbar reads its children natively, so this has to stay a literal toolbar button
        // rather than a component that renders one.
        ios: (
          <Stack.Toolbar.Button onPress={save}>
            <Stack.Toolbar.Label>{finishText}</Stack.Toolbar.Label>
          </Stack.Toolbar.Button>
        ),
        android: <AndroidFinishButton session={session} save={save} />,
      })}
      items={[
        {
          label: t('workout.edit.button'),
          icon: 'edit',
          systemImage: 'pencil',
          onPress: handleEditWorkout,
        },
        ...(additionalItems ?? []),
      ]}
    />
  );
}

function AndroidFinishButton({ session, save }: { session: Session; save: () => void }) {
  const { t } = useTranslate();

  const [jiggleFinishButton, setJiggleFinishButton] = useState(false);
  const isComplete = session.isComplete;
  const hasExercises = !!session.recordedExercises.length;
  const tooltipRef = useRef<TooltipHandle>(null);

  useEffect(() => {
    const shouldJiggle = hasExercises && isComplete === true;
    setJiggleFinishButton(shouldJiggle);
    if (shouldJiggle) {
      tooltipRef.current?.show();
      const timeout = setTimeout(() => {
        setJiggleFinishButton(false);
        tooltipRef.current?.hide();
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [isComplete, hasExercises]);

  return (
    <Jiggler jiggling={jiggleFinishButton} jiggleSpeed={140}>
      <Tooltip ref={tooltipRef} title={t('workout.finish.action.tooltip')}>
        <IconButton testID="finish-session-button" icon={'assignmentTurnedIn'} onPress={save} />
      </Tooltip>
    </Jiggler>
  );
}
