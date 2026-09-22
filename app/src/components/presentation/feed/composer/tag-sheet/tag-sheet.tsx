import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { FeedAvatar } from '../../shared/feed-avatar';
import { CheckGlyph } from '../../shared/feed-glyphs';
import { tagFeedPerson, type TagPerson } from '../../shared/tag-person';
import { ComposerSheet } from '../composer-sheet/composer-sheet';
import { useComposerT } from '../composer-i18n';
import { useAppTheme } from '@/hooks/useAppTheme';
import * as S from './tag-sheet.styles';

interface TagSheetProps {
  visible: boolean;
  taggedIds: string[];
  /**
   * Real mutual friends eligible for tagging. Empty renders an honest empty
   * state — never sample people.
   */
  people: TagPerson[];
  onApply: (taggedIds: string[]) => void;
  onClose: () => void;
}

/**
 * Friend picker: real mutual friends. Multi-select with a draft — Done
 * applies, backdrop dismiss keeps the previous tags. Tags drafted for people
 * who are no longer mutual friends are dropped when the sheet opens.
 */
export function TagSheet({ visible, taggedIds, people, onApply, onClose }: TagSheetProps) {
  const theme = useAppTheme();
  const t = useComposerT();
  const [draft, setDraft] = useState<string[]>(taggedIds);

  useEffect(() => {
    if (visible) {
      const eligible = new Set(people.map((person) => person.id));
      setDraft(taggedIds.filter((id) => eligible.has(id)));
    }
  }, [visible, taggedIds, people]);

  const toggle = (id: string) => setDraft((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <ComposerSheet
      visible={visible}
      onClose={onClose}
      title={t('feed.composer.tag.sheet.title', 'Tag friends')}
      doneLabel={t('feed.composer.tag.sheet.done', 'Done')}
      onDone={() => {
        onApply(draft);
        onClose();
      }}
    >
      {people.length === 0 ? (
        <S.EmptyWrap>
          <S.EmptyTitle>{t('feed.composer.tag.sheet.empty', 'No mutual friends yet')}</S.EmptyTitle>
          <S.EmptyDetail>
            {t('feed.composer.tag.sheet.empty.detail', 'People you follow who follow you back will appear here.')}
          </S.EmptyDetail>
        </S.EmptyWrap>
      ) : (
        <S.Rows>
          {people.map((tagPerson) => {
            const person = tagFeedPerson(tagPerson);
            const selected = draft.includes(person.id);
            return (
              <S.Row
                key={person.id}
                onPress={() => toggle(person.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={person.name}
              >
                <S.AvatarSlot>
                  <FeedAvatar person={person} size={36} ringColor={theme.isDark ? '#1F1F23' : '#FFFFFF'} />
                </S.AvatarSlot>
                <S.RowText>
                  <S.RowLabel>{person.name}</S.RowLabel>
                </S.RowText>
                <S.SelectBadge $selected={selected}>
                  {selected ? (
                    <>
                      <LinearGradient
                        colors={['#FFB03A', '#FF6A3D', '#FF2D55']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.6, y: 1 }}
                        style={S.fill}
                      />
                      <CheckGlyph size={11} color="#FFFFFF" strokeWidth={2.4} />
                    </>
                  ) : null}
                </S.SelectBadge>
              </S.Row>
            );
          })}
        </S.Rows>
      )}
    </ComposerSheet>
  );
}
