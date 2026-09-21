import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';

export const Track = styled.View<{ $fill: string }>`
  height: 36px;
  border-radius: 18px;
  background-color: ${({ $fill }) => $fill};
  flex-direction: row;
`;

export const Thumb = styled(Animated.View)<{
  $fill: string;
  $border: string;
  $dark: boolean;
}>`
  position: absolute;
  left: 2px;
  top: 2px;
  width: 68.2px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ $fill }) => $fill};
  border-width: 0.8px;
  border-color: ${({ $border }) => $border};
  ${({ $dark }) =>
    $dark
      ? `
    shadow-color: #000000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.5;
    shadow-radius: 3px;
    elevation: 2;
  `
      : `
    shadow-color: #000000;
    shadow-offset: 0px 1px;
    shadow-opacity: 0.18;
    shadow-radius: 3px;
    elevation: 2;
  `}
`;

export const Option = styled.Pressable`
  flex: 1;
  height: 36px;
  align-items: center;
  justify-content: center;
`;
