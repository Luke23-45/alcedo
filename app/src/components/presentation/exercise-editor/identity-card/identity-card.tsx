import { Pressable, View } from 'react-native';
import { ReactNode, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslate } from '@tolgee/react';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ExerciseDescriptor } from '@/models/exercise-models';
import { recordRecentExerciseSearch } from '@/store/app';
import { updateExercise } from '@/store/stored-sessions';
import { translateExerciseMeta } from '@/utils/exercise-meta';
import { uuid } from '@/utils/uuid';
import {
  Card,
  FocusFieldInner,
  FocusGlow,
  Hairline,
  MagnifierGlyph,
  PlusGlyph,
  ResultTile,
  ResultTileLetter,
  SegmentedControl,
  SwapGlyph,
  WellField,
  XGlyph,
  tileAccent,
} from '../editor-primitives';
import { ExerciseKind, filterCatalog } from '../exercise-editor-logic';
import { AddExerciseTab, CustomExerciseTab } from './custom-exercise-tab';
import {
  AddSearchPad,
  CategoryBadge,
  CategoryBadgeText,
  Chip,
  ChipRow,
  ChipScroll,
  ChipText,
  CreateCustomAction,
  CreateCustomActionText,
  IdentityPad,
  NameText,
  ResultName,
  ResultRow,
  ResultSubtitle,
  ResultTextColumn,
  ResultsBottomPad,
  SearchHint,
  SearchInput,
  SearchPad,
  SearchSection,
  TabPad,
} from './identity-card.styles';

export interface SearchResultItem {
  id?: string;
  name: string;
  subtitle?: string;
  /** Built-in catalog category ('cardio', 'strength', …); '' for custom exercises. */
  category: string;
  /** Full descriptor detail; absent for the custom-name row (nothing to snapshot). */
  library?: {
    equipment: string | null;
    muscles: string[];
    instructions: string;
  };
}

export interface SearchSectionProps {
  query: string;
  onQueryChange: (query: string) => void;
  results: SearchResultItem[];
  onSelectResult: (item: SearchResultItem) => void;
  searchFocused: boolean;
  onSearchFocusChange: (focused: boolean) => void;
}

function SearchFieldControl({
  query,
  onQueryChange,
  searchFocused,
  onSearchFocusChange,
  compact = false,
}: SearchSectionProps & { compact?: boolean }) {
  const theme = useAppTheme();
  const { t } = useTranslate();
  const fieldHeight = compact ? 40 : 48;
  const inner = (
    <>
      <MagnifierGlyph />
      <SearchInput
        value={query}
        onChangeText={onQueryChange}
        placeholder={t('exercise.editor.search.placeholder', 'Search exercises…')}
        placeholderTextColor={theme.isDark ? '#6C6C70' : '#8E8E93'}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={() => onSearchFocusChange(true)}
        onBlur={() => onSearchFocusChange(false)}
        accessibilityLabel={t('exercise.editor.search.label', 'Search exercises')}
      />
      {query.length > 0 ? (
        <Pressable
          onPress={() => onQueryChange('')}
          accessibilityRole="button"
          accessibilityLabel={t('exercise.editor.search.clear', 'Clear search')}
          hitSlop={10}
        >
          <XGlyph />
        </Pressable>
      ) : null}
    </>
  );
  // The reference draws the ember gradient as the focused field's stroke with
  // a soft glow; unfocused the field is the plain inset well.
  return searchFocused ? (
    <FocusGlow>
      <FocusFieldInner $height={fieldHeight}>{inner}</FocusFieldInner>
    </FocusGlow>
  ) : (
    <WellField $height={fieldHeight}>{inner}</WellField>
  );
}

function SearchHintRow({ query, results }: { query: string; results: SearchResultItem[] }) {
  const { t } = useTranslate();
  if (query.trim().length === 0) {
    return <SearchHint>{t('exercise.editor.search.hint', 'Type to search the exercise library.')}</SearchHint>;
  }
  if (results.length === 0) {
    return (
      <SearchHint>
        {t('exercise.editor.search.no_results', 'No exercises match “{query}”.', { query: query.trim() })}
      </SearchHint>
    );
  }
  return null;
}

