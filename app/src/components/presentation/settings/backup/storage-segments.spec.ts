import { describe, expect, it } from 'vitest';
import { STORAGE_BAR_WIDTH, STORAGE_SEGMENTS } from './storage-segments';

describe('storage bar segments (settings-dark.md Screen 6)', () => {
  it('sums to exactly the 321pt bar width', () => {
    const total = STORAGE_SEGMENTS.reduce((sum, seg) => sum + seg.flex, 0);
    expect(total).toBeCloseTo(STORAGE_BAR_WIDTH, 10);
  });

  it('keeps the spec-exact proportions: 9.6 / 252.3 / 59.1', () => {
    expect(STORAGE_SEGMENTS.map((s) => s.flex)).toEqual([9.6, 252.3, 59.1]);
  });

  it('never inflates the 2.9% remote-backup sliver', () => {
    const [remote] = STORAGE_SEGMENTS;
    expect(remote.flex / STORAGE_BAR_WIDTH).toBeLessThan(0.03);
  });

  it('provides a dark and a light color per segment', () => {
    for (const seg of STORAGE_SEGMENTS) {
      expect(seg.dark).toMatch(/^#/);
      expect(seg.light).toMatch(/^#/);
      expect(seg.light).not.toBe(seg.dark);
    }
  });
});
