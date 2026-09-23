import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { alpha, fontWeight, type as typeHelper } from '@/styles/theme';
import { HomeGradient, type HomeGradientVariant } from '@/components/presentation/home/shared/home-gradient';

/* Live totals · 361×68 rx24. Green hairline edge + pulsing sync dot. */

export const StripOuter = styled(HomeGradient).attrs({
  variant: 'cardEdge',
  colors: [alpha('#30D158', 0.26), alpha('#30D158', 0.26), alpha('#30D158', 0.26)] as const,
})<{
  $radius: number;
}>`
  border-radius: ${({ $radius }) => $radius}px;
  padding: 1px;
  ${({ theme }) =>
    theme.isDark
      ? css`
          shadow-color: #000000;
          shadow-offset: 0px 10px;
          shadow-opacity: 0.5;
          shadow-radius: 14px;
          elevation: 8;
        `
      : css`
          shadow-color: #14142b;
          shadow-offset: 0px 8px;
          shadow-opacity: 0.075;
          shadow-radius: 16px;
          elevation: 4;
        `}
`;

export const StripBody = styled(HomeGradient).attrs({
  variant: 'cardBody' as HomeGradientVariant,
})`
  border-radius: 23px;
  overflow: hidden;
  height: 68px;
  flex-direction: row;
  align-items: stretch;
`;

export const Cell = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const CellValue = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 15px;
  line-height: 20px;
  font-weight: ${fontWeight.bold};
  letter-spacing: -0.4px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

export const CellLabel = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 7.5px;
  line-height: 10px;
  font-weight: ${fontWeight.bold};
  letter-spacing: 0.7px;
  margin-top: 6px;
  color: #86868b;
`;

export const Divider = styled.View`
  width: 1px;
  align-self: center;
  height: 40px;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.08) : alpha('#000000', 0.08))};
`;

export const SyncDotSlot = styled(Animated.View)`
  position: absolute;
  top: 9px;
  right: 22px;
`;

export const SyncDot = styled.View`
  width: 6.8px;
  height: 6.8px;
  border-radius: 3.4px;
  background-color: #30d158;
`;
