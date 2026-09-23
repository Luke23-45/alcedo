import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';

export const CardShadow = styled.View<{
  $shadowColor: string;
  $shadowOpacity: number;
  $shadowOffsetY: number;
  $shadowRadius: number;
}>`
  border-radius: 28px;
  shadow-color: ${({ $shadowColor }) => $shadowColor};
  shadow-opacity: ${({ $shadowOpacity }) => $shadowOpacity};
  shadow-offset: 0px ${({ $shadowOffsetY }) => $shadowOffsetY}px;
  shadow-radius: ${({ $shadowRadius }) => $shadowRadius}px;
  elevation: 8;
`;

export const CardEdge = styled(LinearGradient)`
  border-radius: 28px;
  padding: 1px;
`;

export const CardBody = styled(LinearGradient)`
  border-radius: 27px;
`;
