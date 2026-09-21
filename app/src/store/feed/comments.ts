import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { uuid } from '@/utils/uuid';

/**
 * Local, persisted comment threads for the Phase 5 feed post-detail screen.
 *
 * The encrypted feed backend has no comment primitive, so threads live here:
 * a small standalone slice (new key on the root state — no existing store
 * shape is altered) persisted as a JSON blob through the app's key-value
 * store. Kudos on comments and the post-level kudo toggle live here too, for
 * the same reason: they are local interaction state, not server cheers.
 *
 * Source of truth for the seed thread: docs/new_design/social-dark.md —
 * SOCIAL DATA CONTRACT ("COMMENT THREAD ON POST 1").
 */

export interface FeedComment {
  id: string;
  postId: string;
  /** 'alex' or a PEOPLE person id. */
  authorId: string;
  text: string;
  /** Epoch ms. */
  createdAt: number;
  /** Comment id of the parent, or null for a top-level comment. */
  parentId: string | null;
  kudos: number;
  kudoed: boolean;
}

export interface PostKudosState {
  kudoed: boolean;
  total: number;
  /** Person ids in display order; only the first three ever render. */
  people: string[];
}

/** Everything a post needs seeded before first render. Friends get kudos only. */
export interface PostCommentSeed {
  comments: FeedComment[];
  kudos: PostKudosState;
}

export interface FeedCommentsState {
  isHydrated: boolean;
  /** Post ids whose seed has been applied. Seeding is idempotent. */
  seededPosts: string[];
  comments: Record<string, FeedComment>;
  postKudos: Record<string, PostKudosState>;
}

const initialState: FeedCommentsState = {
  isHydrated: false,
  seededPosts: [],
  comments: {},
  postKudos: {},
};

const MINUTE = 60_000;

/**
 * The contract thread on Alex's post, anchored to the post's publish time so
 * relative timestamps stay honest: Mia +5m, Jon +9m, Alex's reply +11m,
 * Sofia +17m. Kudos: Mia 2, Jon 5 (kudo'd), Sofia 1 — exactly the contract.
 */
export function alexPostSeed(postId: string, publishedAtMs: number): PostCommentSeed {
  const mia: FeedComment = {
    id: `seed-${postId}-mia`,
    postId,
    authorId: 'mia',
    text: 'That shoulder press PR is huge. What did you warm up with?',
    createdAt: publishedAtMs + 5 * MINUTE,
    parentId: null,
    kudos: 2,
    kudoed: false,
  };
  const alexReply: FeedComment = {
    id: `seed-${postId}-alex-reply`,
    postId,
    authorId: 'alex',
    text: 'Just the bar, then 40 and 50 for five.',
    createdAt: publishedAtMs + 11 * MINUTE,
    parentId: mia.id,
    kudos: 0,
    kudoed: false,
  };
  const jon: FeedComment = {
    id: `seed-${postId}-jon`,
    postId,
    authorId: 'jon',
    text: 'Volume up 18% this week. Save something for the rest of us.',
    createdAt: publishedAtMs + 9 * MINUTE,
    parentId: null,
    kudos: 5,
    kudoed: true,
  };
  const sofia: FeedComment = {
    id: `seed-${postId}-sofia`,
    postId,
    authorId: 'sofia',
    text: 'Bookmarked your split. Running it next block.',
    createdAt: publishedAtMs + 17 * MINUTE,
    parentId: null,
    kudos: 1,
    kudoed: false,
  };
  return {
    comments: [mia, alexReply, jon, sofia],
    // KUDOS ON ALEX'S JUN 9 POST = 6 → Mia, Jon, Sofia, Dev, Lena, Tom.
    kudos: { kudoed: false, total: 6, people: ['mia', 'jon', 'sofia'] },
  };
}

/** Reference posts seed kudos metadata only — never invented comment text. */
export function referenceKudosSeed(total: number, people: string[]): PostKudosState {
  return { kudoed: false, total, people };
}

function emptyKudos(): PostKudosState {
  return { kudoed: false, total: 0, people: [] };
}

