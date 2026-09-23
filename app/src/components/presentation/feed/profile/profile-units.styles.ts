import { StyleSheet } from "react-native";
import styled from "styled-components/native";
import { PROFILE, profileFontFamily } from "./profile-tokens";

export const Row = styled.View`
  height: 56px;
  flex-direction: row;
  align-items: flex-start;
  padding-top: 20px;
  padding-left: ${PROFILE.inset}px;
  padding-right: ${PROFILE.inset}px;
`;

export const RowLabel = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 13.5px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  flex: 1;
  padding-top: 9px;
`;

export const Divider = styled.View<{ $color: string; $top: number }>`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: ${PROFILE.inset}px;
  right: ${PROFILE.inset}px;
  height: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ $color }) => $color};
`;
