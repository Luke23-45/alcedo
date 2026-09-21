import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { editorPalette } from '../exercise-editor-tokens';

export const SheetContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

export const Sheet = styled.View<{ $bottomPad: number }>`
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  background-color: ${({ theme }) => (theme.isDark ? '#1C1C1E' : '#FFFFFF')};
  border-width: 1px;
  border-bottom-width: 0px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)')};
  padding-bottom: ${({ $bottomPad }) => 24 + $bottomPad}px;
  shadow-color: #000000;
  shadow-offset: 0px -8px;
  shadow-opacity: 0.4;
  shadow-radius: 24px;
  elevation: 16;
`;

export const SheetTitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
  text-align: center;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#111111')};
  padding-bottom: 16px;
`;

export const BigStepperRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
`;

export const BigStepButton = styled.Pressable`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 22px;
  border-curve: continuous;
  border-width: 0.8px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)')};
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(120,120,128,0.08)')};
`;

export const SheetValue = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 40px;
  line-height: 48px;
  font-weight: 700;
  letter-spacing: -1.6px;
  text-align: center;
  color: ${({ theme }) => (theme.isDark ? editorPalette(true).accent.ember : editorPalette(false).accent.emberOnLight)};
  font-variant: tabular-nums;
  min-width: 160px;
  padding-left: 16px;
  padding-right: 16px;
`;

export const ChipRow = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 8px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 16px;
`;

export const Chip = styled.Pressable<{ $selected: boolean }>`
  height: 28px;
  padding-left: 14px;
  padding-right: 14px;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  border-curve: continuous;
  border-width: 0.8px;
  background-color: ${({ theme, $selected }) => {
    const dark = theme.isDark;
    if ($selected) {
      return dark ? 'rgba(255,106,61,0.16)' : 'rgba(232,84,47,0.12)';
    }
    return dark ? 'rgba(255,255,255,0.07)' : 'rgba(120,120,128,0.10)';
  }};
  border-color: ${({ theme, $selected }) => {
    const dark = theme.isDark;
    if ($selected) {
      return dark ? editorPalette(true).accent.ember : editorPalette(false).accent.emberOnLight;
    }
    return dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  }};
`;

export const ChipText = styled.Text<{ $selected: boolean }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11.5px;
  line-height: 14px;
  font-weight: 600;
  color: ${({ theme, $selected }) => {
    if ($selected) {
      return theme.isDark ? editorPalette(true).accent.ember : editorPalette(false).accent.emberOnLight;
    }
    return editorPalette(theme.isDark).text.secondary;
  }};
  font-variant: tabular-nums;
`;

export const SheetActions = styled.View`
  padding-left: 20px;
  padding-right: 20px;
`;

export const ApplyAllButton = styled.Pressable`
  height: 50px;
  border-radius: 25px;
  border-curve: continuous;
  overflow: hidden;
  shadow-color: #ff6a3d;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 12px;
  elevation: 4;
`;

export const ApplyAllGradient = styled(LinearGradient)`
  flex: 1;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
`;

export const ApplyAllText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: #ffffff;
`;
