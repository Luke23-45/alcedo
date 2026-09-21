import styled from 'styled-components/native';

/* Sheet chrome: grabber + Cancel + centered title. */

export const HeaderWrap = styled.View`
  padding-top: 8px;
`;

export const Grabber = styled.View`
  width: 36px;
  height: 5px;
  border-radius: 2.5px;
  align-self: center;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.22)' : 'rgba(60,60,67,0.35)')};
`;

export const TitleRow = styled.View`
  margin-top: 18px;
  height: 28px;
  justify-content: center;
`;

export const CancelPress = styled.Pressable`
  position: absolute;
  left: 12px;
  top: 0;
  bottom: 0;
  justify-content: center;
  padding-horizontal: 12px;
`;
