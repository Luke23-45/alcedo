import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

/** Choose-language rows (settings-dark.md Screen 2): 52pt rows. */

export const Block = styled.View`
  padding-top: 4px;
  padding-bottom: 4px;
`;

export const LanguageRow = styled.Pressable<{ $disabled?: boolean }>`
  min-height: 52px;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 16px;
  opacity: ${({ $disabled }) => ($disabled ? 0.55 : 1)};
`;

export const LanguageName = styled.Text`
  flex: 1;
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '600' })}
  font-size: 13.5px;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

// Spec: 10.5pt/500 #86868B end-anchored region.
export const RegionText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '500' })}
  font-size: 10.5px;
  color: #86868b;
  text-align: right;
  margin-right: 12px;
`;
