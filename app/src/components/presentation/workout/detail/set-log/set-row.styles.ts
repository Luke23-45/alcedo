import styled, { css } from 'styled-components/native';
import { type } from '@/styles/theme';
import { SetType } from '@/models/session-models/recorded-weighted-exercise';
import { detailPalette } from '../detail-tokens';

export const RowContainer = styled.View<{ $isCurrent?: boolean }>`
  min-height: 56px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${({ theme }) => theme.space.sm}px;
  padding-vertical: ${({ theme }) => theme.space.xs}px;
  gap: ${({ theme }) => theme.space.xs}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme, $isCurrent }) =>
    $isCurrent ? (theme.isDark ? 'rgba(255,45,85,0.06)' : 'rgba(255,45,85,0.04)') : 'transparent'};
`;

export const NumberTile = styled.Pressable<{
  $state: 'done' | 'current' | 'upcoming';
  $type?: SetType;
}>`
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  align-items: center;
  justify-content: center;

  ${({ theme, $state, $type }) => {
    const pal = detailPalette(theme.isDark);
    if ($type === 'warmUp') {
      return css`
        background-color: ${pal.detail.setRow.warmUpTileBg};
      `;
    }
    switch ($state) {
      case 'done':
        return css`
          background-color: ${pal.card.setTileDoneBg};
        `;
      case 'current':
        return css`
          background-color: ${pal.card.setTileCurrentBg};
        `;
      default:
        return css`
          background-color: ${pal.card.setTileUpcomingBg};
        `;
    }
  }}
`;

export const NumberText = styled.Text<{
  $state: 'done' | 'current' | 'upcoming';
  $type?: SetType;
}>`
  ${({ theme }) => type(theme, 'subheadline')};
  font-weight: 700;

  ${({ theme, $state, $type }) => {
    const pal = detailPalette(theme.isDark);
    if ($type === 'warmUp') {
      return css`
        color: ${pal.detail.setRow.warmUpTileText};
      `;
    }
    switch ($state) {
      case 'done':
        return css`
          color: ${pal.card.setTileDoneText};
        `;
      case 'current':
        return css`
          color: ${pal.card.setTileCurrentText};
        `;
      default:
        return css`
          color: ${pal.card.setTileUpcomingText};
        `;
    }
  }}
`;

export const WarmUpLabel = styled.Text`
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: ${({ theme }) => detailPalette(theme.isDark).detail.setRow.warmUpBadge};
  text-transform: uppercase;
  margin-top: -2px;
`;

export const StepperGroup = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const StepperButton = styled.Pressable`
  min-width: 38px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => detailPalette(theme.isDark).detail.setRow.stepperBg};
`;

export const StepperButtonText = styled.Text`
  ${({ theme }) => type(theme, 'title3')};
  font-weight: 600;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const WeightPressable = styled.Pressable`
  min-height: 44px;
  padding-horizontal: ${({ theme }) => theme.space.xs}px;
  justify-content: center;
  align-items: center;
`;

export const WeightValue = styled.Text<{ $done?: boolean }>`
  ${({ theme }) => type(theme, 'metricM', { tabular: true })};
  font-size: 19px;
  line-height: 22px;
  color: ${({ theme, $done }) =>
    $done ? theme.color.content.primary : theme.color.content.secondary};
`;

export const RepsPressable = styled.Pressable`
  min-height: 44px;
  padding-horizontal: ${({ theme }) => theme.space.xs}px;
  justify-content: center;
  align-items: center;
`;

export const RepsValue = styled.Text<{ $done?: boolean }>`
  ${({ theme }) => type(theme, 'metricM', { tabular: true })};
  font-size: 19px;
  line-height: 22px;
  color: ${({ theme, $done }) =>
    $done ? theme.color.content.primary : theme.color.content.secondary};
`;

export const RepsTargetSub = styled.Text`
  font-size: 11px;
  line-height: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export const RpePill = styled.Pressable`
  min-height: 38px;
  padding-horizontal: ${({ theme }) => theme.space.sm}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${({ theme }) => detailPalette(theme.isDark).detail.setRow.rpePillBg};
  border-width: 1px;
  border-color: ${({ theme }) => detailPalette(theme.isDark).detail.setRow.rpePillBorder};
  align-items: center;
  justify-content: center;
  gap: 2px;
`;

export const RpePillText = styled.Text`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const EffortBarTrack = styled.View`
  width: 22px;
  height: 3px;
  border-radius: 1.5px;
  background-color: ${({ theme }) => detailPalette(theme.isDark).detail.setRow.effortBarTrack};
  overflow: hidden;
`;

export const EffortBarFill = styled.View<{ $percent: number }>`
  width: ${({ $percent }) => Math.min(Math.max($percent, 0), 1) * 100}%;
  height: 100%;
  border-radius: 1.5px;
  background-color: ${({ theme }) => detailPalette(theme.isDark).detail.setRow.effortBarFill};
`;

export const E1rmStack = styled.View`
  align-items: flex-end;
  justify-content: center;
  padding-horizontal: 4px;
`;

export const E1rmValue = styled.Text`
  ${({ theme }) => type(theme, 'caption1', { tabular: true })};
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const E1rmSub = styled.Text<{ $trend?: 'up' | 'down' | 'same' }>`
  font-size: 10px;
  font-weight: 600;
  color: ${({ theme, $trend }) => {
    const pal = detailPalette(theme.isDark);
    if ($trend === 'up') return pal.detail.vsLastTime.positive;
    if ($trend === 'down') return pal.detail.vsLastTime.negative;
    return pal.detail.vsLastTime.neutral;
  }};
`;

export const CheckPressable = styled.Pressable`
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
`;
