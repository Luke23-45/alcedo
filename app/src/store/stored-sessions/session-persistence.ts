/**
 * Serializes session persistence so Finish can await durability.
 *
 * Session DB writes are dispatched as fire-and-forget listener effects. That is fine for
 * mid-workout edits, but Finish navigates away immediately after dispatching - if the OS
 * kills the app before the writes land, the session row keeps `active = true` and the next
 * launch "resumes" a finished workout. Every session DB write registers here; the finish
 * flow awaits the flush before navigating.
 */
let inFlightWrites = 0;
let flushWaiters: Array<() => void> = [];

/** Registers an in-flight session DB write. Returns the same work for awaiting. */
export function trackSessionWrite<T>(work: PromiseLike<T>): Promise<T> {
  inFlightWrites += 1;
  const done = Promise.resolve(work);
  const release = () => {
    inFlightWrites -= 1;
    if (inFlightWrites === 0) {
      const waiters = flushWaiters;
      flushWaiters = [];
      waiters.forEach((wake) => wake());
    }
  };
  done.then(release, release);
  return done;
}

/**
 * Resolves when every session DB write registered so far has settled. Writes registered
 * after the call are not covered - the finish flow registers its own writes explicitly
 * and awaits them directly.
 */
export function awaitSessionWritesFlushed(): Promise<void> {
  if (inFlightWrites === 0) {
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    flushWaiters.push(resolve);
  });
}
