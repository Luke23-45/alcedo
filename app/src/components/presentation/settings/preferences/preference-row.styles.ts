import styled from 'styled-components/native';

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
  margin-right: 12px;
  justify-content: center;
  gap: 3px;
`;

export const RowTrailing = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

// Separators run 20pt-inset on both sides (x36→x357 on 393pt).
export const RowSeparator = styled.View`
  height: 1px;
  margin-left: 20px;
  margin-right: 20px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(60,60,67,0.12)')};
`;

// Section label inside a card (e.g. "Theme", "Accent"): 13.5pt/600.
export const CardSectionLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13.5px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
  padding-left: 20px;
  padding-right: 20px;
`;

// Small caption under a control block: 10.5pt/500 #6C6C70.
export const CardCaption = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10.5px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => (theme.isDark ? '#6C6C70' : '#8E8E93')};
  padding-left: 20px;
  padding-right: 20px;
`;
