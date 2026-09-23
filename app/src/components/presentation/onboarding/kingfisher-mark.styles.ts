import styled from 'styled-components/native';
import { Animated } from 'react-native';

export const MarkRoot = styled(Animated.View)`
  aspect-ratio: 1.31;
`;

export const BackLayer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const BirdLayer = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
