import { LocalDate } from '@js-joda/core';
import {
  ProgramBlueprint,
  Rest,
  type Rest as RestValue,
  SessionBlueprint,
  WeightedExerciseBlueprint,
  normalizeExerciseName,
} from '@/models/blueprint-models';
import type { ExerciseDescriptor } from '@/models/exercise-models';

export interface ParsedExercise {
  rawName: string;
  /** Descriptor name when matched, otherwise the raw pasted name. */
  name: string;
  matched: boolean;
  /** Matched to a differently-named exercise ("was Shoulder Press"). */
  renamed: boolean;
  sets: number;
  reps: number | 'amrap';
  restSeconds?: number;
}

export interface ParsedDay {
  name: string;
  exercises: ParsedExercise[];
}

export interface ParsedPlan {
  title: string;
  days: ParsedDay[];
  recognized: number;
  total: number;
}

const DAY_HEADER = /^\s*day\s*(\d+)\s*(?:[·•\-–—:]\s*(.+?))?\s*$/i;
const EXERCISE_LINE = /^\s*(.+?)\s+(\d+)\s*[x×]\s*(\d+|amrap)\b\s*(?:(\d+)\s*s(?:ec(?:ond)?s?)?)?\s*$/i;

/**
 * Matches a pasted exercise name against the exercise library:
 * 1. exact normalized match,
 * 2. normalized containment either way (shortest candidate wins, so
 *    "Shoulder Press" finds "Seated Shoulder Press"),
 * 3. every pasted token appears in the candidate's tokens (shortest wins).
 * Uses the same normalization as movement keys so matching agrees with the
 * rest of the app.
 */
export function matchExerciseName(
  rawName: string,
  descriptors: Record<string, ExerciseDescriptor>,
): ExerciseDescriptor | undefined {
  const normalized = normalizeExerciseName(rawName);
  if (!normalized) {
    return undefined;
  }
  const entries = Object.values(descriptors);
  const exact = entries.find((d) => normalizeExerciseName(d.name) === normalized);
  if (exact) {
    return exact;
  }
  const contains = entries
    .filter((d) => {
      const candidate = normalizeExerciseName(d.name);
      return candidate.includes(normalized) || normalized.includes(candidate);
    })
    .sort((a, b) => a.name.length - b.name.length);
  if (contains.length > 0) {
    return contains[0];
  }
  const tokens = normalized.split(/\s+/);
  const subset = entries
    .filter((d) => {
      const candidateTokens = normalizeExerciseName(d.name).split(/\s+/);
      return tokens.every((token) => candidateTokens.includes(token));
    })
    .sort((a, b) => a.name.length - b.name.length);
  return subset[0];
}

/** Parses pasted plan text into days of exercises. Pure and fully tested. */
export function parsePlanText(text: string, descriptors: Record<string, ExerciseDescriptor>): ParsedPlan {
  const lines = text.split(/\r?\n/);
  const title = lines.map((l) => l.trim()).find((l) => l.length > 0) ?? '';
  const days: ParsedDay[] = [];
  let current: ParsedDay | undefined;

  const ensureDay = (name: string): ParsedDay => {
    if (!current) {
      current = { name, exercises: [] };
      days.push(current);
    }
    return current;
  };

  for (const line of lines) {
    const dayMatch = DAY_HEADER.exec(line);
    if (dayMatch) {
      const name = dayMatch[2]?.trim() || `Day ${dayMatch[1]}`;
      current = { name, exercises: [] };
      days.push(current);
      continue;
    }
    const exerciseMatch = EXERCISE_LINE.exec(line);
    if (exerciseMatch) {
      const rawName = exerciseMatch[1]!.trim();
      const descriptor = matchExerciseName(rawName, descriptors);
      const day = ensureDay('Day 1');
      day.exercises.push({
        rawName,
        name: descriptor?.name ?? rawName,
        matched: descriptor !== undefined,
        renamed: descriptor !== undefined && descriptor.name.toLowerCase() !== rawName.toLowerCase(),
        sets: Number(exerciseMatch[2]),
        reps: exerciseMatch[3]!.toLowerCase() === 'amrap' ? 'amrap' : Number(exerciseMatch[3]),
        restSeconds: exerciseMatch[4] ? Number(exerciseMatch[4]) : undefined,
      });
    }
  }

  const total = days.reduce((n, d) => n + d.exercises.length, 0);
  const recognized = days.reduce((n, d) => n + d.exercises.filter((e) => e.matched).length, 0);
  return { title, days, recognized, total };
}

/** Rest seconds → the planner's rest preset whose window contains them. */
export function restForSeconds(seconds: number | undefined): RestValue {
  if (seconds === undefined) {
    return Rest.medium;
  }
  if (seconds <= 75) {
    return Rest.short;
  }
  if (seconds <= 150) {
    return Rest.medium;
  }
  return Rest.long;
}

/**
 * Turns a parsed plan into a real ProgramBlueprint. AMRAP has no model
 * representation, so it becomes an open-ended rep range (1–30); the parsed
 * row keeps the source "AMRAP" wording for the recognition display.
 */
export function parsedPlanToBlueprint(plan: ParsedPlan): ProgramBlueprint {
  return new ProgramBlueprint(
    plan.title || 'Imported plan',
    plan.days.map(
      (day) =>
        new SessionBlueprint(
          day.name,
          day.exercises.map((exercise) =>
            WeightedExerciseBlueprint.of({
              name: exercise.name,
              sets: exercise.sets,
              repsConfig:
                exercise.reps === 'amrap' ? { type: 'range', min: 1, max: 30 } : { type: 'fixed', reps: exercise.reps },
              restBetweenSets: restForSeconds(exercise.restSeconds),
            }),
          ),
          '',
        ),
    ),
    LocalDate.now(),
  );
}
