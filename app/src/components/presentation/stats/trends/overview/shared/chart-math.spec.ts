import { describe, expect, it } from 'vitest';
import { layoutSeries, smoothAreaPath, smoothLinePath } from './chart-math';

describe('layoutSeries', () => {
  it('returns no points for an empty series', () => {
    expect(layoutSeries([], 0, 100, 0, 100)).toEqual([]);
  });

  it('centers a single point horizontally and vertically when flat', () => {
    const [pt] = layoutSeries([5], 0, 100, 0, 100);
    expect(pt!.x).toBe(50);
    expect(pt!.y).toBe(50);
  });

  it('maps min to the bottom and max to the top', () => {
    const [a, b] = layoutSeries([10, 20], 0, 100, 0, 100);
    expect(a!.y).toBe(100);
    expect(b!.y).toBe(0);
    expect(a!.x).toBe(0);
    expect(b!.x).toBe(100);
  });

  it('centers a flat multi-point series vertically instead of collapsing it', () => {
    const pts = layoutSeries([7, 7, 7], 0, 100, 0, 100);
    expect(pts.map((p) => p.y)).toEqual([50, 50, 50]);
    expect(pts.map((p) => p.x)).toEqual([0, 50, 100]);
  });
});

describe('smoothLinePath', () => {
  it('is empty for no points', () => {
    expect(smoothLinePath([])).toBe('');
  });

  it('emits a move-only path for a single point (no implied trend)', () => {
    const d = smoothLinePath([{ x: 50, y: 42 }]);
    expect(d).toBe('M50 42');
    expect(d).not.toContain('C');
  });

  it('draws curve segments for two or more points', () => {
    const d = smoothLinePath([
      { x: 0, y: 100 },
      { x: 100, y: 0 },
    ]);
    expect(d.startsWith('M')).toBe(true);
    expect(d).toContain('C');
  });
});

describe('smoothAreaPath', () => {
  it('is empty for no points', () => {
    expect(smoothAreaPath([], 100)).toBe('');
  });

  it('is a degenerate zero-width shape for a single point (renders nothing)', () => {
    const d = smoothAreaPath([{ x: 50, y: 42 }], 100);
    expect(d).not.toContain('C');
    expect(d.endsWith('Z')).toBe(true);
  });

  it('closes a real curve down to the baseline for two or more points', () => {
    const d = smoothAreaPath(
      [
        { x: 0, y: 100 },
        { x: 100, y: 0 },
      ],
      120,
    );
    expect(d).toContain('C');
    expect(d).toContain('120');
    expect(d.endsWith('Z')).toBe(true);
  });
});
