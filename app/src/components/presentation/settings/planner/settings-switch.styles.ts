import styled, { css } from 'styled-components/native';

const TRACK_WIDTH = 44;
const TRACK_HEIGHT = 26;
const THUMB = 22;

/**
 * iOS-style switch. ON green is the spec hue (#30D158 dark, #34C759 light —
 * settings spec light-mode deltas); OFF is the recessed iOS track.
 */
export const SwitchTrack = styled.View<{ $on: boolean }>`
  width: ${TRACK_WIDTH}px;
  height: ${TRACK_HEIGHT}px;
  border-radius: ${TRACK_HEIGHT / 2}px;
  justify-content: center;
  ${({ theme, $on }) =>
    $on
      ? css`
          background-color: ${theme.isDark ? '#30D158' : '#34C759'};
        `
      : css`
          background-color: ${theme.isDark ? '#3A3A3C' : '#E5E5EA'};
        `}
`;

export const SwitchThumb = styled.View`
  width: ${THUMB}px;
  height: ${THUMB}px;
  border-radius: ${THUMB / 2}px;
  background-color: #ffffff;
  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.35;
  shadow-radius: 4px;
  elevation: 3;
`;
