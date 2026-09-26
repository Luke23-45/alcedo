import { GesturePressableProps } from '@/components/presentation/foundation/pressable-props';
import { AppIconSource } from '@/components/presentation/foundation/ms-icon-source';
import { usePressScale } from '@/hooks/usePressScale';
import { isNotNullOrUndefined } from '@/utils/null';
import * as Haptics from 'expo-haptics';
import { I18nManager } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, { runOnJS } from 'react-native-reanimated';
// oxlint-disable-next-line no-restricted-imports
import { IconButton as NativeIconButton, IconButtonProps } from 'react-native-paper';

type ICProps = {
  icon: AppIconSource;
} & Omit<IconButtonProps, 'icon'>;

export default function IconButton({
  onPress,
  onLongPress,
  disabled,
  mirrored,
  style,
  ...rest
}: GesturePressableProps<ICProps> & { mirrored?: boolean }) {
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
        <NativeIconButton
          disabled={disabled}
          onPress={onPress ? () => {} : undefined!}
          onLongPress={onLongPress || onPress ? () => {} : undefined!}
          style={[style, mirrored ? (I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : {}) : {}]}
          {...rest}
        />
      </Reanimated.View>
    </GestureDetector>
  );
}
