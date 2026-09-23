import styled from 'styled-components/native';
import { type as typeHelper } from '@/styles/theme';

export const SectionLabelText = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.35px;
  text-transform: uppercase;
  margin-left: 24px;
  margin-bottom: 8px;
  color: ${({ $color }) => $color};
`;

export const SectionGap = styled.View`
  height: 16px;
`;
