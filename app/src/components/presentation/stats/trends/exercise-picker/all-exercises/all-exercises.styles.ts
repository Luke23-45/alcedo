import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';

/* ALL EXERCISES: virtualized A-Z list, alphabet scrubber, 40pt bottom fade. */

export const ListWrap = styled.View`
  flex: 1;
  position: relative;
`;

export const SectionHeaderRow = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 14px;
  padding-bottom: 6px;
`;

/* A-Z scrubber: fixed overlay, letters centered at x=368 (spec). Letters
   8.5/600/−.1 on 16.8pt rows starting 100pt below the list top (spec: A
   baseline y=300, chips end y=190 → 110pt; minus ~10pt baseline-to-row-top).
   Letters carry a 44×44 hit area via hitSlop on the pressable. */
export const ScrubberColumn = styled.View`
  position: absolute;
  right: 12.5px;
  top: 100px;
  width: 25px;
`;

export const ScrubberLetterCell = styled.View`
  height: 16.8px;
  align-items: center;
  justify-content: center;
`;

export const BottomFadeGradient = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 40px;
`;
