import styled from 'styled-components/native';
import { type as typeHelper } from '@/styles/theme';
import { sessionPalette } from '../session-tokens';

/** In-flow section: same 16/12/16 rhythm as the rest of the screen. */
export const Section = styled.View`
  margin-horizontal: 16px;
  margin-top: 12px;
  margin-bottom: 16px;
`;

export const TimerSlot = styled.View`
  margin-bottom: 12px;
`;

export const FinishPressable = styled.Pressable`
  height: 54px;
  border-radius: 27px;
`;

export const DisabledFinish = styled.View`
  flex: 1;
  border-radius: 27px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => sessionPalette(theme.isDark).footer.finishDisabledBg};
  border-width: 1px;
  border-color: ${({ theme }) => sessionPalette(theme.isDark).footer.finishDisabledBorder};
`;

export const FinishLabel = styled.Text<{ $enabled: boolean }>`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 16px;
  line-height: 22px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${({ theme, $enabled }) =>
    $enabled ? sessionPalette(theme.isDark).brand.label : sessionPalette(theme.isDark).footer.finishDisabledText};
`;

export const Hint = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 10px;
  line-height: 14px;
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => sessionPalette(theme.isDark).footer.hint};
  margin-top: 8px;
`;
