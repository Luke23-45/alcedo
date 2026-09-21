import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/useAppTheme';
import * as S from './composer-sheet.styles';

interface ComposerSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  /** Shown in the header's top-right; the tag picker uses it as its Done. */
  doneLabel?: string;
  onDone?: () => void;
  children: ReactNode;
}

/**
 * Bottom sheet scaffold for the composer: dimmed backdrop (tap to dismiss),
 * slide-up card with the standard card gradient + edge + grabber.
 */
export function ComposerSheet({ visible, onClose, title, doneLabel, onDone, children }: ComposerSheetProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <S.Backdrop onPress={onClose}>
        <S.Sheet onStartShouldSetResponder={() => true} $bottom={Math.max(insets.bottom, 8)}>
          <LinearGradient
            colors={theme.isDark ? ['#1F1F23', '#17171A', '#131316'] : ['#FFFFFF', '#FAFAFC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.45, y: 1 }}
            style={S.fill}
          />
          <S.Grabber />
          <S.SheetHeader>
            <S.SheetTitle>{title}</S.SheetTitle>
            {doneLabel ? (
              <S.DoneButton onPress={onDone ?? onClose} accessibilityRole="button">
                <S.DoneLabel>{doneLabel}</S.DoneLabel>
              </S.DoneButton>
            ) : null}
          </S.SheetHeader>
          {children}
          <S.SheetEdge />
        </S.Sheet>
      </S.Backdrop>
    </Modal>
  );
}
