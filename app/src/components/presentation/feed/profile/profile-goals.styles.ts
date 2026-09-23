import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet } from "react-native";
import styled from "styled-components/native";
import { PROFILE, profileFontFamily } from "./profile-tokens";

export const Header = styled.View`
  height: 46px;
  justify-content: flex-end;
  padding-left: ${PROFILE.inset}px;
  padding-right: ${PROFILE.inset}px;
  padding-bottom: 10px;
`;

export const HeaderTitle = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 15.5px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${({ $color }) => $color};
`;

export const RingRow = styled(Pressable)`
  height: 52px;
  flex-direction: row;
  align-items: center;
  padding-left: ${PROFILE.inset}px;
  padding-right: 12px;
`;

export const Dot = styled(LinearGradient)`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  margin-left: 1px;
  margin-right: 11px;
`;

export const RingLabel = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 13.5px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  margin-top: 2px;
  flex: 1;
`;

export const RingValue = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ $color }) => $color};
  margin-top: 2px;
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

export const RowsGap = styled.View`
  height: 8px;
`;

export const VolumeHeader = styled.View`
  height: 34px;
  flex-direction: row;
  align-items: flex-start;
  padding-top: 15px;
  padding-left: ${PROFILE.inset}px;
  padding-right: ${PROFILE.inset}px;
`;

export const VolumeLabel = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 13.5px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  flex: 1;
`;

export const VolumeValue = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: -0.25px;
  color: ${({ $color }) => $color};
  margin-left: auto;
`;

export const CaptionWrap = styled.View`
  height: 24px;
  padding-top: 2px;
  align-items: center;
`;

export const Caption = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 10px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  text-align: center;
`;
