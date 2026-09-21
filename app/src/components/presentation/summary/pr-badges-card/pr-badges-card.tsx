import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeGradient } from '../../home/shared/home-gradient';
import { useTranslate } from '@tolgee/react';
import styled from 'styled-components/native';
import Svg, { Path } from 'react-native-svg';
import * as S from './pr-badges-card.styles';

export interface PrCardRecord {
  key: string;
  title: string;
  detail: string;
}

/** Gold medal disc: r=20, #FFF0BE→#D9A441, with the mock's gold glow. */
const Medal = styled(HomeGradient).attrs({
  colors: ['#FFF0BE', '#D9A441'] as [string, string],
  start: { x: 0.2, y: 0 },
  end: { x: 0.8, y: 1 },
})`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  shadow-color: #ffd84d;
  shadow-offset: 0px 5px;
  shadow-opacity: 0.45;
  shadow-radius: 9px;
  elevation: 6;
`;
function StarGlyph() {
  return (
    <Svg width={15} height={15} viewBox="-9 -9 18 18">
      <Path
        d="M0 -9 L2.23 -3.07 L8.56 -2.78 L3.61 1.17 L5.29 7.28 L0 3.8 L-5.29 7.28 L-3.61 1.17 L-8.56 -2.78 L-2.23 -3.07 Z"
        fill="#5C4300"
      />
    </Svg>
  );
}

/**
 * Reference card: 361×154, rx30. "Personal Records" 15.5/600 + gold
 * "{n} NEW" chip; each row a gold-gradient medal (r=20, #FFF0BE→#D9A441)
 * with a dark star, name 13/600, detail 10.5. PR text on gold is unchanged
 * in light mode (gold stays gold).
 */
export function PrBadgesCard({ records }: { records: PrCardRecord[] }) {
  const { t } = useTranslate();

  if (records.length === 0) {
    return null;
  }

  return (
    <HomeCard radius={30} pad={20}>
      <S.HeaderRow>
        <S.Title>{t('workout.post_workout.personal_records.title')}</S.Title>
        <S.NewChip>
          <S.NewChipText>
            {t('workout.post_workout.new_badge.label', { count: records.length.toString() })}
          </S.NewChipText>
        </S.NewChip>
      </S.HeaderRow>
      <S.Rows>
        {records.map((record) => (
          <S.Row key={record.key}>
            <Medal>
              <StarGlyph />
            </Medal>
            <S.RowText>
              <S.RowTitle numberOfLines={1}>{record.title}</S.RowTitle>
              <S.RowDetail numberOfLines={1}>{record.detail}</S.RowDetail>
            </S.RowText>
          </S.Row>
        ))}
      </S.Rows>
    </HomeCard>
  );
}
