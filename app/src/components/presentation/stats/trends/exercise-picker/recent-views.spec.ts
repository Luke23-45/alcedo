import { beforeEach, describe, expect, it } from 'vitest';
import { clearRecentViews, getRecentViews, recordRecentView } from './recent-views';

describe('recentViews', () => {
  beforeEach(() => {
    clearRecentViews();
  });

  it('starts empty', () => {
    expect(getRecentViews()).toEqual([]);
  });

  it('records most-recent-first', () => {
    recordRecentView('Deadlift');
    recordRecentView('Barbell Row');
    expect(getRecentViews()).toEqual(['Barbell Row', 'Deadlift']);
  });

  it('de-duplicates by moving re-viewed exercises to the front', () => {
    recordRecentView('Deadlift');
    recordRecentView('Barbell Row');
    recordRecentView('Deadlift');
    expect(getRecentViews()).toEqual(['Deadlift', 'Barbell Row']);
  });

  it('caps at five', () => {
    for (const name of ['A', 'B', 'C', 'D', 'E', 'F']) {
      recordRecentView(name);
    }
    expect(getRecentViews()).toEqual(['F', 'E', 'D', 'C', 'B']);
  });

  it('ignores blank names', () => {
    recordRecentView('   ');
    expect(getRecentViews()).toEqual([]);
  });
});
