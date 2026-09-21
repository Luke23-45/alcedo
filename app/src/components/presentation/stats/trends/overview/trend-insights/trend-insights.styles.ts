import { LinearGradient } from 'expo-linear-gradient';
import { createElement } from 'react';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';

type BoxProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Iridescent 1.2pt edge (purple → cyan → pink, measured from the reference). */
function EdgeView({ children, style }: BoxProps) {
  return createElement(
    LinearGradient,
    {
      colors: [
        'rgba(167,139,250,0.55)',
        'rgba(44,233,247,0.22)',
        'rgba(255,90,200,0.10)',
      ],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
      style,
    },
    children,
  );
}

export const InsightEdge = styled(EdgeView)`
  border-radius: 30px;
  padding: 1.2px;
  shadow-color: #000000;
  shadow-offset: 0px 10px;
  shadow-opacity: 0.5;
  shadow-radius: 14px;
  elevation: 8;
`;

function BodyView({ children, style }: BoxProps) {
  return createElement(HomeGradient, { variant: 'cardBody', style }, children);
}

/** Card body with the standard card gradient; 12/20/15 padding for the 152pt card. */
export const InsightBody = styled(BodyView)`
  border-radius: 29px;
  padding: 12px 20px 15px;
  overflow: hidden;
`;

export const TopRow = styled.View`
  flex-direction: row;
  align-items: center;
  height: 34px;
`;

export const IconWrap = styled.View`
  width: 34px;
  height: 34px;
  border-radius: 12px;
  shadow-color: #8e7bff;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.55;
  shadow-radius: 10px;
  elevation: 6;
`;

export const BetaPill = styled.View<{ $dark: boolean }>`
  min-width: 42px;
  height: 20px;
  padding-horizontal: 8px;
  border-radius: 10px;
  background-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.08)' : 'rgba(120,120,128,0.12)')};
  border-width: 0.7px;
  border-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.09)' : 'rgba(120,120,128,0.16)')};
  align-items: center;
  justify-content: center;
  margin-left: auto;
`;

export const InsightRow = styled.View<{ $first: boolean }>`
  flex-direction: row;
  align-items: flex-start;
  margin-top: ${({ $first }) => ($first ? 12 : 13)}px;
`;

export const SparkWrap = styled.View`
  width: 10px;
  height: 12px;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
`;

export const InsightText = styled.View`
  flex: 1;
  margin-left: 8px;
`;
