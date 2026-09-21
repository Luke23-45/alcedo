import styled from 'styled-components/native';

/** Tight 20/20/14 padding — the reference card is 152pt, not the hero 20pt. */
export const CardInner = styled.View`
  padding-top: 20px;
  padding-horizontal: 20px;
  padding-bottom: 14px;
`;

export const TopRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-top: 2px;
  margin-left: -8px;
`;

export const Medallion = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  shadow-color: #ff9f0a;
  shadow-offset: 0px 5px;
  shadow-opacity: 0.45;
  shadow-radius: 9px;
  elevation: 6;
`;

export const StreakText = styled.View`
  margin-left: 12px;
  margin-top: 3px;
  flex: 1;
`;

export const TodayPill = styled.View<{ $bg: string }>`
  min-width: 54px;
  height: 20px;
  padding-horizontal: 8px;
  border-radius: 10px;
  background-color: ${({ $bg }) => $bg};
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  margin-left: auto;
`;

export const Divider = styled.View<{ $dark: boolean }>`
  height: 1px;
  margin-top: 14px;
  background-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.07)' : 'rgba(60,60,67,0.10)')};
`;

export const StatsRow = styled.View`
  flex-direction: row;
  margin-top: 14px;
  margin-horizontal: -20px;
  position: relative;
`;

export const StatCol = styled.View`
  flex: 1;
  align-items: center;
`;

export const StatDivider = styled.View<{ $dark: boolean; $pct: number }>`
  position: absolute;
  left: ${({ $pct }) => $pct}%;
  top: -1px;
  bottom: -6px;
  width: 1px;
  background-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.07)' : 'rgba(60,60,67,0.10)')};
`;
