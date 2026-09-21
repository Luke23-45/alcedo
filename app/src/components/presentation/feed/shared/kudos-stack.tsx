import { FeedAvatar } from './feed-avatar';
import type { FeedPerson } from './people';
import * as S from './kudos-stack.styles';

interface KudosStackProps {
  /** Kudoers, newest first. Only the first three faces ever render. */
  people: FeedPerson[];
  /** Total kudos count; drives the "+N" cap. */
  total: number;
  /** e.g. "Mia, Jon and 4 others" — composed by the caller. */
  label: string;
  /**
   * Knockout stroke colour, matching the surface behind the stack
   * (dark #17171A / light #FFFFFF on cards).
   */
  ringColor: string;
  /** Face diameter in pt. Spec: 22 (feed), 24 (detail). */
  size?: number;
}

const MAX_FACES = 3;

/**
 * Kudos avatar stack: always 3 faces + a "+N" overflow cap + label.
 * The knockout stroke matches the *card*, not the page — `ringColor` is
 * passed by the caller. The cap renders only when total exceeds the faces.
 */
export function KudosStack({ people, total, label, ringColor, size = 22 }: KudosStackProps) {
  const faces = people.slice(0, MAX_FACES);
  const overflow = Math.max(0, total - faces.length);

  return (
    <S.Row accessibilityLabel={label}>
      {faces.map((person, index) => (
        <S.Face key={person.id} size={size} $overlap={index > 0}>
          <FeedAvatar person={person} size={size} ringColor={ringColor} />
        </S.Face>
      ))}
      {overflow > 0 ? (
        <S.Cap size={size} ringColor={ringColor} $overlap={faces.length > 0}>
          <S.CapText size={size}>+{overflow}</S.CapText>
        </S.Cap>
      ) : null}
      <S.Label numberOfLines={1} ellipsizeMode="tail">
        {label}
      </S.Label>
    </S.Row>
  );
}
