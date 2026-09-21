import styled from 'styled-components/native';
import { alpha } from '@/styles/theme';

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

/** TODAY pill: static, neutral — the card renders post-session, not live. */
export const TodayChip = styled.View`
  height: 21px;
  padding-horizontal: 10px;
  border-radius: 10.5px;
  background-color: ${alpha('#FFFFFF', 0.07)};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

/** Five 44pt columns, 58pt tracks, labels below. */
export const BarsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 12px;
`;

export const ZoneColumn = styled.View`
  width: 44px;
  align-items: center;
`;

export const ZoneTrack = styled.View`
  width: 44px;
  height: 58px;
  border-radius: 10px;
  background-color: ${alpha('#FFFFFF', 0.05)};
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
