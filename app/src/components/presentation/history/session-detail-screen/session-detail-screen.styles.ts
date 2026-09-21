import styled from 'styled-components/native';

export const Screen = styled.View`
  flex: 1;
`;

export const Body = styled.View`
  padding-horizontal: 16px;
  /* Reference: the delete ghost ends at 1812; the home indicator sits at 1828. */
  padding-bottom: 32px;
`;

export const Section = styled.View`
  /* Reference: 12pt card-to-card rhythm. */
  margin-top: 12px;
`;
