import { useAppTheme } from '@/hooks/useAppTheme';
import { useEffect } from 'react';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import * as S from './typing-dots.styles';

/**
 * The three-dot "the coach is writing" indicator. Each dot rides the same
 * looping wave with a phase offset, so they pulse left to right. Under
 * reduced motion the dots sit still at full opacity.
 */
export function TypingDots({ label = 'Loading' }: { label?: string }) {
  const theme = useAppTheme();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    progress.value = withRepeat(withTiming(1, { duration: 1200 }), -1);
  }, [progress, reduceMotion]);

  const color = theme.color.content.secondary;
  return (
    <S.DotsRow accessibilityRole="progressbar" accessibilityLabel={label}>
      <Dot phase={0} progress={progress} color={color} still={!!reduceMotion} />
      <Dot phase={1 / 3} progress={progress} color={color} still={!!reduceMotion} />
      <Dot phase={2 / 3} progress={progress} color={color} still={!!reduceMotion} />
    </S.DotsRow>
  );
}

function Dot({
  phase,
  progress,
  color,
  still,
}: {
  phase: number;
  progress: SharedValue<number>;
  color: string;
  still: boolean;
}) {
  const style = useAnimatedStyle(() => {
    if (still) {
      return { opacity: 0.9 };
    }
    const p = (progress.value + phase) % 1;
    const wave = 0.5 - 0.5 * Math.cos(p * Math.PI * 2);
    return { opacity: 0.35 + 0.65 * wave };
  });
  return <Animated.View style={[{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }, style]} />;
}
