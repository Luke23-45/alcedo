import { LinearGradient } from "expo-linear-gradient";
import { Pressable } from "react-native";
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
`;

export const SheetRange = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 10.5px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  text-align: center;
  margin-top: 4px;
`;

export const StepperRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

export const StepButton = styled.Pressable<{ $fill: string }>`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${({ $fill }) => $fill};
  align-items: center;
  justify-content: center;
`;

export const StepGlyph = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 22px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  line-height: 26px;
`;

export const StepValue = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: ${({ $color }) => $color};
  min-width: 120px;
  text-align: center;
`;

export const DoneButton = styled(Pressable)`
  height: 52px;
  border-radius: 26px;
  overflow: hidden;
  margin-top: 24px;
  align-items: center;
  justify-content: center;
`;

export const DoneFill = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

export const DoneLabel = styled.Text`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
`;

export const CancelButton = styled(Pressable)`
  height: 44px;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
`;

export const CancelLabel = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 17px;
  font-weight: 400;
  color: ${({ $color }) => $color};
`;
