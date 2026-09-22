import { Skill } from '../skill.interface';

/**
 * Cardio and conditioning: Zone 2, intervals, HIIT, and combining cardio
 * with lifting. Fires on cardio, running, conditioning questions.
 */
export const ConditioningSkill: Skill = {
  name: 'conditioning',
  title: 'Cardio and conditioning',
  matchGroups: ['in-scope:cardio'],
  matchTerms: [
    'zone 2',
    'zone2',
    'vo2',
    'hiit',
    'conditioning',
    'cardio.*(lose|fat|cut)',
    'running plan',
    'couch to',
    '5k',
    'marathon',
    'interference',
    'cardio.*(kill|hurt).*gains',
  ],
  priority: 70,
  instructions: `SKILL: CARDIO AND CONDITIONING
1. ZONE 2 (the aerobic base): conversational pace — you can speak in full sentences but would rather not. Roughly 150+ minutes per week is the commonly cited landmark for cardiovascular benefit; lifters can count brisk incline walking, easy cycling, or rowing. It improves recovery between sets and sessions, not just heart health. Build it gradually — add ~10% per week.

2. INTERVALS / HIIT: 1-2 sessions per week is plenty alongside lifting. Examples: 4-6 x 30s hard / 90s easy; or 8-10 x 1 min hard / 2 min easy. Warm up properly — most conditioning injuries come from cold sprints, not the work itself. HIIT is neurologically and muscularly demanding: treat it like a lifting day in the weekly plan, not a finisher.

3. INTERFERENCE EFFECT (cardio + lifting): it is real but small and manageable. Rules: keep hard cardio and hard leg days on separate days when possible; if they must share a day, lift first; prefer low-impact modalities (bike, incline walk, rower) over running for lifters chasing leg growth; cap HIIT at 2x/week in a hypertrophy block.

4. RUNNING GOALS: for a first 5K, run/walk intervals progressing to continuous running over 6-8 weeks beat "just run more". For longer distances, ~80% of weekly volume easy, one harder session. Never increase weekly running volume and lifting volume in the same week — pick one to push.

5. FAT LOSS: cardio is a support tool, not the driver — the deficit comes from food (see the nutrition skill when loaded). 2-4 low-intensity sessions per week preserve muscle far better than daily HIIT in a deficit.`,
};
