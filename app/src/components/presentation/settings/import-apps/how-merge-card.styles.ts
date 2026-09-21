import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

/** S5 §4: HOW MERGE WORKS card (backup-redesign.md §5: rx24, 20pt padding). */
export const MergeBody = styled.View`
  padding: 20px;
  gap: 14px;
`;

export const MergeRow = styled.View`
  flex-direction: row;
  gap: 8px;
`;

/** The bullet dot (backup-redesign.md §5: r2.2, #48484A). */
export const MergeBullet = styled.View`
  width: 4.4px;
  height: 4.4px;
  border-radius: 2.2px;
  background-color: ${({ theme }) => (theme.isDark ? '#48484A' : '#C7C7CC')};
  margin-top: 6px;
`;

/** The lead row — 12pt medium, primary ink. */
export const MergeTextLead = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption1', { weight: '500' })}
  font-size: 12px;
  line-height: 17px;
  flex: 1;
  color: ${({ theme }) => theme.color.content.primary};
`;

/** Rows 2–4 — 12pt medium, secondary ink. */
export const MergeText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption1', { weight: '500' })}
  font-size: 12px;
  line-height: 17px;
  flex: 1;
  color: ${({ theme }) => theme.color.content.secondary};
`;
