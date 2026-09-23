import styled, { css } from 'styled-components/native';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';
import { type as typeHelper, type AppTheme } from '@/styles/theme';

/* ------------------------------------------------------------------ *
 * Workout editor, three-canvas redesign (393×852 reference).
 * Dark values below; light mode derives from the home-page token mapping
 * (white cards, black edge strokes, #1C1C1E / #8E8E93 / #AEAEB2 text).
 * ------------------------------------------------------------------ */

/* --- Screen ---------------------------------------------------------------- */

export const Screen = styled.View`
  flex: 1;
`;

export const AuraWrap = styled.View`
  position: absolute;
  top: -150px;
  left: 0;
  right: 0;
  height: 430px;
`;

export const Scroll = styled(GestureScrollView).attrs({
  contentContainerStyle: { paddingBottom: 24 },
  keyboardShouldPersistTaps: 'handled',
})``;

export const Content = styled.View`
  padding-left: ${({ theme }) => theme.layout.screenPadding}px;
  padding-right: ${({ theme }) => theme.layout.screenPadding}px;
`;

/* --- Nav ------------------------------------------------------------------- */

export const NavRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  min-height: 52px;
`;

export const NavSideButton = styled.Pressable`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
`;

export const MenuTrigger = styled.Pressable.attrs({ hitSlop: 8 })`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
`;

export const NavTitle = styled.Text`
  position: absolute;
  left: 64px;
  right: 64px;
  text-align: center;
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.color.content.primary};
`;

/* --- Draft strip ------------------------------------------------------------ */

export const DraftStrip = styled.View`
  flex-direction: row;
  align-items: center;
  padding-left: ${({ theme }) => theme.layout.screenPadding}px;
  padding-right: ${({ theme }) => theme.layout.screenPadding}px;
  margin-top: 2px;
`;

export const DraftDot = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.home.seeAll};
  margin-right: 6px;
`;

export const DraftText = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 10.5px;
  line-height: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.tertiary};
  flex-shrink: 1;
`;

/* --- Sections --------------------------------------------------------------- */

export const Section = styled.View`
  margin-top: ${({ theme }) => theme.space.xl}px;
`;

export const SectionHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const MicroLabel = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 9px;
  line-height: 12px;
  font-weight: 700;
  letter-spacing: 1.4px;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export const HeaderHint = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 10px;
  line-height: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

/* --- Plan name ---------------------------------------------------------------- */

export const PlanNameWrap = styled.View`
  margin-top: 18px;
`;

export const PlanNameInput = styled.TextInput.attrs<{ theme: AppTheme }>((props) => ({
  placeholderTextColor: props.theme.isDark ? '#6C6C70' : '#AEAEB2',
  selectionColor: props.theme.home.seeAll,
}))`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 32px;
  line-height: 40px;
  font-weight: 700;
  letter-spacing: -1px;
  color: ${({ theme }) => theme.color.content.primary};
  padding: 0;
  margin: 0;
`;

export const PlanNameUnderline = styled.View<{ $focused: boolean }>`
  height: 2px;
  margin-top: 2px;
  border-radius: 1px;
  background-color: ${({ theme, $focused }) => ($focused ? theme.home.seeAll : theme.color.border.hairline)};
`;

/* --- Meta card ------------------------------------------------------------------ */

export const MetaBody = styled.View`
  padding: 14px 4px 10px 4px;
`;

export const MetaRow = styled.View`
  flex-direction: row;
  align-items: stretch;
`;

export const MetaCol = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-top: 2px;
  padding-bottom: 2px;
`;

export const MetaValue = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 17px;
  line-height: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const MetaLabel = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 7.5px;
  line-height: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: ${({ theme }) => theme.color.content.tertiary};
  margin-top: 4px;
  text-align: center;
`;

export const MetaDivider = styled.View`
  width: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ theme }) => theme.color.border.hairline};
  margin-top: 4px;
  margin-bottom: 4px;
