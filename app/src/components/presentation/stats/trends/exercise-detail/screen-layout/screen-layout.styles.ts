import styled from 'styled-components/native';

export const Body = styled.View`
  gap: 12px;
  margin-top: 12px;
`;

export const EmptyWrap = styled.View`
  align-items: center;
  padding-top: 48px;
`;

export const EmptyText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.color.content.secondary};
`;
