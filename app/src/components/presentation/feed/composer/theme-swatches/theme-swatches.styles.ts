import { LinearGradient } from 'expo-linear-gradient';
import type { StyleProp, ViewStyle } from 'react-native';
import styled from 'styled-components/native';

export const Section = styled.View`
  margin-top: 30px;
`;

export const SectionHeader = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 1.35px;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
  padding-left: 24px;
`;

export const SwatchRow = styled.View`
  flex-direction: row;
  gap: 12px;
  padding-left: 16px;
  padding-right: 17px;
  margin-top: 8px;
`;

export const SwatchPress = styled.Pressable`
  flex: 1;
  align-items: center;
`;

export const SwatchHit = styled.View`
  width: 100%;
  height: 64px;
  align-items: center;
  justify-content: center;
`;

/** Selected ring: −3.5pt inset fill, so it never touches the swatch corner at any size. */
export const RingFill = styled.View`
  position: absolute;
  left: -3.5px;
  right: -3.5px;
  top: -3.5px;
  bottom: -3.5px;
  border-radius: 23.5px;
  overflow: hidden;
`;

export const SwatchShadow = styled.View`
  border-radius: 20px;
  shadow-color: #000000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.45;
  shadow-radius: 12px;
  elevation: 8;
`;

export const Swatch = styled.View`
  width: 100%;
  height: 64px;
  border-radius: 20px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`;

export const SwatchEdge = styled.View`
  position: absolute;
  left: 0.5px;
  right: 0.5px;
  top: 0.5px;
  bottom: 0.5px;
  border-radius: 19.5px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.12);
`;

export const SwatchGloss = styled(LinearGradient)<{ $opacity: number }>`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 50%;
  opacity: ${({ $opacity }) => $opacity};
`;

export const SwatchValue = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: -0.5px;
  color: #ffffff;
`;

/** r9 brand check badge pinned to the swatch's top-right. */
export const CheckBadge = styled.View`
  position: absolute;
  right: -1px;
  top: -1px;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  shadow-color: #ff2d55;
  shadow-offset: 0px 7px;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
  elevation: 6;
`;

export const SwatchLabel = styled.Text<{ $selected: boolean }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.1px;
  margin-top: 8px;
  text-align: center;
  color: ${({ theme, $selected }) =>
    $selected ? (theme.isDark ? '#FFFFFF' : '#1C1C1E') : theme.isDark ? '#86868B' : '#8E8E93'};
`;

/** Absolute overlay fill for LinearGradient layers (RN-only prop). */
export const fill: StyleProp<ViewStyle> = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};
