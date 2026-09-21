import { useState } from 'react';
import { Redirect, Stack, useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { useTranslate, T } from '@tolgee/react';
import ConfirmationDialog from '@/components/presentation/foundation/confirmation-dialog';
import EmptyInfo from '@/components/presentation/foundation/empty-info';
import ItemList from '@/components/presentation/foundation/item-list';
import LimitedHtml from '@/components/presentation/foundation/limited-html';
import { PageActions } from '@/components/presentation/foundation/page-actions';
import AddIcon from '@expo/material-symbols/add.xml';
import ExerciseBlueprintSummary from '@/components/presentation/workout-editor/exercise-blueprint-summary';
import CopyExerciseDialog from '@/components/smart/copy-exercise-dialog';
import FullHeightScrollView from '@/components/layout/full-height-scroll-view';
import { SectionHeader } from '@/components/presentation/home/shared/section-header';
import { SettingsBackground } from '@/components/presentation/settings/shared/settings-background';
import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ExerciseBlueprint, Rest, SessionBlueprint, WeightedExerciseBlueprint } from '@/models/blueprint-models';
import { useAppSelector } from '@/store';
import { ProgramSessionLocation, selectProgramSession, updateProgram } from '@/store/program';
import { Card } from 'react-native-paper';
import { FieldLabel, SessionCard, SessionField, SessionPage } from './session-editor-screen.styles';

function ExerciseItem({
  blueprint,
  beginEdit,
  beginRemove,
  location,
  updateSession,
}: {
  blueprint: ExerciseBlueprint;
  beginEdit: () => void;
  beginRemove: () => void;
  location: ProgramSessionLocation;
  updateSession: (update: (session: SessionBlueprint) => SessionBlueprint) => void;
}) {
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);

  return (
    <>
      <ExerciseBlueprintSummary
        blueprint={blueprint}
        onEdit={beginEdit}
        onMoveDown={() => updateSession((s) => s.withExerciseMovedDown(blueprint))}
        onMoveUp={() => updateSession((s) => s.withExerciseMovedUp(blueprint))}
        onRemove={beginRemove}
        onCopyTo={() => setCopyDialogOpen(true)}
      />
      <CopyExerciseDialog
        visible={copyDialogOpen}
        onDismiss={() => setCopyDialogOpen(false)}
        exerciseBlueprint={blueprint}
        currentSessionIndex={location.sessionIndex}
        programId={location.programId}
      />
    </>
  );
}

/**
 * The session (workout) editor: rename, notes, and the exercise list with
 * add / edit / remove / reorder / copy. Wiring is unchanged from the
 * original route; this file owns the layout so the route stays thin.
 */
export function SessionEditorScreen({ location }: { location: ProgramSessionLocation }) {
  const theme = useAppTheme();
  const dispatch = useDispatch();
  const { t } = useTranslate();
  const { push } = useRouter();
  const session = useAppSelector((x) => selectProgramSession(x, location));
  const [selectedExercise, setSelectedExercise] = useState<ExerciseBlueprint | undefined>(undefined);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  if (!session) {
    return <Redirect href="/" />;
  }

  const updateSession = (update: (session: SessionBlueprint) => SessionBlueprint) => {
    dispatch(
      updateProgram({
        programId: location.programId,
        update: (program) => program.withSession(location.sessionIndex, update),
      }),
    );
  };

  const openExerciseEditor = (exerciseIndex: number) => {
    push({
      pathname: '/settings/manage-workouts/[programId]/manage-session/[sessionIndex]/exercise',
      params: { ...location, exerciseIndex },
    });
  };

  const beginAddExercise = () => {
    updateSession((s) =>
      s.withAddedExercise(
        WeightedExerciseBlueprint.empty().with({
          name: `Exercise ${session.exercises.length + 1}`,
          repsConfig: { type: 'fixed', reps: 10 },
          sets: 3,
          link: '',
          notes: '',
          restBetweenSets: Rest.medium,
          supersetWithNext: false,
        }),
      ),
    );
    openExerciseEditor(session.exercises.length);
  };

  return (
    <FullHeightScrollView
      screenBackground={<SettingsBackground variant="programs" />}
      floatingChildren={
        <PageActions
          primary={{
            label: t('exercise.add.title'),
            icon: AddIcon,
            systemImage: 'plus',
            onPress: beginAddExercise,
          }}
        />
      }
    >
      <Stack.Screen options={{ title: session.name }} />
      <SessionPage>
        <SectionHeader label={t(settingsKey('settings.programs.manage.session'))} />
        <SessionCard>
          <FieldLabel>{t('workout.name.label')}</FieldLabel>
          <SessionField
            value={session.name}
            onChangeText={(name) => updateSession((s) => s.withName(name))}
            selectTextOnFocus
            accessibilityLabel={t('workout.name.label')}
          />
          <FieldLabel>{t('workout.notes.label')}</FieldLabel>
          <SessionField
            value={session.notes}
            onChangeText={(notes) => updateSession((s) => s.withNotes(notes))}
            multiline
            accessibilityLabel={t('workout.notes.label')}
          />
        </SessionCard>
        <SectionHeader label={t('exercise.exercises.title')} />
        <ItemList
          items={session.exercises}
          verticalPadding={false}
          empty={
            <Card mode="contained" style={{ marginHorizontal: theme.space.xl }}>
              <Card.Content>
                <EmptyInfo>
                  <T keyName="exercise.no_exercises_added.message" />
                </EmptyInfo>
              </Card.Content>
            </Card>
          }
          renderItem={(blueprint, index) => (
            <ExerciseItem
              blueprint={blueprint}
              location={location}
              updateSession={updateSession}
              beginEdit={() => openExerciseEditor(index)}
              beginRemove={() => {
                setSelectedExercise(blueprint);
                setIsRemoveOpen(true);
              }}
            />
          )}
        />
      </SessionPage>
      <ConfirmationDialog
        headline={t('exercise.remove.confirm.title')}
        onOk={() => {
          const selected = selectedExercise;
          setSelectedExercise(undefined);
          setIsRemoveOpen(false);
          if (selected) updateSession((s) => s.withoutExercise(selected));
        }}
        onCancel={() => setIsRemoveOpen(false)}
        open={!!selectedExercise && isRemoveOpen}
        textContent={
          <LimitedHtml
            value={t('exercise.remove_from_workout.confirm.body', {
              exercise: selectedExercise?.name ?? '',
              session: session.name,
            })}
          />
        }
      />
    </FullHeightScrollView>
  );
}
