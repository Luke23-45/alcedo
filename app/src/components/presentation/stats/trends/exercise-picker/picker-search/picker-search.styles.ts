import styled, { css } from 'styled-components/native';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';

/* Search field: 361×38 rx12. Focused state per the reference: white .08 fill,
   1.8pt brand-gradient stroke, and a soft #FF6A3D glow. */

export const SearchOuter = styled.View<{ $focused: boolean }>`
  margin-left: 16px;
  margin-right: 16px;
  margin-top: 12px;
  border-radius: 12px;
  ${({ $focused }) =>
    $focused
      ? css`
          shadow-color: #ff6a3d;
          shadow-offset: 0px 0px;
          shadow-opacity: 0.4;
          shadow-radius: 5px;
        `
      : ''}
`;

export const BorderGradient = styled(HomeGradient).attrs({ variant: 'brand' })`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
`;

export const FieldInner = styled.View<{ $focused: boolean }>`
  height: 38px;
  border-radius: ${({ $focused }) => ($focused ? 10 : 12)}px;
  ${({ $focused }) =>
    $focused
      ? css`
          margin-top: 1.8px;
          margin-left: 1.8px;
          margin-right: 1.8px;
          margin-bottom: 1.8px;
        `
      : ''}
  flex-direction: row;
  align-items: center;
  padding-left: 15px;
  padding-right: 12px;
  gap: 10px;
  background-color: ${({ theme, $focused }) =>
    $focused
      ? 'rgba(255,255,255,0.08)'
      : theme.isDark
        ? 'rgba(255,255,255,0.06)'
        : 'rgba(120,120,128,0.12)'};
  ${({ theme, $focused }) =>
    !$focused && theme.isDark
      ? css`
          border-width: 1px;
          border-color: rgba(255, 255, 255, 0.09);
        `
      : ''}
`;
