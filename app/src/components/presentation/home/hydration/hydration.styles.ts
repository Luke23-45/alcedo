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

/** 8 droplets, 13×26, 5.4pt pitch. */
export const DropsRow = styled.View`
  flex-direction: row;
  gap: 5.4px;
  margin-top: ${({ theme }) => theme.space.sm}px;
`;

export const Drop = styled(HomeGradient).attrs<{ $filled: boolean; $emptyColor: string }>(() => ({
  variant: 'water' as const,
}))<{ $filled: boolean; $emptyColor: string }>`
  width: 13px;
  height: 26px;
  border-radius: 6.5px;
  overflow: hidden;
  ${({ $filled, $emptyColor }) => (!$filled ? `background-color: ${alpha($emptyColor, 0.08)};` : '')}
`;

/** + Add 250 ml pill: 104×28, cyan wash. */
export const AddPill = styled.View`
  width: 104px;
  height: 28px;
  border-radius: 14px;
  background-color: ${alpha('#00D9E9', 0.15)};
  border-width: 0.8px;
  border-color: ${alpha('#00D9E9', 0.28)};
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.space.sm}px;
`;
