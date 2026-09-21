import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

// "Filename" (S4): the preview mirrors the effect's naming pattern exactly —
// device local time, no timezone. Preview only; the effect builds the real name.
export const FilenameWrap = styled.View`
  margin-bottom: 16px;
`;

/** "Device local time · no timezone · generated on export" — 9pt, secondary. */
export const FilenameCaption = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '500' })}
  font-size: 9px;
  line-height: 13px;
  color: ${({ theme }) => theme.color.content.secondary};
  margin-top: 4px;
`;

export const FilenameText = styled.Text`
  ${({ theme }) => {
    const t = typeStyle(theme, 'subheadline', { weight: '500' });
    return { ...t, fontFamily: theme.font.mono, fontSize: 11.5, lineHeight: 16 };
  }}
  color: ${({ theme }) => theme.color.content.secondary};
`;
