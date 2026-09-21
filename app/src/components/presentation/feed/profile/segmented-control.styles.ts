import styled, { css } from "styled-components/native";
import { profileFontFamily } from "./profile-tokens";

export const TRACK_HEIGHT = 28;
export const TRACK_RADIUS = 14;
export const THUMB_HEIGHT = 24;
export const THUMB_RADIUS = 12;

export const Track = styled.View<{ $width: number; $track: string }>`
  width: ${({ $width }) => $width}px;
  height: ${TRACK_HEIGHT}px;
  border-radius: ${TRACK_RADIUS}px;
  background-color: ${({ $track }) => $track};
  flex-direction: row;
`;

export const OptionLabel = styled.Text<{
  $selected: boolean;
  $size: number;
  $selectedColor: string;
}>`
  font-size: ${({ $size }) => $size}px;
  font-weight: 600;
  letter-spacing: -0.15px;
  color: ${({ $selected, $selectedColor }) => ($selected ? $selectedColor : "#8E8E93")};
  font-family: ${({ theme }) => profileFontFamily(theme)};
`;

export const Thumb = styled.View<{ $width: number; $thumb: string; $shadow: boolean }>`
  position: absolute;
  top: 2px;
  width: ${({ $width }) => $width}px;
  height: ${THUMB_HEIGHT}px;
  border-radius: ${THUMB_RADIUS}px;
  background-color: ${({ $thumb }) => $thumb};
  ${({ $shadow }) =>
    $shadow
      ? css`
          shadow-color: rgba(0, 0, 0, 0.18);
          shadow-offset: 0px 1px;
          shadow-opacity: 1;
          shadow-radius: 3px;
          elevation: 2;
        `
      : css`
          shadow-color: #000000;
          shadow-offset: 0px 2px;
          shadow-opacity: 0.55;
          shadow-radius: 4px;
          elevation: 3;
        `}
`;
