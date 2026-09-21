import { ReactNode } from 'react';
import { useAppTheme } from '@/hooks/useAppTheme';
import { formatPostAge } from '../composer/composer-data';
import { FeedActionBar } from '../shared/feed-action-bar';
import { FeedAvatar } from '../shared/feed-avatar';
import { IdentityBadge } from '../shared/identity-badge';
import { KudosStack } from '../shared/kudos-stack';
import { FeedCard } from './feed-card';
import { AVATAR_RING, TIMELINE_CARD_HEIGHT } from './timeline-tokens';
import { PostMenu } from './post-menu';
import { describeKudosLabel, type PostKudos, type TimelinePost } from './timeline-data';
import { useTimelineT } from './timeline-i18n';
import * as S from './post-frame.styles';

/**
 * Shared frame for timeline post cards: header (avatar, name + badge, meta,
 * "···" menu), hero slot, caption, kudos stack + label, hairline, and the
 * tri-split action bar. PostCard and MilestoneCard differ only in the hero.
 */
export function PostFrame({
  post,
  kudos,
  caption,
  bookmarked,
  shareText,
  hero,
  onToggleKudos,
  onToggleBookmark,
  onHide,
  onComment,
  onShare,
}: {
  post: TimelinePost;
  kudos: PostKudos;
  caption: string | null;
  bookmarked: boolean;
  shareText: string;
  hero: ReactNode;
  onToggleKudos: () => void;
  onToggleBookmark: () => void;
  onHide: () => void;
  onComment: () => void;
  onShare: () => void;
}) {
  const theme = useAppTheme();
  const dark = theme.isDark;
  const t = useTimelineT();
  const age = formatPostAge(post.postedAt, Date.now(), t);
  const audience =
    post.audience === 'friends'
      ? t('feed.timeline.audience.friends', 'Friends')
      : t('feed.timeline.audience.public', 'Public');

  const labelParts = describeKudosLabel(
    kudos.faces.map((f) => f.name),
    kudos.total,
  );
  const kudosLabel =
    labelParts.kind === 'one'
      ? t('feed.timeline.kudos.one', labelParts.name ?? '', { name: labelParts.name ?? '' })
      : labelParts.kind === 'two'
        ? t('feed.timeline.kudos.two', `${labelParts.first} and ${labelParts.second}`, {
            first: labelParts.first ?? '',
            second: labelParts.second ?? '',
          })
        : labelParts.kind === 'many'
          ? t('feed.timeline.kudos.many', `${labelParts.first}, ${labelParts.second} and ${labelParts.others} others`, {
              first: labelParts.first ?? '',
              second: labelParts.second ?? '',
              count: labelParts.others ?? 0,
            })
          : '';

  return (
    <FeedCard style={{ marginHorizontal: 16, height: TIMELINE_CARD_HEIGHT }}>
      <S.Header>
        <FeedAvatar person={post.person} size={36} ringColor={dark ? AVATAR_RING.dark : AVATAR_RING.light} />
        <S.NameCol>
          <S.NameRow>
            <S.Name $dark={dark}>{post.person.name}</S.Name>
            {post.badge && (
              <S.BadgeWrap>
                <IdentityBadge variant={post.badge} />
              </S.BadgeWrap>
            )}
          </S.NameRow>
          <S.Meta $dark={dark}>
            {post.person.handle} · {age} · {audience}
          </S.Meta>
        </S.NameCol>
        <S.MenuWrap>
          <PostMenu
            personName={post.person.name}
            isOwn={post.isOwn}
            shareText={shareText}
            bookmarked={bookmarked}
            onToggleBookmark={onToggleBookmark}
            onHide={onHide}
          />
        </S.MenuWrap>
      </S.Header>
      <S.PosterWrap>{hero}</S.PosterWrap>
      {caption && (
        <S.Caption $dark={dark} numberOfLines={2} ellipsizeMode="tail">
          {caption}
        </S.Caption>
      )}
      <S.KudosWrap>
        <KudosStack
          people={kudos.faces}
          total={kudos.total}
          label={kudosLabel}
          size={22}
          ringColor={dark ? AVATAR_RING.dark : AVATAR_RING.light}
        />
      </S.KudosWrap>
      <S.Hairline $dark={dark} />
      <FeedActionBar
        variant="card"
        kudos={kudos.total}
        kudoed={kudos.kudoed}
        comments={post.comments}
        onKudos={onToggleKudos}
        onComment={onComment}
        onShare={onShare}
      />
    </FeedCard>
  );
}
