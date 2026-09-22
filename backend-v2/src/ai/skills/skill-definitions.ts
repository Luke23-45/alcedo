import { Skill } from './skill.interface';
import { ConditioningSkill } from './skills/conditioning.skill';
import { FormCheckSkill } from './skills/form-check.skill';
import { NutritionSkill } from './skills/nutrition.skill';
import { ProgramDesignSkill } from './skills/program-design.skill';
import { ProgressionSkill } from './skills/progression.skill';
import { RecoverySkill } from './skills/recovery.skill';

/**
 * The explicit skill list. To add a skill: write it under skills/, import it
 * here, append it below. Nothing is globbed or auto-discovered — every skill
 * that can reach the prompt is visible in this one file.
 */
export const ALL_SKILLS: Skill[] = [
  ProgramDesignSkill,
  ProgressionSkill,
  FormCheckSkill,
  NutritionSkill,
  RecoverySkill,
  ConditioningSkill,
];
