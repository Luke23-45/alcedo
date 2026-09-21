import styled from 'styled-components/native';
import { editorPalette } from '../exercise-editor-tokens';

export const ScreenRoot = styled.View`
  flex: 1;
`;

export const NavRow = styled.View`
  flex-direction: row;
  align-items: center;
  height: 56px;
  padding-left: 16px;
  padding-right: 16px;
`;

export const NavBack = styled.Pressable`
  width: 44px;
  height: 44px;
  margin-left: -12px;
  align-items: center;
  justify-content: center;
`;

export const NavTitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  flex: 1;
  font-size: 17px;
  line-height: 22px;
  font-weight: 600;
  letter-spacing: -0.4px;
  text-align: center;
  color: ${({ theme }) => editorPalette(theme.isDark).text.primary};
`;

export const NavDone = styled.Pressable<{ $disabled: boolean }>`
  min-width: 44px;
  min-height: 44px;
  margin-right: -8px;
  align-items: center;
  justify-content: center;
  opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};
`;

export const NavDoneText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => editorPalette(theme.isDark).accent.amber};
`;

/** Reference: a 3pt amber dot + 10.5pt gray copy — not a strip or pill. */
export const DirtyRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding-top: 4px;
  padding-bottom: 8px;
`;

export const DirtyDot = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${({ theme }) => editorPalette(theme.isDark).accent.amber};
`;

export const DirtyText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10.5px;
  line-height: 14px;
  font-weight: 500;
  color: ${({ theme }) => editorPalette(theme.isDark).text.caption};
`;

export const SectionGap = styled.View`
  height: 20px;
`;

export const LabelGap = styled.View`
  height: 8px;
`;

export const TypePickerPad = styled.View`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 12px;
  padding-bottom: 4px;
`;

// ============================================================================
// S3 add/remove-set buttons: 48pt pills, 13pt gap, full-bleed margins.
// ============================================================================

export const SetButtonsRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 12px;
  gap: 13px;
`;

export const RemoveSetButton = styled.Pressable<{ $disabled: boolean }>`
  flex: 1;
  height: 48px;
  border-radius: 24px;
  border-curve: continuous;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,59,48,0.10)' : 'rgba(255,59,48,0.08)')};
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255,59,48,0.22)' : 'rgba(255,59,48,0.20)')};
  opacity: ${({ $disabled }) => ($disabled ? 0.35 : 1)};
`;

export const RemoveSetText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13.5px;
  line-height: 18px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => editorPalette(theme.isDark).accent.red};
`;

export const AddSetButton = styled.Pressable`
  flex: 1;
  height: 48px;
  border-radius: 24px;
  border-curve: continuous;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  background-color: ${({ theme }) => editorPalette(theme.isDark).control.fill};
  border-color: ${({ theme }) => editorPalette(theme.isDark).control.stroke};
`;

export const AddSetText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13.5px;
  line-height: 18px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => editorPalette(theme.isDark).text.secondary};
`;

export const ContentBottomPad = styled.View`
  height: 40px;
`;
