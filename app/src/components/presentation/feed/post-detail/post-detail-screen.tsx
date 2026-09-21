import { useLayoutEffect, useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { T, useTranslate } from '@tolgee/react';
import { useDispatch } from 'react-redux';
import { useAppSelectorWithArg } from '@/store';
import { useAppTheme } from '@/hooks/useAppTheme';
import { shareString, showSnackbar } from '@/store/app';
import { removeFeedItems } from '@/store/feed';
import { alexPostSeed, ensurePostSeeded, referenceKudosSeed, removePostData } from '@/store/feed/comments';
import Menu from '@/components/presentation/foundation/menu';
import ConfirmationDialog from '@/components/presentation/foundation/confirmation-dialog';
import EmptyInfo from '@/components/presentation/foundation/empty-info';
import { GlassBackground } from '@/components/presentation/foundation/glass-background';
import { feedKey } from '../shared/feed-i18n';
import { personById } from '../shared/people';
import { PostDetail } from './post-detail';
import { CommentBar, type ReplyTarget } from './comment-bar';
import { ChevronLeftGlyph, EllipsisGlyph } from './post-detail-glyphs';
import { selectPostDetailModel } from './post-models';
import * as S from './post-detail-screen.styles';

/**
 * Screen 2 — Post Detail. The nav header, scrolling post, sticky comment
 * composer, and the overflow menu (Share · Delete for own posts, Report for
 * friends') live here; the post itself renders in PostDetail.
 */
export function PostDetailScreen({ postId }: { postId: string }) {
  const theme = useAppTheme();
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const model = useAppSelectorWithArg(selectPostDetailModel, postId);
  const inputRef = useRef<TextInput | null>(null);
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  // Seed kudos + the contract thread before first paint so the seeded values
  // never flash through an empty state. Idempotent per post.
  useLayoutEffect(() => {
    if (model) {
      dispatch(
        ensurePostSeeded({
          postId: model.id,
          seed: model.seedThread
            ? alexPostSeed(model.id, model.postedAtMs)
            : {
                comments: [],
                kudos: referenceKudosSeed(model.kudosSeed.total, model.kudosSeed.people),
              },
        }),
      );
    }
  }, [dispatch, model]);

  const focusComment = () => inputRef.current?.focus();

  const sharePost = () => {
    if (!model) {
      return;
    }
    const author = personById(model.authorId);
    const authorName = author?.name ?? '';
    const poster = model.poster;
    const value =
      poster.kind === 'milestone'
        ? t(feedKey('feed.detail.share.milestone'), '{author} — {value} {unit} on Kinetic', {
            author: authorName,
            value: poster.value,
            unit: poster.unit,
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
    if (!model) {
      return;
    }
    if (model.eventId) {
      dispatch(removeFeedItems([model.eventId]));
    }
    dispatch(removePostData(model.id));
    setDeleteOpen(false);
    dispatch(showSnackbar({ text: t(feedKey('feed.detail.deleted.snackbar'), 'Post deleted') }));
    router.back();
  };

  const confirmReport = () => {
    setReportOpen(false);
    dispatch(showSnackbar({ text: t(feedKey('feed.detail.reported.snackbar'), "Thanks — we'll review this post.") }));
  };

  const menuItems = model
    ? [
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
      ]
    : [];

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
            {model ? (
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
            ) : null}
          </S.SideSlot>
        </S.HeaderRow>
      </S.Header>

      {model ? (
        <S.KeyboardAvoid behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <S.Body>
            <S.DetailScroll $replying={!!replyTarget}>
              <PostDetail model={model} onReply={setReplyTarget} onFocusComment={focusComment} onShare={sharePost} />
            </S.DetailScroll>
            <CommentBar
              postId={model.id}
              replyTarget={replyTarget}
              onCancelReply={() => setReplyTarget(null)}
              inputRef={inputRef}
            />
          </S.Body>
        </S.KeyboardAvoid>
      ) : (
        <S.UnavailableWrap>
          <EmptyInfo>
            <T keyName="feed.item_unavailable.message" />
          </EmptyInfo>
        </S.UnavailableWrap>
      )}

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
