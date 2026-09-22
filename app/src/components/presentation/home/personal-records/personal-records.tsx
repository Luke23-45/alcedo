import { useTranslate } from '@tolgee/react';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeCard } from '../shared/home-card';
import { HomeText } from '../shared/home-text';
import type { PersonalRecordItem } from '../use-home-data';
import * as S from './personal-records.styles';

/**
 * Reference PR card: 361×140, 15.5/600 title, THIS MONTH chip, three 99×76
 * tiles. Delta and NEW render only when the record carries them.
 */
export function PersonalRecordsSection({ records }: { records: PersonalRecordItem[] }) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;
  const titleColor = dark ? '#FFFFFF' : '#1C1C1E';
  const chipColor = dark ? '#98989F' : '#6E6E73';
  const nameColor = dark ? '#86868B' : '#6E6E73';
  const deltaColor = dark ? '#30D158' : '#248A3D';
  const newColor = dark ? '#FFB84D' : '#C93400';

  return (
    <HomeCard radius={30} pad={20} style={{ minHeight: 140 }}>
      <S.HeaderRow>
        <HomeText
          weight={fontWeight.semibold}
          tracking={-0.3}
          style={{ fontSize: 15.5, lineHeight: 19, color: titleColor }}
        >
          {t('home.personal_records.title') /* en: "Personal Records" */}
        </HomeText>
        <S.MonthChip>
          <HomeText
            weight={fontWeight.bold}
            micro
            tracking={0.8}
            numberOfLines={1}
            style={{ fontSize: 9, lineHeight: 11, color: chipColor }}
          >
            {t('home.personal_records.this_month').toLocaleUpperCase() /* en: "THIS MONTH" */}
          </HomeText>
        </S.MonthChip>
      </S.HeaderRow>
      {records.length === 0 ? (
        <S.EmptyBox>
          <HomeText variant="footnote" tone="secondary">
            {t('home.personal_records.empty') /* en: "No personal records yet." */}
          </HomeText>
        </S.EmptyBox>
      ) : (
        <S.TilesRow>
          {records.map((record) => (
            <S.Tile key={record.name} style={{ borderCurve: 'continuous' }}>
              {record.isNew ? <S.TileInner pointerEvents="none" /> : null}
              <HomeText
                weight={fontWeight.bold}
                micro
                tracking={0.8}
                numberOfLines={1}
                style={{ fontSize: 9, lineHeight: 12, color: nameColor }}
              >
                {record.name.toLocaleUpperCase()}
              </HomeText>
              <HomeText
                weight={fontWeight.bold}
                tabular
                tracking={-0.4}
                numberOfLines={1}
                style={{ fontSize: 15, lineHeight: 19, color: titleColor, marginTop: 8 }}
              >
                {record.value}
              </HomeText>
              {record.isNew ? (
                <S.NewChip>
                  <HomeText
                    weight={fontWeight.bold}
                    micro
                    tracking={0.6}
                    style={{ fontSize: 9, lineHeight: 11, color: newColor }}
                  >
                    {t('home.personal_records.new').toLocaleUpperCase() /* en: "NEW" */}
                  </HomeText>
                </S.NewChip>
              ) : record.delta ? (
                <HomeText
                  weight={fontWeight.bold}
                  style={{ fontSize: 9.5, lineHeight: 12, color: deltaColor, marginTop: 4 }}
                >
                  {record.delta}
                </HomeText>
              ) : null}
            </S.Tile>
          ))}
        </S.TilesRow>
      )}
    </HomeCard>
  );
}
