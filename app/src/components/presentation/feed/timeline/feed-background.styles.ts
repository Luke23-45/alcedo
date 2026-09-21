import styled from 'styled-components/native';

/**
 * Absolute background layer behind the feed list. Height follows the measured
 * scroll content so the auras sit at their spec positions down the page.
 */
export const BackgroundLayer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;
