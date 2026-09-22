import { useState } from 'react';
import { useRouter, type Href } from 'expo-router';
import { useTranslate } from '@tolgee/react';
import EmptyInfo from '@/components/presentation/foundation/empty-info';
// Re-exported so existing importers keep working; the implementation lives
// in the RN-free logic module next to this file.
export { getExerciseHistoryHref } from './exercise-history-logic';
import { SurfaceText } from '@/components/presentation/foundation/surface-text';
import type { MenuItem } from '@/components/presentation/foundation/menu';
import {
  ExerciseHistoryBackground,
  ExerciseHistoryBottomFade,
  ExerciseHistoryChart,
  ExerciseHistoryList,
  ExerciseHistoryNavBar,
  ExerciseHistoryPrBanner,
  ExerciseHistorySectionHeader,
  type ExerciseHistoryPr,
} from '@/components/presentation/workout/exercise-history-list';
import * as S from '@/components/presentation/workout/exercise-history-list.styles';
import {
  buildChartPoints,
  buildRow,
  buildSubtitle,
  findPr,
  formatWeight,
  INITIAL_VISIBLE_ROWS,
  type RowContext,
} from './exercise-history-logic';
import { useFormatDate } from '@/hooks/useFormatDate';
import { useToday } from '@/hooks/useToday';
import { MovementKey } from '@/models/blueprint-models';
import { useAppSelectorWithArg } from '@/store';
import { selectExerciseHistoryEntries } from '@/store/stored-sessions';

export function ExerciseHistory(props: { movementKey: MovementKey; exerciseName: string }) {
  const { t } = useTranslate();
  const router = useRouter();
  const today = useToday();
  const formatDate = useFormatDate();
  // No session to exclude: this sheet is opened from an exercise, and shows the whole lineage.
  const entries = useAppSelectorWithArg(selectExerciseHistoryEntries, undefined)(props.movementKey);
  const [expanded, setExpanded] = useState(false);

  const pr = findPr(entries);
  const ctx: RowContext = {
    t,
    formatDate,
    today,
    prSessionId: pr?.sessionId,
    bodyweightLabel: t('exercise.short_bodyweight.label'),
  };
  const rows = entries.map((entry, index) => buildRow(entry, index, ctx));
  const visibleRows = expanded ? rows : rows.slice(0, INITIAL_VISIBLE_ROWS);

  const chart = buildChartPoints(entries, ctx);
  const prBanner: ExerciseHistoryPr | undefined = pr
    ? {
        heading: t('exercise.history.personal_record.label'),
        valueLine: `${formatWeight(pr.weight)} × ${pr.reps}`,
        subLine: t('exercise.history.e1rm_on.label', {
          e1rm: formatWeight(pr.e1rm, 1),
          date: formatDate(pr.date, { month: 'long', day: 'numeric' }),
        }),
      }
    : undefined;

  const toggleExpanded = () => setExpanded((v) => !v);
  const canExpand = rows.length > INITIAL_VISIBLE_ROWS;
  const actionLabel = expanded ? t('exercise.history.show_less.button') : t('exercise.history.see_all.button');
  const menuItems: MenuItem[] = canExpand ? [{ label: actionLabel, onPress: toggleExpanded }] : [];

  const chartSubtitle =
    chart.first && chart.last
      ? chart.points.length > 1
        ? buildSubtitle(chart.first, chart.last)
        : formatWeight(chart.first)
      : '';

  // Top inset applied (not 'off'): the custom nav bar must clear the real
  // status bar. The background stays edge-to-edge via ScreenRoot itself.
  return (
    <S.ScreenRoot edges={{ left: 'additive', right: 'additive', top: 'additive', bottom: 'off' }}>
      <ExerciseHistoryBackground />
      <ExerciseHistoryNavBar title={props.exerciseName} onBack={() => router.back()} menuItems={menuItems} />
      <ExerciseHistoryList
        rows={visibleRows}
        onRowPress={(sessionId) => router.push(`/history/edit?sessionId=${encodeURIComponent(sessionId)}` as Href)}
        banner={<ExerciseHistoryPrBanner pr={prBanner} />}
        chart={
          <ExerciseHistoryChart
            points={chart.points}
            prSessionId={pr?.sessionId}
            title={t('exercise.history.top_set_weight.title')}
            subtitle={chartSubtitle}
            sessionsLabel={
              chart.points.length === 1
                ? t('exercise.history.session_count.one')
                : t('exercise.history.session_count.other', { count: chart.points.length.toString() })
            }
            todayLabel={t('exercise.history.today.label')}
          />
        }
        sectionHeader={
          rows.length > 0 ? (
            <ExerciseHistorySectionHeader
              label={t('exercise.history.past_sessions.label')}
              actionLabel={actionLabel}
              onAction={canExpand ? toggleExpanded : undefined}
            />
          ) : undefined
        }
        empty={
          <EmptyInfo>
            <SurfaceText>{t('exercise.never_done_before.message')}</SurfaceText>
          </EmptyInfo>
        }
      />
      <ExerciseHistoryBottomFade />
    </S.ScreenRoot>
  );
}
