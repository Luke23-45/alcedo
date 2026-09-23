import styled from 'styled-components/native';
import { Animated } from 'react-native';

export const BackgroundRoot = styled.View`
  flex: 1;
`;

export const BackgroundLayer = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
