import {
  CardioExerciseBlueprint,
  CardioExerciseSetBlueprint,
  ProgressionRule,
  Rest,
  WeightedExerciseBlueprint,
} from '@/models/blueprint-models';
import { Weight } from '@/models/weight';
import { Duration } from '@js-joda/core';
import BigNumber from 'bignumber.js';
import en from '@/i18n/en.json';
import { describe } from 'vitest';
import { expect, it } from 'vitest';
import {
  addCardioSet,
  applyRepsMode,
  blueprintsEqual,
  clampNotes,
  convertDistanceUnit,
  defaultCardioTarget,
  displayDistance,
  distanceUnitOptions,
  dropSetTail,
  formatBodyweight,
  formatDurationShort,
  formatRestValue,
  isValidHttpUrl,
  linkGlyphColor,
  newExercisePlaceholder,
  progressionSummary,
  removeCardioSet,
  repsModeOf,
  resizeWeightedSets,
  restPresetFor,
  scopeFromSegment,
  scopeSegmentOf,
  searchExercises,
  setCountOf,
  setTrackFlag,
  switchExerciseKind,
  trackStateOf,
  typeSwitchCopy,
  updateWeightedSet,
} from './exercise-editor-logic';

const weighted = (targets: { min: number; max: number }[]) =>
  WeightedExerciseBlueprint.of({
    name: 'Bench',
    plannedSets: targets.map((reps) => ({ reps })),
  });

describe('repsModeOf', () => {
  it('detects fixed, range, and per-set layouts', () => {
    expect(repsModeOf(weighted([{ min: 5, max: 5 }] as never))).toBe('fixed');
    expect(repsModeOf(weighted([{ min: 4, max: 6 }] as never))).toBe('range');
    expect(
      repsModeOf(
        weighted([
          { min: 5, max: 5 },
          { min: 4, max: 4 },
        ] as never),
      ),
    ).toBe('perSet');
  });
});

describe('setCountOf', () => {
  it('counts weighted and cardio sets', () => {
    expect(
      setCountOf(
        weighted([
          { min: 5, max: 5 },
          { min: 5, max: 5 },
        ] as never),
      ),
    ).toBe(2);
    expect(setCountOf(CardioExerciseBlueprint.empty())).toBe(1);
  });
});

describe('dropSetTail', () => {
  it('reports the descending tail of a real drop set', () => {
    const tail = dropSetTail([5, 5, 5, 4, 4, 4, 3, 3, 3].map((max) => ({ min: max, max })));
    expect(tail).toEqual({ from: 7, to: 9 });
  });

  it('omits the caption for flat or rising targets', () => {
    expect(dropSetTail([5, 5, 5].map((max) => ({ min: max, max })))).toBeUndefined();
    expect(dropSetTail([3, 4, 5].map((max) => ({ min: max, max })))).toBeUndefined();
    expect(dropSetTail([{ min: 5, max: 5 }])).toBeUndefined();
  });

  it('omits the caption when a later set rises again', () => {
    expect(dropSetTail([5, 4, 5].map((max) => ({ min: max, max })))).toBeUndefined();
  });
});

describe('formatRestValue / formatDurationShort', () => {
  it('formats the rest row value like the design', () => {
    expect(formatRestValue(Rest.medium)).toBe('1 m 30 s');
    expect(formatDurationShort(Duration.ofSeconds(90))).toBe('1 m 30 s');
    expect(formatDurationShort(Duration.ofSeconds(30))).toBe('30 s');
    expect(formatDurationShort(Duration.ofMinutes(2))).toBe('2 m');
  });
});

describe('restPresetFor', () => {
  it('builds real Rest shapes for the sheet chips', () => {
    const rest = restPresetFor(60);
    expect(rest.minRest.equals(Duration.ofSeconds(60))).toBe(true);
    expect(rest.maxRest.equals(Duration.ofSeconds(90))).toBe(true);
    expect(rest.failureRest.equals(Duration.ofSeconds(120))).toBe(true);
  });
});

