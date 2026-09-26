import { Duration, LocalDate } from '@js-joda/core';
import BigNumber from 'bignumber.js';
import { AnyVersionAiPlanJSON } from '@/models/storage/versions/any';
import { aiPlanMigrations } from '@/models/storage/versions/migrations';
import { CardioExerciseBlueprint, ProgramBlueprint, WeightedExerciseBlueprint } from '@/models/blueprint-models';
import { DeepPartial } from '@/utils/types';
import {
  BigNumberJSON,
  CardioExerciseBlueprintJSON,
  CardioExerciseSetBlueprintJSON,
  CardioTargetJSON,
  DurationJSON,
  ExerciseBlueprintJSON,
  ProgramBlueprintJSON,
  ProgressionRuleJSON,
  PlannedSetJSON,
  RestJSON,
  SessionBlueprintJSON,
  toLocalDateJSON,
  WeightedExerciseBlueprintJSON,
} from '@/models/storage/versions/latest';
import { EmptySession } from '@/models/session-models';

export interface AiChatPlanResponse {
  type: 'chatPlan';
  plan: AiWorkoutPlan;
}

export interface AiChatMessageResponse {
  type: 'messageResponse';
  message: string;
  /**
   * Render as a new chat bubble instead of updating the in-flight one.
   * Set only by deterministic local scripts (e.g. the offline greeting):
   * remote streaming responses always update the current bubble.
   */
  appendAsNew?: boolean;
}

export interface AiChatPurchaseProResponse {
  type: 'purchasePro';
  /** Same contract as {@link AiChatMessageResponse.appendAsNew}. */
  appendAsNew?: boolean;
}

export type AiChatResponse = AiChatMessageResponse | AiChatPlanResponse | AiChatPurchaseProResponse;

export interface AiPlan {
  name: string;
  description: string;
  blueprint: ProgramBlueprint;
}

export interface AiChatPlanResponseV2 {
  type: 'chatPlan';
  plan: AiPlan;
}

/**
 * Client-only chat message: an existing program the user has shared with the AI
 * as context for their requests. Never received from the hub.
 */
export interface AiChatSharedProgramMessage {
  type: 'sharedProgram';
  programName: string;
  blueprint: ProgramBlueprint;
}

/**
 * Builds the user-message text sent to the AI when sharing an existing program,
 * embedding it in the same JSON shape the create_workout_plan tool produces.
 */
export function describeSharedProgramForAi(programName: string, blueprint: ProgramBlueprint): string {
  return (
    `Here is my current workout program, named "${programName}". ` +
    `It uses the same JSON structure as the "blueprint" field of your create_workout_plan tool. ` +
    `Use it as the basis for my requests - when I ask for changes, return an updated plan with the create_workout_plan tool.\n\n` +
    JSON.stringify(blueprint.toJSON())
  );
}

/**
 * Sent by the hub when this app's AI plan version is behind the server's: the
 * app can't understand plans the server produces and must be updated.
 */
export interface AiChatUpdateRequiredResponse {
  type: 'updateRequired';
  requiredVersion: number;
}

export type AiChatResponseV2 =
  | AiChatMessageResponse
  | AiChatPlanResponseV2
  | AiChatUpdateRequiredResponse
  | AiChatPurchaseProResponse;

/** Wire shape received from the hub for a plan (matches backend `AiChatPlanResponseV2`). */
export type AiChatPlanResponseV2Json = AnyVersionAiPlanJSON & {
  type: 'chatPlan';
};

export type AiChatResponseV2Json =
  | AiChatMessageResponse
  | AiChatPlanResponseV2Json
  | AiChatUpdateRequiredResponse
  | AiChatPurchaseProResponse;

const emptySessionBlueprint = EmptySession.blueprint.toJSON();
const emptyWeightedExercise = WeightedExerciseBlueprint.empty().toJSON();
const emptyCardioExercise = CardioExerciseBlueprint.empty().toJSON();
const emptyCardioSet = emptyCardioExercise.sets[0]!;
const defaultIncreaseAmount = '2.5' as BigNumberJSON;
const defaultRepsTarget = emptyWeightedExercise.plannedSets[0]?.reps ?? { min: 10, max: 10 };

/**
 * The model sometimes emits the wrong JSON type for a text field (a number,
 * an object). `?? ''` only guards null/undefined — a non-string would reach
 * React Text and red-screen. Coerce to the default instead.
 */
