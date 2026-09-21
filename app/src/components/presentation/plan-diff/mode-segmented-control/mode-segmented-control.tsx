import { useAppTheme } from '@/hooks/useAppTheme';
import { useTranslate } from '@tolgee/react';
import * as S from './mode-segmented-control.styles';

export type PlanDiffMode = 'update' | 'new';

interface ModeSegmentedControlProps {
  mode: PlanDiffMode;
  sessionName: string;
  onModeChange: (mode: PlanDiffMode) => void;
}

/**
 * The update-vs-save-as-new segmented control from the diff-save reference
 * (361×44, radius 22). The selected segment is a raised thumb; the other
 * segment is quiet caption text.
 */
export function ModeSegmentedControl({ mode, sessionName, onModeChange }: ModeSegmentedControlProps) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;

  const segments: { mode: PlanDiffMode; label: string }[] = [
    { mode: 'update', label: t('plan.diff.mode.update', { sessionName }) },
    { mode: 'new', label: t('plan.diff.mode.new') },
  ];

  return (
    <S.SegmentTrack $dark={dark} accessibilityRole="tablist">
      {segments.map((segment) => {
        const selected = mode === segment.mode;
        return (
          <S.SegmentButton
            key={segment.mode}
            onPress={() => onModeChange(segment.mode)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={segment.label}
          >
            <S.SegmentThumb $selected={selected} $dark={dark} />
            <S.SegmentLabel $selected={selected} $dark={dark}>
              {segment.label}
            </S.SegmentLabel>
          </S.SegmentButton>
        );
      })}
    </S.SegmentTrack>
  );
}
