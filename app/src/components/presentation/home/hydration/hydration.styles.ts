import styled from 'styled-components/native';
import { alpha } from '@/styles/theme';
import { HomeGradient } from '../shared/home-gradient';

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs}px;
`;

/** Baseline-aligned value row: 24pt value, 12pt L, 10.5pt goal. */
export const ValueRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  margin-top: ${({ theme }) => theme.space.xs}px;
`;

/** 8 droplets sharing the row (13×26 reference), 6pt pitch. */
export const DropsRow = styled.View`
  flex-direction: row;
  gap: 6px;
  margin-top: ${({ theme }) => theme.space.sm}px;
`;

export const Drop = styled(HomeGradient).attrs<{ $filled: boolean; $emptyColor: string }>(
  ({ $filled, $emptyColor }) =>
    $filled
      ? { variant: 'water' as const }
      : {
          variant: 'tile' as const,
          colors: [alpha($emptyColor, 0.08), alpha($emptyColor, 0.08)] as [string, string],
        },
)<{ $filled: boolean; $emptyColor: string }>`
  flex: 1;
  height: 26px;
  border-radius: 6.5px;
  overflow: hidden;
`;

/** + Add 250 ml pill: 104×28 visual, cyan wash, hitSlop to 44. */
export const AddPill = styled.Pressable`
  width: 104px;
  min-height: 28px;
  padding-vertical: 7px;
  border-radius: 14px;
  background-color: ${alpha('#00D9E9', 0.15)};
  border-width: 0.8px;
  border-color: ${alpha('#00D9E9', 0.28)};
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.space.sm}px;
`;
