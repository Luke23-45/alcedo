import styled from "styled-components/native";
import { profileFontFamily } from "./profile-tokens";

export const ScreenRoot = styled.View`
  flex: 1;
`;

export const NavBar = styled.View`
  height: 56px;
  flex-direction: row;
  align-items: center;
  padding-left: 8px;
  padding-right: 8px;
`;

export const NavButton = styled.Pressable`
  min-height: 44px;
  min-width: 44px;
  align-items: center;
  justify-content: center;
  padding-left: 16px;
  padding-right: 16px;
`;

export const NavSpacer = styled.View`
  flex: 1;
`;

export const NavCancel = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 16px;
  font-weight: 400;
  letter-spacing: -0.3px;
  color: ${({ $color }) => $color};
`;

export const NavTitle = styled.Text<{ $color: string }>`
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${({ $color }) => $color};
`;

export const NavSave = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${({ $color }) => $color};
`;

/**
 * Reference vertical rhythm (below the 56pt nav): avatar +32, stats +44,
 * identity +12, then labelled sections at +18 with the kicker 12 above its
 * card. Kickers sit at x=24 (8pt inside the 16pt screen margin).
 */
export const Content = styled.View`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 40px;
`;

export const AvatarBlock = styled.View`
  align-items: center;
  margin-top: 24px;
`;

export const StatsWrap = styled.View`
  margin-top: 44px;
`;

export const IdentityWrap = styled.View`
  margin-top: 12px;
`;

export const SectionWrap = styled.View`
  margin-top: 18px;
`;

export const SectionLabel = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.35px;
  color: ${({ $color }) => $color};
  margin-left: 8px;
  margin-bottom: 12px;
`;
