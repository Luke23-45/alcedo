import { describe, expect, it, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { combineReducers } from '@reduxjs/toolkit';
import { createAddEffectTestBed } from '@/utils/__test__/add-effect-testbed';
import { addFollowingEffects } from '@/store/feed/following-effects';
import feedReducer, { fetchAndSetSharedFeedUser, requestFollowUser } from '@/store/feed';
import { RemoteData } from '@/models/remote';
import { FeedIdentity, PendingFeedUser } from '@/models/feed-models';
import { ApiError, ApiErrorType, ApiResult } from '@/services/api-error';
import { GetUserResponse } from '@/models/feed-api-models';
import { shareRequestDisplayName, useShareRequestFlow } from './share-request-flow';
import { useAppSelector } from '@/store';
import { useDispatch } from 'react-redux';

// expo-router's import chain does not parse under vitest; stub the surface
// the flow module uses.
const { back } = vi.hoisted(() => ({ back: vi.fn() }));
vi.mock('expo-router', () => ({
  useRouter: () => ({ back }),
}));

// '@/store' pulls the native SQLite chain, which the vitest environment
// cannot load — the repo's established stand-in is a selector mock over a
// real feed slice + the real following effects (same pattern
// post-detail-simulation.spec.tsx uses).
vi.mock('@/store', () => ({ useAppSelector: vi.fn() }));
vi.mock('react-redux', () => ({ useDispatch: vi.fn() }));

/**
 * Page 12/20 — share-request (`?id=`) branch simulation.
 *
 * Drives the extracted `useShareRequestFlow` view-model against the real
 * feed slice and the real following effects with mocked API services:
 * fetch-on-mount, error + retry, accept (follow request + back), the
 * one-shot double-tap guard, accept with no feed identity, and cancel.
 *
 * What this suite does NOT cover (no device/emulator available): the actual
 * rendered Paper card layout. The branch's behavior contract is asserted
 * here through the state the flow derives.
 */

const publicKeyBytes = new Uint8Array([1, 2, 3]);
const identity = { id: 'me' } as FeedIdentity;

function userResponse(id: string): GetUserResponse {
  return { id, rsaPublicKey: publicKeyBytes } as GetUserResponse;
}

function makeBed(options?: { identityOk?: boolean; getUser?: (id: string) => Promise<ApiResult<GetUserResponse>> }) {
  const getUserAsync = vi.fn<(id: string) => Promise<ApiResult<GetUserResponse>>>(
    options?.getUser ?? (async (id: string) => ApiResult.success(userResponse(id))),
  );
  const requestToFollowAUserAsync = vi.fn().mockResolvedValue(ApiResult.success());
  const services = {
    feedApiService: { getUserAsync },
    feedFollowService: { requestToFollowAUserAsync },
  };
  const testBed = createAddEffectTestBed({
    initialState: {
      feed: {
        identity: options?.identityOk === false ? RemoteData.notAsked() : RemoteData.success(identity),
        sharedFeedUser: RemoteData.notAsked(),
        followedUsers: {},
      },
    } as never,
    services: services as never,
    reducer: combineReducers({ feed: feedReducer }),
  });
  addFollowingEffects(testBed.addEffect);
  return { testBed, services };
}

type TestBed = ReturnType<typeof makeBed>['testBed'];

function wireHooks(testBed: TestBed) {
  vi.mocked(useAppSelector).mockImplementation(((selector: never) =>
    (selector as (s: never) => unknown)(testBed.getState() as never)) as never);
  vi.mocked(useDispatch).mockImplementation((() => (action: never) => {
    // dispatch() records the action and applies the reducer; the testbed's
    // dispatchHandled() does not record the outer action, so record first,
    // then run the effects. The fetch/request actions have no reducer case,
    // so the double reducer application is a no-op for them.
    testBed.dispatch(action);
    return testBed.dispatchHandled(action);
  }) as never);
}

function isError<T>(remote: RemoteData<T>): boolean {
  return remote.match({
    loading: () => false,
    success: () => false,
    error: () => true,
    notAsked: () => false,
  });
}

beforeEach(() => {
  back.mockClear();
});

describe('fetch-on-mount', () => {
  it('dispatches fetchAndSetSharedFeedUser with the id and link name on mount', async () => {
    const { testBed } = makeBed();
    wireHooks(testBed);
    renderHook(() => useShareRequestFlow('u1', 'Mia'));
    await vi.waitFor(() => {
      expect(testBed.getState().feed.sharedFeedUser.isSuccess()).toBe(true);
    });
    const dispatched = testBed.getDispatchedAction(fetchAndSetSharedFeedUser);
    expect(dispatched.payload).toEqual({ idOrLookup: 'u1', name: 'Mia', fromUserAction: true });
  });

  it('stores the sender as a PendingFeedUser carrying the link-supplied name', async () => {
    const { testBed } = makeBed();
    wireHooks(testBed);
    const { result, rerender } = renderHook(() => useShareRequestFlow('u1', 'Mia'));
    await vi.waitFor(() => {
      expect(testBed.getState().feed.sharedFeedUser.isSuccess()).toBe(true);
    });
    rerender();
    const remote = result.current.sharedProfileRemote;
    expect(remote.isSuccess()).toBe(true);
    if (remote.isSuccess()) {
      expect(remote.data).toBeInstanceOf(PendingFeedUser);
      expect(remote.data.id).toBe('u1');
      expect(remote.data.name).toBe('Mia');
    }
  });

  it('carries an empty name when the link omits ?name=', async () => {
    const { testBed } = makeBed();
    wireHooks(testBed);
    renderHook(() => useShareRequestFlow('u1', ''));
    await vi.waitFor(() => {
      expect(testBed.getState().feed.sharedFeedUser.isSuccess()).toBe(true);
    });
    const dispatched = testBed.getDispatchedAction(fetchAndSetSharedFeedUser);
    expect(dispatched.payload).toEqual({ idOrLookup: 'u1', name: '', fromUserAction: true });
  });
});

describe('error and retry', () => {
  it('stores a retryable error when the fetch fails', async () => {
    const error: ApiError = { type: ApiErrorType.NotFound, message: 'nope', exception: undefined };
    const { testBed } = makeBed({ getUser: async () => ApiResult.fromError(error) });
    wireHooks(testBed);
    const { result, rerender } = renderHook(() => useShareRequestFlow('u1', 'Mia'));
    await vi.waitFor(() => {
      expect(isError(testBed.getState().feed.sharedFeedUser)).toBe(true);
    });
    rerender();
    expect(isError(result.current.sharedProfileRemote)).toBe(true);
  });

  it('retry re-dispatches the fetch', async () => {
    const error: ApiError = { type: ApiErrorType.NotFound, message: 'nope', exception: undefined };
    const { testBed, services } = makeBed({ getUser: async () => ApiResult.fromError(error) });
    wireHooks(testBed);
    const { result } = renderHook(() => useShareRequestFlow('u1', 'Mia'));
    await vi.waitFor(() => {
      expect(isError(testBed.getState().feed.sharedFeedUser)).toBe(true);
    });
    const callsBefore = services.feedApiService.getUserAsync.mock.calls.length;
    await act(async () => {
      result.current.fetchUser();
    });
    expect(services.feedApiService.getUserAsync.mock.calls.length).toBe(callsBefore + 1);
  });
});

describe('accept', () => {
  it('sends the follow request, records the pending follow, clears the shared user, and goes back', async () => {
    const { testBed } = makeBed();
    wireHooks(testBed);
    const { result } = renderHook(() => useShareRequestFlow('u1', 'Mia'));
    const user = new PendingFeedUser('u1', { spkiPublicKeyBytes: publicKeyBytes }, 'Mia');
    act(() => {
      result.current.handleAccept(user);
    });
    await vi.waitFor(() => {
      expect(testBed.getState().feed.followedUsers['u1']).toBeInstanceOf(PendingFeedUser);
    });
    const dispatched = testBed.getDispatchedAction(requestFollowUser);
    expect(dispatched.payload).toEqual({ user, fromUserAction: true });
    // The shared user is cleared after accept so the card cannot be re-accepted.
    expect(testBed.getState().feed.sharedFeedUser.isSuccess()).toBe(false);
    expect(back).toHaveBeenCalledTimes(1);
  });

  it('ignores a second accept (one-shot guard against double-tap)', async () => {
    const { testBed } = makeBed();
    wireHooks(testBed);
    const { result } = renderHook(() => useShareRequestFlow('u1', 'Mia'));
    const user = new PendingFeedUser('u1', { spkiPublicKeyBytes: publicKeyBytes }, 'Mia');
    act(() => {
      result.current.handleAccept(user);
      result.current.handleAccept(user);
    });
    await vi.waitFor(() => {
      expect(testBed.getState().feed.followedUsers['u1']).toBeInstanceOf(PendingFeedUser);
    });
    const followDispatches = testBed.dispatchedActions.filter((a) => a.type === requestFollowUser.type);
    expect(followDispatches).toHaveLength(1);
    expect(back).toHaveBeenCalledTimes(1);
  });

  it('does not send the follow request when there is no feed identity, but still goes back', async () => {
    const { testBed, services } = makeBed({ identityOk: false });
    wireHooks(testBed);
    const { result } = renderHook(() => useShareRequestFlow('u1', 'Mia'));
    const user = new PendingFeedUser('u1', { spkiPublicKeyBytes: publicKeyBytes }, 'Mia');
    await act(async () => {
      result.current.handleAccept(user);
    });
    expect(services.feedFollowService.requestToFollowAUserAsync).not.toHaveBeenCalled();
    expect(testBed.getState().feed.followedUsers['u1']).toBeUndefined();
    expect(back).toHaveBeenCalledTimes(1);
  });
});

describe('cancel', () => {
  it('goes back without dispatching anything', () => {
    const { testBed } = makeBed();
    wireHooks(testBed);
    const { result } = renderHook(() => useShareRequestFlow('u1', 'Mia'));
    const dispatchedBefore = testBed.dispatchedActions.length;
    act(() => {
      result.current.handleCancel();
    });
    expect(back).toHaveBeenCalledTimes(1);
    expect(testBed.dispatchedActions.length).toBe(dispatchedBefore);
  });
});

describe('shareRequestDisplayName', () => {
  it('returns the sender name when present', () => {
    expect(shareRequestDisplayName('Mia', 'Anonymous User')).toBe('Mia');
  });

  it('falls back to the translated anonymous label for empty, blank, or missing names', () => {
    expect(shareRequestDisplayName('', 'Anonymous User')).toBe('Anonymous User');
    expect(shareRequestDisplayName('   ', 'Anonymous User')).toBe('Anonymous User');
    expect(shareRequestDisplayName(undefined, 'Anonymous User')).toBe('Anonymous User');
  });
});
