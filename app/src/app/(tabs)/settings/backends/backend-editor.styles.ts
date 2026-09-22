import styled from 'styled-components/native';
import { type } from '@/styles/theme';

export const DeleteRow = styled.Pressable`
  margin-top: 32px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
`;

export const DeleteLabel = styled.Text`
  ${({ theme }) => type(theme, 'body')}
  color: ${({ theme }) => theme.color.status.danger.base};
`;
