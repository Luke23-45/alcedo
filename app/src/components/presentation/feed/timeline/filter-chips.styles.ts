import styled, { css } from 'styled-components/native';
import { CHIP_FILL, CHIP_SELECTED_FILL, CHIP_SELECTED_INK, CHIP_STROKE, INK_CHIP_LABEL } from './timeline-tokens';

/** Filter chip: 28pt pill. The touch target reaches 44pt via hitSlop. */
export const Chip = styled.Pressable<{ $selected: boolean; $dark: boolean }>`
  height: 28px;
  border-radius: 14px;
  padding-left: 14px;
  padding-right: 14px;
  align-items: center;
  justify-content: center;
  border-width: 0.8px;
  ${({ $selected, $dark }) =>
    $selected
      ? css`
          background-color: ${$dark ? CHIP_SELECTED_FILL.dark : CHIP_SELECTED_FILL.light};
          border-color: transparent;
        `
      : css`
          background-color: ${$dark ? CHIP_FILL.dark : CHIP_FILL.light};
          border-color: ${$dark ? CHIP_STROKE.dark : CHIP_STROKE.light};
        `}
`;

export const ChipLabel = styled.Text<{ $selected: boolean; $dark: boolean }>`
  font-size: 12px;
  font-weight: ${({ $selected }) => ($selected ? 600 : 500)};
  letter-spacing: -0.15px;
  color: ${({ $selected, $dark }) =>
    $selected
      ? $dark
        ? CHIP_SELECTED_INK.dark
        : CHIP_SELECTED_INK.light
      : $dark
        ? INK_CHIP_LABEL.dark
        : INK_CHIP_LABEL.light};
`;
