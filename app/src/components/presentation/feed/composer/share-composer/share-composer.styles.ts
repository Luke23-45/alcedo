import type { StyleProp, ViewStyle } from 'react-native';
import styled from 'styled-components/native';

/** Absolute overlay fill for LinearGradient layers (RN-only prop). */
export const fill: StyleProp<ViewStyle> = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

/** Screen background layers sit behind the scroll content (RN-only props). */
export const BackgroundFill = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

export const Aura = styled.View`
  position: absolute;
  top: 280px;
  left: 0;
  right: 0;
  height: 700px;
`;

/** Top safe-area inset rides a transient prop so no style object escapes. */
export const TopInset = styled.View<{ $top: number }>`
  padding-top: ${({ $top }) => $top}px;
`;

export const BottomPad = styled.View`
  height: 32px;
`;
