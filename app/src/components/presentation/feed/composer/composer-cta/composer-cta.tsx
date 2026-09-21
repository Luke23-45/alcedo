import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useComposerT } from '../composer-i18n';
import type { ComposerAudience, ComposerStatKey } from '../composer-types';
import { AUDIENCE_FRIEND_COUNT } from '../composer-types';
import { countHiddenStats } from '../poster-props';
import * as S from './composer-cta.styles';

interface ComposerCtaProps {
  canShare: boolean;
  audience: ComposerAudience;
  visible: Record<ComposerStatKey, boolean>;
  onShare: () => void;
}

/**
 * Sticky share CTA with the live caption: audience + hidden-stat count.
 * Disabled (50% opacity) until a session is attached — a control that cannot
 * act must not look like it can.
 */
export function ComposerCta({ canShare, audience, visible, onShare }: ComposerCtaProps) {
  const theme = useAppTheme();
  const t = useComposerT();
  const hidden = countHiddenStats(visible);

  const caption = !canShare
    ? t('feed.composer.cta.caption.none', 'Attach a session to share')
    : audience === 'friends'
      ? t(
          'feed.composer.cta.caption.friends',
          `Sharing with ${AUDIENCE_FRIEND_COUNT} friends · {hidden} stats hidden`,
          { hidden },
        )
      : audience === 'public'
        ? t('feed.composer.cta.caption.public', 'Sharing publicly · {hidden} stats hidden', {
            hidden,
          })
        : t('feed.composer.cta.caption.private', 'Only you can see this · {hidden} stats hidden', {
            hidden,
          });

  return (
    <S.BarWrap>
      <S.BarMaterial
        colors={theme.isDark ? ['#15151A', '#0C0C10'] : ['#FBFBFD', '#F2F2F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <S.CtaShadow $dimmed={!canShare}>
        <S.CtaButton
          onPress={onShare}
          disabled={!canShare}
          accessibilityRole="button"
          accessibilityLabel={t('feed.composer.cta.share', 'Share to Feed')}
        >
          <LinearGradient
            colors={['#FFB03A', '#FF6A3D', '#FF2D55']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.6, y: 1 }}
            style={S.fill}
          />
          <S.CtaGloss
            colors={['rgba(255,255,255,0.32)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <S.CtaLabel>{t('feed.composer.cta.share', 'Share to Feed')}</S.CtaLabel>
          <S.CtaEdge />
        </S.CtaButton>
      </S.CtaShadow>
      <S.CtaCaption>{caption}</S.CtaCaption>
    </S.BarWrap>
  );
}
