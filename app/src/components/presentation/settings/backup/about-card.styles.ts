import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

// About rows: 58pt, title x36 13.5/600, chevron x359 (settings-dark.md Screen 6).
export const AboutRow = styled.Pressable`
  min-height: 58px;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 14px;
`;

export const AboutRowTitle = styled.Text`
  flex: 1;
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '600' })}
  font-size: 13.5px;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;
