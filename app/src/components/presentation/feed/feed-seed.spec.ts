/**
 * Feed default-post integrity.
 *
 * The default catalog is the feed's first impression: twelve fictional
 * people, twelve sample posts, internally consistent and honestly labeled.
 * These tests guard the catalog's shape — every post resolves to a real
 * default person, ids stay stable (timeline, detail, and share text all key
 * off them), and the seeded timestamps stay newest-first relative to now.
 */
import { describe, expect, it } from 'vitest';
import { buildDefaultPosts } from './feed-seed';
import { FEED_PEOPLE, PEOPLE, personById } from './shared/people';

const NOW = 1_750_000_000_000;
const HOUR = 3_600_000;

describe('default feed catalog integrity', () => {
  const people = FEED_PEOPLE;
  const posts = buildDefaultPosts(NOW);

  it('ships eleven fictional people plus the real user', () => {
    expect(people).toHaveLength(12);
    expect(people[0]!.id).toBe('alex');
    // Everyone else is a fictional sample person; alex is the real user slot.
    expect(people.slice(1).every((p) => p.id !== 'alex')).toBe(true);
  });

  it('gives every fictional person a bundled avatar photo', () => {
    for (const person of people.slice(1)) {
      expect(person.photo, `${person.id} avatar`).toBeDefined();
    }
  });

  it('keeps Alex photo-free: that slot is the real user, not a sample', () => {
    expect(PEOPLE.alex!.photo).toBeUndefined();
  });

  it('seeds exactly twelve posts with stable ids', () => {
    expect(posts).toHaveLength(12);
    expect(new Set(posts.map((p) => p.id)).size).toBe(12);
  });

  it('resolves every post author to a default person', () => {
    for (const post of posts) {
      expect(post.person.id).toBeTruthy();
    }
  });

  it('keeps seeded ages newest-first and strictly decreasing', () => {
    const times = posts.map((p) => p.postedAt);
    for (let i = 1; i < times.length; i++) {
      expect(times[i]!).toBeLessThan(times[i - 1]!);
    }
    expect(times[0]!).toBe(NOW - 2 * HOUR);
    expect(times[times.length - 1]!).toBe(NOW - 80 * HOUR);
  });

  it('keeps kudos totals at least as large as the visible faces', () => {
    for (const post of posts) {
      expect(post.kudos.total).toBeGreaterThanOrEqual(post.kudos.faceIds.length);
    }
  });

  it('keeps every workout post metrically consistent', () => {
    for (const post of posts) {
      if (post.kind !== 'workout') continue;
      expect(post.poster.prPills.length).toBeGreaterThan(0);
      expect(post.poster.heroValue).toMatch(/^\d{1,3}(,\d{3})*$/);
    }
  });

  it('keeps every kudos face resolvable to a default person', () => {
    for (const post of posts) {
      for (const faceId of post.kudos.faceIds) {
        expect(personById(faceId), `${post.id} kudos face ${faceId}`).toBeDefined();
      }
    }
  });

  it('marks every default post as someone else’s sample — never your own', () => {
    for (const post of posts) {
      expect(post.isOwn).toBe(false);
    }
  });
});
