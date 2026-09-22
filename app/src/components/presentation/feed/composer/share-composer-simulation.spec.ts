import { LocalDate, OffsetDateTime } from '@js-joda/core';
import { describe, expect, it, vi } from 'vitest';

// composer-draft hooks into expo-router's useFocusEffect; the router module
// does not parse under vitest, so stub the hook surface the module uses.
vi.mock('expo-router', () => ({
  useFocusEffect: () => {},
}));
import {
  latestSession,
  deriveComposerSessionData,
  type ComposerFormatDate,
  type ComposerFormatNumber,
} from './composer-data';
import { clearComposerDraft, readComposerDraft, writeComposerDraft } from '../shared/composer-draft';
import { tagFeedPerson } from '../shared/tag-person';
import type { KeyValueStore } from '@/services/key-value-store';
import feedReducer, { addFollower, putFollowedUser, selectMutualFriendCount, selectMutualFriends } from '@/store/feed';
import {
  composerPostsReducer,
  hydrateComposerPosts,
  parseComposerPosts,
  publishComposerPost,
  serializeComposerPosts,
} from '@/store/feed/composer-posts';
import type { RootState } from '@/store';
import type { AesKey, RsaPublicKey } from '@/models/encryption-models';
import { FollowedFeedUser, FollowerFeedUser } from '@/models/feed-models';
import { Session } from '@/models/session-models/session';
import { SessionBlueprint } from '@/models/blueprint-models';
import { RecordedWeightedExercise } from '@/models/session-models/recorded-weighted-exercise';
import { Weight } from '@/models/weight';
import { makeRecordedExercise, makeWeightedBlueprint } from '@/models/session-models/__test__/helpers';
import { uuid } from '@/utils/uuid';

/**
 * Page 10/20 — Share Composer simulation.
 *
 * Covers the composer's pure state surface: recorded-only session
 * attachment, session-scoped draft persistence, publish + hydration, the
 * real mutual-friend selectors behind the audience count and tag picker,
 * locale-aware number grouping, and the tag identity helper.
 *
 * What this suite does NOT cover (no device/emulator available): the actual
 * rendered layout, the sticky CTA scroll behavior, keyboard avoidance, the
 * LIVE pulse under reduced motion, and sheet animations. The component
 * contract those visuals implement is asserted here through the state the
 * smart container derives.
 */

const enUsFormatDate: ComposerFormatDate = (date, opts) =>
  new Intl.DateTimeFormat('en-US', opts).format(new Date(date.year(), date.month().ordinal(), date.dayOfMonth()));
const enUsFormatNumber: ComposerFormatNumber = (value) => new Intl.NumberFormat('en-US').format(value);

// ---------------------------------------------------------------------------
// Session fixtures
// ---------------------------------------------------------------------------

function recordedSession(atIso: string): Session {
  const bp = makeWeightedBlueprint({ name: 'Bench Press' });
  const at = OffsetDateTime.parse(atIso);
  const exercise = makeRecordedExercise(bp, [10, 10, 10], new Weight(100, 'kilograms'), () => at);
  return new Session(
    uuid(),
    new SessionBlueprint('Push Day', [bp], ''),
    [exercise],
    LocalDate.parse(atIso.slice(0, 10)),
    undefined,
    undefined,
  );
}

function plannedSession(date: LocalDate): Session {
  const bp = makeWeightedBlueprint({ name: 'Squat' });
  const exercise = RecordedWeightedExercise.empty(bp, 'kilograms');
  return new Session(uuid(), new SessionBlueprint('Leg Day', [bp], ''), [exercise], date, undefined, undefined);
}

// ---------------------------------------------------------------------------
// latestSession — recorded only, never a planned fallback
// ---------------------------------------------------------------------------

describe('latestSession', () => {
  it('returns undefined when there are no sessions', () => {
    expect(latestSession([])).toBeUndefined();
  });

  it('returns undefined when sessions exist but none are recorded (no unstarted fallback)', () => {
    // Regression: the old implementation fell back to unstarted sessions,
    // which let the composer attach (and publish stats for) a workout that
    // never happened.
    const planned = plannedSession(LocalDate.of(2026, 9, 21));
    expect(latestSession([planned])).toBeUndefined();
  });

  it('picks the newest recorded session among mixed recorded and planned sessions', () => {
    const older = recordedSession('2026-09-19T10:00:00Z');
    const newer = recordedSession('2026-09-20T10:00:00Z');
    const planned = plannedSession(LocalDate.of(2026, 9, 22));
    expect(latestSession([older, planned, newer])?.id).toBe(newer.id);
  });

  it('ignores a planned session newer than every recorded session', () => {
    const recorded = recordedSession('2026-09-20T10:00:00Z');
    const planned = plannedSession(LocalDate.of(2026, 9, 22));
    expect(latestSession([planned, recorded])?.id).toBe(recorded.id);
  });
});

