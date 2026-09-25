import { Logger } from '@nestjs/common';
import Ajv, { type ValidateFunction } from 'ajv';
import planSchema from './plan-tool.schema.json';

/**
 * The `create_workout_plan` tool served to the coach model. The input schema
 * is generated from the app's `storage/versions/latest/ai-plan.ts`
 * (`npm run json-schema` in app/ regenerates it) — the single source of
 * truth for the plan contract. The app's share-program prompt references
 * this exact tool name, so renaming it breaks plan iteration.
 */
export const CREATE_WORKOUT_PLAN_TOOL_NAME = 'create_workout_plan';

const logger = new Logger('PlanTool');

/** Reads the plan contract version from the schema's `version` const. */
function readPlanVersion(schema: Record<string, unknown>): number {
  const properties = schema['properties'] as Record<string, unknown> | undefined;
  const versionProp = properties?.['version'] as Record<string, unknown> | undefined;
  const version = versionProp?.['const'];
  if (typeof version !== 'number') {
    throw new Error('plan-tool.schema.json is missing a numeric version const');
  }
  return version;
}

/**
 * The current AI plan contract version. Clients whose version is behind this
 * cannot understand the plans this server produces and are told to update.
 */
export const AI_PLAN_VERSION = readPlanVersion(planSchema as Record<string, unknown>);

export interface PlanToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    /** JSON Schema (draft-07) for the tool input; the `$schema` meta key is dropped. */
    parameters: Record<string, unknown>;
  };
}

function withoutMetaKey(schema: Record<string, unknown>): Record<string, unknown> {
  const { $schema: _dropped, ...rest } = schema;
  return rest;
}

export const CREATE_WORKOUT_PLAN_TOOL: PlanToolDefinition = {
  function: {
    description:
      'Creates and returns a workout plan to the user. Use this when you have enough information to generate a plan. ' +
      'The blueprint contains the full program: sessions of weighted and/or cardio exercises with progressive overload and rest configuration.',
    name: CREATE_WORKOUT_PLAN_TOOL_NAME,
    parameters: withoutMetaKey(planSchema as Record<string, unknown>),
  },
  type: 'function',
};

/** Wire shape of a plan payload sent to clients (matches the legacy hub's `chatPlan`). */
export interface PlanPayload {
  type: 'chatPlan';
  name: string;
  description: string;
  /** The plan blueprint as produced by the model; the app owns its shape. */
  blueprint: unknown;
  version: number;
}

/**
 * Closes truncated JSON so partial tool-call arguments can be parsed
 * progressively while they stream in: unclosed strings are terminated and
 * open objects/arrays are closed. Trailing commas are dropped (JSON.parse
 * rejects them).
 */
export function balanceJson(partial: string): string {
  let out = '';
  const closers: string[] = [];
  let inString = false;
  let escaped = false;
  for (const ch of partial) {
    out += ch;
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
    } else if (ch === '"') {
      inString = true;
    } else if (ch === '{') {
      closers.push('}');
    } else if (ch === '[') {
      closers.push(']');
    } else if (ch === '}' || ch === ']') {
      closers.pop();
    }
  }
  if (inString) out += '"';
  while (closers.length > 0) out += closers.pop();
  return out.replace(/,(\s*[}\]])/g, '$1');
}

/**
 * Compiled once: strict JSON-schema validation of complete plan arguments.
 * `strict: false` because the schema is machine-generated (it carries the
 * OpenAPI `discriminator` keyword, which is not JSON Schema) — validation
 * itself is unaffected. `format` assertions (date, duration, decimal) stay
 * annotation-only, as Ajv does not enforce them by default.
 */
let validatePlanArgs: ValidateFunction | undefined;
function getPlanValidator(): ValidateFunction {
  if (!validatePlanArgs) {
    // logger: false silences "unknown format" notices for the schema's
    // date/duration/decimal formats, which stay annotation-only.
    const ajv = new Ajv({ allErrors: true, logger: false, strict: false });
    validatePlanArgs = ajv.compile(planSchema as Record<string, unknown>);
  }
  return validatePlanArgs;
}

/**
 * Strictly validates complete `create_workout_plan` arguments against the
 * generated plan JSON schema — including nested blueprint fields, the
 * version const, and required properties. Unlike {@link tryParsePlanPayload}
 * (which tolerates partial streaming JSON for progressive previews), this
 * requires the arguments to be complete and fully schema-valid, with no
 * JSON balancing. Returns the plan payload, or null — logging the schema
 * errors — when the arguments are not a valid plan.
 *
 * Use this for the final plan a turn produces: only a strictly valid plan
 * is recorded in history and surfaced as the turn's canonical result.
 * Progressive previews keep using {@link tryParsePlanPayload}; they are
 * explicitly partial (the app fills missing trailing fields by design).
 */
export function validatePlanPayload(toolName: string, argsText: string): PlanPayload | null {
  if (toolName !== CREATE_WORKOUT_PLAN_TOOL_NAME || argsText.length === 0) {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(argsText);
  } catch (err) {
    logger.debug(`Plan arguments are not complete JSON: ${(err as Error)?.message ?? err}`);
    return null;
  }
  const validate = getPlanValidator();
  if (!validate(parsed)) {
    logger.warn(`Plan arguments failed schema validation: ${JSON.stringify(validate.errors)}`);
    return null;
  }
  const obj = parsed as Record<string, unknown>;
  return {
    blueprint: obj['blueprint'],
    description: obj['description'] as string,
    name: obj['name'] as string,
    type: 'chatPlan',
    version: obj['version'] as number,
  };
}

/**
 * Parses accumulated `create_workout_plan` arguments into a plan payload.
 * Returns null until the arguments parse to a plan-shaped object — the
 * caller retries on every arguments delta, so plans surface progressively
 * as the model streams them. Tool calls for any other tool are ignored.
 *
 * This is intentionally lenient (top-level shape only): progressive
 * previews are partial by design. The turn's final plan goes through
 * {@link validatePlanPayload} instead.
 */
export function tryParsePlanPayload(toolName: string, argsText: string): PlanPayload | null {
  if (toolName !== CREATE_WORKOUT_PLAN_TOOL_NAME || argsText.length === 0) {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(balanceJson(argsText));
  } catch (err) {
    logger.debug(`Plan arguments not yet parseable: ${(err as Error)?.message ?? err}`);
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null) {
    return null;
  }
  const obj = parsed as Record<string, unknown>;
  // The app requires `version` to parse a plan and an object `blueprint` to
  // render one; `name`/`description` fall back to empty strings there.
  if (typeof obj['name'] !== 'string' || !('version' in obj)) {
    return null;
  }
  if (typeof obj['blueprint'] !== 'object' || obj['blueprint'] === null) {
    return null;
  }
  return {
    blueprint: obj['blueprint'],
    description: typeof obj['description'] === 'string' ? obj['description'] : '',
    name: obj['name'],
    type: 'chatPlan',
    version: obj['version'] as number,
  };
}
