import { ReactNode } from 'react';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SectionGap, SectionLabelText } from './onboarding-section-label.styles';
import { onboardingColors } from './onboarding-tokens';

/**
 * Small-caps section label above a card, e.g. "REST AND NOTIFICATIONS".
 * `spaced` adds the 16pt gap used between card groups.
 */
export function OnboardingSectionLabel({ children, spaced = false }: { children: ReactNode; spaced?: boolean }) {
  const theme = useAppTheme();
  const colors = onboardingColors(theme, 0);

  return (
    <>
      {spaced ? <SectionGap /> : undefined}
      <SectionLabelText $color={colors.sectionLabel}>{children}</SectionLabelText>
    </>
  );
}
