import Icon from '@/components/presentation/foundation/icon';
import { AccordionItem } from '@/components/presentation/foundation/accordion-item';
import { useAppReducedMotion } from '@/hooks/useMotionSettings';
import { useAppSelector } from '@/store';
import { selectAssignedBackendId, selectUserBackends } from '@/store/backends';
import { setBackupIncludeFeedAccount } from '@/store/settings';
import { useTranslate } from '@tolgee/react';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { SettingsGroup, SettingsRow } from '../../shared/grouped-settings-list';
import * as GS from '../../shared/grouped-settings-list.styles';
import * as S from './destination-card.styles';

/** Expandable "How it works" disclosure: the two verbatim payload lines. */
function HowItWorksRow() {
  const { t } = useTranslate();
  const [open, setOpen] = useState(false);
  const reduceMotion = useAppReducedMotion();

  return (
    <>
      <GS.RowPressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={t('backup.remote.how_it_works.title')}
        onPress={() => setOpen(!open)}
      >
        {({ pressed }: { pressed: boolean }) => (
          <>
            <GS.PressHighlight $pressed={pressed} />
            <GS.IconWell $well="rgba(142,142,147,0.15)">
              <Icon source="info" size={20} color="#C7C7CC" />
            </GS.IconWell>
            <GS.RowText>
              <GS.RowTitle numberOfLines={1}>{t('backup.remote.how_it_works.title')}</GS.RowTitle>
            </GS.RowText>
            <GS.RowTrailing>
              <GS.ChevronRotator $open={open}>
                <Icon source="chevronRight" size={18} color={GS.chevronColor} />
              </GS.ChevronRotator>
            </GS.RowTrailing>
          </>
        )}
      </GS.RowPressable>
      <AccordionItem isExpanded={open} duration={reduceMotion ? 0 : 200}>
        <S.HowItWorksBody>
          <S.HowItWorksLine>{t('backup.remote.how_it_works.payload')}</S.HowItWorksLine>
          <S.HowItWorksLine>{t('backup.remote.how_it_works.credentials')}</S.HowItWorksLine>
        </S.HowItWorksBody>
      </AccordionItem>
    </>
  );
}

/**
 * DESTINATION card (backup-redesign.md S1): the backup-server row pushes the
 * choose-server screen, the feed-account row is a real toggle, and "How it
 * works" expands inline — replacing the dead documentation link.
 */
export function DestinationCard() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const { push } = useRouter();
  const assignedBackendId = useAppSelector((s) => selectAssignedBackendId(s, 'backup'));
  const backends = useAppSelector(selectUserBackends);
  const assignedBackend = backends.find((backend) => backend.id === assignedBackendId);
  const includeFeedAccount = useAppSelector((s) => s.settings.backupIncludeFeedAccount);

  return (
    <SettingsGroup label={t('backup.remote.destination.title')}>
      <SettingsRow
        icon="cloudUpload"
        wellHue="#0A84FF"
        iconColor="#5EB0FF"
        title={t('backup.remote.destination.server')}
        value={assignedBackend?.name || t('backup.remote.destination.none')}
        valueActive={!!assignedBackend}
        subtitle={t('backup.remote.destination.assigns_instantly')}
        onPress={() => push('/settings/backup-and-restore/choose-server')}
      />
      <SettingsRow
        icon="vpnKey"
        wellHue="#FF9F0A"
        iconColor="#FFB84D"
        title={t('backup.remote.destination.feed_account')}
        subtitle={t('backup.remote.destination.feed_account_subtitle')}
        toggle={{
          value: includeFeedAccount,
          onValueChange: (value) => dispatch(setBackupIncludeFeedAccount(value)),
          label: t('backup.remote.destination.feed_account'),
        }}
      />
      <HowItWorksRow />
    </SettingsGroup>
  );
}
