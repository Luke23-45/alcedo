/**
 * Page 9/20 — Feed post detail simulation.
 *
 * Drives Screen 2's pure logic the way the real screen does: the contract
 * thread anchored to publish time, the shared 'alex' thread/kudos key both
 * screens use for the own post, the received-cheers kudos read model, the
 * model resolution for own/reference/unknown ids, the comment-count math,
 * and the delete/report/hide record lifecycle.
 * React Native is stubbed out in this repo's test setup, so the simulation
 * runs at the model/hook-logic level — the same level the shipped page-1..8
 * suites used.
 */
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, renderHook } from '@testing-library/react';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import feedReducer, { upsertReceivedReactions } from '@/store/feed';
import commentsReducer, {
  alexPostSeed,
  ensurePostSeeded,
  removePostData,
  selectPostKudos,
  selectTopLevelComments,
  togglePostKudos,
} from '@/store/feed/comments';
import { RemoteData } from '@/models/remote';
import { buildAlexKudosSeed, useOwnPostKudos, ALEX_KUDOS_SENDERS } from '../shared/own-post-kudos';
import { selectPostDetailModel } from './post-models';

// '@/store' pulls the native SQLite chain, which the vitest environment
// cannot load — the repo's established stand-in is a selector mock, the same
// pattern composer-data.spec.ts uses.
vi.mock('@/store', () => ({ useAppSelector: vi.fn(), useAppSelectorWithArg: vi.fn() }));

const PUBLISHED_AT = 1_750_000_000_000;
const MINUTE = 60_000;

/** Selectors take the slice state; cast the wrapper like the sibling specs do. */
function wrapComments(state: ReturnType<typeof commentsReducer>) {
  return { feedComments: state } as never;
}

