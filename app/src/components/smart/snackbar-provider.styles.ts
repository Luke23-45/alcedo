import styled from 'styled-components/native';
import { StyleSheet, ViewStyle } from 'react-native';
import { AppTheme, type as typeStyle } from '@/styles/theme';

// Two-line toast (backup redesign): a fixed-white surface in both modes, so the
// semantic colors below are fixed too — each is AA on white. The legacy
// one-line snackbar keeps Paper's default rendering and is untouched.

// --- Paper prop styles --------------------------------------------------------

/** Pins the toast below the nav (design: top offset 76, full-bleed margins). */
export const toastWrapperStyle: ViewStyle = {
  top: 76,
  bottom: undefined,
  paddingHorizontal: 0,
  paddingBottom: 0,
};

/** White rounded toast surface (design: h76, radius 18, 16pt side margins). */
export function toastSurfaceStyle(theme: AppTheme): ViewStyle {
  return {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    marginVertical: 0,
    minHeight: 76,
    // Light mode: black .12 hairline per the design's light-mode delta.
    borderWidth: theme.mode === 'light' ? StyleSheet.hairlineWidth : 0,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    shadowColor: '#000000',
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  };
}

/** Paper's default content insets are replaced by the row's own padding. */
export const toastContentStyle: ViewStyle = {
  marginHorizontal: 0,
  marginVertical: 0,
  paddingHorizontal: 16,
  paddingVertical: 14,
};

// --- Toast content ------------------------------------------------------------

/** Fixed semantic colors, AA on the white toast surface in both modes. */
export const TOAST_TONE_COLORS = {
  success: '#1B7C3A',
  error: '#D70015',
  neutral: '#1C1C1E',
} as const;

export type ToastTone = keyof typeof TOAST_TONE_COLORS;

export const ToastRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  min-height: 48px;
`;

export const ToastTexts = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
`;

export const ToastTitle = styled.Text<{ $tone: ToastTone }>`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '600' })}
  color: ${({ $tone }) => TOAST_TONE_COLORS[$tone]};
`;

export const ToastSubtitle = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote')}
  color: #3a3a3c;
`;

/** Retry chip: danger-outline pill, 44pt minimum target. */
export const ToastRetryChip = styled.Pressable`
  min-width: 44px;
  min-height: 44px;
  padding-horizontal: 18px;
  border-radius: 22px;
  border-width: 1.5px;
  border-color: ${TOAST_TONE_COLORS.error};
  align-items: center;
  justify-content: center;
`;

export const ToastRetryLabel = styled.Text`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '600' })}
  color: ${TOAST_TONE_COLORS.error};
`;
