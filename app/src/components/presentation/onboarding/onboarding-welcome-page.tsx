import { useTranslate } from '@tolgee/react';
import { KingfisherMark } from './kingfisher-mark';
import { OnboardingPageHeader } from './onboarding-page-header';
import { BirdWrap, PageBody, PageScroll, WelcomeBottomSpacer, WelcomeTitlePad } from './onboarding-pages.styles';

/** Page 1: the kingfisher mark, welcome title and subtitle. */
export function OnboardingWelcomePage() {
  const { t } = useTranslate();

  return (
    <PageBody>
      <PageScroll>
        <BirdWrap>
          <KingfisherMark style={{ width: '100%' }} />
        </BirdWrap>
        <WelcomeTitlePad>
          <OnboardingPageHeader
            large
            topPad={0}
            title={t('onboarding.welcome.title', 'Welcome to Alcedo!')}
            subtitle={t('onboarding.welcome.subtitle', 'Let’s get a few things set up')}
          />
        </WelcomeTitlePad>
        <WelcomeBottomSpacer />
      </PageScroll>
    </PageBody>
  );
}
