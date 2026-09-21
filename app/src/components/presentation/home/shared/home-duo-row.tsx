import styled from 'styled-components/native';

/**
 * Side-by-side pair for the Hydration / Macros cards. Reference geometry on a
 * 393pt canvas: 174pt cards at x=16 and x=203, i.e. a 13pt gutter. Each cell
 * stretches so both cards share the row height.
 */
export const HomeDuoRow = styled.View`
  flex-direction: row;
  gap: 13px;
`;

export const HomeDuoCell = styled.View`
  flex: 1;
`;
