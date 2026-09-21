import { useAppSelector } from '@/store';
import { setCurrentSnackbar, SnackbarDescriptor, SnackbarTone } from '@/store/app';
import { useAppTheme } from '@/hooks/useAppTheme';
import Icon from '@/components/presentation/foundation/icon';
import { ReactNode } from 'react';
import { Portal, Snackbar } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import * as S from './snackbar-provider.styles';

type ToastDescriptor = Extract<SnackbarDescriptor, { title: string }>;
type TextDescriptor = Exclude<SnackbarDescriptor, { title: string }>;

/**
 * Global snackbar host. Two render paths:
 *
 * - Legacy one-line (`text` only): Paper's default bottom snackbar, unchanged
 *   for every existing caller.
 * - Two-line toast (`title` + optional `subtitle` + `tone`): the backup-redesign
 *   white toast pinned below the nav, with a semantic status icon and an
 *   optional Retry chip.
 */
export default function SnackbarProvider(props: { children: ReactNode }) {
  const currentSnackbar = useAppSelector((s) => s.app.currentSnackbar);
  const dispatch = useDispatch();
  const theme = useAppTheme();

  const isToast = currentSnackbar !== undefined && 'title' in currentSnackbar;

  return (
    <>
      {props.children}
      <Portal>
        <Snackbar
          visible={!!currentSnackbar}
          onDismiss={() => {
            dispatch(setCurrentSnackbar(undefined));
          }}
          {...(isToast
            ? {
                wrapperStyle: S.toastWrapperStyle,
                style: S.toastSurfaceStyle(theme),
                contentStyle: S.toastContentStyle,
              }
            : {
                action: textAction(currentSnackbar, dispatch),
              })}
        >
          {isToast ? (
            <ToastContent snackbar={currentSnackbar as ToastDescriptor} dispatch={dispatch} />
          ) : (
            (currentSnackbar as TextDescriptor | undefined)?.text
          )}
        </Snackbar>
      </Portal>
    </>
  );
}

function textAction(
  snackbar: TextDescriptor | undefined,
  dispatch: ReturnType<typeof useDispatch>,
) {
  if (snackbar && 'action' in snackbar && snackbar.action) {
    return {
      label: snackbar.action,
      onPress: () => fireSnackbarAction(snackbar, dispatch),
    };
  }
  return undefined!;
}

function fireSnackbarAction(
  snackbar: TextDescriptor | ToastDescriptor,
  dispatch: ReturnType<typeof useDispatch>,
) {
  if ('onAction' in snackbar && snackbar.onAction) {
    snackbar.onAction();
  } else if ('dispatchAction' in snackbar && snackbar.dispatchAction) {
    const actions = snackbar.dispatchAction;
    if (Array.isArray(actions)) {
      actions.forEach((x) => dispatch(x));
    } else {
      dispatch(actions);
    }
  }
}

function ToastContent({
  snackbar,
  dispatch,
}: {
  snackbar: ToastDescriptor;
  dispatch: ReturnType<typeof useDispatch>;
}) {
  const tone: SnackbarTone = snackbar.tone ?? 'neutral';
  const iconSource = tone === 'success' ? 'check' : tone === 'error' ? 'cancel' : undefined;
  const hasAction = 'action' in snackbar && snackbar.action !== undefined;

  return (
    <S.ToastRow>
      {iconSource && <Icon source={iconSource} size={28} color={S.TOAST_TONE_COLORS[tone]} />}
      <S.ToastTexts>
        <S.ToastTitle $tone={tone}>{snackbar.title}</S.ToastTitle>
        {snackbar.subtitle !== undefined && <S.ToastSubtitle>{snackbar.subtitle}</S.ToastSubtitle>}
      </S.ToastTexts>
      {hasAction && (
        <S.ToastRetryChip
          accessibilityRole="button"
          accessibilityLabel={snackbar.action}
          onPress={() => fireSnackbarAction(snackbar, dispatch)}
        >
          <S.ToastRetryLabel>{snackbar.action}</S.ToastRetryLabel>
        </S.ToastRetryChip>
      )}
    </S.ToastRow>
  );
}
