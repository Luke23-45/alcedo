import {
  Backend,
  backendFeatureNameKey,
  backendFeatures,
  backendSupportsFeature,
  builtInBackendId,
  isBackendComplete,
} from '@/models/backend';
import { useAppSelector } from '@/store';
import { useDispatch } from 'react-redux';
import { putBackend, selectAllBackends } from '@/store/backends';
import { useAppTheme } from '@/hooks/useAppTheme';
import { uuid } from '@/utils/uuid';
import { useTranslate } from '@tolgee/react';
import { useRouter } from 'expo-router';
import { SettingsGroup, SettingsRow } from '../shared/grouped-settings-list';
import { settingsKey } from '../shared/settings-i18n';

/**
 * The backend list (settings-dark.md Screen 6 family): the built-in backend
 * as a static row, user backends linking to the editor (incomplete ones in
 * the danger tone), and an add row. Adding creates an empty backend and
 * opens the editor; an editor left empty removes it — unchanged behavior.
 */
export function BackendsListGroup() {
  const { t } = useTranslate();
  const { push } = useRouter();
  const dispatch = useDispatch();
  const theme = useAppTheme();
  const backends = useAppSelector(selectAllBackends);

  const describe = (backend: Backend) =>
    t('backends.supports.subtitle', {
      features: backendFeatures
        .filter((feature) => backendSupportsFeature(backend, feature))
        .map((feature) => t(backendFeatureNameKey[feature]))
        .join(', '),
    });

  const addBackend = () => {
    const id = uuid();
    dispatch(putBackend({ id, name: '', url: '', kind: 'liftlog', headers: [] }));
    push(`/settings/backends/${id}`);
  };

  return (
    <SettingsGroup label={t(settingsKey('settings.backends.section.backends'))}>
      {backends.map((backend) =>
        backend.id === builtInBackendId ? (
          <SettingsRow
            key={backend.id}
            icon="public"
            wellHue="#30D158"
            iconColor="#4ADE80"
            title={backend.name}
            subtitle={t('backends.built_in.subtitle')}
            hideChevron
          />
        ) : (
          <SettingsRow
            key={backend.id}
            icon={isBackendComplete(backend) ? 'dns' : 'error'}
            wellHue={isBackendComplete(backend) ? '#0A84FF' : '#FF3B30'}
            iconColor={isBackendComplete(backend) ? '#5EB0FF' : '#FF6B60'}
            title={backend.name || t('backends.unnamed.label')}
            subtitle={isBackendComplete(backend) ? describe(backend) : t('backends.incomplete.label')}
            subtitleColor={isBackendComplete(backend) ? undefined : theme.color.status.danger.base}
            onPress={() => push(`/settings/backends/${backend.id}`)}
          />
        ),
      )}
      <SettingsRow
        icon="add"
        wellHue="#FF9F0A"
        iconColor="#FFB84D"
        title={t('backends.add.button')}
        onPress={addBackend}
        hideChevron
      />
    </SettingsGroup>
  );
}
