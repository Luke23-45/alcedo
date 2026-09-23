import { sessionTotalReps, sessionTotalSets, sessionVolumeKg } from '@/components/presentation/history/history-stats';
import { Session } from '@/models/session-models';
import { localeFormatBigNumber } from '@/utils/locale-bignumber';
import { useTranslate } from '@tolgee/react';
import BigNumber from 'bignumber.js';
import { useEffect, Fragment } from 'react';
import { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useAppReducedMotion } from '@/hooks/useMotionSettings';
import { formatCompactDuration } from '../session-time-utils';
import * as S from './live-totals-strip.styles';

/**
 * Live totals strip (spec 361×68 rx24): volume / sets / reps / duration,
 * recomputed from the current draft session on every render — every edit
 * re-renders from the store, so the numbers are always current (Law III).
 * The pulsing green dot marks this as a recalculating surface.
 */
export function LiveTotalsStrip({ session }: { session: Session }) {
  const { t } = useTranslate();
  const reduceMotion = useAppReducedMotion();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      pulse.value = 1;
      return;
    }
    pulse.value = withRepeat(withTiming(0.3, { duration: 1000 }), -1, true);
  }, [pulse, reduceMotion]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  const volume = localeFormatBigNumber(new BigNumber(Math.round(sessionVolumeKg(session))));
  const sets = `${sessionTotalSets(session)}`;
  const reps = `${sessionTotalReps(session)}`;
  const duration = formatCompactDuration(session.duration);

  const cells: Array<{ value: string; label: string; testID: string }> = [
    {
      value: volume,
      label: t('history.edit.totals.volume.label', 'Volume kg').toLocaleUpperCase(),
      testID: 'live-total-volume',
    },
    {
      value: sets,
      label: t('history.edit.totals.sets.label', 'Sets').toLocaleUpperCase(),
      testID: 'live-total-sets',
    },
    {
      value: reps,
      label: t('history.edit.totals.reps.label', 'Reps').toLocaleUpperCase(),
      testID: 'live-total-reps',
    },
    {
      value: duration,
      label: t('history.edit.totals.duration.label', 'Duration').toLocaleUpperCase(),
      testID: 'live-total-duration',
    },
  ];

  return (
    <S.StripOuter $radius={24} style={{ borderCurve: 'continuous' }}>
      <S.StripBody style={{ borderCurve: 'continuous' }}>
        {cells.map((cell, index) => (
          <Fragment key={cell.testID}>
            <S.Cell>
              <S.CellValue testID={cell.testID} style={{ fontVariant: ['tabular-nums'] }}>
                {cell.value}
              </S.CellValue>
              <S.CellLabel>{cell.label}</S.CellLabel>
            </S.Cell>
            {index < cells.length - 1 && <S.Divider />}
          </Fragment>
        ))}
        <S.SyncDotSlot style={dotStyle}>
          <S.SyncDot />
        </S.SyncDotSlot>
      </S.StripBody>
    </S.StripOuter>
  );
}
