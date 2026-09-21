import { SharePoster } from '../shared/share-poster';
import { PostFrame } from './post-frame';
import type { PostKudos, TimelineWorkoutPost } from './timeline-data';

/**
 * Workout post card (Screen 1 spec): the shared frame with a 329×190 share
 * poster hero. Alex's card is data-identical to the composer's preview (same
 * derivation, same SharePoster).
 */
export function PostCard({
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
  post: TimelineWorkoutPost;
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
      hero={
        <SharePoster
          theme="ember"
          gradient={post.poster.gradient}
          kicker={post.poster.kicker}
          heroValue={post.poster.heroValue}
          heroUnit={post.poster.heroUnit}
          workoutName={post.poster.workoutName}
          duration={post.poster.duration}
          sets={post.poster.sets}
          prPills={post.poster.prPills.slice(0, 3)}
        />
      }
      onToggleKudos={onToggleKudos}
      onToggleBookmark={onToggleBookmark}
      onHide={onHide}
      onComment={onComment}
      onShare={onShare}
    />
  );
}
