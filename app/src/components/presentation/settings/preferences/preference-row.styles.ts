import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

/**
 * Label-row anatomy for Preferences/Notifications (Phase 6, Screens 2–3):
 * label-only rows at 20pt card insets, optional subtitle, custom trailing
 * control. Measured off docs/new_design/settings-dark.md Screens 2–3.
 */

export const Row = styled.View`
  min-height: 58px;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 16px;
`;

export const RowPressable = styled.Pressable`
  min-height: 58px;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 16px;
`;

export const RowText = styled.View`
  flex: 1;
  min-width: 0;
  margin-right: 12px;
  justify-content: center;
  gap: 3px;
`;

export const RowTrailing = styled.View`
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
  gap: 6px;
`;

// Separators run 20pt-inset on both sides (x36→x357 on 393pt).
export const RowSeparator = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  margin-left: 20px;
  margin-right: 20px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(60,60,67,0.12)')};
`;

// Section label inside a card (e.g. "Theme", "Accent"): 13.5pt/600.
// PF06: family/weight/line-height from the type system; the spec-measured
// 13.5 size and -0.2 tracking stay as overrides.
export const CardSectionLabel = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '600' })}
  font-size: 13.5px;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
  padding-left: 20px;
  padding-right: 20px;
`;

// Small caption under a control block: 10.5pt/500 #6C6C70.
export const CardCaption = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '500' })}
  font-size: 10.5px;
  color: ${({ theme }) => (theme.isDark ? '#6C6C70' : '#8E8E93')};
  padding-left: 20px;
  padding-right: 20px;
`;
