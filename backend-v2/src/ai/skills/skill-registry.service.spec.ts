import { ConfigService } from '@nestjs/config';
import { SkillRegistry } from './skill-registry.service';
import { Skill } from './skill.interface';
import { ALL_SKILLS } from './skill-definitions';
import { TopicVerdict } from '../guardrails/topic-guard.interface';

function configWith(values: Record<string, number>): ConfigService {
  return {
    get: (key: string, fallback?: number) =>
      values[key] ?? fallback,
  } as unknown as ConfigService;
}

function verdict(matched: string[]): TopicVerdict {
  return { matched, verdict: 'in-scope' };
}

describe('SkillRegistry', () => {
  const registry = new SkillRegistry(ALL_SKILLS, configWith({}));

  it('registers the six coaching skills with unique names', () => {
    const names = (registry as unknown as { listSkillNames(): string[] }).listSkillNames();
    expect(names).toEqual([
      'program-design',
      'progression',
      'form-check',
      'nutrition',
      'recovery',
      'conditioning',
    ]);
    expect(new Set(names).size).toBe(names.length);
  });

  it('selects program-design from the programming signal group', () => {
    const selected = registry.select('Build me a 4 day program', verdict(['in-scope:programming:5/3/1']));
    expect(selected.map((s) => s.skill.name)).toContain('program-design');
    expect(selected.find((s) => s.skill.name === 'program-design')?.reason).toBe(
      'group:in-scope:programming',
    );
  });

  it('selects form-check from lift terms even without a group match', () => {
    const selected = registry.select(
      'How do I deadlift properly?',
      verdict(['in-scope:lifts:deadlift']),
    );
    expect(selected.map((s) => s.skill.name)).toContain('form-check');
  });

  it('selects nutrition via matchTerms on ambiguous verdicts', () => {
    const selected = registry.select('How much protein should I eat?', verdict([]));
    expect(selected.map((s) => s.skill.name)).toContain('nutrition');
  });

  it('selects nothing for unrelated chatter', () => {
    const selected = registry.select('Thanks, that was helpful!', verdict([]));
    expect(selected).toEqual([]);
  });

  it('never selects the same skill twice', () => {
    const selected = registry.select(
      'Check my squat form, how do I squat properly?',
      verdict(['in-scope:lifts:squat']),
    );
    const names = selected.map((s) => s.skill.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('caps conditional skills by count, keeping highest priority', () => {
    const tiny = new SkillRegistry(ALL_SKILLS, configWith({ AI_MAX_SKILLS: 1 }));
    const selected = tiny.select(
      'Build me a program with progression and check my deadlift form',
      verdict(['in-scope:programming:split', 'in-scope:lifts:deadlift', 'in-scope:training:reps']),
    );
    const conditional = selected.filter((s) => !s.skill.alwaysOn);
    expect(conditional.length).toBeLessThanOrEqual(1);
    // form-check (85) outranks program-design (80) and progression (75)
    expect(conditional[0]?.skill.name).toBe('form-check');
  });

  it('caps injected skills by character budget', () => {
    const tiny = new SkillRegistry(ALL_SKILLS, configWith({ AI_MAX_SKILL_CHARS: 100 }));
    const selected = tiny.select('How do I squat?', verdict(['in-scope:lifts:squat']));
    const rendered = tiny.render(selected);
    const total = selected.reduce((n, s) => n + s.skill.instructions.length, 0);
    expect(total).toBeLessThanOrEqual(100);
    expect(rendered === null || typeof rendered === 'string').toBe(true);
  });

  it('renders a delimited skills block marked as trusted instructions', () => {
    const selected = registry.select('How much protein per day?', verdict(['in-scope:nutrition:protein']));
    const rendered = registry.render(selected);
    expect(rendered).toContain('<coach_skills>');
    expect(rendered).toContain('</coach_skills>');
    expect(rendered).toContain('--- skill: nutrition ---');
    expect(rendered).toContain('trusted instructions');
  });

  it('renders null when nothing is selected', () => {
    expect(registry.render([])).toBeNull();
  });

  it('rejects duplicate skill names at construction', () => {
    const dup: Skill = { ...ALL_SKILLS[0], matchGroups: [], matchTerms: [] };
    expect(
      () =>
        new SkillRegistry([...ALL_SKILLS, dup], configWith({})),
    ).toThrow(/Duplicate skill name/);
  });
});
