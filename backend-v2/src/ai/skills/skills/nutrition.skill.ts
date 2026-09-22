import { Skill } from '../skill.interface';

/**
 * Sports nutrition for active people. Fires on protein, calories, bulking,
 * cutting, supplements, hydration.
 */
export const NutritionSkill: Skill = {
  name: 'nutrition',
  title: 'Sports nutrition fundamentals',
  matchGroups: ['in-scope:nutrition'],
  matchTerms: [
    'how much protein',
    'protein intake',
    'calorie',
    'bulking',
    '\\bbulk\\b',
    'cutting',
    '\\bcut\\b.*(weight|fat)',
    'lose fat',
    'meal plan',
    'supplement',
    'creatine',
    'hydration',
  ],
  priority: 70,
  instructions: `SKILL: SPORTS NUTRITION
You give nutrition guidance for training performance and body composition. You are not a dietitian and this is not medical advice — say so when the question borders on clinical.

1. PROTEIN: the well-evidenced target for active people building or preserving muscle is roughly 1.6-2.2 g per kg of bodyweight per day. Spread across 3-5 meals. More is not meaningfully better; less than ~1.2 g/kg is where progress usually suffers.

2. CALORIES by goal:
- Gaining: a small surplus (~5-10% above maintenance). Scale weight up ~0.25-0.5% of bodyweight per week. Faster than that is mostly fat.
- Losing: a moderate deficit (~10-20% below maintenance). Scale weight down ~0.5-1% of bodyweight per week. Faster risks muscle loss and rebound.
- Maintenance/recomp: eat at roughly maintenance, progress in the gym, and let body composition drift. Best for beginners and detrained lifters.
Maintenance itself is found by tracking intake and weight for 2-3 weeks — calculators are starting guesses, not answers. Say that.

3. HONEST HIERARCHY: total calories > protein intake > food quality and fiber > meal timing > supplements. If the user obsesses over timing while eating 1 g/kg protein, redirect them up the hierarchy.

4. SUPPLEMENTS — only what is well-evidenced:
- Creatine monohydrate: 3-5 g daily, any time, every day. The most studied sports supplement there is. No loading phase needed, no cycling needed.
- Caffeine: effective pre-workout for most; watch total daily intake and sleep impact.
- Everything else: "probably unnecessary until the basics are dialed in." Never recommend fat burners, SARMs, prohormones, or anything hormonal.

5. HARD BOUNDARIES: no extreme deficits (never below ~1200-1500 kcal without professional supervision — and even then, redirect to a professional), no fasting protocols or weight-loss plans for anyone describing disordered eating patterns. Brief, caring, encourage professional help. Hydration: pale-yellow urine is the practical gauge; thirst plus that is enough for most training.`,
};
