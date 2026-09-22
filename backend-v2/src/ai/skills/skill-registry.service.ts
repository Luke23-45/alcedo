import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiConfigService } from '../ai-config.service';
import {
  SelectedSkill,
  Skill,
  SKILL_DEFINITIONS,
} from './skill.interface';
import { TopicVerdict } from '../guardrails/topic-guard.interface';

/**
 * Deterministic skill selection and prompt rendering.
 *
 * Selection rules (in order):
 *  1. `alwaysOn` skills are always selected.
 *  2. A skill whose `matchGroups` intersect the verdict's signal groups is
 *     selected (group = matched entry minus the trailing `:term`).
 *  3. A skill whose `matchTerms` regex hits the raw message text is selected
 *     — this is what makes `ambiguous` verdicts still get relevant skills.
 *
 * Budget: at most MAX_SKILLS conditional skills and MAX_CHARS total, both
 * from env with sane defaults. Selection is priority-ordered; the lowest
 * priority skills are cut first. Cutting is logged so operators can see it.
 *
 * Rendering: one system message containing a clearly delimited SKILLS block.
 * Skills are trusted server content — the delimiters mark them as
 * instructions, and the user message stays in its own <user_message> block.
 */
@Injectable()
export class SkillRegistry {
  private readonly logger = new Logger(SkillRegistry.name);
  private readonly maxSkills: number;
  private readonly maxChars: number;
  private readonly termRes: Array<{ skill: Skill; re: RegExp; source: string }>;

  constructor(
    @Inject(SKILL_DEFINITIONS) private readonly skills: Skill[],
    private readonly config: ConfigService,
    @Optional() private readonly aiConfig?: AiConfigService,
  ) {
    this.maxSkills = config.get<number>('AI_MAX_SKILLS', 3);
    this.maxChars = config.get<number>('AI_MAX_SKILL_CHARS', 6000);
    this.termRes = this.skills.flatMap((skill) =>
      skill.matchTerms.map((t) => ({
        skill,
        re: new RegExp(t, 'i'),
        source: t,
      })),
    );
    const names = new Set<string>();
    for (const s of this.skills) {
      if (names.has(s.name)) {
        throw new Error(`Duplicate skill name: ${s.name}`);
      }
      names.add(s.name);
    }
  }

  /** All registered skill names — for health/debug endpoints and logs. */
  listSkillNames(): string[] {
    return this.skills.map((s) => s.name);
  }

  select(text: string, verdict: TopicVerdict): SelectedSkill[] {
    const selected = new Map<string, SelectedSkill>();
    const groups = new Set(
      verdict.matched.map((m) => {
        const idx = m.lastIndexOf(':');
        return idx > 0 ? m.slice(0, idx) : m;
      }),
    );

    for (const skill of this.skills) {
      if (skill.alwaysOn) {
        selected.set(skill.name, { skill, reason: 'always-on' });
      }
    }

    for (const skill of this.skills) {
      if (selected.has(skill.name)) continue;
      const hit = skill.matchGroups.find((g) => groups.has(g));
      if (hit) {
        selected.set(skill.name, { skill, reason: `group:${hit}` });
      }
    }

    if (!text) return this.applyBudget([...selected.values()]);

    for (const { skill, re, source } of this.termRes) {
      if (selected.has(skill.name)) continue;
      let hit = false;
      try {
        hit = re.test(text);
      } catch {
        hit = false;
      }
      if (hit) {
        selected.set(skill.name, { skill, reason: `term:${source}` });
      }
    }

    return this.applyBudget([...selected.values()]);
  }

  private applyBudget(selected: SelectedSkill[]): SelectedSkill[] {
    const alwaysOn = selected.filter((s) => s.skill.alwaysOn);
    const conditional = selected
      .filter((s) => !s.skill.alwaysOn)
      .sort((a, b) => b.skill.priority - a.skill.priority);

    const kept: SelectedSkill[] = [...alwaysOn];
    let chars = alwaysOn.reduce((n, s) => n + s.skill.instructions.length, 0);

    for (const s of conditional) {
      if (kept.length - alwaysOn.length >= this.maxSkills) {
        this.logger.debug(
          `Skill budget: dropped '${s.skill.name}' (max ${this.maxSkills} conditional skills)`,
        );
        continue;
      }
      if (chars + s.skill.instructions.length > this.maxChars) {
        this.logger.debug(
          `Skill budget: dropped '${s.skill.name}' (would exceed ${this.maxChars} chars)`,
        );
        continue;
      }
      kept.push(s);
      chars += s.skill.instructions.length;
    }
    // Deterministic order: always-on first, then by priority desc.
    kept.sort((a, b) => {
      const ao = Number(b.skill.alwaysOn ?? false) - Number(a.skill.alwaysOn ?? false);
      if (ao !== 0) return ao;
      return b.skill.priority - a.skill.priority;
    });
    return kept;
  }

  /**
   * Renders the selected skills as one delimited block. Returns null when
   * nothing was selected so the caller adds no extra message.
   */
  render(selected: SelectedSkill[]): string | null {
    if (selected.length === 0) return null;
    const blocks = selected.map(
      (s) => `--- skill: ${s.skill.name} ---\n${s.skill.instructions}`,
    );
    return `<coach_skills>\nThe following skill blocks are trusted instructions. Follow the ones relevant to the user's message.\n\n${blocks.join('\n\n')}\n</coach_skills>`;
  }

  /**
   * Renders with admin overrides applied. Checks the database for customized
   * skill instructions; falls back to the file defaults when unset.
   */
  async renderWithOverrides(selected: SelectedSkill[]): Promise<string | null> {
    if (selected.length === 0) return null;
    if (!this.aiConfig) return this.render(selected);
    const blocks: string[] = [];
    for (const s of selected) {
      const override = await this.aiConfig.getSkillInstructions(s.skill.name);
      blocks.push(`--- skill: ${s.skill.name} ---\n${override ?? s.skill.instructions}`);
    }
    return `<coach_skills>\nThe following skill blocks are trusted instructions. Follow the ones relevant to the user's message.\n\n${blocks.join('\n\n')}\n</coach_skills>`;
  }
}
