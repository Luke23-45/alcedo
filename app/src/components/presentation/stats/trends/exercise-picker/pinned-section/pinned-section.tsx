import { HomeText } from '@/components/presentation/home/shared/home-text';
import { fontWeight } from '@/styles/theme';
import { useTranslate } from '@tolgee/react';
import { SectionLabelWrap } from './pinned-section.styles';

/** "PINNED" section label (10/700/+1.35, #86868B). */
export function PinnedSectionHeader() {
  const { t } = useTranslate();
  return (
    <SectionLabelWrap>
      <HomeText
        weight={fontWeight.bold}
        tracking={1.35}
        style={{ fontSize: 10, lineHeight: 12, color: '#86868B' }}
      >
        {t('stats.exercise_picker.pinned.header')}
      </HomeText>
    </SectionLabelWrap>
  );
}
