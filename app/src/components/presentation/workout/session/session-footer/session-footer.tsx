import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import type { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { HomeCard } from '../../../home/shared/home-card';
import { sessionPalette } from '../session-tokens';
import { BrandButton } from '../brand-button/brand-button';
import {
  BottomFade,
  DisabledFinish,
  FinishLabel,
  FinishPressable,
  FooterContent,
  FooterGradient,
  Hairline,
  Hint,
  IdleCardInner,
  IdleLabel,
  IdleSub,
  IdleTexts,
  RestSlot,
  SkipPill,
  SkipText,
} from './session-footer.styles';

/** Idle rest-timer slot: the ring, REST TIMER copy, and a dimmed Skip. */
function IdleRestCard() {
  const { t } = useTranslate();
  const { isDark } = useAppTheme();
  const c = sessionPalette(isDark).footer;

  return (
    <HomeCard radius={26} pad={0} style={{ height: 88 }}>
      <IdleCardInner>
        <Svg width={60} height={60} viewBox="0 0 60 60">
          <Circle cx={30} cy={30} r={26} stroke={c.ringTrack} strokeWidth={7} fill="none" />
          <SvgText
            x={30}
            y={30}
            textAnchor="middle"
            alignmentBaseline="central"
            fontSize={12}
            fontWeight="700"
            fill={c.ringDash}
          >
            —
          </SvgText>
        </Svg>
        <IdleTexts>
          <IdleLabel>{t('workout.session.rest_timer.label')}</IdleLabel>
          <IdleSub>{t('workout.session.rest_timer.idle.body')}</IdleSub>
        </IdleTexts>
        <SkipPill>
          <SkipText>{t('rest_timer.skip')}</SkipText>
        </SkipPill>
      </IdleCardInner>
    </HomeCard>
  );
}

/**
 * Sticky session footer: the live rest-timer slot (or its idle card) above
 * the Finish Workout button. The button stays dimmed with a hint until at
 * least one set is logged — an empty session can never be finished.
 */
export function SessionFooter({
  timer,
  showRestSlot,
  canFinish,
  onFinish,
}: {
  /** The live `<RestTimer/>` / `<CardioTimer/>` node when a timer is running. */
  timer?: ReactNode;
  /** Whether the rest-timer slot (live or idle) is shown at all. */
  showRestSlot: boolean;
  onFinish: () => void;
  canFinish: boolean;
}) {
  const { isDark } = useAppTheme();
  const { t } = useTranslate();
  const insets = useSafeAreaInsets();
  const c = sessionPalette(isDark);

  return (
    <FooterGradient
      colors={[c.footer.gradientFrom, c.footer.gradientTo]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ marginBottom: -insets.bottom, paddingBottom: insets.bottom }}
    >
      <BottomFade pointerEvents="none" />
      <Hairline />
      <FooterContent>
        {(timer || showRestSlot) && <RestSlot>{timer ?? <IdleRestCard />}</RestSlot>}
        {canFinish ? (
          <BrandButton
            label={t('workout.session.finish_workout.button')}
            onPress={onFinish}
            height={54}
            radius={27}
            fontSize={16}
            letterSpacing={-0.3}
            testID="session-finish-button"
          />
        ) : (
          <FinishPressable
            disabled
            accessibilityRole="button"
            accessibilityLabel={t('workout.session.finish_workout.button')}
            accessibilityState={{ disabled: true }}
            testID="session-finish-button"
          >
            <DisabledFinish>
              <FinishLabel $enabled={false}>{t('workout.session.finish_workout.button')}</FinishLabel>
            </DisabledFinish>
          </FinishPressable>
        )}
        {!canFinish && <Hint>{t('workout.session.finish_disabled.hint')}</Hint>}
      </FooterContent>
    </FooterGradient>
  );
}
