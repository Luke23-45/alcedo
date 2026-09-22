import { LocalDate } from '@js-joda/core';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store';
import { setPlannerAutoDeload } from '@/store/settings';
import { useTranslate } from '@tolgee/react';
import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import { formatMonthDay, resolveDeloadWeek } from './planner-data';
import { SettingsSwitch } from './settings-switch';
import {
  DeloadDate,
  DeloadLabel,
  DeloadRow,
  RecoveryCaption,
  RecoveryCard,
  RecoveryDivider,
  RecoveryRow,
  RecoveryText,
  RecoveryTitle,
} from './recovery.styles';

/**
 * RECOVERY: the auto-deload switch, then a hairline divider and the next
 * scheduled deload week. The deload week is the stored preference when set,
 * otherwise three weeks from today — never a hardcoded date.
 */
export function Recovery() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const autoDeload = useAppSelector((s) => s.settings.plannerAutoDeload);
  const deloadWeek = useAppSelector((s) => s.settings.plannerDeloadWeek);
  const locale = useAppSelector((s) => s.settings.preferredLanguage);

  const nextDeload = resolveDeloadWeek(deloadWeek, LocalDate.now());

  return (
    <RecoveryCard>
      <RecoveryRow>
        <RecoveryText>
          <RecoveryTitle>{t(settingsKey('settings.planner.auto_deload.label'))}</RecoveryTitle>
          <RecoveryCaption>{t(settingsKey('settings.planner.auto_deload.caption'))}</RecoveryCaption>
        </RecoveryText>
        <SettingsSwitch
          value={autoDeload}
          onValueChange={(value) => dispatch(setPlannerAutoDeload(value))}
          accessibilityLabel={t(settingsKey('settings.planner.auto_deload.label'))}
          testID="planner-auto-deload-switch"
        />
      </RecoveryRow>
      <RecoveryDivider />
      <DeloadRow>
        <DeloadLabel>{t(settingsKey('settings.planner.deload_next.label'))}</DeloadLabel>
        <DeloadDate>{formatMonthDay(nextDeload, locale)}</DeloadDate>
      </DeloadRow>
    </RecoveryCard>
  );
}
