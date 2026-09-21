import styled from 'styled-components/native';
import { editorPalette } from '../exercise-editor-tokens';

/** Collapsed: 56pt row, label + summary stacked, chevron right. */
export const ProgressionRow = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 8px;
  padding-bottom: 8px;
  gap: 12px;
`;

export const ProgressionTextColumn = styled.View`
  flex: 1;
  gap: 2px;
`;

export const ProgressionLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13.5px;
  line-height: 18px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => editorPalette(theme.isDark).text.secondary};
`;

export const ProgressionSummary = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10.5px;
  line-height: 14px;
  font-weight: 500;
  color: ${({ theme }) => editorPalette(theme.isDark).text.caption};
`;

export const ExpandedPad = styled.View`
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 12px;
`;

export const RuleBlock = styled.View`
  gap: 12px;
  padding-top: 4px;
  padding-bottom: 8px;
`;

export const RuleHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 4px;
  padding-right: 4px;
`;

export const RuleTitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: ${({ theme }) => editorPalette(theme.isDark).text.primary};
`;

export const DeleteRule = styled.Pressable`
  min-width: 44px;
  min-height: 44px;
  margin-right: -12px;
  align-items: center;
  justify-content: center;
`;

export const DeleteRuleText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  color: ${({ theme }) => editorPalette(theme.isDark).accent.red};
`;

export const RuleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  padding-left: 4px;
  padding-right: 4px;
`;

export const AddRuleButton = styled.Pressable`
  min-height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  border-curve: continuous;
  border-width: 1px;
  border-style: dashed;
  border-color: rgba(255, 106, 61, 0.45);
  margin-top: 4px;
`;

export const AddRuleText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13px;
  line-height: 18px;
  font-weight: 600;
  color: ${({ theme }) => editorPalette(theme.isDark).accent.ember};
`;

export const NoLoadWarning = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11px;
  line-height: 15px;
  font-weight: 500;
  color: #ffb340;
  padding-left: 4px;
  padding-right: 4px;
`;
