import { FeedAvatar } from '../../shared/feed-avatar';
import { PEOPLE } from '../../shared/people';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useComposerT } from '../composer-i18n';
import type { ComposerAudience } from '../composer-types';
import { ChevronDownGlyph, LockGlyph } from '../composer-glyphs';
import * as S from './author-row.styles';

interface AuthorRowProps {
  audience: ComposerAudience;
  onAudiencePress: () => void;
}

const AUDIENCE_KEY: Record<ComposerAudience, { key: string; fallback: string }> = {
  friends: { key: 'feed.composer.audience.friends', fallback: 'Friends' },
  public: { key: 'feed.composer.audience.public', fallback: 'Public' },
  private: { key: 'feed.composer.audience.private', fallback: 'Private' },
};

export function AuthorRow({ audience, onAudiencePress }: AuthorRowProps) {
  const theme = useAppTheme();
  const t = useComposerT();
  const person = PEOPLE.alex!;
  const { key, fallback } = AUDIENCE_KEY[audience];

  return (
    <S.AuthorRow>
      <S.AvatarSlot>
        <FeedAvatar person={person} size={36} ringColor={theme.isDark ? '#17171A' : '#FFFFFF'} />
      </S.AvatarSlot>
      <S.AuthorText>
        <S.AuthorName>{person.name}</S.AuthorName>
        <S.AudiencePill
          onPress={onAudiencePress}
          accessibilityRole="button"
          accessibilityLabel={t(key, fallback)}
          hitSlop={{ top: 11, bottom: 11, left: 8, right: 8 }}
        >
          <LockGlyph size={11} color={theme.isDark ? '#C7C7CC' : '#3C3C43'} />
          <S.AudienceLabel>{t(key, fallback)}</S.AudienceLabel>
          <ChevronDownGlyph size={10} color="#8E8E93" />
        </S.AudiencePill>
      </S.AuthorText>
    </S.AuthorRow>
  );
}
