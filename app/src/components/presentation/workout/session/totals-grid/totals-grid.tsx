import { useState } from 'react';
import { View } from 'react-native';
import { useTranslate } from '@tolgee/react';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import type { SessionTotals } from '../session-stats';
import {
  GridRow,
  GridWrap,
  SetsTrack,
  TileContent,
  TileHeader,
  TileLabel,
  TileSubText,
  TileSuffix,
  TileValue,
  TileWrap,
  ValueRow,
} from './totals-grid.styles';

export interface TotalsGridProps {
  stats: SessionTotals;
  timeFormatted: string;
  timeSub?: string;
  dimmed?: boolean;
}

/**
 * 2×2 totals grid for the active session overview list:
 * TIME · SETS · VOLUME KG · REPS
 * Each tile has a label, tabular value, and an earning micro-detail line.
 */
export function TotalsGrid({ stats, timeFormatted, timeSub, dimmed }: TotalsGridProps) {
  const { t } = useTranslate();
  const dim = dimmed ?? false;
  const [setsTrackWidth, setSetsTrackWidth] = useState(0);

  const isSetsComplete = !dim && stats.setsTotal > 0 && stats.setsCompleted >= stats.setsTotal;
  const setsFillRatio =
    !dim && stats.setsTotal > 0 ? Math.min(1, Math.max(0, stats.setsCompleted / stats.setsTotal)) : 0;
  const setsFillWidth = setsTrackWidth * setsFillRatio;
  const setsGradientColors = isSetsComplete
    ? (['#7BE000', '#D6FF52'] as const)
    : (['#FF0A47', '#FF7A96'] as const);

  return (
    <GridWrap>
      {/* Row 1: TIME and SETS */}
      <GridRow>
        <TileWrap>
          <HomeCard elev="tile" radius={24} pad={16}>
            <TileContent>
              <TileHeader>
                <TileLabel $dimmed={dim}>
                  {t('workout.session.time.label', { defaultValue: 'TIME' }).toLocaleUpperCase()}
                </TileLabel>
              </TileHeader>
              <ValueRow>
                <TileValue $dimmed={dim}>{dim ? '0:00' : timeFormatted}</TileValue>
              </ValueRow>
              <TileSubText $dimmed={dim}>{dim ? '—' : (timeSub ?? '—')}</TileSubText>
            </TileContent>
          </HomeCard>
        </TileWrap>

        <TileWrap>
          <HomeCard elev="tile" radius={24} pad={16}>
            <TileContent>
              <TileHeader>
                <TileLabel $dimmed={dim}>
                  {t('workout.session.sets.label', { defaultValue: 'SETS' }).toLocaleUpperCase()}
                </TileLabel>
              </TileHeader>
              <ValueRow>
                <TileValue $dimmed={dim}>{dim ? '0' : String(stats.setsCompleted)}</TileValue>
                {!dim && stats.setsTotal > 0 && <TileSuffix $dimmed={dim}>/{stats.setsTotal}</TileSuffix>}
              </ValueRow>
              <SetsTrack onLayout={(e) => setSetsTrackWidth(e.nativeEvent.layout.width)}>
                {setsFillWidth > 0 && (
                  <LinearGradient
                    colors={setsGradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: 3, width: setsFillWidth, borderRadius: 1.5 }}
                  />
                )}
              </SetsTrack>
            </TileContent>
          </HomeCard>
        </TileWrap>
      </GridRow>

      {/* Row 2: VOLUME KG and REPS */}
      <GridRow>
        <TileWrap>
          <HomeCard elev="tile" radius={24} pad={16}>
            <TileContent>
              <TileHeader>
                <TileLabel $dimmed={dim}>
                  {t('workout.session.volume_kg.label', { defaultValue: 'VOLUME KG' }).toLocaleUpperCase()}
                </TileLabel>
              </TileHeader>
              <ValueRow>
                <TileValue $dimmed={dim}>{dim ? '0' : stats.volume}</TileValue>
              </ValueRow>
              <TileSubText $dimmed={dim} numberOfLines={1}>
                {dim ? '—' : (stats.bestSingleSet ? `best ${stats.bestSingleSet}` : '—')}
              </TileSubText>
            </TileContent>
          </HomeCard>
        </TileWrap>

        <TileWrap>
          <HomeCard elev="tile" radius={24} pad={16}>
            <TileContent>
              <TileHeader>
                <TileLabel $dimmed={dim}>
                  {t('workout.session.reps.label', { defaultValue: 'REPS' }).toLocaleUpperCase()}
                </TileLabel>
              </TileHeader>
              <ValueRow>
                <TileValue $dimmed={dim}>{dim ? '0' : stats.reps}</TileValue>
              </ValueRow>
              <TileSubText $dimmed={dim} numberOfLines={1}>
                {dim ? '—' : (stats.avgRepsPerSet ?? '—')}
              </TileSubText>
            </TileContent>
          </HomeCard>
        </TileWrap>
      </GridRow>
    </GridWrap>
  );
}
