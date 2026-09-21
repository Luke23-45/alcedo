import { Path, Svg } from 'react-native-svg';
import { useTranslate } from '@tolgee/react';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';
import { CtaHit, CtaLabel, EmptyBody, EmptyInner, EmptyTitle, GlyphWrap, ctaFill } from './trends-empty.styles';

/**
 * First-run empty state for the Trends overview. The stats store reports
 * "No sessions" as an error; this renders instead of the error chrome —
 * neutral and forward-looking, never shaming, with a real CTA into the
 * workout tab.
 */
export function TrendsEmpty({ onStartWorkout }: { onStartWorkout: () => void }) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;

  return (
    <HomeCard hero pad={0}>
      <EmptyInner>
        <GlyphWrap $bg={dark ? 'rgba(255,106,61,0.14)' : 'rgba(255,106,61,0.10)'}>
          <Svg width={30} height={30} viewBox="0 0 30 30">
            <Path
              d="M4 24 L11 15 L16 19 L26 7"
              fill="none"
              stroke="#FF6A3D"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M20 7 H26 V13"
              fill="none"
              stroke="#FF6A3D"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </GlyphWrap>
        <EmptyTitle weight={fontWeight.semibold} tracking={-0.4}>
          {t('trends.empty.title')}
        </EmptyTitle>
        <EmptyBody weight={fontWeight.medium} tone="secondary">
          {t('trends.empty.body')}
        </EmptyBody>
        <CtaHit onPress={onStartWorkout} accessibilityRole="button" accessibilityLabel={t('trends.empty.cta')}>
          <HomeGradient variant="brand" style={ctaFill}>
            <CtaLabel>{t('trends.empty.cta')}</CtaLabel>
          </HomeGradient>
        </CtaHit>
      </EmptyInner>
    </HomeCard>
  );
}
