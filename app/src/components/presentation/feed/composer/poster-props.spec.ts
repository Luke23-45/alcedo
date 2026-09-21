import { describe, expect, it } from 'vitest';
import { buildPosterProps, countHiddenStats, countVisibleStats } from './poster-props';
import type { ComposerSessionData } from './composer-data';
import type { ComposerStatKey } from './composer-types';

const data: ComposerSessionData = {
  sessionId: 'session-1',
  name: 'Push Day',
  kindLabel: 'Strength',
  volumeLabel: '8,420',
  volumeUnit: 'kg',
  durationLabel: '45:12',
  setsLabel: '19',
  kicker: 'KINETIC · MONDAY, JUNE 9',
  prPills: ['SHOULDER PRESS PR', 'VOLUME PR', '13-DAY STREAK'],
};

function visible(...keys: ComposerStatKey[]): Record<ComposerStatKey, boolean> {
  return {
    volume: keys.includes('volume'),
    duration: keys.includes('duration'),
    sets: keys.includes('sets'),
    prs: keys.includes('prs'),
    reps: keys.includes('reps'),
    heartrate: keys.includes('heartrate'),
    notes: keys.includes('notes'),
    rpe: keys.includes('rpe'),
  };
}

describe('buildPosterProps toggle rule', () => {
  it('uses volume as the hero with its unit when enabled', () => {
    const poster = buildPosterProps(data, 'ember', visible('volume', 'duration', 'sets', 'prs'));
    expect(poster.heroValue).toBe('8,420');
    expect(poster.heroUnit).toBe('kg');
    expect(poster.duration).toBe('45:12');
    expect(poster.sets).toBe('19');
    expect(poster.prPills).toHaveLength(3);
    expect(poster.workoutName).toBe('Push Day · Strength');
  });

  it('promotes duration to hero with no unit when volume is off; sets stay pinned', () => {
    const poster = buildPosterProps(data, 'ember', visible('duration', 'sets', 'prs'));
    expect(poster.heroValue).toBe('45:12');
    expect(poster.heroUnit).toBe('');
    // Duration leaves its grid column when it becomes the hero…
    expect(poster.duration).toBe('');
    // …but sets stay pinned to their original column.
    expect(poster.sets).toBe('19');
  });

  it('promotes sets to hero with no unit when volume and duration are off', () => {
    const poster = buildPosterProps(data, 'ember', visible('sets', 'prs'));
    expect(poster.heroValue).toBe('19');
    expect(poster.heroUnit).toBe('');
    expect(poster.duration).toBe('');
    expect(poster.sets).toBe('');
  });

  it('renders an honest em dash hero when volume, duration, and sets are all off', () => {
    const poster = buildPosterProps(data, 'ember', visible('prs'));
    expect(poster.heroValue).toBe('—');
    expect(poster.heroUnit).toBe('');
  });

  it('drops PR pills when prs is off; reps/heartrate/notes/rpe never reach the poster', () => {
    const poster = buildPosterProps(
      data,
      'ember',
      visible('volume', 'duration', 'sets', 'reps', 'heartrate', 'notes', 'rpe'),
    );
    expect(poster.prPills).toEqual([]);
    expect(poster.heroValue).toBe('8,420');
  });
});

describe('stat counts', () => {
  it('counts visible and hidden stats for the CTA caption', () => {
    const v = visible('volume', 'duration', 'sets', 'prs');
    expect(countVisibleStats(v)).toBe(4);
    expect(countHiddenStats(v)).toBe(4);
  });
});
