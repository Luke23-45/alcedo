import ItemTitle from '@/components/presentation/foundation/item-title';
import { useAppTheme } from '@/hooks/useAppTheme';
import { RecordedCardioExercise, RecordedExercise, RecordedWeightedExercise } from '@/models/session-models';
import { localeFormatBigNumber } from '@/utils/locale-bignumber';
import { ReactNode, useState } from 'react';
import { View } from 'react-native';
import { openUrl } from '@/utils/open-url';
import { Tooltip } from 'react-native-paper';
import Menu, { MenuItem } from '@/components/presentation/foundation/menu';
import { useTranslate } from '@tolgee/react';
import ConfirmationDialog from '@/components/presentation/foundation/confirmation-dialog';
import ExerciseNotesDisplay from '@/components/presentation/workout/exercise-notes-display';
import RecordedExerciseNotesEditor from '@/components/presentation/workout/recorded-exercise-notes-editor';
import IconButton from '@/components/presentation/foundation/icon-button';
import { useRouter } from 'expo-router';
import { getExerciseHistoryHref } from '@/components/smart/exercise-history';
import { Updater } from '@/utils/types';
import Svg, { Path } from 'react-native-svg';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { sessionPalette } from '@/components/presentation/workout/session/session-tokens';
import {
  AddSetLabel,
  AddSetRow,
  CardBody,
  CardHeader,
  CardTop,
  ChipPill,
  ChipText,
  DividerLine,
  ExerciseName,
  IndexNumber,
  IndexTile,
} from './exercise-section.styles';

interface ExerciseSectionProps<T extends RecordedExercise> {
  recordedExercise: T;
  previousRecordedExercises: RecordedExercise[];
  toStartNext: boolean;
  isReadonly: boolean;
  showPreviousButton: boolean;
  /** 'active' renders the workout-flow reference card; 'classic' keeps the legacy layout. */
  variant?: 'active' | 'classic';
  /** 1-based position in the session; shown as the index tile in the active card. */
  index?: number;
  /** When provided (and not readonly), the active card shows an "Add Set" row. */
  onAddSet?: () => void;

  children: ReactNode;

  updateExercise: (update: Updater<T>) => void;
  onEditExercise: (() => void) | undefined;
  onRemoveExercise: () => void;
}

/** The status chip text for the active card header. */
function useStatusChip(recordedExercise: RecordedExercise): { text: string; done: boolean } {
  const { t } = useTranslate();
  if (recordedExercise instanceof RecordedWeightedExercise) {
    const sets = recordedExercise.potentialSets.length;
    const reps = recordedExercise.repsTargetForSet(0).max;
    if (recordedExercise.isComplete) {
      return {
        text: t('workout.session.chip.done', { sets, reps, done: t('workout.session.done.label').toUpperCase() }),
        done: true,
      };
    }
    const current = recordedExercise.potentialSets.find((x) => !x.set) ?? recordedExercise.potentialSets[0];
    const w = current?.weight;
    const weight =
      w && !w.value.isZero()
        ? localeFormatBigNumber(w.value.decimalPlaces(w.value.isInteger() ? 0 : 1))
        : t('exercise.short_bodyweight.label');
    return { text: t('workout.session.chip.in_progress', { sets, reps, weight }), done: false };
  }
  if (recordedExercise instanceof RecordedCardioExercise) {
    const total = recordedExercise.sets.length;
    const filled = recordedExercise.sets.filter((x) => x.isCompletelyFilled).length;
    if (recordedExercise.isComplete) {
      return { text: t('workout.session.done.label'), done: true };
    }
    return { text: `${filled}/${total}`, done: false };
  }
  return { text: '', done: false };
}

function AddSetButton({ onPress }: { onPress: () => void }) {
  const { t } = useTranslate();
  const { isDark } = useAppTheme();
  const c = sessionPalette(isDark).card;
  return (
    <AddSetRow
      onPress={onPress}
      hitSlop={{ top: 6, bottom: 6 }}
      accessibilityRole="button"
      accessibilityLabel={t('workout.session.add_set.button')}
      testID="exercise-add-set"
    >
      <Svg width={11} height={11} viewBox="-5.5 -5.5 11 11">
        <Path d="M-5.5 0 H5.5 M0 -5.5 V5.5" stroke={c.addPlus} strokeWidth={2.4} strokeLinecap="round" fill="none" />
      </Svg>
      <AddSetLabel>{t('workout.session.add_set.button')}</AddSetLabel>
      <Svg width={6} height={10} viewBox="-3 -5 6 10">
        <Path
          d="M-2 -4 L2 0 L-2 4"
          stroke={c.addChevron}
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </AddSetRow>
  );
}