// ---------------------------------------------------------------------------
// Composer draft persistence — session-scoped, corruption-safe
// ---------------------------------------------------------------------------

function memoryStore(): KeyValueStore {
  const map = new Map<string, string>();
  return {
    getItem: async (key: string) => map.get(key),
    setItem: async (key: string, value: string) => {
      map.set(key, value);
    },
    removeItem: async (key: string) => {
      map.delete(key);
    },
  } as unknown as KeyValueStore;
}

describe('composer draft', () => {
  it('round-trips a caption for its session', async () => {
    const store = memoryStore();
    await writeComposerDraft(store, { caption: 'Volume up 18%', updatedAt: 1, sessionId: 's1' });
    const draft = await readComposerDraft(store, 's1');
    expect(draft?.caption).toBe('Volume up 18%');
    expect(draft?.sessionId).toBe('s1');
  });

  it('does not leak a draft across sessions', async () => {
    const store = memoryStore();
    await writeComposerDraft(store, { caption: 'Last week', updatedAt: 1, sessionId: 's-old' });
    // This week's composer must open empty, not with last week's caption.
    expect(await readComposerDraft(store, 's-new')).toBeNull();
  });

  it('reads without a session scope when the caller does not scope (timeline back-compat)', async () => {
    const store = memoryStore();
    await writeComposerDraft(store, { caption: 'Hello', updatedAt: 1, sessionId: 's1' });
    expect((await readComposerDraft(store))?.caption).toBe('Hello');
  });

  it('treats an empty or whitespace caption as no draft', async () => {
    const store = memoryStore();
    await writeComposerDraft(store, { caption: '   ', updatedAt: 1, sessionId: 's1' });
    expect(await readComposerDraft(store, 's1')).toBeNull();
  });

  it('returns null for corrupt stored JSON', async () => {
    const store = memoryStore();
    await store.setItem('FeedShareComposerDraftV1', '{not json');
    expect(await readComposerDraft(store, 's1')).toBeNull();
  });

  it('returns null for a legacy draft without a session id', async () => {
    const store = memoryStore();
    await store.setItem('FeedShareComposerDraftV1', JSON.stringify({ caption: 'Legacy', updatedAt: 1 }));
    expect(await readComposerDraft(store, 's1')).toBeNull();
  });

  it('clear removes the draft', async () => {
    const store = memoryStore();
    await writeComposerDraft(store, { caption: 'Draft', updatedAt: 1, sessionId: 's1' });
    await clearComposerDraft(store);
    expect(await readComposerDraft(store, 's1')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Publishing — local post, newest first, hydration-safe
// ---------------------------------------------------------------------------

describe('publishComposerPost', () => {
  it('stores the published post newest-first with a generated id', () => {
    let state = composerPostsReducer(undefined, { type: '@@INIT' });
    state = composerPostsReducer(
      state,
      publishComposerPost({
        sessionId: 's1',
        theme: 'ember',
        visibleStats: ['volume', 'duration'],
        caption: 'First',
        taggedIds: ['u1'],
        audience: 'friends',
        postedAt: 100,
      }),
    );
    state = composerPostsReducer(
      state,
      publishComposerPost({
        sessionId: 's2',
        theme: 'slate',
        visibleStats: ['sets'],
        caption: '',
        taggedIds: [],
        audience: 'public',
        postedAt: 200,
      }),
    );
    expect(state.posts).toHaveLength(2);
    expect(state.posts[0]!.caption).toBe('');
    expect(state.posts[0]!.theme).toBe('slate');
    expect(state.posts[1]!.caption).toBe('First');
    expect(state.posts[0]!.id).not.toBe(state.posts[1]!.id);
  });

  it('persists the composer choices the preview showed', () => {
    let state = composerPostsReducer(undefined, { type: '@@INIT' });
    state = composerPostsReducer(
      state,
      publishComposerPost({
        sessionId: 's1',
        theme: 'aurora',
        visibleStats: ['volume', 'prs'],
        caption: 'PR day',
        taggedIds: ['u1', 'u2'],
        audience: 'private',
        postedAt: 300,
      }),
    );
    const post = state.posts[0]!;
    expect(post.visibleStats).toEqual(['volume', 'prs']);
    expect(post.taggedIds).toEqual(['u1', 'u2']);
    expect(post.audience).toBe('private');
  });

  it('serialize/parse round-trips and skips corrupt entries on hydrate', () => {
    let state = composerPostsReducer(undefined, { type: '@@INIT' });
    state = composerPostsReducer(
      state,
      publishComposerPost({
        sessionId: 's1',
        theme: 'ember',
        visibleStats: ['volume'],
        caption: 'Keep me',
        taggedIds: [],
        audience: 'friends',
        postedAt: 400,
      }),
    );
    const raw = serializeComposerPosts(state.posts);
    const parsed = JSON.parse(raw) as unknown[];
    parsed.push({ bogus: true });
    const hydrated = parseComposerPosts(JSON.stringify(parsed));
    expect(hydrated).toHaveLength(1);
    expect(hydrated[0]!.caption).toBe('Keep me');

    const rehydrated = composerPostsReducer(undefined, hydrateComposerPosts(hydrated));
    expect(rehydrated.isHydrated).toBe(true);
    expect(rehydrated.posts).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// Mutual friends — the real count behind "Sharing with N friends"
// ---------------------------------------------------------------------------

const rsaKey = { spkiPublicKeyBytes: new Uint8Array([1, 2, 3]) } as RsaPublicKey;
const aesKey = {} as AesKey;

function feedStateWith({ followers, followed }: { followers: FollowerFeedUser[]; followed: FollowedFeedUser[] }) {
  let state = feedReducer(undefined, { type: '@@INIT' });
  for (const follower of followers) {
    state = feedReducer(state, addFollower(follower));
  }
  for (const user of followed) {
    state = feedReducer(state, putFollowedUser(user));
  }
  return { feed: state } as unknown as RootState;
}

function follower(id: string, name: string | undefined) {
  return new FollowerFeedUser(id, rsaKey, name, 'secret');
}

function followed(id: string, name: string | undefined) {
  return new FollowedFeedUser(id, rsaKey, name, undefined, aesKey, 'secret');
}

describe('mutual friends', () => {
  it('lists mutual friends with names for the tag picker', () => {
    const root = feedStateWith({
      followers: [follower('u1', 'Bob'), follower('u2', 'Cara'), follower('u3', undefined)],
      followed: [followed('u1', 'Bob'), followed('u2', 'Cara'), followed('u4', 'Dan')],
    });
    // u1 and u2 are mutual; u3 follows but is not followed back; u4 is
    // followed but does not follow back.
    expect(selectMutualFriends(root)).toEqual([
      { id: 'u1', name: 'Bob' },
      { id: 'u2', name: 'Cara' },
    ]);
  });

  it('excludes mutual friends without a name from the taggable list', () => {
    const root = feedStateWith({
      followers: [follower('u1', undefined)],
      followed: [followed('u1', undefined)],
    });
    // Still counts as a friend for the audience, but a tag row needs a name.
    expect(selectMutualFriends(root)).toEqual([]);
    expect(selectMutualFriendCount(root)).toBe(1);
  });

  it('counts every mutual friend, including unnamed ones', () => {
    const root = feedStateWith({
      followers: [follower('u1', 'Bob'), follower('u2', 'Cara')],
      followed: [followed('u1', 'Bob')],
    });
    expect(selectMutualFriendCount(root)).toBe(1);
  });

  it('is zero with no social graph', () => {
    const root = feedStateWith({ followers: [], followed: [] });
    expect(selectMutualFriends(root)).toEqual([]);
    expect(selectMutualFriendCount(root)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Locale-aware number grouping on the poster
// ---------------------------------------------------------------------------

describe('deriveComposerSessionData volume label', () => {
  it('groups through the caller-supplied formatter, not a hard-coded locale', () => {
    const session = recordedSession('2026-09-20T10:00:00Z');
    const deFormatNumber: ComposerFormatNumber = (value) => new Intl.NumberFormat('de-DE').format(value);
    const data = deriveComposerSessionData(session, [session], new Map(), enUsFormatDate, deFormatNumber);
    // 100 kg × 10 reps × 3 sets = 3,000 kg, grouped the German way.
    expect(data.volumeLabel).toBe('3.000');
  });

  it('keeps en-US grouping when the caller passes the en-US formatter', () => {
    const session = recordedSession('2026-09-20T10:00:00Z');
    const data = deriveComposerSessionData(session, [session], new Map(), enUsFormatDate, enUsFormatNumber);
    expect(data.volumeLabel).toBe('3,000');
  });
});

// ---------------------------------------------------------------------------
// Tag identity — real people, honest presentation
// ---------------------------------------------------------------------------

describe('tagFeedPerson', () => {
  it('derives the initial from the name', () => {
    expect(tagFeedPerson({ id: 'u1', name: 'bob' }).initial).toBe('B');
  });

  it('falls back to ? for a blank name', () => {
    expect(tagFeedPerson({ id: 'u1', name: '  ' }).initial).toBe('?');
  });

  it('uses a neutral fill with no invented handle or gradient', () => {
    const person = tagFeedPerson({ id: 'u1', name: 'Bob' });
    expect(person.handle).toBe('');
    expect(person.gradient).toBeNull();
    expect(person.name).toBe('Bob');
  });
});
