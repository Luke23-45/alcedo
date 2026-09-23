import { HomeText } from '@/components/presentation/home/shared/home-text';
import { useAppTheme } from '@/hooks/useAppTheme';
import { fontWeight } from '@/styles/theme';
import { useTranslate } from '@tolgee/react';
import { SectionLabelWrap } from './pinned-section.styles';

/** "PINNED" section label (10/700/+1.35, theme secondary). */
export function PinnedSectionHeader() {
  const { t } = useTranslate();
  const theme = useAppTheme();
  return (
    <SectionLabelWrap>
      <HomeText
        weight={fontWeight.bold}
        tracking={1.35}
        style={{ fontSize: 10, lineHeight: 12, color: theme.isDark ? '#86868B' : '#6C6C70' }}
      >
        {t('stats.exercise_picker.pinned.header')}
      </HomeText>
    </SectionLabelWrap>
  );
}
