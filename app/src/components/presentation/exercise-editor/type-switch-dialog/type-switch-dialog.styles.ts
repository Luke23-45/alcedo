import styled from 'styled-components/native';
import { type as typeHelper } from '@/styles/theme';
import { editorPalette } from '../exercise-editor-tokens';

export const DialogContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-left: 32px;
  padding-right: 32px;
`;

export const Dialog = styled.View`
  width: 100%;
  border-radius: 24px;
  border-curve: continuous;
  background-color: ${({ theme }) => (theme.isDark ? '#1C1C1E' : '#FFFFFF')};
  border-width: 1px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)')};
  padding-top: 24px;
  shadow-color: #000000;
  shadow-offset: 0px 16px;
  shadow-opacity: 0.5;
  shadow-radius: 32px;
  elevation: 16;
  overflow: hidden;
`;

export const DialogTitle = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 16px;
  line-height: 21px;
  font-weight: 600;
  letter-spacing: -0.35px;
  text-align: center;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#111111')};
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 12px;
`;

export const DialogBody = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 12.5px;
  line-height: 18px;
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => (theme.isDark ? '#98989F' : '#636366')};
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 20px;
`;

export const DialogBodyKept = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 12.5px;
  line-height: 18px;
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => editorPalette(theme.isDark).text.caption};
`;

export const DialogDividerH = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')};
`;

export const DialogActions = styled.View`
  flex-direction: row;
`;

export const DialogActionButton = styled.Pressable`
  flex: 1;
  min-height: 52px;
  align-items: center;
  justify-content: center;
`;

export const DialogDividerV = styled.View`
  width: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')};
`;

export const CancelText = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${({ theme }) => (theme.isDark ? '#98989F' : '#636366')};
`;

export const ConfirmText = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${({ theme }) => (theme.isDark ? '#FF6B60' : '#D70015')};
`;
