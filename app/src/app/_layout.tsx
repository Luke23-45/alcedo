// Must be first — Hermes has no `document`; styled-components/native touches it at
// import time. The shim defines a minimal stub before any `import styled` is evaluated.
import '../../polyfills/styled-shim';
import { AppThemeProvider } from '@/hooks/useAppTheme';
import { I18nManager, LogBox, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppStateProvider } from '@/components/smart/app-state-provider';
import { PlanImportGate } from '@/components/smart/plan-import-gate';
import { AutoPauseOnLock } from '@/components/smart/auto-pause-on-lock';
import SnackbarProvider from '@/components/smart/snackbar-provider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import ServicesProvider from '@/components/smart/services-provider';
import { install } from 'react-native-quick-crypto';
import StackWithHeader from '@/components/layout/stack-with-header';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { requireOptionalNativeModule } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import { LaunchProvider } from '@/components/smart/launch-provider';
import { RootErrorBoundary } from '@/components/smart/root-error-boundary';

void SplashScreen.preventAutoHideAsync();

install();

if (__DEV__) {
  // oxlint-disable-next-line typescript/no-unsafe-assignment
  const DevMenuPreferences = requireOptionalNativeModule('DevMenuPreferences');
  // oxlint-disable-next-line typescript/no-unsafe-call typescript/no-unsafe-member-access
  DevMenuPreferences?.setPreferencesAsync({ showFloatingActionButton: false, showsAtLaunch: false });
}

LogBox.ignoreAllLogs();

if (Platform.OS !== 'web') {
  I18nManager.swapLeftAndRightInRTL?.(true);
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <KeyboardProvider>
        <SafeAreaProvider>
          <ServicesProvider>
            <AppThemeProvider>
              <AppStateProvider>
                <SnackbarProvider>
                  {Platform.OS === 'android' && <StatusBar style="auto" />}
                  <LaunchProvider>
                    <PlanImportGate />
                    <AutoPauseOnLock />
                    <RootErrorBoundary name="root">
                      <Layout />
                    </RootErrorBoundary>
                  </LaunchProvider>
                </SnackbarProvider>
              </AppStateProvider>
            </AppThemeProvider>
          </ServicesProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

function Layout() {
  return (
    <StackWithHeader>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="exercise-search" options={{ presentation: 'modal' }} />
      <Stack.Screen name="exercise-editor" />
      <Stack.Screen
        name="exercise-history"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="workout-editor" />
      <Stack.Screen name="diff-save" />
    </StackWithHeader>
  );
}
