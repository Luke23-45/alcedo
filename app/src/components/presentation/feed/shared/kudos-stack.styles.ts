import styled from 'styled-components/native';

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

/** Later faces paint over earlier ones, matching the SVG's draw order. */
export const Face = styled.View<{ size: number; $overlap: boolean }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  ${({ $overlap }) => ($overlap ? 'margin-left: -4px;' : '')}
`;

export const Cap = styled.View<{ size: number; ringColor: string; $overlap: boolean }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  border-width: 2.2px;
  border-color: ${({ ringColor }) => ringColor};
  background-color: ${({ theme }) => (theme.isDark ? '#2A2A2E' : '#E9E9EE')};
  align-items: center;
  justify-content: center;
  ${({ $overlap }) => ($overlap ? 'margin-left: -4px;' : '')}
`;

export const CapText = styled.Text<{ size: number }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: ${({ size }) => (size * 7.5) / 22}px;
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => (theme.isDark ? '#98989F' : '#8E8E93')};
`;

export const Label = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11.5px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => (theme.isDark ? '#98989F' : '#8E8E93')};
  margin-left: 8px;
  flex-shrink: 1;
`;
