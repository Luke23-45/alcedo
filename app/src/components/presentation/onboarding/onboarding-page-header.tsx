import { ReactNode } from 'react';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HeaderSubtitle, HeaderTitle, HeaderWrap } from './onboarding-page-header.styles';
import { onboardingColors } from './onboarding-tokens';

/**
 * Centred page title + subtitle from the mocks. `large` selects the welcome
 * page's 28/14pt treatment; other pages use 24/13pt.
 */
export function OnboardingPageHeader({
  title,
  subtitle,
  large = false,
  topPad = 32,
}: {
  title: ReactNode;
  subtitle: ReactNode;
  large?: boolean;
  topPad?: number;
}) {
  const theme = useAppTheme();
  const colors = onboardingColors(theme, 0);

  return (
    <HeaderWrap $topPad={topPad}>
      <HeaderTitle $large={large}>{title}</HeaderTitle>
      <HeaderSubtitle $large={large} $color={colors.secondary}>
        {subtitle}
      </HeaderSubtitle>
    </HeaderWrap>
  );
}
