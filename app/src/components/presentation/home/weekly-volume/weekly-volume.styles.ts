import styled from 'styled-components/native';
import { alpha } from '@/styles/theme';

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

/** 52×21 delta pill with a chevron. */
export const DeltaChip = styled.View<{ $color: string }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 52px;
  height: 21px;
  border-radius: 10.5px;
  background-color: ${({ $color }) => alpha($color, 0.15)};
`;

export const ChartWrap = styled.View`
  margin-top: ${({ theme }) => theme.space.sm}px;
`;

export const EmptyWrap = styled.View`
  padding-vertical: ${({ theme }) => theme.space.lg}px;
  align-items: center;
`;
