import { LinearGradient } from 'expo-linear-gradient';
import Svg, { G, Rect } from 'react-native-svg';
import { useTranslate } from '@tolgee/react';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { formatWeeklyRate } from '../exercise-detail-model';
import * as S from './identity-card.styles';

/** Reference ic-db glyph, drawn in a 28×18 box centered at the origin. */
function DumbbellGlyph() {
  return (
    <Svg width={34} height={22} viewBox="-14 -9 28 18">
      <G fill="#FFFFFF">
        <Rect x={-13} y={-5.6} width={4.4} height={11.2} rx={1.8} />
        <Rect x={-7.6} y={-8} width={3.8} height={16} rx={1.7} />
        <Rect x={-7.6} y={-1.9} width={15.2} height={3.8} rx={0.6} />
        <Rect x={3.8} y={-8} width={3.8} height={16} rx={1.7} />
        <Rect x={8.6} y={-5.6} width={4.4} height={11.2} rx={1.8} />
      </G>
    </Svg>
  );
}

export function IdentityCard({
  name,
  metaLine,
  typeChip,
  weeklyFrequency,
}: {
  name: string;
  /** "Barbell · Chest · Triceps · Front Delt" — equipment + top-3 descriptor muscles. */
  metaLine: string;
  /** "COMPOUND" / "ISOLATION" from the descriptor mechanic; null when unknown. */
  typeChip: string | null;
  /** Sessions per week, trailing 7 days. */
  weeklyFrequency: number;
}) {
  const { t } = useTranslate();
  return (
    <HomeCard radius={30} pad={0}>
      <S.CardInner>
        <S.IconTile>
          <LinearGradient
            colors={['#FF6A88', '#C1143C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.7, y: 1 }}
            style={S.iconFill}
          />
          <LinearGradient
            colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={S.iconGloss}
          />
          <DumbbellGlyph />
        </S.IconTile>
        <S.TextBlock>
          <S.Name numberOfLines={1} ellipsizeMode="tail">
            {name}
          </S.Name>
          <S.Meta numberOfLines={1} ellipsizeMode="tail">
            {metaLine}
          </S.Meta>
          <S.ChipRow>
            {typeChip ? (
              <S.Chip>
                <S.ChipText>{typeChip}</S.ChipText>
              </S.Chip>
            ) : null}
            <S.Chip>
              <S.ChipText>
                {t('stats.exercise_detail.identity.per_week', {
                  rate: formatWeeklyRate(weeklyFrequency),
                })}
              </S.ChipText>
            </S.Chip>
          </S.ChipRow>
        </S.TextBlock>
      </S.CardInner>
    </HomeCard>
  );
}
