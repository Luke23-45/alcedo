import { SettingsGroup } from '../shared/grouped-settings-list';
import { settingsKey } from '../shared/settings-i18n';
import { useAppSelector } from '@/store';
import { setUnitDistance, setUnitHeight, setUnitWeight } from '@/store/settings';
import { useTranslate } from '@tolgee/react';
import { useDispatch } from 'react-redux';
import { CardCaption, RowSeparator } from './preference-row.styles';
import { PreferenceSegmented } from './preference-segmented';
import { formatUnitsBodyweight } from './units-bodyweight';
import * as S from './units-card.styles';

/**
 * UNITS & MEASUREMENT card (settings-dark.md Screen 2): weight / distance /
 * height segmented rows. The weight row drives the legacy `useImperialUnits`
 * boolean too, so every screen that reads it stays in sync. The caption
 * shows the real latest bodyweight — it is what "feeds every strength ratio".
 */
export function UnitsCard() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const settings = useAppSelector((s) => s.settings);
  const bodyweight = useAppSelector((s) =>
    s.stats.overallView.match({
      success: (view) => view.bodyweightStats.currentValue,
      error: () => undefined,
      loading: () => undefined,
      notAsked: () => undefined,
    }),
  );

  const formattedBodyweight = formatUnitsBodyweight(bodyweight, settings.unitWeight);
  const caption = formattedBodyweight
    ? t(
        settingsKey('settings.preferences.units.bodyweight_caption'),
        'Bodyweight {bodyweight} · feeds every strength ratio',
        {
          bodyweight: formattedBodyweight,
        },
      )
    : t(
        settingsKey('settings.preferences.units.caption_no_bodyweight'),
        'Applies to every weight, distance and height in the app',
      );

  return (
    <SettingsGroup label={t(settingsKey('settings.preferences.units.header'), 'UNITS & MEASUREMENT')}>
      <S.Block>
        <S.UnitRow>
          <S.UnitLabel>{t(settingsKey('settings.preferences.units.weight'), 'Weight')}</S.UnitLabel>
          <S.UnitSegmentedWrap>
            <PreferenceSegmented
              size="small"
              accessibilityLabel={t(settingsKey('settings.preferences.units.weight'), 'Weight')}
              options={[
                { value: 'kg', label: t(settingsKey('settings.preferences.units.kg'), 'kg') },
                { value: 'lb', label: t(settingsKey('settings.preferences.units.lb'), 'lb') },
              ]}
              value={settings.unitWeight}
              onChange={(v) => dispatch(setUnitWeight(v))}
            />
          </S.UnitSegmentedWrap>
        </S.UnitRow>
        <RowSeparator />
        <S.UnitRow>
          <S.UnitLabel>{t(settingsKey('settings.preferences.units.distance'), 'Distance')}</S.UnitLabel>
          <S.UnitSegmentedWrap>
            <PreferenceSegmented
              size="small"
              accessibilityLabel={t(settingsKey('settings.preferences.units.distance'), 'Distance')}
              options={[
                { value: 'km', label: t(settingsKey('settings.preferences.units.km'), 'km') },
                { value: 'mi', label: t(settingsKey('settings.preferences.units.mi'), 'mi') },
              ]}
              value={settings.unitDistance}
              onChange={(v) => dispatch(setUnitDistance(v))}
            />
          </S.UnitSegmentedWrap>
        </S.UnitRow>
        <RowSeparator />
        <S.UnitRow>
          <S.UnitLabel>{t(settingsKey('settings.preferences.units.height'), 'Height')}</S.UnitLabel>
          <S.UnitSegmentedWrap>
            <PreferenceSegmented
              size="small"
              accessibilityLabel={t(settingsKey('settings.preferences.units.height'), 'Height')}
              options={[
                { value: 'cm', label: t(settingsKey('settings.preferences.units.cm'), 'cm') },
                { value: 'ft', label: t(settingsKey('settings.preferences.units.ft'), 'ft') },
              ]}
              value={settings.unitHeight}
              onChange={(v) => dispatch(setUnitHeight(v))}
            />
          </S.UnitSegmentedWrap>
        </S.UnitRow>
        <RowSeparator />
        <S.CaptionWrap>
          <CardCaption>{caption}</CardCaption>
        </S.CaptionWrap>
      </S.Block>
    </SettingsGroup>
  );
}