`;

export const MetaFootnote = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 8.5px;
  line-height: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: ${({ theme }) => (theme.isDark ? '#6C6C70' : '#AEAEB2')};
  text-align: right;
  margin-top: 8px;
  padding-right: 12px;
`;

/* --- Notes ---------------------------------------------------------------------- */

export const NotesHint = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 9.5px;
  line-height: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export const NotesInput = styled.TextInput.attrs<{ theme: AppTheme }>((props) => ({
  placeholderTextColor: props.theme.isDark ? '#6C6C70' : '#AEAEB2',
  selectionColor: props.theme.home.seeAll,
  textAlignVertical: 'top',
}))`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 13.5px;
  line-height: 19px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.primary};
  padding: 0;
  margin: 0;
  min-height: 88px;
`;

/* --- Exercise rows -------------------------------------------------------------- */

export const RowsClip = styled.View`
  position: relative;
`;

export const RowSlot = styled(Animated.View)<{ $last: boolean }>`
  height: ${({ $last }) => ($last ? 64 : 74)}px;
`;

export const RowPress = styled.Pressable`
  height: 64px;
  flex-direction: row;
  align-items: center;
`;

export const ActiveBorder = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  border-radius: 20px;
  border-width: 1.8px;
  border-color: ${({ theme }) => theme.home.seeAll};
`;

export const Grip = styled.View`
  width: 22px;
  align-items: center;
  justify-content: center;
  margin-right: 2px;
`;

/**
 * The drag-grab zone: the visual handle plus the (non-interactive) number
 * tile, so the reorder target meets 44×44 while the glyph keeps its drawn
 * position. Dragging stays handle-only; the rest of the row still taps.
 */
export const GrabZone = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: stretch;
`;

export const NumberTile = styled(HomeGradient).attrs({ variant: 'brand' as const })`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const NumberText = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 14px;
  line-height: 18px;
  font-weight: 700;
  color: #ffffff;
`;

export const RowTexts = styled.View`
  flex: 1;
  margin-left: 12px;
  margin-right: 8px;
  justify-content: center;
`;

export const RowName = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 14px;
  line-height: 18px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const RowNameEmpty = styled(RowName)`
  color: ${({ theme }) => (theme.isDark ? '#6C6C70' : '#AEAEB2')};
  font-style: italic;
`;

export const RowSummary = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 11px;
  line-height: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.tertiary};
  margin-top: 2px;
`;

export const RowDivider = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ theme }) => theme.color.border.hairline};
  margin-left: 24px;
  margin-right: 4px;
`;

/** The dashed drop-target line shown while a row is being reordered. */
export const DropIndicator = styled(Animated.View)`
  position: absolute;
  left: 8px;
  right: 8px;
  top: 0;
  height: 2px;
  flex-direction: row;
  align-items: center;
`;

export const DropDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.home.seeAll};
`;

export const DropDash = styled.View`
  flex: 1;
  height: 2px;
  margin-left: 4px;
  margin-right: 4px;
  border-top-width: 2px;
  border-top-color: ${({ theme }) => theme.home.seeAll};
  border-style: dashed;
  opacity: 0.85;
`;

export const ReorderCaption = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 9.5px;
  line-height: 13px;
  font-weight: 500;
  color: ${({ theme }) => (theme.isDark ? '#48484A' : '#8E8E93')};
  text-align: center;
  margin-top: 12px;
  padding-left: 24px;
  padding-right: 24px;
`;

/* --- Empty state ------------------------------------------------------------------ */

export const EmptyBody = styled.View`
  align-items: center;
  padding: 36px 28px 32px 28px;
`;

export const EmptyIconRing = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.color.fill.secondary};
  border-width: ${StyleSheet.hairlineWidth}px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')};
  margin-bottom: 18px;
`;

export const EmptyTitle = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 17px;
  line-height: 22px;
  font-weight: 600;
  letter-spacing: -0.4px;
  color: ${({ theme }) => theme.color.content.primary};
  text-align: center;
`;

export const EmptyBodyText = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 12px;
  line-height: 17px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.tertiary};
  text-align: center;
  margin-top: 8px;
