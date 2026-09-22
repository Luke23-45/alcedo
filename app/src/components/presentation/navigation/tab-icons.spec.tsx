/**
 * Bottom tab bar icon geometry — verifies the React Native glyphs against the
 * production symbols in docs/new_design/tab-bar-icons.svg.
 *
 * react-native is fully stubbed in this repo's test setup, so instead of
 * rendering, the specs call the pure glyph functions and walk the returned
 * element tree: the `d` attributes, rect geometry, stroke widths, and
 * evenodd cutouts are asserted verbatim against the spec.
 */
import { describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';

vi.mock('react-native-svg', () => ({
  __esModule: true,
  default: 'Svg',
  Svg: 'Svg',
  G: 'G',
  Path: 'Path',
  Rect: 'Rect',
  Circle: 'Circle',
}));

import {
  FeedFilledGlyph,
  FeedOutlineGlyph,
  HistoryFilledGlyph,
  HistoryOutlineGlyph,
  SettingsFilledGlyph,
  SettingsOutlineGlyph,
  StatsFilledGlyph,
  StatsOutlineGlyph,
  TabIcon,
  WorkoutFilledGlyph,
  WorkoutOutlineGlyph,
} from './tab-icons';

const COLOR = '#FF375F';

type El = ReactElement<{ children?: unknown } & Record<string, unknown>>;

function directChildren(el: El): El[] {
  const out: El[] = [];
  const push = (child: unknown): void => {
    if (Array.isArray(child)) {
      child.forEach(push);
      return;
    }
    if (child && typeof child === 'object' && 'type' in child) out.push(child as El);
  };
  push(el.props.children);
  return out;
}

function findAll(el: El, type: string): El[] {
  const found: El[] = [];
  const visit = (node: El) => {
    if (node.type === type) found.push(node);
    for (const child of directChildren(node)) visit(child);
  };
  visit(el);
  return found;
}

function findPaths(el: El): El[] {
  return findAll(el, 'Path');
}

function pathD(el: El): string[] {
  return findPaths(el).map((p) => String(p.props.d));
}

function first<T>(list: readonly T[]): T {
  const item = list[0];
  if (item === undefined) throw new Error('expected a non-empty list');
  return item;
}

describe('glyph frame', () => {
  it('renders a 24pt Svg on the spec viewBox, honoring the size prop', () => {
    const icon = TabIcon({ name: 'workout', selected: false, color: COLOR }) as El;
    expect(icon.type).toBe('Svg');
    expect(icon.props.viewBox).toBe('-12 -12 24 24');
    expect(icon.props.width).toBe(24);
    expect(icon.props.height).toBe(24);
    const big = TabIcon({ name: 'workout', selected: false, color: COLOR, size: 32 }) as El;
    expect(big.props.width).toBe(32);
  });
});

describe('workout — olympic barbell', () => {
  it('outline: graduated plates plus bar stubs, 2pt rounded stroke', () => {
    const g = WorkoutOutlineGlyph({ color: COLOR }) as El;
    expect(g.type).toBe('G');
    expect(g.props.strokeWidth).toBe(2);
    expect(g.props.strokeLinecap).toBe('round');
    expect(g.props.fill).toBe('none');
    expect(pathD(g)).toContain('M-11.8 0 H-10 M-2.3 0 H2.3 M10 0 H11.8');
    const rects = findAll(g, 'Rect');
    expect(rects).toHaveLength(4);
    // Plate pairs are symmetric about the origin (zero visual drift).
    const centers = rects.map((r) => Number(r.props.x) + Number(r.props.width) / 2).sort((a, b) => a - b);
    for (let i = 0; i < centers.length / 2; i += 1) {
      const left = first(centers.slice(i, i + 1));
      const right = first(centers.slice(centers.length - 1 - i, centers.length - i));
      expect(left + right).toBeCloseTo(0, 10);
    }
  });

  it('filled: plates plus the three bar segments, no stroke', () => {
    const g = WorkoutFilledGlyph({ color: COLOR }) as El;
    expect(findAll(g, 'Rect')).toHaveLength(7);
    expect(g.props.fill).toBe(COLOR);
    expect(g.props.stroke).toBeUndefined();
  });
});

describe('feed — dialogue mesh', () => {
  it('outline: background bubble path, foreground capsule, tail', () => {
    const g = FeedOutlineGlyph({ color: COLOR }) as El;
    expect(pathD(g)).toContain('M3.5 -9.5 H-6 Q-10 -9.5 -10 -5.5 V0.5');
    expect(pathD(g)).toContain('M1 7.5 L-3 10.8 L-1 7.5');
    expect(findAll(g, 'Rect')).toHaveLength(1);
  });

  it('filled: rear bubble, front bubble with tail, no cutout cheats', () => {
    const g = FeedFilledGlyph({ color: COLOR }) as El;
    expect(findAll(g, 'Rect')).toHaveLength(2);
    expect(pathD(g)).toContain('M1 7 L-3.5 11 L-0.5 7 Z');
  });
});

describe('stats — volume histogram', () => {
  it('outline: ground plane plus three ascending bars', () => {
    const g = StatsOutlineGlyph({ color: COLOR }) as El;
    expect(pathD(g)).toContain('M-11 10 H11');
    const rects = findAll(g, 'Rect');
    expect(rects).toHaveLength(3);
    const tops = rects.map((r) => Number(r.props.y)).sort((a, b) => a - b);
    expect(tops).toEqual([-6, -2, 2]);
  });

  it('filled: solid ground plane and solid bars', () => {
    const g = StatsFilledGlyph({ color: COLOR }) as El;
    const rects = findAll(g, 'Rect');
    expect(rects).toHaveLength(4);
    expect(first(rects).props).toMatchObject({ x: -11, y: 8.8, width: 22, height: 2.4, rx: 1.2 });
  });
});

describe('history — rewind chronometer', () => {
  it('outline: dial, hands, rewind arc, arrowhead', () => {
    const g = HistoryOutlineGlyph({ color: COLOR }) as El;
    expect(findAll(g, 'Circle')).toHaveLength(1);
    expect(pathD(g)).toContain('M0 0 V-4 M0 0 L3.2 1.6');
    expect(pathD(g)).toContain('M0 -10.5 A10.5 10.5 0 0 0 -10.5 0');
    expect(pathD(g)).toContain('M-8.1 -1.4 L-10.5 0.2 L-11.7 -2.4');
  });

  it('filled: evenodd compound cutout for the hands, never a white overlay', () => {
    const g = HistoryFilledGlyph({ color: COLOR }) as El;
    const cutout = findPaths(g).find((p) => p.props.fillRule === 'evenodd');
    expect(cutout).toBeDefined();
    expect(String(cutout!.props.d)).toContain('M7.5 0 A7.5 7.5 0 1 1 -7.5 0');
    expect(String(cutout!.props.d)).toContain('M-1.1 -4.6 H1.1 V-1.1 H3.6 V1.1 H-1.1 Z');
    // No white anywhere in the glyph.
    const serialized = JSON.stringify(g.props);
    expect(serialized).not.toMatch(/#fff|#FFF|white/i);
  });
});

describe('settings — precision gear', () => {
  it('outline: ring, axle, six teeth at 60° intervals', () => {
    const g = SettingsOutlineGlyph({ color: COLOR }) as El;
    const circles = findAll(g, 'Circle');
    expect(circles.map((c) => c.props.r)).toEqual([5.6, 2.2]);
    const teeth = findPaths(g).filter(
      (p) => String(p.props.d).startsWith('M5.6') || String(p.props.d).includes('4.85'),
    );
    expect(teeth).toHaveLength(3);
  });

  it('filled: evenodd bored ring plus six capsule teeth', () => {
    const g = SettingsFilledGlyph({ color: COLOR }) as El;
    const ring = findPaths(g).find((p) => p.props.fillRule === 'evenodd');
    expect(ring).toBeDefined();
    expect(String(ring!.props.d)).toContain('M5.6 0 A5.6 5.6 0 1 1 -5.6 0');
    const teeth = findAll(g, 'Rect');
    expect(teeth).toHaveLength(6);
    expect(teeth.map((t) => t.props.transform)).toEqual([
      'rotate(0)',
      'rotate(60)',
      'rotate(120)',
      'rotate(180)',
      'rotate(240)',
      'rotate(300)',
    ]);
    expect(first(teeth).props).toMatchObject({ x: 5.2, y: -1.6, width: 3.6, height: 3.2, rx: 1.6 });
  });
});

describe('TabIcon dispatcher', () => {
  it.each([
    ['workout', false],
    ['feed', false],
    ['stats', false],
    ['history', false],
    ['settings', false],
  ] as const)('%s resting renders the outline (stroked) glyph', (name, selected) => {
    const icon = TabIcon({ name, selected, color: COLOR }) as El;
    // The Svg's direct child is the glyph wrapper; render it one level to
    // reach the spec geometry (glyphs are pure — no hooks involved).
    const wrapper = first(directChildren(icon));
    const g = (wrapper.type as (props: Record<string, unknown>) => El)(wrapper.props as Record<string, unknown>);
    const inner = first(findAll(g, 'G'));
    expect(inner.props.fill).toBe('none');
    expect(inner.props.stroke).toBe(COLOR);
  });

  it.each([['workout'], ['feed'], ['stats'], ['history'], ['settings']] as const)(
    '%s selected renders the filled glyph',
    (name) => {
      const icon = TabIcon({ name, selected: true, color: COLOR }) as El;
      const wrapper = first(directChildren(icon));
      const g = (wrapper.type as (props: Record<string, unknown>) => El)(wrapper.props as Record<string, unknown>);
      const inner = first(findAll(g, 'G'));
      expect(inner.props.fill).toBe(COLOR);
      expect(inner.props.stroke).toBeUndefined();
    },
  );
});
