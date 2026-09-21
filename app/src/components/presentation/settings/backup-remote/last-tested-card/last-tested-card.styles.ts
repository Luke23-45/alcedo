import { type as typeStyle } from '@/styles/theme';
import styled from 'styled-components/native';

// Last-tested row: status dot + title + detail, in the shared 58pt row
// anatomy (16pt side padding, text column gap).
export const LastTestedRow = styled.View`
  min-height: 58px;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 14px;
  padding-top: 10px;
  padding-bottom: 10px;
  gap: 12px;
`;

export const StatusDot = styled.View<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({ $color }) => $color};
`;

export const LastTestedText = styled.View`
  flex: 1;
  gap: 3px;
  justify-content: center;
`;

// "Success · Sep 22, 2026, 11:12 AM" — 13.5pt semibold.
export const LastTestedTitle = styled.Text<{ $color?: string }>`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '600' })}
  font-size: 13.5px;
  color: ${({ theme, $color }) => $color ?? theme.color.content.primary};
`;

// "Not tested yet" — 13.5pt semibold on the secondary tone.
export const NeverTitle = styled.Text`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '600' })}
  font-size: 13.5px;
  color: ${({ theme }) => theme.color.content.secondary};
`;

// "1.4 GB uploaded in 2.1s" — 10.5pt medium on the secondary tone.
export const LastTestedDetail = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '500' })}
  font-size: 10.5px;
  line-height: 14px;
  color: ${({ theme }) => theme.color.content.secondary};
`;
