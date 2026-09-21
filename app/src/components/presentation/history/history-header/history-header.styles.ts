import styled from 'styled-components/native';

/** 44×44 hit targets for the in-content nav row; icon glyphs stay spec-sized. */
export const NavRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const NavTarget = styled.Pressable`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
`;

export const FilterCircle = styled.View<{ $dark: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.07)' : 'rgba(120,120,128,0.12)')};
  border-width: 0.8px;
  border-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.09)' : 'rgba(120,120,128,0.18)')};
`;

export const FilterDot = styled.View`
  position: absolute;
  top: 3px;
  right: 4px;
  width: 7px;
  height: 7px;
  border-radius: 3.5px;
  background-color: #ff9f0a;
  border-width: 1.6px;
  border-color: ${({ theme }) => (theme.isDark ? '#0b0b0e' : '#f8f8fc')};
`;

/** Text starts at x=24 while cards sit at x=16. */
export const TitleBlock = styled.View`
  padding-left: 8px;
  margin-top: 8px;
`;
