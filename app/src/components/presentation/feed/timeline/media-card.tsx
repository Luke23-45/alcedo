import { PostFrame } from './post-frame';
import { PhotoHero } from '../shared/photo-hero';
import { VideoHero } from '../shared/video-hero';
import type { PostKudos, TimelinePhotoPost, TimelineVideoPost } from './timeline-data';
import { useTimelineT } from './timeline-i18n';

type MediaPost = TimelinePhotoPost | TimelineVideoPost;

interface MediaCardProps {
  post: MediaPost;
  kudos: PostKudos;
  caption: string | null;
  bookmarked: boolean;
  shareText: string;
  onToggleKudos: () => void;
  onToggleBookmark: () => void;
  onHide: () => void;
  onComment: () => void;
  onShare: () => void;
}

/**
 * Photo/video post card (Screen 1 spec, extended): the shared frame with a
 * bundled-photo or tap-to-play clip hero. Photos render still; the clip
 * never autoplays.
 */
export function MediaCard({
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
}: MediaCardProps) {
  const t = useTimelineT();
  const hero =
    post.kind === 'photo' ? (
      <PhotoHero photo={post.photo} a11yLabel={t('feed.timeline.photo.a11y', 'Photo post')} />
    ) : (
      <VideoHero
        video={post.video}
        poster={post.poster}
        a11yLabel={t('feed.timeline.video.a11y', 'Video post')}
        durationLabel={t('feed.timeline.video.duration', '0:04')}
      />
    );
  return (
    <PostFrame
      post={post}
      kudos={kudos}
      caption={caption}
      bookmarked={bookmarked}
      shareText={shareText}
      hero={hero}
      onToggleKudos={onToggleKudos}
      onToggleBookmark={onToggleBookmark}
      onHide={onHide}
      onComment={onComment}
      onShare={onShare}
    />
  );
}
