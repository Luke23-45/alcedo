import { useTranslate } from '@tolgee/react';
import { KingfisherMark } from './kingfisher-mark';
import { OnboardingPageHeader } from './onboarding-page-header';
import { OnboardingReveal } from './onboarding-reveal';
import { BirdWrap, PageBody, PageScroll, WelcomeBottomSpacer, WelcomeTitlePad } from './onboarding-pages.styles';

/**
 * Page 1: the kingfisher mark, welcome title and subtitle.
 *
 * During the launch handoff (`revealed === false`) the mark renders frozen at
 * rest — pixel-identical to the launch image — and the title stays hidden. Once
 * the splash hides, the mark comes alive and the title rises into place.
 */
export function OnboardingWelcomePage({ revealed = true }: { revealed?: boolean }) {
  const { t } = useTranslate();

  return (
    <PageBody>
      <PageScroll>
        <BirdWrap>
          <KingfisherMark frozen={!revealed} style={{ width: '100%' }} />
        </BirdWrap>
        <OnboardingReveal revealed={revealed} delay={150}>
          <WelcomeTitlePad>
            <OnboardingPageHeader
              large
              topPad={0}
              title={t('onboarding.welcome.title', 'Welcome to Alcedo!')}
              subtitle={t('onboarding.welcome.subtitle', 'Let’s get a few things set up')}
            />
          </WelcomeTitlePad>
        </OnboardingReveal>
        <WelcomeBottomSpacer />
      </PageScroll>
    </PageBody>
  );
}
