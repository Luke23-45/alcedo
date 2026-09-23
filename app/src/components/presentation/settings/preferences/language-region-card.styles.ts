import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

/** Language & Region card (settings-dark.md Screen 2). */

export const Block = styled.View`
  padding-top: 8px;
  padding-bottom: 8px;
`;

export const ValueRow = styled.View`
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
  gap: 4px;
`;

// Spec: 12.5pt/500 #98989F end-anchored value text.
export const RowValue = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '500' })}
  font-size: 12.5px;
  color: ${({ theme }) => (theme.isDark ? '#98989F' : '#8E8E93')};
  text-align: right;
  flex-shrink: 1;
`;
