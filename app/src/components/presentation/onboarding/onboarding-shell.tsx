import { ReactNode } from 'react';
import { Pager } from '@/components/presentation/foundation/pager';
import { useAppTheme } from '@/hooks/useAppTheme';
import { OnboardingBackground } from './onboarding-background';
import { OnboardingFooter } from './onboarding-footer';
import { OnboardingReveal } from './onboarding-reveal';
import { DotsGap, FooterPad, ShellSafeArea } from './onboarding-shell.styles';

/**
 * The shared onboarding chrome: page-specific aurora background, safe-area
 * pager with the morphing page indicator, and the Previous / CTA footer.
 * Layout is entirely flex-based so it adapts to any screen size.
 *
 * During the launch handoff (`revealed === false`) the footer stays hidden so
 * the first live frame matches the launch image; it rises in after the splash
 * hides.
 */
export function OnboardingShell({
  page,
  onPageChange,
  onPrevious,
  onNext,
  onFinish,
  revealed = true,
  children,
}: {
  page: number;
  onPageChange: (page: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
  revealed?: boolean;
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
        <OnboardingReveal revealed={revealed} delay={350}>
          <FooterPad>
            <OnboardingFooter isLastPage={page === 2} onPrevious={onPrevious} onNext={onNext} onFinish={onFinish} />
          </FooterPad>
        </OnboardingReveal>
      </ShellSafeArea>
    </OnboardingBackground>
  );
}
