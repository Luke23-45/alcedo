import { Fragment } from 'react';
import { router } from 'expo-router';
import { useTranslate } from '@tolgee/react';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeText } from '@/components/presentation/home/shared/home-text';
import { SampleBadge } from '@/components/presentation/home/shared/sample-badge';
import { TrendsSectionHeader } from '../shared/trends-section-header';
import { PersonalBestRow } from '../trends-overview-data';
import { trendsPalette } from '../trends-colors';
import {
  CardInner,
  ColumnRow,
  DataRow,
  HeaderDivider,
  LiftCell,
  RightCell,
  RowDivider,
} from './personal-bests.styles';

/**
 * Personal Bests: the all-time best record per lift (bench/squat/deadlift
 * first), with best-set detail recovered from each record's own session.
 * "See All" opens the exercise picker list.
 */
export function PersonalBests({
  rows,
  sampled,
}: {
  rows: PersonalBestRow[];
  sampled: boolean;
}) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const palette = trendsPalette(theme.isDark);

  const headerCell = (text: string) => (
    <HomeText
      weight={fontWeight.bold}
      micro
      tracking={0.8}
      numberOfLines={1}
      style={{ fontSize: 8, lineHeight: 10, color: palette.tertiary }}
    >
      {text}
    </HomeText>
  );

  return (
    <>
      <TrendsSectionHeader
        label={t('trends.personal_bests.title')}
        actionLabel={t('trends.personal_bests.see_all')}
        onAction={() => router.push('/stats/exercise-list')}
        badge={sampled ? <SampleBadge compact /> : undefined}
      />
      <HomeCard hero pad={0}>
        {rows.length === 0 ? (
          <HomeText
            weight={fontWeight.medium}
            style={{
              fontSize: 12,
              lineHeight: 17,
              color: palette.secondary,
              textAlign: 'center',
              paddingVertical: 40,
              paddingHorizontal: 20,
            }}
          >
            {t('trends.personal_bests.empty')}
          </HomeText>
        ) : (
          <CardInner>
            <ColumnRow>
              <LiftCell>
                {headerCell(t('trends.personal_bests.col.lift'))}
              </LiftCell>
              <RightCell $width={70}>
                {headerCell(t('trends.personal_bests.col.set'))}
              </RightCell>
              <RightCell $width={62}>
                {headerCell(t('trends.personal_bests.col.e1rm'))}
              </RightCell>
              <RightCell $width={68}>
                {headerCell(t('trends.personal_bests.col.date'))}
              </RightCell>
            </ColumnRow>
            <HeaderDivider $dark={theme.isDark} />
            {rows.map((row, index) => (
              <Fragment key={row.name}>
                <DataRow $first={index === 0}>
                  <ColumnRow>
                    <LiftCell>
                      <HomeText
                        weight={fontWeight.semibold}
                        tracking={-0.2}
                        numberOfLines={1}
                        style={{
                          fontSize: 12.5,
                          lineHeight: 16,
                          color: palette.name,
                        }}
                      >
                        {row.name}
                      </HomeText>
                    </LiftCell>
                    <RightCell $width={70}>
                      <HomeText
                        weight={fontWeight.medium}
                        numberOfLines={1}
                        style={{
                          fontSize: 12,
                          lineHeight: 16,
                          color: palette.dim,
                        }}
                      >
                        {row.bestSet}
                      </HomeText>
                    </RightCell>
                    <RightCell $width={62}>
                      <HomeText
                        weight={fontWeight.bold}
                        tracking={-0.25}
                        tabular
                        numberOfLines={1}
                        style={{
                          fontSize: 12.5,
                          lineHeight: 16,
                          color: palette.primary,
                        }}
                      >
                        {row.e1rm}
                      </HomeText>
                    </RightCell>
                    <RightCell $width={68}>
                      <HomeText
                        weight={fontWeight.medium}
                        numberOfLines={1}
                        style={{
                          fontSize: 10.5,
                          lineHeight: 14,
                          color: palette.tertiary,
                        }}
                      >
                        {row.dateLabel}
                      </HomeText>
                    </RightCell>
                  </ColumnRow>
                </DataRow>
                {index < rows.length - 1 ? (
                  <RowDivider $dark={theme.isDark} />
                ) : null}
              </Fragment>
            ))}
          </CardInner>
        )}
      </HomeCard>
    </>
  );
}
