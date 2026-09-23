import { useState, type RefObject } from 'react';
import type { TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslate } from '@tolgee/react';
import { useDispatch } from 'react-redux';
import { useAppTheme } from '@/hooks/useAppTheme';
import { addComment } from '@/store/feed/comments';
import { FeedAvatar } from '../shared/feed-avatar';
import { useOwnPerson } from '../shared/use-own-person';
import { feedKey } from '../shared/feed-i18n';
import { UpArrowGlyph } from './post-detail-glyphs';
import * as S from './comment-bar.styles';

export interface ReplyTarget {
  commentId: string;
  authorName: string;
}

interface CommentBarProps {
  postId: string;
  replyTarget: ReplyTarget | null;
  onCancelReply: () => void;
  inputRef: RefObject<TextInput | null>;
}

/**
 * Sticky comment composer: gradient material bar, 32pt own avatar, 38pt input
 * pill, 34pt brand-gradient send circle (50% while empty). Posts immediately
 * into the persisted comment store; a reply target nests the comment.
 */
export function CommentBar({ postId, replyTarget, onCancelReply, inputRef }: CommentBarProps) {
  const theme = useAppTheme();
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');

  // The composer's avatar is the user's real identity — never the contract's
  // fictional person. (The 'alex' authorId below is the local thread key.)
  const me = useOwnPerson();

  const canSend = text.trim().length > 0;
  const placeholder = replyTarget
    ? t(feedKey('feed.detail.comment.reply_placeholder'), 'Reply to {name}…', {
        name: replyTarget.authorName,
      })
    : t(feedKey('feed.detail.comment.placeholder'), 'Write a comment…');

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    dispatch(
      addComment({
        postId,
        authorId: 'alex',
        text: trimmed,
        parentId: replyTarget?.commentId ?? null,
      }),
    );
    setText('');
    onCancelReply();
  };

  return (
    <S.BarWrap>
      <S.BarMaterial
        colors={theme.isDark ? ['#15151A', '#0C0C10'] : ['#FBFBFD', '#F2F2F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <S.BarContent $bottomInset={insets.bottom}>
        {replyTarget ? (
          <S.ReplyStrip>
            <S.ReplyLabel numberOfLines={1} ellipsizeMode="tail">
              {t(feedKey('feed.detail.comment.replying_to'), 'Replying to {name}', {
                name: replyTarget.authorName,
              })}
            </S.ReplyLabel>
            <S.CancelButton
              onPress={onCancelReply}
              accessibilityRole="button"
              accessibilityLabel={t(feedKey('feed.detail.comment.reply_cancel'), 'Cancel reply')}
            >
              <S.CancelText>{t(feedKey('feed.detail.comment.cancel'), 'Cancel')}</S.CancelText>
            </S.CancelButton>
          </S.ReplyStrip>
        ) : null}
        <S.InputRow>
          <FeedAvatar person={me} size={32} ringColor={theme.isDark ? '#15151A' : '#FBFBFD'} />
          <S.Input
            ref={inputRef}
            value={text}
            onChangeText={setText}
            placeholder={placeholder}
            placeholderTextColor={theme.isDark ? '#6C6C70' : '#8E8E93'}
            returnKeyType="send"
            onSubmitEditing={send}
            accessibilityLabel={t(feedKey('feed.detail.comment.placeholder'), 'Write a comment…')}
          />
          <S.SendButton
            onPress={send}
            disabled={!canSend}
            accessibilityRole="button"
            accessibilityLabel={t(feedKey('feed.detail.comment.send'), 'Send comment')}
            accessibilityState={{ disabled: !canSend }}
          >
            <LinearGradient
              colors={['#FFB03A', '#FF6A3D', '#FF2D55']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.6, y: 1 }}
              style={[S.sendCircle, { opacity: canSend ? 1 : 0.5 }]}
            >
              <UpArrowGlyph size={16} color="#FFFFFF" strokeWidth={2.2} />
            </LinearGradient>
          </S.SendButton>
        </S.InputRow>
      </S.BarContent>
    </S.BarWrap>
  );
}
