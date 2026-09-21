import styled from 'styled-components/native';

/* Empty state: neutral, centered. */

export const EmptyWrap = styled.View`
  padding-top: 64px;
  padding-bottom: 64px;
  align-items: center;
  padding-left: 48px;
  padding-right: 48px;
`;

export const EmptyGlyphWrap = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) =>
    theme.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(120,120,128,0.12)'};
  margin-bottom: 12px;
`;
