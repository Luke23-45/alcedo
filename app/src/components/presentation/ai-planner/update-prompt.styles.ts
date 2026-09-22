import styled from 'styled-components/native';
import { type } from '@/styles/theme';

export const UpdateBody = styled.View`
  gap: ${({ theme }) => theme.space.sm}px;
`;

export const UpdateTitle = styled.Text`
  ${({ theme }) => type(theme, 'title2', { weight: '700' })}
  color: ${({ theme }) => theme.color.content.primary};
`;

export const UpdateDescription = styled.Text`
  ${({ theme }) => type(theme, 'subheadline')}
  color: ${({ theme }) => theme.color.content.secondary};
`;
