import type { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';

export const BarWrap = styled.View`
  padding-top: 14px;
  padding-bottom: 14px;
  padding-left: 16px;
  padding-right: 16px;
  align-items: center;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.11)' : 'rgba(60, 60, 67, 0.16)')};
`;

/** Material backdrop behind the CTA (RN-only absolute fill). */
export const BarMaterial = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: ${({ theme }) => (theme.isDark ? 0.96 : 0.95)};
`;

export const CtaShadow = styled.View<{ $dimmed?: boolean }>`
  border-radius: 27px;
  shadow-color: #ff2d55;
  shadow-offset: 0px 7px;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
  elevation: 8;
  width: 100%;
  opacity: ${({ $dimmed }) => ($dimmed ? 0.5 : 1)};
`;

export const CtaButton = styled.Pressable`
  height: 54px;
  border-radius: 27px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`;

/** Absolute overlay fill for LinearGradient layers (RN-only prop). */
export const fill: StyleProp<ViewStyle> = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

export const CtaGloss = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 50%;
  opacity: 0.35;
`;

export const CtaEdge = styled.View`
  position: absolute;
  left: 0.5px;
  right: 0.5px;
  top: 0.5px;
  bottom: 0.5px;
  border-radius: 26.5px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.22);
`;

export const CtaLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.3px;
  color: #ffffff;
`;

export const CtaCaption = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10.5px;
  font-weight: ${({ theme }) => theme.weight.medium};
  letter-spacing: -0.1px;
  color: ${({ theme }) => (theme.isDark ? '#6C6C70' : '#8E8E93')};
  margin-top: 10px;
`;
