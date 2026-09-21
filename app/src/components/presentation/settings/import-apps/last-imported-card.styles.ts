import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

/** S5 §2 card internals (backup-redesign.md §5: dot + two text lines). */
export const CardRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 16px;
  padding-horizontal: 20px;
  gap: 12px;
`;

/** Green while an import exists; quiet grey for the never-imported state. */
export const StatusDot = styled.View<{ $empty: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({ theme, $empty }) =>
    $empty
      ? theme.color.content.quaternary
      : theme.color.status.success.base};
`;

export const TextColumn = styled.View`
  flex: 1;
  gap: 2px;
`;

/** "Jun 4 · 23 workouts" (13pt semibold, primary). Muted for the never-imported state. */
export const PrimaryLine = styled.Text<{ $muted?: boolean }>`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '600' })}
  letter-spacing: -0.2px;
  color: ${({ theme, $muted }) => ($muted ? theme.color.content.secondary : theme.color.content.primary)};
`;

/** "FitNotes-style · 2,140 sets" (10.5pt medium, secondary). */
export const SecondaryLine = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '500' })}
  font-size: 10.5px;
  letter-spacing: 0;
  color: ${({ theme }) => theme.color.content.secondary};
`;
