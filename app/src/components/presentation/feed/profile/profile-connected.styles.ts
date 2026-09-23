import { StyleSheet } from "react-native";
import styled from "styled-components/native";
import { PROFILE, profileFontFamily } from "./profile-tokens";

/**
 * Reference (card-local): two 56pt rows, hairline at 56 (36..357). Icon
 * 32×11 tile at row-top+12; title 13.5/600 baseline +24, subtitle 10.5/500
 * baseline +42; status 12/600 baseline +32, right edge at 325.
 */
export const Row = styled.View`
  height: 56px;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  padding-right: ${PROFILE.inset}px;
`;

export const IconBox = styled.View<{ $tile: string }>`
  width: 32px;
  height: 32px;
  border-radius: 11px;
  background-color: ${({ $tile }) => $tile};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const TextCol = styled.View`
  flex: 1;
  margin-top: 2px;
`;

export const Title = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ $color }) => $color};
`;

export const Subtitle = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 10.5px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  margin-top: 4px;
`;

export const Status = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.15px;
  color: ${({ $color }) => $color};
  margin-top: 2px;
  margin-right: 16px;
`;

export const Divider = styled.View<{ $color: string }>`
  position: absolute;
  top: 56px;
  left: ${PROFILE.inset}px;
  right: ${PROFILE.inset}px;
  height: ${StyleSheet.hairlineWidth}px;
  background-color: ${({ $color }) => $color};
`;
