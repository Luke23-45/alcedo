import { AiChatResponseV2, describeSharedProgramForAi } from '@/models/ai-models';
import {
  addMessage,
  ChatMessage,
  initChat,
  initializeAiPlannerStateSlice,
  restartChat,
  stopAiGenerator,
  updateMessage,
} from '@/store/ai-planner';
import { setIsHydrated } from '@/store/ai-planner';

import { AddEffectFn } from '@/store/store';
import { uuid } from '@/utils/uuid';

export function applyAiPlannerEffects(addEffect: AddEffectFn) {
  addEffect(initializeAiPlannerStateSlice, async (_, { dispatch }) => {
    dispatch(setIsHydrated(true));
  });

  addEffect(addMessage, async ({ payload: message }, { dispatch, extra: { aiChatService } }) => {
    if (message.from === 'Agent') {
      return;
    }
    let wireMessage: string;
    if (message.type === 'messageResponse') {
      wireMessage = message.message;
    } else if (message.type === 'sharedProgram') {
      wireMessage = describeSharedProgramForAi(message.programName, message.blueprint);
    } else {
      return;
    }
    const originalMessage: ChatMessage = {
      from: 'Agent',
      id: uuid(),
      message: '',
      type: 'messageResponse',
      isLoading: true,
    };
    dispatch(addMessage(originalMessage));
    let currentId = originalMessage.id;
    let currentPayload: ChatMessage = originalMessage;
    const finalizeCurrent = () => {
      dispatch(updateMessage({ ...currentPayload, id: currentId, isLoading: false }));
    };
    for await (const chatResponse of aiChatService.sendMessage(wireMessage)) {
      // A deterministic local script (e.g. the offline greeting) speaks in
      // several bubbles: finalize the current one and open a new bubble
      // instead of overwriting it. Remote streaming never sets this flag.
      const startNewBubble = 'appendAsNew' in chatResponse && chatResponse.appendAsNew === true;
      if (startNewBubble) {
        finalizeCurrent();
        const next: ChatMessage = {
          id: uuid(),
          from: 'Agent',
          message: '',
          type: 'messageResponse',
          isLoading: true,
        };
        dispatch(addMessage(next));
        currentId = next.id;
        currentPayload = next;
      }
      currentPayload = {
        id: currentId,
        from: 'Agent',
        isLoading: true,
        ...chatResponse,
      };
      dispatch(updateMessage(currentPayload));
    }
    finalizeCurrent();
  });
  addEffect(stopAiGenerator, async (_, { extra: { aiChatService } }) => {
    await aiChatService.stopInProgress();
  });

  addEffect(initChat, async (_, { dispatch, getState }) => {
    if (getState().aiPlanner.plannerChat.length) {
      return;
    }
    dispatch(restartChat());
  });

  addEffect(restartChat, async (_, { dispatch, extra: { aiChatService } }) => {
    await aiChatService.restartChat();
    const originalMessage: ChatMessage = {
      from: 'Agent',
      id: uuid(),
      message: '',
      type: 'messageResponse',
      isLoading: true,
    };
    dispatch(addMessage(originalMessage));
    let latestMessage: AiChatResponseV2 | undefined = undefined;
    for await (const chatResponse of aiChatService.introduce()) {
      latestMessage = chatResponse;
      dispatch(
        updateMessage({
          id: originalMessage.id,
          from: 'Agent',
          isLoading: true,
          ...chatResponse,
        }),
      );
    }

    dispatch(
      updateMessage({
        id: originalMessage.id,
        from: 'Agent',
        ...(latestMessage ?? originalMessage),
        isLoading: false,
      }),
    );
  });
}
