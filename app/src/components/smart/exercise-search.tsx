import { fuzzyMatchScore } from '@/components/presentation/workout-editor/exercise-fuzzy-match';
import { computeFiltered, dayForMuscles, FilterInput, SuggestionDay } from './exercise-search-logic';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeScreenBackground } from '@/components/presentation/home/shared/home-auras';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ExerciseDescriptor } from '@/models/exercise-models';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import { clearRecentExerciseSearches, recordRecentExerciseSearch, setExerciseSearchResult } from '@/store/app';
import { selectExerciseById, selectExercises, selectMuscles, updateExercise } from '@/store/stored-sessions';
import { alpha } from '@/styles/theme';
import { translateExerciseMeta } from '@/utils/exercise-meta';
import { toGroupLabelCase } from '@/components/presentation/settings/shared/grouped-settings-list';
import { uuid } from '@/utils/uuid';
import { LegendList } from '@legendapp/list';
import type { TranslationKey } from '@tolgee/web';
import { useTranslate } from '@tolgee/react';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { Platform, Pressable, ScrollView, TextInput } from 'react-native';
import type { TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, G, Line, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useDebouncedCallback } from 'use-debounce';
import { useDispatch } from 'react-redux';
import * as S from './exercise-search.styles';

/* ------------------------------------------------------------------ *
 * Glyphs — drawn in the spec's <defs> geometry, 1.9pt rounded strokes.
 * ------------------------------------------------------------------ */

function DumbbellGlyph({ color }: { color: string }) {
  // Spec #db at scale .62 → 26×16 units render 16.1×9.9. The viewBox hugs the
  // content box exactly so the scale is a true .62 (16.1/26).
  return (
    <Svg width={16.1} height={9.9} viewBox="-13 -8 26 16">
      <G fill={color}>
        <Rect x={-13} y={-5.6} width={4.4} height={11.2} rx={1.8} />
        <Rect x={-7.6} y={-8} width={3.8} height={16} rx={1.7} />
        <Rect x={-7.6} y={-1.9} width={15.2} height={3.8} rx={0.6} />
        <Rect x={3.8} y={-8} width={3.8} height={16} rx={1.7} />
        <Rect x={8.6} y={-5.6} width={4.4} height={11.2} rx={1.8} />
      </G>
    </Svg>
  );
}

function CableGlyph({ color }: { color: string }) {
  // Spec #cb at scale .72 → 16×12 units render 11.5×8.6; the 1.9 stroke scales along.
  return (
    <Svg width={11.5} height={8.6} viewBox="-8 -6 16 12">
      <G fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        <Rect x={-8} y={-6} width={16} height={12} rx={3} />
        <Path d="M-3 -6 V6 M3 -6 V6" />
      </G>
    </Svg>
  );
}

function PlateGlyph({ color }: { color: string }) {
  // Spec #cl at scale .66 → ~14×15 units render 9.2×9.9.
  return (
    <Svg width={9.2} height={9.9} viewBox="-7 -7 14 15">
      <G fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round">
        <Path d="M-7 -7 C-7 2 -3 5 0 8 C3 5 7 2 7 -7" />
        <Line x1={0} y1={8} x2={0} y2={-2} />
      </G>
    </Svg>
  );
}

