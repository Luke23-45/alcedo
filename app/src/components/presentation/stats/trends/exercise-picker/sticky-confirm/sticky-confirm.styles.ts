import styled, { css } from 'styled-components/native';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';

/* Sticky confirmation: tb bar (gradient + hairline), brand-gradient 361×54
   rx27 button with top-half gloss and white edge, helper line. */

export const ConfirmWrap = styled.View`
  position: relative;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 12px;
`;

export const BarGradient = styled(HomeGradient)`
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

export const ConfirmButton = styled.Pressable<{ $disabled: boolean }>`
  height: 54px;
  border-radius: 27px;
  align-items: center;
  justify-content: center;
  ${({ $disabled }) => ($disabled ? 'opacity: 0.55;' : '')}
  ${({ $disabled }) =>
    $disabled
      ? ''
      : css`
          shadow-color: #ff2d55;
          shadow-offset: 0px 7px;
          shadow-opacity: 0.5;
          shadow-radius: 12px;
          elevation: 6;
        `}
`;

export const ButtonGradient = styled(HomeGradient).attrs({ variant: 'brand' })`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 27px;
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

/* Gloss is the top half only, at 35% (per the reference). */
export const GlossLayer = styled(HomeGradient).attrs({ variant: 'gloss' })`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 27px;
  border-radius: 27px;
  opacity: 0.35;
`;

export const ConfirmLabelWrap = styled.View`
  padding-top: 6px;
  padding-bottom: 6px;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;