function text(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

/** Same idea for numeric fields: non-finite values become the default. */
function num(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/** Durations must be ISO-8601 strings like 'PT30M'; anything else is the default. */
function duration(value: unknown, fallback: DurationJSON): DurationJSON {
  return typeof value === 'string' && ISO_DURATION.test(value) ? (value as DurationJSON) : fallback;
}

const ISO_DURATION = /^P(?!$)(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(?!$)(\d+H)?(\d+M)?(\d+(\.\d+)?S)?)?$/;
const BIG_NUMBER_STRING = /^[+-]?(\d+(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/;

/** BigNumber fields are decimal strings; anything else becomes the default. */
function bigNum(value: unknown, fallback: BigNumberJSON): BigNumberJSON {
  return typeof value === 'string' && BIG_NUMBER_STRING.test(value) ? (value as BigNumberJSON) : fallback;
}

/** Enum-typed fields: an unexpected value becomes the default, never a cast lie. */
function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

/** Boolean fields: truthy garbage like "yes" must not become true. */
function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function fillRest(partial: DeepPartial<RestJSON> = {}): RestJSON {
  const { restBetweenSets } = emptyWeightedExercise;
  return {
    minRest: duration(partial.minRest, restBetweenSets.minRest),
    maxRest: duration(partial.maxRest, restBetweenSets.maxRest),
    failureRest: duration(partial.failureRest, restBetweenSets.failureRest),
  };
}

/**
 * An absent list means no automatic progression, which is the safe reading of a model that simply
 * didn't mention it - a rule invented here would move somebody's weights unasked.
 */
function fillProgression(partial: DeepPartial<ProgressionRuleJSON>[] | undefined): ProgressionRuleJSON[] {
  return (partial ?? []).map((rule) => ({
    axis: oneOf(rule?.axis, ['reps', 'load'] as const, 'load'),
    step: bigNum(rule?.step, defaultIncreaseAmount),
    scope:
      rule?.scope?.type === 'lowestSets'
        ? {
            type: 'lowestSets',
            pick: oneOf(rule.scope.pick, ['first', 'middle', 'last', 'all'] as const, 'all'),
          }
        : { type: 'allSets' },
    ...(rule?.ceiling === undefined ? {} : { ceiling: bigNum(rule.ceiling, defaultIncreaseAmount) }),
    ...(rule?.onCeiling === 'reset' ? { onCeiling: 'reset' as const } : {}),
    trigger: oneOf(rule?.trigger, ['allSetsMetTarget'] as const, 'allSetsMetTarget'),
  }));
}

/**
 * The model emits a list of planned sets. An empty or absent list would render a tile with no sets
 * at all, so it falls back to the default prescription rather than to nothing.
 */
function fillPlannedSets(partial: DeepPartial<PlannedSetJSON>[] | undefined): PlannedSetJSON[] {
  if (!partial?.length) {
    return emptyWeightedExercise.plannedSets.map((s) => ({ reps: { ...s.reps } }));
  }
  return partial.map((set) => ({
    reps: {
      min: num(set?.reps?.min ?? set?.reps?.max, defaultRepsTarget.min),
      max: num(set?.reps?.max ?? set?.reps?.min, defaultRepsTarget.max),
    },
  }));
}

function fillWeightedExercise(partial: DeepPartial<WeightedExerciseBlueprintJSON> = {}): WeightedExerciseBlueprintJSON {
  return {
    type: 'WeightedExerciseBlueprint',
    name: text(partial.name, emptyWeightedExercise.name),
    plannedSets: fillPlannedSets(partial.plannedSets),
    restBetweenSets: fillRest(partial.restBetweenSets),
    supersetWithNext: bool(partial.supersetWithNext, emptyWeightedExercise.supersetWithNext),
    notes: text(partial.notes, emptyWeightedExercise.notes),
    link: text(partial.link, emptyWeightedExercise.link),
    progression: fillProgression(partial.progression),
    resistance: oneOf(partial.resistance, ['none', 'external', 'bodyweight'] as const, emptyWeightedExercise.resistance),
  };
}

function fillCardioTarget(partial: DeepPartial<CardioTargetJSON> = {}): CardioTargetJSON {
  switch (partial.type) {
    case 'distance':
      return {
        type: 'distance',
        value: {
          value: bigNum(partial.value?.value, '0' as BigNumberJSON),
          unit: oneOf(partial.value?.unit, ['metre', 'yard', 'mile', 'kilometre'] as const, 'kilometre'),
        },
      };
    case 'time':
      return {
        type: 'time',
        value: duration(partial.value, 'PT30M' as DurationJSON),
      };
    default:
      return emptyCardioSet.target;
  }
}

function fillCardioSet(partial: DeepPartial<CardioExerciseSetBlueprintJSON> = {}): CardioExerciseSetBlueprintJSON {
  return {
    target: fillCardioTarget(partial.target),
    trackDuration: bool(partial.trackDuration, emptyCardioSet.trackDuration),
    trackDistance: bool(partial.trackDistance, emptyCardioSet.trackDistance),
    trackResistance: bool(partial.trackResistance, emptyCardioSet.trackResistance),
    trackIncline: bool(partial.trackIncline, emptyCardioSet.trackIncline),
    trackWeight: bool(partial.trackWeight, emptyCardioSet.trackWeight),
    trackSteps: bool(partial.trackSteps, emptyCardioSet.trackSteps),
  };
}

function fillCardioExercise(partial: DeepPartial<CardioExerciseBlueprintJSON> = {}): CardioExerciseBlueprintJSON {
  const sets = (partial.sets ?? []).map(fillCardioSet);
  return {
    type: 'CardioExerciseBlueprint',
    name: text(partial.name, emptyCardioExercise.name),
    sets: sets.length ? sets : [fillCardioSet()],
    notes: text(partial.notes, emptyCardioExercise.notes),
    link: text(partial.link, emptyCardioExercise.link),
  };
}

function fillExercise(partial: DeepPartial<ExerciseBlueprintJSON> = {}): ExerciseBlueprintJSON {
  if (partial.type === 'CardioExerciseBlueprint') {
    return fillCardioExercise(partial);
  }
  return fillWeightedExercise(partial as DeepPartial<WeightedExerciseBlueprintJSON>);
}

function fillSession(partial: DeepPartial<SessionBlueprintJSON> = {}): SessionBlueprintJSON {
  return {
    version: 6,
    name: text(partial.name, emptySessionBlueprint.name),
    exercises: (partial.exercises ?? []).map(fillExercise),
    notes: text(partial.notes, emptySessionBlueprint.notes),
  };
}

function fillBlueprint(partial: DeepPartial<ProgramBlueprintJSON> = {}): ProgramBlueprintJSON {
  return {
    version: 3,
    name: text(partial.name, ''),
    sessions: (partial.sessions ?? []).map(fillSession),
    lastEdited: toLocalDateJSON(LocalDate.now()),
  };
}

/**
 * Builds a complete latest {@link AiPlanJSON} from a possibly-incomplete wire
 * plan - the JSON streams top-to-bottom, so trailing fields may be missing -
 * filling any absent fields with empty defaults, then maps it into the domain
 * {@link ProgramBlueprint}.
 */
export function aiPlanFromJSON(partialJson: DeepPartial<AnyVersionAiPlanJSON>): AiPlan {
  if (!('version' in partialJson)) {
    throw new Error('Cannot parse partial json');
  }
  const plan = aiPlanMigrations.migrate(
    partialJson.version === 3
      ? {
          version: 3,
          name: text(partialJson.name, ''),
          description: text(partialJson.description, ''),
          // The any-version plan type no longer couples the outer version to the embedded
          // blueprint's, so `version === 3` can't narrow it - but a v3 wire plan is latest-shaped.
          blueprint: fillBlueprint(partialJson.blueprint as DeepPartial<ProgramBlueprintJSON>),
        }
      : (partialJson as AnyVersionAiPlanJSON),
  );

  return {
    name: plan.name,
    description: plan.description,
    blueprint: ProgramBlueprint.fromJSON(plan.blueprint).with({
      lastEdited: LocalDate.now(),
    }),
  };
}

interface AiSessionBlueprint {
  name: string;
  exercises: AiExerciseBlueprint[];
  notes: string;
}

export interface AiExerciseBlueprint {
  name: string;
  sets: number;
  repsPerSet: number;
  weightIncreaseOnSuccess: BigNumber;
  restBetweenSets: AiRest;
  supersetWithNext: boolean;
  notes: string;
  link: string;
}

interface AiRest {
  minRest: Duration;
  maxRest: Duration;
  failureRest: Duration;
}

export interface AiWorkoutPlan {
  name: string;
  description: string;
  sessions: AiSessionBlueprint[];
}
