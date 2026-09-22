/**
 * A skill is a named block of trusted coaching instructions injected into the
 * prompt when the user's turn calls for it. Skills are server-owned content —
 * they are never influenced by user input and never shown to the client.
 *
 * Selection is deterministic and auditable: a skill is selected when the
 * topic-guard verdict carries one of its `matchGroups`, or when one of its
 * `matchTerms` regexes hits the raw message text (so `ambiguous` verdicts
 * still get relevant skills). `alwaysOn` skills are injected on every turn.
 */
export interface Skill {
  /** Stable id, e.g. 'program-design'. Used in logs and usage records. */
  name: string;
  /** One-line description for operators and logs. */
  title: string;
  /**
   * Topic-guard signal groups that trigger this skill, e.g.
   * 'in-scope:programming'. Compared against the group prefix of each entry
   * in `TopicVerdict.matched` (the trailing `:term` is stripped).
   */
  matchGroups: string[];
  /**
   * Extra regex sources for finer targeting, applied to the raw message
   * text (case-insensitive). Keep these specific — generic words here
   * cause the skill to fire on unrelated turns.
   */
  matchTerms: string[];
  /** Injected on every model turn regardless of classification. */
  alwaysOn?: boolean;
  /**
   * Higher priority wins when the token budget forces a cut. 1-100.
   * alwaysOn skills should use low priority so conditional skills win ties.
   */
  priority: number;
  /** The instruction block. Written as direct guidance to the coach. */
  instructions: string;
}

export interface SelectedSkill {
  skill: Skill;
  /** Why it was selected: 'always-on' | 'group:<group>' | 'term:<pattern>'. */
  reason: string;
}

/** Injection token for the explicit skill list (see skill-definitions.ts). */
export const SKILL_DEFINITIONS = Symbol('SKILL_DEFINITIONS');
