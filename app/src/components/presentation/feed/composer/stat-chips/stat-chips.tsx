import { CheckGlyph } from '../../shared/feed-glyphs';
import { HollowRingGlyph } from '../composer-glyphs';
import { useComposerT } from '../composer-i18n';
import { STAT_DEFS, type ComposerStatKey } from '../composer-types';
import { countVisibleStats } from '../poster-props';
import { useAppTheme } from '@/hooks/useAppTheme';
import * as S from './stat-chips.styles';

interface StatChipsProps {
  visible: Record<ComposerStatKey, boolean>;
  onToggle: (key: ComposerStatKey) => void;
}

/**
 * The eight stat toggle chips. Green check = on, hollow ring = off.
 * They drive the preview, the poster, and the "N stats hidden" caption.
 * 28pt tall with an 8pt hitSlop so the touch target reaches 44pt.
 */
export function StatChips({ visible, onToggle }: StatChipsProps) {
  const theme = useAppTheme();
  const t = useComposerT();
  const shown = countVisibleStats(visible);
  const onTint = theme.isDark ? '#30D158' : '#34C759';

  return (
    <S.Section>
      <S.HeaderRow>
        <S.SectionHeader>{t('feed.composer.stats.title', 'STATS ON CARD')}</S.SectionHeader>
        <S.ShownCount>{t('feed.composer.stats.shown', '{shown} of 8 shown', { shown })}</S.ShownCount>
      </S.HeaderRow>
      <S.ChipRow>
        {STAT_DEFS.map((def) => {
          const on = visible[def.key];
          const label = t(def.labelKey, def.fallback);
          return (
            <S.Chip
              key={def.key}
              $on={on}
              $width={def.width}
              onPress={() => onToggle(def.key)}
              accessibilityRole="switch"
              accessibilityState={{ checked: on }}
              accessibilityLabel={label}
              hitSlop={{ top: 8, bottom: 8 }}
            >
              {on ? <CheckGlyph size={12} color={onTint} strokeWidth={2} /> : <HollowRingGlyph />}
              <S.ChipLabel $on={on} numberOfLines={1}>
                {label}
              </S.ChipLabel>
            </S.Chip>
          );
        })}
      </S.ChipRow>
    </S.Section>
  );
}
