import styled from 'styled-components/native';

/**
 * Screen-level section rhythm for Trends Overview. Gaps are taken from the
 * reference: 12pt between chromeless blocks, 17pt before a labeled section
 * (label 13pt + 12pt margin = 42pt card-to-card).
 */
export const HeaderGroup = styled.View`
  flex-direction: column;
  gap: 12px;
`;

export const SectionGap12 = styled.View`
  margin-top: 12px;
`;

export const SectionGap17 = styled.View`
  margin-top: 17px;
`;
