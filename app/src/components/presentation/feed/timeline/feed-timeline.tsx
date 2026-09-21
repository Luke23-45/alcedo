import { useLayoutEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { Instant } from '@js-joda/core';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useScroll } from '@/hooks/useScrollListener';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import { shareString } from '@/store/app';
import {
  fetchFeedItems,
  fetchInboxItems,
  selectReceivedReactionsByEvent,
  upsertReceivedReactions,
} from '@/store/feed';
import { ReceivedReaction } from '@/models/feed-models';
import {
  alexPostSeed,
  ensurePostSeeded,
  referenceKudosSeed,
  selectPostKudos,
  togglePostKudos,
} from '@/store/feed/comments';
import { getSessionReferenceTime, selectHistoryPersonalRecords, selectSessions } from '@/store/stored-sessions';
import type { KeyValueStore } from '@/services/key-value-store';
import { PEOPLE, personById, type FeedPerson } from '../shared/people';
import { deriveComposerSessionData, latestSession } from '../composer/composer-data';
import { useComposerDraftCaption } from '../shared/composer-draft';
import { ChallengeBanner } from './challenge-banner';
import { FeedBackground } from './feed-background';
import { FeedFooter } from './feed-footer';
import { FilterChips } from './filter-chips';
import { MilestoneCard } from './milestone-card';
import { PostCard } from './post-card';
import { REFRESH_TINT } from './timeline-tokens';
import {
  buildReferencePosts,
  CIRCLE_POST_TOTAL,
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
const REFERENCE_KUDOS_SEEDS = buildReferencePosts(0).map((p) => ({
  postId: p.id,
  total: p.kudos.total,
  faceIds: p.kudos.faceIds,
}));

/**
 * Reference kudos for Alex's own post, seeded as received cheers in the
 * existing reaction store ("cheers others sent you — only ever populated for
 * your own workouts", keyed by session id). The reference's six kudos are
 * Mia, Jon, Sofia, Dev, Lena and Tom.
 */
const ALEX_KUDOS_SENDERS = ['mia', 'jon', 'sofia', 'dev', 'lena', 'tom'] as const;

function buildAlexKudosSeed(sessionId: string): ReceivedReaction[] {
  const now = Instant.now();
  return ALEX_KUDOS_SENDERS.map(
    (fromUserId, index) =>
      new ReceivedReaction(
        `seed-alex-kudos-${fromUserId}`,
        sessionId,
        fromUserId,
        '💪',
        1,
        now.minusSeconds(index * 3600),
      ),
  );
}

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
 * - Reference posts (Mia/Jon/Sofia) are fictional: their kudos toggle lives in
 *   the shared feedComments store, which Screen 2 (post detail) reads too.
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
  return post.kind === 'milestone' ? <MilestoneCard post={post} {...common} /> : <PostCard post={post} {...common} />;
}

/**
 * Screen 1 — Feed Timeline.
 *
 * - Alex's card is built from the user's real latest session via the shared
 *   composer derivation (same data the composer preview and share poster
 *   render); the caption is the composer-drafted caption when one exists.
 * - Mia / Jon / Sofia are the contract's fictional sample posts; their ages
 *   are seeded relative to now so "2h / 18h / 1d" are always truthful.
 * - Delete (own) / Report (others) hide the post, persisted across restarts.
 * - Comments navigate to the post-detail route (Screen 2): item/alex,
 *   item/mia, item/jon, item/sofia.
 */
