import styled from 'styled-components/native';
import { type as typeHelper } from '@/styles/theme';
import { sessionPalette } from '../session-tokens';

export const EmptyWrap = styled.View`
  align-items: center;
  padding-top: 46px;
  padding-horizontal: 16px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 19px;
  line-height: 24px;
  /* Spec says 650; RN renders non-hundred weights as Regular — 600 is nearest. */
  font-weight: 600;
  letter-spacing: -0.4px;
  text-align: center;
  color: ${({ theme }) => sessionPalette(theme.isDark).empty.title};
  margin-top: 34px;
`;

export const Body = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 12.5px;
  line-height: 18px;
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => sessionPalette(theme.isDark).empty.body};
  margin-top: 8px;
`;

export const ButtonWrap = styled.View`
  margin-top: 24px;
`;
