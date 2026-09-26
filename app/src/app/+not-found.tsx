import Button from '@/components/presentation/foundation/button';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Text, type MD3Theme } from 'react-native-paper';

/**
 * Rendered by expo-router for URLs that match no route (deep links,
 * stale notifications, hand-typed paths). Offers a way back instead of a
 * blank screen.
 */
export default function NotFound() {
  // useAppTheme types colors as `any` (pre-existing); MD3Theme restores the real shape.
  const theme = useAppTheme() as unknown as MD3Theme;
  const { replace } = useRouter();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 16,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text variant="headlineSmall" style={{ textAlign: 'center' }}>
        Page not found
      </Text>
      <Text variant="bodyMedium" style={{ textAlign: 'center', opacity: 0.7 }}>
        This link doesn&apos;t point anywhere in Alcedo.
      </Text>
      <Button mode="contained" onPress={() => replace('/')}>
        Go home
      </Button>
    </View>
  );
}
