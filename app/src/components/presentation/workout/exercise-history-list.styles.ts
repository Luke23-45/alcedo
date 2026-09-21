import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

/* Screen ------------------------------------------------------------------ */

export const ScreenRoot = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.color.background.base};
`;

/* Nav --------------------------------------------------------------------- */

export const NavBar = styled.View`
  flex-direction: row;
  align-items: center;
  height: 44px;
  padding-left: 6px;
  /* 5px right (not 6): the spec centers the overflow dots at x=366. */
  padding-right: 5px;
`;

export const NavButton = styled.Pressable`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
`;

export const NavSpacer = styled.View`
  width: 44px;
  height: 44px;
`;

export const NavTitleWrap = styled.View`
  flex: 1;
  align-items: center;
  padding-left: 4px;
  padding-right: 4px;
`;

export const NavTitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15px;
  line-height: 20px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.color.content.primary};
`;

/* PR banner --------------------------------------------------------------- */

export const PrCard = styled.View`
  height: 88px;
  border-radius: 26px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.45);
  overflow: hidden;
  shadow-color: #ffd84d;
  shadow-offset: 0px 5px;
  shadow-opacity: 0.35;
  shadow-radius: 10px;
  elevation: 6;
`;

export const PrGloss = styled.View`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  height: 44px;
  background-color: rgba(255, 255, 255, 0.28);
`;

export const PrContent = styled.View`
  flex-direction: row;
  align-items: center;
  height: 88px;
  padding-left: 20px;
  padding-right: 20px;
`;

export const PrMedal = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: rgba(0, 0, 0, 0.14);
  align-items: center;
  justify-content: center;
`;

export const PrTexts = styled.View`
  margin-left: 14px;
  flex: 1;
`;

export const PrHeading = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 9px;
  line-height: 11px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 1.3px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.exerciseHistory.gold.heading};
`;

export const PrValue = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 20px;
  line-height: 24px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: -0.55px;
  color: ${({ theme }) => theme.exerciseHistory.gold.value};
  margin-top: 2px;
`;

export const PrSub = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10.5px;
  line-height: 13px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  color: ${({ theme }) => theme.exerciseHistory.gold.heading};
  margin-top: 3px;
`;

/* Chart ------------------------------------------------------------------- */

export const ChartPad = styled.View`
  height: 184px;
  /* 19px, not 20: HomeCard's 1pt edge insets the content, so the plot top
     lands exactly 82pt below the card top (gridlines at 286/318/350). */
  padding-top: 19px;
  padding-left: 20px;
  padding-right: 20px;
`;

export const ChartHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

export const ChartTitleBlock = styled.View`
  flex: 1;
  padding-right: 8px;
`;

export const ChartTitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 15.5px;
  line-height: 20px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const ChartSub = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11px;
  line-height: 14px;
  font-weight: ${({ theme }) => theme.weight.medium};
  margin-top: 5px;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#6C6C70')};
`;

export const ChartChip = styled.View`
  height: 21px;
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 10.5px;
  /* Spec: chip top sits 16pt below the card top, just above the title. */
  margin-top: -4px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(120, 120, 128, 0.12)')};
`;

export const ChartChipText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 8.5px;
  line-height: 10px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: ${({ theme }) => (theme.isDark ? '#98989F' : '#8E8E93')};
`;

export const ChartPlotWrap = styled.View`
  /* Plot top = 1 (card edge) + 19 (pad) + 39 (header) + 3 + 20 (svg headroom)
     = 82pt below the card top, matching the reference gridlines. */
  margin-top: 3px;
`;

/* Section header ---------------------------------------------------------- */

export const SectionHead = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  /* Calibrated against the reference: the label baseline sits 30pt below the
     chart card and the first row starts 40pt below it (12pt stack gap + 4pt
     here + 24pt header). The 10pt once below the header moved above it. */
  margin-top: 4px;
  margin-bottom: 0px;
  padding-left: 8px;
  padding-right: 8px;
  min-height: 24px;
`;

export const SectionLabel = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  line-height: 12px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 1.35px;
  text-transform: uppercase;
  color: #86868b;
`;

export const SeeAllHit = styled.Pressable`
  padding-left: 12px;
  padding-right: 4px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-right: -4px;
  margin-top: -10px;
  margin-bottom: -10px;
`;

export const SeeAllText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11px;
  line-height: 14px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  color: ${({ theme }) => theme.home.seeAll};
`;

/* Session rows ------------------------------------------------------------ */

export const RowPress = styled.Pressable`
  border-radius: 22px;
`;

export const RowInner = styled.View`
  flex-direction: row;
  align-items: center;
  height: 76px;
  padding-left: 16px;
  /* Spec: chevron centered at x=359 → 14pt right inset. */
  padding-right: 14px;
`;

export const DateTile = styled.View<{ $pr: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $pr }) => ($pr ? 'rgba(255, 214, 10, 0.12)' : theme.exerciseHistory.tile)};
`;

export const TileMonth = styled.Text<{ $pr: boolean }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 8px;
  line-height: 10px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: ${({ $pr }) => ($pr ? '#A08000' : '#8E8E93')};
`;

export const TileDay = styled.Text<{ $pr: boolean }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 16px;
  line-height: 19px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: -0.5px;
  margin-top: 1px;
  color: ${({ theme, $pr }) => ($pr ? theme.exerciseHistory.tilePrDay : theme.color.content.primary)};
`;

export const RowMiddle = styled.View`
  flex: 1;
  margin-left: 12px;
  margin-right: 8px;
  justify-content: center;
`;

export const RowHeadline = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13.5px;
  line-height: 17px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const RowSubline = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 11px;
  line-height: 14px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: #86868b;
  margin-top: 3px;
`;

export const PrChip = styled.View`
  align-self: flex-start;
  margin-top: 10px;
  /* Spec: chip right edge at x=331 (24pt left of the chevron). */
  margin-right: 24px;
  height: 18px;
  min-width: 34px;
  padding-left: 7px;
  padding-right: 7px;
  border-radius: 9px;
  background-color: rgba(255, 214, 10, 0.18);
  border-width: 0.7px;
  border-color: rgba(255, 214, 10, 0.3);
  align-items: center;
  justify-content: center;
`;

export const PrChipText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 8.5px;
  line-height: 10px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 0.5px;
  color: #ffd84d;
`;

export const RowSeparator = styled.View`
  height: 10px;
`;

/* Screen chrome ----------------------------------------------------------- */

export const HeaderStack = styled.View`
  gap: 12px;
`;

export const AuraWrap = styled.View`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
`;

export const EmptyWrap = styled.View`
  padding-top: 48px;
  padding-left: 32px;
  padding-right: 32px;
`;
