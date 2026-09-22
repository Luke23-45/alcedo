import type { FeedPerson } from './people';

/** A real mutual friend eligible for tagging: id + display name. */
export interface TagPerson {
  id: string;
  name: string;
}

/**
 * Minimal avatar identity for a real mutual friend in tag rows and chips:
 * the name's initial on a neutral fill. No photo, no invented handle or
 * gradient — the neutral fill reads as "no photo set", which is true.
 */
export function tagFeedPerson(person: TagPerson): FeedPerson {
  const initial = person.name.trim().charAt(0).toUpperCase() || '?';
  return {
    id: person.id,
    name: person.name,
    handle: '',
    initial,
    gradient: null,
    color: '#8E8E93',
  };
}
