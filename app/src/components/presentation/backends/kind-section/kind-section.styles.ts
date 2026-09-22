import styled from 'styled-components/native';
import { type } from '@/styles/theme';

export const Wrap = styled.View`
  margin-top: 24px;
`;

export const Supporting = styled.Text`
  ${({ theme }) => type(theme, 'footnote')}
  color: ${({ theme }) => theme.color.content.secondary};
  margin-top: 8px;
  padding-horizontal: 16px;
`;
