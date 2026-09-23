import styled from 'styled-components/native';
import { type as typeHelper } from '@/styles/theme';
import { sessionPalette } from '../session-tokens';

export const CardWrap = styled.View`
  min-height: 102px;
  margin-horizontal: 16px;
`;

export const CardInner = styled.View`
  flex: 1;
  padding-top: 21px;
  align-items: center;
`;

export const Label = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 9px;
  line-height: 12px;
  font-weight: 700;
  letter-spacing: 1.3px;
  color: ${({ theme }) => sessionPalette(theme.isDark).elapsed.label};
  /* Optically centered at x=180 (not the card center): compensates the LIVE pill. */
  margin-right: 33px;
`;

export const TimerText = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 42px;
  line-height: 50px;
  font-weight: 700;
  letter-spacing: -1.6px;
  font-variant: tabular-nums;
  color: ${({ theme }) => sessionPalette(theme.isDark).elapsed.value};
  /* Reference timer baseline sits at y=182 (card-rel 78). */
  margin-top: 8px;
`;

export const LivePill = styled.View`
  position: absolute;
  top: 14px;
  right: 16px;
  height: 20px;
  padding-horizontal: 8px;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => sessionPalette(theme.isDark).elapsed.livePill};
`;

export const LiveLabel = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 9px;
  line-height: 12px;
  font-weight: 700;
  letter-spacing: 0.7px;
  color: ${({ theme }) => sessionPalette(theme.isDark).elapsed.liveText};
  margin-left: 6px;
`;
