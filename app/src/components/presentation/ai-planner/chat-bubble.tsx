import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { ChatMessage } from '@/store/ai-planner';
import { match } from 'ts-pattern';
import { GeneralMessage } from '@/components/presentation/ai-planner/general-message';
import { PlanMessage } from '@/components/presentation/ai-planner/plan-message';
import { SharedProgramMessage } from '@/components/presentation/ai-planner/shared-program-message';
import { ProPrompt } from '@/components/presentation/ai-planner/pro-prompt';
import { UpdatePrompt } from '@/components/presentation/ai-planner/update-prompt';
import { TypingDots } from '@/components/presentation/ai-planner/typing-dots';
import { useTranslate } from '@tolgee/react';
import * as S from './chat-bubble.styles';

const RADIUS = 18;
const GROUPED_RADIUS = 6;

export function ChatBubble(props: {
  message: ChatMessage;
  sameSenderBelow: boolean;
  sameSenderAbove: boolean;
  isLastMessage: boolean;
}) {
  const { t } = useTranslate();
  const { message, sameSenderBelow, sameSenderAbove } = props;
  const isUser = message.from === 'User';

  return match(message)
    .with({ type: 'messageResponse' }, (message) => (
      <MessageBubble
        isUser={isUser}
        sameSenderAbove={sameSenderAbove}
        sameSenderBelow={sameSenderBelow}
      >
        {message.isLoading && !message.message.trim() ? (
          <TypingDots label={t('ai.chat.typing.label')} />
        ) : (
          <GeneralMessage isUser={isUser} message={message} />
        )}
      </MessageBubble>
    ))
    .with({ type: 'chatPlan' }, (message) => (
      <S.CardRow>
        <HomeCard radius={20} pad={16}>
          <PlanMessage isUser={false} message={message} />
        </HomeCard>
      </S.CardRow>
    ))
    .with({ type: 'sharedProgram' }, (message) => (
      <S.CardRow>
        <HomeCard radius={20} pad={16}>
          <SharedProgramMessage isUser={false} message={message} />
        </HomeCard>
      </S.CardRow>
    ))
    .with({ type: 'purchasePro' }, () => (
      <S.NoticeRow>
        <S.NoticeCard>
          <HomeCard radius={20} pad={16}>
            <ProPrompt />
          </HomeCard>
        </S.NoticeCard>
      </S.NoticeRow>
    ))
    .with({ type: 'updateRequired' }, () => (
      <S.NoticeRow>
        <S.NoticeCard>
          <HomeCard radius={20} pad={16}>
            <UpdatePrompt />
          </HomeCard>
        </S.NoticeCard>
      </S.NoticeRow>
    ))
    .exhaustive();
}

function MessageBubble({
  isUser,
  sameSenderAbove,
  sameSenderBelow,
  children,
}: {
  isUser: boolean;
  sameSenderAbove: boolean;
  sameSenderBelow: boolean;
  children: React.ReactNode;
}) {
  const topDynamicRadius = sameSenderAbove ? GROUPED_RADIUS : RADIUS;
  const bottomDynamicRadius = sameSenderBelow ? GROUPED_RADIUS : RADIUS;
  // The tail side keeps its full radius; the grouped side tightens.
  const corners = isUser
    ? { $tl: RADIUS, $tr: topDynamicRadius, $br: bottomDynamicRadius, $bl: RADIUS }
    : { $tl: topDynamicRadius, $tr: RADIUS, $br: RADIUS, $bl: bottomDynamicRadius };
  return (
    <S.Row $isUser={isUser}>
      {isUser ? (
        <S.UserBubble
          {...corners}
          colors={[...S.USER_BUBBLE_COLORS]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ borderCurve: 'continuous' }}
        >
          {children}
        </S.UserBubble>
      ) : (
        <S.AgentBubble {...corners} style={{ borderCurve: 'continuous' }}>
          {children}
        </S.AgentBubble>
      )}
    </S.Row>
  );
}
