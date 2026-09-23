import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

/** Units card (settings-dark.md Screen 2): three 56pt rows, caption below. */

export const Block = styled.View`
  padding-top: 8px;
  padding-bottom: 16px;
`;

export const UnitRow = styled.View`
  min-height: 56px;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
`;

export const UnitLabel = styled.Text`
  flex: 1;
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '600' })}
  font-size: 13.5px;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const UnitSegmentedWrap = styled.View`
  width: 120px;
`;

export const CaptionWrap = styled.View`
  margin-top: 12px;
`;
