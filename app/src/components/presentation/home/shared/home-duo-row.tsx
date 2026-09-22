import styled from 'styled-components/native';

/**
 * Side-by-side pair for the Hydration / Macros cards. 12pt gutter per the
 * skill (not the 393-only 13pt measure). Each cell stretches so both cards
 * share the row height.
 */
export const HomeDuoRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

export const HomeDuoCell = styled.View`
  flex: 1;
`;
