import styled from "styled-components/native";
import { profileFontFamily } from "./profile-tokens";

/**
 * Reference: 12pt below the CONNECTED card, a 361×48 rx24 danger pill
 * (red 10% fill, red 22% hairline), then the version line. The reference's
 * pill said "Log Out" — this app has no auth, so the pill carries the real
 * destructive action instead: Delete Account.
 */
export const Footer = styled.View`
  align-items: center;
  padding-top: 12px;
  padding-bottom: 40px;
`;

export const DangerButton = styled.Pressable<{ $fill: string; $stroke: string }>`
  width: 100%;
  min-height: 48px;
  padding-vertical: 12px;
  padding-horizontal: 20px;
  border-radius: 24px;
  background-color: ${({ $fill }) => $fill};
  border-width: 1px;
  border-color: ${({ $stroke }) => $stroke};
  align-items: center;
  justify-content: center;
`;

export const DangerLabel = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 14.5px;
  font-weight: 600;
  letter-spacing: -0.25px;
  text-align: center;
  color: ${({ $color }) => $color};
`;

export const Version = styled.Text`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2px;
  color: #48484a;
  margin-top: 20px;
`;
