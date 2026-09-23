import { useTranslate } from '@tolgee/react';
import { useAppTheme } from '@/hooks/useAppTheme';
import { CtaWrap, FooterRow, PreviousLabel, PreviousPressable } from './onboarding-footer.styles';
import { onboardingColors } from './onboarding-tokens';
import { BrandButton } from '../workout/session/brand-button/brand-button';

/**
 * Onboarding footer from the mocks: `Previous` text action on the left and a
 * 177×50 brand pill (`Next`, or `Get started` on the last page) on the right.
 * Flex layout keeps it responsive; nothing is absolutely positioned.
 */
export function OnboardingFooter({
  isLastPage,
  onPrevious,
  onNext,
  onFinish,
  testID,
}: {
  isLastPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
  testID?: string;
}) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const colors = onboardingColors(theme, 0);

  return (
    <FooterRow testID={testID}>
      <PreviousPressable onPress={onPrevious} accessibilityRole="button">
        <PreviousLabel $color={colors.secondary}>{t('generic.previous.button', 'Previous')}</PreviousLabel>
      </PreviousPressable>
      <CtaWrap>
        <BrandButton
          label={isLastPage ? t('onboarding.get_started.button', 'Get started') : t('generic.next.button', 'Next')}
          onPress={isLastPage ? onFinish : onNext}
          height={50}
          radius={25}
          fontSize={15}
          fontWeight={600}
          letterSpacing={-0.3}
          testID={isLastPage ? 'onboarding-finish' : 'onboarding-next'}
        />
      </CtaWrap>
    </FooterRow>
  );
}