const commentsSlice = createSlice({
  name: 'feedComments',
  initialState,
  reducers: {
    hydrateFeedComments(_, action: PayloadAction<FeedCommentsState>) {
      return { ...action.payload, isHydrated: true };
    },
    ensurePostSeeded(state, action: PayloadAction<{ postId: string; seed: PostCommentSeed }>) {
      const { postId, seed } = action.payload;
      if (state.seededPosts.includes(postId)) {
        return;
      }
      for (const comment of seed.comments) {
        state.comments[comment.id] = comment;
      }
      state.postKudos[postId] = seed.kudos;
      state.seededPosts.push(postId);
    },
    addComment(
      state,
      action: PayloadAction<{ postId: string; authorId: string; text: string; parentId: string | null }>,
    ) {
      const id = uuid();
      state.comments[id] = {
        id,
        postId: action.payload.postId,
        authorId: action.payload.authorId,
        text: action.payload.text,
        createdAt: Date.now(),
        parentId: action.payload.parentId,
        kudos: 0,
        kudoed: false,
      };
    },
    toggleCommentKudos(state, action: PayloadAction<string>) {
      const comment = state.comments[action.payload];
      if (!comment) {
        return;
      }
      comment.kudoed = !comment.kudoed;
      comment.kudos = Math.max(0, comment.kudos + (comment.kudoed ? 1 : -1));
    },
    togglePostKudos(state, action: PayloadAction<string>) {
      const postId = action.payload;
      const kudos = state.postKudos[postId] ?? (state.postKudos[postId] = emptyKudos());
      kudos.kudoed = !kudos.kudoed;
      if (kudos.kudoed) {
        if (!kudos.people.includes('alex')) {
          kudos.people.unshift('alex');
        }
        kudos.total += 1;
      } else {
        kudos.people = kudos.people.filter((id) => id !== 'alex');
        kudos.total = Math.max(0, kudos.total - 1);
      }
    },
    removePostData(state, action: PayloadAction<string>) {
      const postId = action.payload;
      for (const [id, comment] of Object.entries(state.comments)) {
        if (comment.postId === postId) {
          delete state.comments[id];
        }
      }
      delete state.postKudos[postId];
      state.seededPosts = state.seededPosts.filter((id) => id !== postId);
    },
  },
  selectors: {
    selectFeedCommentsHydrated: (state: FeedCommentsState) => state.isHydrated,
    selectIsPostSeeded: createSelector(
      (state: FeedCommentsState) => state.seededPosts,
      (_: FeedCommentsState, postId: string) => postId,
      (seededPosts, postId) => seededPosts.includes(postId),
    ),
    selectPostKudos: createSelector(
      (state: FeedCommentsState) => state.postKudos,
      (_: FeedCommentsState, postId: string) => postId,
      (postKudos, postId) => postKudos[postId] as PostKudosState | undefined,
    ),
    /** Top-level comments only, oldest first. Replies nest, never count. */
    selectTopLevelComments: createSelector(
      (state: FeedCommentsState) => state.comments,
      (_: FeedCommentsState, postId: string) => postId,
      (comments, postId) =>
        Object.values(comments)
          .filter((c) => c.postId === postId && c.parentId === null)
          .sort((a, b) => a.createdAt - b.createdAt),
    ),
    selectReplies: createSelector(
      (state: FeedCommentsState) => state.comments,
      (_: FeedCommentsState, commentId: string) => commentId,
      (comments, commentId) =>
        Object.values(comments)
          .filter((c) => c.parentId === commentId)
          .sort((a, b) => a.createdAt - b.createdAt),
    ),
  },
});

export const {
  hydrateFeedComments,
  ensurePostSeeded,
  addComment,
  toggleCommentKudos,
  togglePostKudos,
  removePostData,
} = commentsSlice.actions;

export const {
  selectFeedCommentsHydrated,
  selectIsPostSeeded,
  selectPostKudos,
  selectTopLevelComments,
  selectReplies,
} = commentsSlice.selectors;

export const initializeFeedComments = createAction('initializeFeedComments');

export default commentsSlice.reducer;
