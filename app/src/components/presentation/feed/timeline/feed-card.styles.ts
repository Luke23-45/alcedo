import styled, { css } from 'styled-components/native';
import { CARD_SHADOW } from './timeline-tokens';

/**
 * Card shadow — the spec's `fc` filter (dy 10, blur 14, black 50%) in dark;
 * softened for light.
 */
export const CardShadow = styled.View<{ $radius: number; $dark: boolean }>`
  border-radius: ${({ $radius }) => $radius}px;
  ${({ $dark }) => {
    const s = $dark ? CARD_SHADOW.dark : CARD_SHADOW.light;
    return css`
      shadow-color: ${s.color};
      shadow-offset: 0px ${s.offsetY}px;
      shadow-opacity: ${s.opacity};
      shadow-radius: ${s.radius}px;
      elevation: ${s.elevation};
    `;
  }}
`;
