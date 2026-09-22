import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * Appearance card (settings-dark.md Screen 2): theme segmented control,
 * accent swatches, celebration + reduce-motion toggles.
 */

export const Block = styled.View`
  padding-top: 24px;
  padding-bottom: 8px;
`;

export const SegmentedWrap = styled.View`
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 12px;
`;

export const AccentLabelWrap = styled.View`
  margin-top: 24px;
`;

export const SwatchRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 8px;
  min-height: 44px;
`;

// 52pt pitch per the spec (32pt visual + 20pt gap); visual left-aligned so
// the first swatch's edge sits on the 20pt padding.
export const SwatchButton = styled.Pressable`
  width: 52px;
  height: 44px;
  align-items: flex-start;
  justify-content: center;
`;

export const SwatchVisual = styled.View`
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
`;

// Selected ring: r19.5, 2pt stroke, white .85 dark / ink .85 light.
export const SwatchRing = styled.View`
  position: absolute;
  width: 39px;
  height: 39px;
  border-radius: 19.5px;
  border-width: 2px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.85)' : 'rgba(28,28,30,0.85)')};
`;

// Visual swatch: r16.
export const SwatchCircle = styled.View<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ $color }) => $color};
`;

export const SwatchGradient = styled(LinearGradient).attrs({
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  width: 32px;
  height: 32px;
  border-radius: 16px;
`;

export const RowsBlock = styled.View`
  margin-top: 12px;
`;
