import styled from 'styled-components/native';
import { alpha } from '@/styles/theme';
import { HomeGradient } from '../shared/home-gradient';

/** 1.2pt gradient border (gCoachBorder), 30pt radius. */
export const BorderLayer = styled(HomeGradient)`
  border-radius: 30px;
  padding: 1.2px;
`;

export const BodyLayer = styled(HomeGradient)`
  border-radius: 29px;
  padding: ${({ theme }) => theme.space.base}px;
  overflow: hidden;
`;

export const MeshLayer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

/** 34×34 icon badge, gCoach gradient (#8E7BFF→#FF5AC8). */
export const IconBadge = styled(HomeGradient)`
  width: 34px;
  height: 34px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const IconGloss = styled(HomeGradient).attrs({ variant: 'gloss' as const })`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 17px;
  opacity: 0.5;
`;

/** BETA pill: 42×20, neutral wash per mode. */
export const BetaChip = styled.View`
  width: 42px;
  height: 20px;
  border-radius: 10px;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.08) : alpha('#787880', 0.12))};
  border-width: 0.7px;
  border-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.09) : alpha('#787880', 0.2))};
  align-items: center;
  justify-content: center;
  margin-left: auto;
`;

export const BodyRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${({ theme }) => theme.space.sm}px;
`;

export const CopyBlock = styled.View`
  flex: 1;
  margin-right: ${({ theme }) => theme.space.md}px;
`;

export const RingWrap = styled.View`
  width: 54px;
  height: 54px;
  align-items: center;
  justify-content: center;
`;

export const RingCenter = styled.View`
  position: absolute;
  align-items: center;
`;

export const ButtonsRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.space.sm}px;
  margin-top: ${({ theme }) => theme.space.sm}px;
`;

/** 116pt reference width; grows for long locales, never shrinks the label. */
export const AdjustButton = styled(HomeGradient)`
  min-width: 116px;
  height: 32px;
  padding-horizontal: ${({ theme }) => theme.space.base}px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const AdjustGloss = styled(HomeGradient).attrs({ variant: 'gloss' as const })`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 16px;
  opacity: 0.35;
`;

export const DismissButton = styled.View`
  min-width: 88px;
  height: 32px;
  padding-horizontal: ${({ theme }) => theme.space.md}px;
  border-radius: 16px;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.07) : alpha('#787880', 0.12))};
  border-width: 0.9px;
  border-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.1) : alpha('#787880', 0.2))};
  align-items: center;
  justify-content: center;
`;

export const SlotPressable = styled.Pressable``;
export const SlotStatic = styled.View``;
