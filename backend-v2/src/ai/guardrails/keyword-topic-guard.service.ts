import { Injectable, Logger, Optional } from '@nestjs/common';
import { AiConfigService } from '../ai-config.service';
import { TopicGuard, TopicVerdict } from './topic-guard.interface';

interface SignalGroup {
  label: string;
  terms: string[];
}

interface CompiledSignal {
  group: string;
  term: string;
  re: RegExp;
}

/**
 * In-scope vocabulary: the things Alcedo Coach exists to talk about.
 * Kept to concrete lifts, muscles, and training/nutrition/recovery concepts
 * so generic words ("plan", "run", "set") cannot single-handedly pass the gate.
 */
const IN_SCOPE: SignalGroup[] = [
  {
    label: 'lifts',
    terms: [
      'squat', 'squats', 'bench press', 'bench', 'deadlift', 'deadlifts',
      'overhead press', 'ohp', 'shoulder press', 'military press', 'push press',
      'barbell row', 'bent over row', 'pendlay row', 'pull-up', 'pullup', 'pull-ups',
      'chin-up', 'chinup', 'chin-ups', 'dip', 'dips', 'lunge', 'lunges',
      'bulgarian split squat', 'leg press', 'leg curl', 'leg extension',
      'calf raise', 'calf raises', 'bicep curl', 'biceps curl', 'hammer curl',
      'preacher curl', 'tricep pushdown', 'triceps extension', 'skullcrusher',
      'skullcrushers', 'lateral raise', 'front raise', 'rear delt fly', 'face pull',
      'face pulls', 'shrug', 'shrugs', 'hip thrust', 'glute bridge',
      'romanian deadlift', 'rdl', 'stiff leg deadlift', 'sumo deadlift',
      'trap bar deadlift', 'farmer carry', "farmer's walk", 'push-up', 'pushup',
      'push-ups', 'plank', 'sit-up', 'situp', 'crunch', 'crunches',
      'hanging leg raise', 'cable fly', 'cable crossover', 'pec deck',
      'lat pulldown', 'seated cable row', 'arnold press', 'snatch',
      'clean and jerk', 'power clean', 'hang clean', 'thruster',
      'kettlebell swing', 'turkish get-up', 'turkish getup', 'goblet squat',
      'box squat', 'pause squat', 'front squat', 'zercher squat', 'incline bench',
      'decline bench', 'close grip bench', 'floor press', 'jm press',
      'good morning', 'nordic curl', 'back extension', 'hyperextension',
      'reverse hyper', 'muscle-up', 'muscle up', 'handstand push-up',
    ],
  },
  {
    label: 'muscles',
    terms: [
      'chest', 'pecs', 'pec', 'back', 'lats', 'lat', 'traps', 'trapezius',
      'shoulders', 'delts', 'deltoids', 'front delts', 'side delts', 'rear delts',
      'biceps', 'bicep', 'triceps', 'tricep', 'forearms', 'forearm', 'quads',
      'quadriceps', 'hamstrings', 'hamstring', 'glutes', 'glute', 'calves', 'calf',
      'abs', 'abdominals', 'core', 'obliques', 'hip flexors', 'adductors',
      'abductors', 'rotator cuff', 'lower back', 'upper back', 'spinal erectors',
    ],
  },
  {
    label: 'training',
    terms: [
      'workout', 'workouts', 'training', 'exercise', 'exercises', 'lifting',
      'lift', 'lifter', 'reps', 'rep', 'sets', 'hypertrophy', 'hypertrophic',
      'strength', 'powerlifting', 'powerlifter', 'bodybuilding', 'bodybuilder',
      'progressive overload', 'rpe', 'rir', '1rm', 'one rep max',
      'personal record', 'pr', 'volume', 'intensity', 'frequency', 'deload',
      'taper', 'tapering', 'periodization', 'periodized', 'mesocycle',
      'microcycle', 'macrocycle', 'superset', 'supersets', 'drop set',
      'drop sets', 'giant set', 'rest pause', 'myo reps', 'tempo',
      'time under tension', 'range of motion', 'rom', 'mind muscle connection',
      'warm-up', 'warmup', 'warm up', 'cool-down', 'cooldown', 'cool down',
      'mobility', 'stretching', 'stretch', 'foam rolling', 'foam roller',
      'activation', 'form check', 'technique', 'cue', 'cues', 'bar path',
      'bracing', 'brace', 'valsalva', 'grip', 'stance', 'failure', 'amrap',
      'emom', 'metcon', 'conditioning', 'gpp', 'accessory', 'accessories',
      'compound lift', 'compound movement', 'isolation', 'unilateral',
      'bilateral', 'training log', 'workout log', 'training split',
    ],
  },
  {
    label: 'cardio',
    terms: [
      'cardio', 'running', 'run', 'runner', 'jogging', 'jog', 'sprint',
      'sprints', 'sprinting', 'cycling', 'cyclist', 'bike', 'biking',
      'swimming', 'swim', 'swimmer', 'rowing', 'rower', 'elliptical',
      'stairmaster', 'stair climber', 'treadmill', 'hiit', 'liss', 'zone 2',
      'zone2', 'vo2 max', 'vo2max', 'marathon', 'half marathon', '5k', '10k',
      'triathlon', 'rucking', 'ruck', 'incline walk', 'jump rope', 'skipping',
      'burpee', 'burpees', 'aerobic', 'anaerobic', 'endurance', 'stamina',
      'cardiovascular',
    ],
  },
  {
    label: 'nutrition',
    terms: [
      'protein', 'protein intake', 'calories', 'calorie', 'macros',
      'macronutrients', 'carbs', 'carbohydrates', 'fiber', 'creatine',
      'caffeine', 'pre-workout', 'preworkout', 'post-workout', 'postworkout',
      'meal prep', 'meal plan', 'bulking', 'bulk', 'cutting', 'maintenance',
      'deficit', 'caloric deficit', 'surplus', 'caloric surplus', 'recomp',
      'recomposition', 'hydration', 'hydrated', 'water intake', 'electrolytes',
      'supplement', 'supplements', 'whey', 'casein', 'multivitamin',
      'vitamin d', 'magnesium', 'omega-3', 'omega 3', 'fish oil', 'meal timing',
      'intermittent fasting', 'diet', 'dieting', 'diet plan', 'nutrition',
      'nutritious', 'micros', 'micronutrients',
    ],
  },
  {
    label: 'recovery',
    terms: [
      'recovery', 'recover', 'sleep', 'sleeping', 'rest day', 'rest days',
      'soreness', 'doms', 'fatigue', 'fatigued', 'overtraining', 'overtrained',
      'overreaching', 'massage', 'massage gun', 'sauna', 'cold plunge',
      'ice bath', 'deload week', 'sleep hygiene', 'nap', 'naps',
      'active recovery',
    ],
  },
  {
    label: 'programming',
    terms: [
      'program', 'programming', 'routine', 'split', 'workout plan',
      'training plan', 'training program', 'schedule', 'push pull legs', 'ppl',
      'upper lower', 'full body', 'bro split', '5/3/1', 'starting strength',
      'stronglifts', 'gzcl', 'nsuns', 'conjugate', 'phul', 'phat',
      'texas method', 'madcow',
    ],
  },
];

