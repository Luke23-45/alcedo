import styled from 'styled-components/native';
import { type as typeHelper } from '@/styles/theme';

export const HeaderWrap = styled.View<{ $topPad: number }>`
  align-items: center;
  padding-left: 32px;
  padding-right: 32px;
  padding-top: ${({ $topPad }) => $topPad}px;
`;

export const HeaderTitle = styled.Text<{ $large: boolean }>`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: ${({ $large }) => ($large ? 28 : 24)}px;
  font-weight: 700;
  letter-spacing: -0.55px;
  text-align: center;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const HeaderSubtitle = styled.Text<{ $large: boolean; $color: string }>`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: ${({ $large }) => ($large ? 14 : 13)}px;
  font-weight: 500;
  text-align: center;
  margin-top: 8px;
  color: ${({ $color }) => $color};
`;
