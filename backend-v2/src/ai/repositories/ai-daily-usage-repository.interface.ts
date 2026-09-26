/**
 * Per-user daily AI quota counters. The counter is incremented with a single
 * atomic operation, so concurrent requests each observe a distinct
 * post-increment count and at most `limit` of them pass the quota check.
 * `date` is the UTC day as `YYYY-MM-DD`.
 */
export abstract class AiDailyUsageRepository {
  /**
   * Atomically increments today's counter for the user (creating the row
   * when absent) and returns the post-increment count.
   */
  abstract incrementAndGet(userId: string, date: string): Promise<number>;
  /**
   * Deletes rows created before `cutoff` — mirrors the Mongo TTL on
   * `createdAt` (3 days). Returns the removed count.
   */
  abstract purgeBefore(cutoff: Date): Promise<number>;
}
