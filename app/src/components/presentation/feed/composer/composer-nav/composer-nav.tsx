import { useAppTheme } from '@/hooks/useAppTheme';
import { useComposerT } from '../composer-i18n';
import * as S from './composer-nav.styles';

interface ComposerNavProps {
  onCancel: () => void;
  onShare: () => void;
  /** The Share CTA is enabled only when a session is attached. */
  canShare: boolean;
}

/**
 * Composer nav: Cancel · New Post · Share. No iOS chrome is faked — this row
 * sits under the real status bar and draws only the three spec'd buttons.
 */
export function ComposerNav({ onCancel, onShare, canShare }: ComposerNavProps) {
  const theme = useAppTheme();
  const t = useComposerT();
  const cancelColor = theme.isDark ? '#8E8E93' : '#007AFF';
  const shareColor = theme.isDark ? '#FF9F0A' : '#007AFF';

  return (
    <S.NavRow>
      <S.NavButton
        onPress={onCancel}
        accessibilityRole="button"
        accessibilityLabel={t('feed.composer.nav.cancel', 'Cancel')}
      >
        <S.NavButtonText $color={cancelColor} $tone="regular">
          {t('feed.composer.nav.cancel', 'Cancel')}
        </S.NavButtonText>
      </S.NavButton>
      <S.NavTitle>{t('feed.composer.nav.title', 'New Post')}</S.NavTitle>
      <S.NavButton
        onPress={onShare}
        disabled={!canShare}
        accessibilityRole="button"
        accessibilityLabel={t('feed.composer.nav.share', 'Share')}
        $dimmed={!canShare}
      >
        <S.NavButtonText $color={shareColor} $tone="semibold">
          {t('feed.composer.nav.share', 'Share')}
        </S.NavButtonText>
      </S.NavButton>
    </S.NavRow>
  );
}
