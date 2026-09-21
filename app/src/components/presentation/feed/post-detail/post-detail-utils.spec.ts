import { describe, expect, it } from 'vitest';
import { relativeAge, relativeAgeLong } from './relative-time';
import { formatKudosLabel } from './post-models';
import type { FeedPerson } from '../shared/people';

const NOW = 1_750_000_000_000;
const MINUTE = 60_000;

function person(id: string, name: string): FeedPerson {
  return { id, name, handle: `@${id}`, initial: name[0]!, gradient: null, color: '#000000' };
}

describe('relativeAge', () => {
  it('renders the contract compact forms', () => {
    expect(relativeAge(NOW - 30_000, NOW)).toBe('now');
    expect(relativeAge(NOW - 18 * MINUTE, NOW)).toBe('18m');
    expect(relativeAge(NOW - 2 * 3_600_000, NOW)).toBe('2h');
    expect(relativeAge(NOW - 26 * 3_600_000, NOW)).toBe('1d');
  });

  it('never goes negative', () => {
    expect(relativeAge(NOW + MINUTE, NOW)).toBe('now');
  });
});

describe('relativeAgeLong', () => {
  it('spells out the author subline form', () => {
    expect(relativeAgeLong(NOW - 21 * MINUTE, NOW)).toBe('21 minutes ago');
    expect(relativeAgeLong(NOW - MINUTE, NOW)).toBe('1 minute ago');
    expect(relativeAgeLong(NOW - 3_600_000, NOW)).toBe('1 hour ago');
    expect(relativeAgeLong(NOW - 20_000, NOW)).toBe('just now');
  });
});

describe('formatKudosLabel', () => {
  const others = (count: number) => `and ${count} others`;
  it('renders "Mia, Jon and 4 others"', () => {
    expect(
      formatKudosLabel([person('mia', 'Mia Chen'), person('jon', 'Jon Reyes'), person('sofia', 'Sofia')], 6, others),
    ).toBe('Mia, Jon and 4 others');
  });

  it('handles one and two kudoers without an overflow tail', () => {
    expect(formatKudosLabel([person('mia', 'Mia Chen')], 1, others)).toBe('Mia');
    expect(formatKudosLabel([person('mia', 'Mia Chen'), person('jon', 'Jon Reyes')], 2, others)).toBe('Mia and Jon');
  });
});
