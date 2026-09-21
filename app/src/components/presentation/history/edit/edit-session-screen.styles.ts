import styled, { css } from 'styled-components/native';
import { alpha, fontWeight } from '@/styles/theme';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';

/* ------------------------------------------------------------------ *
 * Edit Session screen (spec 393×1548): atmospheric background, modal
 * nav, section stack, destructive ghost, sticky save bar.
 * ------------------------------------------------------------------ */

export const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => (theme.isDark ? '#050507' : theme.color.background.base)};
`;

export const BgGradient = styled(HomeGradient).attrs(({ theme }) => ({
  variant: 'screen' as const,
  colors: (theme.isDark ? ['#0B0B0E', '#050507', '#08080B'] : ['#FFFFFF', '#F2F2F7']) as unknown as readonly [
    string,
    string,
    ...string[],
  ],
  start: { x: 0, y: 0 },
  end: { x: 0.25, y: 1 },
}))`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

/* Nav — modal style: Cancel / centered title / menu. */

export const NavBar = styled.View<{ $top: number }>`
  padding-top: ${({ $top }) => $top}px;
  height: ${({ $top }) => $top + 60}px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 8px;
`;

export const NavCancel = styled.Pressable`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
`;

export const NavCancelText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 16px;
  font-weight: ${fontWeight.regular};
  letter-spacing: -0.3px;
  color: ${({ theme }) => (theme.isDark ? '#8E8E93' : '#007AFF')};
`;

export const NavTitle = styled.Text`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  text-align: center;
  text-align-vertical: center;
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15px;
  font-weight: ${fontWeight.semibold};
  letter-spacing: -0.3px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

export const NavMenuSlot = styled.View`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  margin-left: auto;
`;

/* Content stack. */

export const Section = styled.View<{ $gap: number }>`
  margin-top: ${({ $gap }) => $gap}px;
`;

/* Delete Session — destructive ghost, 361×48 rx24. */

export const DeleteButton = styled.Pressable`
  width: 100%;
  height: 48px;
  border-radius: 24px;
  align-items: center;
  justify-content: center;
  background-color: ${alpha('#FF3B30', 0.1)};
  border-width: 1px;
  border-color: ${alpha('#FF3B30', 0.22)};
`;

export const DeleteLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 14.5px;
  font-weight: ${fontWeight.semibold};
  letter-spacing: -0.25px;
  color: ${({ theme }) => (theme.isDark ? '#FF6B60' : '#D70015')};
`;

/* Sticky save bar — 136 tall + safe area. */

export const SaveBar = styled(HomeGradient).attrs(({ theme }) => ({
  variant: 'screen' as const,
  colors: (theme.isDark
    ? [alpha('#15151A', 0.94), alpha('#0C0C10', 0.99)]
    : ['#FFFFFF', '#F4F4F6']) as unknown as readonly [string, string, ...string[]],
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
}))<{ $bottom: number }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 14px;
  padding-bottom: ${({ $bottom }) => Math.max($bottom, 12)}px;
  padding-horizontal: 16px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.11) : alpha('#000000', 0.08))};
`;

export const SaveOuter = styled(HomeGradient).attrs({
  variant: 'cardEdge' as const,
  colors: [alpha('#FFFFFF', 0.22), alpha('#FFFFFF', 0.22), alpha('#FFFFFF', 0.22)] as const,
})`
  border-radius: 27px;
  padding: 1px;
  ${({ theme }) =>
    theme.isDark
      ? css`
          shadow-color: #ff2d55;
          shadow-offset: 0px 7px;
          shadow-opacity: 0.5;
          shadow-radius: 12px;
          elevation: 8;
        `
      : css`
          shadow-color: #ff2d55;
          shadow-offset: 0px 7px;
          shadow-opacity: 0.32;
          shadow-radius: 12px;
          elevation: 6;
        `}
`;

/** Spec brand button: #FFB03A → #FF6A3D → #FF2D55 at 0/.45/1, (0,0)→(.6,1). */
export const SaveBody = styled(HomeGradient).attrs({
  variant: 'brand' as const,
})`
  border-radius: 26px;
  height: 52px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

/** Top gloss: white .30 → 0 over the top 35%. */
export const SaveGloss = styled(HomeGradient).attrs({
  variant: 'gloss' as const,
})`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 35%;
`;

export const SaveLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 16px;
  font-weight: ${fontWeight.semibold};
  letter-spacing: -0.3px;
  color: #ffffff;
`;

export const SaveCaption = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10.5px;
  font-weight: ${fontWeight.medium};
  color: #6c6c70;
  text-align: center;
  margin-top: 10px;
`;
