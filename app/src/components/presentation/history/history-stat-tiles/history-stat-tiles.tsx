import { SampleBadge } from '@/components/presentation/home/shared/sample-badge';
import {
  formatCount,
  sessionTotalReps,
  sessionTotalSets,
  sessionVolumeKg,
} from '@/components/presentation/history/history-stats';
import { Session } from '@/models/session-models';
import { alpha } from '@/styles/theme';
import { useTranslate } from '@tolgee/react';
import Svg, { Path, Rect } from 'react-native-svg';
import * as S from './history-stat-tiles.styles';

/** Reference: the filled #ic-bolt glyph, scale .56, centered in the 20×20 tile. */
function VolumeGlyph() {
  return (
    <Svg width={7.2} height={11.2} viewBox="-6.4 -10 12.8 20">
      <Path d="M1.8 -10 L-6.4 1.6 L-0.9 1.6 L-1.8 10 L6.4 -1.6 L0.9 -1.6 Z" fill="#FF6A88" />
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
  key: 'volume' | 'sets' | 'reps' | 'bpm';
  label: string;
  value: string;
  sample?: boolean;
  tint: string;
  glyph: () => React.ReactNode;
}

/**
 * Reference tile geometry: 82×104, rx24, 11pt gaps. 20×20 icon tile (rx6.5,
 * tinted), value 17/700/−0.55, label 8/700/+0.8. Volume, sets and reps are
 * computed from the session via the shared history stats; average BPM has no
 * store source, so it renders the reference's sample figure under a
 * SampleBadge (home convention) rather than as a synced fact.
 */
export function HistoryStatTiles({ session }: { session: Session }) {
  const { t } = useTranslate();

  const reps = sessionTotalReps(session);
  const tiles: TileDatum[] = [
    {
      key: 'volume',
      label: `${t('workout.post_workout.volume.label')} kg`,
      value: formatCount(sessionVolumeKg(session)),
      tint: alpha('#FF2D55', 0.16),
      glyph: VolumeGlyph,
    },
    {
      key: 'sets',
      label: t('workout.post_workout.sets.label'),
      value: sessionTotalSets(session).toString(),
      tint: alpha('#A6FF00', 0.14),
      glyph: SetsGlyph,
    },
    {
      key: 'reps',
      label: t('exercise.reps.label'),
      value: reps.toString(),
      tint: alpha('#FF9F0A', 0.15),
      glyph: () => (
        <S.IconCount style={{ fontVariant: ['tabular-nums'] }} numberOfLines={1} adjustsFontSizeToFit>
          {reps.toString()}
        </S.IconCount>
      ),
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
        <S.TileCard key={tile.key} elev="tile" radius={24} pad={12}>
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
        </S.TileCard>
      ))}
    </S.TilesRow>
  );
}