function ChevronGlyph() {
  // ES05: iOS chevron pair (SH06 family) — the settings hook lives in another
  // domain, so this screen resolves the same pair from its own theme.
  const theme = useAppTheme();
  return (
    <Svg width={10} height={16} viewBox="-5 -8 10 16">
      <Path
        d="M-2 -4 L2 0 L-2 4"
        fill="none"
        stroke={theme.isDark ? '#48484A' : '#C7C7CC'}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MagnifierGlyph() {
  return (
    <Svg width={16} height={16} viewBox="-8 -8 16 16">
      {/* Spec icon cy is 81 — 2pt above the field's vertical center (83). */}
      <G fill="none" stroke="#8E8E93" strokeWidth={1.9} strokeLinecap="round" transform="translate(0 -2)">
        <Circle cx={0} cy={0} r={5.6} />
        <Line x1={4.2} y1={4.2} x2={8} y2={8} />
      </G>
    </Svg>
  );
}

function PlusGlyph({ color, width = 2 }: { color: string; width?: number }) {
  // Spec plus marks: 12×12, 2pt rounded stroke (2.1 on the create row).
  return (
    <Svg width={12} height={12} viewBox="-6 -6 12 12">
      <G stroke={color} strokeWidth={width} strokeLinecap="round">
        <Line x1={-6} y1={0} x2={6} y2={0} />
        <Line x1={0} y1={-6} x2={0} y2={6} />
      </G>
    </Svg>
  );
}

/** Ambient aura behind content — spec a1: blue @ 12% at (330, 220), r 280. */
function ScreenAura() {
  const theme = useAppTheme();
  const color = theme.isDark ? '#0A84FF' : '#007AFF';
  const opacity = theme.isDark ? 0.12 : 0.07;
  return (
    <S.AuraWrap pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 393 852" preserveAspectRatio="xMidYMin slice">
        <Defs>
          <RadialGradient id="exerciseSearchAura" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={color} stopOpacity={opacity} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={330} cy={220} rx={280} ry={280} fill="url(#exerciseSearchAura)" />
      </Svg>
    </S.AuraWrap>
  );
}

/* ------------------------------------------------------------------ *
 * Row data helpers
 * ------------------------------------------------------------------ */

const DEFAULT_ACCENT = { bg: '#FF2D55', fg: '#FF6A88' } as const;

const ACCENTS = [
  DEFAULT_ACCENT,
  { bg: '#0A84FF', fg: '#5EB0FF' },
  { bg: '#FF9F0A', fg: '#FFB84D' },
  { bg: '#AF52DE', fg: '#C77DFF' },
  { bg: '#30D158', fg: '#4ADE80' },
  { bg: '#00D9E9', fg: '#5EDCF0' },
] as const;

/** Stable per-exercise accent, so a row keeps its tint across renders. */
function accentFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  // h % length is always a valid index; the fallback is only for the type checker.
  return ACCENTS[h % ACCENTS.length] ?? DEFAULT_ACCENT;
}

/* Spec rows: barbell → dumbbell glyph (#db); machine → rect glyph (#cb);
 * cable and dumbbell → hook glyph (#cl). e.g. Incline DB Press (dumbbell)
 * and Cable Crossover (cable) both render #cl, while Seated Shoulder Press
 * (machine) renders #cb. */
function glyphKind(equipment: string | null): 'dumbbell' | 'cable' | 'plate' {
  switch (equipment) {
    case 'barbell':
    case 'kettlebells':
    case 'e-z curl bar':
      return 'dumbbell';
    case 'machine':
      return 'cable';
    case 'cable':
    case 'dumbbell':
    default:
      return 'plate';
  }
}

/* ------------------------------------------------------------------ *
 * Exercise row · 361×52 rx18
 * ------------------------------------------------------------------ */

/**
 * Search field with an imperative ref. styled-components v6's React Native
 * types omit `ref` even though it forwards to the underlying TextInput at
 * runtime, so this thin wrapper recovers it.
 */
function SearchField({ inputRef, ...props }: TextInputProps & { inputRef: RefObject<TextInput | null> }) {
  // @ts-expect-error — ref forwards to the underlying TextInput at runtime
  return <S.SearchInput {...props} ref={inputRef} />;
}

function ExerciseRow({ id, onAdd }: { id: string; onAdd: (exercise: ExerciseDescriptor, exerciseId: string) => void }) {
  const { t } = useTranslate();
  const exercise = useAppSelectorWithArg(selectExerciseById, id);
  if (!exercise) {
    return null;
  }
  const accent = accentFor(id);
  const kind = glyphKind(exercise.equipment);
  const segments = [
    ...(exercise.equipment ? [translateExerciseMeta(t, 'equipment', exercise.equipment)] : []),
    ...exercise.muscles.map((m) => translateExerciseMeta(t, 'muscle', m)),
  ].slice(0, 3);

  return (
    <HomeCard radius={18} elev="tile" pad={0} style={{ minHeight: 52 }}>
      <S.RowPressable
        onPress={() => onAdd(exercise, id)}
        style={{ borderCurve: 'continuous' }}
        accessibilityRole="button"
        accessibilityLabel={exercise.name}
      >
        <S.IconTile style={{ backgroundColor: alpha(accent.bg, 0.15) }}>
          {kind === 'dumbbell' ? (
            <DumbbellGlyph color={accent.fg} />
          ) : kind === 'cable' ? (
            <CableGlyph color={accent.fg} />
          ) : (
            <PlateGlyph color={accent.fg} />
          )}
        </S.IconTile>
        <S.RowTexts>
          <S.RowName numberOfLines={1}>{exercise.name}</S.RowName>
          <S.RowSub numberOfLines={1}>{segments.join(' · ')}</S.RowSub>
        </S.RowTexts>
        <S.AddButton
          onPress={() => onAdd(exercise, id)}
          hitSlop={7}
          accessibilityRole="button"
          accessibilityLabel={t('exercise.search.add_exercise', 'Add {name}', { name: exercise.name })}
        >
          <PlusGlyph color="#FF6A88" width={2} />
        </S.AddButton>
      </S.RowPressable>
    </HomeCard>
  );
}

/* ------------------------------------------------------------------ *
 * Create-custom · dashed row
 * ------------------------------------------------------------------ */

function CreateCustomRow({ onPress }: { onPress: () => void }) {
  const { t } = useTranslate();
  return (
    <S.CreateRow
      onPress={onPress}
      hitSlop={4}
      style={{ borderCurve: 'continuous' }}
      accessibilityRole="button"
    >
      <S.CreateCircle style={{ borderCurve: 'continuous' }}>
        <PlusGlyph color="#FFFFFF" width={2.1} />
      </S.CreateCircle>
      <S.CreateTexts>
        <S.CreateTitle numberOfLines={1}>{t('exercise.search.create_custom', 'Create Custom Exercise')}</S.CreateTitle>
        <S.CreateSub numberOfLines={1}>
          {t('exercise.search.create_custom_sub', 'Name it, track it, own it')}
        </S.CreateSub>
      </S.CreateTexts>
      <ChevronGlyph />
    </S.CreateRow>
  );
}

/* ------------------------------------------------------------------ *
 * Filtering — the engine lives in ./exercise-search-logic (RN-free, so
 * simulation tests can import it): fuzzy name match + muscle/equipment
 * filters + exact-match detection for the custom-exercise suggestion.
 * ------------------------------------------------------------------ */

/** Equipment values worth a chip — frequent enough to filter by. */
const EQUIPMENT_CHIP_ORDER = ['barbell', 'dumbbell', 'cable', 'machine', 'kettlebells', 'bands'];

const SUGGESTED_HEADER_COPY: Record<SuggestionDay, { key: TranslationKey; fallback: string }> = {
  push: { key: 'exercise.search.suggested_push', fallback: 'SUGGESTED FOR PUSH DAY' },
  pull: { key: 'exercise.search.suggested_pull', fallback: 'SUGGESTED FOR PULL DAY' },
  legs: { key: 'exercise.search.suggested_legs', fallback: 'SUGGESTED FOR LEG DAY' },
};

const RECENT_LIMIT = 3;
const SUGGESTION_LIMIT = 6;

export function ExerciseSearch(props: { requestId: string; exerciseName: string }) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dispatch = useDispatch();
  const { dismiss } = useRouter();

  const exercises = useAppSelector(selectExercises);
  const muscleChips = useAppSelector(selectMuscles);
  const recentIds = useAppSelector((s) => s.app.recentExerciseSearchIds);
  // ES04: micro-labels cased in the app language (SH02 family).
  const locale = useAppSelector((s) => s.settings.preferredLanguage) ?? undefined;

  const [searchText, setSearchText] = useState(props.exerciseName);
  const [focused, setFocused] = useState(false);
  const [muscleFilters, setMuscleFilters] = useState<string[]>([]);
  const [equipmentFilters, setEquipmentFilters] = useState<string[]>([]);
  const [result, setResult] = useState(() =>
    props.exerciseName ? computeFiltered(exercises, { text: props.exerciseName, muscles: [], equipment: [] }) : null,
  );
  const searchInputRef = useRef<TextInput>(null);

  // The exercise catalog loads asynchronously at startup and reloads on
  // language change. Re-resolve the committed query against the new catalog
  // so results never go stale (e.g. a cold-start deep link that mounts with
  // a pre-filled name before the catalog arrives). The mount-time catalog is
  // already handled by the useState initializer above.
  const committedInput = useRef<FilterInput | null>(
    props.exerciseName ? { text: props.exerciseName, muscles: [], equipment: [] } : null,
  );
  const catalogSeen = useRef(false);
  useEffect(() => {
    if (!catalogSeen.current) {
      catalogSeen.current = true;
      return;
    }
    if (committedInput.current) {
      setResult(computeFiltered(exercises, committedInput.current));
    }
  }, [exercises]);

  const filteringActive = searchText.trim() !== '' || muscleFilters.length > 0 || equipmentFilters.length > 0;

  const applyFilters = useDebouncedCallback((input: FilterInput) => {
    committedInput.current = input;
    setResult(computeFiltered(exercises, input));
  }, 100);

  const updateSearchText = (text: string) => {
    setSearchText(text);
    applyFilters({ text, muscles: muscleFilters, equipment: equipmentFilters });
  };

  const toggleFilter = (kind: 'muscle' | 'equipment', value: string) => {
    const list = kind === 'muscle' ? muscleFilters : equipmentFilters;
    const next = list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
    if (kind === 'muscle') {
      setMuscleFilters(next);
      applyFilters({ text: searchText, muscles: next, equipment: equipmentFilters });
    } else {
      setEquipmentFilters(next);
      applyFilters({ text: searchText, muscles: muscleFilters, equipment: next });
    }
  };

  const clearFilters = () => {
    setMuscleFilters([]);
    setEquipmentFilters([]);
    applyFilters({ text: searchText, muscles: [], equipment: [] });
  };

  const onSelect = (exercise: ExerciseDescriptor, exerciseId: string) => {
    dispatch(recordRecentExerciseSearch(exerciseId));
    dispatch(setExerciseSearchResult({ requestId: props.requestId, exercise }));
    dismiss();
  };

  const onCreateCustom = () => {
    const suggested = result?.suggested;
    if (suggested) {
      const id = uuid();
      dispatch(updateExercise({ id, exercise: suggested }));
      onSelect(suggested, id);
    } else {
      // No name typed yet — move focus to the field so the user can name it.
      searchInputRef.current?.focus();
    }
  };

  const equipmentChips = useMemo(
    () => EQUIPMENT_CHIP_ORDER.filter((equipment) => Object.values(exercises).some((x) => x.equipment === equipment)),
    [exercises],
  );

  /** Suggestions: library exercises sharing muscles with the exercise being
   * replaced (falling back to the most recent pick), minus recents. */
  const suggestion = useMemo((): { ids: string[]; day: SuggestionDay | null } => {
    const empty = { ids: [] as string[], day: null as SuggestionDay | null };
    if (filteringActive) {
      return empty;
    }
    const refName = props.exerciseName.trim().toLowerCase();
    let refId: string | undefined;
    let refMuscles: string[] = [];
    if (refName) {
      const found = Object.entries(exercises).find(([, x]) => x.name.toLowerCase() === refName);
      if (found) {
        refId = found[0];
        refMuscles = found[1].muscles;
      }
    }
    if (refMuscles.length === 0 && recentIds.length > 0) {
      const firstRecentId = recentIds[0];
      const recent = firstRecentId ? exercises[firstRecentId] : undefined;
      if (recent) {
        refMuscles = recent.muscles;
      }
    }
    if (refMuscles.length === 0) {
      return empty;
    }
    const wanted = new Set(refMuscles);
    const recentSet = new Set(recentIds);
    const ids = Object.entries(exercises)
      .filter(([id]) => id !== refId && !recentSet.has(id))
      .map(([id, exercise]) => ({
        id,
        overlap: exercise.muscles.filter((m) => wanted.has(m)).length,
        name: exercise.name,
      }))
      .filter((x) => x.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap || a.name.localeCompare(b.name))
      .slice(0, SUGGESTION_LIMIT)
      .map((x) => x.id);
    return { ids, day: dayForMuscles(refMuscles) };
  }, [filteringActive, exercises, props.exerciseName, recentIds]);

  const recents = useMemo(
    () => recentIds.filter((id) => exercises[id] !== undefined).slice(0, RECENT_LIMIT),
    [recentIds, exercises],
  );

  const resultItems = useMemo((): string[] => {
    if (!result) {
      return [];
    }
    return result.suggested ? ['__create', ...result.ids] : [...result.ids];
  }, [result]);

  const renderChip = (key: string, label: string, active: boolean, onPress: () => void) => (
    <S.Chip
      key={key}
      $active={active}
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8 }}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <S.ChipText $active={active} numberOfLines={1}>
        {label}
      </S.ChipText>
    </S.Chip>
  );

  const noneActive = muscleFilters.length === 0 && equipmentFilters.length === 0;

  const headerCopy = suggestion.day ? SUGGESTED_HEADER_COPY[suggestion.day] : null;

  return (
    <SafeAreaView
      edges={{
        left: 'additive',
        right: 'additive',
        top: Platform.OS === 'ios' ? 'additive' : 'off',
        bottom: 'additive',
      }}
      style={{ flex: 1, backgroundColor: theme.isDark ? '#0B0B0E' : '#F8F8FC' }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <S.Screen>
        <HomeScreenBackground />
        <ScreenAura />

        {/* Search field · focused */}
        <S.SearchRow>
          <S.SearchOuter
            $focused={focused}
            colors={focused ? undefined : (['transparent', 'transparent', 'transparent'] as const)}
            style={{ borderCurve: 'continuous' }}
          >
            <S.SearchInner style={{ borderCurve: 'continuous' }}>
              <MagnifierGlyph />
              <SearchField
                inputRef={searchInputRef}
                testID="exercise-search-input"
                accessibilityLabel={t('exercise.search.placeholder', 'Search exercises')}
                value={searchText}
                onChangeText={updateSearchText}
                placeholder={t('exercise.search.placeholder', 'Search exercises')}
                placeholderTextColor={theme.isDark ? '#6C6C70' : '#AEAEB2'}
                autoFocus
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="search"
                cursorColor="#FF6A3D"
                selectionColor="#FF6A3D"
                // The field is spec 38 tall; the 3pt vertical hitSlop brings the
                // touch target to 44 without changing geometry.
                hitSlop={{ top: 3, bottom: 3 }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
            </S.SearchInner>
          </S.SearchOuter>
          {/* Spec: Cancel's trailing edge at x=377 — the pressable keeps its
              intrinsic width at the row's end (ES01: a second flexer here
              would halve the field on 393). */}
          <Pressable
            onPress={() => dismiss()}
            hitSlop={14}
            accessibilityRole="button"
            accessibilityLabel={t('generic.cancel.button')}
            style={{ flexShrink: 0, alignItems: 'flex-end' }}
          >
            <S.CancelText>{t('generic.cancel.button')}</S.CancelText>
          </Pressable>
        </S.SearchRow>

        {/* Filter chips */}
        <S.ChipsScroll
          // Top pad only: chips sit 12 below the search field (spec 114 vs 102);
          // the Section's own margin-top carries the 22 to the RECENTS header.
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingTop: 12 }}
          keyboardShouldPersistTaps="handled"
        >
          {renderChip('all', t('exercise.search.all', 'All'), noneActive, clearFilters)}
          {muscleChips.map((m) =>
            renderChip(`muscle:${m}`, translateExerciseMeta(t, 'muscle', m), muscleFilters.includes(m), () =>
              toggleFilter('muscle', m),
            ),
          )}
          {equipmentChips.map((e) =>
            renderChip(`equipment:${e}`, translateExerciseMeta(t, 'equipment', e), equipmentFilters.includes(e), () =>
              toggleFilter('equipment', e),
            ),
          )}
        </S.ChipsScroll>

        {filteringActive ? (
          <LegendList
            data={resultItems}
            keyExtractor={(item) => item}
            getItemType={(item) => (item === '__create' ? 'create' : 'exercise')}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, gap: 8, paddingBottom: 56 }}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              result ? (
                <S.EmptyWrap>
                  <S.EmptyTitle>{t('exercise.search.no_results', 'No exercises match')}</S.EmptyTitle>
                  <S.EmptySub>
                    {t('exercise.search.no_results_sub', 'Try a different search, or create a custom exercise.')}
                  </S.EmptySub>
                </S.EmptyWrap>
              ) : null
            }
            renderItem={({ item }) =>
              item === '__create' ? (
                <CreateCustomRow onPress={onCreateCustom} />
              ) : (
                <ExerciseRow id={item} onAdd={onSelect} />
              )
            }
          />
        ) : (
          <ScrollView
            contentContainerStyle={{ paddingBottom: 56 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {recents.length > 0 && (
              <S.Section>
                <S.SectionHeaderRow>
                  <S.SectionLabel>
                    {toGroupLabelCase(t('exercise.search.recents', 'RECENTS'), locale)}
                  </S.SectionLabel>
                  <Pressable
                    onPress={() => dispatch(clearRecentExerciseSearches())}
                    hitSlop={16}
                    accessibilityRole="button"
                  >
                    <S.ClearText>{t('generic.clear.button')}</S.ClearText>
                  </Pressable>
                </S.SectionHeaderRow>
                <S.RowsList>
                  {recents.map((id) => (
                    <ExerciseRow key={id} id={id} onAdd={onSelect} />
                  ))}
                </S.RowsList>
              </S.Section>
            )}

            <S.CreateWrap>
              <CreateCustomRow onPress={onCreateCustom} />
            </S.CreateWrap>

            {suggestion.ids.length > 0 && (
              <S.Section>
                <S.SectionHeaderRow>
                  <S.SectionLabel>
                    {toGroupLabelCase(
                      headerCopy
                        ? t(headerCopy.key, headerCopy.fallback)
                        : t('exercise.search.suggested_other', 'SUGGESTED'),
                      locale,
                    )}
                  </S.SectionLabel>
                </S.SectionHeaderRow>
                <S.RowsList>
                  {suggestion.ids.map((id) => (
                    <ExerciseRow key={id} id={id} onAdd={onSelect} />
                  ))}
                </S.RowsList>
              </S.Section>
            )}
          </ScrollView>
        )}

        {/* Scroll fade — last ~40pt */}
        <LinearGradient
          colors={['transparent', alpha(theme.isDark ? '#050507' : '#F1F1F6', 0.9)]}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 40 }}
          pointerEvents="none"
        />
      </S.Screen>
    </SafeAreaView>
  );
}
