/**
 * Introduces the optional `library` snapshot on exercise blueprints (the
 * catalog entry an exercise was picked from). Pre-existing rows carry no
 * snapshot: the field is optional, so they pass through untouched and render
 * without the meta line, exactly like custom exercises.
 */
export function addLibraryInfo<T>(ex: T) {
  return {
    ...ex,
  };
}
