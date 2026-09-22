import { T, useTranslate } from '@tolgee/react';
import { useRouter } from 'expo-router';
import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { uuid } from '@/utils/uuid';
import SessionSummary from '@/components/presentation/summary/session-summary';
import SessionSummaryTitle from '@/components/presentation/summary/session-summary-title';
import { AiChatPlanResponseV2 } from '@/models/ai-models';
import { ChatMessage } from '@/store/ai-planner';
import { savePlan } from '@/store/program';
import { Session } from '@/models/session-models';
import { usePreferredWeightUnit } from '@/hooks/usePreferredWeightUnit';
import * as S from './plan-message.styles';

export function PlanMessage({ message, isUser }: { message: AiChatPlanResponseV2 & ChatMessage; isUser: boolean }) {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const { push } = useRouter();
  const preferredWeightUnit = usePreferredWeightUnit();
  const blueprint = message.plan.blueprint;
  const saveAiPlan = () => {
    const programId = uuid();
    dispatch(
      savePlan({
        programId,
        programBlueprint: blueprint,
      }),
    );
    push(`/settings/program-list?focusprogramId=${programId}`);
  };
  return (
    <S.PlanCardBody>
      {!isUser && <S.PlanEyebrow>{t('ai.chat.plan.eyebrow')}</S.PlanEyebrow>}
      <S.PlanTitle>{message.plan.name}</S.PlanTitle>
      <S.PlanDescription>{message.plan.description}</S.PlanDescription>
      {blueprint.sessions.map((s, i) => (
        <Fragment key={i}>
          <SessionSummaryTitle session={Session.getEmptySession(s, preferredWeightUnit)} />
          <SessionSummary session={Session.getEmptySession(s, preferredWeightUnit)} />
        </Fragment>
      ))}
      {!message.isLoading && (
        <S.UsePlanTouch
          onPress={saveAiPlan}
          accessibilityRole="button"
          accessibilityLabel={t('ai.chat.plan.use_this_plan')}
        >
          <S.UsePlanGradient
            colors={[...S.COACH_PURPLE]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <S.UsePlanLabel>
              <T keyName="ai.chat.plan.use_this_plan" />
            </S.UsePlanLabel>
          </S.UsePlanGradient>
        </S.UsePlanTouch>
      )}
    </S.PlanCardBody>
  );
}
