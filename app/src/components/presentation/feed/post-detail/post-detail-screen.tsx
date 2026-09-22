import { useLayoutEffect, useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { T, useTranslate } from '@tolgee/react';
import { useDispatch } from 'react-redux';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useFormatDate } from '@/hooks/useFormatDate';
import { useFormatNumber } from '@/hooks/useFormatNumber';
import { shareString, showSnackbar } from '@/store/app';
import { removeFeedItems, upsertReceivedReactions } from '@/store/feed';
import {
  alexPostSeed,
  ensurePostSeeded,
  referenceKudosSeed,
  removePostData,
  selectPostKudos,
  togglePostKudos,
} from '@/store/feed/comments';
import { selectHistoryPersonalRecords, selectSessions } from '@/store/stored-sessions';
import type { KeyValueStore } from '@/services/key-value-store';
import Menu from '@/components/presentation/foundation/menu';
import ConfirmationDialog from '@/components/presentation/foundation/confirmation-dialog';
import EmptyInfo from '@/components/presentation/foundation/empty-info';
import { GlassBackground } from '@/components/presentation/foundation/glass-background';
import { feedKey } from '../shared/feed-i18n';
import { personById, type FeedPerson } from '../shared/people';
import { useOwnPerson } from '../shared/use-own-person';
import { useComposerDraftCaption } from '../shared/composer-draft';
import { buildAlexKudosSeed, useOwnPostKudos, type OwnPostKudos } from '../shared/own-post-kudos';
import { useHiddenPosts } from '../timeline/timeline-state';
import { deriveComposerSessionData } from '../composer/composer-data';
import { PostDetail } from './post-detail';
import { CommentBar, type ReplyTarget } from './comment-bar';
import { ChevronLeftGlyph, EllipsisGlyph } from './post-detail-glyphs';
import { selectPostDetailModel, type PostPosterData } from './post-models';
import * as S from './post-detail-screen.styles';

/**
 * Cached Intl formatters for the meta line ("10:31 AM · June 9, 2025") —
 * one per locale and 12/24-hour preference, following the useFormatDate
 * pattern. The locale comes from settings, never a hard-coded 'en-US'.
 */
const metaFormatters = new Map<string, { time: Intl.DateTimeFormat; date: Intl.DateTimeFormat }>();

function formatPostMeta(postedAtMs: number, locale: string | undefined, use24HourTime: boolean): string {
  const key = `${locale ?? ''}|${use24HourTime ? '24' : '12'}`;
  let cached = metaFormatters.get(key);
  if (!cached) {
    cached = {
      time: new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', hour12: !use24HourTime }),
      date: new Intl.DateTimeFormat(locale, { month: 'long', day: 'numeric', year: 'numeric' }),
    };
    metaFormatters.set(key, cached);
  }
  const at = new Date(postedAtMs);
  return `${cached.time.format(at)} · ${cached.date.format(at)}`;
}

/**
 * Screen 2 — Post Detail. The nav header, scrolling post, sticky comment
 * composer, and the overflow menu (Share · Delete for own posts, Report for
 * friends') live here; the post itself renders in PostDetail.
 *
 * Alex's own post is keyed 'alex' for every local record (thread, kudos,
 * hidden) — the same id the timeline seeds and reads — so whichever screen
 * mounts first, both show one shared thread and one shared kudo state.
 */
