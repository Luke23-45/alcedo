import styled from 'styled-components/native';
import { type as typeHelper } from '@/styles/theme';
import { sessionPalette } from '../session-tokens';

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  padding-horizontal: 24px;
  margin-top: 20px;
  margin-bottom: 7px;
`;

export const HeaderTitle = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 10px;
  line-height: 13px;
  font-weight: 700;
  letter-spacing: 1.35px;
  color: ${({ theme }) => sessionPalette(theme.isDark).header.title};
`;

export const HeaderCount = styled.Text`
  flex: 1;
  text-align: right;
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 10px;
  line-height: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
  font-variant: tabular-nums;
  color: ${({ theme }) => sessionPalette(theme.isDark).header.count};
`;
