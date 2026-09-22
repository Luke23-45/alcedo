import type { TabIconName } from './tab-icons';

/**
 * Bottom tab bar behavior, kept free of React Native so the suite can drive it
 * the way the real bar does: icon resolution, visibility filtering, badge
 * math, and the standard tab-press contract (emit → navigate unless focused
 * or prevented).
 */

/** Route name → spec glyph. `null` means the route renders its label only. */
export function tabIconNameForRoute(routeName: string): TabIconName | null {
  switch (routeName) {
    case '(session)':
      return 'workout';
    case 'feed':
      return 'feed';
    case 'stats':
      return 'stats';
    case 'history':
      return 'history';
    case 'settings':
      return 'settings';
    default:
      return null;
  }
}

export interface TabRouteLike {
  key: string;
  name: string;
}

/** Drop routes the layout hides (e.g. Feed when social is disabled). */
export function visibleTabRoutes<T extends TabRouteLike>(
  routes: readonly T[],
  hiddenRouteNames: readonly string[] = [],
): T[] {
  if (hiddenRouteNames.length === 0) return [...routes];
  const hidden = new Set(hiddenRouteNames);
  return routes.filter((route) => !hidden.has(route.name));
}

/** Badge count for a route; never negative, never NaN. */
export function badgeCountForRoute(badgeCounts: Record<string, number> | undefined, routeName: string): number {
  const raw = badgeCounts?.[routeName];
  if (typeof raw !== 'number' || !Number.isFinite(raw)) return 0;
  return Math.max(0, Math.floor(raw));
}

export interface TabPressNavigation {
  emit: (event: { type: 'tabPress' | 'tabLongPress'; target: string; canPreventDefault?: boolean }) => {
    defaultPrevented?: boolean;
  };
  navigate: (name: string, params?: object) => void;
}

export interface TabPressRoute extends TabRouteLike {
  params?: object;
}

/**
 * Standard bottom-tab press contract: always emit, navigate only when the
 * tab isn't already focused and the event wasn't prevented.
 */
export function createTabPressHandlers(navigation: TabPressNavigation, route: TabPressRoute, isFocused: boolean) {
  return {
    onPress: () => {
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    },
    onLongPress: () => {
      navigation.emit({ type: 'tabLongPress', target: route.key });
    },
  };
}
