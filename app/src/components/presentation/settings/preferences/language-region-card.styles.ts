import styled from 'styled-components/native';

/** Language & Region card (settings-dark.md Screen 2). */

export const Block = styled.View`
  padding-top: 8px;
  padding-bottom: 8px;
`;

export const ValueRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

// Spec: 12.5pt/500 #98989F end-anchored value text.
export const RowValue = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12.5px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => (theme.isDark ? '#98989F' : '#8E8E93')};
  text-align: right;
`;
