import styled from 'styled-components/native';
import { HomeGradient } from '../../home/shared/home-gradient';

export const BarWrap = styled.View`
  padding-top: 28px;
  padding-horizontal: 16px;
`;

export const Fade = styled(HomeGradient).attrs(({ theme }) => ({
  colors: ['transparent', theme.color.background.base] as [string, string],
  locations: [0, 1] as [number, number],
}))`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const Row = styled.View`
  flex-direction: row;
  gap: 13px;
`;

export const ShareButton = styled.Pressable`
  flex: 1;
  height: 54px;
  border-radius: 27px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  /* Reference: glyph ends x=90, label starts x=112. */
  gap: 22px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)')};
  border-width: 1px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)')};
`;

export const ShareLabel = styled.Text`
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.25px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const DoneButton = styled.Pressable`
  flex: 1;
  height: 54px;
  border-radius: 27px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.22);
  shadow-color: #ff2d55;
  shadow-offset: 0px 7px;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
  elevation: 8;
`;

export const DoneFill = styled(HomeGradient).attrs({
  colors: ['#FFB03A', '#FF6A3D', '#FF2D55'] as [string, string, string],
  start: { x: 0, y: 0 },
  end: { x: 0.6, y: 1 },
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const DoneGloss = styled(HomeGradient).attrs({
  colors: ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0)'] as [string, string],
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 27px;
`;

export const DoneLabel = styled.Text`
  font-size: 15px;
  line-height: 20px;
  font-weight: 600; /* RN can't render 650 — falls back to 400; 600 is nearest representable. */
  letter-spacing: -0.25px;
  color: #ffffff;
`;
