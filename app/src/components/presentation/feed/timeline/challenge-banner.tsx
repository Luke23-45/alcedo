import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';
import { StarGlyph } from '../shared/feed-glyphs';
import { FeedCard } from './feed-card';
import { CHALLENGE, formatChallengePoints } from './timeline-data';
import { useTimelineT } from './timeline-i18n';
import {
  CHALLENGE_GRADIENT,
  CHALLENGE_GRADIENT_LOCATIONS,
  GOLD_GRADIENT,
  GOLD_GRADIENT_LOCATIONS,
  HERO_INK_UNIT,
} from './timeline-tokens';
import * as S from './challenge-banner.styles';

/**
 * Weekly-challenge banner (Screen 1 spec, 361×76): gold medallion, title +
 * "3 days left · 128 participants", 200pt progress track filled 165.7pt
 * (10,340 / 12,480), rank "#3" with points.
 *
 * Deliberately non-interactive: home's weekly-challenge section has no
 * navigation target, so the banner mirrors it and goes nowhere.
 */
export function ChallengeBanner() {
  const theme = useAppTheme();
  const dark = theme.isDark;
  const t = useTimelineT();
  return (
    <FeedCard radius={24} style={{ marginHorizontal: 16 }}>
      <S.BannerRow
        accessible
        accessibilityRole="summary"
        accessibilityLabel={t(
          'feed.timeline.challenge.a11y',
          `Weekly Challenge, rank ${CHALLENGE.rank}, ${formatChallengePoints(CHALLENGE.titlePoints)} points, ${CHALLENGE.daysLeft} days left, ${CHALLENGE.participants} participants`,
        )}
      >
        <S.Medallion>
          <LinearGradient
            colors={[...GOLD_GRADIENT]}
            locations={[...GOLD_GRADIENT_LOCATIONS]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 20,
            }}
          />
          <StarGlyph size={19} color={HERO_INK_UNIT} />
        </S.Medallion>
        <S.Middle>
          <S.Title $dark={dark}>{t('feed.timeline.challenge.title', 'Weekly Challenge')}</S.Title>
          <S.Sub $dark={dark}>
            {t('feed.timeline.challenge.sub', '3 days left · 128 participants', {
              daysLeft: CHALLENGE.daysLeft,
              participants: CHALLENGE.participants,
            })}
          </S.Sub>
          <S.Track
            $dark={dark}
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={t(
              'feed.timeline.challenge.progress_a11y',
              `${formatChallengePoints(CHALLENGE.titlePoints)} of ${formatChallengePoints(CHALLENGE.leaderPoints)} points`,
              { points: CHALLENGE.titlePoints, leaderPoints: CHALLENGE.leaderPoints },
            )}
          >
            <LinearGradient
              colors={[...CHALLENGE_GRADIENT]}
              locations={[...CHALLENGE_GRADIENT_LOCATIONS]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.6, y: 1 }}
              style={{ width: CHALLENGE.trackFill, height: 3.5, borderRadius: 1.75 }}
            />
          </S.Track>
        </S.Middle>
        <S.RankCol>
          <S.Rank
            $dark={dark}
            accessibilityLabel={t('feed.timeline.challenge.rank_a11y', `Rank ${CHALLENGE.rank}`, {
              rank: CHALLENGE.rank,
            })}
          >
            #{CHALLENGE.rank}
          </S.Rank>
          <S.Points $dark={dark}>
            {t('feed.timeline.challenge.points', '10,340 PTS', {
              points: formatChallengePoints(CHALLENGE.titlePoints),
            })}
          </S.Points>
        </S.RankCol>
      </S.BannerRow>
    </FeedCard>
  );
}
