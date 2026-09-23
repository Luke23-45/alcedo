import styled from 'styled-components/native';
import { type as typeHelper } from '@/styles/theme';
import { editorPalette } from '../exercise-editor-tokens';

export const OptionPad = styled.View`
  padding-top: 6px;
  padding-bottom: 6px;
`;

export const OptionRow = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 52px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 6px;
  padding-bottom: 6px;
`;

export const OptionTextColumn = styled.View`
  flex: 1;
  padding-right: 12px;
  gap: 2px;
`;

export const RowAction = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

/** Reference: 52×22 pill, white .08 fill, 11pt value. */
export const RestValueChip = styled.View`
  min-width: 52px;
  height: 22px;
  border-radius: 11px;
  border-curve: continuous;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
  padding-right: 10px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(120,120,128,0.12)')};
  border-width: 1px;
  border-color: ${({ theme }) => editorPalette(theme.isDark).control.stroke};
`;

export const RestValueText = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 11px;
  line-height: 14px;
  font-weight: 600;
  color: ${({ theme }) => editorPalette(theme.isDark).text.primary};
  font-variant: tabular-nums;
`;
