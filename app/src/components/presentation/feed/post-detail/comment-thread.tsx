import { useTranslate } from '@tolgee/react';
import Svg, { Path } from 'react-native-svg';
import { useDispatch } from 'react-redux';
import { useAppSelectorWithArg } from '@/store';
import { selectReplies, selectTopLevelComments, toggleCommentKudos, type FeedComment } from '@/store/feed/comments';
import { useAppTheme } from '@/hooks/useAppTheme';
import { FeedAvatar } from '../shared/feed-avatar';
import { IdentityBadge } from '../shared/identity-badge';
import { HeartGlyph } from '../shared/feed-glyphs';
import { feedKey } from '../shared/feed-i18n';
import { personById } from '../shared/people';
import { relativeAge } from './relative-time';
import * as S from './comment-thread.styles';

interface CommentThreadProps {
  postId: string;
  /** Person id of the post author — their comments get the AUTHOR badge. */
  postAuthorId: string;
  /** Total top-level count shown in the header (contract base + stored). */
  totalCount: number;
  onReply: (target: { commentId: string; authorName: string }) => void;
}

/**
 * The comment thread: "N COMMENTS" header, top-level comments oldest-first,
 * nested replies under their parent with the rounded elbow connector, and a
 * neutral empty state for reference posts (never invented comments).
 */
export function CommentThread({ postId, postAuthorId, totalCount, onReply }: CommentThreadProps) {
  const { t } = useTranslate();
  const comments = useAppSelectorWithArg(selectTopLevelComments, postId);

  return (
    <S.Thread>
      <S.Header>{t(feedKey('feed.detail.comments.header'), '{count} comments', { count: totalCount })}</S.Header>
      {comments.length === 0 ? (
        <S.EmptyWrap>
          <S.EmptyTitle>{t(feedKey('feed.detail.comments.empty.title'), 'No comments yet')}</S.EmptyTitle>
          <S.EmptyBody>
            {t(feedKey('feed.detail.comments.empty.body'), 'Be the first to share your thoughts.')}
          </S.EmptyBody>
        </S.EmptyWrap>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            postAuthorId={postAuthorId}
            onReply={onReply}
          />
        ))
      )}
    </S.Thread>
  );
}

interface CommentItemProps {
  comment: FeedComment;
  postId: string;
  postAuthorId: string;
  nested?: boolean;
  onReply: (target: { commentId: string; authorName: string }) => void;
}

function CommentItem({ comment, postId, postAuthorId, nested = false, onReply }: CommentItemProps) {
  const theme = useAppTheme();
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const replies = useAppSelectorWithArg(selectReplies, comment.id);

  const person = personById(comment.authorId);
  if (!person) {
    return null;
  }
  const authorName = person.name;
  const isPostAuthor = comment.authorId === postAuthorId;
  const avatarSize = nested ? 24 : 28;

  const kudoedHeart = theme.isDark ? '#FF2D55' : '#D70015';
  const idleHeart = theme.isDark ? '#86868B' : '#6E6E73';

  const actions = (
    <S.ActionsRow>
      {comment.kudos > 0 || comment.kudoed ? (
        <>
          <S.KudosButton
            onPress={() => dispatch(toggleCommentKudos(comment.id))}
            accessibilityRole="button"
            accessibilityState={{ selected: comment.kudoed }}
            accessibilityLabel={t(feedKey('feed.detail.comment.a11y.kudos'), `Kudos, ${comment.kudos}`, {
              count: comment.kudos,
            })}
          >
            <HeartGlyph size={13} color={comment.kudoed ? kudoedHeart : idleHeart} filled={comment.kudoed} />
            <S.ActionCount $kudoed={comment.kudoed}>{comment.kudos}</S.ActionCount>
          </S.KudosButton>
          <S.Separator $kudoed={comment.kudoed}>·</S.Separator>
        </>
      ) : null}
      <S.ReplyButton
        onPress={() => onReply({ commentId: comment.id, authorName })}
        accessibilityRole="button"
        accessibilityLabel={t(feedKey('feed.detail.comment.a11y.reply_to'), `Reply to ${authorName}`, {
          name: authorName,
        })}
      >
        <S.ReplyText>{t(feedKey('feed.detail.comment.reply'), 'Reply')}</S.ReplyText>
      </S.ReplyButton>
    </S.ActionsRow>
  );

  const body = (
    <S.Row>
      <FeedAvatar person={person} size={avatarSize} ringColor={theme.color.background.base} />
      <S.Content>
        <S.NameRow>
          <S.Name numberOfLines={1} ellipsizeMode="tail">
            {authorName}
          </S.Name>
          {isPostAuthor ? (
            <S.BadgeSlot>
              <IdentityBadge variant="author" />
            </S.BadgeSlot>
          ) : null}
          <S.Time>{relativeAge(comment.createdAt)}</S.Time>
        </S.NameRow>
        <S.Body>{comment.text}</S.Body>
        {actions}
      </S.Content>
    </S.Row>
  );

  if (!nested) {
    return (
      <S.CommentBlock>
        {body}
        {replies.map((reply) => (
          <S.ReplyBlock key={reply.id}>
            <S.Elbow pointerEvents="none">
              <Svg width={16} height={37}>
                <Path
                  d="M1 0 V30 Q1 36 7 36 H15"
                  fill="none"
                  stroke={theme.isDark ? 'rgba(255,255,255,0.14)' : 'rgba(60,60,67,0.20)'}
                  strokeWidth={1.6}
                  strokeLinecap="round"
                />
              </Svg>
            </S.Elbow>
            <CommentItem comment={reply} postId={postId} postAuthorId={postAuthorId} nested onReply={onReply} />
          </S.ReplyBlock>
        ))}
      </S.CommentBlock>
    );
  }

  return body;
}
