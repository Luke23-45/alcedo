import { GesturePressableProps } from '@/components/presentation/foundation/pressable-props';
import { AppIconSource } from '@/components/presentation/foundation/ms-icon-source';
import { usePressScale } from '@/hooks/usePressScale';
import { isNotNullOrUndefined } from '@/utils/null';
import * as Haptics from 'expo-haptics';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, { runOnJS } from 'react-native-reanimated';
// oxlint-disable-next-line no-restricted-imports
import { Button as NativeButton, ButtonProps as PaperButtonProps } from 'react-native-paper';

export type ButtonProps = {
  icon?: AppIconSource;
} & Omit<PaperButtonProps, 'icon'>;
export default function Button({ onPress, onLongPress, disabled, ...rest }: GesturePressableProps<ButtonProps>) {
  // Apple press physics: 0.97 scale on finger-down, spring back on release —
  // UI thread, zero JS round-trip. Haptic confirms the tap.
  const { pressIn, pressOut, animatedStyle } = usePressScale(disabled);

  const handlePress = () => {
    if (disabled) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };
  const handleLongPress = () => {
    if (disabled) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress?.();
  };

  const tap = Gesture.Tap()
    .onBegin(pressIn)
    .onFinalize(pressOut)
    .onStart(() => runOnJS(handlePress)());
  const longPress = onLongPress
    ? Gesture.LongPress()
        .onBegin(pressIn)
        .onFinalize(pressOut)
        .onStart(() => runOnJS(handleLongPress)())
    : undefined;
  const gesture = Gesture.Race(...[tap, longPress].filter(isNotNullOrUndefined));
  return (
    <GestureDetector gesture={gesture}>
      <Reanimated.View style={animatedStyle}>
        <NativeButton
          disabled={disabled}
          onPress={onPress ? () => {} : undefined!}
          onLongPress={onLongPress || onPress ? () => {} : undefined!}
          {...rest}
        />
      </Reanimated.View>
    </GestureDetector>
  );
}
