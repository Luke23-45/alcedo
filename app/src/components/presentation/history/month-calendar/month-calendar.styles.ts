import styled from 'styled-components/native';

/** Header row: 44pt chevron targets flanking the centered month label. */
export const CalendarHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 6px;
`;

/** 20pt side inset: 7 columns of 45.86pt, matching the reference grid. */
export const GridWrap = styled.View`
  padding-horizontal: 20px;
`;

/** Card body breathing room: chevrons sit ~27pt below the card top. */
export const CalendarBody = styled.View`
  padding-top: 18px;
  padding-bottom: 12px;
`;

export const ChevronTarget = styled.Pressable`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
`;

export const MonthLabelWrap = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-vertical: 4px;
  gap: 10px;
`;

export const TodayPill = styled.Pressable`
  min-height: 44px;
  justify-content: center;
  padding-horizontal: 12px;
  padding-vertical: 7px;
  border-radius: 14px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(120,120,128,0.12)')};
  border-width: 0.8px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.09)' : 'rgba(120,120,128,0.18)')};
`;

export const WeekdayRow = styled.View`
  flex-direction: row;
  margin-top: 6px;
  height: 22px;
`;

export const WeekdayCell = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const WeekRow = styled.View`
  flex-direction: row;
  height: 46px;
`;

/** ≥44×44 hit target; the 38pt ring art floats centered inside. */
export const DayCell = styled.Pressable`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const RingArt = styled.View`
  position: absolute;
  align-items: center;
  justify-content: center;
`;

/** Brand-gradient selection disc, r=19, with the spec's colored shadow. */
export const SelectedDisc = styled.View`
  width: 38px;
  height: 38px;
  border-radius: 19px;
  overflow: hidden;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.28);
  shadow-color: #ff2d55;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.55;
  shadow-radius: 9px;
  elevation: 6;
`;

/** LESS … MORE, below the card per the reference. */
export const LegendRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 14px;
  padding-horizontal: 20px;
`;

export const LegendCircles = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-right: 14px;
`;
