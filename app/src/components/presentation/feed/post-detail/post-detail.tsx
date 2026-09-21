import { useTranslate } from '@tolgee/react';
import { useAppSelectorWithArg } from '@/store';
import { useAppTheme } from '@/hooks/useAppTheme';
import { selectTopLevelComments } from '@/store/feed/comments';
import { FeedAvatar } from '../shared/feed-avatar';
import { IdentityBadge } from '../shared/identity-badge';
import { SharePoster } from '../shared/share-poster';
import { FeedActionBar } from '../shared/feed-action-bar';
import { feedKey } from '../shared/feed-i18n';
import { personById } from '../shared/people';
import { SampleBadge } from '@/components/presentation/home/shared/sample-badge';
import type { OwnPostKudos } from '../shared/own-post-kudos';
import * as KS from '../shared/kudos-stack.styles';
import { MilestonePoster } from './milestone-poster';
import { CommentThread } from './comment-thread';
import { formatKudosLabel, type PostDetailModel, type PostPosterData } from './post-models';
import { relativeAgeLong } from './relative-time';
import type { ReplyTarget } from './comment-bar';
import * as S from './post-detail.styles';

interface PostDetailProps {
  model: PostDetailModel;
  /** Local record key: 'alex' for the own post (shared with the timeline), the post id otherwise. */
  threadId: string;
  /** Resolved caption: the composer draft for the own post, the reference caption for samples. */
  caption: string | null;
  /** Resolved poster: real-session derivation for the own post, the contract block otherwise. */
  poster: PostPosterData;
  /** Locale-aware meta line, formatted by the screen. */
  meta: string;
  /** Resolved kudos: the shared read model, so the count matches the timeline. */
  kudos: OwnPostKudos;
  onToggleKudos: () => void;
  onReply: (target: ReplyTarget) => void;
  onFocusComment: () => void;
  onShare: () => void;
}

/**
 * The post itself: author row, poster, caption (real or omitted), meta,
 * kudos row, the detail action bar, and the comment thread. The screen owns
 * the nav header, the sticky composer, and the overflow menu. Mia/Jon/Sofia
 * are fictional sample posts and carry the feed's SampleBadge, like the
 * timeline's footer does.
 */
export function PostDetail({
  model,
  threadId,
  caption,
  poster,
  meta,
  kudos,
  onToggleKudos,
  onReply,
  onFocusComment,
  onShare,
}: PostDetailProps) {
  const theme = useAppTheme();
  const { t } = useTranslate();

  const author = personById(model.authorId);
  const topLevel = useAppSelectorWithArg(selectTopLevelComments, threadId);
  const commentCount = model.commentCountBase + topLevel.length;

  if (!author) {
    return null;
  }

  const kudosLabel = formatKudosLabel(kudos.faces, kudos.total, (count) =>
    t(feedKey('feed.detail.kudos.others'), 'and {count} others', { count }),
  );
  const kudosCountText =
    kudos.total === 1
      ? t(feedKey('feed.detail.kudos.count_one'), '1 kudo')
      : t(feedKey('feed.detail.kudos.count'), '{count} kudos', { count: kudos.total });

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

  const faces = kudos.faces.slice(0, 3);
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

      {caption ? <S.Caption>{caption}</S.Caption> : null}

      <S.Meta>{meta}</S.Meta>
      {model.isOwn ? null : (
        <S.SampleRow>
          <SampleBadge compact />
        </S.SampleRow>
      )}

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
          onKudos={onToggleKudos}
          onComment={onFocusComment}
          onShare={onShare}
        />
      </S.ActionBarWrap>

      <S.ThreadWrap>
        <CommentThread postId={threadId} postAuthorId={model.authorId} totalCount={commentCount} onReply={onReply} />
      </S.ThreadWrap>

      {model.sessionId ? (
        <S.Footer>
          {t(feedKey('feed.detail.shared_from'), 'Shared from Session Detail · {id}', { id: model.sessionId })}
        </S.Footer>
      ) : null}
    </>
  );
}
