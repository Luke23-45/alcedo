import { useAppSelector } from '@/store';
import { type WeightedExerciseStatistics } from '@/store/stats';
import { selectExercises } from '@/store/stored-sessions';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ExercisePickerList } from './all-exercises/all-exercises';
import { CurrentSelectionCard } from './current-selection-card/current-selection-card';
import { PickerEmptyState } from './empty-state/empty-state';
import { PickerScreenWrap, ScreenContent } from './exercise-picker-screen.styles';
import {
  buildPickerExercises,
  buildSections,
  filterExercises,
  findExerciseByName,
  groupByLetter,
  pinnedExercises,
  type MuscleFilter,
  type PickerExercise,
} from './exercise-picker-model';
import { MuscleFilterChips } from './muscle-filter-chips/muscle-filter-chips';
import { PickerSearch } from './picker-search/picker-search';
import { getRecentViews, recordRecentView } from './recent-views';
import { SheetBackground } from './sheet-background/sheet-background';
import { SheetHeader } from './sheet-header/sheet-header';
import { StickyConfirm } from './sticky-confirm/sticky-confirm';
import { useTranslate } from '@tolgee/react';

/**
 * Exercise picker screen (Phase 3, Screen 3): sheet-style chooser over the
 * real exercise library joined with recorded stats. Pinned = the two
 * exercises with the most recorded sessions; recents are an in-memory
 * navigation aid (most-recent-first, capped at 5).
 */
export function ExercisePickerScreen({
  weightedExerciseStats,
  initialExerciseName,
}: {
  weightedExerciseStats: WeightedExerciseStatistics[];
  initialExerciseName: string | undefined;
}) {
  const { dismiss, push } = useRouter();
  const { t } = useTranslate();
  const library = useAppSelector(selectExercises);

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<MuscleFilter>('all');
  const [selectedName, setSelectedName] = useState<string | undefined>(initialExerciseName);

  const entries = useMemo(
    () => buildPickerExercises(library, weightedExerciseStats),
    [library, weightedExerciseStats],
  );
  const searching = query.trim() !== '' || filter !== 'all';
  const filtered = useMemo(
    () => filterExercises(entries, query, filter),
    [entries, query, filter],
  );
  const pinned = useMemo(() => pinnedExercises(entries), [entries]);
  // Module-level recents persist across openings within an app session.
  const recentViews = useMemo(() => getRecentViews(), []);
  const sections = useMemo(
    () =>
      buildSections({
        pinned,
        recent: recentViews.flatMap((name) => {
          const found = findExerciseByName(entries, name);
          return found ? [found] : [];
        }),
        alpha: groupByLetter(filtered),
        showShortcuts: !searching,
      }),
    [filtered, pinned, recentViews, entries, searching],
  );

  const selection =
    selectedName === undefined ? undefined : findExerciseByName(entries, selectedName);

  const onSelectExercise = (exercise: PickerExercise) => {
    setSelectedName(exercise.name);
  };

  const onConfirm = () => {
    if (selection === undefined) {
      return;
    }
    // Record the recent view only when "Show Trends" opens the detail screen.
    recordRecentView(selection.name);
    dismiss();
    push(`/stats/expanded-weighted-exercise?exerciseName=${encodeURIComponent(selection.name)}`);
  };

  return (
    <PickerScreenWrap>
      <SheetBackground />
      <ScreenContent>
        <SheetHeader onCancel={dismiss} />
        <PickerSearch
          value={query}
          onChange={setQuery}
          placeholder={t('stats.exercise_picker.search.placeholder', { count: entries.length })}
        />
        <MuscleFilterChips selected={filter} onSelect={setFilter} />
        <ExercisePickerList
          sections={sections}
          selectedName={selectedName}
          onSelectExercise={onSelectExercise}
          listHeader={selection === undefined ? null : <CurrentSelectionCard exercise={selection} />}
          listHeaderHeight={selection === undefined ? 0 : 82}
          listEmpty={searching ? <PickerEmptyState /> : null}
          showScrubber={!searching}
        />
        <StickyConfirm exercise={selection} onConfirm={onConfirm} />
      </ScreenContent>
    </PickerScreenWrap>
  );
}
