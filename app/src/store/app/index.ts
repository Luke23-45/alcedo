import { ExerciseDescriptor } from '@/models/exercise-models';
import { createAction, createSlice, PayloadAction, UnknownAction } from '@reduxjs/toolkit';

const MAX_RECENT_EXERCISE_SEARCHES = 5;

const initialState: AppState = {
  isHydrated: false,
  currentSnackbar: undefined,
  exerciseSearchResult: undefined,
  recentExerciseSearchIds: [],
  initializationError: undefined,
};

type AppState = {
  isHydrated: boolean;
  currentSnackbar: SnackbarDescriptor | undefined;
  exerciseSearchResult: ExerciseSearchResult | undefined;
  /** Exercise ids most recently picked from the exercise search, newest first. */
  recentExerciseSearchIds: string[];
  /**
   * Set when app initialization (migrations) fails. Hydration still completes so the
   * app can show a recovery screen instead of loading forever.
   */
  initializationError: string | undefined;
};

// The exercise search is its own route, so it hands its result back through the store rather than a
// callback. The requestId ties a result to the searcher that opened it, so a result is never applied
// to a searcher that did not ask for it.
export type ExerciseSearchResult = {
  requestId: string;
  exercise: ExerciseDescriptor;
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsHydrated(state, action: PayloadAction<boolean>) {
      state.isHydrated = action.payload;
    },

    setInitializationError(state, action: PayloadAction<string | undefined>) {
      state.initializationError = action.payload;
    },

    setCurrentSnackbar(state, action: PayloadAction<SnackbarDescriptor | undefined>) {
      state.currentSnackbar = action.payload;
    },

    setExerciseSearchResult(state, action: PayloadAction<ExerciseSearchResult>) {
      state.exerciseSearchResult = action.payload;
    },

    clearExerciseSearchResult(state) {
      state.exerciseSearchResult = undefined;
    },

    recordRecentExerciseSearch(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.recentExerciseSearchIds = [id, ...state.recentExerciseSearchIds.filter((x) => x !== id)].slice(
        0,
        MAX_RECENT_EXERCISE_SEARCHES,
      );
    },

    clearRecentExerciseSearches(state) {
      state.recentExerciseSearchIds = [];
    },
  },
});

export const initializeAppStateSlice = createAction('initializeAppStateSlice');

export const shareString = createAction<{ title: string; value: string }>('shareString');
export const copyLogs = createAction('copyLogs');

export type SnackbarTone = "success" | "error" | "neutral";

/**
 * Legacy one-line variant: `text` only. Rich two-line toast variant: `title`
 * (+ optional `subtitle`) with a semantic tone. The provider renders the toast
 * pinned below the nav; legacy callers render exactly as before.
 */
export type SnackbarDescriptor =
  | {
      text: string;
      action?: undefined;
      dispatchAction?: undefined;
      onAction?: undefined;
    }
  | {
      text: string;
      action: string;
      dispatchAction: UnknownAction | UnknownAction[];
      onAction?: undefined;
    }
  | {
      text: string;
      action: string;
      onAction: () => void;
      dispatchAction?: undefined;
    }
  | {
      /** Title line, rendered in the tone color. */
      title: string;
      /** Subtitle line in the secondary text color. */
      subtitle?: string;
      /** Semantic tone; defaults to neutral. */
      tone?: SnackbarTone;
      action?: undefined;
      dispatchAction?: undefined;
      onAction?: undefined;
    }
  | {
      title: string;
      subtitle?: string;
      tone?: SnackbarTone;
      action: string;
      dispatchAction: UnknownAction | UnknownAction[];
      onAction?: undefined;
    }
  | {
      title: string;
      subtitle?: string;
      tone?: SnackbarTone;
      action: string;
      onAction: () => void;
      dispatchAction?: undefined;
    };
export const showSnackbar = createAction<SnackbarDescriptor & { duration?: number }>('snackBarWithAction');

export const {
  setIsHydrated,
  setInitializationError,
  setCurrentSnackbar,
  setExerciseSearchResult,
  clearExerciseSearchResult,
  recordRecentExerciseSearch,
  clearRecentExerciseSearches,
} = appSlice.actions;

export default appSlice.reducer;
