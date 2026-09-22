import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';

/** iMessage blue, lit from above. White text sits on it in both modes. */
export const USER_BUBBLE_COLORS = ['#2E9BFF', '#0A84FF'] as const;

export const Row = styled.View<{ $isUser: boolean }>`
  flex-direction: row;
  justify-content: ${({ $isUser }) => ($isUser ? 'flex-end' : 'flex-start')};
  width: 100%;
`;

interface BubbleCorners {
  $tl: number;
  $tr: number;
  $br: number;
  $bl: number;
}

const corners = ({ $tl, $tr, $br, $bl }: BubbleCorners) => `
  border-top-left-radius: ${$tl}px;
  border-top-right-radius: ${$tr}px;
  border-bottom-right-radius: ${$br}px;
  border-bottom-left-radius: ${$bl}px;
`;

/** The user's blue gradient bubble. Colors are passed at the usage site. */
export const UserBubble = styled(LinearGradient)<BubbleCorners>`
  ${corners}
  max-width: 78%;
  padding: 10px 14px;
`;

/** The coach's system-gray bubble. */
export const AgentBubble = styled.View<BubbleCorners>`
  ${corners}
  max-width: 78%;
  padding: 10px 14px;
  background-color: ${({ theme }) => theme.color.fill.secondary};
`;

/** Full-width material for plans and shared programs — never a bubble. */
export const CardRow = styled.View`
  width: 100%;
  padding: 4px 0px;
`;

/** Centered, de-emphasized container for purchase / update prompts. */
export const NoticeRow = styled.View`
  width: 100%;
  align-items: center;
  padding: 8px 0px;
`;

export const NoticeCard = styled.View`
  width: 88%;
`;
