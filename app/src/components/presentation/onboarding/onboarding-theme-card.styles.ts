import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { type as typeHelper } from '@/styles/theme';

export const ThemeRow = styled.View`
  padding-left: 20px;
  padding-right: 16px;
  padding-top: 16px;
  padding-bottom: 12px;
`;

export const ThemeLabel = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const SwatchLine = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
`;

export const DefaultPill = styled.Pressable`
  width: 72px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`;

export const DefaultPillRing = styled.View<{ $color: string }>`
  position: absolute;
  left: -3px;
  top: -3px;
  width: 78px;
  height: 38px;
  border-radius: 19px;
  border-width: 2px;
  border-color: ${({ $color }) => $color};
`;

export const DefaultPillLabel = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const SeedScroller = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: { gap: 8, paddingRight: 44, alignItems: 'center' },
})`
  flex: 1;
  margin-left: 12px;
`;

export const SeedBall = styled.Pressable<{ $color: `#${string}` }>`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: ${({ $color }) => $color};
`;

export const PlainRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
`;

export const PlainRowPressable = styled.Pressable`
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
`;

export const PlainRowText = styled.View`
  flex: 1;
  justify-content: center;
`;

export const PlainRowSupporting = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 10.5px;
  font-weight: 500;
  margin-top: 2px;
  color: ${({ $color }) => $color};
`;

export const ThemeDivider = styled.View<{ $color: string }>`
  height: 1px;
  margin-left: 20px;
  margin-right: 20px;
  background-color: ${({ $color }) => $color};
`;

export const SwatchScrollerWrap = styled.View`
  flex: 1;
`;

export const FadeOverlay = styled.View`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 56px;
`;

export const FadeGradient = styled(LinearGradient)`
  flex: 1;
`;

export const CustomBallClip = styled.View`
  flex: 1;
  border-radius: 14px;
  overflow: hidden;
`;

export const CustomBallFill = styled.View<{ $color: string }>`
  flex: 1;
  background-color: ${({ $color }) => $color};
`;