function SearchResults({
  results,
  query,
  allowCustom,
  onSelectResult,
}: Pick<SearchSectionProps, 'results' | 'onSelectResult'> & { query: string; allowCustom: boolean }) {
  const { t } = useTranslate();
  // The escape hatch: a typed name that matches nothing is still a valid
  // exercise. Without this row a custom name (or an empty catalog) strands
  // the add flow with Done disabled and no way forward.
  const customName = query.trim();
  const customAccent = tileAccent(results.length);
  return (
    <View>
      {results.map((result, index) => {
        const accent = tileAccent(index);
        return (
          <View key={`${result.name}::${index}`}>
            {index > 0 ? <Hairline /> : null}
            <ResultRow
              onPress={() => onSelectResult(result)}
              accessibilityRole="button"
              accessibilityLabel={result.name}
            >
              <ResultTile $bg={accent.bg}>
                <ResultTileLetter $fg={accent.fg}>{result.name.charAt(0).toLocaleUpperCase()}</ResultTileLetter>
              </ResultTile>
              <ResultTextColumn>
                <ResultName numberOfLines={1} ellipsizeMode="tail">
                  {result.name}
                </ResultName>
                {result.subtitle ? <ResultSubtitle numberOfLines={1}>{result.subtitle}</ResultSubtitle> : null}
              </ResultTextColumn>
              {result.category ? (
                <CategoryBadge $isCardio={result.category === 'cardio'}>
                  <CategoryBadgeText $isCardio={result.category === 'cardio'}>
                    {result.category === 'cardio' ? 'Cardio' : 'Weighted'}
                  </CategoryBadgeText>
                </CategoryBadge>
              ) : null}
            </ResultRow>
          </View>
        );
      })}
      {allowCustom && customName.length > 0 ? (
        <View>
          {results.length > 0 ? <Hairline /> : null}
          <ResultRow
            onPress={() => onSelectResult({ name: customName, category: '' })}
            accessibilityRole="button"
            accessibilityLabel={t('exercise.editor.search.use_name', 'Use “{name}”', { name: customName })}
          >
            <ResultTile $bg={customAccent.bg}>
              <ResultTileLetter $fg={customAccent.fg}>+</ResultTileLetter>
            </ResultTile>
            <ResultTextColumn>
              <ResultName numberOfLines={1} ellipsizeMode="tail">
                {t('exercise.editor.search.use_name', 'Use “{name}”', { name: customName })}
              </ResultName>
            </ResultTextColumn>
          </ResultRow>
        </View>
      ) : null}
      <ResultsBottomPad />
    </View>
  );
}

/**
 * Add mode before a name is picked: Library and Custom tabs over a shared
 * search state. The library tab keeps the focused-search card plus the
 * results card with muscle filter chips; the custom tab owns the name field,
 * the type picker, categorization, and the explicit Create action.
 */