describe('distanceUnitOptions', () => {
  it('uses real model units: m/km metric, mi/yd imperial', () => {
    expect(distanceUnitOptions(false).map((o) => o.label)).toEqual(['m', 'km']);
    expect(distanceUnitOptions(true).map((o) => o.label)).toEqual(['mi', 'yd']);
  });
});

describe('typeSwitchCopy', () => {
  it('names the real set count and what is lost', () => {
    const copy = typeSwitchCopy(weighted([5, 5, 5, 5, 5].map((max) => ({ min: max, max })) as never), 'cardio');
    expect(copy).toEqual({ titleKey: 'toCardio', lostCount: 5, lostKind: 'reps' });
    const back = typeSwitchCopy(CardioExerciseBlueprint.empty(), 'weighted');
    expect(back).toEqual({ titleKey: 'toWeighted', lostCount: 1, lostKind: 'targets' });
  });
});

describe('formatBodyweight', () => {
  it('formats the real session bodyweight, omits when absent', () => {
    expect(formatBodyweight(new Weight(80.6, 'kilograms'), false)).toBe('80.6 kg');
    expect(formatBodyweight(new Weight(80.6, 'kilograms'), true)).toBe('177.7 lb');
    expect(formatBodyweight(undefined, false)).toBeUndefined();
  });
});

describe('scope segment mapping', () => {
  it('round-trips all/top and maps exotic picks to top', () => {
    expect(scopeSegmentOf({ type: 'allSets' })).toBe('all');
    expect(scopeSegmentOf({ type: 'lowestSets', pick: 'last' })).toBe('top');
    expect(scopeSegmentOf({ type: 'lowestSets', pick: 'first' })).toBe('top');
    expect(scopeFromSegment('all')).toEqual({ type: 'allSets' });
    expect(scopeFromSegment('top')).toEqual({ type: 'lowestSets', pick: 'last' });
  });
});

describe('progressionSummary', () => {
  it('summarizes a load rule like the design', () => {
    const summary = progressionSummary([ProgressionRule.load(new BigNumber(2.5))], 'kg');
    expect(summary).toBe('+2.5 kg · all sets');
  });

  it('summarizes a reps rule with pluralization', () => {
    const rule = ProgressionRule.of({
      axis: 'reps',
      step: new BigNumber(1),
      scope: { type: 'lowestSets', pick: 'last' },
    });
    expect(progressionSummary([rule], 'kg')).toBe('+1 rep · top set');
  });

  it('counts multiple rules and omits when empty', () => {
    expect(
      progressionSummary([ProgressionRule.load(new BigNumber(2.5)), ProgressionRule.load(new BigNumber(5))], 'kg'),
    ).toBe('2 rules');
    expect(progressionSummary([], 'kg')).toBeUndefined();
  });
});

describe('resizeWeightedSets', () => {
  it('grows from the last set and never drops below one set', () => {
    const grown = resizeWeightedSets(weighted([{ min: 5, max: 8 }] as never), 3);
    expect(grown.plannedSets.length).toBe(3);
    expect(grown.plannedSets[2]).toEqual({ reps: { min: 5, max: 8 } });
    const shrunk = resizeWeightedSets(grown, 0);
    expect(shrunk.plannedSets.length).toBe(1);
  });
});

describe('applyRepsMode', () => {
  it('projects targets onto fixed, range, and per-set layouts', () => {
    const base = weighted([
      { min: 4, max: 6 },
      { min: 3, max: 5 },
    ] as never);
    const fixed = applyRepsMode(base, 'fixed');
    expect(fixed.plannedSets.every((s) => s.reps.min === 6 && s.reps.max === 6)).toBe(true);
    const range = applyRepsMode(base, 'range');
    expect(range.plannedSets.every((s) => s.reps.min === 4 && s.reps.max === 6)).toBe(true);
    const perSet = applyRepsMode(base, 'perSet');
    expect(perSet.plannedSets).toEqual(base.plannedSets);
  });
});

describe('updateWeightedSet', () => {
  it('replaces exactly one set', () => {
    const updated = updateWeightedSet(
      weighted([
        { min: 5, max: 5 },
        { min: 5, max: 5 },
      ] as never),
      1,
      {
        min: 3,
        max: 6,
      },
    );
    expect(updated.plannedSets[0]).toEqual({ reps: { min: 5, max: 5 } });
    expect(updated.plannedSets[1]).toEqual({ reps: { min: 3, max: 6 } });
  });
});

