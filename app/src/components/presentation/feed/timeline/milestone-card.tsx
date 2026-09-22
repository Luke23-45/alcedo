import { LinearGradient } from 'expo-linear-gradient';
import { StarGlyph } from '../shared/feed-glyphs';
import { PostFrame } from './post-frame';
import type { PostKudos, TimelineMilestonePost } from './timeline-data';
import { useTimelineT } from './timeline-i18n';
import { GOLD_GRADIENT, GOLD_GRADIENT_LOCATIONS, HERO_GLOSS, HERO_INK_UNIT } from './timeline-tokens';
import * as S from './milestone-card.styles';

function GoldHero({ milestone }: { milestone: TimelineMilestonePost['milestone'] }) {
  const t = useTimelineT();
  return (
    <S.Hero
      accessibilityRole="image"
      accessibilityLabel={t(
        'feed.timeline.milestone.a11y',
        `Milestone: ${milestone.value} ${milestone.unit.toLowerCase()}`,
      )}
    >
      <LinearGradient
        colors={[...GOLD_GRADIENT]}
        locations={[...GOLD_GRADIENT_LOCATIONS]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <LinearGradient
        colors={[...HERO_GLOSS]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 95, opacity: 0.45 }}
      />
      <S.Medallion>
        <StarGlyph size={21} color={HERO_INK_UNIT} />
      </S.Medallion>
      <S.Value>{milestone.value}</S.Value>
      <S.Unit>{milestone.unit}</S.Unit>
      <S.Tagline>{milestone.tagline}</S.Tagline>
      <S.DateRange>{milestone.dateRange}</S.DateRange>
    </S.Hero>
  );
}

/**
 * Milestone card (Screen 1 spec): the shared frame with the gold "100
 * SESSIONS" hero. The hero is a poster — identical in light mode.
 */
export function MilestoneCard({
  post,
  kudos,
  caption,
  bookmarked,
  shareText,
  onToggleKudos,
  onToggleBookmark,
  onHide,
  onComment,
  onShare,
}: {
  post: TimelineMilestonePost;
  kudos: PostKudos;
  caption: string | null;
  bookmarked: boolean;
  shareText: string;
  onToggleKudos: () => void;
  onToggleBookmark: () => void;
  onHide: () => void;
  onComment: () => void;
  onShare: () => void;
}) {
  return (
    <PostFrame
      post={post}
      kudos={kudos}
      caption={caption}
      bookmarked={bookmarked}
      shareText={shareText}
      hero={<GoldHero milestone={post.milestone} />}
      onToggleKudos={onToggleKudos}
      onToggleBookmark={onToggleBookmark}
      onHide={onHide}
      onComment={onComment}
      onShare={onShare}
    />
  );
}
