import styled from 'styled-components/native';
import { editorPalette } from '../exercise-editor-tokens';

// ============================================================================
// Cardio set card — S3 geometry. The card carries no horizontal pad; rows own
// their insets: 20pt left for labels, 16pt for the target segmented control.
// ============================================================================

export const SetTopPad = styled.View`
  height: 14px;
`;

export const SetBottomPad = styled.View`
  height: 14px;
`;

export const SetHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  padding-left: 20px;
  padding-right: 4px;
`;

export const SetTitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13.5px;
  line-height: 18px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => editorPalette(theme.isDark).text.primary};
`;

/** Reference trash: 24×24 icon, visual center 16pt from the card edge. */
export const TrashButton = styled.Pressable<{ $disabled?: boolean }>`
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};
`;

export const SegmentWrap = styled.View`
  margin-left: 16px;
  margin-right: 16px;
`;

export const TargetRow = styled.View`
  flex-direction: row;
  align-items: center;
  min-height: 52px;
  padding-left: 20px;
  padding-right: 19px;
  margin-top: 4px;
`;

/** Fixed 90pt label column so the value input centers in the full row. */
export const TargetLabelWrap = styled.View`
  width: 90px;
`;

export const TargetLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13.5px;
  line-height: 18px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => editorPalette(theme.isDark).text.secondary};
`;

export const DistanceStepperWrap = styled.View`
  flex: 1;
  align-items: center;
`;

export const UnitWrap = styled.View`
  width: 88px;
`;

// ============================================================================
// H:M:S duration editor — small steppers with 8pt sub-labels, colons between.
// ============================================================================

export const HMSWrap = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: flex-start;
`;

export const HMSUnit = styled.View`
  flex: 1;
  align-items: center;
`;

export const HMSSub = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 8px;
  line-height: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: ${({ theme }) => editorPalette(theme.isDark).text.tertiary};
  margin-top: 4px;
`;

export const HMSColonWrap = styled.View`
  padding-top: 2px;
`;

export const HMSColon = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 14px;
  line-height: 18px;
  font-weight: 700;
  color: ${({ theme }) => editorPalette(theme.isDark).text.tertiary};
`;

// ============================================================================
// TRACK grid — two columns; labels at 20/200, toggles right-aligned per col.
// ============================================================================

export const TrackHead = styled.View`
  padding-left: 20px;
  margin-top: 8px;
`;

export const TrackGrid = styled.View`
  flex-direction: row;
  margin-top: 4px;
`;

export const TrackColumnLeft = styled.View`
  width: 196px;
`;

export const TrackColumnRight = styled.View`
  flex: 1;
`;

export const TrackCell = styled.View<{ $right?: boolean }>`
  flex-direction: row;
  align-items: center;
  min-height: 40px;
  padding-left: ${({ $right }) => ($right ? 4 : 20)}px;
  padding-right: ${({ $right }) => ($right ? 4 : 10)}px;
`;

export const TrackLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: ${({ theme }) => editorPalette(theme.isDark).text.secondary};
`;

export const TrackToggleGroup = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-left: auto;
`;

// ============================================================================
// Cardio rest opt-in — toggle row always (timers on); value row when set.
// ============================================================================

export const RestOptRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 52px;
  padding-left: 20px;
  padding-right: 20px;
`;

export const RestValueRow = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  padding-left: 20px;
  padding-right: 20px;
`;

export const RestValueText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13px;
  line-height: 18px;
  font-weight: 700;
  color: ${({ theme }) => editorPalette(theme.isDark).text.primary};
  font-variant: tabular-nums;
`;