/**
 * Strong off-topic signals. A message matching these with NO in-scope match
 * is blocked; mixed with in-scope signals it falls through to `ambiguous`.
 */
const OFF_TOPIC: SignalGroup[] = [
  {
    label: 'politics',
    terms: [
      'election', 'elections', 'vote for', 'voting', 'voter', 'president',
      'presidential', 'senate', 'senator', 'congress', 'congressman',
      'parliament', 'democrat', 'democrats', 'republican', 'republicans',
      'campaign', 'ballot', 'referendum', 'prime minister', 'dictatorship',
      'dictator', 'coup', 'impeachment', 'impeach', 'political party',
      'left-wing', 'right-wing', 'gerrymandering', 'politician',
    ],
  },
  {
    label: 'finance',
    terms: [
      'stock market', 'stock', 'stocks', 'cryptocurrency', 'crypto', 'bitcoin',
      'ethereum', 'dogecoin', 'investment', 'investing', 'invest', 'investor',
      'portfolio', 'mortgage', 'loan', 'taxes', 'tax return', 'tax advice',
      '401k', 'retirement fund', 'day trading', 'forex', 'interest rate',
      'inflation', 'credit score', 'credit card debt', 'insurance', 'budgeting',
      'budget planner', 'nft', 'defi',
    ],
  },
  {
    label: 'coding',
    terms: [
      'write code', 'debug', 'debugging', 'python', 'javascript', 'typescript',
      'golang', 'rust', 'sql', 'rest api', 'kubernetes', 'docker', 'github',
      'algorithm', 'machine learning', 'neural network', 'ai model',
      'tech support', 'wifi', 'router', 'programming language',
      'software engineer', 'software developer', 'app development',
      'web development', 'website', 'database', 'server', 'linux', 'regex',
    ],
  },
  {
    label: 'legal',
    terms: [
      'lawsuit', 'sued', 'suing', 'lawyer', 'attorney', 'divorce',
      'custody', 'legal advice', 'contract law', 'will and testament',
      'subpoena', 'litigation', 'settlement',
    ],
  },
  {
    label: 'relationships',
    terms: [
      'dating advice', 'dating profile', 'breakup', 'broke up', 'breaking up',
      'marriage counseling', 'relationship advice', 'cheating', 'cheated',
      'girlfriend', 'boyfriend',
    ],
  },
  {
    label: 'academic',
    terms: [
      'homework', 'math problem', 'math homework', 'essay', 'thesis',
      'dissertation', 'chemistry', 'physics problem', 'history essay',
      'solve for x', 'calculus', 'algebra', 'geometry', 'biology exam',
      'book report',
    ],
  },
  {
    label: 'travel',
    terms: [
      'passport', 'visa application', 'flight booking', 'hotel booking',
      'itinerary', 'travel insurance',
    ],
  },
  {
    label: 'entertainment',
    terms: [
      'movie recommendation', 'netflix', 'tv show', 'tv series', 'video game',
      'gaming pc', 'playstation', 'xbox',
    ],
  },
];