export default function ExerciseSection<T extends RecordedExercise>(props: ExerciseSectionProps<T>) {
  const theme = useAppTheme();
  const { updateExercise, onRemoveExercise } = props;
  const { t } = useTranslate();
  const { push } = useRouter();
  const { recordedExercise } = props;
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [removeExerciseDialogOpen, setRemoveExerciseDialogOpen] = useState(false);
  const showStats = recordedExercise instanceof RecordedWeightedExercise;
  const showPrevious = () => {
    push(getExerciseHistoryHref(recordedExercise.blueprint), { withAnchor: true });
  };
  const statusChip = useStatusChip(recordedExercise);

  const menuItems: MenuItem[] = [
    // Absent for a session the user does not own, which has nothing to edit.
    ...(props.onEditExercise
      ? [
          {
            label: t('generic.edit.button'),
            icon: 'edit',
            systemImage: 'pencil',
            onPress: props.onEditExercise,
          } satisfies MenuItem,
        ]
      : []),
    ...(props.showPreviousButton
      ? [
          {
            label: t('workout.session.view_history.button'),
            icon: 'history',
            systemImage: 'clock.arrow.circlepath',
            onPress: showPrevious,
          } satisfies MenuItem,
        ]
      : []),
    {
      label: t('generic.notes.label'),
      icon: 'notes',
      systemImage: 'note.text',
      onPress: () => setNotesDialogOpen(true),
    },
    ...(showStats
      ? [
          {
            label: t('stats.stats.title'),
            icon: 'analytics',
            systemImage: 'chart.bar',
            onPress: () =>
              push(
                `/stats/expanded-weighted-exercise?exerciseName=${encodeURIComponent(recordedExercise.blueprint.name)}`,
                { withAnchor: true },
              ),
          } satisfies MenuItem,
        ]
      : []),
    {
      label: t('generic.remove.button'),
      icon: 'delete',
      systemImage: 'trash',
      onPress: () => setRemoveExerciseDialogOpen(true),
    },
    ...(props.recordedExercise.blueprint.link
      ? [
          {
            label: t('generic.open_link.button'),
            icon: 'openInBrowser',
            systemImage: 'safari',
            onPress: () => openUrl(props.recordedExercise.blueprint.link),
          } satisfies MenuItem,
        ]
      : []),
  ];

  const interactiveButtons = props.isReadonly ? (
    <View style={{ height: 40 }}></View>
  ) : (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}
    >
      {props.showPreviousButton ? (
        <Tooltip title={t('workout.previously_completed.label')}>
          <IconButton testID="prev-exercise-btn" icon={'history'} onPress={showPrevious} />
        </Tooltip>
      ) : null}
      {!props.isReadonly ? (
        <Tooltip title={t('generic.notes.label')}>
          <IconButton testID="exercise-notes-btn" icon={'notes'} onPress={() => setNotesDialogOpen(true)} />
        </Tooltip>
      ) : null}

      <Menu
        trigger={(open) => <IconButton testID="more-exercise-btn" onPress={open} icon={'moreHoriz'} />}
        items={menuItems}
      />
    </View>
  );

  if (props.variant === 'active') {
    return (
      <View testID="weighted-exercise" style={{ marginHorizontal: 16 }}>
        <HomeCard radius={24} pad={0}>
          <CardTop>
            <CardHeader>
              {props.index !== undefined && (
                <IndexTile>
                  <IndexNumber>{props.index}</IndexNumber>
                </IndexTile>
              )}
              <ExerciseName $done={statusChip.done} numberOfLines={1} ellipsizeMode="tail" testID="weighted-exercise-title">
                {recordedExercise.blueprint.name}
              </ExerciseName>
              {statusChip.text !== '' && (
                <ChipPill $done={statusChip.done}>
                  <ChipText $done={statusChip.done}>{statusChip.text}</ChipText>
                </ChipPill>
              )}
            </CardHeader>
          </CardTop>
          <DividerLine />
          <CardBody>
            {props.children}
            <ExerciseNotesDisplay
              exercise={props.recordedExercise}
              previousExercise={props.previousRecordedExercises.at(0)}
              embedded
            />
          </CardBody>
          {props.onAddSet && <AddSetButton onPress={props.onAddSet} />}
          <View style={{ height: props.onAddSet ? 7 : 41 }} />
        </HomeCard>

        <RecordedExerciseNotesEditor
          exerciseName={recordedExercise.blueprint.name}
          onDismiss={() => setNotesDialogOpen(false)}
          open={notesDialogOpen}
          notes={recordedExercise.notes}
          onUpdateNotes={(notes) => updateExercise((ex) => ex.with({ notes }) as T)}
        />
        <ConfirmationDialog
          headline={t('exercise.remove.confirm.title')}
          textContent={t('exercise.remove.confirm.body')}
          okText={t('generic.remove.button')}
          open={removeExerciseDialogOpen}
          onOk={() => {
            setRemoveExerciseDialogOpen(false);
            onRemoveExercise();
          }}
          onCancel={() => setRemoveExerciseDialogOpen(false)}
          preventCancel={false}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: 'column',
        gap: theme.space.base,
        paddingBlock: theme.space.base,
        paddingHorizontal: theme.layout.screenPadding,
        width: '100%',
      }}
      testID="weighted-exercise"
    >
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <ItemTitle
            testID="weighted-exercise-title"
            style={{ marginVertical: theme.space.sm }}
            title={recordedExercise.blueprint.name}
          />
          {interactiveButtons}
        </View>
        {props.children}
        <ExerciseNotesDisplay
          exercise={props.recordedExercise}
          previousExercise={props.previousRecordedExercises.at(0)}
        />
      </View>

      <RecordedExerciseNotesEditor
        exerciseName={recordedExercise.blueprint.name}
        onDismiss={() => setNotesDialogOpen(false)}
        open={notesDialogOpen}
        notes={recordedExercise.notes}
        onUpdateNotes={(notes) => updateExercise((ex) => ex.with({ notes }) as T)}
      />
      <ConfirmationDialog
        headline={t('exercise.remove.confirm.title')}
        textContent={t('exercise.remove.confirm.body')}
        okText={t('generic.remove.button')}
        open={removeExerciseDialogOpen}
        onOk={() => {
          setRemoveExerciseDialogOpen(false);
          onRemoveExercise();
        }}
        onCancel={() => setRemoveExerciseDialogOpen(false)}
        preventCancel={false}
      />
    </View>
  );
}
