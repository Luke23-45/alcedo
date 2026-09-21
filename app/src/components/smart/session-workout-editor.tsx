import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAppSelectorWithArg } from '@/store';
import { selectSession, updateStoredSession } from '@/store/stored-sessions';
import { useTranslate } from '@tolgee/react';
import { Href, Stack, useRouter } from 'expo-router';
import { useContext, useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useOnDismiss } from '@/hooks/useOnDismiss';
import { HeaderHeightContext } from 'expo-router/react-navigation';

export function getSessionWorkoutEditorHref(sessionId: string): Href {
  return `/workout-editor?sessionId=${encodeURIComponent(sessionId)}` as Href;
}

export function SessionWorkoutEditor(props: { sessionId: string }) {
  const theme = useAppTheme();
  const { t } = useTranslate();
  const workout = useAppSelectorWithArg(selectSession, props.sessionId);
  const dispatch = useDispatch();
  const { dismiss } = useRouter();
  const headerHeight = useContext(HeaderHeightContext); // Intentionally don't use useHeaderHeight as it might not be in a stack
  const topInsetHeight = Platform.select({ ios: headerHeight }) ?? 0;

  const title = t('workout.edit.button');

  // Hold edits locally and only apply them to the session when the route is dismissed
  const [name, setName] = useState(workout?.blueprint.name ?? '');
  const draftRef = useRef<{ name?: string; notes?: string }>({});
  const updateBlueprint = (changes: { name?: string; notes?: string }) => {
    if (changes.name !== undefined) {
      setName(changes.name);
    }
    draftRef.current = { ...draftRef.current, ...changes };
  };

  useOnDismiss(() => {
    const changes = draftRef.current;
    if (changes.name === undefined && changes.notes === undefined) {
      return;
    }
    dispatch(
      updateStoredSession({
        sessionId: props.sessionId,
        update: (s) => s.with({ blueprint: s.blueprint.with(changes) }),
      }),
    );
  });

  const hasWorkout = !!workout;
  useEffect(() => {
    if (!hasWorkout) {
      dismiss();
    }
  }, [hasWorkout, dismiss]);

  return (
    <FullHeightScrollView
      avoidKeyboard
      scrollStyle={{ padding: theme.layout.screenPadding }}
      contentContainerStyle={{ insetBlockStart: topInsetHeight }}
    >
      <Stack.Screen options={{ title }} />
      {workout ? (
        <View style={{ gap: theme.space.sm }}>
          <TextInput
            label={t('workout.name.label')}
            testID="workout-name"
            style={{ marginBottom: theme.space.sm }}
            value={name}
            onChangeText={(name) => updateBlueprint({ name })}
          />
          <TextInput
            label={t('plan.notes.label')}
            testID="workout-notes"
            style={{ marginBottom: theme.space.sm }}
            defaultValue={workout.blueprint.notes}
            onChangeText={(notes) => updateBlueprint({ notes })}
            multiline
          />
        </View>
      ) : null}
    </FullHeightScrollView>
  );
}
