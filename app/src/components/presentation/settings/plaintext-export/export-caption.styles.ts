import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

// Verbatim audit caption under the nav title (S4: 13/500, secondary).
export const CaptionWrap = styled.View`
  padding-left: 24px;
  padding-right: 24px;
  margin-bottom: 24px;
`;

export const CaptionText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '500' })}
  color: ${({ theme }) => theme.color.content.secondary};
`;