/** Checked before anything else — handled on a dedicated safe path, never blocked as "off-topic". */
const SELF_HARM_TERMS = [
  'kill myself',
  'killing myself',
  'end my life',
  'ending my life',
  'suicide',
  'suicidal',
  'self-harm',
  'self harm',
  'hurt myself',
  'hurting myself',
  'cutting myself',
  'cut myself',
  'want to die',
  "don't want to live",
  'do not want to live',
  'end it all',
];

function escapeRegExp(term: string): string {
  return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Word-boundary matching via lookarounds instead of \b, so terms with
 * non-word characters ('c++', '5/3/1', 'zone 2') still match correctly
 * while 'pr' never matches inside 'improve'.
 */
function toSignalRegex(term: string): RegExp {
  return new RegExp(`(?<![A-Za-z0-9])${escapeRegExp(term)}(?![A-Za-z0-9])`, 'i');
}

function compile(groups: SignalGroup[], scope: string): CompiledSignal[] {
  return groups.flatMap((g) =>
    g.terms.map((term) => ({ group: `${scope}:${g.label}`, re: toSignalRegex(term), term })),
  );
}

const IN_SCOPE_SIGNALS = compile(IN_SCOPE, 'in-scope');
const OFF_TOPIC_SIGNALS = compile(OFF_TOPIC, 'off-topic');
const SELF_HARM_RES = SELF_HARM_TERMS.map(toSignalRegex);

function matchAll(text: string, signals: CompiledSignal[]): string[] {
  const matched: string[] = [];
  for (const s of signals) {
    if (s.re.test(text)) matched.push(`${s.group}:${s.term}`);
  }
  return matched;
}

/**
 * Heuristic pre-call classifier.
 *
 * Rules:
 * - self-harm signals -> handled on the dedicated safe path (verdict stays
 *   `ambiguous` so it is never treated as a topic block).
 * - strong off-topic match with no in-scope match -> `off-topic` (blocked).
 * - in-scope match with no off-topic match -> `in-scope`.
 * - mixed signals, or no signals at all -> `ambiguous` (proceeds). Short
 *   messages like "thanks" must never be blocked — the system prompt and
 *   output checks are the backstop.
 *
 * Admins can extend the in-scope vocabulary at runtime via the `ai.guardrails`
 * site config (JSON `{"extraInScope":["term", ...]}`). Those terms only ever
 * ADD in-scope matches — they cannot disable the off-topic or self-harm
 * signals, and a malformed value is ignored (logged) rather than breaking
 * classification. Terms are cached for 60s.
 */
@Injectable()
export class KeywordTopicGuard extends TopicGuard {
  private readonly logger = new Logger(KeywordTopicGuard.name);
  private extraTermsCache: { at: number; signals: CompiledSignal[] } | null = null;
  private static readonly EXTRA_TTL_MS = 60_000;

  constructor(@Optional() private readonly aiConfig?: AiConfigService) {
    super();
  }

  async classify(text: string): Promise<TopicVerdict> {
    for (const re of SELF_HARM_RES) {
      if (re.test(text)) {
        return { matched: ['self-harm'], selfHarm: true, verdict: 'ambiguous' };
      }
    }
    const inScope = [
      ...matchAll(text, IN_SCOPE_SIGNALS),
      ...matchAll(text, await this.extraInScopeSignals()),
    ];
    const offTopic = matchAll(text, OFF_TOPIC_SIGNALS);
    if (offTopic.length > 0 && inScope.length === 0) {
      return { matched: offTopic, verdict: 'off-topic' };
    }
    if (inScope.length > 0 && offTopic.length === 0) {
      return { matched: inScope, verdict: 'in-scope' };
    }
    return { matched: [...inScope, ...offTopic], verdict: 'ambiguous' };
  }

  private async extraInScopeSignals(): Promise<CompiledSignal[]> {
    const now = Date.now();
    if (
      this.extraTermsCache &&
      now - this.extraTermsCache.at < KeywordTopicGuard.EXTRA_TTL_MS
    ) {
      return this.extraTermsCache.signals;
    }
    let signals: CompiledSignal[] = [];
    if (this.aiConfig) {
      try {
        const raw = await this.aiConfig.getGuardrails();
        if (raw) {
          const parsed = JSON.parse(raw) as { extraInScope?: unknown };
          const terms = Array.isArray(parsed?.extraInScope) ? parsed.extraInScope : [];
          signals = terms
            .filter(
              (t): t is string =>
                typeof t === 'string' && t.trim().length > 0 && t.length <= 64,
            )
            .slice(0, 200)
            .map((term) => ({
              group: 'in-scope:admin',
              re: toSignalRegex(term.trim().toLowerCase()),
              term: term.trim().toLowerCase(),
            }));
        }
      } catch (error) {
        // A malformed admin value must never break classification.
        this.logger.warn(
          `Ignoring malformed ai.guardrails config: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
    this.extraTermsCache = { at: now, signals };
    return signals;
  }
}
