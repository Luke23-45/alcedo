import { LinearGradient } from 'expo-linear-gradient';
import * as S from '../shared/share-poster.styles';
import { StarGlyph } from '../shared/feed-glyphs';
import * as M from './milestone-poster.styles';

/**
 * The milestone poster's gold medallion, in the same 190pt media slot as the
 * workout posters. The workout posters themselves render through the shared
 * SharePoster (ember theme, or the exact contract gradient override); only
 * the medallion is format-specific, so only it lives here.
 *
 * Posters do not theme in light mode (they are images): gradient, gloss,
 * edge and text colours are identical in both modes.
 */

interface MilestonePosterProps {
  value: string;
  unit: string;
  subtitle: string;
  range: string;
}

/** Jon's 100-session milestone: gold medallion in the 190pt media slot. */
export function MilestonePoster({ value, unit, subtitle, range }: MilestonePosterProps) {
  return (
    <S.ShadowWrap>
      <S.Poster>
        <LinearGradient
          colors={['#FFF0BE', '#FFD84D', '#D9A441']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={S.fill}
        />
        <LinearGradient
          colors={['rgba(255,255,255,0.32)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[S.gloss, { opacity: 0.45 }]}
        />
        <M.Medallion>
          <M.StarDisc>
            <StarGlyph size={28} color="#5C4300" />
          </M.StarDisc>
          <M.MedalValue numberOfLines={1} ellipsizeMode="tail">
            {value}
          </M.MedalValue>
          <M.MedalUnit numberOfLines={1} ellipsizeMode="tail">
            {unit}
          </M.MedalUnit>
          <M.MedalSubtitle numberOfLines={1} ellipsizeMode="tail">
            {subtitle}
          </M.MedalSubtitle>
          <M.MedalRange numberOfLines={1} ellipsizeMode="tail">
            {range}
          </M.MedalRange>
        </M.Medallion>
        <M.MilestoneEdge />
      </S.Poster>
    </S.ShadowWrap>
  );
}
