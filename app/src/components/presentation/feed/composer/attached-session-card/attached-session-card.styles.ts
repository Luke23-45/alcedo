import { LinearGradient } from 'expo-linear-gradient';
import type { StyleProp, ViewStyle } from 'react-native';
import styled from 'styled-components/native';

export const CardWrap = styled.View`
  margin-top: 16px;
  padding-left: 16px;
  padding-right: 16px;
`;

/** Owns the drop shadow; the inner card clips to the radius. */
export const CardShadow = styled.View`
  border-radius: 22px;
  shadow-color: #000000;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.42;
  shadow-radius: 8px;
  elevation: 6;
`;

export const Card = styled.View`
  height: 72px;
  border-radius: 22px;
  overflow: hidden;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  padding-right: 11px;
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

export const SessionTile = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 14px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`;

export const TileGloss = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 50%;
  opacity: 0.4;
`;

export const CardText = styled.View`
  flex: 1;
  margin-left: 12px;
  justify-content: center;
  gap: 4px;
`;

export const CardKicker = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 8px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 0.9px;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

export const CardTitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.2px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

export const RemoveButton = styled.Pressable`
  width: 26px;
  height: 26px;
  border-radius: 13px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(120, 120, 128, 0.12)')};
  border-width: 0.8px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(120, 120, 128, 0.2)')};
`;

/** Re-attach card: dashed affordance shown after the session is removed. */
export const ReattachCard = styled.Pressable`
  height: 72px;
  border-radius: 22px;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.045)' : 'rgba(120, 120, 128, 0.08)')};
  border-width: 1px;
  border-style: dashed;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(120, 120, 128, 0.25)')};
`;

export const EmptyTitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.2px;
  color: ${({ theme }) => (theme.isDark ? '#C7C7CC' : '#3C3C43')};
`;

export const EmptySubtitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.weight.regular};
  letter-spacing: -0.1px;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

/** Absolute overlay fill for LinearGradient layers (RN-only prop). */
export const fill: StyleProp<ViewStyle> = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};
