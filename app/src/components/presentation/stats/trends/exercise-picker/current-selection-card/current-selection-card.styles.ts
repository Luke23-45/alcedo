import styled, { css } from 'styled-components/native';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';

/* Current-selection card: 361×60 rx20, gradient tint + #FF2D55 stroke
   (.38 dark / .30 light), dy6/blur8 shadow. */

export const CardOuter = styled.View`
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 12px;
  margin-bottom: 10px;
  height: 60px;
  border-radius: 20px;
  ${({ theme }) =>
    theme.isDark
      ? css`
          shadow-color: #000000;
          shadow-offset: 0px 6px;
          shadow-opacity: 0.42;
          shadow-radius: 8px;
          elevation: 4;
        `
      : css`
          shadow-color: #14142b;
          shadow-offset: 0px 5px;
          shadow-opacity: 0.06;
          shadow-radius: 10px;
          elevation: 2;
        `}
`;

export const TintLayer = styled(HomeGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
`;

export const StrokeLayer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  border-width: 1px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255,45,85,0.38)' : 'rgba(255,45,85,0.3)')};
`;

export const CardContent = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  padding-right: 19px;
  gap: 12px;
`;

export const IconTile = styled.View<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $color }) => $color};
`;

export const TextBlock = styled.View`
  flex: 1;
`;

export const CheckBadge = styled.View`
  width: 26px;
  height: 26px;
  border-radius: 13px;
  align-items: center;
  justify-content: center;
  background-color: #30d158;
`;
