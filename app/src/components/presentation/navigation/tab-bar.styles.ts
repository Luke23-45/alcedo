import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { Animated } from 'react-native';
import styled from 'styled-components/native';

/**
 * Bottom tab bar chrome — the runtime rig from docs/new_design/tab-bar-icons.svg §3.
 * Glass gradient surface, 0.5pt top hairline, 24pt glyphs, 10pt labels.
 */

export const Bar = styled(LinearGradient)``;

export const Hairline = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ theme }) => theme.color.tabBar.hairline};
`;

export const Row = styled.View<{ $padBottom: number }>`
  flex-direction: row;
  padding-bottom: ${({ $padBottom }) => $padBottom}px;
`;

export const TabButton = styled.Pressable`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding-top: 10px;
  min-height: 56px;
`;

export const IconSlot = styled.View`
  width: 24px;
  height: 24px;
`;

/** Absolute glyph layer for the selected-state cross-fade; opacity is animated. */
export const IconLayer = styled(Animated.View)`
  position: absolute;
  left: 0;
  top: 0;
`;

export const Badge = styled.View`
  position: absolute;
  top: -5px;
  right: -9px;
  min-width: 18px;
  height: 18px;
  padding-horizontal: 5px;
  border-radius: 9px;
  background-color: ${({ theme }) => theme.color.status.danger.base};
  align-items: center;
  justify-content: center;
`;

export const BadgeText = styled.Text`
  color: #ffffff;
  font-size: 11px;
  line-height: 13px;
  font-weight: ${({ theme }) => theme.weight.semibold};
`;

/**
 * Spec §5: 10pt, semibold when selected / medium when resting,
 * −0.1 tracking. No named text style covers 10pt, so this is explicit.
 */
export const TabLabel = styled.Text<{ selected: boolean }>`
  margin-top: 4px;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: -0.1px;
  font-weight: ${({ theme, selected }) => (selected ? theme.weight.semibold : theme.weight.medium)};
  color: ${({ theme, selected }) => (selected ? theme.color.tabBar.selected : theme.color.tabBar.unselected)};
`;
