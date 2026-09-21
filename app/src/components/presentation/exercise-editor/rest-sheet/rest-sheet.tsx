import { Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslate } from '@tolgee/react';
import { useAppReducedMotion } from '@/hooks/useMotionSettings';
import { Rest } from '@/models/blueprint-models';
import { Duration } from '@js-joda/core';
import { BRAND_GRADIENT } from '@/components/presentation/feed/composer/attached-session-card/attached-session-card';
import { MinusGlyph, OverlayBackdrop, PlusGlyph, SheetHandle } from '../editor-primitives';
import { formatDurationShort, restPresetFor } from '../exercise-editor-logic';
import {
  ApplyAllButton,
  ApplyAllGradient,
  ApplyAllText,
  BigStepButton,
  BigStepperRow,
  Chip,
  ChipRow,
  ChipText,
  Sheet,
  SheetActions,
  SheetContainer,
  SheetTitle,
  SheetValue,
} from './rest-sheet.styles';

const PRESETS = [30, 60, 90, 120, 180];
const BIG_STEP_SECONDS = 15;

function presetLabel(seconds: number): string {
  return seconds < 60 ? `${seconds}s` : `${seconds / 60}m`;
}

export function RestSheet({
  rest,
  onChange,
  onApplyToAll,
  onClose,
}: {
  rest: Rest;
  onChange: (rest: Rest) => void;
  onApplyToAll?: () => void;
  onClose: () => void;
}) {
  const reduceMotion = useAppReducedMotion();
  const { t } = useTranslate();
  const insets = useSafeAreaInsets();
  const selectedPreset = PRESETS.find((seconds) => rest.minRest.equals(Duration.ofSeconds(seconds)));
  const total = rest.minRest.seconds();
  const valueText = formatDurationShort(rest.minRest);
  const restLabel = t('exercise.editor.rest.label', 'Rest between sets');

  const adjust = (delta: number) => {
    const next = Math.min(
      600,
      Math.max(BIG_STEP_SECONDS, Math.round((total + delta) / BIG_STEP_SECONDS) * BIG_STEP_SECONDS),
    );
    onChange(restPresetFor(next));
  };

  return (
    <Modal
      visible
      transparent
      animationType={reduceMotion ? 'none' : 'slide'}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SheetContainer>
        <OverlayBackdrop
          onPress={onClose}
          accessibilityLabel={t('exercise.editor.rest.sheet.close', 'Close rest editor')}
        />
        <Sheet $bottomPad={insets.bottom}>
          <SheetHandle />
          <SheetTitle>{t('exercise.editor.rest.sheet.title', 'Rest between sets')}</SheetTitle>
          <BigStepperRow
            accessibilityRole="adjustable"
            accessibilityLabel={restLabel}
            accessibilityValue={{ text: valueText }}
          >
            <BigStepButton
              onPress={() => adjust(-BIG_STEP_SECONDS)}
              disabled={total <= BIG_STEP_SECONDS}
              accessibilityLabel={t('exercise.editor.rest.decrease', 'Decrease rest')}
              hitSlop={8}
            >
              <MinusGlyph />
            </BigStepButton>
            <SheetValue>{valueText}</SheetValue>
            <BigStepButton
              onPress={() => adjust(BIG_STEP_SECONDS)}
              accessibilityLabel={t('exercise.editor.rest.increase', 'Increase rest')}
              hitSlop={8}
            >
              <PlusGlyph />
            </BigStepButton>
          </BigStepperRow>
          <ChipRow>
            {PRESETS.map((seconds) => (
              <Chip
                key={seconds}
                $selected={selectedPreset === seconds}
                onPress={() => onChange(restPresetFor(seconds))}
                accessibilityRole="radio"
                accessibilityState={{ selected: selectedPreset === seconds }}
                accessibilityLabel={presetLabel(seconds)}
              >
                <ChipText $selected={selectedPreset === seconds}>{presetLabel(seconds)}</ChipText>
              </Chip>
            ))}
          </ChipRow>
          <SheetActions>
            {onApplyToAll ? (
              <ApplyAllButton
                onPress={onApplyToAll}
                accessibilityRole="button"
                accessibilityLabel={t('exercise.editor.rest.apply_all', 'Apply to all sets')}
              >
                <ApplyAllGradient colors={[...BRAND_GRADIENT]} start={{ x: 0, y: 0 }} end={{ x: 0.6, y: 1 }}>
                  <ApplyAllText>{t('exercise.editor.rest.apply_all', 'Apply to all sets')}</ApplyAllText>
                </ApplyAllGradient>
              </ApplyAllButton>
            ) : null}
          </SheetActions>
        </Sheet>
      </SheetContainer>
    </Modal>
  );
}
