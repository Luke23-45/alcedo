import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

// Sticky Export bar (S4): the tb gradient bar with a hairline, carrying the
// brand-gradient 361×54 rx27 pill with top-half gloss and a white 22% edge.
export const ExportActionBar = styled.View`
  position: relative;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 12px;
  padding-bottom: 16px;
`;

export const BarGradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const BarHairline = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: ${({ theme }) =>
    theme.isDark ? 'rgba(255,255,255,0.11)' : 'rgba(60,60,67,0.16)'};
`;

export const ExportButton = styled.Pressable`
  height: 54px;
  border-radius: 27px;
  align-items: center;
  justify-content: center;
  shadow-color: #ff2d55;
  shadow-offset: 0px 7px;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
  elevation: 6;
`;

export const ButtonGradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 27px;
`;

export const GlossLayer = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 27px;
  border-radius: 27px;
  opacity: 0.35;
`;

export const ButtonEdge = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 27px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.22);
`;

export const ButtonLabel = styled.Text`
  ${({ theme }) => typeStyle(theme, 'headline', { weight: '600' })}
  color: #ffffff;
  z-index: 1;
`;