`;

/** Ghost secondary button per the spec: white 8% fill, amber label and glyph. */
export const EmptyAddButton = styled.View`
  border-radius: 19px;
  overflow: hidden;
  margin-top: 20px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)')};
  border-width: 1px;
  border-color: ${({ theme }) => theme.color.border.hairline};
`;

export const EmptyAddPress = styled.Pressable`
  min-width: 176px;
  min-height: 44px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
  gap: 10px;
`;

export const EmptyAddLabel = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 13px;
  line-height: 18px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.home.seeAll};
`;

/* --- Add-behavior annotation ---------------------------------------------------------- */

export const BehaviorCard = styled.View`
  border-radius: 20px;
  border-width: 1px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 159, 10, 0.35)' : 'rgba(201, 52, 0, 0.3)')};
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 159, 10, 0.06)' : 'rgba(201, 52, 0, 0.05)')};
`;

export const BehaviorBody = styled.View`
  padding: 14px 16px;
`;

export const BehaviorKicker = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 9px;
  line-height: 12px;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: ${({ theme }) => theme.home.amber};
  margin-bottom: 6px;
`;

export const BehaviorText = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 11.5px;
  line-height: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.secondary};
`;

/* --- Footnote ------------------------------------------------------------------------- */

export const Footnote = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 9.5px;
  line-height: 13px;
  font-weight: 500;
  color: ${({ theme }) => (theme.isDark ? '#48484A' : '#8E8E93')};
  text-align: center;
  margin-top: 16px;
  padding-left: 20px;
  padding-right: 20px;
`;

/* --- Footer ----------------------------------------------------------------------------- */

export const FooterBar = styled.View`
  border-top-width: ${StyleSheet.hairlineWidth}px;
  border-top-color: ${({ theme }) => theme.color.border.hairline};
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(11, 11, 14, 0.92)' : 'rgba(248, 248, 252, 0.92)')};
  padding: 12px ${({ theme }) => theme.layout.screenPadding}px 10px ${({ theme }) => theme.layout.screenPadding}px;
`;

export const FooterRow = styled.View`
  flex-direction: row;
  gap: 12px;
`;

export const AddButton = styled.Pressable`
  flex: 1;
  min-height: 54px;
  border-radius: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.07)' : theme.color.fill.secondary)};
  border-width: 1px;
  border-color: ${({ theme }) => theme.color.border.hairline};
`;

export const AddButtonLabel = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.25px;
  color: ${({ theme }) => theme.home.seeAll};
`;

export const SaveButtonShell = styled(HomeGradient).attrs({ variant: 'brand' as const })`
  flex: 1;
  border-radius: 16px;
  overflow: hidden;
  ${({ theme }) =>
    theme.isDark
      ? css`
          shadow-color: #ff6a3d;
          shadow-offset: 0px 6px;
          shadow-opacity: 0.38;
          shadow-radius: 14px;
          elevation: 6;
        `
      : css`
          shadow-color: #ff6a3d;
          shadow-offset: 0px 6px;
          shadow-opacity: 0.28;
          shadow-radius: 14px;
          elevation: 6;
        `}
`;

export const SaveButton = styled.Pressable`
  min-height: 54px;
  align-items: center;
  justify-content: center;
`;

export const SaveButtonLabel = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 16px;
  line-height: 21px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: #ffffff;
`;

export const SaveGloss = styled(HomeGradient).attrs({ variant: 'gloss' as const })`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 27px;
  opacity: 0.35;
`;

export const SaveSubcaption = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 10.5px;
  line-height: 14px;
  font-weight: 500;
  color: ${({ theme }) => (theme.isDark ? '#6C6C70' : '#AEAEB2')};
  text-align: center;
  margin-top: 8px;
`;

export const CancelButton = styled.Pressable`
  min-height: 44px;
  align-items: center;
  justify-content: center;
`;

export const CancelLabel = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 16px;
  line-height: 21px;
  font-weight: 600;
  color: ${({ theme }) => theme.home.seeAll};
`;
