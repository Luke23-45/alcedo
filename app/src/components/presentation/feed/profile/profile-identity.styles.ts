import { Pressable, StyleSheet } from "react-native";
import styled from "styled-components/native";
import { PROFILE, profileFontFamily } from "./profile-tokens";

export const Row = styled(Pressable)`
  height: 52px;
  flex-direction: row;
  align-items: center;
  padding-left: ${PROFILE.inset}px;
  padding-right: 12px;
`;

export const RowLabel = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 13px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  margin-top: 3px;
`;

export const RowValue = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ $color }) => $color};
  text-align: right;
  flex: 1;
  margin-top: 3px;
  margin-right: 12px;
`;

export const Divider = styled.View<{ $color: string; $top: number }>`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: ${PROFILE.inset}px;
  right: ${PROFILE.inset}px;
  height: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ $color }) => $color};
`;

export const BioSection = styled(Pressable)`
  height: 94px;
  padding-top: 21px;
  padding-left: ${PROFILE.inset}px;
  padding-right: ${PROFILE.inset}px;
`;

export const BioHeader = styled.View`
  flex-direction: row;
  align-items: baseline;
  margin-bottom: 12px;
`;

export const BioKicker = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: ${({ $color }) => $color};
`;

export const BioCounter = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.2px;
  color: ${({ $color }) => $color};
  margin-left: auto;
`;

export const BioText = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 13px;
  font-weight: 500;
  line-height: 19px;
  color: ${({ $color }) => $color};
  height: 38px;
`;
