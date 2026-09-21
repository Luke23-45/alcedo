import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { alpha, fontWeight } from '@/styles/theme';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';

/* ------------------------------------------------------------------ *
 * Exercises section (Edit Session spec): header, 361×74 rx22 rows with
 * grip handles, set chips, dashed add-set chips, and the nested inline
 * set editor panel (rx18 inside rx22 = concentric ✓).
 * ------------------------------------------------------------------ */

export const SectionHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 8px;
  margin-bottom: 12px;
`;

export const SectionLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  font-weight: ${fontWeight.bold};
  letter-spacing: 1.35px;
  text-transform: uppercase;
  color: #86868b;
`;

export const DragHint = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  font-weight: ${fontWeight.semibold};
  letter-spacing: 0.2px;
  color: #6c6c70;
`;

/* Row · collapsed 74, expanded 242. Pitch 84 (74 + 10 gap). */

export const RowSlot = styled(Animated.View)<{ $height: number }>`
  height: ${({ $height }) => $height}px;
  margin-bottom: 10px;
`;

export const RowOuter = styled(HomeGradient).attrs<{ $focused: boolean }>((props) => ({
  variant: 'cardEdge' as const,
  colors: props.$focused
    ? ([alpha('#FF6A3D', 0.42), alpha('#FF6A3D', 0.42), alpha('#FF6A3D', 0.42)] as const)
    : undefined,
}))<{ $radius: number; $focused: boolean }>`
  border-radius: ${({ $radius }) => $radius}px;
  padding: ${({ $focused }) => ($focused ? '1.2px' : '1px')};
  flex: 1;
  ${({ theme }) =>
    theme.isDark
      ? css`
          shadow-color: #000000;
          shadow-offset: 0px 6px;
          shadow-opacity: 0.42;
          shadow-radius: 8px;
          elevation: 4;
        `
      : css`
          shadow-color: #14142b;
          shadow-offset: 0px 5px;
          shadow-opacity: 0.06;
          shadow-radius: 10px;
          elevation: 2;
        `}
  ${({ $focused }) =>
    !$focused
      ? ''
      : css`
          elevation: 0;
        `}
`;

export const RowBody = styled(HomeGradient).attrs({ variant: 'cardBody' })<{
  $radius: number;
}>`
  border-radius: ${({ $radius }) => $radius}px;
  overflow: hidden;
  flex: 1;
`;

/* RowTop is absolutely laid out like the spec: name baseline at top+24,
 * set chips at top+34. */

export const RowTop = styled.View`
  height: 74px;
`;

export const RowLine = styled.View`
  position: absolute;
  top: 7px;
  left: 0;
  right: 0;
  height: 34px;
  flex-direction: row;
  align-items: center;
  padding-right: 20px;
`;

export const HandleBox = styled.View`
  width: 44px;
  height: 44px;
  justify-content: center;
  align-items: flex-start;
  padding-left: 14px;
`;

export const RowTexts = styled.View`
  flex: 1;
  justify-content: center;
  margin-left: -20px;
`;

export const RowName = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13.5px;
  font-weight: ${fontWeight.semibold};
  letter-spacing: -0.2px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

export const RowVolume = styled.Text<{ $pr?: boolean }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12.5px;
  font-weight: ${fontWeight.bold};
  letter-spacing: -0.25px;
  color: ${({ theme, $pr }) => ($pr ? '#FFD84D' : theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

/* Set chips · 58×26 rx13. */

export const ChipsRow = styled.View`
  position: absolute;
  top: 34px;
  left: 0;
  right: 0;
  height: 26px;
  flex-direction: row;
  align-items: center;
  padding-left: 38px;
  padding-right: 12px;
`;

export const SetChip = styled.Pressable<{ $focused: boolean }>`
  width: 58px;
  height: 26px;
  border-radius: 13px;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  background-color: ${({ theme, $focused }) =>
    $focused ? alpha('#FFFFFF', 0.14) : theme.isDark ? alpha('#FFFFFF', 0.08) : alpha('#787880', 0.12)};
  border-width: ${({ $focused }) => ($focused ? '1.6px' : '0.8px')};
  border-color: ${({ theme, $focused }) =>
    $focused ? '#FF6A3D' : theme.isDark ? alpha('#FFFFFF', 0.1) : alpha('#000000', 0.1)};
`;

export const SetChipText = styled.Text<{ $focused: boolean }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  font-weight: ${({ $focused }) => ($focused ? fontWeight.bold : fontWeight.semibold)};
  letter-spacing: -0.1px;
  color: ${({ theme, $focused }) => ($focused && theme.isDark ? '#FFFFFF' : theme.isDark ? '#C7C7CC' : '#3A3A3C')};
`;

export const AddSetChip = styled.Pressable`
  width: 50px;
  height: 26px;
  border-radius: 13px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.05) : alpha('#000000', 0.03))};
  border-width: 1px;
  border-style: dashed;
  border-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.14) : alpha('#000000', 0.18))};
`;

/* PR chip · 28×15 rx7.5 gold. */

export const PrChip = styled.View`
  height: 15px;
  border-radius: 7.5px;
  padding-horizontal: 7px;
  margin-left: 8px;
  align-items: center;
  justify-content: center;
  background-color: ${alpha('#FFD60A', 0.18)};
  border-width: 0.7px;
  border-color: ${alpha('#FFD60A', 0.28)};
`;

export const PrChipText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 7.5px;
  font-weight: ${fontWeight.bold};
  letter-spacing: 0.5px;
  color: #ffd84d;
`;

/* Inline set editor panel · nested, rx18, h=140. */

export const EditorPanel = styled.View`
  margin-horizontal: 14px;
  margin-top: 10px;
  height: 140px;
  border-radius: 18px;
  padding-horizontal: 16px;
  padding-top: 14px;
  padding-bottom: 18px;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.045) : alpha('#787880', 0.08))};
  border-width: 0.9px;
  border-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.08) : alpha('#000000', 0.08))};
`;

export const EditorHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const EditorTitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 8.5px;
  font-weight: ${fontWeight.bold};
  letter-spacing: 0.9px;
  text-transform: uppercase;
  color: #86868b;
`;

export const DeleteSetButton = styled.Pressable`
  padding-vertical: 6px;
  padding-left: 12px;
`;

export const DeleteSetText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10.5px;
  font-weight: ${fontWeight.semibold};
  letter-spacing: -0.1px;
  color: #ff6b60;
`;

export const StepperRow = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const StepperLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12px;
  font-weight: ${fontWeight.medium};
  color: #98989f;
`;

export const StepperControls = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

export const StepperButton = styled.Pressable`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
`;

export const StepperValue = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15px;
  font-weight: ${fontWeight.bold};
  letter-spacing: -0.35px;
  min-width: 64px;
  text-align: center;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

export const StepperDivider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.06) : alpha('#000000', 0.06))};
`;

export const EmptyRows = styled.View`
  padding-vertical: 24px;
  align-items: center;
`;

export const EmptyRowsText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13px;
  font-weight: ${fontWeight.regular};
  color: #86868b;
`;

/* Add Exercise · 361×48 rx24 dashed amber. */

export const AddExerciseButton = styled.Pressable`
  width: 100%;
  height: 48px;
  border-radius: 24px;
  margin-top: 6px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.07) : alpha('#787880', 0.08))};
  border-width: 1px;
  border-style: dashed;
  border-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.14) : alpha('#000000', 0.2))};
`;

export const AddExerciseLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 14.5px;
  font-weight: ${fontWeight.semibold};
  letter-spacing: -0.25px;
  color: #ffb84d;
  margin-left: 8px;
`;
