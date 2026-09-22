import { LinearGradient } from 'expo-linear-gradient';
import { FeedAvatar } from '../../shared/feed-avatar';
import { useOwnPerson } from '../../shared/use-own-person';
import type { TagPerson } from '../../shared/tag-person';
import { SharePoster } from '../../shared/share-poster';
import type { ComposerPost } from '@/store/feed/composer-posts';
import type { ComposerSessionData } from '../composer-data';
import { formatPostAge } from '../composer-data';
import { useComposerT } from '../composer-i18n';
import type { PosterProps } from '../poster-props';
import { useAppTheme } from '@/hooks/useAppTheme';
import * as S from './composer-post-card.styles';

interface ComposerPostCardProps {
  post: ComposerPost;
  /** Re-derived from the session at render time; null when the session is gone. */
  data: ComposerSessionData | null;
  poster: PosterProps | null;
  now: number;
  /** Real mutual friends, to resolve tagged ids to names. */
  people: TagPerson[];
  /** preferredLanguage; undefined means the system locale for the age date. */
  locale?: string;
}

/**
 * A published composer post in the timeline. The poster goes through the same
 * toggle rule as the composer preview, so what the user saw is what the feed
 * shows. Posts whose session was deleted render nothing — never a fake card.
 * Tagged ids that no longer resolve to a mutual friend are dropped, not
 * invented.
 */
export function ComposerPostCard({ post, data, poster, now, people, locale }: ComposerPostCardProps) {
  const theme = useAppTheme();
  const t = useComposerT();
  const person = useOwnPerson();

  if (!data || !poster) {
    return null;
  }

  const taggedNames = post.taggedIds
    .map((id) => people.find((p) => p.id === id)?.name)
    .filter((name): name is string => !!name);

  return (
    <S.CardShadow>
      <S.Card>
        <LinearGradient
          colors={theme.isDark ? ['#1F1F23', '#17171A', '#131316'] : ['#FFFFFF', '#FAFAFC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.45, y: 1 }}
          style={S.fill}
        />
        <S.HeaderRow>
          <FeedAvatar person={person} size={36} ringColor={theme.isDark ? '#17171A' : '#FFFFFF'} />
          <S.HeaderText>
            <S.AuthorName>{person.name}</S.AuthorName>
            <S.Age>· {formatPostAge(post.postedAt, now, t, locale)}</S.Age>
          </S.HeaderText>
        </S.HeaderRow>
        {post.caption.length > 0 ? <S.Caption>{post.caption}</S.Caption> : null}
        <S.PosterSlot>
          <SharePoster
            theme={poster.theme}
            kicker={poster.kicker}
            heroValue={poster.heroValue}
            heroUnit={poster.heroUnit}
            workoutName={poster.workoutName}
            duration={poster.duration}
            sets={poster.sets}
            prPills={poster.prPills}
          />
        </S.PosterSlot>
        {taggedNames.length > 0 ? (
          <S.TaggedLine>
            {t('feed.composer.tagged.with', 'with {names}', { names: taggedNames.join(', ') })}
          </S.TaggedLine>
        ) : null}
        <S.CardEdge />
      </S.Card>
    </S.CardShadow>
  );
}
