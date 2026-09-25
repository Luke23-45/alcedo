import {
  AI_PLAN_VERSION,
  CREATE_WORKOUT_PLAN_TOOL,
  CREATE_WORKOUT_PLAN_TOOL_NAME,
  balanceJson,
  tryParsePlanPayload,
  validatePlanPayload,
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

  describe('validatePlanPayload', () => {
    // Minimal schema-valid plan (verified against plan-tool.schema.json):
    // nested version consts differ by entity (plan/blueprint 3, session 6).
    const validPlan = {
      blueprint: {
        lastEdited: '2026-09-25',
        name: 'Push Program',
        sessions: [
          {
            exercises: [
              {
                link: '',
                name: 'Bench Press',
                notes: '',
                plannedSets: [{ reps: { max: 10, min: 8 } }],
                progression: [],
                resistance: 'external',
                restBetweenSets: {
                  failureRest: 'PT5M',
                  maxRest: 'PT3M',
                  minRest: 'PT2M',
                },
                supersetWithNext: false,
                type: 'WeightedExerciseBlueprint',
              },
            ],
            name: 'Day 1',
            notes: '',
            version: 6,
          },
        ],
        version: 3,
      },
      description: 'Chest and shoulders',
      name: 'Push Day',
      version: 3,
    };
    const validArgs = JSON.stringify(validPlan);

    it('accepts a fully schema-valid plan into the chatPlan wire shape', () => {
      expect(validatePlanPayload(CREATE_WORKOUT_PLAN_TOOL_NAME, validArgs)).toEqual({
        blueprint: validPlan.blueprint,
        description: 'Chest and shoulders',
        name: 'Push Day',
        type: 'chatPlan',
        version: 3,
      });
    });

    it('rejects an invalid nested blueprint field', () => {
      const bad = JSON.parse(validArgs) as typeof validPlan;
      const exercise = bad.blueprint.sessions[0]!.exercises[0]! as unknown as {
        plannedSets: Array<{ reps: { min: unknown } }>;
      };
      exercise.plannedSets[0]!.reps.min = 'eight';
      expect(validatePlanPayload(CREATE_WORKOUT_PLAN_TOOL_NAME, JSON.stringify(bad))).toBeNull();
    });

    it('rejects a wrong nested version const', () => {
      const bad = JSON.parse(validArgs) as typeof validPlan;
      bad.blueprint.sessions[0]!.version = 3;
      expect(validatePlanPayload(CREATE_WORKOUT_PLAN_TOOL_NAME, JSON.stringify(bad))).toBeNull();
    });

    it('rejects a wrong top-level version', () => {
      const bad = { ...validPlan, version: 2 };
      expect(validatePlanPayload(CREATE_WORKOUT_PLAN_TOOL_NAME, JSON.stringify(bad))).toBeNull();
    });

    it('rejects a missing required property', () => {
      const bad = JSON.parse(validArgs) as Record<string, unknown>;
      delete bad['description'];
      expect(validatePlanPayload(CREATE_WORKOUT_PLAN_TOOL_NAME, JSON.stringify(bad))).toBeNull();
    });

    it('rejects a non-object blueprint', () => {
      const bad = { ...validPlan, blueprint: 'not a plan' };
      expect(validatePlanPayload(CREATE_WORKOUT_PLAN_TOOL_NAME, JSON.stringify(bad))).toBeNull();
    });

    it('rejects malformed JSON', () => {
      expect(validatePlanPayload(CREATE_WORKOUT_PLAN_TOOL_NAME, '{"version":3,')).toBeNull();
    });

    it('rejects truncated JSON without balancing it', () => {
      // tryParsePlanPayload tolerates this for progressive previews;
      // strict validation requires complete arguments.
      const truncated =
        '{"version":3,"name":"Push Day","description":"Chest",' +
        '"blueprint":{"version":3,"name":"P","sessions":[],"lastEdited":"2026-09-25"';
      expect(tryParsePlanPayload(CREATE_WORKOUT_PLAN_TOOL_NAME, truncated)).not.toBeNull();
      expect(validatePlanPayload(CREATE_WORKOUT_PLAN_TOOL_NAME, truncated)).toBeNull();
    });

    it('ignores tool calls for any other tool', () => {
      expect(validatePlanPayload('other_tool', validArgs)).toBeNull();
    });

    it('rejects empty arguments', () => {
      expect(validatePlanPayload(CREATE_WORKOUT_PLAN_TOOL_NAME, '')).toBeNull();
    });
  });
});
