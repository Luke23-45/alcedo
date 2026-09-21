import styled from 'styled-components/native';

/** Tight 16/20/12 padding — the reference card is 400pt, not the hero 20pt. */
export const CardInner = styled.View`
  padding-top: 16px;
  padding-horizontal: 20px;
  padding-bottom: 12px;
`;

export const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
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

export const LegendRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

export const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 18px;
`;

export const LegendSwatch = styled.View<{ $color: string; $height: number }>`
  width: 14px;
  height: ${({ $height }) => $height}px;
  border-radius: 3px;
  background-color: ${({ $color }) => $color};
`;

export const MuscleRow = styled.View`
  margin-top: 16px;
`;

export const NameRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  height: 16px;
`;

export const Track = styled.View<{ $bg: string }>`
  height: 6px;
  border-radius: 3px;
  background-color: ${({ $bg }) => $bg};
  margin-top: 6px;
  overflow: visible;
`;

export const Band = styled.View<{ $bg: string; $left: number; $width: number }>`
  position: absolute;
  left: ${({ $left }) => $left}px;
  top: 0;
  width: ${({ $width }) => $width}px;
  height: 6px;
  border-radius: 3px;
  background-color: ${({ $bg }) => $bg};
`;

export const Fill = styled.View<{ $color: string; $width: number }>`
  position: absolute;
  left: 0;
  top: 0;
  width: ${({ $width }) => $width}px;
  height: 6px;
  border-radius: 3px;
  background-color: ${({ $color }) => $color};
`;

export const BandDot = styled.View<{ $left: number; $color: string }>`
  position: absolute;
  left: ${({ $left }) => $left - 1.6}px;
  top: 1.4px;
  width: 3.2px;
  height: 3.2px;
  border-radius: 1.6px;
  background-color: ${({ $color }) => $color};
`;

export const Callout = styled.View<{ $bg: string; $border: string }>`
  flex-direction: row;
  margin-top: 22px;
  padding: 5px 14px 6px 12px;
  border-radius: 16px;
  background-color: ${({ $bg }) => $bg};
  border-width: 0.9px;
  border-color: ${({ $border }) => $border};
  align-items: center;
`;

export const CalloutIcon = styled.View<{ $bg: string }>`
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background-color: ${({ $bg }) => $bg};
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

export const CalloutText = styled.View`
  flex: 1;
  flex-direction: column;
`;
