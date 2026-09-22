import styled from 'styled-components/native';
import type { StyleProp, ViewStyle } from 'react-native';

/** Knockout stroke width from the spec's kudos-stack circles (2.2–2.4). */
export const KNOCKOUT_WIDTH = 2.2;

export const Avatar = styled.View<{ size: number; ringColor: string }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  border-width: ${KNOCKOUT_WIDTH}px;
  border-color: ${({ ringColor }) => ringColor};
  overflow: hidden;
  align-items: center;
  justify-content: center;
`;

export const fill: StyleProp<ViewStyle> = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

export const SolidFill = styled.View<{ color: string }>`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: ${({ color }) => color};
`;

export const InnerRing = styled.View<{ size: number }>`
  position: absolute;
  left: 0.5px;
  right: 0.5px;
  top: 0.5px;
  bottom: 0.5px;
  border-radius: ${({ size }) => size / 2 - KNOCKOUT_WIDTH}px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.18);
`;

export const Initial = styled.Text<{ size: number }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: ${({ size }) => (size * 14) / 36}px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  color: #ffffff;
`;

/** Bundled avatar photo: cover-fills the circle, cropped by the avatar's overflow. */
export const Photo = styled.Image`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;
