import styled, { css } from "styled-components/native";

export const TOGGLE_WIDTH = 44;
export const TOGGLE_HEIGHT = 26;
const KNOB = 22;

export const ToggleTrack = styled.View<{ $on: string; $off: string; $value: boolean }>`
  width: ${TOGGLE_WIDTH}px;
  height: ${TOGGLE_HEIGHT}px;
  border-radius: ${TOGGLE_HEIGHT / 2}px;
  background-color: ${({ $on, $off, $value }) => ($value ? $on : $off)};
  justify-content: center;
`;

export const ToggleKnob = styled.View`
  width: ${KNOB}px;
  height: ${KNOB}px;
  border-radius: ${KNOB / 2}px;
  background-color: #ffffff;
  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3px;
  elevation: 2;
  ${({ theme }) =>
    !theme.isDark &&
    css`
      border-width: 0.5px;
      border-color: rgba(0, 0, 0, 0.06);
    `}
`;
