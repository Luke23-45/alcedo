import styled from 'styled-components/native';
import { TextInput as RNTextInput } from 'react-native';
import { editorPalette } from '../exercise-editor-tokens';

export const DetailPad = styled.View`
  padding-top: 2px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
`;

/** Subheads sit 20pt from the card edge; the notes counter ends 36pt in. */
export const SubHeadRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 4px;
  padding-right: 20px;
  padding-bottom: 8px;
  padding-top: 12px;
`;

export const SubHeadCounter = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 9px;
  line-height: 12px;
  font-weight: 500;
  color: ${({ theme }) => editorPalette(theme.isDark).text.tertiary};
`;

const Well = styled.View<{ $focused: boolean }>`
  border-radius: 16px;
  border-curve: continuous;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(120,120,128,0.08)')};
  border-width: ${({ $focused }) => ($focused ? 1.6 : 0.9)}px;
  border-color: ${({ theme, $focused }) =>
    $focused ? editorPalette(theme.isDark).accent.ember : theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 12px;
  padding-bottom: 12px;
`;

export const NotesWell = styled(Well)`
  min-height: 80px;
`;

export const LinkWell = styled(Well)`
  border-radius: 14px;
  min-height: 48px;
  flex-direction: row;
  align-items: center;
  padding-top: 0px;
  padding-bottom: 0px;
`;

export const LinkGlyphWrap = styled.View`
  padding-right: 6px;
`;

export const FieldInput = styled(RNTextInput)`
  flex: 1;
  font-size: 12.5px;
  line-height: 17px;
  font-weight: 500;
  color: ${({ theme }) => (theme.isDark ? '#E5E5EA' : '#1C1C1E')};
  padding-top: 0px;
  padding-bottom: 0px;
`;
