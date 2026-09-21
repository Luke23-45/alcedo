import { View } from 'react-native';
import { ComposerPostCard } from '@/components/presentation/feed/composer/composer-post-card/composer-post-card';
import { deriveComposerSessionData } from '@/components/presentation/feed/composer/composer-data';
import type { ComposerStatKey } from '@/components/presentation/feed/composer/composer-types';
import { buildPosterProps } from '@/components/presentation/feed/composer/poster-props';
import { useAppSelector } from '@/store';
import { useFormatDate } from '@/hooks/useFormatDate';
import { selectComposerPosts, type ComposerPost } from '@/store/feed/composer-posts';
import { selectHistoryPersonalRecords, selectSessions } from '@/store/stored-sessions';

function visibleRecord(keys: ComposerPost['visibleStats']): Record<ComposerStatKey, boolean> {
  return {
    volume: keys.includes('volume'),
    duration: keys.includes('duration'),
    sets: keys.includes('sets'),
    prs: keys.includes('prs'),
    reps: keys.includes('reps'),
    heartrate: keys.includes('heartrate'),
    notes: keys.includes('notes'),
    rpe: keys.includes('rpe'),
  };
}

/**
 * Composer posts in the feed timeline, newest first, rendered at the top of
 * the list. Each poster is re-derived from its session through the same
 * toggle rule as the composer preview, so the timeline shows exactly what
 * the user saw when they shared. Posts whose session no longer exists render
 * nothing — never a placeholder card.
 */
export function FeedComposerPosts() {
  const posts = useAppSelector(selectComposerPosts);
  const sessions = useAppSelector(selectSessions);
  const recordsBySession = useAppSelector(selectHistoryPersonalRecords);
  const formatDate = useFormatDate();

  if (posts.length === 0) {
    return null;
  }

  const now = Date.now();
  return (
    <View style={{ gap: 12, marginBottom: 12 }}>
      {posts.map((post) => {
        const session = sessions.find((s) => s.id === post.sessionId);
        const data = session ? deriveComposerSessionData(session, sessions, recordsBySession, formatDate) : null;
        const poster = data ? buildPosterProps(data, post.theme, visibleRecord(post.visibleStats)) : null;
        return <ComposerPostCard key={post.id} post={post} data={data} poster={poster} now={now} />;
      })}
    </View>
  );
}
