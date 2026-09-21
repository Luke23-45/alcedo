import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

// "What's not in the file" (S4): the red-edged card disclosing the cardio
// omission. The bullet dots carry the danger tint (backup-redesign.md §4).
export const NotInFileWrap = styled.View`
  margin-bottom: 16px;
`;

export const OmissionList = styled.View`
  gap: 14px;
`;

export const OmissionRow = styled.View`
  flex-direction: row;
  gap: 12px;
  align-items: flex-start;
`;

export const OmissionDot = styled.View`
  width: 4.4px;
  height: 4.4px;
  border-radius: 2.2px;
  background-color: ${({ theme }) => theme.color.status.danger.base};
  margin-top: 7px;
`;

export const OmissionText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '500' })}
  font-size: 11.5px;
  line-height: 16px;
  flex: 1;
`;

/** "All cardio sessions — silently dropped." — primary ink. */
export const OmissionLead = styled.Text`
  color: ${({ theme }) => theme.color.content.primary};
`;

/** Continuations — secondary ink. */
export const OmissionRest = styled.Text`
  color: ${({ theme }) => theme.color.content.secondary};
`;
