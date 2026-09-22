import styled from 'styled-components/native';

export const AccountContent = styled.View`
  padding-top: 16px;
  padding-bottom: 28px;
`;

export const Footnote = styled.Text`
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.color.content.secondary};
  padding-horizontal: 32px;
  padding-top: 4px;
`;
