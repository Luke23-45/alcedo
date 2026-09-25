import { LiteLLMClient } from './litellm.client';

function sseResponse(chunks: string[]): Response {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder();
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('LiteLLMClient tool calling', () => {
  const realFetch = global.fetch;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = realFetch;
  });

  const tool = {
    function: { name: 'create_workout_plan', parameters: { type: 'object' } },
    type: 'function' as const,
  };

  it('sends tools with tool_choice auto on chat()', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ choices: [{ message: { content: 'hi' } }] }),
    );
    const client = new LiteLLMClient('http://litellm', undefined, 'coach-primary');
    await client.chat([{ content: 'hello', role: 'user' }], { tools: [tool] });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body['tools']).toEqual([tool]);
    expect(body['tool_choice']).toBe('auto');
  });

  it('omits tools from the body when none are provided', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ choices: [{ message: { content: 'hi' } }] }),
    );
    const client = new LiteLLMClient('http://litellm', undefined, 'coach-primary');
    await client.chat([{ content: 'hello', role: 'user' }]);

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body).not.toHaveProperty('tools');
    expect(body).not.toHaveProperty('tool_choice');
  });

  it('parses tool_calls on chat()', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        choices: [
          {
            message: {
              content: '',
              tool_calls: [
                {
                  function: {
                    arguments: '{"version":3,"name":"P"}',
                    name: 'create_workout_plan',
                  },
                  id: 'call_1',
                  type: 'function',
                },
              ],
            },
          },
        ],
      }),
    );
    const client = new LiteLLMClient('http://litellm', undefined, 'coach-primary');
    const result = await client.chat([{ content: 'hello', role: 'user' }], {
      tools: [tool],
    });

    expect(result.toolCalls).toEqual([
      { arguments: '{"version":3,"name":"P"}', id: 'call_1', name: 'create_workout_plan' },
    ]);
  });

  it('yields tool-call deltas on streamChat()', async () => {
    const sse = (payload: unknown): string => `data: ${JSON.stringify(payload)}\n\n`;
    fetchMock.mockResolvedValue(
      sseResponse([
        sse({
          choices: [
            {
              delta: {
                tool_calls: [
                  {
                    function: { arguments: '', name: 'create_workout_plan' },
                    id: 'call_1',
                    index: 0,
                  },
                ],
              },
            },
          ],
        }),
        sse({
          choices: [
            { delta: { tool_calls: [{ function: { arguments: '{"name":' }, index: 0 }] } },
          ],
        }),
        sse({ choices: [{ delta: { content: 'Building your plan' } }] }),
        'data: [DONE]\n\n',
      ]),
    );
    const client = new LiteLLMClient('http://litellm', undefined, 'coach-primary');
    const yields: Array<Record<string, unknown>> = [];
    for await (const y of client.streamChat([{ content: 'hello', role: 'user' }], {
      tools: [tool],
    })) {
      yields.push(y as Record<string, unknown>);
    }

    expect(yields).toContainEqual({
      toolCall: { id: 'call_1', index: 0, name: 'create_workout_plan' },
    });
    expect(yields).toContainEqual({
      toolCall: { argumentsDelta: '{"name":', index: 0 },
    });
    expect(yields).toContainEqual({ content: 'Building your plan' });
    // The final yield is the usage payload.
    expect(yields[yields.length - 1]).toHaveProperty('usage');
  });
});
