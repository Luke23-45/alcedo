import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

/** S5 §3: the two-format radio card (backup-redesign.md §5: rx26, 8pt option insets). */
export const Options = styled.View`
  padding: 8px;
`;

/**
 * One format row: full-row 44pt+ pressable with the spec's coral wash when
 * selected. The wash is the selection affordance; the radio ring mirrors it.
 */
export const OptionButton = styled.Pressable<{ $selected: boolean }>`
  flex-direction: row;
  align-items: flex-start;
  gap: 16px;
  min-height: 44px;
  padding: 16px;
  border-radius: 18px;
  background-color: ${({ $selected }) => ($selected ? 'rgba(255,106,61,0.08)' : 'transparent')};
`;

/** 20pt radio ring; coral 2pt ring + 10pt dot when selected, quiet ring otherwise. */
export const Radio = styled.View<{ $selected: boolean }>`
  width: 20px;
  height: 20px;
  margin-top: 2px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  border-width: ${({ $selected }) => ($selected ? 2 : 1.6)}px;
  border-color: ${({ theme, $selected }) => ($selected ? '#FF6A3D' : theme.color.content.quaternary)};
`;

export const RadioDot = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #FF6A3D;
`;

export const OptionText = styled.View`
  flex: 1;
  gap: 4px;
`;

/** "FitNotes-style CSV" (14pt semibold, primary; selected weight stays 600). */
export const OptionTitle = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '600' })}
  font-size: 14px;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

/** "Any CSV with the FitNotes column set." — 10.5pt, secondary. */
export const OptionSubtitle = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '500' })}
  font-size: 10.5px;
  letter-spacing: 0;
  line-height: 15px;
  color: ${({ theme }) => theme.color.content.secondary};
`;

/** "DROPS" micro-label — 9pt/700, tracking +1.2, secondary. */
export const DropsLabel = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '700' })}
  font-size: 9px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.content.secondary};
  margin-top: 4px;
`;

/** The per-format drop list — 10.5pt, secondary. */
export const OptionDrops = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '500' })}
  font-size: 10.5px;
  letter-spacing: 0;
  line-height: 15px;
  color: ${({ theme }) => theme.color.content.secondary};
`;

/** Hairline between the two options, inset to the text column. */
export const OptionSeparator = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  margin-horizontal: 16px;
  background-color: ${({ theme }) => theme.color.border.hairline};
`;
