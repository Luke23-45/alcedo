import styled from 'styled-components/native';
import type { StyleProp, ViewStyle } from 'react-native';

export const POSTER_HEIGHT = 190;
export const POSTER_RADIUS = 22;
/** Single internal inset for every slot (feed, detail, composer). See share-poster.tsx. */
export const POSTER_INSET = 16;

/** Outer wrapper owns the drop shadow; the inner view clips to the radius. */
export const ShadowWrap = styled.View`
  border-radius: ${POSTER_RADIUS}px;
  shadow-color: #000000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.45;
  shadow-radius: 12px;
  elevation: 8;
`;

export const Poster = styled.View`
  width: 100%;
  height: ${POSTER_HEIGHT}px;
  border-radius: ${POSTER_RADIUS}px;
  overflow: hidden;
`;

export const fill: StyleProp<ViewStyle> = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

export const gloss: StyleProp<ViewStyle> = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  height: '50%',
  opacity: 0.4,
};

/** 1pt white .22 edge, inset 0.5pt so it hugs the corner radius. */
export const Edge = styled.View`
  position: absolute;
  left: 0.5px;
  right: 0.5px;
  top: 0.5px;
  bottom: 0.5px;
  border-radius: ${POSTER_RADIUS - 0.5}px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.22);
`;

export const Content = styled.View`
  position: absolute;
  left: ${POSTER_INSET}px;
  right: ${POSTER_INSET}px;
  top: 0;
  bottom: 0;
`;

const PosterText = styled.Text`
  position: absolute;
  font-family: ${({ theme }) => theme.font.text};
  color: #ffffff;
`;

export const Kicker = styled(PosterText)`
  top: 18px;
  font-size: 8px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 1.2px;
  color: rgba(255, 255, 255, 0.72);
  text-transform: uppercase;
`;

export const Hero = styled(PosterText)`
  top: 42px;
  font-size: 40px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: -1.6px;
`;

export const HeroUnit = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15.5px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: 0px;
  color: rgba(255, 255, 255, 0.72);
`;

export const WorkoutName = styled(PosterText)`
  top: 86px;
  font-size: 12.5px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.2px;
  color: rgba(255, 255, 255, 0.88);
`;

export const StatValue = styled(PosterText)<{ $column: number }>`
  top: 115px;
  left: ${({ $column }) => $column * 104}px;
  font-size: 14px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: -0.3px;
`;

export const StatLabel = styled(PosterText)<{ $column: number }>`
  top: 134px;
  left: ${({ $column }) => $column * 104}px;
  font-size: 7.5px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 0.7px;
  color: rgba(255, 255, 255, 0.62);
  text-transform: uppercase;
`;

export const PillRow = styled.View`
  position: absolute;
  top: 154px;
  left: 0;
  right: 0;
  flex-direction: row;
  gap: 8px;
`;

export const Pill = styled.View`
  height: 22px;
  padding-left: 12px;
  padding-right: 12px;
  border-radius: 11px;
  background-color: rgba(255, 255, 255, 0.2);
  border-width: 0.8px;
  border-color: rgba(255, 255, 255, 0.3);
  align-items: center;
  justify-content: center;
`;

export const PillText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 8px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 0.6px;
  color: #ffffff;
  text-transform: uppercase;
`;