/** Real redux store behind the mocked selectors, so dispatch works for real. */
function renderOwnPostKudos(sessionId: string | undefined, seedReactions = false) {
  const store = configureStore({
    reducer: { feed: feedReducer, feedComments: commentsReducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });
  if (seedReactions && sessionId) {
    store.dispatch(upsertReceivedReactions(buildAlexKudosSeed(sessionId)));
  }
  vi.mocked(useAppSelector).mockImplementation((selector) =>
    (selector as (s: never) => unknown)(store.getState() as never),
  );
  vi.mocked(useAppSelectorWithArg).mockImplementation((selector, arg) =>
    (selector as (s: never, a: never) => unknown)(store.getState() as never, arg as never),
  );
  const utils = renderHook(() => useOwnPostKudos(sessionId), {
    wrapper: ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>,
  });
  return { store, ...utils };
}

describe('contract thread anchors to the publish time', () => {
  it('spaces comments at the contract +3m / +7m / +9m / +15m', () => {
    const seed = alexPostSeed('alex', PUBLISHED_AT);
    const byAuthor = Object.fromEntries(seed.comments.map((c) => [c.authorId, c]));
    expect(byAuthor['mia']!.createdAt).toBe(PUBLISHED_AT + 3 * MINUTE);
    expect(byAuthor['jon']!.createdAt).toBe(PUBLISHED_AT + 7 * MINUTE);
    expect(byAuthor['sofia']!.createdAt).toBe(PUBLISHED_AT + 15 * MINUTE);
  });

  it('nests Alex\u2019s reply under Mia at +9m', () => {
    const seed = alexPostSeed('alex', PUBLISHED_AT);
    const mia = seed.comments.find((c) => c.authorId === 'mia')!;
    const reply = seed.comments.find((c) => c.authorId === 'alex')!;
    expect(reply.parentId).toBe(mia.id);
    expect(reply.createdAt).toBe(PUBLISHED_AT + 9 * MINUTE);
  });

  it('keeps the contract kudos: Mia 2, Jon 5 (kudoed), Sofia 1', () => {
    const seed = alexPostSeed('alex', PUBLISHED_AT);
    const byAuthor = Object.fromEntries(seed.comments.map((c) => [c.authorId, c]));
    expect([byAuthor['mia']!.kudos, byAuthor['mia']!.kudoed]).toEqual([2, false]);
    expect([byAuthor['jon']!.kudos, byAuthor['jon']!.kudoed]).toEqual([5, true]);
    expect([byAuthor['sofia']!.kudos, byAuthor['sofia']!.kudoed]).toEqual([1, false]);
  });

  it('renders three top-level comments, so the header reads "3 comments"', () => {
    let state = commentsReducer(
      undefined,
      ensurePostSeeded({ postId: 'alex', seed: alexPostSeed('alex', PUBLISHED_AT) }),
    );
    const topLevel = selectTopLevelComments(wrapComments(state), 'alex');
    expect(topLevel).toHaveLength(3);
    expect(topLevel.map((c) => c.authorId)).toEqual(['mia', 'jon', 'sofia']);
    state = commentsReducer(state, removePostData('alex'));
    expect(selectTopLevelComments(wrapComments(state), 'alex')).toHaveLength(0);
  });
});

describe('own-post records live under one shared key', () => {
  it("the timeline and the detail screen both seed and read the thread under 'alex'", () => {
    // Timeline mounts first…
    let state = commentsReducer(
      undefined,
      ensurePostSeeded({ postId: 'alex', seed: alexPostSeed('alex', PUBLISHED_AT) }),
    );
    // …detail mounts second: the seed is a no-op, the thread is shared.
    const reseeded = commentsReducer(
      state,
      ensurePostSeeded({ postId: 'alex', seed: alexPostSeed('alex', PUBLISHED_AT + 999) }),
    );
    expect(reseeded).toEqual(state);
    expect(selectTopLevelComments(wrapComments(reseeded), 'alex')).toHaveLength(3);
  });

  it("seeding under the feed event id would orphan the thread — the key is always 'alex'", () => {
    const state = commentsReducer(
      undefined,
      ensurePostSeeded({ postId: 'evt-123', seed: alexPostSeed('evt-123', PUBLISHED_AT) }),
    );
    expect(selectTopLevelComments(wrapComments(state), 'alex')).toHaveLength(0);
    expect(selectTopLevelComments(wrapComments(state), 'evt-123')).toHaveLength(3);
  });

  it("toggling kudos under 'alex' is visible to both screens", () => {
    let state = commentsReducer(
      undefined,
      ensurePostSeeded({ postId: 'alex', seed: alexPostSeed('alex', PUBLISHED_AT) }),
    );
    state = commentsReducer(state, togglePostKudos('alex'));
    expect(selectPostKudos(wrapComments(state), 'alex')).toEqual({
      kudoed: true,
      total: 7,
      people: ['alex', 'mia', 'jon', 'sofia'],
    });
    // Toggling under any other key leaves the shared record untouched.
    const other = commentsReducer(state, togglePostKudos('evt-123'));
    expect(selectPostKudos(wrapComments(other), 'alex')?.kudoed).toBe(true);
  });

  it('delete clears the shared thread, kudos, and seeded flag', () => {
    let state = commentsReducer(
      undefined,
      ensurePostSeeded({ postId: 'alex', seed: alexPostSeed('alex', PUBLISHED_AT) }),
    );
    state = commentsReducer(state, togglePostKudos('alex'));
    state = commentsReducer(state, removePostData('alex'));
    expect(selectPostKudos(wrapComments(state), 'alex')).toBeUndefined();
    expect(selectTopLevelComments(wrapComments(state), 'alex')).toHaveLength(0);
  });
});

describe('own-post kudos read model', () => {
  it('seeds the contract six kudos in contract order', () => {
    expect([...ALEX_KUDOS_SENDERS]).toEqual(['mia', 'jon', 'sofia', 'dev', 'lena', 'tom']);
    const seed = buildAlexKudosSeed('S-1');
    expect(seed).toHaveLength(6);
    expect(seed.map((r) => r.fromUserId)).toEqual(['mia', 'jon', 'sofia', 'dev', 'lena', 'tom']);
    expect(seed.map((r) => r.count)).toEqual([1, 1, 1, 1, 1, 1]);
    expect(new Set(seed.map((r) => r.id)).size).toBe(6);
    for (const reaction of seed) {
      expect(reaction.eventId).toBe('S-1');
    }
  });

  it('counts received cheers and shows the first three faces', () => {
    const { result } = renderOwnPostKudos('S-1', true);
    expect(result.current.kudos?.total).toBe(6);
    expect(result.current.kudos?.faces.map((p) => p.id)).toEqual(['mia', 'jon', 'sofia']);
    expect(result.current.kudos?.kudoed).toBe(false);
    expect(result.current.needsKudosSeed).toBe(false);
  });

  it('the heart toggle adds one to the received count and stays filled', () => {
    const { result, rerender } = renderOwnPostKudos('S-1', true);
    act(() => {
      result.current.toggleKudos();
    });
    // The mocked selector has no store subscription; re-invoke it explicitly.
    rerender();
    expect(result.current.kudos?.total).toBe(7);
    expect(result.current.kudos?.kudoed).toBe(true);
    act(() => {
      result.current.toggleKudos();
    });
    rerender();
    expect(result.current.kudos?.total).toBe(6);
    expect(result.current.kudos?.kudoed).toBe(false);
  });

  it('needs a kudos seed when no cheers arrived yet', () => {
    const { result } = renderOwnPostKudos('S-9');
    expect(result.current.needsKudosSeed).toBe(true);
    expect(result.current.kudos?.total).toBe(0);
  });

  it('yields no kudos without a real session (the contract fixture reads the local seed)', () => {
    const { result } = renderOwnPostKudos(undefined);
    expect(result.current.kudos).toBeUndefined();
    expect(result.current.needsKudosSeed).toBe(false);
  });
});

describe('post model resolution', () => {
  function rootState(items: unknown[] = [], ownUserId?: string) {
    return {
      feed: {
        feed: items,
        identity: ownUserId === undefined ? RemoteData.notAsked() : RemoteData.success({ id: ownUserId } as never),
      },
    } as never;
  }

  it("resolves 'alex' to the own post with the contract thread", () => {
    const model = selectPostDetailModel(rootState(), 'alex');
    expect(model?.isOwn).toBe(true);
    expect(model?.authorId).toBe('alex');
    expect(model?.seedThread).toBe(true);
    expect(model?.commentCountBase).toBe(0);
  });

  it('resolves a real published event to the own post, keyed by its event id', () => {
    const item = {
      userId: 'user-1',
      eventId: 'evt-123',
      timestamp: { toEpochMilli: () => PUBLISHED_AT },
      session: { id: 'S-1' },
    };
    const model = selectPostDetailModel(rootState([item], 'user-1'), 'evt-123');
    expect(model?.isOwn).toBe(true);
    // The model id is the event id; the screen still keys local records 'alex'.
    expect(model?.id).toBe('evt-123');
    expect(model?.session).toEqual({ id: 'S-1' });
  });

  it('resolves the default posts with their contract metadata', () => {
    const mia = selectPostDetailModel(rootState(), 'mia-squat-pr');
    const jon = selectPostDetailModel(rootState(), 'jon-100-sessions');
    const sofia = selectPostDetailModel(rootState(), 'sofia-deadlift-video');
    expect(mia?.isOwn).toBe(false);
    expect(mia?.commentCountBase).toBe(5);
    expect(mia?.kudosSeed).toEqual({ total: 14, people: ['alex', 'jon', 'sofia'] });
    expect(jon?.commentCountBase).toBe(11);
    expect(jon?.kudosSeed.total).toBe(32);
    expect(sofia?.commentCountBase).toBe(6);
    expect(sofia?.kudosSeed.total).toBe(27);
    for (const model of [mia, jon, sofia]) {
      expect(model?.seedThread).toBe(false);
      expect(model?.caption).toBeTruthy();
    }
  });

  it('unknown ids resolve to nothing — the route renders "item unavailable"', () => {
    expect(selectPostDetailModel(rootState(), 'nope')).toBeUndefined();
    expect(selectPostDetailModel(rootState(), '')).toBeUndefined();
  });
});

describe('comment count math', () => {
  it('shows 3 for the own post: base 0 plus the three seeded top-level comments', () => {
    const state = commentsReducer(
      undefined,
      ensurePostSeeded({ postId: 'alex', seed: alexPostSeed('alex', PUBLISHED_AT) }),
    );
    const model = selectPostDetailModel({ feed: { feed: [], identity: RemoteData.notAsked() } } as never, 'alex');
    const count = (model?.commentCountBase ?? 0) + selectTopLevelComments(wrapComments(state), 'alex').length;
    expect(count).toBe(3);
  });

  it('shows the contract counts for default posts, whose threads stay honestly empty', () => {
    const state = commentsReducer(
      undefined,
      ensurePostSeeded({
        postId: 'mia-squat-pr',
        seed: { comments: [], kudos: { kudoed: false, total: 14, people: ['alex', 'jon', 'sofia'] } },
      }),
    );
    const model = selectPostDetailModel(
      { feed: { feed: [], identity: RemoteData.notAsked() } } as never,
      'mia-squat-pr',
    );
    const count = (model?.commentCountBase ?? 0) + selectTopLevelComments(wrapComments(state), 'mia-squat-pr').length;
    expect(count).toBe(5);
    expect(selectTopLevelComments(wrapComments(state), 'mia-squat-pr')).toHaveLength(0);
  });
});
