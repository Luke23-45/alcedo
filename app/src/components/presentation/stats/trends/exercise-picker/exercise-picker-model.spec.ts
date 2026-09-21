import type { ExerciseDescriptor } from '@/models/exercise-models';
import type { WeightedExerciseStatistics } from '@/store/stats';
import { describe, expect, it } from 'vitest';
import {
  buildPickerExercises,
  buildSections,
  filterExercises,
  findExerciseByName,
  groupByLetter,
  muscleDisplayName,
  muscleGroupOf,
  pinnedExercises,
  rowLeadingParts,
  sectionIndexForLetter,
  tintForExercise,
  type PickerExercise,
} from './exercise-picker-model';

function stat(name: string, sessions: number): WeightedExerciseStatistics {
  return {
    exerciseName: name,
    maxLiftedPerSessionStatistics: {
      statistics: Array.from({ length: sessions }, (_, i) => ({ value: i })),
    },
  } as unknown as WeightedExerciseStatistics;
}

function descriptor(overrides: {
  name: string;
  muscles?: string[];
  equipment?: string | null;
}): ExerciseDescriptor {
  return {
    name: overrides.name,
    force: null,
    level: 'beginner',
    mechanic: null,
    equipment: overrides.equipment ?? null,
    muscles: overrides.muscles ?? [],
    instructions: '',
    category: 'strength',
  };
}

function exercise(overrides: Partial<PickerExercise> & { name: string }): PickerExercise {
  return {
    id: overrides.name,
    muscles: [],
    equipment: null,
    sessionCount: 0,
    ...overrides,
  };
}

const library: Record<string, ExerciseDescriptor> = {
  bench: descriptor({ name: 'Barbell Bench Press', muscles: ['chest', 'triceps'], equipment: 'barbell' }),
  squat: descriptor({ name: 'Barbell Squat', muscles: ['quadriceps', 'glutes'], equipment: 'barbell' }),
  curl: descriptor({ name: 'Dumbbell Curl', muscles: ['biceps'], equipment: 'dumbbell' }),
  situp: descriptor({ name: '3/4 Sit-Up', muscles: ['abdominals'], equipment: 'body only' }),
};

describe('buildPickerExercises', () => {
  it('joins session counts onto library exercises by normalized name', () => {
    const result = buildPickerExercises(library, [
      stat('Barbell Bench Press', 34),
      stat('Barbell Squat', 28),
    ]);
    expect(result.find((x) => x.name === 'Barbell Bench Press')?.sessionCount).toBe(34);
    expect(result.find((x) => x.name === 'Barbell Squat')?.sessionCount).toBe(28);
    expect(result.find((x) => x.name === 'Dumbbell Curl')?.sessionCount).toBe(0);
  });

  it('keeps library metadata on the joined exercises', () => {
    const result = buildPickerExercises(library, []);
    const bench = result.find((x) => x.name === 'Barbell Bench Press');
    expect(bench?.muscles).toEqual(['chest', 'triceps']);
    expect(bench?.equipment).toBe('barbell');
  });

  it('appends stats-only exercises with empty muscle metadata', () => {
    const result = buildPickerExercises(library, [stat('My Custom Lift', 3)]);
    const custom = result.find((x) => x.name === 'My Custom Lift');
    expect(custom).toBeDefined();
    expect(custom?.muscles).toEqual([]);
    expect(custom?.sessionCount).toBe(3);
  });
});

describe('pinnedExercises', () => {
  it('derives the two exercises with the most recorded sessions', () => {
    const items = [
      exercise({ name: 'A', sessionCount: 5 }),
      exercise({ name: 'B', sessionCount: 34 }),
      exercise({ name: 'C', sessionCount: 28 }),
      exercise({ name: 'D', sessionCount: 0 }),
    ];
    expect(pinnedExercises(items).map((x) => x.name)).toEqual(['B', 'C']);
  });

  it('is empty when nothing has been recorded', () => {
    expect(pinnedExercises([exercise({ name: 'A' })])).toEqual([]);
  });
});

describe('filterExercises', () => {
  const items = [
    exercise({ name: 'Barbell Bench Press', muscles: ['chest'] }),
    exercise({ name: 'Barbell Squat', muscles: ['quadriceps', 'glutes'] }),
    exercise({ name: 'Dumbbell Curl', muscles: ['biceps'] }),
  ];

  it('matches names case-insensitively', () => {
    expect(filterExercises(items, 'bench', 'all').map((x) => x.name)).toEqual(['Barbell Bench Press']);
    expect(filterExercises(items, 'BARBELL', 'all')).toHaveLength(2);
  });

  it('filters by muscle group membership', () => {
    expect(filterExercises(items, '', 'chest').map((x) => x.name)).toEqual(['Barbell Bench Press']);
    expect(filterExercises(items, '', 'legs').map((x) => x.name)).toEqual(['Barbell Squat']);
    expect(filterExercises(items, '', 'arms').map((x) => x.name)).toEqual(['Dumbbell Curl']);
  });

  it('combines query and muscle filter', () => {
    expect(filterExercises(items, 'barbell', 'legs').map((x) => x.name)).toEqual(['Barbell Squat']);
  });
});

