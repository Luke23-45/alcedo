import styled from 'styled-components/native';
import {
  CHALLENGE_RANK_INK,
  CHALLENGE_TRACK,
  INK_META,
  INK_TITLE,
  MEDALLION_EDGE,
  MEDALLION_GLOW,
} from './timeline-tokens';

export const BannerRow = styled.View`
  flex-direction: row;
  align-items: center;
  min-height: 76px;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
  padding-right: 20px;
`;

/** Gold medallion: 40pt circle with the spec's glow (dy 5, blur 10, #FFD84D 40%). */
export const Medallion = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border-width: 1px;
  border-color: ${MEDALLION_EDGE};
  align-items: center;
  justify-content: center;
  shadow-color: ${MEDALLION_GLOW};
  shadow-offset: 0px 5px;
  shadow-opacity: 0.4;
  shadow-radius: 10px;
  elevation: 6;
`;

export const Middle = styled.View`
  flex: 1;
  margin-left: 12px;
  justify-content: center;
`;

export const Title = styled.Text<{ $dark: boolean }>`
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.25px;
  color: ${({ $dark }) => ($dark ? INK_TITLE.dark : INK_TITLE.light)};
`;

export const Sub = styled.Text<{ $dark: boolean }>`
  font-size: 10.5px;
  font-weight: 500;
  margin-top: 3px;
  color: ${({ $dark }) => ($dark ? INK_META.dark : INK_META.light)};
`;

export const Track = styled.View<{ $dark: boolean }>`
  flex: 1;
  height: 3.5px;
  border-radius: 1.75px;
  margin-top: 8px;
  overflow: hidden;
  background-color: ${({ $dark }) => ($dark ? CHALLENGE_TRACK.dark : CHALLENGE_TRACK.light)};
`;

export const RankCol = styled.View`
  align-items: flex-end;
  justify-content: center;
  margin-left: 8px;
`;

export const Rank = styled.Text<{ $dark: boolean }>`
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.55px;
  color: ${({ $dark }) => ($dark ? CHALLENGE_RANK_INK.dark : CHALLENGE_RANK_INK.light)};
`;

export const Points = styled.Text<{ $dark: boolean }>`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.6px;
  margin-top: 2px;
  color: ${({ $dark }) => ($dark ? INK_META.dark : INK_META.light)};
`;
