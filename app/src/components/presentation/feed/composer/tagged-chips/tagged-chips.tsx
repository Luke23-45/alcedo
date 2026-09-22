import { FeedAvatar } from '../../shared/feed-avatar';
import { tagFeedPerson, type TagPerson } from '../../shared/tag-person';
import { CloseGlyph, PlusGlyph } from '../composer-glyphs';
import { useComposerT } from '../composer-i18n';
import { useAppTheme } from '@/hooks/useAppTheme';
import * as S from './tagged-chips.styles';

interface TaggedChipsProps {
  taggedIds: string[];
  /** Real mutual friends, to resolve tagged ids to names. */
  people: TagPerson[];
  onRemove: (id: string) => void;
  onAdd: () => void;
}

/**
 * TAGGED section — rendered only when at least one friend is tagged.
 * Tapping a chip removes the tag; "+ Add" reopens the friend picker.
 * Ids that no longer resolve to a mutual friend are dropped, not invented.
 */
export function TaggedChips({ taggedIds, people, onRemove, onAdd }: TaggedChipsProps) {
  const theme = useAppTheme();
  const t = useComposerT();

  const tagged = taggedIds
    .map((id) => people.find((person) => person.id === id))
    .filter((person): person is TagPerson => !!person)
    .map(tagFeedPerson);

  if (tagged.length === 0) {
    return null;
  }

  return (
    <S.Section>
      <S.SectionHeader>{t('feed.composer.tagged.title', 'TAGGED')}</S.SectionHeader>
      <S.ChipRow>
        {tagged.map((person) => {
          return (
            <S.TagChip
              key={person.id}
              onPress={() => onRemove(person.id)}
              accessibilityRole="button"
              accessibilityLabel={t('feed.composer.tag.remove', 'Remove {name}', { name: person.name })}
              hitSlop={{ top: 8, bottom: 8 }}
            >
              <S.AvatarSlot>
                <FeedAvatar person={person} size={18} ringColor="transparent" />
              </S.AvatarSlot>
              <S.TagName>{person.name}</S.TagName>
              <CloseGlyph size={10} color={theme.isDark ? '#8E8E93' : '#6E6E73'} strokeWidth={1.5} />
            </S.TagChip>
          );
        })}
        <S.AddChip
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel={t('feed.composer.tag.add', 'Add')}
          hitSlop={{ top: 8, bottom: 8 }}
        >
          <PlusGlyph size={11} color="#FF9F0A" strokeWidth={1.8} />
          <S.AddLabel>{t('feed.composer.tag.add', 'Add')}</S.AddLabel>
        </S.AddChip>
      </S.ChipRow>
    </S.Section>
  );
}
