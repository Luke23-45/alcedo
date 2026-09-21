import { useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { useAppTheme } from '@/hooks/useAppTheme';
import { CardioExerciseBlueprint, WeightedExerciseBlueprint } from '@/models/blueprint-models';
import { Card, LinkGlyph, SubHead } from '../editor-primitives';
import { clampNotes, isValidHttpUrl, linkGlyphColor, NOTES_MAX_LENGTH } from '../exercise-editor-logic';
import {
  DetailPad,
  FieldInput,
  LinkGlyphWrap,
  LinkWell,
  NotesWell,
  SubHeadRow,
  SubHeadCounter,
} from './detail-card.styles';

export function DetailCard({
  exercise,
  onChange,
}: {
  exercise: WeightedExerciseBlueprint | CardioExerciseBlueprint;
  onChange: (exercise: WeightedExerciseBlueprint | CardioExerciseBlueprint) => void;
}) {
  const theme = useAppTheme();
  const { t } = useTranslate();
  const [focused, setFocused] = useState<'notes' | 'link' | null>(null);
  const linkValid = isValidHttpUrl(exercise.link);

  return (
    <Card>
      <DetailPad>
        <SubHeadRow>
          <SubHead>{t('plan.notes.label', 'Notes')}</SubHead>
          <SubHeadCounter>
            {t('exercise.editor.notes.count', '{count} / {max}', {
              count: exercise.notes.length,
              max: NOTES_MAX_LENGTH,
            })}
          </SubHeadCounter>
        </SubHeadRow>
        <NotesWell $focused={focused === 'notes'}>
          <FieldInput
            multiline
            value={exercise.notes}
            onChangeText={(text) => onChange(exercise.with({ notes: clampNotes(text) }))}
            placeholder={t('exercise.editor.notes.placeholder', 'How should this feel? Cues, tempo, setup…')}
            placeholderTextColor={theme.isDark ? '#6C6C70' : '#8E8E93'}
            maxLength={NOTES_MAX_LENGTH}
            textAlignVertical="top"
            onFocus={() => setFocused('notes')}
            onBlur={() => setFocused(null)}
            accessibilityLabel={t('plan.notes.label', 'Notes')}
          />
        </NotesWell>
        <SubHeadRow>
          <SubHead>{t('exercise.editor.link.label', 'External link')}</SubHead>
        </SubHeadRow>
        <LinkWell $focused={focused === 'link'}>
          <LinkGlyphWrap>
            <LinkGlyph color={linkGlyphColor(exercise.link)} />
          </LinkGlyphWrap>
          <FieldInput
            value={exercise.link}
            onChangeText={(text) => onChange(exercise.with({ link: text }))}
            placeholder="https://"
            placeholderTextColor={theme.isDark ? '#6C6C70' : '#8E8E93'}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            onFocus={() => setFocused('link')}
            onBlur={() => setFocused(null)}
            accessibilityLabel={t('exercise.editor.link.label', 'External link')}
            accessibilityHint={
              linkValid
                ? t('exercise.editor.link.valid', 'Valid link')
                : t('exercise.editor.link.invalid', 'Enter a valid https link')
            }
          />
        </LinkWell>
      </DetailPad>
    </Card>
  );
}
