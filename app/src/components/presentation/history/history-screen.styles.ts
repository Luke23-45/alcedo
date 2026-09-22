import styled from 'styled-components/native';

export const ScreenRoot = styled.View`
  flex: 1;
`;

/** 16pt page margins (spec card x=16 on a 393pt canvas). */
export const Page = styled.View`
  padding-left: 16px;
  padding-right: 16px;
`;

export const CalendarSection = styled.View`
  margin-top: 20px;
`;

export const Section = styled.View`
  margin-top: 24px;
`;

/** Empty-day state: label → card, matching the day section rhythm. */
export const EmptyDayWrap = styled.View`
  gap: 12px;
`;