describe('groupByLetter', () => {
  it('groups A-Z and buckets non-letters under #', () => {
    const sections = groupByLetter([
      exercise({ name: 'Barbell Squat' }),
      exercise({ name: '3/4 Sit-Up' }),
      exercise({ name: 'Arnold Press' }),
    ]);
    expect(sections.map((s) => s.title)).toEqual(['A', 'B', '#']);
    expect(sections[0]!.data.map((x) => x.name)).toEqual(['Arnold Press']);
  });

  it('sorts within a section', () => {
    const sections = groupByLetter([exercise({ name: 'Bent Row' }), exercise({ name: 'Bench Press' })]);
    expect(sections[0]!.data.map((x) => x.name)).toEqual(['Bench Press', 'Bent Row']);
  });
});

describe('tintForExercise', () => {
  it('tints by primary muscle group with the spec palette', () => {
    expect(tintForExercise(exercise({ name: 'x', muscles: ['chest'] })).tile).toBe('#FF2D55');
    expect(tintForExercise(exercise({ name: 'x', muscles: ['lats'] })).tile).toBe('#AF52DE');
    expect(tintForExercise(exercise({ name: 'x', muscles: ['quadriceps'] })).tile).toBe('#0A84FF');
    expect(tintForExercise(exercise({ name: 'x', muscles: ['shoulders'] })).tile).toBe('#FF9F0A');
    expect(tintForExercise(exercise({ name: 'x', muscles: ['biceps'] })).tile).toBe('#30D158');
  });

  it('falls back to grey for unknown muscles', () => {
    expect(tintForExercise(exercise({ name: 'x', muscles: [] })).tile).toBe('#8E8E93');
    expect(tintForExercise(exercise({ name: 'x', muscles: ['abdominals'] })).tile).toBe('#8E8E93');
  });

  it('picks the glyph from the group', () => {
    expect(tintForExercise(exercise({ name: 'x', muscles: ['quadriceps'] })).glyph).toBe('leg');
    expect(tintForExercise(exercise({ name: 'x', muscles: ['lats'] })).glyph).toBe('pull');
    expect(tintForExercise(exercise({ name: 'x', muscles: ['chest'] })).glyph).toBe('dumbbell');
  });
});

describe('rowLeadingParts', () => {
  it('shows up to two muscles for pinned/recent rows', () => {
    const ex = exercise({ name: 'x', muscles: ['chest', 'triceps'], equipment: 'barbell' });
    expect(rowLeadingParts(ex, false)).toEqual(['Chest', 'Triceps']);
  });

  it('shows equipment plus the primary muscle for library rows', () => {
    const ex = exercise({ name: 'x', muscles: ['shoulders', 'triceps'], equipment: 'dumbbell' });
    expect(rowLeadingParts(ex, true)).toEqual(['Dumbbell', 'Shoulders']);
  });

  it('omits body-only equipment', () => {
    const ex = exercise({ name: 'x', muscles: ['abdominals'], equipment: 'body only' });
    expect(rowLeadingParts(ex, true)).toEqual(['Abs']);
  });
});

describe('muscleDisplayName', () => {
  it('shortens quadriceps to Quads', () => {
    expect(muscleDisplayName('quadriceps')).toBe('Quads');
  });
});

describe('muscleGroupOf', () => {
  it('maps traps to shoulders and abdominals to other', () => {
    expect(muscleGroupOf(exercise({ name: 'x', muscles: ['traps'] }))).toBe('shoulders');
    expect(muscleGroupOf(exercise({ name: 'x', muscles: ['abdominals'] }))).toBe('other');
  });
});

describe('buildSections', () => {
  const alpha = [{ title: 'A', data: [exercise({ name: 'A' })] }];

  it('includes pinned and recent shortcuts when unfiltered', () => {
    const sections = buildSections({
      pinned: [exercise({ name: 'P' })],
      recent: [exercise({ name: 'R' })],
      alpha,
      showShortcuts: true,
    });
    expect(sections.map((s) => s.kind)).toEqual(['pinned', 'recent', 'alpha']);
  });

  it('drops shortcuts and empty sections when filtered', () => {
    const sections = buildSections({
      pinned: [exercise({ name: 'P' })],
      recent: [],
      alpha,
      showShortcuts: false,
    });
    expect(sections.map((s) => s.kind)).toEqual(['alpha']);
  });
});

describe('sectionIndexForLetter', () => {
  const sections = buildSections({
    pinned: [],
    recent: [],
    alpha: [
      { title: 'A', data: [] },
      { title: 'C', data: [] },
    ],
    showShortcuts: false,
  });

  it('resolves exact letters', () => {
    expect(sectionIndexForLetter(sections, 'A')).toBe(0);
    expect(sectionIndexForLetter(sections, 'C')).toBe(1);
  });

  it('resolves missing letters to the nearest section', () => {
    expect(sectionIndexForLetter(sections, 'B')).toBe(0);
    expect(sectionIndexForLetter(sections, 'Z')).toBe(1);
  });
});

describe('findExerciseByName', () => {
  const items = [exercise({ name: 'Barbell Bench Press' })];

  it('prefers exact matches', () => {
    expect(findExerciseByName(items, 'Barbell Bench Press')?.name).toBe('Barbell Bench Press');
  });

  it('falls back to normalized matching', () => {
    expect(findExerciseByName(items, 'barbell bench press')?.name).toBe('Barbell Bench Press');
  });

  it('returns undefined when unknown', () => {
    expect(findExerciseByName(items, 'Nope')).toBeUndefined();
  });
});
