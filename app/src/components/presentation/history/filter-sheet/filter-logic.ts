/**
 * Pure filter logic for the History Screen 1 filter sheet. No React Native
 * imports — unit-testable and shared between the sheet UI and the screen.
 */

export interface HistoryFilters {
  query: string;
  types: string[];
  prsOnly: boolean;
}

export const EMPTY_FILTERS: HistoryFilters = {
  query: '',
  types: [],
  prsOnly: false,
};

export function isFilterActive(filters: HistoryFilters): boolean {
  return filters.query.trim() !== '' || filters.types.length > 0 || filters.prsOnly;
}

/** True when the session passes every active filter (AND semantics). */
export function sessionMatchesFilters(
  sessionName: string,
  exerciseNames: string[],
  hasPr: boolean,
  filters: HistoryFilters,
): boolean {
  const q = filters.query.trim().toLowerCase();
  if (q !== '') {
    const haystacks = [sessionName, ...exerciseNames].map((s) => s.toLowerCase());
    if (!haystacks.some((h) => h.includes(q))) {
      return false;
    }
  }
  if (filters.types.length > 0 && !filters.types.includes(sessionName)) {
    return false;
  }
  if (filters.prsOnly && !hasPr) {
    return false;
  }
  return true;
}
