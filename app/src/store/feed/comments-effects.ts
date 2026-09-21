import {
  addComment,
  ensurePostSeeded,
  hydrateFeedComments,
  initializeFeedComments,
  removePostData,
  toggleCommentKudos,
  togglePostKudos,
  type FeedCommentsState,
} from '@/store/feed/comments';
import type { AddEffectFn } from '@/store/store';

const STORAGE_KEY = 'feed.comments.v1';

function isPlausibleState(value: unknown): value is FeedCommentsState {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return (
    typeof v.comments === 'object' &&
    v.comments !== null &&
    typeof v.postKudos === 'object' &&
    v.postKudos !== null &&
    Array.isArray(v.seededPosts)
  );
}

/**
 * Persistence for the local comment threads: the whole slice is written as
 * one JSON blob to the key-value store on every mutation, and read back once
 * at startup. Mirrors how stored-sessions persists its small flags — no new
 * drizzle table, no migration, and no change to any existing slice.
 */
export function addFeedCommentEffects(addEffect: AddEffectFn) {
  addEffect(initializeFeedComments, async (_, { dispatch, extra: { keyValueStore, logger } }) => {
    try {
      const raw = await keyValueStore.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isPlausibleState(parsed)) {
          dispatch(hydrateFeedComments(parsed));
          return;
        }
        logger.error('Feed comments payload failed validation; starting fresh', { raw });
      }
    } catch (e) {
      logger.error('Failed to load feed comments', e);
    }
    dispatch(hydrateFeedComments({ isHydrated: false, seededPosts: [], comments: {}, postKudos: {} }));
  });

  addEffect(
    [addComment, toggleCommentKudos, togglePostKudos, ensurePostSeeded, removePostData],
    async (_, { getState, extra: { keyValueStore, logger } }) => {
      const slice = getState().feedComments;
      if (!slice.isHydrated) {
        return;
      }
      try {
        await keyValueStore.setItem(STORAGE_KEY, JSON.stringify(slice));
      } catch (e) {
        logger.error('Failed to persist feed comments', e);
      }
    },
  );
}
