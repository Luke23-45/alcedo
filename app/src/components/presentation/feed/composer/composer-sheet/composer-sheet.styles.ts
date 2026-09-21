import type { StyleProp, ViewStyle } from 'react-native';
import styled from 'styled-components/native';

export const Backdrop = styled.Pressable`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

export const Sheet = styled.View<{ $bottom: number }>`
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  overflow: hidden;
  padding-bottom: ${({ $bottom }) => $bottom}px;
  shadow-color: #000000;
  shadow-offset: 0px -8px;
  shadow-opacity: 0.5;
  shadow-radius: 16px;
  elevation: 16;
`;

export const SheetEdge = styled.View`
  position: absolute;
  left: 0.5px;
  right: 0.5px;
  top: 0.5px;
  border-top-left-radius: 27.5px;
  border-top-right-radius: 27.5px;
  border-width: 1px;
  border-bottom-width: 0px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(0, 0, 0, 0.08)')};
`;

export const Grabber = styled.View`
  width: 36px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(120, 120, 128, 0.4)')};
  align-self: center;
  margin-top: 12px;
`;

export const SheetHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 24px;
  padding-right: 16px;
  margin-top: 12px;
  margin-bottom: 8px;
`;

export const SheetTitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 17px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.4px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

export const DoneButton = styled.Pressable`
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding-left: 12px;
  padding-right: 12px;
`;

export const DoneLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.3px;
  color: ${({ theme }) => (theme.isDark ? '#FF9F0A' : '#007AFF')};
`;

/** Absolute overlay fill for LinearGradient layers (RN-only prop). */
export const fill: StyleProp<ViewStyle> = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};
