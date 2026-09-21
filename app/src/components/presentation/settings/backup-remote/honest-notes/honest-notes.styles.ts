import { type as typeStyle } from '@/styles/theme';
import styled from 'styled-components/native';

// Honest notes panel (backup-redesign.md S1): a quiet card of four bullet
// lines. The first line (no schedule) carries the primary tone; the rest
// sit on the secondary tone.
export const HonestNotesBody = styled.View`
  flex: 1;
  padding-left: 4px;
  padding-right: 2px;
  padding-top: 14px;
  padding-bottom: 14px;
  gap: 14px;
`;

export const HonestNoteRow = styled.View`
  flex-direction: row;
  gap: 10px;
  align-items: flex-start;
`;

export const HonestNoteDot = styled.View`
  width: 4.4px;
  height: 4.4px;
  border-radius: 2.2px;
  background-color: #48484a;
  margin-top: 6px;
`;

export const HonestNoteText = styled.Text<{ $primary?: boolean }>`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '500' })}
  font-size: 12.5px;
  line-height: 17px;
  flex: 1;
  color: ${({ theme, $primary }) => ($primary ? theme.color.content.primary : theme.color.content.secondary)};
`;
