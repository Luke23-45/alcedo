import styled from 'styled-components/native';

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 8px;
`;

export const TitleBlock = styled.View`
  flex-direction: column;
`;

export const CalendarButton = styled.Pressable`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
`;

export const CalendarCircle = styled.View<{ $dark: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.07)' : 'rgba(120,120,128,0.12)')};
  border-width: 0.8px;
  border-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.09)' : 'rgba(120,120,128,0.18)')};
  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.45;
  shadow-radius: 3px;
  elevation: 2;
`;
