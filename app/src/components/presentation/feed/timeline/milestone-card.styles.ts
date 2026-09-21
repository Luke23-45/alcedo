import styled from 'styled-components/native';
import {
  HERO_EDGE,
  HERO_INK_SUB,
  HERO_INK_UNIT,
  HERO_INK_VALUE,
  HERO_MEDALLION_FILL,
  HERO_SHADOW,
} from './timeline-tokens';

/**
 * Gold milestone hero (Screen 1 spec): 329×190, rx22, gold gradient, white
 * .40 edge, medallion + "100 SESSIONS" + tagline + date range. Baselines are
 * tuned to the spec (100 @ 112, SESSIONS @ 132, tagline @ 158, range @ 176
 * from the hero top). Posters are images — identical in light mode.
 */
export const Hero = styled.View`
  width: 100%;
  height: 190px;
  border-radius: 22px;
  overflow: hidden;
  align-items: center;
  padding-top: 26px;
  border-width: 1px;
  border-color: ${HERO_EDGE};
  shadow-color: ${HERO_SHADOW.color};
  shadow-offset: 0px ${HERO_SHADOW.offsetY}px;
  shadow-opacity: ${HERO_SHADOW.opacity};
  shadow-radius: ${HERO_SHADOW.radius}px;
  elevation: ${HERO_SHADOW.elevation};
`;

export const Medallion = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${HERO_MEDALLION_FILL};
  align-items: center;
  justify-content: center;
`;

export const Value = styled.Text`
  font-size: 52px;
  line-height: 52px;
  font-weight: 700;
  letter-spacing: -2.2px;
  margin-top: 4px;
  color: ${HERO_INK_VALUE};
`;

export const Unit = styled.Text`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2.8px;
  margin-top: 2px;
  color: ${HERO_INK_UNIT};
`;

export const Tagline = styled.Text`
  font-size: 11px;
  font-weight: 500;
  margin-top: 12px;
  color: ${HERO_INK_SUB};
`;

export const DateRange = styled.Text`
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 1.2px;
  margin-top: 6px;
  color: ${HERO_INK_SUB};
`;
