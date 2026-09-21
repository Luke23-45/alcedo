import type { StyleProp, ViewStyle } from 'react-native';
import styled from 'styled-components/native';

export const CardShadow = styled.View`
  border-radius: 22px;
  shadow-color: #000000;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.5;
  shadow-radius: 14px;
  elevation: 8;
`;

export const Card = styled.View`
  border-radius: 22px;
  overflow: hidden;
  padding: 16px;
`;

export const CardEdge = styled.View`
  position: absolute;
  left: 0.5px;
  right: 0.5px;
  top: 0.5px;
  bottom: 0.5px;
  border-radius: 21.5px;
  border-width: 1px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(0, 0, 0, 0.08)')};
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const HeaderText = styled.View`
  margin-left: 12px;
  flex-direction: row;
  align-items: baseline;
  gap: 6px;
`;

export const AuthorName = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.25px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

export const Age = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.weight.regular};
  letter-spacing: -0.1px;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

export const Caption = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.weight.regular};
  letter-spacing: -0.1px;
  color: ${({ theme }) => (theme.isDark ? '#F5F5F7' : '#1C1C1E')};
  margin-top: 12px;
`;

export const PosterSlot = styled.View`
  margin-top: 12px;
`;

export const TaggedLine = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.weight.medium};
  letter-spacing: -0.1px;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
  margin-top: 10px;
`;

/** Absolute overlay fill for LinearGradient layers (RN-only prop). */
export const fill: StyleProp<ViewStyle> = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};
