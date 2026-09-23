import styled from 'styled-components/native';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';

/**
 * The active program's hero card. The edge is the spec's amber stroke
 * (#FF6A3D @ 38%) rather than the standard white edge, marking it as the
 * live program.
 */
export const HeroEdge = styled(HomeGradient).attrs({
  colors: ['rgba(255,106,61,0.38)', 'rgba(255,106,61,0.14)'] as [string, string],
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
})`
  border-radius: 26px;
  padding: 1.2px;
  shadow-color: #000000;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.5;
  shadow-radius: 14px;
  elevation: 8;
`;

export const HeroBody = styled(HomeGradient).attrs({ variant: 'cardBody' })`
  border-radius: 25px;
  padding: 20px;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
`;

export const HeroIcon = styled(HomeGradient).attrs({ variant: 'brand' })`
  width: 44px;
  height: 44px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  shadow-color: #ff2d55;
  shadow-offset: 0px 7px;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
  elevation: 6;
`;

export const HeroText = styled.View`
  flex: 1;
  margin-left: 12px;
  margin-right: 8px;
  gap: 4px;
`;

export const HeroTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const HeroName = styled.Text`
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const ActiveBadge = styled.View`
  flex-shrink: 0;
  padding-horizontal: 8px;
  padding-vertical: 3px;
  border-radius: 8.5px;
  background-color: rgba(48, 209, 88, 0.16);
`;

export const ActiveBadgeText = styled.Text`
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #4ade80;
`;

export const HeroCaption = styled.Text`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

export const HeroProgressRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

export const HeroTrack = styled.View`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
  ${({ theme }) =>
    theme.isDark
      ? `
          background-color: rgba(255, 255, 255, 0.09);
        `
      : `
          background-color: rgba(0, 0, 0, 0.08);
        `}
`;

export const HeroPercent = styled.Text`
  font-size: 10px;
  font-weight: 700;
  color: ${({ theme }) => (theme.isDark ? '#98989F' : '#8E8E93')};
`;

export const HeroMenuSlot = styled.View`
  position: absolute;
  top: 8px;
  right: 8px;
`;
