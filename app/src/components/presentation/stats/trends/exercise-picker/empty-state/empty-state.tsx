import { HomeText } from '@/components/presentation/home/shared/home-text';
import { fontWeight } from '@/styles/theme';
import { useTranslate } from '@tolgee/react';
import { MagnifierGlyph } from '../picker-icons';
import { EmptyGlyphWrap, EmptyWrap } from './empty-state.styles';

/**
 * Neutral empty state for zero search/filter results.
 */
export function PickerEmptyState() {
  const { t } = useTranslate();
  return (
    <EmptyWrap>
      <EmptyGlyphWrap>
        <MagnifierGlyph color="#8E8E93" size={18} />
      </EmptyGlyphWrap>
      <HomeText
        weight={fontWeight.semibold}
        tracking={-0.2}
        style={{ fontSize: 14, lineHeight: 18, textAlign: 'center' }}
      >
        {t('stats.exercise_picker.empty.title')}
      </HomeText>
      <HomeText
        weight={fontWeight.medium}
        style={{ fontSize: 12.5, lineHeight: 17, marginTop: 6, textAlign: 'center', color: '#8E8E93' }}
      >
        {t('stats.exercise_picker.empty.body')}
      </HomeText>
    </EmptyWrap>
  );
}
