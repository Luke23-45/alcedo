/** Pre-call topic verdict. `ambiguous` is the safe default — it proceeds to the model. */
export type TopicVerdictValue = 'in-scope' | 'ambiguous' | 'off-topic';

export interface TopicVerdict {
  verdict: TopicVerdictValue;
  /** Matched keywords/phrases, prefixed with their signal group, e.g. 'in-scope:bench press'. */
  matched: string[];
  /**
   * Set when the text contains self-harm signals. The caller handles this on a
   * dedicated safe path (no model call, no quota) instead of the topic verdict.
   */
  selfHarm?: boolean;
}

/**
 * Cheap pre-call topic classifier. The keyword implementation is a v1
 * heuristic — replace it with an ML classifier behind this same interface
 * when traffic justifies it.
 */
export abstract class TopicGuard {
  abstract classify(text: string): Promise<TopicVerdict>;
}
