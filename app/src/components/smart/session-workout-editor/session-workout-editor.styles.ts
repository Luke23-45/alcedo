import styled, { css } from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated from 'react-native-reanimated';
import { alpha, fontWeight } from '@/styles/theme';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';

/* ------------------------------------------------------------------ *
 * Kinetic reference, spec screen 4 (Workout Editor), 393×852.
 * Dark values below; light mode adapts per the home-page token mapping
 * (white cards, black edge strokes, #1C1C1E / #8E8E93 / #AEAEB2 text).
 * ------------------------------------------------------------------ */

export const Screen = styled.View`
  flex: 1;
`;

export const AuraWrap = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const Content = styled.View`
  flex: 1;
  padding-horizontal: 16px;
`;

/* Nav · Cancel 16/400/-0.3 #8E8E93, title 15/600/-0.3, dots r2 #8E8E93. */
export const NavRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding-horizontal: 16px;
`;

export const CancelButton = styled.Pressable`
  padding-vertical: 12px;
  padding-left: 8px;
  padding-right: 12px;
`;

export const CancelText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 16px;
  font-weight: ${fontWeight.regular};
  letter-spacing: -0.3px;
  color: #8e8e93;
`;

export const NavTitleWrap = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
`;

export const NavTitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15px;
  font-weight: ${fontWeight.semibold};
  letter-spacing: -0.3px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

export const NavMenuWrap = styled.View`
  margin-right: -12px;
`;

/* Plan name card · 361×70 rx22. Focused: 2pt brand ring + coral glow. */
export const PlanFieldOuter = styled(HomeGradient).attrs({ variant: 'brand' as const })<{
  $focused: boolean;
}>`
  height: 70px;
  border-radius: 22px;
  padding: 2px;
  ${({ $focused }) =>
    $focused
      ? css`
          shadow-color: #ff6a3d;
          shadow-offset: 0px 0px;
          shadow-opacity: 0.45;
          shadow-radius: 5px;
          elevation: 4;
        `
      : ''}
`;

/**
 * 1pt edge stroke as a gradient layer with 1pt of padding, so the body reads
 * as inset by the stroke (the same construction as HomeCard, kept local so
 * the focused state can drop the edge without remounting the input).
 * Focused, the brand ring replaces the edge: padding collapses to 0 and the
 * opaque body covers the layer, so no white hairline shows inside the ring —
 * exactly the spec's focused state. The card shadow lives here (never on the
 * overflow-hidden body, which would clip it on iOS).
 */
export const PlanFieldEdge = styled(HomeGradient).attrs({ variant: 'cardEdge' as const })<{
  $focused: boolean;
}>`
  flex: 1;
  border-radius: 20px;
  padding: ${({ $focused }) => ($focused ? '0px' : '1px')};
  ${({ theme }) =>
    theme.isDark
      ? css`
          shadow-color: #000000;
          shadow-offset: 0px 10px;
          shadow-opacity: 0.5;
          shadow-radius: 14px;
          elevation: 8;
        `
      : css`
          shadow-color: #14142b;
          shadow-offset: 0px 8px;
          shadow-opacity: 0.075;
          shadow-radius: 16px;
          elevation: 4;
        `}
`;

/** Card body. Clips content to its radius; the edge layer carries the shadow. */
export const PlanFieldBody = styled(HomeGradient).attrs({ variant: 'cardBody' as const })<{
  $focused: boolean;
}>`
  flex: 1;
  border-radius: ${({ $focused }) => ($focused ? 20 : 19)}px;
  overflow: hidden;
`;

export const PlanFieldContent = styled.View`
  flex: 1;
  justify-content: center;
  padding-horizontal: 16px;
`;

export const PlanLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 9px;
  font-weight: ${fontWeight.bold};
  letter-spacing: 1.25px;
  text-transform: uppercase;
  color: #86868b;
`;

export const PlanInput = styled.TextInput`
  margin-top: 5px;
  padding: 0px;
  font-family: ${({ theme }) => theme.font.text};
  font-size: 19px;
  font-weight: ${fontWeight.semibold};
  letter-spacing: -0.45px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

/* Meta strip · 361×72 rx22, four columns, hairline dividers. */
export const MetaCard = styled(HomeCard).attrs({ radius: 22, pad: 0 })`
  height: 72px;
  margin-top: 12px;
`;

export const MetaInner = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: stretch;
`;

export const MetaColumn = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const MetaValue = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15px;
  line-height: 20px;
  font-weight: ${fontWeight.bold};
  letter-spacing: -0.4px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

export const MetaLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 8px;
  line-height: 10px;
  font-weight: ${fontWeight.bold};
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-top: 8px;
  color: #86868b;
`;

export const MetaDivider = styled.View`
  width: 1px;
  align-self: center;
  height: 44px;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.08) : alpha('#000000', 0.08))};
