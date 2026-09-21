import { useTranslate } from '@tolgee/react';
import { feedKey } from './feed-i18n';
import { useAppTheme } from '@/hooks/useAppTheme';
import { BubbleGlyph, HeartGlyph, ShareGlyph } from './feed-glyphs';
import * as S from './feed-action-bar.styles';

export type FeedActionBarVariant = 'card' | 'detail';

interface FeedActionBarProps {
  variant: FeedActionBarVariant;
  kudos: number;
  kudoed: boolean;
  comments: number;
  onKudos: () => void;
  onComment: () => void;
  onShare: () => void;
}

/**
 * Feed action bar in two variants.
 *
 * Card: tri-split thirds (heart + count · bubble + count · share), each a
 * 44pt-minimum touch target. Detail: three 115×48 pills labelled
 * Kudos / Comment / Share.
 *
 * The kudo'd state is legible without colour alone: the heart switches from
 * outline to filled and the count/label switches from 600 to 700 along with
 * the tint change.
 */
export function FeedActionBar({ variant, kudos, kudoed, comments, onKudos, onComment, onShare }: FeedActionBarProps) {
  const theme = useAppTheme();
  const { t } = useTranslate();

  const idleIcon = theme.isDark ? '#98989F' : '#6E6E73';
  const kudoedIcon = theme.isDark ? '#FF2D55' : '#D70015';

  if (variant === 'detail') {
    return (
      <S.DetailRow>
        <S.Pill
          onPress={onKudos}
          accessibilityRole="button"
          accessibilityState={{ selected: kudoed }}
          accessibilityLabel={`${t(feedKey('feed.shared.action.kudos'))}, ${kudos}`}
        >
          <HeartGlyph size={20} color={kudoed ? kudoedIcon : idleIcon} filled={kudoed} />
          <S.PillLabel $kudoed={kudoed}>{t(feedKey('feed.shared.action.kudos'))}</S.PillLabel>
        </S.Pill>
        <S.Pill
          onPress={onComment}
          accessibilityRole="button"
          accessibilityLabel={`${t(feedKey('feed.shared.action.comment'))}, ${comments}`}
        >
          <BubbleGlyph size={20} color={idleIcon} />
          <S.PillLabel $kudoed={false}>{t(feedKey('feed.shared.action.comment'))}</S.PillLabel>
        </S.Pill>
        <S.Pill
          onPress={onShare}
          accessibilityRole="button"
          accessibilityLabel={t(feedKey('feed.shared.action.share'))}
        >
          <ShareGlyph size={18} color={idleIcon} />
          <S.PillLabel $kudoed={false}>{t(feedKey('feed.shared.action.share'))}</S.PillLabel>
        </S.Pill>
      </S.DetailRow>
    );
  }

  return (
    <S.CardRow>
      <S.CardCell
        onPress={onKudos}
        accessibilityRole="button"
        accessibilityState={{ selected: kudoed }}
        accessibilityLabel={`${t(feedKey('feed.shared.action.kudos'))}, ${kudos}`}
      >
        <HeartGlyph size={20} color={kudoed ? kudoedIcon : idleIcon} filled={kudoed} />
        <S.CardCount $kudoed={kudoed}>{kudos}</S.CardCount>
      </S.CardCell>
      <S.CardCell
        onPress={onComment}
        accessibilityRole="button"
        accessibilityLabel={`${t(feedKey('feed.shared.action.comment'))}, ${comments}`}
      >
        <BubbleGlyph size={20} color={idleIcon} />
        <S.CardCount $kudoed={false}>{comments}</S.CardCount>
      </S.CardCell>
      <S.CardCell
        onPress={onShare}
        accessibilityRole="button"
        accessibilityLabel={t(feedKey('feed.shared.action.share'))}
      >
        <ShareGlyph size={18} color={idleIcon} />
      </S.CardCell>
    </S.CardRow>
  );
}
