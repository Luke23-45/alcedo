import styled from 'styled-components/native';

/** Centered neutral empty-state card. */
export const EmptyBody = styled.View`
  padding: 28px 24px;
  align-items: center;
  gap: 8px;
`;

export const EmptyActions = styled.View`
  margin-top: 10px;
  flex-direction: row;
`;

/** Brand-gradient CTA, 48pt, matching the screen's primary-action language. */
export const CtaButton = styled.Pressable`
  min-height: 48px;
  padding-horizontal: 28px;
  border-radius: 24px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  shadow-color: #ff2d55;
  shadow-offset: 0px 7px;
  shadow-opacity: ${({ theme }) => (theme.isDark ? 0.5 : 0.35)};
  shadow-radius: 12px;
  elevation: 8;
`;
