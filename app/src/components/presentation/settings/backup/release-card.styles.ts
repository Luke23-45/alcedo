import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';

// Release card (settings-dark.md Screen 6): x16 w361 rx28. Shared by the
// backup screen and the what's-new route.

// Header: tile 40×40 rx14, brand gradient + gloss, white spark.
export const ReleaseHeader = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 18px;
  padding-left: 20px;
  padding-right: 20px;
`;

// Brand-gradient tile (colors passed by the <ReleaseTileGlyph> wrapper).
export const ReleaseTileBase = styled(LinearGradient)`
  width: 40px;
  height: 40px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const ReleaseTileGlossBase = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
`;

export const ReleaseHeaderText = styled.View`
  flex: 1;
  margin-left: 16px;
  gap: 4px;
`;

export const ReleaseTitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 17px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: -0.4px;
  color: #ffffff;
`;

export const ReleaseMeta = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: #86868b;
`;

// NEW pill, slightly larger than the settings-row pill: h18 rx9, 8/700 ls .5.
export const ReleasePill = styled.View`
  height: 18px;
  padding-horizontal: 10px;
  border-radius: 9px;
  border-width: 0.7px;
  border-color: rgba(255, 214, 10, 0.26);
  background-color: rgba(255, 214, 10, 0.16);
  align-items: center;
  justify-content: center;
`;

export const ReleasePillText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 8px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 0.5px;
  color: #ffd84d;
`;

// Bullets: dots r2.4 #FF9F0A, 26pt pitch; text 12.5/500 #E5E5EA.
export const ReleaseBullets = styled.View`
  padding-top: 18px;
  padding-bottom: 18px;
  padding-left: 20px;
  padding-right: 20px;
  gap: 13px;
`;

export const ReleaseBullet = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ReleaseBulletDot = styled.View`
  width: 5px;
  height: 5px;
  border-radius: 2.5px;
  background-color: #ff9f0a;
  margin-left: 1px;
  margin-right: 13px;
`;

export const ReleaseBulletText = styled.Text`
  flex: 1;
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12.5px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => (theme.isDark ? '#E5E5EA' : '#3A3A3C')};
`;

// "View all release notes" 13/600 #FF9F0A, 54pt row, chevron.
export const ReleaseMoreRow = styled.Pressable`
  min-height: 54px;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 14px;
`;

export const ReleaseMoreText = styled.Text`
  flex: 1;
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.home.seeAll};
`;
