import { useTranslate } from '@tolgee/react';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { SampleBadge } from '@/components/presentation/home/shared/sample-badge';
import { useFormatDate } from '@/hooks/useFormatDate';
import { DetailSession, formatBare } from '../exercise-detail-model';
import * as S from './last-session.styles';

/**
 * The recorded-set model has NO RPE field, so per-set RPE here is sampled —
 * the spec's four values 7.0 / 7.0 / 8.0 / 8.0, used once each, never cycled:
 * extra real sets honestly render "—" (no data is invented), and with fewer
 * than four sets only the matching prefix applies, with the mean recomputed
 * from exactly the sampled values shown. The whole card carries the home
 * page's SampleBadge convention so it never reads as logged data. Everything
 * else (sets, weights, reps, per-set Epley e1RM) is real.
 */
const SAMPLED_RPES = [7.0, 7.0, 8.0, 8.0];

function sampledRpe(index: number): number | null {
  return index < SAMPLED_RPES.length ? SAMPLED_RPES[index]! : null;
}

export function LastSessionDetail({ session, unitLabel }: { session: DetailSession; unitLabel: string }) {
  const { t } = useTranslate();
  const formatDate = useFormatDate();
  const sets = session.sets;
  const totalReps = sets.reduce((sum, s) => sum + s.reps, 0);
  const setsLabel =
    sets.length === 1
      ? t('stats.exercise_detail.history.sets_line.one')
      : t('stats.exercise_detail.history.sets_line.other', { count: sets.length.toString() });
  const rpes = sets.map((_, i) => sampledRpe(i)).filter((r): r is number => r !== null);
  const meanRpe = rpes.length > 0 ? rpes.reduce((sum, r) => sum + r, 0) / rpes.length : null;

  return (
    <HomeCard radius={30} pad={0}>
      <S.CardInner>
        <S.TitleRow>
          <S.Title>
            {t('stats.exercise_detail.last_session.title', {
              // js-joda text patterns (MMM) throw without the locale plugin, which
              // we don't ship — month names go through the cached Intl formatters.
              date: formatDate(session.date, { month: 'short', day: 'numeric' }),
            })}
          </S.Title>
          <SampleBadge />
        </S.TitleRow>
        <S.Subtitle>
          {t('stats.exercise_detail.last_session.subtitle', {
            sets: setsLabel,
            volume: `${formatBare(session.volume)} ${unitLabel}`,
            reps: totalReps,
            rpe: meanRpe !== null ? meanRpe.toFixed(1) : '—',
          })}
        </S.Subtitle>
        <S.HeaderRow>
          <S.HCell $flex={1.3} numberOfLines={1}>
            {t('stats.exercise_detail.last_session.set')}
          </S.HCell>
          <S.HCell $flex={1.7} numberOfLines={1}>
            {t('stats.exercise_detail.last_session.weight')}
          </S.HCell>
          <S.HCell $flex={1.0} numberOfLines={1}>
            {t('stats.exercise_detail.last_session.reps')}
          </S.HCell>
          <S.HCell $flex={1.2} numberOfLines={1}>
            {t('stats.exercise_detail.last_session.e1rm')}
          </S.HCell>
          <S.HCell $flex={0.8} numberOfLines={1} $right>
            {t('stats.exercise_detail.last_session.rpe')}
          </S.HCell>
        </S.HeaderRow>
        <S.HeaderDivider />
        {sets.map((set, i) => (
          <S.SetRow key={i} $first={i === 0}>
            <S.SetNum $flex={1.3} numberOfLines={1}>
              {i + 1}
            </S.SetNum>
            <S.Cell $flex={1.7} numberOfLines={1}>
              {formatBare(set.weight)} {unitLabel}
            </S.Cell>
            <S.Cell $flex={1.0} numberOfLines={1}>
              {set.reps}
            </S.Cell>
            <S.E1rmCell $flex={1.2} numberOfLines={1}>
              {formatBare(set.e1rm)}
            </S.E1rmCell>
            <S.RpeCell $flex={0.8} numberOfLines={1}>
              {(() => {
                const rpe = sampledRpe(i);
                return rpe !== null ? rpe.toFixed(1) : '—';
              })()}
            </S.RpeCell>
          </S.SetRow>
        ))}
      </S.CardInner>
    </HomeCard>
  );
}
