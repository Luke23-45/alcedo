import styled from 'styled-components/native';

/** Tight 18/20/11 padding — the reference card is 240pt, not the hero 20pt. */
export const CardInner = styled.View`
  padding-top: 18px;
  padding-horizontal: 20px;
  padding-bottom: 11px;
`;

export const TitleRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

export const WindowPill = styled.View<{ $bg: string }>`
  min-width: 76px;
  height: 21px;
  padding-horizontal: 10px;
  border-radius: 10.5px;
  background-color: ${({ $bg }) => $bg};
  align-items: center;
  justify-content: center;
`;

export const GridWrap = styled.View`
  flex-direction: row;
  margin-top: 12px;
`;

export const DayLabels = styled.View`
  width: 30px;
`;

export const DaySlot = styled.View`
  height: 22px;
  justify-content: center;
`;

export const WeeksRow = styled.View`
  flex-direction: row;
  gap: 5px;
`;

export const WeekColumn = styled.View`
  gap: 5px;
`;

export const Cell = styled.View<{
  $size: number;
  $radius: number;
  $bg: string;
}>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: ${({ $radius }) => $radius}px;
  background-color: ${({ $bg }) => $bg};
`;

export const TodayRing = styled.View<{
  $left: number;
  $top: number;
  $dark: boolean;
}>`
  position: absolute;
  left: ${({ $left }) => $left}px;
  top: ${({ $top }) => $top}px;
  width: 18.8px;
  height: 18.8px;
  border-radius: 5.9px;
  border-width: 1.8px;
  border-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.55)')};
`;

export const LegendRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 2px;
`;

export const LegendSwatches = styled.View`
  flex-direction: row;
  gap: 4px;
  margin-left: auto;
  margin-right: 8px;
`;

/** Session-based note under the legend swatches, same micro-label typography. */
export const LegendNote = styled.View`
  margin-top: 8px;
  align-items: center;
`;
