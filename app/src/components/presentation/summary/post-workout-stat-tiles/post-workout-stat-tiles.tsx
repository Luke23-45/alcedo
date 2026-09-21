import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { SampleBadge } from '@/components/presentation/home/shared/sample-badge';
import { Session } from '@/models/session-models';
import { alpha } from '@/styles/theme';
import { localeFormatBigNumber } from '@/utils/locale-bignumber';
import { useTranslate } from '@tolgee/react';
import Svg, { Path, Rect } from 'react-native-svg';
import { completedSetCount } from '../post-workout-format';
import * as S from './post-workout-stat-tiles.styles';

/**
 * Reference tile geometry: 82×96, rx24, 11pt gaps. 20×20 icon tile (rx6.5,
 * tinted), value 17/700/−0.55, label 8/700/+0.8. Volume and sets are computed
 * from the session; kcal and avg bpm have no store source, so they render the
 * reference's sample figures with a SampleBadge (home convention).
 */
/** Reference: the bolt glyph at 0.5 scale (6×7), centered in the 20×20 tile. */
function VolumeGlyph() {
  return (
    <Svg width={6} height={7} viewBox="-6 -7 12 14">
      <Path
        d="M2 -7 L-6 1 H-1 L-2 7 L6 -1 H1 Z"
        fill="none"
        stroke="#FF6A88"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SetsGlyph() {
  return (
    <Svg width={12} height={14} viewBox="-6 -7 12 14">
      <Rect x={-5} y={-6} width={10} height={12} rx={2.4} fill="none" stroke="#C3F53C" strokeWidth={1.8} />
      <Path d="M-2.4 -1.6 H2.4" stroke="#C3F53C" strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function FlameGlyph() {
  return (
    <Svg width={8} height={10} viewBox="-6 -9 12 17">
      <Path
        d="M0 -8.2 C2.9 -4.6 5.9 -1.7 5.9 1.9 C5.9 5.4 3.3 7.9 0 7.9 C-3.3 7.9 -5.9 5.4 -5.9 1.9 C-5.9 -.2 -4.6 -1.9 -3.3 -3.4 C-3.2 -1.7 -2.4 -.9 -1.3 -.7 C-1.7 -3.5 -1.1 -5.9 0 -8.2 Z"
        fill="#FFB84D"
      />
    </Svg>
  );
}

function PulseGlyph() {
  return (
    <Svg width={15} height={9} viewBox="-7.5 -4.5 15 9">
      <Path
        d="M-6 0 h2.4 l1.6 -4 l2.4 8 l1.8 -4 h2.4"
        fill="none"
        stroke="#5EDCF0"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface TileDatum {
  key: 'volume' | 'sets' | 'kcal' | 'bpm';
  label: string;
  value: string;
  sample?: boolean;
  tint: string;
  glyph: () => React.ReactNode;
}

export function PostWorkoutStatTiles({ session }: { session: Session }) {
  const { t } = useTranslate();

  // Volume renders in the session's own unit — the mock's "VOLUME KG" is the
  // kg case, not a hardcoded unit.
  const volume = session.totalWeightLifted;
  const volumeUnit = volume.unit === 'pounds' ? 'lb' : 'kg';

  const tiles: TileDatum[] = [
    {
      key: 'volume',
      label: `${t('workout.post_workout.volume.label')} ${volumeUnit}`,
      value: localeFormatBigNumber(volume.value, 0),
      tint: alpha('#FF2D55', 0.16),
      glyph: VolumeGlyph,
    },
    {
      key: 'sets',
      label: t('workout.post_workout.sets.label'),
      value: completedSetCount(session).toString(),
      tint: alpha('#A6FF00', 0.14),
      glyph: SetsGlyph,
    },
    {
      key: 'kcal',
      label: t('workout.post_workout.kcal.label'),
      value: '380',
      sample: true,
      tint: alpha('#FF9F0A', 0.15),
      glyph: FlameGlyph,
    },
    {
      key: 'bpm',
      label: t('workout.post_workout.avg_bpm.label'),
      value: '128',
      sample: true,
      tint: alpha('#00D9E9', 0.15),
      glyph: PulseGlyph,
    },
  ];

  return (
    <S.TilesRow>
      {tiles.map((tile) => (
        <HomeCard key={tile.key} elev="tile" radius={24} pad={12} style={{ flex: 1, height: 96 }}>
          <S.TileBody>
            <S.TopRow>
              <S.IconTile $tint={tile.tint}>
                <tile.glyph />
              </S.IconTile>
              {tile.sample ? <SampleBadge compact /> : null}
            </S.TopRow>
            <S.Bottom>
              <S.Value style={{ fontVariant: ['tabular-nums'] }} numberOfLines={1} adjustsFontSizeToFit>
                {tile.value}
              </S.Value>
              <S.Unit numberOfLines={1}>{tile.label.toUpperCase()}</S.Unit>
            </S.Bottom>
          </S.TileBody>
        </HomeCard>
      ))}
    </S.TilesRow>
  );
}
