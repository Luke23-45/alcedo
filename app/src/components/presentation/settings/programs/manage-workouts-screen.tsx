import { useRouter } from 'expo-router';
import { Redirect } from 'expo-router';
import { useDispatch } from 'react-redux';
import { useTranslate } from '@tolgee/react';
import { useAppSelectorWithArg } from '@/store';
import { addProgramSession, selectProgram, setSavedPlanName } from '@/store/program';
import { EmptySession } from '@/models/session-models';
import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import CardList from '@/components/presentation/foundation/card-list';
import EmptyInfo from '@/components/presentation/foundation/empty-info';
import LimitedHtml from '@/components/presentation/foundation/limited-html';
import { PageActions } from '@/components/presentation/foundation/page-actions';
import AddIcon from '@expo/material-symbols/add.xml';
import { Stack } from 'expo-router';
import ManageWorkoutCardContent from '@/components/smart/manage-workout-card-content';
import { SectionHeader } from '@/components/presentation/home/shared/section-header';
import { SettingsBackground } from '@/components/presentation/settings/shared/settings-background';
import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import { ManagePage, NameField } from './manage-workouts-screen.styles';
import { Card } from 'react-native-paper';

/**
 * The program editor: rename the plan, review its sessions, add new ones.
 * All CRUD wiring is unchanged from the original route; this file owns the
 * layout so the route stays thin.
 */
export function ManageWorkoutsScreen({ programId }: { programId: string }) {
  const { t } = useTranslate();
  const { push } = useRouter();
  const dispatch = useDispatch();
  const program = useAppSelectorWithArg(selectProgram, programId);

  // A stale deep link (or a program deleted on another pass through the
  // list) must not crash on program.name below — send it back to the
  // library, the same honest-missing handling the session editor uses.
  if (!program) {
    return <Redirect href="/settings/program-list" />;
  }

  const selectSession = (index: number) => {
    push(`/settings/manage-workouts/${programId}/manage-session/${index}`);
  };

  const addWorkout = () => {
    const newSession = EmptySession.blueprint.with({
      name: `${t('workout.workout.label')} ${program.sessions.length + 1}`,
    });
    dispatch(addProgramSession({ programId, sessionBlueprint: newSession }));
    selectSession(program.sessions.length);
  };

  return (
    <FullHeightScrollView
      screenBackground={<SettingsBackground variant="programs" />}
      floatingChildren={
        <PageActions
          primary={{
            label: t('workout.add.button'),
            icon: AddIcon,
            systemImage: 'plus',
            onPress: addWorkout,
          }}
        />
      }
    >
      <Stack.Screen options={{ title: program.name }} />
      <ManagePage>
        <SectionHeader label={t(settingsKey('settings.programs.manage.sessions'))} />
        <NameField
          value={program.name}
          onChangeText={(name) => dispatch(setSavedPlanName({ programId, name }))}
          accessibilityLabel={t('workout.name.label')}
        />
        {program.sessions.length === 0 ? (
          <EmptyInfo>
            <LimitedHtml value={t('workout.no_workouts_in_plan.message')} />
          </EmptyInfo>
        ) : undefined}
        <CardList
          items={program.sessions}
          cardType="contained"
          onPress={(_, i) => selectSession(i)}
          renderItemContent={(session) => (
            <Card.Content>
              <ManageWorkoutCardContent sessionBlueprint={session} programId={programId} />
            </Card.Content>
          )}
        />
      </ManagePage>
    </FullHeightScrollView>
  );
}
