import { Loader } from '@/components/presentation/foundation/loader';
import Button from '@/components/presentation/foundation/button';
import { useAppTheme, spacing } from '@/hooks/useAppTheme';
import { useAppSelector } from '@/store';
import { copyLogs, initializeAppStateSlice, setInitializationError } from '@/store/app';
import { T } from '@tolgee/react';
import * as Application from 'expo-application';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Platform, Text, View } from 'react-native';
import { openUrl } from '@/utils/open-url';
import { useDispatch } from 'react-redux';

// How long to wait before assuming startup has stalled and offering an escape hatch.
const STUCK_TIMEOUT_MS = 7_000;

export function AppStateProvider({ children }: { children: ReactNode }) {
  const initializationError = useAppSelector((s) => s.app.initializationError);
  const waitingOn = useAppSelector(
    (s) =>
      getLoadMessage(s.app, 'app settings') ||
      getLoadMessage(s.program, 'program') ||
      getLoadMessage(s.settings, 'settings') ||
      getLoadMessage(s.storedSessions, 'stored sessions') ||
      getLoadMessage(s.aiPlanner, 'ai planner'),
  );
  const { colors } = useAppTheme();
  const isWaiting = !!waitingOn;
  const anim = useRef(new Animated.Value(1)).current;

  // A failed initialization takes precedence over the loading gate: show recovery
  // instead of spinning forever.
  if (initializationError) {
    return <InitializationErrorScreen error={initializationError} />;
  }

  if (isWaiting) {
    return (
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: anim,
        }}
      >
        <View>
          <Loader loadingText={waitingOn ?? ''} />
        </View>
        <StuckHelp />
      </Animated.View>
    );
  }

  return children;
}

function StuckHelp() {
  const { colors } = useAppTheme();
  const dispatch = useDispatch();
  const [isStuck, setIsStuck] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsStuck(true), STUCK_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!isStuck) {
    return null;
  }

  const appVersion = Application.nativeApplicationVersion ?? Application.nativeBuildVersion ?? 'Unknown';
  const bugReportUrl = `https://github.com/Luke23-45/alcedo/issues/new?assignees=&labels=bug&projects=&template=bug_report.yaml&app-version=${encodeURIComponent(appVersion)}&platform=${Platform.OS}&os-version=${Platform.Version}`;

  const openBugReport = () => {
    openUrl(bugReportUrl);
  };
  const doCopyLogs = () => {
    dispatch(copyLogs());
    setCopied(true);
  };

  return (
    <View style={{ alignItems: 'center', gap: spacing[2] }}>
      <Text style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
        <T keyName="app.stuck_loading.message" />
      </Text>
      <Button icon="bugReport" onPress={openBugReport}>
        <T keyName="app.stuck_loading.report.button" />
      </Button>
      <Button icon="terminal" onPress={doCopyLogs}>
        <T keyName="app.stuck_loading.copy_logs.button" />
      </Button>
      {copied && (
        <Text style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
          <T keyName="app.stuck_loading.copied.label" />
        </Text>
      )}
    </View>
  );
}

function InitializationErrorScreen({ error }: { error: string }) {
  const { colors } = useAppTheme();
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);

  const appVersion = Application.nativeApplicationVersion ?? Application.nativeBuildVersion ?? 'Unknown';
  const bugReportUrl = `https://github.com/Luke23-45/alcedo/issues/new?assignees=&labels=bug&projects=&template=bug_report.yaml&app-version=${encodeURIComponent(appVersion)}&platform=${Platform.OS}&os-version=${Platform.Version}`;

  const retry = () => {
    dispatch(setInitializationError(undefined));
    dispatch(initializeAppStateSlice());
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[4],
        gap: spacing[2],
      }}
    >
      <Text style={{ color: colors.onSurface, textAlign: 'center', fontSize: 17, fontWeight: '600' }}>
        <T keyName="app.init_error.title" />
      </Text>
      <Text style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
        <T keyName="app.init_error.message" />
      </Text>
      <Text style={{ color: colors.onSurfaceVariant, textAlign: 'center', fontSize: 12 }} numberOfLines={3}>
        {error}
      </Text>
      <Button onPress={retry}>
        <T keyName="app.init_error.retry.button" />
      </Button>
      <Button icon="bugReport" onPress={() => openUrl(bugReportUrl)}>
        <T keyName="app.stuck_loading.report.button" />
      </Button>
      <Button
        icon="terminal"
        onPress={() => {
          dispatch(copyLogs());
          setCopied(true);
        }}
      >
        <T keyName="app.stuck_loading.copy_logs.button" />
      </Button>
      {copied && (
        <Text style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
          <T keyName="app.stuck_loading.copied.label" />
        </Text>
      )}
    </View>
  );
}

function getLoadMessage(state: { isHydrated: boolean }, type: string) {
  if (state.isHydrated) return undefined;
  return 'Loading ' + type;
}
