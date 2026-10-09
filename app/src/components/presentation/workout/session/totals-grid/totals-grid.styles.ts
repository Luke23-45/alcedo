import styled from 'styled-components/native';
import { type as typeHelper } from '@/styles/theme';
import { sessionPalette } from '../session-tokens';

export const GridWrap = styled.View`
  margin-horizontal: 16px;
  gap: 12px;
`;

export const GridRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

export const TileWrap = styled.View`
  flex: 1;
`;

export const TileContent = styled.View`
  gap: 2px;
  min-height: 64px;
  justify-content: space-between;
`;

export const TileHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TileLabel = styled.Text<{ $dimmed?: boolean }>`
  font-family: ${({ theme }) => typeHelper(theme, 'caption2').fontFamily};
  font-size: 9px;
  line-height: 12px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ theme, $dimmed }) => {
    const pal = sessionPalette(theme.isDark);
    return $dimmed ? pal.totals.dimSub : pal.totals.label;
  }};
`;

export const ValueRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  gap: 2px;
`;

export const TileValue = styled.Text<{ $dimmed?: boolean }>`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 22px;
  line-height: 26px;
  font-weight: 700;
  letter-spacing: -0.4px;
  font-variant: tabular-nums;
  color: ${({ theme, $dimmed }) => {
    const pal = sessionPalette(theme.isDark);
    return $dimmed ? pal.totals.dimValue : pal.totals.value;
  }};
`;

export const TileSuffix = styled.Text<{ $dimmed?: boolean }>`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 14px;
  line-height: 18px;
  font-weight: 600;
  font-variant: tabular-nums;
  color: ${({ theme, $dimmed }) => {
    const pal = sessionPalette(theme.isDark);
    return $dimmed ? pal.totals.dimSub : pal.totals.sub;
  }};
`;

export const TileSubText = styled.Text<{ $dimmed?: boolean }>`
  font-family: ${({ theme }) => typeHelper(theme, 'caption1').fontFamily};
  font-size: 11px;
  line-height: 14px;
  font-weight: 500;
  letter-spacing: -0.1px;
  color: ${({ theme, $dimmed }) => {
    const pal = sessionPalette(theme.isDark);
    return $dimmed ? pal.totals.dimSub : pal.totals.sub;
  }};
`;

export const SetsTrack = styled.View`
  height: 3px;
  border-radius: 1.5px;
  background-color: ${({ theme }) => sessionPalette(theme.isDark).totals.ruleTrack};
  overflow: hidden;
  width: 100%;
  margin-top: 4px;
`;
