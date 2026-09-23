import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';

/** "{MONTH} SO FAR" — 24pt page margin. */
export const SectionLabel = styled.View`
  padding-left: 8px;
`;

/** Section stack: label → card. */
export const MonthSection = styled.View`
  gap: 12px;
`;

export const SummaryBody = styled.View`
  padding: 20px 20px 18px;
`;

export const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const DaysBadge = styled.View`
  min-width: 76px;
  height: 21px;
  padding-horizontal: 10px;
  border-radius: 10.5px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(120,120,128,0.12)')};
  align-items: center;
  justify-content: center;
`;

export const Divider = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.07)')};
  margin-vertical: 14px;
`;

export const StatRow = styled.View`
  flex-direction: row;
  align-items: stretch;
`;

export const StatCell = styled.View<{ $first?: boolean }>`
  flex: 1;
  align-items: center;
  justify-content: center;
  border-left-width: ${({ $first }) => ($first ? 0 : StyleSheet.hairlineWidth)}px;
  border-left-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.07)')};
`;

export const Footer = styled.View`
  margin-top: 12px;
  align-items: center;
`;
