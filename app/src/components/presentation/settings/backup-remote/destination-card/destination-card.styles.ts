import { type as typeStyle } from '@/styles/theme';
import styled from 'styled-components/native';

// "How it works" accordion body: sits under the disclosure row, aligned to
// the text column (16 + 34 + 12 = 62pt, the shared row anatomy).
export const HowItWorksBody = styled.View`
  padding-left: 62px;
  padding-right: 16px;
  padding-bottom: 16px;
  gap: 6px;
`;

// The two verbatim payload lines: 10.5pt medium on the secondary tone.
export const HowItWorksLine = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '500' })}
  font-size: 10.5px;
  line-height: 14px;
  color: ${({ theme }) => theme.color.content.secondary};
`;
