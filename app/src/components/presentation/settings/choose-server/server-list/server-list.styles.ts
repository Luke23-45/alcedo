import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { type as typeStyle } from '@/styles/theme';
import styled from 'styled-components/native';

// Server cards (backup-redesign.md S2): the standard card anatomy — gradient
// edge + diagonal body — with 58pt rows. Complete rows assign instantly;
// incomplete rows are greyed, carry a red INCOMPLETE tag, and ignore taps.

// Section micro-labels ("COMPLETE BACKENDS", "INCOMPLETE · CANNOT BE
// ASSIGNED", "ADD") — backup-redesign.md S2: 9pt/700, tracking +1.2,
// uppercase, tertiary, 24pt left margin, 8pt below.
export const SectionLabelText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '700' })}
  font-size: 9px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.content.secondary};
  margin-left: 24px;
  margin-bottom: 8px;
`;

// "Tap any row to assign instantly" — 10.5pt secondary, under the complete card.
export const AssignHint = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '500' })}
  font-size: 10.5px;
  color: ${({ theme }) => theme.color.content.secondary};
  text-align: center;
  margin-top: 8px;
  margin-bottom: 16px;
`;

// Backend/auth footnote (backup-redesign.md S2): three 9pt secondary lines,
// centered, 20pt below the last card.
export const FootnoteBlock = styled.View`
  margin-top: 20px;
  margin-bottom: 8px;
  padding-horizontal: 32px;
  gap: 3px;
`;

export const FootnoteText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '500' })}
  font-size: 9px;
  color: ${({ theme }) => theme.color.content.secondary};
  text-align: center;
`;

export const CardEdge = styled(LinearGradient)`
  border-radius: 20px;
  padding: 1px;
  margin-horizontal: 16px;
`;

export const CardBody = styled(LinearGradient)`
  border-radius: 19px;
  overflow: hidden;
`;

export const ServerRowPressable = styled.Pressable`
  min-height: 58px;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 16px;
  padding-top: 10px;
  padding-bottom: 10px;
  gap: 12px;
`;

export const ServerRowStatic = styled.View`
  min-height: 58px;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 16px;
  padding-top: 10px;
  padding-bottom: 10px;
  gap: 12px;
`;

export const ServerRowText = styled.View`
  flex: 1;
  min-width: 0;
  gap: 3px;
  justify-content: center;
`;

export const ServerName = styled.Text`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '600' })}
  font-size: 14px;
  color: ${({ theme }) => theme.color.content.primary};
`;

// Incomplete backends render in the tertiary tone — readable, not tappable.
export const ServerNameIncomplete = styled(ServerName)`
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export const ServerSubtitle = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '500' })}
  font-size: 10.5px;
  line-height: 14px;
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const RowSeparator = styled.View`
  height: ${StyleSheet.hairlineWidth}px;
  margin-left: 20px;
  margin-right: 16px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(60,60,67,0.12)')};
`;

// INCOMPLETE tag: h17 rx8.5, red fill .12 + stroke .22, 7.5pt/700 ls +.6.
export const IncompleteTag = styled.View`
  height: 17px;
  padding-horizontal: 8px;
  border-radius: 8.5px;
  border-width: 0.8px;
  border-color: rgba(255, 59, 48, 0.22);
  background-color: rgba(255, 59, 48, 0.12);
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const IncompleteTagText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '700' })}
  font-size: 7.5px;
  letter-spacing: 0.6px;
  color: #ff6b60;
`;

// Add-new row: dashed amber card (backup-redesign.md S2), 44pt+ target.
export const AddNewCard = styled.Pressable`
  margin-horizontal: 16px;
  min-height: 56px;
  border-radius: 20px;
  border-width: 1px;
  border-style: dashed;
  border-color: rgba(255, 159, 10, 0.25);
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,159,10,0.04)' : 'rgba(255,159,10,0.06)')};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-horizontal: 20px;
`;

export const AddNewLabel = styled.Text`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '600' })}
  font-size: 14px;
  color: #ffb84d;
`;
