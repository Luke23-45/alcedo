import { useTranslate } from '@tolgee/react';
import { useDispatch } from 'react-redux';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAppSelector } from '@/store';
import { addMessage } from '@/store/ai-planner';
import { uuid } from '@/utils/uuid';
import { ShareGlyph } from '@/components/presentation/foundation/glyphs';
import * as S from './share-program-button.styles';

export function ShareProgramButton({ disabled }: { disabled: boolean }) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dispatch = useDispatch();
  const activeProgram = useAppSelector((x) => x.program.savedPrograms[x.program.activePlanId]);

  const share = () => {
    if (!activeProgram) {
      return;
    }
    dispatch(
      addMessage({
        from: 'User',
        id: uuid(),
        type: 'sharedProgram',
        programName: activeProgram.name,
        blueprint: activeProgram,
      }),
    );
  };

  const isDisabled = disabled || !activeProgram;
  return (
    <S.TouchArea
      onPress={share}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={t('ai.share_program.button')}
      accessibilityState={{ disabled: isDisabled }}
    >
      <S.Circle $disabled={isDisabled}>
        <ShareGlyph color={theme.color.interactive.tint} size={20} />
      </S.Circle>
    </S.TouchArea>
  );
}
