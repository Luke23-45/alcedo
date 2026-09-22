import styled from 'styled-components/native';
import { alpha } from '@/styles/theme';

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

/** Left group: title + SAMPLE marker, pinned so TODAY never gets pushed off. */
export const TitleGroup = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm}px;
  min-width: 0;
  margin-right: ${({ theme }) => theme.space.sm}px;
`;

/** TODAY pill: static, neutral — the card renders post-session, not live. */
export const TodayChip = styled.View`
  height: 21px;
  padding-horizontal: 10px;
  border-radius: 10.5px;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.07) : alpha('#787880', 0.12))};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

/** Five columns (44pt max each), 58pt tracks, labels below. Flex shares the row on narrow screens. */
export const BarsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
`;

export const ZoneColumn = styled.View`
  flex: 1;
  max-width: 44px;
  align-items: center;
`;

export const ZoneTrack = styled.View`
  width: 100%;
  height: 58px;
  border-radius: 10px;
  background-color: ${({ theme }) => (theme.isDark ? alpha('#FFFFFF', 0.05) : alpha('#787880', 0.13))};
  overflow: hidden;
  justify-content: flex-end;
`;

export const ZoneValue = styled.View`
  position: absolute;
  bottom: 65px;
  left: 0;
  right: 0;
  align-items: center;
`;