export function PostDetailScreen({ postId, keyValueStore }: { postId: string; keyValueStore: KeyValueStore }) {
  const theme = useAppTheme();
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const model = useAppSelectorWithArg(selectPostDetailModel, postId);
  const threadId = model?.isOwn ? 'alex' : model?.id;
  const locale = useAppSelector((s) => s.settings.preferredLanguage);
  const use24HourTime = useAppSelector((s) => s.settings.use24HourTime);

  const hidden = useHiddenPosts(keyValueStore);
  const draftCaption = useComposerDraftCaption(keyValueStore, model?.session?.id);

  const sessions = useAppSelector(selectSessions);
  const recordsBySession = useAppSelector(selectHistoryPersonalRecords);
  const formatDate = useFormatDate();
  const formatNumber = useFormatNumber();

  const ownKudos = useOwnPostKudos(model?.session?.id);
  const storedKudos = useAppSelectorWithArg(selectPostKudos, threadId ?? '');
  // Own post author is the user's real identity, for share text too.
  const ownPerson = useOwnPerson();

  const inputRef = useRef<TextInput | null>(null);
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  // Seed kudos + the contract thread before first paint so the seeded values
  // never flash through an empty state. Idempotent per post. The received-
  // cheers seed also runs here so a deep link that bypasses the timeline
  // still shows Alex's six kudos.
  useLayoutEffect(() => {
    if (model && threadId) {
      dispatch(
        ensurePostSeeded({
          postId: threadId,
          seed: model.seedThread
            ? alexPostSeed(threadId, model.postedAtMs)
            : {
                comments: [],
                kudos: referenceKudosSeed(model.kudosSeed.total, model.kudosSeed.people),
              },
        }),
      );
      if (ownKudos.needsKudosSeed && model.session) {
        dispatch(upsertReceivedReactions(buildAlexKudosSeed(model.session.id)));
      }
    }
  }, [dispatch, model, threadId, ownKudos.needsKudosSeed]);

  // Unknown ids and posts the user deleted/reported render the same honest
  // "item unavailable" state.
  if (!model || !threadId || hidden.has(threadId)) {
    return (
      <S.Screen>
        <Stack.Screen options={{ headerShown: false }} />
        <S.Header $topInset={insets.top}>
          <GlassBackground radius={0} color={theme.isDark ? 'rgba(8,8,10,0.90)' : 'rgba(255,255,255,0.90)'} />
          <S.HeaderRow>
            <S.SideSlot>
              <S.HeaderButton
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel={t(feedKey('feed.detail.back'), 'Back')}
              >
                <ChevronLeftGlyph size={16} />
              </S.HeaderButton>
            </S.SideSlot>
            <S.Title>{t(feedKey('feed.detail.title'), 'Post')}</S.Title>
            <S.SideSlot />
          </S.HeaderRow>
        </S.Header>
        <S.UnavailableWrap>
          <EmptyInfo>
            <T keyName="feed.item_unavailable.message" />
          </EmptyInfo>
        </S.UnavailableWrap>
      </S.Screen>
    );
  }

  // The poster's numbers come from the real published session through the
  // same derivation the timeline card uses — never the contract placeholder.
  // The timeline shows the composer draft caption on Alex's card; the detail
  // screen shows it too.
  const composerData = model.session
    ? deriveComposerSessionData(model.session, sessions, recordsBySession, formatDate, formatNumber)
    : undefined;
  const poster: PostPosterData = composerData
    ? {
        kind: 'workout',
        theme: 'ember',
        gradient: ['#FFB03A', '#FF5A3C', '#C1143C'],
        kicker: composerData.kicker,
        heroValue: composerData.volumeLabel,
        heroUnit: composerData.volumeUnit,
        workoutName: `${composerData.name} · ${composerData.kindLabel}`,
        duration: composerData.durationLabel,
        sets: composerData.setsLabel,
        prPills: composerData.prPills,
      }
    : model.poster;
  const caption = model.isOwn ? (draftCaption ?? null) : (model.caption ?? null);

  const visibility = t(
    feedKey(model.audience === 'friends' ? 'feed.detail.meta.visible.friends' : 'feed.detail.meta.visible.public'),
    model.audience === 'friends' ? 'Visible to Friends' : 'Visible to Public',
  );
  const meta = `${formatPostMeta(model.postedAtMs, locale, use24HourTime)} · ${visibility}`;

  // Own post with a real session: the shared received-cheers read model, so
  // the count matches the timeline and grows when real cheers arrive.
  // Everything else: the shared feedComments record under the thread id.
  const kudos: OwnPostKudos =
    model.isOwn && ownKudos.kudos
      ? ownKudos.kudos
      : {
          total: storedKudos?.total ?? model.kudosSeed.total,
          faces: (storedKudos ? storedKudos.people : model.kudosSeed.people)
            .map((id) => personById(id))
            .filter((p): p is FeedPerson => p !== undefined)
            .slice(0, 3),
          kudoed: storedKudos?.kudoed ?? false,
        };
  const handleToggleKudos =
    model.isOwn && model.session ? ownKudos.toggleKudos : () => dispatch(togglePostKudos(threadId));

  const focusComment = () => inputRef.current?.focus();

  const sharePost = () => {
    const author = model.isOwn ? ownPerson : personById(model.authorId);
    const authorName = author?.name ?? '';
    const value =
      caption != null
        ? `${authorName} on Kinetic: ${caption}`
        : poster.kind === 'milestone'
          ? t(feedKey('feed.detail.share.milestone'), '{author} — {value} {unit} on Kinetic', {
              author: authorName,
              value: poster.value,
              unit: poster.unit,
            })
          : poster.kind === 'photo'
            ? t(feedKey('feed.detail.share.photo'), '{author} — shared a photo on Kinetic', {
                author: authorName,
              })
            : poster.kind === 'video'
              ? t(feedKey('feed.detail.share.video'), '{author} — shared a video on Kinetic', {
                  author: authorName,
                })
              : t(feedKey('feed.detail.share.workout'), '{author} — {workout}: {value} {unit} in {duration}', {
                  author: authorName,
                  workout: poster.workoutName,
                  value: poster.heroValue,
                  unit: poster.heroUnit,
                  duration: poster.duration,
                });
    dispatch(
      shareString({
        title: t(feedKey('feed.detail.share.subject'), 'Kinetic post'),
        value,
      }),
    );
  };

  const confirmDelete = () => {
    if (model.eventId) {
      dispatch(removeFeedItems([model.eventId]));
    }
    // Hiding is what keeps the post off the timeline: the own-post card is
    // rebuilt from the latest session, so removing records alone would let it
    // reappear. removePostData clears the shared thread/kudos records.
    dispatch(removePostData(threadId));
    hidden.add(threadId);
    setDeleteOpen(false);
    dispatch(showSnackbar({ text: t(feedKey('feed.detail.deleted.snackbar'), 'Post deleted') }));
    router.back();
  };

  const confirmReport = () => {
    // Reporting hides the post, matching the timeline's report promise.
    hidden.add(threadId);
    setReportOpen(false);
    dispatch(showSnackbar({ text: t(feedKey('feed.detail.reported.snackbar'), "Thanks — we'll review this post.") }));
    router.back();
  };

  const menuItems = [
    {
      label: t(feedKey('feed.detail.menu.share'), 'Share'),
      systemImage: 'square.and.arrow.up' as const,
      onPress: sharePost,
    },
    model.isOwn
      ? {
          label: t(feedKey('feed.detail.menu.delete'), 'Delete'),
          systemImage: 'trash' as const,
          destructive: true,
          onPress: () => setDeleteOpen(true),
        }
      : {
          label: t(feedKey('feed.detail.menu.report'), 'Report'),
          systemImage: 'flag' as const,
          onPress: () => setReportOpen(true),
        },
  ];

  const headerTitle = t(feedKey('feed.detail.title'), 'Post');

  return (
    <S.Screen>
      <Stack.Screen options={{ headerShown: false }} />
      <S.Header $topInset={insets.top}>
        <GlassBackground radius={0} color={theme.isDark ? 'rgba(8,8,10,0.90)' : 'rgba(255,255,255,0.90)'} />
        <S.HeaderRow>
          <S.SideSlot>
            <S.HeaderButton
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel={t(feedKey('feed.detail.back'), 'Back')}
            >
              <ChevronLeftGlyph size={16} />
            </S.HeaderButton>
          </S.SideSlot>
          <S.Title>{headerTitle}</S.Title>
          <S.SideSlot>
            <Menu
              items={menuItems}
              trigger={(open) => (
                <S.HeaderButton
                  onPress={open}
                  accessibilityRole="button"
                  accessibilityLabel={t(feedKey('feed.detail.menu.label'), 'More options')}
                >
                  <EllipsisGlyph size={20} />
                </S.HeaderButton>
              )}
            />
          </S.SideSlot>
        </S.HeaderRow>
      </S.Header>

      <S.KeyboardAvoid behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <S.Body>
          <S.DetailScroll $replying={!!replyTarget}>
            <PostDetail
              model={model}
              threadId={threadId}
              caption={caption}
              poster={poster}
              meta={meta}
              kudos={kudos}
              onToggleKudos={handleToggleKudos}
              onReply={setReplyTarget}
              onFocusComment={focusComment}
              onShare={sharePost}
            />
          </S.DetailScroll>
          <CommentBar
            postId={threadId}
            replyTarget={replyTarget}
            onCancelReply={() => setReplyTarget(null)}
            inputRef={inputRef}
          />
        </S.Body>
      </S.KeyboardAvoid>

      <ConfirmationDialog
        open={deleteOpen}
        headline={t(feedKey('feed.detail.delete.title'), 'Delete this post?')}
        textContent={t(feedKey('feed.detail.delete.message'), 'Your post will be removed from the feed.')}
        cancelText={t(feedKey('feed.detail.delete.cancel'), 'Cancel')}
        okText={t(feedKey('feed.detail.delete.confirm'), 'Delete')}
        destructive
        onCancel={() => setDeleteOpen(false)}
        onOk={confirmDelete}
      />
      <ConfirmationDialog
        open={reportOpen}
        headline={t(feedKey('feed.detail.report.title'), 'Report this post?')}
        textContent={t(feedKey('feed.detail.report.message'), "Tell us what's wrong and we'll take a look.")}
        cancelText={t(feedKey('feed.detail.report.cancel'), 'Cancel')}
        okText={t(feedKey('feed.detail.report.confirm'), 'Report')}
        onCancel={() => setReportOpen(false)}
        onOk={confirmReport}
      />
    </S.Screen>
  );
}
