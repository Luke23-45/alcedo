import {
  AI_PLAN_VERSION,
  CREATE_WORKOUT_PLAN_TOOL,
  CREATE_WORKOUT_PLAN_TOOL_NAME,
  balanceJson,
  tryParsePlanPayload,
} from './plan-tool';

describe('plan-tool', () => {
  describe('AI_PLAN_VERSION', () => {
    it('matches the version const in the embedded schema', () => {
      expect(AI_PLAN_VERSION).toBe(3);
    });
  });

  describe('CREATE_WORKOUT_PLAN_TOOL', () => {
    it('is an OpenAI-compatible function tool with the legacy tool name', () => {
      expect(CREATE_WORKOUT_PLAN_TOOL.type).toBe('function');
      expect(CREATE_WORKOUT_PLAN_TOOL.function.name).toBe(CREATE_WORKOUT_PLAN_TOOL_NAME);
      expect(CREATE_WORKOUT_PLAN_TOOL.function.name).toBe('create_workout_plan');
      expect(CREATE_WORKOUT_PLAN_TOOL.function.description.length).toBeGreaterThan(0);
    });

    it('carries the plan JSON schema as parameters without the $schema meta key', () => {
      const params = CREATE_WORKOUT_PLAN_TOOL.function.parameters;
      expect(params['$schema']).toBeUndefined();
      const versionProp = (
        params['properties'] as Record<string, Record<string, unknown>>
      )['version'];
      expect(versionProp['const']).toBe(AI_PLAN_VERSION);
      expect(params['required']).toEqual(
        expect.arrayContaining(['version', 'name', 'description', 'blueprint']),
      );
    });
  });

  describe('balanceJson', () => {
    it('leaves complete JSON untouched', () => {
      const json = '{"a":1,"b":[1,2]}';
      expect(balanceJson(json)).toBe(json);
    });

    it('closes truncated objects and arrays', () => {
      expect(JSON.parse(balanceJson('{"a":1'))).toEqual({ a: 1 });
      expect(JSON.parse(balanceJson('{"a":[1,2'))).toEqual({ a: [1, 2] });
      expect(JSON.parse(balanceJson('{"a":{"b":['))).toEqual({ a: { b: [] } });
    });

    it('terminates an unterminated string', () => {
      expect(JSON.parse(balanceJson('{"name":"Push'))).toEqual({ name: 'Push' });
    });

    it('does not mistake braces inside strings for structure', () => {
      expect(JSON.parse(balanceJson('{"name":"a{b"}'))).toEqual({ name: 'a{b' });
    });

    it('handles escaped quotes inside strings', () => {
      expect(JSON.parse(balanceJson('{"name":"a\\"b'))).toEqual({ name: 'a"b' });
    });

    it('drops trailing commas', () => {
      expect(JSON.parse(balanceJson('{"a":1,'))).toEqual({ a: 1 });
    });
  });

  describe('tryParsePlanPayload', () => {
    const fullArgs =
      '{"version":3,"name":"Push Day","description":"Chest focus","blueprint":{"sessions":[]}}';

    it('returns null for other tools', () => {
      expect(tryParsePlanPayload('something_else', fullArgs)).toBeNull();
    });

    it('returns null for empty arguments', () => {
      expect(tryParsePlanPayload(CREATE_WORKOUT_PLAN_TOOL_NAME, '')).toBeNull();
    });

    it('returns null until the arguments parse to a plan-shaped object', () => {
      expect(tryParsePlanPayload(CREATE_WORKOUT_PLAN_TOOL_NAME, '{"ver')).toBeNull();
      // Parses but has no name yet.
      expect(
        tryParsePlanPayload(CREATE_WORKOUT_PLAN_TOOL_NAME, '{"version":3,"blueprint":{}'),
      ).toBeNull();
    });

    it('parses a complete tool call into the chatPlan wire shape', () => {
      expect(tryParsePlanPayload(CREATE_WORKOUT_PLAN_TOOL_NAME, fullArgs)).toEqual({
        blueprint: { sessions: [] },
        description: 'Chest focus',
        name: 'Push Day',
        type: 'chatPlan',
        version: 3,
      });
    });

    it('parses progressively as arguments stream in', () => {
      const progressive = tryParsePlanPayload(
        CREATE_WORKOUT_PLAN_TOOL_NAME,
        '{"version":3,"name":"Push Day","description":"Chest focus","blueprint":{"sessions":[]',
      );
      expect(progressive).not.toBeNull();
      expect(progressive?.name).toBe('Push Day');
    });

    it('defaults a missing description to an empty string', () => {
      const parsed = tryParsePlanPayload(
        CREATE_WORKOUT_PLAN_TOOL_NAME,
        '{"version":3,"name":"P","blueprint":{}}',
      );
      expect(parsed?.description).toBe('');
    });
  });
});
