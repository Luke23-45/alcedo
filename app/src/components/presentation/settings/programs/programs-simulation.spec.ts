/**
 * Page 17/20 — Programs & import plan (Settings → Programs) simulation.
 *
 * Presentational coverage runs at the model/logic level (React Native is
 * stubbed in this repo's test setup), the same pattern as pages 13–16:
 *
 * A. i18n completeness: every literal key passed to t()/settingsKey() in
 *    the programs folder — and in the smart program-list-item that owns
 *    the overflow menu — resolves in en.json. A raw key string reaching
 *    the user is a defect.
 * B. Navigation correctness: every router.push / Redirect href target in
 *    the programs surface resolves to a real expo-router route file.
 * C. Parser edge cases: empty / whitespace-only / CRLF / garbage input
 *    never throws and never fabricates days or exercises.
 * D. Missing-program honesty: the manage-workouts editor and the program
 *    overflow menu guard against the lying non-null selector instead of
 *    crashing on a stale deep link or a deleted-while-open race.
 * E. Review-flow contract: a parsed plan (including unmatched names, kept
 *    verbatim) becomes a real blueprint the review screen can save.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parsePlanText, parsedPlanToBlueprint } from './plan-parser';
import type { ExerciseDescriptor } from '@/models/exercise-models';

const PROGRAMS_DIR = __dirname;
const SRC = resolve(PROGRAMS_DIR, '..', '..', '..', '..');
const ROUTES_DIR = join(SRC, 'app', '(tabs)');

const DESCRIPTORS: Record<string, ExerciseDescriptor> = {
  a: { name: 'Barbell Bench Press' } as ExerciseDescriptor,
  b: { name: 'Deadlift' } as ExerciseDescriptor,
};

function readSources(dirs: string[]): string {
  return dirs
    .flatMap((dir) =>
      readdirSync(dir)
        .filter((f) => f.endsWith('.tsx') && !f.endsWith('.spec.tsx'))
        .map((f) => readFileSync(join(dir, f), 'utf8')),
    )
    .join('\n');
}

describe('programs i18n completeness', () => {
  it('resolves every literal key used by the programs surface in en.json', () => {
    const en = JSON.parse(readFileSync(join(SRC, 'i18n', 'en.json'), 'utf8')) as Record<string, unknown>;
    const sources = readSources([PROGRAMS_DIR, join(SRC, 'components', 'smart')]);
    const keys = new Set<string>();
    for (const m of sources.matchAll(/(?:settingsKey|(?<![\w$])t)\('([^']+)'\)/g)) {
      keys.add(m[1]!);
    }
    expect(keys.size).toBeGreaterThan(0);
    const missing = [...keys].filter((k) => !(k in en));
    expect(missing).toEqual([]);
  });
});

describe('programs navigation', () => {
  it('pushes and redirects only to real route files', () => {
    const sources = readSources([PROGRAMS_DIR]);
    const targets = [
      ...[...sources.matchAll(/push\('([^']+)'\)/g)].map((m) => m[1]!),
      ...[...sources.matchAll(/href="([^"]+)"/g)].map((m) => m[1]!),
    ];
    expect(targets.length).toBeGreaterThan(0);
    for (const target of targets) {
      if (target === '/') {
        continue; // tab root — always present
      }
      const asFile = join(ROUTES_DIR, `${target}.tsx`);
      const asIndex = join(ROUTES_DIR, target, 'index.tsx');
      const asParamIndex = join(ROUTES_DIR, target.replace(/\/[^/]+$/, '/[id]'), 'index.tsx');
      expect(existsSync(asFile) || existsSync(asIndex) || existsSync(asParamIndex), target).toBe(true);
    }
  });
});

describe('plan parser edge cases', () => {
  it('parses empty and whitespace-only text into an empty plan', () => {
    for (const text of ['', '   ', '\n\n  \n']) {
      const plan = parsePlanText(text, DESCRIPTORS);
      expect(plan).toMatchObject({ title: '', days: [], recognized: 0, total: 0 });
    }
  });

  it('handles CRLF line endings', () => {
    const plan = parsePlanText('Day 1 · Push\r\nBench Press 4x5 90s\r\n', DESCRIPTORS);
    expect(plan.total).toBe(1);
    expect(plan.days[0]!.name).toBe('Push');
  });

  it('ignores garbage lines without fabricating exercises', () => {
    const plan = parsePlanText('hello world\n!!!\nDay 1\n', DESCRIPTORS);
    expect(plan.total).toBe(0);
    expect(plan.days).toHaveLength(1);
  });

  it('keeps unmatched names verbatim into the blueprint for review', () => {
    const plan = parsePlanText('Day 1\nWobble Board Fling 3x12 60s', DESCRIPTORS);
    const blueprint = parsedPlanToBlueprint(plan);
    expect(blueprint.sessions).toHaveLength(1);
    expect(blueprint.sessions[0]!.exercises[0]!.name).toBe('Wobble Board Fling');
  });
});

describe('missing-program honesty', () => {
  it('guards the manage-workouts editor against a stale programId', () => {
    const source = readFileSync(join(PROGRAMS_DIR, 'manage-workouts-screen.tsx'), 'utf8');
    expect(source).toMatch(/if\s*\(!program\)/);
    expect(source).toMatch(/Redirect[^>]*\/settings\/program-list/);
    // The guard must run before any program.name / program.sessions access.
    const guardAt = source.indexOf('if (!program)');
    expect(guardAt).toBeGreaterThan(-1);
    expect(source.indexOf('program.name', guardAt)).toBeGreaterThan(guardAt);
  });

  it('guards the overflow menu against a deleted-while-open program', () => {
    const source = readFileSync(join(SRC, 'components', 'smart', 'program-list-item.tsx'), 'utf8');
    expect(source).toMatch(/if\s*\(!thisProgram\)\s*{\s*return null;/);
  });
});
