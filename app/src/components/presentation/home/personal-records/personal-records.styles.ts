import styled from 'styled-components/native';
import { alpha } from '@/styles/theme';
import { HomeGradient } from '../shared/home-gradient';

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

/** 76×21 "THIS MONTH" chip, neutral wash per mode. */
export const MonthChip = styled.View`
  width: 76px;
  height: 21px;
  border-radius: 10.5px;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.07) : alpha('#787880', 0.12))};
  align-items: center;
  justify-content: center;
`;

/** Three tiles (99pt reference), 12pt gaps. Flex shares the row on narrow screens. */
export const TilesRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: ${({ theme }) => theme.space.md}px;
`;

export const Tile = styled(HomeGradient).attrs({ variant: 'tile' as const })`
  flex: 1;
  min-width: 0px;
  min-height: 76px;
  border-radius: 20px;
  padding: ${({ theme }) => theme.space.md}px;
  overflow: hidden;
`;

/**
 * Amber inner highlight for NEW records only. The card edge carries the
 * default stroke, so non-highlighted tiles render no second border.
 */
export const TileInner = styled.View`
  border-width: 0.8px;
  border-radius: 19px;
  border-color: ${alpha('#FF9F0A', 0.22)};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

/** 38×15 NEW chip, amber wash. */
export const NewChip = styled.View`
  width: 38px;
  height: 15px;
  border-radius: 7.5px;
  background-color: ${alpha('#FF9F0A', 0.18)};
  align-items: center;
  justify-content: center;
  margin-top: 4px;
`;

export const EmptyBox = styled.View`
  padding-horizontal: ${({ theme }) => theme.space.base}px;
  padding-vertical: ${({ theme }) => theme.space.md}px;
`;
