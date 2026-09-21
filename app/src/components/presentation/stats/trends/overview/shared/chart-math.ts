/** Pure SVG chart math for the Trends overview. No React, no theme. */

export interface Pt {
  x: number;
  y: number;
}

const f = (n: number): string => (Math.round(n * 100) / 100).toString();

/**
 * Lay `values` out across [x0, x1], mapping [min(values), max(values)]
 * onto [yBottom, yTop]. A flat series centers vertically instead of
 * collapsing onto one edge.
 */
export function layoutSeries(
  values: number[],
  x0: number,
  x1: number,
  yTop: number,
  yBottom: number,
): Pt[] {
  const n = values.length;
  if (n === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  return values.map((v, i) => ({
    x: n === 1 ? (x0 + x1) / 2 : x0 + (i * (x1 - x0)) / (n - 1),
    y:
      span === 0
        ? (yTop + yBottom) / 2
        : yBottom - ((v - min) / span) * (yBottom - yTop),
  }));
}

/** Catmull-Rom → cubic Bézier smooth line through the points. */
export function smoothLinePath(pts: Pt[]): string {
  if (pts.length === 0) return '';
  const first = pts[0]!;
  if (pts.length === 1) return `M${f(first.x)} ${f(first.y)}`;
  let d = `M${f(first.x)} ${f(first.y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[Math.min(pts.length - 1, i + 2)]!;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2.x)} ${f(p2.y)}`;
  }
  return d;
}

/** Smooth line closed down to `baseY` for the area fill. */
export function smoothAreaPath(pts: Pt[], baseY: number): string {
  if (pts.length === 0) return '';
  const first = pts[0]!;
  const last = pts[pts.length - 1]!;
  return `${smoothLinePath(pts)} L${f(last.x)} ${f(baseY)} L${f(first.x)} ${f(baseY)} Z`;
}
