import styled from 'styled-components/native';
import { ScrollView } from 'react-native';
import { alpha } from '@/styles/theme';
import { HomeGradient } from '../shared/home-gradient';

export const Cards = styled(ScrollView).attrs(({ theme }) => ({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    gap: theme.space.md,
    paddingHorizontal: theme.layout.screenPadding,
  },
}))`
  margin-horizontal: ${({ theme }) => -theme.layout.screenPadding}px;
`;

export const ProgramCard = styled.View`
  width: 160px;
  height: 190px;
  border-radius: ${({ theme }) => theme.home.radius.program}px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${alpha('#FFFFFF', 0.18)};
`;

export const CardGradient = styled(HomeGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const Watermark = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  opacity: 0.09;
`;

export const Scrim = styled(HomeGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const CardContent = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.space.md}px;
  justify-content: space-between;
`;

export const TopRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

export const Tag = styled.View`
  height: 20px;
  padding-horizontal: ${({ theme }) => theme.space.sm}px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  background-color: ${alpha('#FFFFFF', 0.18)};
  border-width: 0.7px;
  border-color: ${alpha('#FFFFFF', 0.24)};
  align-items: center;
  justify-content: center;
`;

export const BottomGroup = styled.View``;

export const ProgressTrack = styled.View`
  height: 3.5px;
  border-radius: 1.75px;
  background-color: ${alpha('#FFFFFF', 0.22)};
  overflow: hidden;
  margin-top: ${({ theme }) => theme.space.sm}px;
`;

export const ProgressFill = styled.View`
  height: 100%;
  border-radius: 1.75px;
`;

export const EmptyBox = styled.View`
  padding-horizontal: ${({ theme }) => theme.space.base}px;
  padding-vertical: ${({ theme }) => theme.space.md}px;
`;
