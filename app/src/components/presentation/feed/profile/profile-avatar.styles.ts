import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";
import { profileFontFamily } from "./profile-tokens";

export const AVATAR_SIZE = 88;

/** Outer glow layer: no clipping, so the violet aura survives. */
export const AvatarGlow = styled.View`
  width: ${AVATAR_SIZE}px;
  height: ${AVATAR_SIZE}px;
  border-radius: ${AVATAR_SIZE / 2}px;
  shadow-color: #5e5ce6;
  shadow-offset: 0px 5px;
  shadow-opacity: 0.5;
  shadow-radius: 10px;
  elevation: 6;
`;

export const AvatarWrap = styled.View`
  width: ${AVATAR_SIZE}px;
  height: ${AVATAR_SIZE}px;
  border-radius: ${AVATAR_SIZE / 2}px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-width: 1.2px;
  border-color: rgba(255, 255, 255, 0.2);
`;

export const AvatarFill = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

export const Initial = styled.Text`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 34px;
  font-weight: 600;
  letter-spacing: -1px;
  color: #ffffff;
  margin-top: 6px;
`;
