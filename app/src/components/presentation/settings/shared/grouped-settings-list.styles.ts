import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';

/**
 * Canonical iOS grouped-inset settings anatomy, measured off
 * docs/new_design/settings-dark.md (Screen 1): 58pt rows, 34pt icon wells,
 * dual-line rows, separators inset to the text column (x78→x357 on 393pt).
 */

// --- Group -----------------------------------------------------------------

export const GroupWrap = styled.View`
  margin-bottom: 28px;
`;

// Spec: 10pt/700, letter-spacing +1.35, #86868B (settings-dark.md Screen 1).
export const GroupLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 1.35px;
  text-transform: uppercase;
  color: #86868b;
  margin-left: 24px;
  margin-bottom: 8px;
`;

// 1pt gradient edge stroke hugging the card (settings-dark.md `ce` gradient:
// white .17→.06→.025 dark; black .045→.06→.115 light per phase-6 light deltas).
// Colors are supplied by the <CardEdge> wrapper in grouped-settings-list.tsx
// (styled-components `.attrs` does not satisfy expo-linear-gradient's
// required `colors` prop at the type level).
export const CardEdgeBase = styled(LinearGradient)`
  border-radius: 22px;
  padding: 1px;
  margin-horizontal: 16px;
`;

// Diagonal 3-stop card body, lit from above (settings-dark.md `cd` gradient).
// Colors come from the <CardBody> wrapper.
export const CardBodyBase = styled(LinearGradient)`
  border-radius: 21px;
  overflow: hidden;
`;

// --- Row -------------------------------------------------------------------

export const RowPressable = styled.Pressable`
  min-height: 58px;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  padding-right: 14px;
`;

export const RowStatic = styled.View`
  min-height: 58px;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  padding-right: 14px;
`;

// iOS press highlight: a quiet fill wash, not a ripple.
export const PressHighlight = styled.View<{ $pressed: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme, $pressed }) =>
    $pressed ? (theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)') : 'transparent'};
`;

// 34×34 rx10 icon well; hue comes from the row's $well prop.
export const IconWell = styled.View<{ $well: string }>`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $well }) => $well};
`;

export const RowText = styled.View`
  flex: 1;
  margin-left: 12px;
  margin-right: 8px;
  justify-content: center;
  gap: 3px;
`;

// Spec: 13.5pt/600, letter-spacing -0.2, #F5F5F7 (settings-dark.md Screen 1).
export const RowTitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13.5px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

// Spec: 10.5pt/500 #86868B (settings-dark.md Screen 1).
export const RowSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10.5px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: #86868b;
`;

// Spec: 12pt/500 #98989F end-anchored (settings-dark.md Screen 1).
export const RowValue = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => (theme.isDark ? '#98989F' : '#8E8E93')};
  text-align: right;
`;

// Green status text ("On", "Connected"): 12pt/600 #30D158 dark / #34C759 light
// (phase-6 light deltas).
export const RowValueActive = styled(RowValue)`
  font-weight: ${({ theme }) => theme.weight.semibold};
  color: ${({ theme }) => (theme.isDark ? '#30D158' : '#34C759')};
`;

export const RowTrailing = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const ChevronRotator = styled.View<{ $open: boolean }>`
  transform: ${({ $open }) => ($open ? 'rotate(90deg)' : 'rotate(0deg)')};
`;

// Separator aligned to the text column: x78→x357 on 393pt, i.e. left inset 62,
// right inset 20 relative to the card (settings-dark.md Screen 1).
export const RowSeparator = styled.View`
  height: 1px;
  margin-left: 62px;
  margin-right: 20px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(60,60,67,0.12)')};
`;

// --- Badge pill (BETA / NEW) ------------------------------------------------
// Spec: h16 rx8, fill #FFD60A @.16, stroke #FFD60A @.26, 7.5pt/700 ls +.5 #FFD84D —
// gold is identical in both modes (settings-dark.md Screen 1).
export const BadgePill = styled.View`
  height: 16px;
  padding-horizontal: 8px;
  border-radius: 8px;
  border-width: 0.7px;
  border-color: rgba(255, 214, 10, 0.26);
  background-color: rgba(255, 214, 10, 0.16);
  align-items: center;
  justify-content: center;
`;

export const BadgePillText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 7.5px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 0.5px;
  color: #ffd84d;
`;

// --- iOS toggle (44×26) -----------------------------------------------------
// Spec: 44×26 rx13; ON #30D158 dark / #34C759 light; knob r11 white with
// dy2/blur4 black .55 shadow (settings-dark.md Screen 1; phase-6 light deltas).
export const ToggleTrack = styled.View<{ $on: boolean; $disabled?: boolean }>`
  width: 44px;
  height: 26px;
  border-radius: 13px;
  justify-content: center;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  background-color: ${({ theme, $on }) =>
    $on ? (theme.isDark ? '#30D158' : '#34C759') : theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(120,120,128,0.12)'};
`;

export const ToggleKnob = styled.View`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background-color: #ffffff;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.55;
  shadow-radius: 4px;
  elevation: 3;
`;

export const ToggleHitSlop = { top: 9, bottom: 9, left: 9, right: 9 };

// --- Screen footer ----------------------------------------------------------
// Spec: 10pt/500 ls +.3 #48484A dark / #AEAEB2 light, centered
// (settings-dark.md Screen 1).
export const ScreenFooter = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.weight.medium};
  letter-spacing: 0.3px;
  text-align: center;
  color: ${({ theme }) => (theme.isDark ? '#48484A' : '#AEAEB2')};
  margin-top: 8px;
  margin-bottom: 32px;
  padding-horizontal: 24px;
`;

export const chevronColor = '#48484A';
