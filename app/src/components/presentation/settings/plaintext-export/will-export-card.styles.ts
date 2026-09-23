import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

// "Will export" (S4, backup-redesign.md §4): three live counts, each a number
// (16/700, tracking −0.4) over a micro-label (7.5/700, tracking +0.8),
// divided by hairlines; the scope note sits below the stats.
export const WillExportWrap = styled.View`
  margin-bottom: 16px;
`;

export const StatsRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const StatCell = styled.View`
  flex: 1;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 8px;
  gap: 4px;
`;

export const StatDivider = styled.View`
  width: ${StyleSheet.hairlineWidth}px;
  align-self: stretch;
  background-color: ${({ theme }) =>
    theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(60,60,67,0.12)'};
`;

export const StatValue = styled.Text`
  ${({ theme }) => typeStyle(theme, 'title3', { weight: '700', tabular: true })}
  font-size: 16px;
  letter-spacing: -0.4px;
  color: ${({ theme }) => theme.color.content.primary};
  text-align: center;
`;

export const StatLabel = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '700' })}
  font-size: 7.5px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.content.secondary};
  text-align: center;
`;

/** "All recorded sessions · no date filter · no scope toggles" — 9pt, secondary. */
export const ScopeNote = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '500' })}
  font-size: 9px;
  line-height: 13px;
  color: ${({ theme }) => theme.color.content.secondary};
  margin-top: 12px;
`;
