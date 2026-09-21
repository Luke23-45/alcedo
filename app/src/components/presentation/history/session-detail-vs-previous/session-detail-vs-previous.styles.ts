import styled from 'styled-components/native';

export const Title = styled.Text`
  font-size: 15.5px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const Empty = styled.Text`
  margin-top: 8px;
  font-size: 13px;
  line-height: 17px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.secondary};
`;
