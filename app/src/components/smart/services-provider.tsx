import { Services } from '@/services';
import { resolveStore } from '@/store';
import { registerDateTranslations } from '@/utils/date-locale';
import { TolgeeProvider } from '@tolgee/react';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Provider } from 'react-redux';

// Create context for services
const ServicesContext = createContext<Services | null>(null);

let databasePromise: Promise<SQLiteDatabase> | undefined;
function openDatabase() {
  return (databasePromise ??= openDatabaseAsync('db.db'));
}

export default function ServicesProvider(props: { children: ReactNode }) {
  const [expoDb, setOpDb] = useState<SQLiteDatabase>();
  const [dbError, setDbError] = useState<unknown>(undefined);
  const open = useCallback(() => {
    // Drop the cached promise so a retry actually re-opens the database.
    databasePromise = undefined;
    setDbError(undefined);
    void openDatabase().then(setOpDb, setDbError);
  }, []);
  useEffect(() => {
    open();
  }, [open]);
  const db = useMemo(() => expoDb && drizzle(expoDb), [expoDb]);
  const resolved = useMemo(() => (db && expoDb ? resolveStore(db, expoDb) : undefined), [db, expoDb]);
  const store = resolved?.store;
  const services = resolved?.services;
  useEffect(() => {
    if (services) {
      registerDateTranslations(services.tolgee);
    }
  }, [services]);
  // A database that fails to open used to render a silent blank screen forever.
  // Surface the failure with a retry instead.
  if (dbError) {
    return <DatabaseErrorScreen error={dbError} onRetry={open} />;
  }
  if (!store || !services) {
    return <></>;
  }

  return (
    <Provider store={store}>
      <ServicesContext.Provider value={services}>
        <TolgeeProvider tolgee={services.tolgee}>{props.children}</TolgeeProvider>
      </ServicesContext.Provider>
    </Provider>
  );
}
export function useServices() {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error('useServices must be used within AppStateProvider');
  return ctx;
}

// Rendered outside the theme provider, so it uses static dark colors that match
// the app's dark launch background.
function DatabaseErrorScreen({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0B0B0E',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        gap: 12,
      }}
    >
      <Text style={{ color: '#F5F5F7', fontSize: 17, fontWeight: '600', textAlign: 'center' }}>
        Couldn't open your data
      </Text>
      <Text style={{ color: '#98989F', fontSize: 14, textAlign: 'center' }}>
        Alcedo couldn't open its local database. Your data is still on this device — try again.
      </Text>
      <Text style={{ color: '#6C6C70', fontSize: 12, textAlign: 'center' }} numberOfLines={3}>
        {error instanceof Error ? error.message : String(error)}
      </Text>
      <Pressable
        onPress={onRetry}
        style={{
          marginTop: 8,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 12,
          backgroundColor: '#0A84FF',
        }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>Try again</Text>
      </Pressable>
    </View>
  );
}
