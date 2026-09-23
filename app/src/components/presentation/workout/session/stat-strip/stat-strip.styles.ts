import styled from 'styled-components/native';
import { StyleSheet } from 'react-native';
import { type as typeHelper } from '@/styles/theme';
import { sessionPalette } from '../session-tokens';

export const StripWrap = styled.View`
  min-height: 68px;
  margin-horizontal: 16px;
`;

export const StripRow = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const Column = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  /* Optical: reference value/label baselines sit at card-rel 32/50. */
  padding-top: 2px;
`;

export const DividerLine = styled.View`
  width: ${StyleSheet.hairlineWidth}px;
  height: 40px;
  background-color: ${({ theme }) => sessionPalette(theme.isDark).stats.divider};
`;

export const Value = styled.Text<{ $dimmed: boolean }>`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 16px;
  line-height: 20px;
  font-weight: 700;
  letter-spacing: -0.4px;
  font-variant: tabular-nums;
  color: ${({ theme, $dimmed }) => {
    const c = sessionPalette(theme.isDark).stats;
    return $dimmed ? c.dimValue : c.value;
  }};
`;

export const ValueSuffix = styled.Text<{ $dimmed: boolean }>`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  letter-spacing: -0.4px;
  color: ${({ theme, $dimmed }) => {
    const c = sessionPalette(theme.isDark).stats;
    return $dimmed ? c.dimValue : c.suffix;
  }};
`;

export const LabelRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  margin-top: 5px;
`;

export const Label = styled.Text<{ $dimmed: boolean }>`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 8px;
  line-height: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: ${({ theme, $dimmed }) => {
    const c = sessionPalette(theme.isDark).stats;
    return $dimmed ? c.dimLabel : c.label;
  }};
`;
