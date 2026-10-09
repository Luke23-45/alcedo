import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import type { ReactNode } from 'react';
import { HomeCard } from '../../../home/shared/home-card';
import { BrandButton } from '../brand-button/brand-button';
import {
  DisabledFinish,
  FinishLabel,
  FinishPressable,
  Hint,
  Section,
  TimerSlot,
} from './session-footer.styles';

/**
 * Session finish section: a plain in-flow section like bodyweight and notes
 * — nothing here is pinned. The live rest-timer slot sits above the finish
 * card, and only while a timer is running. The finish action lives in a
 * `HomeCard` with the exact bodyweight spec (radius 22, pad 16) so the two
 * read as siblings. The button stays dimmed with a hint until at least one
 * set is logged — an empty session can never be finished.
 */
export function SessionFooter({
  timer,
  canFinish,
  onFinish,
}: {
  /** The live `<RestTimer/>` / `<CardioTimer/>` node when a timer is running. */
  timer?: ReactNode;
  onFinish: () => void;
  canFinish: boolean;
}) {
  const theme = useAppTheme();
  const { t } = useTranslate();

  return (
    <Section>
      {timer && <TimerSlot>{timer}</TimerSlot>}
      <HomeCard radius={theme.home.radius.row} pad={theme.space.base}>
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
      </HomeCard>
    </Section>
  );
}