`;

/* Segmented control · 361×36 rx18, thumb 116.4×32 rx16. */
export const SegmentTrack = styled.View`
  height: 36px;
  border-radius: 18px;
  margin-top: 12px;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.06) : alpha('#000000', 0.06))};
`;

export const SegmentThumbSlot = styled(Animated.View)`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 116.4px;
  height: 32px;
`;

export const SegmentThumb = styled.View`
  flex: 1;
  border-radius: 16px;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.13) : '#FFFFFF')};
  border-width: 0.8px;
  border-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.12) : alpha('#000000', 0.06))};
  ${({ theme }) =>
    theme.isDark
      ? css`
          shadow-color: #000000;
          shadow-offset: 0px 2px;
          shadow-opacity: 0.5;
          shadow-radius: 3px;
          elevation: 2;
        `
      : css`
          shadow-color: #000000;
          shadow-offset: 0px 1px;
          shadow-opacity: 0.18;
          shadow-radius: 3px;
          elevation: 2;
        `}
`;

export const SegmentLabels = styled.View`
  flex: 1;
  flex-direction: row;
`;

export const SegmentOption = styled.Pressable`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const SegmentOptionText = styled.Text<{ $selected: boolean }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12px;
  font-weight: ${fontWeight.semibold};
  letter-spacing: -0.15px;
  color: ${({ theme, $selected }) =>
    $selected ? (theme.isDark ? '#FFFFFF' : '#1C1C1E') : theme.isDark ? '#98989F' : '#8E8E93'};
`;

/* Section header · 10/700/1.35 label + 10/600 drag hint. */
export const SectionHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 8px;
  margin-top: 18px;
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

/* Exercise row · 361×64 rx20. Pitch 74 (64 + 10 gap). */
export const RowSlot = styled(Animated.View)`
  height: 64px;
  margin-bottom: 10px;
`;

export const RowCard = styled(HomeCard).attrs({ radius: 20, pad: 0, elev: 'tile' as const })`
  flex: 1;
`;

export const RowPress = styled.Pressable`
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding-left: 12px;
  padding-right: 14px;
`;

export const HandleBox = styled.View`
  width: 44px;
  height: 44px;
  justify-content: center;
  align-items: flex-start;
  padding-left: 2px;
  margin-right: -20px;
  z-index: 2;
`;

export const NumberTile = styled.View`
  width: 22px;
  height: 22px;
  border-radius: 7px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.07) : alpha('#000000', 0.05))};
`;

export const NumberText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  font-weight: ${fontWeight.bold};
  color: #8e8e93;
`;

export const RowTexts = styled.View`
  flex: 1;
  justify-content: center;
  margin-left: 10px;
  margin-right: 8px;
`;

export const RowName = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 14px;
  font-weight: ${fontWeight.semibold};
  letter-spacing: -0.2px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

export const RowSummary = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11px;
  font-weight: ${fontWeight.medium};
  margin-top: 4px;
  color: #86868b;
`;

export const EmptyRows = styled.View`
  padding-vertical: 28px;
  align-items: center;
`;

export const EmptyRowsText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13px;
  font-weight: ${fontWeight.regular};
  letter-spacing: -0.2px;
  text-align: center;
  color: #86868b;
`;

/* Sticky footer · material bar + 44pt fade, Add 361×48, Save 361×54. */
export const FooterFloat = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const FooterFade = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: -44px;
  height: 44px;
`;

export const FooterBar = styled(LinearGradient)`
  border-top-width: 1px;
  border-top-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.11) : alpha('#000000', 0.11))};
  padding-horizontal: 16px;
  padding-top: 14px;
`;

export const AddRow = styled.Pressable`
  height: 48px;
  border-radius: 24px;
  border-width: 1px;
  border-style: dashed;
  border-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.14) : alpha('#000000', 0.2))};
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.07) : alpha('#000000', 0.03))};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const AddLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 14.5px;
  font-weight: ${fontWeight.semibold};
  letter-spacing: -0.25px;
  margin-left: 12px;
  color: ${({ theme }) => theme.home.amber};
`;

export const SaveOuter = styled(HomeGradient).attrs({ variant: 'brand' as const })`
  height: 54px;
  border-radius: 27px;
  margin-top: 12px;
  shadow-color: #ff2d55;
  shadow-offset: 0px 7px;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
  elevation: 6;
`;

export const SavePress = styled.Pressable`
  flex: 1;
  border-radius: 27px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${alpha('#FFFFFF', 0.22)};
  overflow: hidden;
`;

export const SaveGloss = styled(HomeGradient).attrs({ variant: 'gloss' as const })`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 27px;
  opacity: 0.35;
`;

export const SaveLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 16px;
  font-weight: ${fontWeight.semibold};
  letter-spacing: -0.3px;
  color: #ffffff;
`;