export function AddSearchCards(
  props: SearchSectionProps & {
    catalog: Record<string, ExerciseDescriptor>;
    onCreateCustom: (name: string, kind: ExerciseKind, descriptor?: ExerciseDescriptor) => void;
  },
) {
  const { query, catalog, onCreateCustom, onSelectResult } = props;
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const [tab, setTab] = useState<AddExerciseTab>('library');
  const [customName, setCustomName] = useState('');
  const [customKind, setCustomKind] = useState<ExerciseKind>('weighted');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<string | null>(null);

  const handleTabChange = (nextTab: AddExerciseTab) => {
    if (nextTab === 'custom' && customName.trim() === '' && query.trim() !== '') {
      setCustomName(query.trim());
    }
    setTab(nextTab);
  };

  const FILTER_MUSCLES = [
    'chest',
    'back',
    'shoulders',
    'biceps',
    'triceps',
    'quadriceps',
    'hamstrings',
    'glutes',
    'abs',
  ];

  const libraryItems: SearchResultItem[] = useMemo(() => {
    const matched = filterCatalog(catalog, {
      query,
      muscles: selectedMuscleFilter ? [selectedMuscleFilter] : [],
      limit: 40,
    });
    return matched.map(({ id, descriptor }) => {
      const firstMuscle = descriptor.muscles[0];
      const parts = [
        descriptor.equipment ? translateExerciseMeta(t, 'equipment', descriptor.equipment) : undefined,
        firstMuscle ? translateExerciseMeta(t, 'muscle', firstMuscle) : undefined,
      ].filter((part): part is string => !!part);
      return {
        id,
        name: descriptor.name,
        subtitle: parts.length > 0 ? parts.join(' · ') : undefined,
        category: descriptor.category,
        library: {
          equipment: descriptor.equipment,
          muscles: [...descriptor.muscles],
          instructions: descriptor.instructions,
        },
      };
    });
  }, [catalog, query, selectedMuscleFilter, t]);

  const handleCreateCustom = (descriptor: ExerciseDescriptor) => {
    const id = uuid();
    dispatch(updateExercise({ id, exercise: descriptor }));
    onCreateCustom(descriptor.name, customKind, descriptor);
  };

  const handleSelectResult = (item: SearchResultItem) => {
    if (item.id) {
      dispatch(recordRecentExerciseSearch(item.id));
    }
    onSelectResult(item);
  };

  return (
    <View>
      <TabPad>
        <SegmentedControl<AddExerciseTab>
          options={[
            { value: 'library', label: t('exercise.editor.add_tab.library', 'Library') },
            { value: 'custom', label: t('exercise.editor.add_tab.custom', 'Custom') },
          ]}
          value={tab}
          onChange={handleTabChange}
          accessibilityLabel={t('exercise.editor.add_tab.label', 'Add exercise source')}
        />
      </TabPad>
      {tab === 'library' ? (
        <>
          <Card radius={20}>
            <AddSearchPad>
              <SearchFieldControl {...props} compact />
              <ChipScroll horizontal showsHorizontalScrollIndicator={false}>
                <ChipRow>
                  <Chip
                    $active={selectedMuscleFilter === null}
                    onPress={() => setSelectedMuscleFilter(null)}
                    accessibilityRole="button"
                  >
                    <ChipText $active={selectedMuscleFilter === null}>{t('generic.all', 'All')}</ChipText>
                  </Chip>
                  {FILTER_MUSCLES.map((muscle) => {
                    const active = selectedMuscleFilter === muscle;
                    return (
                      <Chip
                        key={muscle}
                        $active={active}
                        onPress={() => setSelectedMuscleFilter(active ? null : muscle)}
                        accessibilityRole="button"
                      >
                        <ChipText $active={active}>{translateExerciseMeta(t, 'muscle', muscle)}</ChipText>
                      </Chip>
                    );
                  })}
                </ChipRow>
              </ChipScroll>
              {query.trim().length > 0 && libraryItems.length === 0 ? (
                <View>
                  <SearchHint>
                    {t('exercise.editor.search.no_results', 'No exercises match “{query}”.', {
                      query: query.trim(),
                    })}
                  </SearchHint>
                  <CreateCustomAction
                    onPress={() => {
                      setCustomName(query.trim());
                      setTab('custom');
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={t(
                      'exercise.editor.custom.create_named',
                      'Create “{name}” as custom exercise',
                      { name: query.trim() },
                    )}
                  >
                    <PlusGlyph />
                    <CreateCustomActionText>
                      {t('exercise.editor.custom.create_named', 'Create “{name}” as custom exercise', {
                        name: query.trim(),
                      })}
                    </CreateCustomActionText>
                  </CreateCustomAction>
                </View>
              ) : null}
            </AddSearchPad>
          </Card>
          {libraryItems.length > 0 ? (
            <View>
              <SearchSection>
                <Card radius={20}>
                  <SearchResults
                    results={libraryItems}
                    query={query}
                    allowCustom={false}
                    onSelectResult={handleSelectResult}
                  />
                </Card>
              </SearchSection>
            </View>
          ) : null}
        </>
      ) : (
        <CustomExerciseTab
          name={customName}
          onNameChange={setCustomName}
          kind={customKind}
          onKindChange={setCustomKind}
          catalog={catalog}
          onCreate={handleCreateCustom}
          onUseLibrary={(name) => {
            props.onQueryChange(name);
            setTab('library');
          }}
        />
      )}
    </View>
  );
}

export function IdentityCard({
  name,
  searchOpen,
  onToggleSearch,
  footer,
  ...search
}: SearchSectionProps & {
  name: string;
  searchOpen: boolean;
  onToggleSearch: () => void;
  footer?: ReactNode;
}) {
  const { t } = useTranslate();
  const named = name.trim().length > 0;
  return (
    <Card>
      <IdentityPad>
        {named ? (
          <WellField
            onPress={onToggleSearch}
            accessibilityRole="button"
            accessibilityLabel={t('exercise.editor.change_exercise', 'Change exercise')}
            accessibilityHint={t(
              'exercise.editor.change_exercise_hint',
              'Search the exercise library to swap this exercise',
            )}
          >
            <MagnifierGlyph />
            <NameText numberOfLines={2} ellipsizeMode="tail">
              {name}
            </NameText>
            <SwapGlyph />
          </WellField>
        ) : null}
        {named && footer ? <SearchSection>{footer}</SearchSection> : null}
      </IdentityPad>
      {searchOpen ? (
        <SearchSection>
          <SearchPad>
            <SearchFieldControl {...search} />
            <SearchHintRow query={search.query} results={search.results} />
          </SearchPad>
          <SearchResults
            results={search.results}
            query={search.query}
            allowCustom
            onSelectResult={search.onSelectResult}
          />
        </SearchSection>
      ) : null}
    </Card>
  );
}
