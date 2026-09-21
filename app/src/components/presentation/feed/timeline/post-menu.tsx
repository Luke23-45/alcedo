import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useAppTheme } from '@/hooks/useAppTheme';
import Menu from '@/components/presentation/foundation/menu';
import { shareString } from '@/store/app';
import { DotsGlyph } from '../shared/feed-glyphs';
import { INK_FAINT } from './timeline-tokens';
import { useTimelineT } from './timeline-i18n';
import * as S from './post-menu.styles';

/**
 * Per-post "···" menu (Screen 1 spec): Share + Bookmark for every post,
 * plus Delete (own post, destructive) or Report (others, destructive).
 * Delete/Report confirm via an iOS-style alert and then hide the post
 * locally (persisted by the timeline container).
 */
export function PostMenu({
  personName,
  isOwn,
  shareText,
  bookmarked,
  onToggleBookmark,
  onHide,
}: {
  personName: string;
  isOwn: boolean;
  shareText: string;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  onHide: () => void;
}) {
  const dispatch = useDispatch();
  const t = useTimelineT();
  const theme = useAppTheme();
  const dotsColor = theme.isDark ? INK_FAINT.dark : INK_FAINT.light;

  const confirmDelete = () => {
    Alert.alert(
      t('feed.timeline.menu.delete.title', 'Delete this post?'),
      t('feed.timeline.menu.delete.message', 'This removes the post from your feed. You can share again any time.'),
      [
        { text: t('feed.timeline.menu.cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('feed.timeline.menu.delete.confirm', 'Delete'),
          style: 'destructive',
          onPress: onHide,
        },
      ],
    );
  };

  const confirmReport = () => {
    Alert.alert(
      t('feed.timeline.menu.report.title', 'Report this post?'),
      t('feed.timeline.menu.report.message', 'The post will be hidden from your feed.'),
      [
        { text: t('feed.timeline.menu.cancel', 'Cancel'), style: 'cancel' },
        {
          text: t('feed.timeline.menu.report.confirm', 'Report'),
          style: 'destructive',
          onPress: onHide,
        },
      ],
    );
  };

  return (
    <Menu
      size={44}
      testID="post-menu"
      items={[
        {
          label: t('feed.timeline.menu.share', 'Share'),
          systemImage: 'square.and.arrow.up',
          onPress: () => dispatch(shareString({ title: personName, value: shareText })),
        },
        {
          label: bookmarked
            ? t('feed.timeline.menu.bookmarked', 'Bookmarked')
            : t('feed.timeline.menu.bookmark', 'Bookmark'),
          systemImage: bookmarked ? 'bookmark.fill' : 'bookmark',
          onPress: onToggleBookmark,
        },
        isOwn
          ? {
              label: t('feed.timeline.menu.delete', 'Delete'),
              systemImage: 'trash',
              destructive: true,
              onPress: confirmDelete,
            }
          : {
              label: t('feed.timeline.menu.report', 'Report'),
              systemImage: 'flag',
              destructive: true,
              onPress: confirmReport,
            },
      ]}
      trigger={(open) => (
        <S.DotsHitArea
          onPress={open}
          accessibilityRole="button"
          accessibilityLabel={t('feed.timeline.menu.a11y', 'Post options')}
        >
          <DotsGlyph size={22} color={dotsColor} />
        </S.DotsHitArea>
      )}
    />
  );
}
