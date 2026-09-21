import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

/** S5 caption block under the nav title (backup-redesign.md §5: y≈128/146). */
export const HeaderCaption = styled.View`
  margin-left: 24px;
  margin-right: 24px;
  margin-bottom: 24px;
  gap: 4px;
`;

/** First line: "Import workout history from another app." (14pt, secondary). */
export const HeaderLine = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '500' })}
  font-size: 14px;
  letter-spacing: -0.1px;
  color: ${({ theme }) => theme.color.content.secondary};
`;

/** Second line: "History only — no programs, exercises, or feed." (13pt, tertiary). */
export const HeaderScope = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '500' })}
  font-size: 13px;
  letter-spacing: -0.1px;
  color: ${({ theme }) => theme.color.content.tertiary};
`;
