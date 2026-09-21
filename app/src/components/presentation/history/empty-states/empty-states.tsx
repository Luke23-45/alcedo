import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';
import { HomeText } from '@/components/presentation/home/shared/home-text';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useFormatDate } from '@/hooks/useFormatDate';
import { fontWeight } from '@/styles/theme';
import type { LocalDate } from '@js-joda/core';
import { useHistoryTranslate } from '../history-i18n';
import { CtaButton, EmptyActions, EmptyBody } from './empty-states.styles';

function Cta({ label, onPress, testID }: { label: string; onPress: () => void; testID: string }) {
  return (
    <CtaButton onPress={onPress} accessibilityRole="button" testID={testID}>
      <HomeGradient variant="brand" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      <HomeText
        weight={fontWeight.semibold}
        tracking={-0.25}
        style={{ fontSize: 15, lineHeight: 20, color: '#FFFFFF' }}
      >
        {label}
      </HomeText>
    </CtaButton>
  );
}

/** A selected day with no sessions: keep the real add-workout path, nothing else. */
export function EmptySelectedDay({ date, onAdd }: { date: LocalDate; onAdd: () => void }) {
  const theme = useAppTheme();
  const t = useHistoryTranslate();
  const formatDate = useFormatDate();

  return (
    <HomeCard radius={24}>
      <EmptyBody>
        <HomeText
          weight={fontWeight.semibold}
          tracking={-0.2}
          style={{
            fontSize: 15,
            lineHeight: 20,
            color: theme.color.content.primary,
            textAlign: 'center',
          }}
        >
          {t('history.v2.day.empty.title')}
        </HomeText>
        <HomeText
          weight={fontWeight.medium}
          style={{
            fontSize: 12.5,
            lineHeight: 17,
            color: theme.color.content.secondary,
            textAlign: 'center',
          }}
        >
          {t('history.v2.day.empty.body', {
            date: formatDate(date, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            }),
          })}
        </HomeText>
        <EmptyActions>
          <Cta label={t('history.v2.day.empty.cta')} onPress={onAdd} testID="history-add-workout" />
        </EmptyActions>
      </EmptyBody>
    </HomeCard>
  );
}

/** A month with no sessions at all: neutral, forward-looking, one way back in. */
export function EmptyMonth({ onStartWorkout }: { onStartWorkout: () => void }) {
  const theme = useAppTheme();
  const t = useHistoryTranslate();

  return (
    <HomeCard radius={30}>
      <EmptyBody>
        <HomeText
          weight={fontWeight.semibold}
          tracking={-0.2}
          style={{
            fontSize: 15,
            lineHeight: 20,
            color: theme.color.content.primary,
            textAlign: 'center',
          }}
        >
          {t('history.v2.month.empty.title')}
        </HomeText>
        <HomeText
          weight={fontWeight.medium}
          style={{
            fontSize: 12.5,
            lineHeight: 17,
            color: theme.color.content.secondary,
            textAlign: 'center',
          }}
        >
          {t('history.v2.month.empty.body')}
        </HomeText>
        <EmptyActions>
          <Cta label={t('history.v2.month.empty.cta')} onPress={onStartWorkout} testID="history-start-workout" />
        </EmptyActions>
      </EmptyBody>
    </HomeCard>
  );
}

/** Filters matched nothing: say what happened and offer the way out. */
export function NoFilterResults({ onClear }: { onClear: () => void }) {
  const theme = useAppTheme();
  const t = useHistoryTranslate();

  return (
    <HomeCard radius={24}>
      <EmptyBody>
        <HomeText
          weight={fontWeight.semibold}
          tracking={-0.2}
          style={{
            fontSize: 15,
            lineHeight: 20,
            color: theme.color.content.primary,
            textAlign: 'center',
          }}
        >
          {t('history.v2.filter.empty.title')}
        </HomeText>
        <HomeText
          weight={fontWeight.medium}
          style={{
            fontSize: 12.5,
            lineHeight: 17,
            color: theme.color.content.secondary,
            textAlign: 'center',
          }}
        >
          {t('history.v2.filter.empty.body')}
        </HomeText>
        <EmptyActions>
          <Cta label={t('history.v2.filter.clear')} onPress={onClear} testID="history-filter-clear-empty" />
        </EmptyActions>
      </EmptyBody>
    </HomeCard>
  );
}
