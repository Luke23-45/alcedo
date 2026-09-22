import TouchableRipple from '@/components/presentation/foundation/touchable-ripple';
import type { AppTheme } from '@/styles/theme';
import styled from 'styled-components/native';

/**
 * `TouchableRipple`'s props carry react-native-paper's own `theme`, which
 * shadows `DefaultTheme` inside `styled(...)` interpolations — so every
 * interpolation here re-annotates it with the app theme.
 */
type RippleProps = { theme: AppTheme };

/** The colour line: the "Default" button followed by the swatch strip. */
export const SwatchRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.base}px;
  margin-block-start: ${({ theme }) => theme.space.sm}px;
`;

/**
 * The swatch strip. A plain horizontal `ScrollView`, deliberately not a
 * `FlatList`: a VirtualizedList nested in the wizard's horizontal pager shares
 * its orientation, which breaks windowing (React Native warns about exactly
 * that), and nine fixed swatches need no virtualisation.
 */
export const SwatchScroller = styled.ScrollView.attrs(({ theme }) => ({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    gap: theme.space.sm,
    padding: theme.space.sm,
    alignItems: 'center' as const,
  },
}))``;

/** Clips a preset swatch's fill to the sheet radius. */
export const BallClip = styled.View`
  border-radius: ${({ theme }) => theme.radius.sheet}px;
  overflow: hidden;
`;

export const BallSurface = styled(TouchableRipple)<{ $color: `#${string}` }>`
  width: ${({ theme }: RippleProps) => theme.space.xxl}px;
  height: ${({ theme }: RippleProps) => theme.space.xxl}px;
  border-radius: ${({ theme }: RippleProps) => theme.radius.sheet}px;
  border-width: 2px;
  border-color: ${({ theme }: RippleProps) => theme.color.border.hairline};
  background-color: ${({ $color }) => $color};
`;

/** The "any colour" ball: a circular clip for the hue ring / custom fill. */
export const CustomBallClip = styled.View`
  border-radius: ${({ theme }) => theme.space.xxl}px;
  overflow: hidden;
`;

export const CustomBallSurface = styled(TouchableRipple)`
  width: ${({ theme }: RippleProps) => theme.space.xxl}px;
  height: ${({ theme }: RippleProps) => theme.space.xxl}px;
  border-radius: ${({ theme }: RippleProps) => theme.space.xxl}px;
  border-width: 2px;
  border-color: ${({ theme }: RippleProps) => theme.color.border.hairline};
  overflow: hidden;
`;

export const BallFill = styled.View<{ $color: string }>`
  flex: 1;
  background-color: ${({ $color }) => $color};
`;
