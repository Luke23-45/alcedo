import styled from 'styled-components/native';
import { alpha } from '@/styles/theme';
import { HomeGradient } from '../shared/home-gradient';

export const CardHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

/**
 * 170pt content budget: 212pt card − 2pt edge − 40pt hero padding.
 * A minimum, not a lock — space-between distributes header / rings / footer,
 * and the card grows instead of clipping at large text or long locales.
 */
export const CardContent = styled.View`
  min-height: 170px;
  justify-content: space-between;
`;

/** Streak pill: 46×22, amber wash with a hairline edge. */
export const LabelGroup = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm}px;
`;

export const StreakChip = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs}px;
  height: 22px;
  padding-horizontal: ${({ theme }) => theme.space.sm}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${alpha('#FF9F0A', 0.15)};
  border-width: 0.8px;
  border-color: ${alpha('#FF9F0A', 0.28)};
`;

export const ContentRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
`;

export const MetricsColumn = styled.View`
  flex: 1;
  margin-left: 23px;
`;

/** One ring row: label/value line plus the 6pt progress bar. Rows sit on a 38pt pitch. */
export const MetricRow = styled.View`
  margin-bottom: 10px;
`;

export const MetricLabelRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  min-height: 15px;
`;

/** Value + goal pair pinned right; never wraps under the label. */
export const MetricValueRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  flex-shrink: 0;
  margin-left: ${({ theme }) => theme.space.sm}px;
`;

export const BarTrack = styled.View`
  height: 6px;
  margin-top: 8px;
  border-radius: 3px;
  overflow: hidden;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.09) : alpha('#787880', 0.16))};
`;

export const BarFill = styled(HomeGradient).attrs<{ $from: string; $to: string }>(({ $from, $to }) => ({
  colors: [$from, $to] as [string, string],
}))<{ $from: string; $to: string; $pct: number }>`
  width: ${({ $pct }) => $pct * 100}%;
  height: 100%;
  border-radius: 3px;
`;

export const PaceRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm}px;
`;