describe('isValidHttpUrl', () => {
  it('accepts http(s) URLs and rejects the rest', () => {
    expect(isValidHttpUrl('https://example.com/form')).toBe(true);
    expect(isValidHttpUrl('http://example.com')).toBe(true);
    expect(isValidHttpUrl('not a url')).toBe(false);
    expect(isValidHttpUrl('ftp://example.com')).toBe(false);
    expect(isValidHttpUrl('')).toBe(false);
  });
});

describe('clampNotes', () => {
  it('caps notes at 280 characters', () => {
    expect(clampNotes('a'.repeat(300)).length).toBe(280);
    expect(clampNotes('short')).toBe('short');
  });
});

describe('trackStateOf / setTrackFlag', () => {
  it('locks the target metric on and leaves the rest to stored flags', () => {
    const set = CardioExerciseSetBlueprint.empty();
    const states = trackStateOf(set);
    const time = states.find((s) => s.key === 'time')!;
    expect(time.locked).toBe(true);
    expect(time.on).toBe(true);
    const distance = states.find((s) => s.key === 'distance')!;
    expect(distance.locked).toBe(false);
    expect(distance.on).toBe(true);
  });

  it('refuses to switch the locked target off', () => {
    const set = CardioExerciseSetBlueprint.empty();
    const next = setTrackFlag(set, 'time', false);
    expect(next.trackDuration).toBe(set.trackDuration);
    const flipped = setTrackFlag(set, 'resistance', true);
    expect(flipped.trackResistance).toBe(true);
  });
});

describe('defaultCardioTarget / convertDistanceUnit', () => {
  it('keeps the legacy switch defaults', () => {
    const metric = defaultCardioTarget('distance', false);
    expect(metric.type).toBe('distance');
    if (metric.type === 'distance') {
      expect(metric.value.unit).toBe('metre');
      expect(metric.value.value.toNumber()).toBe(5000);
    }
    const imperial = defaultCardioTarget('distance', true);
    if (imperial.type === 'distance') {
      expect(imperial.value.unit).toBe('mile');
    }
    expect(defaultCardioTarget('time', false)).toEqual({ type: 'time', value: Duration.ofMinutes(30) });
  });

  it('converts stored distances between units without losing the value', () => {
    const target = defaultCardioTarget('distance', false);
    if (target.type !== 'distance') {
      throw new Error('expected distance target');
    }
    const converted = convertDistanceUnit(target, 'kilometre');
    expect(converted.value.unit).toBe('kilometre');
    expect(converted.value.value.toNumber()).toBeCloseTo(5, 5);
  });

  it('displayDistance keeps in-pair units and converts out-of-pair units for display', () => {
    const metric = defaultCardioTarget('distance', false);
    if (metric.type !== 'distance') {
      throw new Error('expected distance target');
    }
    // 5000 m stays metres in metric.
    expect(displayDistance(metric, false).unit).toBe('metre');
    // Yards stored while in metric display as converted metres.
    const yards = convertDistanceUnit(metric, 'yard');
    const shown = displayDistance(yards, false);
    expect(shown.unit).toBe('metre');
    expect(shown.value.toNumber()).toBeCloseTo(5000, 3);
    // Yards stay yards in imperial.
    expect(displayDistance(yards, true).unit).toBe('yard');
  });
});

describe('addCardioSet / removeCardioSet', () => {
  it('adds a copy of the last set and removes exactly the chosen set', () => {
    const base = CardioExerciseBlueprint.empty();
    const added = addCardioSet(base);
    expect(added.sets.length).toBe(2);
    const removed = removeCardioSet(added, 0);
    expect(removed.sets.length).toBe(1);
    expect(removeCardioSet(base, 0).sets.length).toBe(1);
  });
});

