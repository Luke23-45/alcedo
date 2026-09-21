import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

/** S5 §5: NOT SUPPORTED card (backup-redesign.md §5: rx20). */
export const NotSupportedBody = styled.View`
  padding-vertical: 16px;
  padding-horizontal: 20px;
  gap: 8px;
`;

/** The unsupported-apps list, verbatim; 12pt medium, secondary. */
export const NotSupportedText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption1', { weight: '500' })}
  font-size: 12px;
  line-height: 17px;
  color: ${({ theme }) => theme.color.content.secondary};
`;

/** "Only FitNotes and StrongLifts CSV shapes are real." — 10.5pt, secondary. */
export const NotSupportedNote = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '500' })}
  font-size: 10.5px;
  line-height: 15px;
  color: ${({ theme }) => theme.color.content.secondary};
`;
