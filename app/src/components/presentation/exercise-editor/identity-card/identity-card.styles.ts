import styled from 'styled-components/native';
import { TextInput as RNTextInput } from 'react-native';
import { type as typeHelper } from '@/styles/theme';
import { editorPalette } from '../exercise-editor-tokens';

/** Card inner padding on the reference canvases. */
export const IdentityPad = styled.View`
  padding: 12px;
`;

/** Gap between the search card and the results card in add mode. */
export const SearchSection = styled.View`
  padding-top: 8px;
`;

export const NameText = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  flex: 1;
  font-size: 14px;
  line-height: 19px;
  font-weight: 600;
  letter-spacing: -0.25px;
  color: ${({ theme }) => editorPalette(theme.isDark).text.primary};
`;

export const SearchPad = styled.View`
  padding-top: 4px;
  padding-bottom: 8px;
  padding-left: 12px;
  padding-right: 12px;
`;

/** Add-mode search card: the reference insets the 40pt field by 10pt. */
export const AddSearchPad = styled.View`
  padding: 10px;
`;

export const SearchHint = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: ${({ theme }) => editorPalette(theme.isDark).text.caption};
  padding-top: 10px;
  padding-left: 4px;
  padding-right: 4px;
`;

export const ResultRow = styled.Pressable`
  flex-direction: row;
  align-items: center;
  min-height: 44px;
  padding-left: 16px;
  padding-right: 16px;
  gap: 12px;
`;

export const ResultTextColumn = styled.View`
  flex: 1;
`;

export const ResultName = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 13.5px;
  line-height: 18px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => editorPalette(theme.isDark).text.secondary};
`;

export const ResultSubtitle = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 10.5px;
  line-height: 14px;
  font-weight: 500;
  color: ${({ theme }) => editorPalette(theme.isDark).text.caption};
`;

export const SearchInput = styled(RNTextInput).attrs(({ theme }) => ({
  selectionColor: theme.isDark ? '#FF6A3D' : '#E8542F',
}))`
  flex: 1;
  font-size: 13.5px;
  line-height: 18px;
  font-weight: 400;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#111111')};
  padding-top: 0px;
  padding-bottom: 0px;
`;

export const ResultsBottomPad = styled.View`
  height: 8px;
`;

/** Gap between the Library/Custom tabs and the tab body. */
export const TabPad = styled.View`
  padding-bottom: 12px;
`;

/** Micro field label in the custom-exercise form. */
export const FieldLabel = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 10.5px;
  line-height: 14px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: ${({ theme }) => editorPalette(theme.isDark).text.caption};
  padding-left: 4px;
  padding-bottom: 8px;
`;

/** Name well in the custom-exercise form (the search field's unfocused language). */
export const NameWell = styled.View`
  border-radius: 14px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(120,120,128,0.08)')};
  border-width: 0.9px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')};
  min-height: 48px;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  padding-right: 12px;
`;

/** Gap between the form's blocks. */
export const FormGap = styled.View`
  height: 16px;
`;

/** Duplicate-name nudge row in the custom-exercise form. */
export const DuplicateRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 10px;
  gap: 8px;
`;

export const DuplicateText = styled.Text`
  flex: 1;
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: ${({ theme }) => editorPalette(theme.isDark).text.caption};
`;

/** Tinted text action (use the library version instead). */
export const LinkAction = styled.Pressable`
  min-height: 44px;
  justify-content: center;
`;

export const LinkActionLabel = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 12.5px;
  line-height: 17px;
  font-weight: 600;
  color: ${({ theme }) => editorPalette(theme.isDark).accent.ember};
`;

/** Primary create action in the custom-exercise form. */
export const CreateButton = styled.Pressable<{ $disabled: boolean }>`
  min-height: 48px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  background-color: ${({ theme }) => theme.color.interactive.tint};
  opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};
`;

export const CreateLabel = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: #ffffff;
`;
