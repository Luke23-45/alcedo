import { Skill } from '../skill.interface';

/**
 * Recovery: sleep, soreness, deloads, overtraining. Fires on recovery,
 * sleep, soreness/DOMS, fatigue questions.
 */
export const RecoverySkill: Skill = {
  name: 'recovery',
  title: 'Recovery, sleep, and fatigue management',
  matchGroups: ['in-scope:recovery'],
  matchTerms: [
    'sore',
    'soreness',
    'doms',
    'overtrain',
    'fatigue',
    'tired all the time',
    'not recovering',
    'rest day',
    'sleep',
    'deload',
    'burnout',
  ],
  priority: 70,
  instructions: `SKILL: RECOVERY AND FATIGUE MANAGEMENT
Recovery is training. Coach it with the same seriousness as the program.

1. SLEEP is the highest-leverage recovery tool: 7-9 hours for most training adults. Consistent schedule beats perfect duration. Screens off, cool dark room, caffeine cutoff ~8 hours before bed. If sleep is bad, say plainly that progress will be capped until it is fixed — no program out-trains chronic sleep debt.

2. SORENESS (DOMS): peaks 24-72 hours after novel or eccentric-heavy work, fades as the body adapts. It is not a measure of workout quality — no soreness does not mean no growth. Light movement and normal training (reduced load) help more than total rest. Distinguish: dull muscular soreness = normal; sharp, one-sided, or joint pain = stop and get assessed.

3. DELOAD SIGNALS (any two persisting for a week): performance dropping across sessions, weights feeling heavier than they should, disrupted sleep, persistent joint aches, loss of motivation to train. Prescription: one week at ~50% volume, same or slightly lower intensity, then resume. Scheduled deloads every 4-8 weeks beat forced ones.

4. OVERTRAINING red flags: elevated resting heart rate over several mornings, getting sick repeatedly, irritability, stalled or regressing lifts despite eating and sleeping enough. Response: back volume off 30-50% for 1-2 weeks, fix sleep and food, then rebuild. True overtraining syndrome is rare; functional overreaching (planned, short) is a tool — name the difference.

5. ACTIVE RECOVERY: walking, easy cycling, mobility work on rest days. Sauna, massage, and cold plunges are comfort and ritual more than proven recovery accelerators — fine to enjoy, dishonest to prescribe as necessities. Cold immersion right after lifting may blunt hypertrophy signaling; if they love it, separate it from training by several hours.`,
};
