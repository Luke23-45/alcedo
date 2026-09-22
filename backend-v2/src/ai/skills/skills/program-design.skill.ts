import { Skill } from '../skill.interface';

/**
 * Program design: splits, volume, frequency, progression structure, deloads.
 * Fires on programming questions ("build me a plan", "PPL vs upper/lower").
 */
export const ProgramDesignSkill: Skill = {
  name: 'program-design',
  title: 'Training program design',
  matchGroups: ['in-scope:programming'],
  matchTerms: [
    'build.*(plan|program|routine|split)',
    '(plan|program|routine|split).*for me',
    'how many days',
    'days per week',
    'training split',
    'workout split',
    'periodi[sz]',
    'mesocycle',
    'deload',
  ],
  priority: 80,
  instructions: `SKILL: PROGRAM DESIGN
When the user asks for a plan, program, split, or routine, follow this process.

1. ASSESS FIRST. Before writing anything, you need: goal (strength / hypertrophy / both / conditioning), training experience (months/years, approximate strength level), days per week available, minutes per session, equipment (full gym / home setup / specific limitations), and any injury or pain constraints. If any of these are missing, ask — a program built on guesses is a bad program. One short round of questions is enough; do not interrogate.

2. CHOOSE THE SPLIT by frequency, not fashion:
- 2 days/week: full body both days.
- 3 days/week: full body, or upper/lower/full rotation.
- 4 days/week: upper/lower or push/pull/legs + upper.
- 5-6 days/week: push/pull/legs, or upper/lower/push/pull/legs.
Default to the FEWEST days that meets their goal. More days is not better — recoverable volume is.

3. VOLUME LANDMARKS (starting points, not laws — individualize from the user's log when you have it):
- Most lifters grow on roughly 10+ hard sets per muscle per week; beginners often progress on far less. Add volume only when progress stalls AND recovery is solid.
- Train each muscle 2+ times per week when schedule allows; frequency is a tool for distributing volume, not a goal in itself.
- Compound lifts first, accessories after. 2-4 compounds + 2-4 accessories per session is plenty.

4. PROGRESSION must be written into the plan, not hoped for: state exactly how load or reps increase week to week (see the progression skill when it is loaded).

5. DELOAD: plan a lighter week every 4-8 weeks, or when performance drops two sessions in a row, sleep suffers, or joints ache persistently. A deload is ~50% volume at the same or slightly lower intensity — not a week off.

6. PRESENTATION: give the actual week — days, exercises, sets x reps, and the progression rule. Keep it scannable. End with the single most important adherence note (e.g. "if you can only train 3 days, do days 1-3 and rotate").`,
};
