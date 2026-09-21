import type { StyleProp, ViewStyle } from 'react-native';
import styled from 'styled-components/native';

export const CardWrap = styled.View`
  margin-top: 12px;
  padding-left: 16px;
  padding-right: 16px;
`;

export const FocusShadow = styled.View<{ $focused: boolean }>`
  border-radius: 28px;
  ${({ $focused }) =>
    $focused
      ? `
    shadow-color: #ff6a3d;
    shadow-offset: 0px 0px;
    shadow-opacity: 0.4;
    shadow-radius: 5px;
    elevation: 4;
  `
      : `
    shadow-color: #000000;
    shadow-offset: 0px 10px;
    shadow-opacity: 0.5;
    shadow-radius: 14px;
    elevation: 8;
  `}
`;

/** 1.8pt brand border when focused; hairline edge otherwise. Outer height is exactly 100pt. */
export const BorderFill = styled.View<{ $focused: boolean }>`
  height: 100px;
  border-radius: 28px;
  overflow: hidden;
  padding: ${({ $focused }) => ($focused ? '1.8px' : '0px')};
  border-width: ${({ $focused }) => ($focused ? '0px' : '1px')};
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(0, 0, 0, 0.08)')};
`;

export const CardBody = styled.View`
  flex: 1;
  border-radius: 26px;
  overflow: hidden;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 18px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`;

export const ComposerLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 8.5px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 0.9px;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

export const Counter = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 9px;
  font-weight: ${({ theme }) => theme.weight.medium};
  letter-spacing: 0.2px;
  color: ${({ theme }) => (theme.isDark ? '#6C6C70' : '#8E8E93')};
`;

export const Input = styled.TextInput`
  flex: 1;
  font-family: ${({ theme }) => theme.font.text};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.weight.medium};
  letter-spacing: -0.1px;
  color: ${({ theme }) => (theme.isDark ? '#F5F5F7' : '#1C1C1E')};
  text-align-vertical: top;
  padding-top: 8px;
  padding-bottom: 8px;
`;

/** Absolute overlay fill for LinearGradient layers (RN-only prop). */
export const fill: StyleProp<ViewStyle> = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};
