import { HttpException } from '@nestjs/common';
import { CoachStreamEvent, ConversationsService } from './conversations.service';
import { AI_PLAN_VERSION } from './plan-tool';

function makeService(deps: { streamChunks?: Array<Record<string, unknown>> } = {}) {
  const createdMessages: Array<{ content: string; role: string }> = [];
  const litellm = {
    chat: jest.fn(),
    streamChat: jest.fn(async function* () {
      for (const chunk of deps.streamChunks ?? []) yield chunk;
    }),
  };
  const service = new ConversationsService(
    {
      create: jest.fn(),
      deleteOwned: jest.fn(),
      findOwned: jest.fn(async () => ({ id: 'c1', title: 'Existing', userId: 'u1' })),
      incrementMessageCount: jest.fn(async () => undefined),
      listForUser: jest.fn(),
      setTitleIfEmpty: jest.fn(async () => undefined),
    } as never,
    {
      create: jest.fn(async (input: { content: string; role: string }) => {
        createdMessages.push({ content: input.content, role: input.role });
        return { id: `msg-${createdMessages.length}`, ...input };
      }),
      deleteByConversation: jest.fn(),
      history: jest.fn(async () => []),
    } as never,
    { record: jest.fn(async () => undefined) } as never,
    litellm as never,
    { classify: jest.fn(async () => ({ matched: [], verdict: 'ambiguous' })) } as never,
    { moderate: jest.fn(async () => ({ categories: [], flagged: false })) } as never,
    {
      checkOutput: jest.fn((text: string) => ({ findings: [], safe: true, sanitized: text })),
    } as never,
    { checkAndReserve: jest.fn(async () => undefined) } as never,
    { recall: jest.fn(async () => []) } as never,
    { extractMemory: jest.fn(async () => undefined) } as never,
    { isPremiumActive: jest.fn(async () => true) } as never,
    { get: jest.fn(() => false) } as never,
    {
      renderWithOverrides: jest.fn(async () => null),
      select: jest.fn(() => []),
    } as never,
    { getSystemInstructions: jest.fn(async () => null) } as never,
  );
  return { createdMessages, litellm, service };
}

describe('ConversationsService workout plans', () => {
  describe('streamMessage', () => {
    it('emits updateRequired without running the turn when the client plan version is behind', async () => {
      const { litellm, service } = makeService();
      const events: CoachStreamEvent[] = [];
      await service.streamMessage('u1', 'c1', 'make me a plan', {
        clientAiPlanVersion: AI_PLAN_VERSION - 1,
        onEvent: (e) => events.push(e),
      });

      expect(events).toEqual([
        { requiredVersion: AI_PLAN_VERSION, type: 'updateRequired' },
      ]);
      expect(litellm.streamChat).not.toHaveBeenCalled();
    });

    it('passes the create_workout_plan tool and emits plan events as arguments stream in', async () => {
      const { createdMessages, litellm, service } = makeService({
        streamChunks: [
          {
            toolCall: {
              id: 'call_1',
              index: 0,
              name: 'create_workout_plan',
            },
          },
          {
            toolCall: {
              argumentsDelta: '{"version":3,"name":"Push Day","descrip',
              index: 0,
            },
          },
          {
            toolCall: {
              argumentsDelta: 'tion":"Chest","blueprint":{"sessions":[]}}',
              index: 0,
            },
          },
          { content: 'Here is your plan.' },
        ],
      });
      const events: CoachStreamEvent[] = [];
      await service.streamMessage('u1', 'c1', 'make me a plan', {
        clientAiPlanVersion: AI_PLAN_VERSION,
        onEvent: (e) => events.push(e),
      });

      // The model was offered the plan tool.
      const [, chatOpts] = litellm.streamChat.mock.calls[0] as unknown as [
        unknown,
        { tools?: Array<{ function: { name: string } }> },
      ];
      expect(chatOpts.tools?.[0]?.function.name).toBe('create_workout_plan');

      const plans = events.filter((e) => e.type === 'plan');
      expect(plans.length).toBeGreaterThan(0);
      const lastPlan = plans[plans.length - 1];
      expect(lastPlan).toEqual({
        plan: {
          blueprint: { sessions: [] },
          description: 'Chest',
          name: 'Push Day',
          type: 'chatPlan',
          version: 3,
        },
        type: 'plan',
      });

      // The plan is recorded in the persisted assistant message for follow-ups.
      const assistant = createdMessages.find((m) => m.role === 'assistant');
      expect(assistant?.content).toContain('<created_plan>');
      expect(assistant?.content).toContain('"name":"Push Day"');

      // The stream still completes normally.
      expect(events[events.length - 1].type).toBe('done');
    });

    it('ignores tool calls for unknown tools', async () => {
      const { service } = makeService({
        streamChunks: [
          { toolCall: { argumentsDelta: '{"foo":1}', index: 0, name: 'other_tool' } },
          { content: 'Just text.' },
        ],
      });
      const events: CoachStreamEvent[] = [];
      await service.streamMessage('u1', 'c1', 'hello', {
        onEvent: (e) => events.push(e),
      });
      expect(events.some((e) => e.type === 'plan')).toBe(false);
    });
  });

  describe('postMessage', () => {
    it('rejects with 426 AI_CLIENT_UPDATE_REQUIRED when the client plan version is behind', async () => {
      const { service } = makeService();
      const err = await service
        .postMessage('u1', 'c1', 'make me a plan', AI_PLAN_VERSION - 1)
        .catch((e: unknown) => e);
      expect(err).toBeInstanceOf(HttpException);
      const httpErr = err as HttpException;
      expect(httpErr.getStatus()).toBe(426);
      expect(httpErr.getResponse()).toMatchObject({ code: 'AI_CLIENT_UPDATE_REQUIRED' });
    });
  });
});
