import styled from 'styled-components/native';

/* Exercise picker screen: relative shell; the sheet-background section paints
   the theme background + ambient, ScreenContent stacks above it. */

export const PickerScreenWrap = styled.View`
  flex: 1;
  position: relative;
`;

export const ScreenContent = styled.View`
  flex: 1;
`;
