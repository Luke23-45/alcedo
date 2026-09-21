import { useTranslate } from '@tolgee/react';
import { useDispatch } from 'react-redux';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import { useAppTheme } from '@/hooks/useAppTheme';
import { selectPostKudos, selectTopLevelComments, togglePostKudos } from '@/store/feed/comments';
import { FeedAvatar } from '../shared/feed-avatar';
import { IdentityBadge } from '../shared/identity-badge';
import { SharePoster } from '../shared/share-poster';
import { FeedActionBar } from '../shared/feed-action-bar';
import { feedKey } from '../shared/feed-i18n';
import { personById, type FeedPerson } from '../shared/people';
import * as KS from '../shared/kudos-stack.styles';
import { MilestonePoster } from './milestone-poster';
import { CommentThread } from './comment-thread';
import { formatKudosLabel, type PostDetailModel } from './post-models';
import { relativeAgeLong } from './relative-time';
import type { ReplyTarget } from './comment-bar';
import * as S from './post-detail.styles';

interface PostDetailProps {
  model: PostDetailModel;
  onReply: (target: ReplyTarget) => void;
  onFocusComment: () => void;
  onShare: () => void;
}

/**
 * The post itself: author row, poster, caption (real or omitted), meta,
 * kudos row, the detail action bar, and the comment thread. The screen owns
 * the nav header, the sticky composer, and the overflow menu.
 */
export function PostDetail({ model, onReply, onFocusComment, onShare }: PostDetailProps) {
  const theme = useAppTheme();
  const { t } = useTranslate();
  const dispatch = useDispatch();

  const author = personById(model.authorId);
  const storedKudos = useAppSelectorWithArg(selectPostKudos, model.id);
  const use24HourTime = useAppSelector((s) => s.settings.use24HourTime);
  // The screen seeds before first paint; the fallback only guards the gap.
  const kudos = storedKudos ?? { kudoed: false, total: 0, people: [] as string[] };
  const topLevel = useAppSelectorWithArg(selectTopLevelComments, model.id);
  const commentCount = model.commentCountBase + topLevel.length;

  if (!author) {
    return null;
  }

  const people: FeedPerson[] = kudos.people.map((id) => personById(id)).filter((p): p is FeedPerson => !!p);
  const kudosLabel = formatKudosLabel(people, kudos.total, (count) =>
    t(feedKey('feed.detail.kudos.others'), 'and {count} others', { count }),
  );
  const kudosCountText =
    kudos.total === 1
      ? t(feedKey('feed.detail.kudos.count_one'), '1 kudo')
      : t(feedKey('feed.detail.kudos.count'), '{count} kudos', { count: kudos.total });

  const postedAt = new Date(model.postedAtMs);
  const meta = [
    postedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: !use24HourTime }),
    postedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    t(
      feedKey(model.audience === 'friends' ? 'feed.detail.meta.visible.friends' : 'feed.detail.meta.visible.public'),
      model.audience === 'friends' ? 'Visible to Friends' : 'Visible to Public',
    ),
  ].join(' · ');

  const poster = model.poster;
  const posterNode =
    poster.kind === 'milestone' ? (
      <MilestonePoster value={poster.value} unit={poster.unit} subtitle={poster.subtitle} range={poster.range} />
    ) : (
      <SharePoster
        theme="ember"
        gradient={
          poster.theme === 'custom'
            ? {
                colors: poster.gradient,
                locations: poster.gradient.length === 3 ? [0, 0.45, 1] : [0, 1],
                start: { x: 0, y: 0 },
                end: { x: 0.7, y: 1 },
              }
            : undefined
        }
        kicker={poster.kicker}
        heroValue={poster.heroValue}
        heroUnit={poster.heroUnit}
        workoutName={poster.workoutName}
        duration={poster.duration}
        sets={poster.sets}
        prPills={poster.prPills}
      />
    );

  const faces = people.slice(0, 3);
  const overflow = Math.max(0, kudos.total - faces.length);
  // Spec Screen 2 pins the kudos-stack knockout to #17171A (light: #FFFFFF),
  // not the page background — see the light-mode delta table.
  const stackKnockout = theme.isDark ? '#17171A' : '#FFFFFF';

  return (
    <>
      <S.AuthorRow>
        <FeedAvatar person={author} size={44} ringColor={theme.color.background.base} />
        <S.AuthorText>
          <S.NameRow>
            <S.Name>{author.name}</S.Name>
            {model.isOwn ? (
              <S.BadgeSlot>
                <IdentityBadge variant="you" />
              </S.BadgeSlot>
            ) : null}
          </S.NameRow>
          <S.Subline>{`${author.handle} · ${relativeAgeLong(model.postedAtMs)}`}</S.Subline>
        </S.AuthorText>
      </S.AuthorRow>

      <S.PosterWrap>{posterNode}</S.PosterWrap>

      {model.caption ? <S.Caption>{model.caption}</S.Caption> : null}

      <S.Meta>{meta}</S.Meta>

      <S.Divider />

      <S.KudosRow>
        {faces.map((person, index) => (
          <KS.Face key={person.id} size={24} $overlap={index > 0}>
            <FeedAvatar person={person} size={24} ringColor={stackKnockout} />
          </KS.Face>
        ))}
        {overflow > 0 ? (
          <KS.Cap size={24} ringColor={stackKnockout} $overlap={faces.length > 0}>
            <KS.CapText size={24}>+{overflow}</KS.CapText>
          </KS.Cap>
        ) : null}
        <S.KudosLabel numberOfLines={1} ellipsizeMode="tail">
          {kudosLabel}
        </S.KudosLabel>
        <S.KudosCount>{kudosCountText}</S.KudosCount>
      </S.KudosRow>

      <S.ActionBarWrap>
        <FeedActionBar
          variant="detail"
          kudos={kudos.total}
          kudoed={kudos.kudoed}
          comments={commentCount}
          onKudos={() => dispatch(togglePostKudos(model.id))}
          onComment={onFocusComment}
          onShare={onShare}
        />
      </S.ActionBarWrap>

      <S.ThreadWrap>
        <CommentThread postId={model.id} postAuthorId={model.authorId} totalCount={commentCount} onReply={onReply} />
      </S.ThreadWrap>

      {model.sessionId ? (
        <S.Footer>
          {t(feedKey('feed.detail.shared_from'), 'Shared from Session Detail · {id}', { id: model.sessionId })}
        </S.Footer>
      ) : null}
    </>
  );
}
