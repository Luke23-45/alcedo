import styled from 'styled-components/native';
import { editorPalette } from '../exercise-editor-tokens';

/**
 * Reference: 64pt rows; the selected row carries an ember well
 * (#FF6A3D @.10, rx 16, inset 8pt from the card edges) and no radio;
 * unselected rows show the r10 outline radio on the right.
 */
export const ResistanceRow = styled.Pressable<{ $selected: boolean }>`
  flex-direction: row;
  align-items: center;
  min-height: 64px;
  margin-left: 8px;
  margin-right: 8px;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-radius: 16px;
  border-curve: continuous;
  background-color: ${({ theme, $selected }) => ($selected ? editorPalette(theme.isDark).selectedWell : 'transparent')};
`;

export const ResistanceTextColumn = styled.View`
  flex: 1;
  gap: 2px;
`;

export const ResistanceLabel = styled.Text<{ $selected: boolean }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13.5px;
  line-height: 18px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme, $selected }) => ($selected ? '#FFFFFF' : editorPalette(theme.isDark).text.secondary)};
`;

export const ResistanceBody = styled.Text<{ $selected: boolean }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10.5px;
  line-height: 14px;
  font-weight: 500;
  color: ${({ theme, $selected }) => ($selected ? '#98989F' : editorPalette(theme.isDark).text.caption)};
`;

export const Radio = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border-curve: continuous;
  border-width: 1.6px;
  border-color: ${({ theme }) => editorPalette(theme.isDark).radio};
`;
