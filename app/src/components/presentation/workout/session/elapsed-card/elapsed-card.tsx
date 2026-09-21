import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import { Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { HomeCard } from '../../../home/shared/home-card';
import { usePulse } from '../../use-pulse';
import { sessionPalette } from '../session-tokens';
import { formatElapsed } from '../use-elapsed-seconds';
import { CardInner, CardWrap, Label, LiveLabel, LivePill, TimerText } from './elapsed-card.styles';

/** Elapsed-time hero card with a pulsing LIVE chip. Ticks every second. */
export function ElapsedCard({ seconds }: { seconds: number }) {
  const { isDark } = useAppTheme();
  const { t } = useTranslate();
  const colors = sessionPalette(isDark).elapsed;
  const pulse = usePulse();

  return (
    <CardWrap>
      <HomeCard radius={28} pad={0} style={{ flex: 1 }}>
        <CardInner>
          <Label>{t('workout.session.elapsed.label')}</Label>
          <TimerText>{formatElapsed(seconds)}</TimerText>
          <LivePill>
            <Animated.View style={{ opacity: pulse }}>
              <Svg width={6} height={6} viewBox="-3 -3 6 6">
                <Circle cx={0} cy={0} r={3} fill={colors.liveDot} />
              </Svg>
            </Animated.View>
            <LiveLabel>{t('workout.session.live.label')}</LiveLabel>
          </LivePill>
        </CardInner>
      </HomeCard>
    </CardWrap>
  );
}
