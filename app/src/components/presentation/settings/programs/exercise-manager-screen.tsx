import { View } from 'react-native';
import { useTranslate } from '@tolgee/react';
import { SectionHeader } from '@/components/presentation/home/shared/section-header';
import { SettingsBackground } from '@/components/presentation/settings/shared/settings-background';
import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import ExerciseManager from '@/components/smart/exercise-manager';
import { ManagerPage } from './exercise-manager-screen.styles';

/**
 * The exercise library manager. The manager itself keeps its full behavior
 * (custom add/edit/delete, built-in tombstones with undo, filtering, muscle
 * editing); this file owns the settings page chrome so the route stays thin.
 */
export function ExerciseManagerScreen() {
  const { t } = useTranslate();
  return (
    <View style={{ flex: 1 }}>
      <SettingsBackground variant="programs" />
      <ManagerPage>
        <SectionHeader label={t(settingsKey('settings.programs.exercises.header'))} />
        <View style={{ flex: 1 }}>
          <ExerciseManager />
        </View>
      </ManagerPage>
    </View>
  );
}
