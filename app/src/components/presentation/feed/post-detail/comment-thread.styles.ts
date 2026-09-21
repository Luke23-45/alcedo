import styled from 'styled-components/native';

export const Thread = styled.View`
  margin-top: 12px;
`;

export const Header = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.weight.bold};
  letter-spacing: 1.35px;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
  text-transform: uppercase;
  margin-bottom: 16px;
`;

export const CommentBlock = styled.View`
  margin-bottom: 20px;
`;

export const Row = styled.View`
  flex-direction: row;
`;

export const Content = styled.View`
  flex: 1;
  margin-left: 12px;
`;

export const NameRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Name = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12.5px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.2px;
  color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#1C1C1E')};
`;

export const BadgeSlot = styled.View`
  margin-left: 6px;
`;

export const Time = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => (theme.isDark ? '#6C6C70' : '#8E8E93')};
  margin-left: auto;
`;

export const Body = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12.5px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => (theme.isDark ? '#E5E5EA' : '#1C1C1E')};
  margin-top: 3px;
  line-height: 17px;
`;

export const ActionsRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 2px;
  min-height: 44px;
`;

const ActionPress = styled.Pressable`
  flex-direction: row;
  align-items: center;
  min-height: 44px;
  min-width: 44px;
`;

export const KudosButton = styled(ActionPress)`
  margin-left: -10px;
  padding-left: 10px;
  padding-right: 2px;
`;

export const ReplyButton = styled(ActionPress)`
  padding-right: 10px;
`;

export const ActionCount = styled.Text<{ $kudoed: boolean }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  font-weight: ${({ theme, $kudoed }) => ($kudoed ? theme.weight.bold : theme.weight.semibold)};
  color: ${({ theme, $kudoed }) =>
    $kudoed ? (theme.isDark ? '#FF6A88' : '#D70015') : theme.isDark ? '#86868B' : '#8E8E93'};
  margin-left: 6px;
`;

export const Separator = styled.Text<{ $kudoed?: boolean }>`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  font-weight: ${({ theme, $kudoed }) => ($kudoed ? theme.weight.bold : theme.weight.semibold)};
  color: ${({ theme, $kudoed }) =>
    $kudoed ? (theme.isDark ? '#FF6A88' : '#D70015') : theme.isDark ? '#86868B' : '#8E8E93'};
  margin-left: 4px;
  margin-right: 4px;
`;

export const ReplyText = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

/* ── Nested reply ─────────────────────────────────────────────── */

export const ReplyBlock = styled.View`
  margin-top: 14px;
  padding-left: 32px;
`;

export const Elbow = styled.View`
  position: absolute;
  left: 14px;
  top: -24px;
`;

/* ── Neutral empty state (reference posts: no invented comments) ─ */

export const EmptyWrap = styled.View`
  align-items: center;
  padding-top: 20px;
  padding-bottom: 28px;
`;

export const EmptyTitle = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.weight.semibold};
  letter-spacing: -0.2px;
  color: ${({ theme }) => (theme.isDark ? '#C7C7CC' : '#3C3C43')};
  text-align: center;
`;

export const EmptyBody = styled.Text`
  font-family: ${({ theme }) => theme.font.text};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => (theme.isDark ? '#6C6C70' : '#8E8E93')};
  text-align: center;
  margin-top: 4px;
`;
