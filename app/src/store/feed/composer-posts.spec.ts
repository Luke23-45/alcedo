import { describe, expect, it, vi } from 'vitest';
import { combineReducers } from '@reduxjs/toolkit';
import { createAddEffectTestBed } from '@/utils/__test__/add-effect-testbed';
import { initializeAppStateSlice } from '@/store/app';
import {
  applyComposerPostsEffects,
  composerPostsReducer,
  hydrateComposerPosts,
  parseComposerPosts,
  publishComposerPost,
  removeComposerPost,
  selectComposerPosts,
  selectComposerPostsHydrated,
  serializeComposerPosts,
  type ComposerPost,
} from './composer-posts';

function draft(overrides: Partial<ComposerPost> = {}): Omit<ComposerPost, 'id'> {
  return {
    sessionId: 'session-1',
    theme: 'ember',
    visibleStats: ['volume', 'duration', 'sets', 'prs'],
    caption: 'Volume up 18% on last push day — shoulder press finally moved.',
    taggedIds: ['mia', 'jon'],
    audience: 'friends',
    postedAt: 1_750_000_000_000,
    ...overrides,
  };
}

function stored(overrides: Partial<ComposerPost> = {}): ComposerPost {
  return { id: 'post-1', ...draft(), ...overrides } as ComposerPost;
}

describe('parseComposerPosts', () => {
  it('round-trips valid posts', () => {
    const posts = [stored(), stored({ id: 'post-2', theme: 'aurora' })];
    expect(parseComposerPosts(serializeComposerPosts(posts))).toEqual(posts);
  });

  it('returns [] for corrupt JSON, non-arrays, and empty input', () => {
    expect(parseComposerPosts('not json')).toEqual([]);
    expect(parseComposerPosts('{"posts": []}')).toEqual([]);
    expect(parseComposerPosts('')).toEqual([]);
  });

  it('drops corrupt rows but keeps valid ones', () => {
    const valid = stored();
    const raw = JSON.stringify([valid, { id: 42 }, null, { ...valid, id: 'post-2', theme: 'nope' }]);
    expect(parseComposerPosts(raw)).toEqual([valid]);
  });
});

describe('composerPostsReducer', () => {
  it('publishes newest-first with a generated id', () => {
    let state = composerPostsReducer(undefined, publishComposerPost(draft()));
    const first = selectComposerPosts({ composerPosts: state } as never)[0]!;
    expect(first.sessionId).toBe('session-1');
    expect(typeof first.id).toBe('string');
    expect(first.id.length).toBeGreaterThan(0);

    state = composerPostsReducer(state, publishComposerPost(draft({ sessionId: 'session-2' })));
    const posts = selectComposerPosts({ composerPosts: state } as never);
    expect(posts.map((p) => p.sessionId)).toEqual(['session-2', 'session-1']);
    expect(posts[0]!.id).not.toBe(posts[1]!.id);
  });

  it('removes a post by id and leaves the rest', () => {
    let state = composerPostsReducer(undefined, hydrateComposerPosts([stored(), stored({ id: 'post-2' })]));
    state = composerPostsReducer(state, removeComposerPost('post-1'));
    expect(selectComposerPosts({ composerPosts: state } as never).map((p) => p.id)).toEqual(['post-2']);
  });

  it('hydrate marks the slice hydrated; initial state is not', () => {
    expect(
      selectComposerPostsHydrated({ composerPosts: composerPostsReducer(undefined, { type: 'x' }) } as never),
    ).toBe(false);
    const hydrated = composerPostsReducer(undefined, hydrateComposerPosts([stored()]));
    expect(selectComposerPostsHydrated({ composerPosts: hydrated } as never)).toBe(true);
    expect(selectComposerPosts({ composerPosts: hydrated } as never)).toHaveLength(1);
  });
});

describe('composer posts effects', () => {
  function bed(keyValue: { getItem?: unknown; setItem?: unknown } = {}) {
    const keyValueStore = {
      getItem: vi.fn().mockResolvedValue(keyValue.getItem),
      setItem: vi.fn().mockResolvedValue(undefined),
    };
    const testBed = createAddEffectTestBed({
      reducer: combineReducers({ composerPosts: composerPostsReducer }),
      services: { keyValueStore },
    });
    applyComposerPostsEffects(testBed.addEffect);
    return { ...testBed, keyValueStore };
  }

  it('hydrates persisted posts on app start', async () => {
    const posts = [stored()];
    const { dispatchHandled, getDispatchedAction, keyValueStore } = bed({
      getItem: serializeComposerPosts(posts),
    });
    await dispatchHandled(initializeAppStateSlice());
    expect(keyValueStore.getItem).toHaveBeenCalledWith('ComposerPostsV1');
    expect(getDispatchedAction(hydrateComposerPosts).payload).toEqual(posts);
  });

  it('hydrates to [] when nothing was persisted', async () => {
    const { dispatchHandled, getDispatchedAction } = bed({ getItem: undefined });
    await dispatchHandled(initializeAppStateSlice());
    expect(getDispatchedAction(hydrateComposerPosts).payload).toEqual([]);
  });

  it('persists the newest-first list after publish and after remove', async () => {
    const { dispatchHandled, keyValueStore, getState } = bed({ getItem: undefined });
    await dispatchHandled(publishComposerPost(draft()));
    await dispatchHandled(publishComposerPost(draft({ sessionId: 'session-2' })));

    expect(keyValueStore.setItem).toHaveBeenCalledTimes(2);
    const lastWrite = keyValueStore.setItem.mock.calls[1]![1] as string;
    const written = parseComposerPosts(lastWrite);
    expect(written.map((p) => p.sessionId)).toEqual(['session-2', 'session-1']);

    const [first] = selectComposerPosts(getState());
    await dispatchHandled(removeComposerPost(first!.id));
    const afterRemove = parseComposerPosts(keyValueStore.setItem.mock.calls[2]![1] as string);
    expect(afterRemove.map((p) => p.sessionId)).toEqual(['session-1']);
  });
});
