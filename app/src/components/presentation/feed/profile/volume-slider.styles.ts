import { LinearGradient } from "expo-linear-gradient";
import styled, { css } from "styled-components/native";
import { PROFILE, profileFontFamily } from "./profile-tokens";

/**
 * Reference geometry (card-absolute): track x=36 y=+8 w=321 h=6 rx=3,
 * thumb r=13 centered on the track, now-tick 2×14 at y=+4, 20k/50k labels
 * with baseline at y=+36 (9pt). The area is 44 tall so the whole strip is a
 * 44×321 touch target.
 */
export const SLIDER_HEIGHT = 44;
const TRACK_TOP = 8;
const TRACK_H = 6;
const THUMB_R = 13;

export const SliderArea = styled.View`
  width: ${PROFILE.cardWidth}px;
  height: ${SLIDER_HEIGHT}px;
`;

export const TrackBase = styled.View<{ $track: string }>`
  position: absolute;
  left: ${PROFILE.slider.trackX}px;
  top: ${TRACK_TOP}px;
  width: ${PROFILE.slider.trackWidth}px;
  height: ${TRACK_H}px;
  border-radius: ${TRACK_H / 2}px;
  background-color: ${({ $track }) => $track};
  overflow: hidden;
`;

export const TrackFill = styled(LinearGradient)`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
`;

export const NowTick = styled.View`
  position: absolute;
  width: 2px;
  height: 14px;
  border-radius: 1px;
  background-color: rgba(255, 255, 255, 0.55);
  top: ${TRACK_TOP - 4}px;
`;

export const Thumb = styled.View<{ $light: boolean }>`
  position: absolute;
  width: ${THUMB_R * 2}px;
  height: ${THUMB_R * 2}px;
  border-radius: ${THUMB_R}px;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
  top: ${TRACK_TOP + TRACK_H / 2 - THUMB_R}px;
  ${({ $light }) =>
    $light
      ? css`
          shadow-color: rgba(0, 0, 0, 0.28);
          shadow-offset: 0px 1px;
          shadow-opacity: 1;
          shadow-radius: 3px;
          elevation: 3;
          border-width: 0.5px;
          border-color: rgba(0, 0, 0, 0.06);
        `
      : css`
          shadow-color: #000000;
          shadow-offset: 0px 2px;
          shadow-opacity: 0.55;
          shadow-radius: 4px;
          elevation: 4;
          border-width: 0.8px;
          border-color: rgba(0, 0, 0, 0.08);
        `}
`;

export const ThumbCore = styled(LinearGradient)`
  width: 9px;
  height: 9px;
  border-radius: 4.5px;
`;

export const RangeEdge = styled.Text<{ $color: string; $right?: boolean }>`
  position: absolute;
  bottom: 6px;
  ${({ $right }) => ($right ? "right: 36px;" : "left: 36px;")}
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 9px;
  font-weight: 600;
  color: ${({ $color }) => $color};
`;
