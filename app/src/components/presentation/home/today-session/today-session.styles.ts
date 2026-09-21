import styled from 'styled-components/native';
import { alpha } from '@/styles/theme';
import { HomeGradient } from '../shared/home-gradient';
import { HomeCard } from '../shared/home-card';

/** 74pt = 104pt card − 2pt edge − 28pt padding. */
export const CardBody = styled.View`
  height: 74px;
  flex-direction: row;
  align-items: center;
`;

export const IconBadge = styled(HomeGradient).attrs({ variant: 'brand' as const })`
  width: 60px;
  height: 60px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

/** Top-light gloss, clipped by the badge's overflow. */
export const Gloss = styled(HomeGradient).attrs({ variant: 'gloss' as const })`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  opacity: 0.55;
`;

export const TextColumn = styled.View`
  flex: 1;
  margin-left: ${({ theme }) => theme.space.lg}px;
  margin-right: ${({ theme }) => theme.space.md}px;
`;

/** Difficulty pill: 86×19, translucent white with a hairline edge. */
export const DifficultyChip = styled.View`
  align-self: flex-start;
  height: 19px;
  padding-horizontal: ${({ theme }) => theme.space.md}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${alpha('#FFFFFF', 0.08)};
  border-width: 0.7px;
  border-color: ${alpha('#FFFFFF', 0.07)};
  align-items: center;
  justify-content: center;
  margin-top: 6px;
`;

export const PlayPressable = styled.Pressable`
  width: 42px;
  height: 42px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-width: 0.9px;
  border-color: ${alpha('#FFFFFF', 0.22)};
  shadow-color: ${({ theme }) => theme.color.interactive.accent};
  shadow-offset: 0px 6px;
  shadow-opacity: 0.35;
  shadow-radius: 12px;
  elevation: 8;
`;

export const PlayGradient = styled(HomeGradient).attrs({ variant: 'brand' as const })`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export const ActionsRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.space.md}px;
  margin-top: ${({ theme }) => theme.space.md}px;
`;

export const ActionTile = styled.View`
  flex: 1;
  height: 76px;
  border-radius: ${({ theme }) => theme.home.radius.tile}px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`;

export const StartTilePressable = styled.Pressable`
  flex: 1;
  height: 76px;
  border-radius: ${({ theme }) => theme.home.radius.tile}px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${alpha('#FFFFFF', 0.22)};
  shadow-color: ${({ theme }) => theme.color.interactive.accent};
  shadow-offset: 0px 8px;
  shadow-opacity: 0.35;
  shadow-radius: 16px;
  elevation: 8;
`;

export const StartTileGradient = styled(HomeGradient).attrs({ variant: 'brand' as const })`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const StartGloss = styled(HomeGradient).attrs({ variant: 'gloss' as const })`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 38px;
  opacity: 0.45;
`;

export const TilePressable = styled.Pressable`
  flex: 1;
  height: 76px;
`;

export const TilePlain = styled.View`
  flex: 1;
  height: 76px;
`;

export const TileBody = styled(HomeCard)`
  height: 76px;
  align-items: center;
  justify-content: center;
`;
