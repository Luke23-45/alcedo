import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useFormatDate } from '@/hooks/useFormatDate';
import { useFormatNumber } from '@/hooks/useFormatNumber';
import { useScroll } from '@/hooks/useScrollListener';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import { shareString } from '@/store/app';
import { fetchFeedItems, fetchInboxItems, upsertReceivedReactions } from '@/store/feed';
import {
  alexPostSeed,
  ensurePostSeeded,
  referenceKudosSeed,
  selectPostKudos,
  togglePostKudos,
} from '@/store/feed/comments';
import { getSessionReferenceTime, selectHistoryPersonalRecords, selectSessions } from '@/store/stored-sessions';
import type { KeyValueStore } from '@/services/key-value-store';
import { personById, type FeedPerson } from '../shared/people';
import { useOwnPerson } from '../shared/use-own-person';
import { deriveComposerSessionData, latestSession } from '../composer/composer-data';
import { useComposerDraftCaption } from '../shared/composer-draft';
import { buildAlexKudosSeed, useOwnPostKudos } from '../shared/own-post-kudos';
import { ChallengeBanner } from './challenge-banner';
import { FeedBackground } from './feed-background';
import { FeedFooter } from './feed-footer';
import { FilterChips } from './filter-chips';
import { MediaCard } from './media-card';
import { MilestoneCard } from './milestone-card';
import { PostCard } from './post-card';
import { REFRESH_TINT } from './timeline-tokens';
import { buildDefaultPosts } from '../feed-seed';
import {
  postMatchesFilter,
  TIMELINE_FILTERS,
  type PostKudos,
  type TimelineFilter,
  type TimelinePost,
  type TimelineWorkoutPost,
} from './timeline-data';
import { useTimelineT } from './timeline-i18n';
import { useBookmarks, useHiddenPosts } from './timeline-state';
import * as S from './feed-timeline.styles';

/**
 * Kudos seeds for the fictional sample posts. Age-independent — the same
 * values Screen 2 (post detail) seeds, so whichever screen mounts first wins
 * identically.
 */
const DEFAULT_KUDOS_SEEDS = buildDefaultPosts(0).map((p) => ({
  postId: p.id,
  total: p.kudos.total,
  faceIds: p.kudos.faceIds,
}));

interface PostRowProps {
  post: TimelinePost;
  /** Overrides the feedComments kudos (Alex's post reads the reaction store). */
  kudosOverride?: PostKudos;
  /** Overrides the feedComments toggle (Alex's post toggles the same local kudo record). */
  onToggleKudosOverride?: () => void;
  caption: string | null;
  bookmarked: boolean;
  shareText: string;
  onToggleBookmark: () => void;
  onHide: () => void;
  onComment: () => void;
  onShare: () => void;
}

/**
 * One timeline card.
 *
 * - Default posts (the fictional sample catalog) are fictional: their kudos
 *   toggle lives in the shared feedComments store, which Screen 2 (post
 *   detail) reads too.
 * - Alex's own post reads its kudos count from the existing reaction store
 *   (`selectReceivedReactionsByEvent` — the store's designed source for cheers
 *   on your own workouts, seeded with the reference's six kudos so the count is
 *   real and grows when real cheers arrive), while the heart toggle uses the
 *   same persisted local kudo record as every other post (the cheer pipeline
 *   drops cheers for events whose author isn't followed, which would
 *   visibly un-fill the heart ~1s after tapping your own post).
 */
function TimelinePostRow({
  post,
  kudosOverride,
  onToggleKudosOverride,
  caption,
  bookmarked,
  shareText,
  onToggleBookmark,
  onHide,
  onComment,
  onShare,
}: PostRowProps) {
  const dispatch = useDispatch();
  const storedKudos = useAppSelectorWithArg(selectPostKudos, post.id);
  const fallbackKudos: PostKudos = {
    total: storedKudos?.total ?? post.kudos.total,
    faces: (storedKudos ? storedKudos.people : post.kudos.faceIds)
      .map((id) => personById(id))
      .filter((p): p is FeedPerson => p !== undefined)
      .slice(0, 3),
    kudoed: storedKudos?.kudoed ?? false,
  };
  const kudos = kudosOverride ?? fallbackKudos;
  const handleToggleKudos = onToggleKudosOverride ?? (() => dispatch(togglePostKudos(post.id)));
  const common = {
    kudos,
    caption,
    bookmarked,
    shareText,
    onToggleKudos: handleToggleKudos,
    onToggleBookmark,
    onHide,
    onComment,
    onShare,
  };
  return post.kind === 'milestone' ? (
    <MilestoneCard post={post} {...common} />
  ) : post.kind === 'workout' ? (
    <PostCard post={post} {...common} />
  ) : (
    <MediaCard post={post} {...common} />
  );
}