export function FeedTimeline({ keyValueStore }: { keyValueStore: KeyValueStore }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useAppTheme();
  const dark = theme.isDark;
  const t = useTimelineT();
  const { handleScroll } = useScroll();

  const [filter, setFilter] = useState<TimelineFilter>('all');
  const [contentHeight, setContentHeight] = useState(2400);
  const isFetching = useAppSelector((x) => x.feed.isFetching);

  const sessions = useAppSelector(selectSessions);
  const recordsBySession = useAppSelector(selectHistoryPersonalRecords);
  const latest = latestSession(sessions);
  const composerData = latest ? deriveComposerSessionData(latest, sessions, recordsBySession) : undefined;
  const draftCaption = useComposerDraftCaption(keyValueStore);
  const hidden = useHiddenPosts(keyValueStore);
  const bookmarks = useBookmarks(keyValueStore);

  // Alex's own post reads kudos from the existing reaction store: the row counts
  // the received cheers for the session. The kudoed state is the same
  // persisted local kudo record every other post uses (via selectPostKudos /
  // togglePostKudos on post id 'alex'), so the heart stays filled and never
  // hits the cheer pipeline's drop-for-unfollowed-author rollback. The session
  // id doubles as the feed event id for this lookup.
  const receivedByEvent = useAppSelector(selectReceivedReactionsByEvent);
  const alexStoredKudos = useAppSelectorWithArg(selectPostKudos, 'alex');
  const sessionId = latest?.id;
  const alexReceived = sessionId ? (receivedByEvent.get(sessionId) ?? []) : [];
  const alexKudos: PostKudos | undefined =
    sessionId !== undefined
      ? {
          total: alexReceived.reduce((sum, r) => sum + r.count, 0) + (alexStoredKudos?.kudoed ? 1 : 0),
          faces: alexReceived
            .map((r) => personById(r.fromUserId))
            .filter((p): p is FeedPerson => p !== undefined)
            .slice(0, 3),
          kudoed: alexStoredKudos?.kudoed ?? false,
        }
      : undefined;

  const referencePosts = buildReferencePosts(Date.now());

  const ownPost: TimelineWorkoutPost | undefined =
    latest && composerData
      ? {
          kind: 'workout',
          id: 'alex',
          person: PEOPLE.alex!,
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
      : undefined;

  // Seed kudos (and Alex's comment thread) before first paint so seeded values
  // never flash through an empty state. Idempotent per post id.
  const ownPostedAt = ownPost?.postedAt;
  const needsAlexKudosSeed = sessionId !== undefined && alexReceived.length === 0;
  useLayoutEffect(() => {
    if (ownPostedAt !== undefined) {
      dispatch(ensurePostSeeded({ postId: 'alex', seed: alexPostSeed('alex', ownPostedAt) }));
    }
    if (needsAlexKudosSeed && sessionId !== undefined) {
      dispatch(upsertReceivedReactions(buildAlexKudosSeed(sessionId)));
    }
    for (const seed of REFERENCE_KUDOS_SEEDS) {
      dispatch(
        ensurePostSeeded({
          postId: seed.postId,
          seed: { comments: [], kudos: referenceKudosSeed(seed.total, seed.faceIds) },
        }),
      );
    }
  }, [dispatch, ownPostedAt, needsAlexKudosSeed, sessionId]);

  const posts = [ownPost, ...referencePosts]
    .filter((p): p is TimelinePost => p !== undefined)
    .filter((p) => !hidden.has(p.id))
    .filter((p) => postMatchesFilter(p, filter))
    .sort((a, b) => b.postedAt - a.postedAt);

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
              ? `${post.person.name} on Kinetic: ${caption}`
              : post.kind === 'workout'
                ? `${post.person.name} on Kinetic: ${post.poster.heroValue} ${post.poster.heroUnit} · ${post.poster.workoutName}`
                : `${post.person.name} on Kinetic: 100 sessions milestone`;
          const isAlexPost = post.id === 'alex';
          return (
            <TimelinePostRow
              post={post}
              kudosOverride={isAlexPost ? alexKudos : undefined}
              onToggleKudosOverride={
                isAlexPost ? () => dispatch(togglePostKudos('alex')) : undefined
              }
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
        ItemSeparatorComponent={() => <S.Separator />}
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
          posts.length > 0 ? (
            <FeedFooter shown={posts.length} total={CIRCLE_POST_TOTAL} onLoadEarlier={refresh} />
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
        onContentSizeChange={(_, height) => setContentHeight(Math.max(height, 2400))}
        contentContainerStyle={{ paddingBottom: 8 }}
      />
    </S.Screen>
  );
}
