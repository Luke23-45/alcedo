import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";
import { profileFontFamily } from "./profile-tokens";

export const Backdrop = styled.Pressable`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
`;

export const Sheet = styled.View<{ $surface: string; $border: string }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 70%;
  background-color: ${({ $surface }) => $surface};
  border-top-width: 1px;
  border-top-color: ${({ $border }) => $border};
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  border-curve: continuous;
  padding: 24px 20px 20px;
`;

export const SheetTitle = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 15.5px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: ${({ $color }) => $color};
  text-align: center;
  margin-bottom: 16px;
`;

export const AddRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

export const AddInput = styled.TextInput`
  flex: 1;
  height: 44px;
  border-radius: 12px;
  padding-left: 14px;
  padding-right: 14px;
  font-size: 15px;
`;

export const BlockButton = styled.Pressable`
  height: 44px;
  min-width: 88px;
  border-radius: 22px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  padding-left: 16px;
  padding-right: 16px;
`;

export const BlockFill = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

export const BlockLabel = styled.Text`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
`;

export const BlockedRow = styled.View`
  height: 52px;
  flex-direction: row;
  align-items: center;
`;

export const BlockedName = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ $color }) => $color};
  flex: 1;
`;

export const UnblockButton = styled.Pressable`
  min-height: 44px;
  min-width: 44px;
  align-items: center;
  justify-content: center;
  padding-left: 8px;
`;

export const UnblockLabel = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 13px;
  font-weight: 600;
  color: ${({ $color }) => $color};
`;

export const EmptyTitle = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 13.5px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  text-align: center;
  margin-top: 32px;
`;

export const EmptyBody = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 12px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  text-align: center;
  margin-top: 6px;
  margin-bottom: 32px;
`;