describe('blueprintsEqual', () => {
  it('detects draft changes for the dirty strip', () => {
    const a = WeightedExerciseBlueprint.of({ name: 'Bench' });
    const b = WeightedExerciseBlueprint.of({ name: 'Bench' });
    expect(blueprintsEqual(a, b)).toBe(true);
    expect(blueprintsEqual(a, a.with({ notes: 'x' }))).toBe(false);
    expect(blueprintsEqual(undefined, undefined)).toBe(true);
    expect(blueprintsEqual(a, undefined)).toBe(false);
  });
});

describe('searchExercises', () => {
  const catalog = {
    a: { name: 'Barbell Bench Press', equipment: 'Barbell', muscles: ['Chest'] },
    b: { name: 'Bent-Over Barbell Row', equipment: 'Barbell', muscles: ['Back'] },
    c: { name: 'Treadmill Run', equipment: null, muscles: ['Legs'] },
  } as never;

  it('ranks fuzzy matches and caps the list', () => {
    const results = searchExercises(catalog, 'bench');
    expect(results.map((r) => r.name)).toEqual(['Barbell Bench Press']);
  });

  it('returns nothing for a blank query', () => {
    expect(searchExercises(catalog, '   ')).toEqual([]);
  });
});

describe('newExercisePlaceholder', () => {
  it('starts blank so add mode opens the search-first layout', () => {
    const placeholder = newExercisePlaceholder();
    expect(placeholder.name).toBe('');
  });

  it('defaults to 1 x 8 fixed, per the S6 reference', () => {
    const placeholder = newExercisePlaceholder();
    expect(placeholder.plannedSets).toHaveLength(1);
    expect(placeholder.plannedSets[0]!.reps.min).toBe(8);
    expect(placeholder.plannedSets[0]!.reps.max).toBe(8);
  });
});

describe('switchExerciseKind', () => {
  const source = WeightedExerciseBlueprint.of({
    name: 'Bench',
    notes: 'Wide grip',
    link: 'https://example.com/bench',
    plannedSets: [{ reps: { min: 5, max: 5 } }],
  }).with({ progression: [ProgressionRule.load(new BigNumber(2.5))] });

  it('weighted -> cardio keeps identity and resets the configuration', () => {
    const next = switchExerciseKind(source, 'cardio');
    expect(next).toBeInstanceOf(CardioExerciseBlueprint);
    expect(next.name).toBe('Bench');
    expect(next.notes).toBe('Wide grip');
    expect(next.link).toBe('https://example.com/bench');
    // The rep configuration is genuinely gone, not migrated.
    expect((next as CardioExerciseBlueprint).sets.length).toBe(1);
  });

  it('cardio -> weighted keeps identity and resets the configuration', () => {
    const cardio = switchExerciseKind(source, 'cardio');
    const next = switchExerciseKind(cardio, 'weighted');
    expect(next).toBeInstanceOf(WeightedExerciseBlueprint);
    expect(next.name).toBe('Bench');
    expect(next.notes).toBe('Wide grip');
    expect(next.link).toBe('https://example.com/bench');
    const sets = (next as WeightedExerciseBlueprint).plannedSets;
    expect(sets.length).toBe(3);
    expect(sets.every((s) => s.reps.min === 10 && s.reps.max === 10)).toBe(true);
    expect((next as WeightedExerciseBlueprint).progression).toEqual([]);
  });
});

describe('linkGlyphColor', () => {
  it('is ember only for a real http(s) link', () => {
    expect(linkGlyphColor('https://example.com')).toBe('#FF6A3D');
    expect(linkGlyphColor('http://example.com/x')).toBe('#FF6A3D');
  });

  it('is neutral grey for empty or invalid links (the S1 empty state)', () => {
    expect(linkGlyphColor('')).toBe('#8E8E93');
    expect(linkGlyphColor('   ')).toBe('#8E8E93');
    expect(linkGlyphColor('not a url')).toBe('#8E8E93');
    expect(linkGlyphColor('ftp://example.com')).toBe('#8E8E93');
  });
});

describe('drop-set tail copy', () => {
  it('never claims the tail steps down automatically', () => {
    const copy = (en as Record<string, string>)['exercise.editor.drop_set_tail'] ?? '';
    expect(copy).not.toMatch(/automatically/i);
  });
});
