/**
 * Page 2/20 — Active workout flow simulation: rest timer states.
 *
 * Drives the rest timer's pure countdown state machine through every phase
 * the live screen can render: resting (first segment draining), ready
 * (inside the min–max window), over (past the max), paused (frozen), failed
 * (single longer window), and fixed (min === max target). The reference
 * mid-session capture pins 00:42 remaining of 60 seconds — the numbers below
 * pin the same math.
 */
import { describe, expect, it } from 'vitest';
import { Duration, OffsetDateTime, ZoneOffset } from '@js-joda/core';
import { Rest } from '@/models/blueprint-models';
import { getRestTimerState } from './rest-timer-state';

const start = OffsetDateTime.of(2026, 9, 22, 10, 0, 0, 0, ZoneOffset.UTC);
const after = (seconds: number) => start.plusSeconds(seconds);

function state(args: {
  rest?: Rest;
  failed?: boolean;
  pausedAt?: OffsetDateTime;
  adjustMs?: number;
  now?: OffsetDateTime;
}) {
  return getRestTimerState({
    rest: args.rest ?? Rest.short, // 60s min, 90s max, 180s failure
    startTime: start,
    pausedAt: args.pausedAt,
    failed: args.failed ?? false,
    adjustMs: args.adjustMs ?? 0,
    now: args.now ?? after(18),
  });
}

describe('resting phase', () => {
  it('counts down the first segment with exact remaining time', () => {
    const s = state({});
    expect(s.phase).toBe('resting');
    expect(s.remainingMs).toBe(42_000); // the spec's 00:42 of 60
    expect(s.elapsedMs).toBe(18_000);
    expect(s.restProgress).toBeCloseTo(0.3, 10);
  });

  it('rings the exact fraction the SVG ring drains from', () => {
    // RestTimer drains dash = (1 − restProgress) × 163.36.
    const s = state({ now: after(18) });
    const dash = (1 - s.restProgress) * 163.36;
    expect(dash).toBeCloseTo(114.35, 2);
  });

  it('a failed set earns a single longer window, not the normal 60–90', () => {
    const s = state({ failed: true, now: after(100) });
    expect(s.phase).toBe('resting');
    expect(s.windowStart).toBe(180_000);
    expect(s.windowEnd).toBeUndefined();
    expect(s.remainingMs).toBe(80_000);
  });

  it('the −15/+15 nudge never drives elapsed below zero', () => {
    const s = state({ adjustMs: -1_000_000 });
    expect(s.elapsedMs).toBe(0);
    expect(s.phase).toBe('resting');
    expect(s.remainingMs).toBe(60_000);
  });

  it('a +15 nudge extends the remaining time by exactly 15 seconds', () => {
    const s = state({ adjustMs: 15_000 });
    expect(s.remainingMs).toBe(27_000);
  });
});

describe('ready and over phases', () => {
  it('enters ready inside the min–max window with a full ring', () => {
    const s = state({ now: after(75) });
    expect(s.phase).toBe('ready');
    expect(s.remainingMs).toBe(0);
    expect(s.restProgress).toBe(1);
    expect(s.windowStart).toBe(60_000);
    expect(s.windowEnd).toBe(90_000);
  });

  it('goes over once the max passes', () => {
    const s = state({ now: after(95) });
    expect(s.phase).toBe('over');
    expect(s.remainingMs).toBe(0);
  });

  it('a fixed rest (min === max) jumps straight from resting to over', () => {
    const fixed: Rest = {
      minRest: Duration.ofSeconds(60),
      maxRest: Duration.ofSeconds(60),
      failureRest: Duration.ofSeconds(180),
    };
    expect(state({ rest: fixed, now: after(59) }).phase).toBe('resting');
    const s = state({ rest: fixed, now: after(61) });
    expect(s.phase).toBe('over');
    expect(s.windowEnd).toBeUndefined();
  });

  it('a failed rest never shows a ready window', () => {
    const s = state({ failed: true, now: after(181) });
    expect(s.phase).toBe('over');
    expect(s.windowEnd).toBeUndefined();
  });
});

describe('paused timer', () => {
  it('freezes elapsed at the pause moment no matter how much time passes', () => {
    const s = state({ pausedAt: after(18), now: after(100) });
    expect(s.phase).toBe('resting');
    expect(s.elapsedMs).toBe(18_000);
    expect(s.remainingMs).toBe(42_000);
  });
});

describe('medium and long rest presets', () => {
  it('uses the configured window bounds', () => {
    const s = state({ rest: Rest.medium, now: after(80) });
    expect(s.phase).toBe('resting');
    expect(s.windowStart).toBe(90_000);
    expect(s.windowEnd).toBe(180_000);
    expect(s.remainingMs).toBe(10_000);

    const ready = state({ rest: Rest.medium, now: after(120) });
    expect(ready.phase).toBe('ready');
  });
});
