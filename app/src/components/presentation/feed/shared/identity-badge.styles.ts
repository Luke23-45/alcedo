import styled from 'styled-components/native';

export type IdentityBadgeVariant = 'you' | 'author' | 'milestone';

export const Badge = styled.View<{ $variant: IdentityBadgeVariant }>`
  height: 15px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 7.5px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $variant }) =>
    $variant === 'milestone'
      ? 'rgba(255, 214, 10, 0.16)'
      : theme.isDark
        ? 'rgba(255, 255, 255, 0.09)'
        : 'rgba(120, 120, 128, 0.12)'};
`;

export const BadgeText = styled.Text<{ $variant: IdentityBadgeVariant }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 7.5px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${({ theme, $variant }) => ($variant === 'milestone' ? '#FFD84D' : theme.isDark ? '#98989F' : '#8E8E93')};
`;
