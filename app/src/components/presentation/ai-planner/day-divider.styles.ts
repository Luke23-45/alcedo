import styled from 'styled-components/native';
import { type } from '@/styles/theme';

export const Wrap = styled.View`
  align-items: center;
  padding: 10px 0px 6px;
`;

export const Label = styled.Text`
  ${({ theme }) => type(theme, 'footnote')}
  color: ${({ theme }) => theme.color.content.secondary};
`;
