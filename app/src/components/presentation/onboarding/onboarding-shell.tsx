import { ReactNode } from 'react';
import { Pager } from '@/components/presentation/foundation/pager';
import { useAppTheme } from '@/hooks/useAppTheme';
import { OnboardingBackground } from './onboarding-background';
import { OnboardingFooter } from './onboarding-footer';
import { DotsGap, FooterPad, ShellSafeArea } from './onboarding-shell.styles';

/**
 * The shared onboarding chrome: page-specific aurora background, safe-area
 * pager with the morphing page indicator, and the Previous / CTA footer.
 * Layout is entirely flex-based so it adapts to any screen size.
 */
export function OnboardingShell({
  page,
  onPageChange,
  onPrevious,
  onNext,
  onFinish,
  children,
}: {
  page: number;
  onPageChange: (page: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
  children: ReactNode;
}) {
  const theme = useAppTheme();

  return (
    <OnboardingBackground page={page}>
      <ShellSafeArea>
        <Pager
          fill
          page={page}
          onPageChange={onPageChange}
          showIndicator
          indicatorColor={theme.isDark ? '#FFFFFF' : '#1C1C1E'}
        >
          {children}
        </Pager>
        <DotsGap />
        <FooterPad>
          <OnboardingFooter isLastPage={page === 2} onPrevious={onPrevious} onNext={onNext} onFinish={onFinish} />
        </FooterPad>
      </ShellSafeArea>
    </OnboardingBackground>
  );
}
