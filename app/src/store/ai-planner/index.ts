import { AiChatResponseV2, AiChatSharedProgramMessage } from '@/models/ai-models';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AppState = {
  isHydrated: false,
  plannerChat: [],
};

export type ChatMessage = (AiChatResponseV2 | AiChatSharedProgramMessage) & {
  id: string;
  from: 'User' | 'Agent';
  isLoading?: boolean;
  /**
   * When the message entered the chat (device clock). Stamped by `addMessage`,
   * so every message rendered in a session can be grouped under day dividers.
   * Optional only because historical/dev-injected messages may predate it.
   */
  sentAt?: number;
};

type AppState = {
  isHydrated: boolean;
  plannerChat: ChatMessage[];
};

/**
 * Distributive Omit: preserves the discriminated union so each message
 * variant keeps its own required fields (message, programName, blueprint…).
 * Plain `Omit` over a union collapses the discriminant.
 */
export type NewChatMessage = ChatMessage extends infer M
  ? M extends ChatMessage
    ? Omit<M, 'sentAt'>
    : never
  : never;

const aiPlannerSlice = createSlice({
  name: 'aiPlanner',
  initialState,
  reducers: {
    setIsHydrated(state, action: PayloadAction<boolean>) {
      state.isHydrated = action.payload;
    },
    addMessage(state, action: PayloadAction<NewChatMessage>): AppState {
      return {
        ...state,
        plannerChat: [{ ...action.payload, sentAt: Date.now() } as ChatMessage, ...(state.plannerChat as ChatMessage[])],
      };
    },
    updateMessage(state, action: PayloadAction<ChatMessage>) {
      const messageIndex = state.plannerChat.findIndex((x) => x.id === action.payload.id);
      if (messageIndex !== -1) {
        // Streaming updates carry the latest payload but never a fresh
        // timestamp: keep the original `sentAt` so day dividers stay stable
        // while a message streams in.
        const existing = state.plannerChat[messageIndex];
        if (existing) {
          state.plannerChat[messageIndex] = {
            ...action.payload,
            sentAt: action.payload.sentAt ?? existing.sentAt,
          };
        }
      }
    },
    removeMessage(state, action: PayloadAction<string>) {
      const existingMessage = state.plannerChat.findIndex((x) => x.id === action.payload);
      if (existingMessage === -1) {
        return;
      }
      state.plannerChat.splice(existingMessage, 1);
    },
    restartChat(state) {
      state.plannerChat = [];
    },
    setChat(state, action: PayloadAction<ChatMessage[]>) {
      state.plannerChat = action.payload;
    },
  },
  selectors: {
    selectIsLoadingAiPlannerMessage: (s) => s.plannerChat.some((x) => x.isLoading),
  },
});

export const initializeAiPlannerStateSlice = createAction('initializeAiPlannerStateSlice');

export const { setIsHydrated, addMessage, restartChat, updateMessage, removeMessage, setChat } = aiPlannerSlice.actions;

export const { selectIsLoadingAiPlannerMessage } = aiPlannerSlice.selectors;

export const stopAiGenerator = createAction('stopAiGenerator');
export const initChat = createAction('initChat');

export const aiPlannerReducer = aiPlannerSlice.reducer;
