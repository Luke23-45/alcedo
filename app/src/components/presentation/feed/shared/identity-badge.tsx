import { useTranslate } from '@tolgee/react';
import { feedKey } from './feed-i18n';
import type { IdentityBadgeVariant } from './identity-badge.styles';
import * as S from './identity-badge.styles';

interface IdentityBadgeProps {
  variant: IdentityBadgeVariant;
}

/**
 * Identity context without a second line of copy: YOU (own posts), AUTHOR
 * (own replies in a thread), MILESTONE (gold, for milestone posts).
 * The gold milestone treatment is identical in dark and light mode.
 */
export function IdentityBadge({ variant }: IdentityBadgeProps) {
  const { t } = useTranslate();

  const label =
    variant === 'you'
      ? t(feedKey('feed.shared.badge.you'))
      : variant === 'author'
        ? t(feedKey('feed.shared.badge.author'))
        : t(feedKey('feed.shared.badge.milestone'));

  return (
    <S.Badge $variant={variant}>
      <S.BadgeText $variant={variant}>{label}</S.BadgeText>
    </S.Badge>
  );
}
