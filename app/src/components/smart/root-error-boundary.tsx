import Button from '@/components/presentation/foundation/button';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Component, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { Text, type MD3Theme } from 'react-native-paper';

type Props = {
  readonly children: ReactNode;
  /** Where the boundary sits, for the crash report. */
  readonly name?: string;
};

type State = {
  readonly error?: Error;
};

/**
 * Catches render errors below it and shows a recovery screen instead of a
 * blank/white crash. The "Try again" button resets the boundary so the
 * subtree remounts; if the error is deterministic the boundary will trip
 * again rather than looping.
 *
 * Deliberately not localized: i18n itself may be what broke.
 */
export class RootErrorBoundary extends Component<Props, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }): void {
    // Mirrors the startup-recovery logging: report, never throw from here.
    try {
      // eslint-disable-next-line no-console
      console.error(`[error-boundary:${this.props.name ?? 'root'}]`, error, info.componentStack);
    } catch {
      // Logging must not crash the crash screen.
    }
  }

  private readonly reset = (): void => {
    this.setState({ error: undefined });
  };

  render(): ReactNode {
    if (!this.state.error) {
      return this.props.children;
    }
    return <ErrorFallback onRetry={this.reset} />;
  }
}

function ErrorFallback({ onRetry }: { readonly onRetry: () => void }): ReactNode {
  // useAppTheme types colors as `any` (pre-existing); MD3Theme restores the real shape.
  const theme = useAppTheme() as unknown as MD3Theme;
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 16,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text variant="headlineSmall" style={{ textAlign: 'center' }}>
        Something went wrong
      </Text>
      <Text variant="bodyMedium" style={{ textAlign: 'center', opacity: 0.7 }}>
        Alcedo hit an unexpected error. Your saved workouts and plans are stored on this device — try again, and
        if it keeps happening, please send a bug report.
      </Text>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button mode="contained" onPress={onRetry}>
          Try again
        </Button>
      </View>
    </ScrollView>
  );
}
