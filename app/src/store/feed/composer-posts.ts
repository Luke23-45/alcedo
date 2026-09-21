import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { initializeAppStateSlice } from '@/store/app';
import type { AddEffectFn } from '@/store/store';
import { uuid } from '@/utils/uuid';

/**
 * Composer posts — workout shares created from the Share Composer.
 *
 * This is a NEW slice; no existing store shape is altered. Posts persist to
 * the app's KeyValueStore (file-backed, crash-safe writes) and hydrate on
 * app start. The feed timeline reads `selectComposerPosts` and renders them
 * at the top with real relative ages.
 *
 * Stored contract per post:
 *   { sessionId, theme, visibleStats, caption, taggedIds, audience, postedAt }
 * plus a generated `id`. The poster itself is re-derived from the session at
 * render time, so it can never drift from the real workout data.
 */

export type ComposerPostTheme = 'ember' | 'aurora' | 'slate';

export type ComposerPostStatKey = 'volume' | 'duration' | 'sets' | 'prs' | 'reps' | 'heartrate' | 'notes' | 'rpe';

export type ComposerPostAudience = 'friends' | 'public' | 'private';

export interface ComposerPost {
  id: string;
  sessionId: string;
  theme: ComposerPostTheme;
  visibleStats: ComposerPostStatKey[];
  caption: string;
  taggedIds: string[];
  audience: ComposerPostAudience;
  /** Epoch millis when the post was published. */
  postedAt: number;
}

interface ComposerPostsState {
  /** Newest first. */
  posts: ComposerPost[];
  isHydrated: boolean;
}

const initialState: ComposerPostsState = { posts: [], isHydrated: false };

const STAT_KEYS: ComposerPostStatKey[] = ['volume', 'duration', 'sets', 'prs', 'reps', 'heartrate', 'notes', 'rpe'];

const THEMES: ComposerPostTheme[] = ['ember', 'aurora', 'slate'];
const AUDIENCES: ComposerPostAudience[] = ['friends', 'public', 'private'];

function isComposerPost(value: unknown): value is ComposerPost {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.sessionId === 'string' &&
    typeof v.theme === 'string' &&
    THEMES.includes(v.theme as ComposerPostTheme) &&
    Array.isArray(v.visibleStats) &&
    v.visibleStats.every((k) => typeof k === 'string' && STAT_KEYS.includes(k as ComposerPostStatKey)) &&
    typeof v.caption === 'string' &&
    Array.isArray(v.taggedIds) &&
    v.taggedIds.every((id) => typeof id === 'string') &&
    typeof v.audience === 'string' &&
    AUDIENCES.includes(v.audience as ComposerPostAudience) &&
    typeof v.postedAt === 'number'
  );
}

/** Parse persisted posts; corrupt rows are dropped, never crash the hydrate. */
export function parseComposerPosts(raw: string): ComposerPost[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isComposerPost);
  } catch {
    return [];
  }
}

export function serializeComposerPosts(posts: ComposerPost[]): string {
  return JSON.stringify(posts);
}

const composerPostsSlice = createSlice({
  name: 'composerPosts',
  initialState,
  reducers: {
    hydrateComposerPosts(state, action: PayloadAction<ComposerPost[]>) {
      state.posts = action.payload;
      state.isHydrated = true;
    },
    publishComposerPost(state, action: PayloadAction<Omit<ComposerPost, 'id'>>) {
      state.posts.unshift({ ...action.payload, id: uuid() });
    },
    removeComposerPost(state, action: PayloadAction<string>) {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
  },
  selectors: {
    /** Newest first — the timeline renders them at the top. */
    selectComposerPosts: (state) => state.posts,
    selectComposerPostsHydrated: (state) => state.isHydrated,
  },
});

export const { hydrateComposerPosts, publishComposerPost, removeComposerPost } = composerPostsSlice.actions;
export const { selectComposerPosts, selectComposerPostsHydrated } = composerPostsSlice.selectors;
export const composerPostsReducer = composerPostsSlice.reducer;

const STORAGE_KEY = 'ComposerPostsV1';

export function applyComposerPostsEffects(addEffect: AddEffectFn) {
  addEffect(initializeAppStateSlice, async (_, { dispatch, extra: { keyValueStore } }) => {
    const raw = await keyValueStore.getItem(STORAGE_KEY);
    dispatch(hydrateComposerPosts(raw === undefined ? [] : parseComposerPosts(raw)));
  });

  addEffect([publishComposerPost, removeComposerPost], async (_, { getState, extra: { keyValueStore } }) => {
    await keyValueStore.setItem(STORAGE_KEY, serializeComposerPosts(selectComposerPosts(getState())));
  });
}
