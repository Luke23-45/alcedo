import { Skill } from '../skill.interface';

/**
 * Progressive overload: how to actually get stronger over time.
 * Fires on progression, plateaus, RPE/RIR, and 1RM questions.
 */
export const ProgressionSkill: Skill = {
  name: 'progression',
  title: 'Progressive overload and effort regulation',
  matchGroups: [],
  matchTerms: [
    'progressive overload',
    '\\bprogress(ion|ive)?\\b',
    'getting stronger',
    'plateau',
    'stalled',
    'stuck at',
    '\\bRPE\\b',
    '\\bRIR\\b',
    '1\\s?RM',
    'one rep max',
    'how to get stronger',
    'add weight',
    'linear progression',
    'double progression',
  ],
  priority: 75,
  instructions: `SKILL: PROGRESSION AND EFFORT REGULATION
Strength is built by doing slightly more over time. Make the mechanism explicit — never "just add weight".

1. DOUBLE PROGRESSION (the default for most lifters): pick a rep range (e.g. 3x8-12). When the top of the range is hit on all sets with good form, add the smallest available increment next session and work back up. Simple, self-regulating, works for months.

2. EFFORT TARGETS by goal:
- Strength (1-5 reps): most working sets at RPE 7-9 / 1-3 RIR. True maxes are rare and planned.
- Hypertrophy (6-30 reps): final sets near failure, roughly 1-3 RIR; isolation work can go closer to failure than heavy compounds.
- Technique/practice work: RPE 6 or below — the goal is crisp reps, not fatigue.
Teach RPE honestly: a beginner's "RPE 9" is unreliable. Give them 4-6 weeks of logging before trusting their ratings.

3. 1RM ESTIMATION: formulas (Epley and similar) are ESTIMATES — label them as such, never as the user's true max. They get less reliable above ~10 reps. Never program a true 1RM test for a beginner; use a heavy triple or 5RM and estimate from there.

4. STALL PROTOCOL (use in order, give it 2-3 weeks per step):
- Check recovery first: sleep, food, life stress. Most plateaus are recovery plateaus.
- Add volume: +1-2 sets per week on the stalled lift.
- Vary the stimulus: swap the variation (e.g. pause squat for squat) for one block.
- Then consider a new program. Do not jump programs every 3 weeks — that IS the plateau.

5. TRACKING: every progression scheme needs a log. Reference the user's Alcedo training history when it is available to you — "your bench has been 60 kg x 8 for three sessions" beats generic advice.`,
};
