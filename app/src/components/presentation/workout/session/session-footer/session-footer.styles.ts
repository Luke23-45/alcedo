import { createElement } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { type as typeHelper } from '@/styles/theme';
import { sessionPalette } from '../session-tokens';

export const FooterGradient = styled(LinearGradient)`
  width: 100%;
`;

export const Hairline = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ theme }) => sessionPalette(theme.isDark).footer.hairline};
`;

export const FooterContent = styled.View`
  padding-horizontal: 16px;
  /* Reference: rest card top at y=664, finish button at y=764. */
  padding-top: 13px;
`;

export const RestSlot = styled.View`
  margin-bottom: 12px;
`;

export const IdleCardInner = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 14px;
`;

export const IdleTexts = styled.View`
  flex: 1;
  margin-left: 12px;
`;

export const IdleLabel = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 9px;
  line-height: 12px;
  font-weight: 700;
  letter-spacing: 1.3px;
  color: ${({ theme }) => sessionPalette(theme.isDark).footer.idleLabel};
`;

export const IdleSub = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.25px;
  color: ${({ theme }) => sessionPalette(theme.isDark).footer.idleSub};
  margin-top: 3px;
`;

export const SkipPill = styled.View`
  width: 64px;
  height: 30px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => sessionPalette(theme.isDark).footer.skipPill};
  border-width: 0.8px;
  border-color: ${({ theme }) => sessionPalette(theme.isDark).footer.skipBorder};
`;

export const SkipText = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  letter-spacing: -0.15px;
  color: ${({ theme }) => sessionPalette(theme.isDark).footer.skipText};
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
  margin-top: 4px;
`;

/**
 * Fade-to-background wash (44pt) pinned above the tab bar.
 * `styled(LinearGradient)` keeps `colors` required in the v6 types even when
 * provided via `.attrs()`, so this hook-driven wrapper supplies them instead
 * (same pattern as rest-timer.styles.ts).
 */
function BottomFadeBase({
  style,
  pointerEvents,
}: {
  style?: StyleProp<ViewStyle>;
  pointerEvents?: 'none' | 'auto' | 'box-none' | 'box-only';
}) {
  const theme = useAppTheme();
  return createElement(LinearGradient, {
    colors: ['rgba(0,0,0,0)', sessionPalette(theme.isDark).footer.fadeEnd] as [string, string],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
    style,
    pointerEvents,
  });
}

export const BottomFade = styled(BottomFadeBase)`
  position: absolute;
  top: -44px;
  left: 0;
  right: 0;
  height: 44px;
`;