/**
 * Screen 1 — Feed Timeline.
 *
 * - Alex's card is built from the user's real latest session via the shared
 *   composer derivation (same data the composer preview and share poster
 *   render); the caption is the composer-drafted caption when one exists.
 * - The default catalog (twelve fictional sample posts from the eleven
 *   fictional default-graph people; Alex's slot is the real user and carries
 *   no sample) fills the feed when no backend is connected; their ages are
 *   seeded relative to now so the relative-time labels are always truthful,
 *   and the footer discloses the sample nature with an honest sample-only
 *   count.
 * - Delete (own) / Report (others) hide the post, persisted across restarts.
 * - Comments navigate to the post-detail route (Screen 2): item/<post id>.
 */

// Stable separator: an inline `() => <S.Separator />` creates a new component
// type per render, unmounting/remounting every separator.
function TimelineSeparator() {
  return <S.Separator />;
}

export function FeedTimeline({ keyValueStore }: { keyValueStore: KeyValueStore }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useAppTheme();
  const dark = theme.isDark;
  const t = useTimelineT();
  const { handleScroll } = useScroll();

  const [filter, setFilter] = useState<TimelineFilter>('all');
  const [contentHeight, setContentHeight] = useState(2400);
  const contentHeightRef = useRef(contentHeight);
  const isFetching = useAppSelector((x) => x.feed.isFetching);

  const sessions = useAppSelector(selectSessions);
  const recordsBySession = useAppSelector(selectHistoryPersonalRecords);
  const latest = latestSession(sessions);
  const formatDate = useFormatDate();
  const formatNumber = useFormatNumber();
  const composerData = latest
    ? deriveComposerSessionData(latest, sessions, recordsBySession, formatDate, formatNumber)
    : undefined;
  const draftCaption = useComposerDraftCaption(keyValueStore, latest?.id);
  const hidden = useHiddenPosts(keyValueStore);
  const bookmarks = useBookmarks(keyValueStore);

  // Alex's own post reads kudos through the shared own-post hook (Screen 2
  // uses the same one): the row counts the received cheers for the session
  // while the heart toggle is the persisted local kudo record keyed 'alex'.
  // The session id doubles as the feed event id for this lookup.
  const sessionId = latest?.id;
  const ownPostKudos = useOwnPostKudos(sessionId);
  const alexKudos: PostKudos | undefined = ownPostKudos.kudos;

  // Own post author is the user's real identity (feed identity name /
  // profile username), not the contract's fictional "Alex Rivera".
  const ownPerson = useOwnPerson();

  // Sample catalog is stable for the screen's lifetime: rebuilding it per
  // render would hand FlatList a new data identity every time and re-render
  // every row. Relative-time labels refresh on remount.
  const defaultPosts = useMemo(() => buildDefaultPosts(Date.now()), []);

  // ownPost is a fresh object per render; memoize so the posts array below
  // keeps a stable identity unless its real inputs change.
  const ownPost: TimelineWorkoutPost | undefined = useMemo(
    () =>
      latest && composerData
        ? {
            kind: 'workout',
            id: 'alex',
            person: ownPerson,
            isOwn: true,
            badge: 'you',
            audience: 'friends',
            postedAt: getSessionReferenceTime(latest).toInstant().toEpochMilli(),
            caption: draftCaption ?? null,
            poster: {
              kicker: composerData.kicker,
              heroValue: composerData.volumeLabel,
              heroUnit: composerData.volumeUnit,
              workoutName: `${composerData.name} · ${composerData.kindLabel}`,
              duration: composerData.durationLabel,
              sets: composerData.setsLabel,
              prPills: composerData.prPills,
            },
            kudos: { faceIds: ['mia', 'jon', 'sofia'], total: 6 },
            comments: 3,
            inChallenge: true,
          }
        : undefined,
    [latest, composerData, ownPerson, draftCaption],
  );

  // Seed kudos (and Alex's comment thread) before first paint so seeded values
  // never flash through an empty state. Idempotent per post id.
  const ownPostedAt = ownPost?.postedAt;
  const needsAlexKudosSeed = ownPostKudos.needsKudosSeed;
  useLayoutEffect(() => {
    if (ownPostedAt !== undefined) {
      dispatch(ensurePostSeeded({ postId: 'alex', seed: alexPostSeed('alex', ownPostedAt) }));
    }
    if (needsAlexKudosSeed && sessionId !== undefined) {
      dispatch(upsertReceivedReactions(buildAlexKudosSeed(sessionId)));
    }
    for (const seed of DEFAULT_KUDOS_SEEDS) {
      dispatch(
        ensurePostSeeded({
          postId: seed.postId,
          seed: { comments: [], kudos: referenceKudosSeed(seed.total, seed.faceIds) },
        }),
      );
    }
  }, [dispatch, ownPostedAt, needsAlexKudosSeed, sessionId]);

  // Stable data identity for FlatList: without this, every parent re-render
  // (filter tap, isFetching toggle, content-height update) rebuilds the array
  // and re-renders every visible row.
  const { posts, visibleSampleCount, availableSampleCount } = useMemo(() => {
    const isVisible = (p: TimelinePost) => !hidden.has(p.id) && postMatchesFilter(p, filter);
    const availableSamples = defaultPosts.filter((p) => !hidden.has(p.id));
    const visibleSamples = availableSamples.filter((p) => postMatchesFilter(p, filter));
    const posts = [ownPost, ...visibleSamples]
      .filter((p): p is TimelinePost => p !== undefined && isVisible(p))
      .sort((a, b) => b.postedAt - a.postedAt);
    return { posts, visibleSampleCount: visibleSamples.length, availableSampleCount: availableSamples.length };
  }, [ownPost, defaultPosts, hidden, filter]);

  const refresh = () => {
    dispatch(fetchInboxItems({ fromUserAction: true }));
    dispatch(fetchFeedItems({ fromUserAction: true }));
  };

  const activeFilter = TIMELINE_FILTERS.find((f) => f.id === filter)!;

  return (
    <S.Screen>
      <FeedBackground contentHeight={contentHeight} />
      <FlatList
        data={posts}
        keyExtractor={(post) => post.id}
        renderItem={({ item: post }) => {
          const caption = post.id === 'alex' ? (draftCaption ?? null) : post.caption;
          const shareText =
            caption != null
              ? `${post.person.name} on Alcedo: ${caption}`
              : post.kind === 'workout'
                ? `${post.person.name} on Alcedo: ${post.poster.heroValue} ${post.poster.heroUnit} · ${post.poster.workoutName}`
                : post.kind === 'milestone'
                  ? `${post.person.name} on Alcedo: ${post.milestone.value} ${post.milestone.unit.toLowerCase()} milestone`
                  : post.kind === 'photo'
                    ? `${post.person.name} on Alcedo: shared a photo`
                    : `${post.person.name} on Alcedo: shared a video`;
          const isAlexPost = post.id === 'alex';
          return (
            <TimelinePostRow
              post={post}
              kudosOverride={isAlexPost ? alexKudos : undefined}
              onToggleKudosOverride={isAlexPost ? ownPostKudos.toggleKudos : undefined}
              caption={caption}
              bookmarked={bookmarks.has(post.id)}
              shareText={shareText}
              onToggleBookmark={() => bookmarks.toggle(post.id)}
              onHide={() => hidden.add(post.id)}
              onComment={() => router.push(`item/${post.id}`)}
              onShare={() => dispatch(shareString({ title: post.person.name, value: shareText }))}
            />
          );
        }}
        ItemSeparatorComponent={TimelineSeparator}
        ListHeaderComponent={
          <S.HeaderWrap>
            <ChallengeBanner />
            <S.ChipsWrap>
              <FilterChips selected={filter} onSelect={setFilter} />
            </S.ChipsWrap>
          </S.HeaderWrap>
        }
        ListEmptyComponent={
          <S.EmptyWrap>
            <S.EmptyTitle $dark={dark}>{t(activeFilter.emptyTitleKey, activeFilter.emptyTitleFallback)}</S.EmptyTitle>
            <S.EmptyBody $dark={dark}>{t(activeFilter.emptyBodyKey, activeFilter.emptyBodyFallback)}</S.EmptyBody>
          </S.EmptyWrap>
        }
        ListFooterComponent={
          visibleSampleCount > 0 ? (
            <FeedFooter shown={visibleSampleCount} total={availableSampleCount} onLoadEarlier={refresh} />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refresh}
            tintColor={dark ? REFRESH_TINT.dark : REFRESH_TINT.light}
          />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={(_, height) => {
          // Guard against the feedback loop: content size changes as rows mount
          // during scroll, and each setState re-renders. Only update on a real change.
          const next = Math.max(height, 2400);
          if (Math.abs(next - contentHeightRef.current) > 1) {
            contentHeightRef.current = next;
            setContentHeight(next);
          }
        }}
        contentContainerStyle={{ paddingBottom: 8 }}
      />
    </S.Screen>
  );
}
