import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

// "JSON shape" (S4): the alternative export shape, stated plainly.
export const JsonShapeWrap = styled.View`
  margin-bottom: 16px;
`;

export const JsonShapeText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '500' })}
  color: ${({ theme }) => theme.color.content.primary};
`;
