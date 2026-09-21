import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

/**
 * Uppercase micro-label above each S5 card (backup-redesign.md §5: 9pt,
 * weight 700, tracking +1.2, tertiary text). Geometry matches the settings
 * family's GroupLabel (24pt left margin, 8pt below).
 */
export const SectionLabelText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '700' })}
  font-size: 9px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.content.secondary};
  margin-left: 24px;
  margin-bottom: 8px;
`;
