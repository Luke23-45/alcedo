import styled, { css } from 'styled-components/native';

/* Filter chips: 28pt pills, horizontally scrollable. Selected chip is white
   with #1C1C1E text; the rest are translucent with secondary text. */

export const ChipsScroll = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})`
  margin-top: 12px;
`;

export const ChipsContent = styled.View`
  flex-direction: row;
  gap: 8px;
  padding-left: 16px;
  padding-right: 16px;
`;

export const Chip = styled.Pressable<{ $selected: boolean; $width: number }>`
  height: 28px;
  width: ${({ $width }) => $width}px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $selected }) =>
    $selected ? '#FFFFFF' : theme.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(120,120,128,0.12)'};
  ${({ theme, $selected }) =>
    !$selected && theme.isDark
      ? css`
          border-width: 0.8px;
          border-color: rgba(255, 255, 255, 0.09);
        `
      : ''}
  ${({ theme, $selected }) =>
    $selected && !theme.isDark
      ? css`
          shadow-color: #14142b;
          shadow-offset: 0px 2px;
          shadow-opacity: 0.12;
          shadow-radius: 4px;
          elevation: 2;
        `
      : ''}
`;
