import styled from "styled-components/native";
import { profileFontFamily } from "./profile-tokens";

/**
 * Reference (card-local): 68pt, four equal cells, hairlines at 90.25/180.5/
 * 270.75 spanning 14..54, value 15/700 baseline +38, micro-label 7.5/700
 * baseline +58.
 */
export const Strip = styled.View`
  flex-direction: row;
  height: 68px;
`;

export const Cell = styled.View`
  flex: 1;
  align-items: center;
  padding-top: 24px;
`;

export const Divider = styled.View<{ $color: string }>`
  position: absolute;
  left: 0;
  top: 14px;
  width: 1px;
  height: 40px;
  background-color: ${({ $color }) => $color};
`;

export const Value = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.4px;
  line-height: 18px;
  color: ${({ $color }) => $color};
`;

export const Label = styled.Text<{ $color: string }>`
  font-family: ${({ theme }) => profileFontFamily(theme)};
  font-size: 7.5px;
  font-weight: 700;
  letter-spacing: 0.7px;
  line-height: 10px;
  color: ${({ $color }) => $color};
  margin-top: 8px;
`;
