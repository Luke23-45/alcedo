import { LinearGradient } from 'expo-linear-gradient';
import { type as typeStyle } from '@/styles/theme';
import styled from 'styled-components/native';

// "None" option card (backup-redesign.md S2): the standard card anatomy
// (gradient edge + diagonal body); when selected the edge becomes the
// accent stroke and a checkmark appears.

export const NonePressable = styled.Pressable`
  margin-horizontal: 16px;
  border-radius: 20px;
  min-height: 56px;
`;

export const NoneCardEdge = styled(LinearGradient)`
  border-radius: 20px;
  padding: 1.4px;
`;

export const NoneCardBody = styled(LinearGradient)`
  border-radius: 18.6px;
  overflow: hidden;
`;

export const NoneRow = styled.View`
  min-height: 56px;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 16px;
  gap: 12px;
`;

export const NoneText = styled.View`
  flex: 1;
  gap: 2px;
`;

export const NoneTitle = styled.Text`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '600' })}
  font-size: 16px;
  color: ${({ theme }) => theme.color.content.primary};
`;

// "Auto-backup will silently do nothing" (backup-redesign.md S2).
export const NoneSubtitle = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '500' })}
  font-size: 11px;
  color: ${({ theme }) => theme.color.content.secondary};
`;
