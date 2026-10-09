import styled from 'styled-components/native';
import { type as typeHelper } from '@/styles/theme';
import { sessionPalette } from '../session-tokens';

export const CardPressable = styled.Pressable`
  min-height: 84px;
`;

export const CardContent = styled.View`
  padding: 14px 16px;
  gap: 8px;
`;

export const NextRail = styled.View`
  position: absolute;
  left: 2px;
  top: 14px;
  bottom: 14px;
  width: 2.5px;
  border-radius: 1.5px;
  background-color: ${({ theme }) => sessionPalette(theme.isDark).row.nextRail};
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const IndexTile = styled.View<{ $phase: 'complete' | 'current' | 'upcoming' }>`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $phase }) => {
    const pal = sessionPalette(theme.isDark).card;
    if ($phase === 'complete') return pal.chipDoneBg;
    if ($phase === 'current') return pal.setTileCurrentBg;
    return pal.indexTile;
  }};
`;

export const IndexText = styled.Text<{ $phase: 'complete' | 'current' | 'upcoming' }>`
  font-family: ${({ theme }) => typeHelper(theme, 'caption1').fontFamily};
  font-size: 13px;
  font-weight: 700;
  font-variant: tabular-nums;
  color: ${({ theme, $phase }) => {
    const pal = sessionPalette(theme.isDark).card;
    if ($phase === 'complete') return pal.chipDoneText;
    if ($phase === 'current') return pal.setTileCurrentText;
    return pal.indexNumber;
  }};
`;

export const TitleContainer = styled.View`
  flex: 1;
  gap: 2px;
`;

export const NameRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const ExerciseName = styled.Text<{ $complete?: boolean }>`
  font-family: ${({ theme }) => typeHelper(theme, 'title3').fontFamily};
  font-size: 17px;
  line-height: 22px;
  font-weight: 600;
  letter-spacing: -0.35px;
  color: ${({ theme, $complete }) => {
    const pal = sessionPalette(theme.isDark).card;
    return $complete ? pal.nameDone : pal.name;
  }};
`;

export const NextChip = styled.View`
  padding-horizontal: 6px;
  padding-vertical: 2px;
  border-radius: 6px;
  background-color: ${({ theme }) => sessionPalette(theme.isDark).row.nextChipBg};
`;

export const NextChipText = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'caption2').fontFamily};
  font-size: 9px;
  line-height: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: ${({ theme }) => sessionPalette(theme.isDark).row.nextChipText};
`;

export const ChevronText = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'body').fontFamily};
  font-size: 18px;
  line-height: 22px;
  font-weight: 500;
  color: ${({ theme }) => sessionPalette(theme.isDark).row.chevron};
`;

export const MetaText = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'caption2').fontFamily};
  font-size: 11px;
  line-height: 14px;
  font-weight: 500;
  letter-spacing: -0.1px;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export const ProgressRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-top: 2px;
`;

export const ProgressBarTrack = styled.View`
  flex: 1;
  height: 3px;
  border-radius: 1.5px;
  background-color: ${({ theme }) => theme.color.fill.quaternary};
  overflow: hidden;
`;

export const ProgressFraction = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'caption2').fontFamily};
  font-size: 11px;
  line-height: 14px;
  font-weight: 600;
  font-variant: tabular-nums;
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export const BottomLine = styled.Text`
  font-family: ${({ theme }) => typeHelper(theme, 'caption1').fontFamily};
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.color.content.secondary};
`;

export const SupersetConnector = styled.View`
  height: 18px;
  align-items: center;
  justify-content: center;
  margin-vertical: -5px;
  z-index: 2;
`;

export const SupersetLine = styled.View`
  width: 1.5px;
  height: 100%;
  background-color: ${({ theme }) => sessionPalette(theme.isDark).row.supersetGlyph};
  opacity: 0.35;
`;
