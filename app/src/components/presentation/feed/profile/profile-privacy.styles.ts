import { StyleSheet } from "react-native";
import styled from "styled-components/native";
import { PROFILE, profileFontFamily } from "./profile-tokens";

/**
 * Reference: visibility row 56, five 52 toggle rows, blocked row 64
 * (56 + 260 + 64 = 380). Hairlines sit exactly on the row boundaries, so
 * they are absolutely positioned and add no height.
 */
export const VisibilityRow = styled.View`
  height: 56px;
  flex-direction: row;
  align-items: flex-start;
  padding-top: 14px;
  padding-left: ${PROFILE.inset}px;
  padding-right: ${PROFILE.inset}px;
`;

export const VisibilityLabel = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 13.5px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
  padding-top: 9px;
`;

export const ToggleRow = styled.Pressable`
  height: 52px;
  flex-direction: row;
  align-items: flex-start;
  padding-top: 13px;
  padding-left: ${PROFILE.inset}px;
  padding-right: ${PROFILE.inset}px;
`;

export const ToggleLabel = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 13.5px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  flex: 1;
  padding-top: 7px;
`;

export const BlockedRow = styled.Pressable`
  height: 64px;
  flex-direction: row;
  align-items: flex-start;
  padding-top: 20px;
  padding-left: ${PROFILE.inset}px;
  padding-right: 12px;
`;

export const BlockedLabel = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 13.5px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  flex: 1;
`;

export const BlockedValue = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 13px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  margin-right: 12px;
`;

export const VisibilityWrap = styled.View`
  flex: 1;
  align-items: flex-end;
  margin-left: 12px;
`;

export const Divider = styled.View<{ $color: string; $top: number }>`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: ${PROFILE.inset}px;
  right: ${PROFILE.inset}px;
  height: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ $color }) => $color};
`;
