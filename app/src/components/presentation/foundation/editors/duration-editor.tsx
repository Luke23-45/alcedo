import { useAppTheme } from '@/hooks/useAppTheme';
import { type as typeHelper } from '@/styles/theme';
import {
  getDurationComponents,
  updateDurationHours,
  updateDurationMinutes,
  updateDurationSeconds,
} from '@/utils/duration-utils';
import { Duration } from '@js-joda/core';
import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';

interface DurationEditorProps {
  label?: string;
  duration: Duration;
  showHours?: boolean;
  onDurationUpdated: (rest: Duration) => void;
  readonly?: boolean;
}

export default function DurationEditor(props: DurationEditorProps) {
  const theme = useAppTheme();
  const { duration, onDurationUpdated, readonly } = props;

  const initial = getDurationComponents(duration);
  const [hours, setHours] = useState(initial.hours.toString());
  const [minutes, setMinutes] = useState(initial.minutes.toString());
  const [seconds, setSeconds] = useState(initial.seconds.toString());

  const updateHours = (text: string) => {
    setHours(text);
    const value = Number.parseInt(text);
    if (!isNaN(value)) {
      onDurationUpdated(updateDurationHours(duration, value));
    }
  };
  const updateMinutes = (text: string) => {
    setMinutes(text);
    const value = Number.parseInt(text);
    if (!isNaN(value)) {
      onDurationUpdated(updateDurationMinutes(duration, value));
    }
  };
  const updateSeconds = (text: string) => {
    setSeconds(text);
    const value = Number.parseInt(text);
    if (!isNaN(value)) {
      onDurationUpdated(updateDurationSeconds(duration, value));
    }
  };

  const resetValues = useCallback(() => {
    const components = getDurationComponents(duration);
    setHours(components.hours.toString());
    setMinutes(components.minutes.toString());
    setSeconds(components.seconds.toString());
  }, [duration]);
  useEffect(() => {
    resetValues();
  }, [readonly, resetValues]);

  return (
    <>
      {props.label && (
        <Text
          style={{
            ...(typeHelper(theme, 'callout') as any),
            color: theme.color.content.primary,
            textAlign: 'center',
          }}
        >
          {props.label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: theme.space.sm,
        }}
      >
        {props.showHours ? (
          <>
            <TextInput
              mode="outlined"
              testID="duration-editor-hours"
              inputMode="numeric"
              readOnly={readonly}
              submitBehavior="blurAndSubmit"
              returnKeyType="done"
              style={{ width: 96, textAlign: 'center' }}
              value={hours}
              onChangeText={updateHours}
              onBlur={resetValues}
              right={<TextInput.Affix text="h" />}
            />
            <Text
              style={{
                alignSelf: 'center',
                ...(typeHelper(theme, 'callout') as any),
                color: theme.color.content.primary,
              }}
            >
              :
            </Text>
          </>
        ) : undefined}
        <TextInput
          mode="outlined"
          testID="duration-editor-minutes"
          inputMode="numeric"
          submitBehavior="blurAndSubmit"
          returnKeyType="done"
          style={{ width: 96, textAlign: 'center' }}
          value={minutes}
          readOnly={readonly}
          onChangeText={updateMinutes}
          onBlur={resetValues}
          right={<TextInput.Affix text="m" />}
        />
        <Text
          style={{
            alignSelf: 'center',
            ...(typeHelper(theme, 'callout') as any),
            color: theme.color.content.primary,
          }}
        >
          :
        </Text>
        <TextInput
          mode="outlined"
          testID="duration-editor-seconds"
          inputMode="numeric"
          submitBehavior="blurAndSubmit"
          returnKeyType="done"
          style={{ width: 96, textAlign: 'center' }}
          value={seconds}
          readOnly={readonly}
          onChangeText={updateSeconds}
          onBlur={resetValues}
          right={<TextInput.Affix text="s" />}
        />
      </View>
    </>
  );
}
