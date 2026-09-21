import styled, { css } from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

// CSV/JSON segmented control inside a card (S4): white-6% track, the selected
// segment is a white-13% pill with a 0.8pt white edge; each segment ≥ 44pt.
export const SegmentWrap = styled.View`
  margin-bottom: 16px;
`;

/** "Selection is not persisted · reopens at CSV" (backup-redesign.md §4) —
 * 9pt secondary, below the card, inset to the text column. */
export const NotPersistedCaption = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '500' })}
  font-size: 9px;
  line-height: 13px;
  color: ${({ theme }) => theme.color.content.secondary};
  margin-top: 8px;
  margin-left: 20px;
`;

export const SegmentTrack = styled.View`
  flex-direction: row;
  padding: 2px;
  border-radius: 24px;
  background-color: rgba(255, 255, 255, 0.06);
`;

export const SegmentButton = styled.Pressable<{ $selected: boolean }>`
  flex: 1;
  min-height: 44px;
  border-radius: 22px;
  align-items: center;
  justify-content: center;
  ${({ $selected }) =>
    $selected
      ? css`
          background-color: rgba(255, 255, 255, 0.13);
          border-width: 0.8px;
          border-color: rgba(255, 255, 255, 0.12);
        `
      : css`
          border-width: 0.8px;
          border-color: transparent;
        `}
`;

export const SegmentLabel = styled.Text<{ $selected: boolean }>`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '600' })}
  color: ${({ theme, $selected }) =>
    $selected ? theme.color.content.primary : theme.color.content.tertiary};
`;
