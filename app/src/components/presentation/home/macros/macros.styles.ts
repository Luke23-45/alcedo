import styled from 'styled-components/native';
import { alpha } from '@/styles/theme';

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs}px;
`;

/** Three rings sharing the row (48pt reference). */
export const RingsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.space.sm}px;
`;

export const RingSlot = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const RingCenter = styled.View`
  position: absolute;
  align-items: center;
`;

/** 142×5 kcal bar. */
export const BarTrack = styled.View`
  width: 100%;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.09) : alpha('#787880', 0.16))};
  overflow: hidden;
  margin-top: ${({ theme }) => theme.space.md}px;
`;

export const BarFill = styled.View<{ $pct: number }>`
  width: ${({ $pct }) => $pct}%;
  height: 100%;
  border-radius: 2.5px;
`;
