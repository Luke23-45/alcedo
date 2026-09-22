import Icon from '@/components/presentation/foundation/icon';
import { useAppTheme } from '@/hooks/useAppTheme';
import { WhatsNewEntry } from '@/models/whats-new';
import { alpha } from '@/styles/theme';
import { T, useTranslate } from '@tolgee/react';
import { Href, useRouter } from 'expo-router';
import { BadgePill, BadgePillText, chevronColor } from '../shared/grouped-settings-list.styles';
import { settingsKey } from '../shared/settings-i18n';
import { CardShell } from '../backup/card-shell';
import * as S from './whats-new-entry-card.styles';

const ENTRY_WELLS: Record<string, { hue: string; tint: string }> = {
  heartCheck: { hue: '#FF2D55', tint: '#FF6A88' },
  assignment: { hue: '#0A84FF', tint: '#5EB0FF' },
  dns: { hue: '#AF52DE', tint: '#C77DFF' },
  backup: { hue: '#FF9F0A', tint: '#FFB84D' },
};

/**
 * One real release entry from whats-new.ts (conditions already applied by the
 * caller). NEW pill while the entry is unread; CTA routes to the feature.
 */
export function WhatsNewEntryCard({ entry, isNew }: { entry: WhatsNewEntry; isNew: boolean }) {
  const { t } = useTranslate();
  const { push } = useRouter();
  const theme = useAppTheme();
  const well = ENTRY_WELLS[entry.icon as string] ?? { hue: '#0A84FF', tint: '#5EB0FF' };

  const goToFeature = (route: Href) => push(route);

  return (
    <CardShell>
      <S.EntryHeader>
        <S.EntryTile $well={alpha(well.hue, theme.isDark ? 0.15 : 0.12)}>
          <Icon source={entry.icon} size={20} color={well.tint} />
        </S.EntryTile>
        <S.EntryTitle>
          <T keyName={entry.titleKey} />
        </S.EntryTitle>
        {isNew ? (
          <BadgePill accessibilityLabel={t(settingsKey('settings.whatsnew.badge'))}>
            <BadgePillText>{t(settingsKey('settings.whatsnew.badge'))}</BadgePillText>
          </BadgePill>
        ) : undefined}
      </S.EntryHeader>
      <S.EntryBody>
        <T keyName={entry.bodyKey} />
      </S.EntryBody>
      {entry.cta ? (
        <S.EntryCta accessibilityRole="button" onPress={() => goToFeature(entry.cta!.route)}>
          <S.EntryCtaText>
            <T keyName={entry.cta.labelKey} />
          </S.EntryCtaText>
          <Icon source="chevronRight" size={18} color={chevronColor} />
        </S.EntryCta>
      ) : undefined}
    </CardShell>
  );
}
