import type { ComponentProps } from 'react';
import Reanimated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useReducedMotion } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/useAppTheme';
import { TabIcon, type TabIconName } from './tab-icons';
import { badgeCountForRoute, createTabPressHandlers, tabIconNameForRoute, visibleTabRoutes } from './tab-bar-logic';
import * as S from './tab-bar.styles';

/**
 * Custom bottom tab bar implementing the runtime rig from
 * docs/new_design/tab-bar-icons.svg §3: glass gradient surface, 0.5pt top
 * hairline, 24pt custom glyphs, 10pt labels, spec token palette.
 *
 * The native tab bar cannot render arbitrary SVG, so this replaces
 * `unstable-native-tabs` with a JS bar — the only way to ship the custom
 * icon system. Selected-state changes cross-fade over 120ms (instant under
 * reduced motion).
 */

type BottomTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

export interface AppTabBarProps extends BottomTabBarProps {
  /** Route names to omit (e.g. Feed when social is disabled). */
  hiddenRouteNames?: readonly string[];
  /** Badge counts keyed by route name. */
  badgeCounts?: Record<string, number>;
}

/**
 * Spec §3: the selected state cross-fades the outline and filled layers over
 * 120ms — no scaling, no positional movement, so the glyph never drifts.
 * Under reduced motion the swap is instant; the selected state is identical
 * either way.
 *
 * UI-thread crossfade: the progress is derived directly from `selected` via
 * Reanimated — no useEffect round-trip before the animation begins.
 */
function TabGlyph({ name, selected, color }: { name: TabIconName; selected: boolean; color: string }) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(selected ? 1 : 0);

  // Sync the UI-thread value when selection changes (no animation delay).
  if (reduceMotion) {
    progress.value = selected ? 1 : 0;
  } else {
    progress.value = withTiming(selected ? 1 : 0, { duration: 120 });
  }

  const outlineStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));
  const filledStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <>
      <S.IconLayer style={outlineStyle} pointerEvents="none">
        <TabIcon name={name} selected={false} color={color} />
      </S.IconLayer>
      <S.IconLayer style={filledStyle} pointerEvents="none">
        <TabIcon name={name} selected color={color} />
      </S.IconLayer>
    </>
  );
}

export function AppTabBar({ state, descriptors, navigation, hiddenRouteNames, badgeCounts }: AppTabBarProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const routes = visibleTabRoutes(state.routes, hiddenRouteNames);
  const focusedKey = state.routes[state.index]?.key;
  // The react-navigation overloads don't accept a dynamic route name; one
  // contained cast at the boundary keeps the logic module overload-free.
  const navigate = navigation.navigate as unknown as (name: string, params?: object) => void;

  return (
    <S.Bar colors={[theme.color.tabBar.backgroundTop, theme.color.tabBar.backgroundBottom] as const}>
      <S.Hairline />
      <S.Row $padBottom={insets.bottom + 8}>
        {routes.map((route) => {
          const descriptor = descriptors[route.key];
          if (!descriptor) return null;
          const { options } = descriptor;
          const label = typeof options.title === 'string' ? options.title : route.name;
          const isFocused = route.key === focusedKey;
          const tint = isFocused ? theme.color.tabBar.selected : theme.color.tabBar.unselected;
          const iconName = tabIconNameForRoute(route.name);
          const badge = badgeCountForRoute(badgeCounts, route.name);
          const { onPress, onLongPress } = createTabPressHandlers(
            {
              // react-navigation sets defaultPrevented on the returned event at
              // runtime, but its types don't declare it — one contained cast.
              emit: (event) => navigation.emit(event) as unknown as { defaultPrevented?: boolean },
              navigate: (name, params) => navigate(name, params),
            },
            route,
            isFocused,
          );
          // Haptic on tab switch: Apple's tab bar confirms every switch.
          const handlePress = () => {
            if (!isFocused) {
              void Haptics.selectionAsync();
            }
            onPress();
          };
          return (
            <S.TabButton
              key={route.key}
              onPress={handlePress}
              onLongPress={onLongPress}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={label}
            >
              <S.IconSlot>
                {iconName ? <TabGlyph name={iconName} selected={isFocused} color={tint} /> : null}
                {badge > 0 ? (
                  <S.Badge>
                    <S.BadgeText>{badge > 99 ? '99+' : String(badge)}</S.BadgeText>
                  </S.Badge>
                ) : null}
              </S.IconSlot>
              <S.TabLabel selected={isFocused}>{label}</S.TabLabel>
            </S.TabButton>
          );
        })}
      </S.Row>
    </S.Bar>
  );
}
