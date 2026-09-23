import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { Session } from '@/models/session-models';
import { useAppSelectorWhenFocused } from '@/store';
import { selectHistoryPersonalRecords } from '@/store/stored-sessions';
import { useTranslate } from '@tolgee/react';
import Svg, { Path } from 'react-native-svg';
import { formatWeightShort } from '../../summary/post-workout-format';
import { matchSessionPrs } from '../pr-match';
import * as S from './session-detail-pr-card.styles';

/**
 * The archival PR card. Records come from selectHistoryPersonalRecords — the
 * same records the history list badges and the per-set gold outlines are
 * matched against — so this card can never claim a record the store didn't
 * attribute to this session. When the session holds no records the card stays
 * up with an explicit neutral state: in an archive, "none" is information.
 */
export function SessionDetailPrCard({ session }: { session: Session }) {
  const { t } = useTranslate();
  const records = useAppSelectorWhenFocused(selectHistoryPersonalRecords).get(session.id);

  // Every record the store attributes to this session is rendered — none are
  // omitted. A record whose exercise can't be matched to a set still shows
  // its honest stored e1RM rather than invented set detail.
  const exerciseMatches = matchSessionPrs(session, records);
  const recordsWithMatches = (records ?? []).map((record) => {
    const exerciseIndex = session.recordedExercises.findIndex(
      (exercise) => exercise.blueprint.name === record.exerciseName,
    );
    return {
      record,
      match: exerciseIndex >= 0 ? exerciseMatches[exerciseIndex] : undefined,
    };
  });

  return (
    <HomeCard elev="card" radius={30} pad={16}>
      <S.CardInner>
        <S.Header>
          <S.Title>{t('workout.post_workout.personal_records.title')}</S.Title>
          {recordsWithMatches.length > 0 ? (
            <S.NewChip>
              <S.NewChipText>
                {t('workout.post_workout.new_badge.label', {
                  count: recordsWithMatches.length.toString(),
                }).toLocaleUpperCase()}
              </S.NewChipText>
            </S.NewChip>
          ) : null}
        </S.Header>
        {recordsWithMatches.length > 0 ? (
          <S.Rows>
            {recordsWithMatches.map(({ record, match }) => {
              const detail = match?.prSet
                ? t('history.session_detail.records.pr_detail', '{weight} × {reps}', {
                    weight: formatWeightShort(match.prSet.weight),
                    reps: match.prSet.reps.toString(),
                  })
                : t('history.session_detail.records.e1rm_detail', 'e1RM {weight}', {
                    weight: formatWeightShort(record.oneRepMax),
                  });
              return (
                <S.Row key={record.exerciseName}>
                  <S.Medal>
                    <Svg width={15} height={15} viewBox="-9 -7 18 14">
                      <Path
                        d="M2 -6.5 L3.55 -1.98 H8.27 L4.36 0.87 L5.91 5.39 L2 2.54 L-1.91 5.39 L-0.36 0.87 L-4.27 -1.98 H0.45 Z"
                        fill="#5C4300"
                        scale={0.82}
                      />
                    </Svg>
                  </S.Medal>
                  <S.RowText>
                    <S.RowTitle numberOfLines={1}>{`${record.exerciseName} PR`}</S.RowTitle>
                    <S.RowDetail numberOfLines={1}>{detail}</S.RowDetail>
                  </S.RowText>
                </S.Row>
              );
            })}
          </S.Rows>
        ) : (
          <S.Empty>{t('history.session_detail.records.empty', 'No records this session.')}</S.Empty>
        )}
      </S.CardInner>
    </HomeCard>
  );
}
