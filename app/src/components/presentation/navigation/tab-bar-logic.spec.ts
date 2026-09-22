/**
 * Bottom tab bar behavior — drives the pure logic the real bar uses:
 * route → glyph resolution, hidden-route filtering, badge math, and the
 * standard tab-press contract (emit → navigate unless focused/prevented).
 */
import { describe, expect, it, vi } from 'vitest';
import { darkTheme, lightTheme } from '@/styles/theme';
import { badgeCountForRoute, createTabPressHandlers, tabIconNameForRoute, visibleTabRoutes } from './tab-bar-logic';

describe('tabIconNameForRoute', () => {
  it('resolves every production route to its spec glyph', () => {
    expect(tabIconNameForRoute('(session)')).toBe('workout');
    expect(tabIconNameForRoute('feed')).toBe('feed');
    expect(tabIconNameForRoute('stats')).toBe('stats');
    expect(tabIconNameForRoute('history')).toBe('history');
    expect(tabIconNameForRoute('settings')).toBe('settings');
  });

  it('returns null for unknown routes — label only, no crash', () => {
    expect(tabIconNameForRoute('mystery')).toBeNull();
  });
});

describe('visibleTabRoutes', () => {
  const routes = [
    { key: 'a', name: '(session)' },
    { key: 'b', name: 'feed' },
    { key: 'c', name: 'stats' },
  ];

  it('keeps everything when nothing is hidden', () => {
    expect(visibleTabRoutes(routes)).toHaveLength(3);
  });

  it('drops Feed when social is disabled, preserving order', () => {
    const visible = visibleTabRoutes(routes, ['feed']);
    expect(visible.map((r) => r.name)).toEqual(['(session)', 'stats']);
  });
});

describe('badgeCountForRoute', () => {
  it('reads the route count', () => {
    expect(badgeCountForRoute({ feed: 3 }, 'feed')).toBe(3);
  });

  it('is zero for missing, fractional, negative, or non-numeric input', () => {
    expect(badgeCountForRoute(undefined, 'feed')).toBe(0);
    expect(badgeCountForRoute({}, 'feed')).toBe(0);
    expect(badgeCountForRoute({ feed: -2 }, 'feed')).toBe(0);
    expect(badgeCountForRoute({ feed: 2.7 }, 'feed')).toBe(2);
    expect(badgeCountForRoute({ feed: Number.NaN }, 'feed')).toBe(0);
  });
});

describe('createTabPressHandlers', () => {
  const route = { key: 'feed-key', name: 'feed', params: { q: 1 } };

  function mockNavigation(prevented = false) {
    return {
      emit: vi.fn(() => ({ defaultPrevented: prevented })),
      navigate: vi.fn(),
    };
  }

  it('navigates an unfocused tab after emitting tabPress', () => {
    const navigation = mockNavigation();
    const { onPress } = createTabPressHandlers(navigation, route, false);
    onPress();
    expect(navigation.emit).toHaveBeenCalledWith({
      type: 'tabPress',
      target: 'feed-key',
      canPreventDefault: true,
    });
    expect(navigation.navigate).toHaveBeenCalledWith('feed', { q: 1 });
  });

  it('does not navigate the already-focused tab (still emits)', () => {
    const navigation = mockNavigation();
    const { onPress } = createTabPressHandlers(navigation, route, true);
    onPress();
    expect(navigation.emit).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).not.toHaveBeenCalled();
  });

  it('does not navigate when the event was prevented', () => {
    const navigation = mockNavigation(true);
    const { onPress } = createTabPressHandlers(navigation, route, false);
    onPress();
    expect(navigation.navigate).not.toHaveBeenCalled();
  });

  it('emits tabLongPress on long press', () => {
    const navigation = mockNavigation();
    const { onLongPress } = createTabPressHandlers(navigation, route, false);
    onLongPress();
    expect(navigation.emit).toHaveBeenCalledWith({ type: 'tabLongPress', target: 'feed-key' });
    expect(navigation.navigate).not.toHaveBeenCalled();
  });
});

describe('tabBar theme tokens', () => {
  it('matches the spec palette in light and dark', () => {
    expect(lightTheme.color.tabBar.selected).toBe('#FF2D55');
    expect(lightTheme.color.tabBar.unselected).toBe('#8E8E93');
    expect(darkTheme.color.tabBar.selected).toBe('#FF375F');
    expect(darkTheme.color.tabBar.unselected).toBe('#8E8E93');
    expect(lightTheme.color.tabBar.backgroundTop).toBe('rgba(255, 255, 255, 0.92)');
    expect(darkTheme.color.tabBar.backgroundTop).toBe('rgba(24, 24, 27, 0.94)');
  });
});
