import { HomeText } from '@/components/presentation/home/shared/home-text';
import { fontWeight } from '@/styles/theme';
import { useTranslate } from '@tolgee/react';
import { CancelPress, Grabber, HeaderWrap, TitleRow } from './sheet-header.styles';

/**
 * Sheet chrome: 36×5 grabber, "Cancel" (16/400/−.3, dismisses) left,
 * "Choose Exercise" (16/600/−.35) centered.
 */
export function SheetHeader({ onCancel }: { onCancel: () => void }) {
  const { t } = useTranslate();
  return (
    <HeaderWrap>
      <Grabber />
      <TitleRow>
        <HomeText
          weight={fontWeight.semibold}
          tracking={-0.35}
          style={{ fontSize: 16, lineHeight: 22, textAlign: 'center' }}
        >
          {t('stats.exercise_picker.title')}
        </HomeText>
        <CancelPress
          onPress={onCancel}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel={t('stats.exercise_picker.cancel.button')}
        >
          <HomeText
            weight={fontWeight.regular}
            tracking={-0.3}
            style={{ fontSize: 16, lineHeight: 22, color: '#8E8E93' }}
          >
            {t('stats.exercise_picker.cancel.button')}
          </HomeText>
        </CancelPress>
      </TitleRow>
    </HeaderWrap>
  );
}
