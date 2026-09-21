import { LinearGradient } from 'expo-linear-gradient';
import { type as typeStyle } from '@/styles/theme';
import styled, { css } from 'styled-components/native';

// Floating footer (backup-redesign.md S1 + S3): a hairline-topped toolbar
// with the Test primary pill and the Manage backends secondary pill. The
// brand gradient is the spec's `br` (amber → coral → crimson) — the one
// high-energy fill on the screen.

// Toolbar bar: the spec's `tb` gradient with a top hairline.
export const FooterBar = styled.View`
  border-top-width: 1px;
  border-top-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.11)' : 'rgba(60,60,67,0.12)')};
  background-color: ${({ theme }) =>
    theme.isDark ? 'rgba(21,21,26,0.94)' : 'rgba(255,255,255,0.94)'};
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 12px;
  padding-bottom: 12px;
  gap: 12px;
`;

const buttonBase = css`
  min-height: 54px;
  border-radius: 27px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding-horizontal: 20px;
`;

// Test primary: brand gradient pill, white 600 label, crimson shadow. When
// disabled (no server assigned) it falls back to a quiet fill.
export const TestButtonSurface = styled(LinearGradient)`
  ${buttonBase}
  shadow-color: #ff2d55;
  shadow-offset: 0px 7px;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
  elevation: 6;
`;

export const TestButtonDisabled = styled.View`
  ${buttonBase}
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(120,120,128,0.12)')};
`;

export const TestLabel = styled.Text<{ $disabled: boolean }>`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '600' })}
  font-size: 15px;
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.color.content.tertiary : theme.color.content.onAccent};
`;

// Manage backends secondary: outlined pill, primary-color 600 label.
export const ManageButton = styled.Pressable`
  ${buttonBase}
  border-width: 1px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(60,60,67,0.18)')};
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)')};
`;

export const ManageLabel = styled.Text`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '600' })}
  font-size: 15px;
  color: ${({ theme }) => theme.color.content.primary};
`;

// "Disabled · no backup server assigned" (backup-redesign.md S1): 10pt
// tertiary, centered under the Test pill.
export const DisabledCaption = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption1', { weight: '500' })}
  font-size: 10px;
  color: ${({ theme }) => theme.color.content.tertiary};
  text-align: center;
`;

// Pressable wrapper so the gradient surface can carry the 44pt+ target and
// the press/opacity behavior while the surface itself stays a pure visual.
export const TestPressable = styled.Pressable`
  border-radius: 27px;
`;
