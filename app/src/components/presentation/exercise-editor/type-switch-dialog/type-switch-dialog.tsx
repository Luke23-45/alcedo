import { Modal } from 'react-native';
import { useTranslate } from '@tolgee/react';
import { useAppReducedMotion } from '@/hooks/useMotionSettings';
import { OverlayBackdrop } from '../editor-primitives';
import { typeSwitchCopy } from '../exercise-editor-logic';
import {
  CancelText,
  ConfirmText,
  Dialog,
  DialogActionButton,
  DialogActions,
  DialogBody,
  DialogBodyKept,
  DialogContainer,
  DialogDividerH,
  DialogDividerV,
  DialogTitle,
} from './type-switch-dialog.styles';

export function TypeSwitchDialog({
  copy,
  onCancel,
  onConfirm,
}: {
  copy: ReturnType<typeof typeSwitchCopy>;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const reduceMotion = useAppReducedMotion();
  const { t } = useTranslate();
  const lost =
    copy.lostKind === 'reps'
      ? t(
          'exercise.editor.type_switch.lost_reps',
          'This resets the rep configuration for all {count} sets of this exercise.',
          { count: copy.lostCount },
        )
      : t(
          'exercise.editor.type_switch.lost_targets',
          'This resets the target configuration for all {count} sets of this exercise.',
          { count: copy.lostCount },
        );
  return (
    <Modal
      visible
      transparent
      animationType={reduceMotion ? 'none' : 'fade'}
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <DialogContainer>
        <OverlayBackdrop onPress={onCancel} accessibilityLabel={t('generic.cancel.button', 'Cancel')} />
        <Dialog accessibilityRole="alert">
          <DialogTitle>
            {copy.titleKey === 'toCardio'
              ? t('exercise.editor.type_switch.title_cardio', 'Switch to Cardio / Time?')
              : t('exercise.editor.type_switch.title_weighted', 'Switch to Weighted?')}
          </DialogTitle>
          <DialogBody>
            {lost}
            {'\n'}
            <DialogBodyKept>{t('exercise.editor.type_switch.kept', 'Name, notes and link are kept.')}</DialogBodyKept>
          </DialogBody>
          <DialogDividerH />
          <DialogActions>
            <DialogActionButton
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel={t('generic.cancel.button', 'Cancel')}
            >
              <CancelText>{t('generic.cancel.button', 'Cancel')}</CancelText>
            </DialogActionButton>
            <DialogDividerV />
            <DialogActionButton
              onPress={onConfirm}
              accessibilityRole="button"
              accessibilityLabel={t('exercise.editor.type_switch.confirm', 'Switch & Reset')}
            >
              <ConfirmText>{t('exercise.editor.type_switch.confirm', 'Switch & Reset')}</ConfirmText>
            </DialogActionButton>
          </DialogActions>
        </Dialog>
      </DialogContainer>
    </Modal>
  );
}
