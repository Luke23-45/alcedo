import { Fragment } from 'react';
import { useTranslate } from '@tolgee/react';
import { useAppSelector } from '@/store';
import SessionSummary from '@/components/presentation/summary/session-summary';
import SessionSummaryTitle from '@/components/presentation/summary/session-summary-title';
import { AiChatSharedProgramMessage } from '@/models/ai-models';
import { Session } from '@/models/session-models';
import { usePreferredWeightUnit } from '@/hooks/usePreferredWeightUnit';
import * as S from './shared-program-message.styles';

export function SharedProgramMessage({ message }: { message: AiChatSharedProgramMessage; isUser: boolean }) {
  const { t } = useTranslate();
  const preferredWeightUnit = usePreferredWeightUnit();
  const locale = useAppSelector((s) => s.settings.preferredLanguage) ?? undefined;
  const sessionCount = message.blueprint.sessions.length;
  return (
    <S.SharedProgramBody>
      <S.SharedProgramTitle>{message.programName}</S.SharedProgramTitle>
      <S.SharedProgramMeta>
        {sessionCount === 1
          ? t('exercise.history.session_count.one')
          : t('exercise.history.session_count.other', { count: sessionCount.toLocaleString(locale) })}
      </S.SharedProgramMeta>
      {message.blueprint.sessions.map((s, i) => (
        <Fragment key={i}>
          <SessionSummaryTitle session={Session.getEmptySession(s, preferredWeightUnit)} />
          <SessionSummary session={Session.getEmptySession(s, preferredWeightUnit)} />
        </Fragment>
      ))}
    </S.SharedProgramBody>
  );
}
