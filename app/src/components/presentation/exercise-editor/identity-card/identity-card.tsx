import { Pressable, View } from 'react-native';
import { ReactNode } from 'react';
import { useTranslate } from '@tolgee/react';
import { useAppTheme } from '@/hooks/useAppTheme';
import {
  Card,
  FocusFieldInner,
  FocusGlow,
  Hairline,
  MagnifierGlyph,
  ResultTile,
  ResultTileLetter,
  SwapGlyph,
  WellField,
  XGlyph,
  tileAccent,
} from '../editor-primitives';
import {
  AddSearchPad,
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
} from './identity-card.styles';

export interface SearchResultItem {
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
  onSelectResult,
}: Pick<SearchSectionProps, 'results' | 'onSelectResult'> & { query: string }) {
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
            </ResultRow>
          </View>
        );
      })}
      {customName.length > 0 ? (
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
 * Add mode before a name is picked: the reference gives the focused search
 * its own card and the results a second card — no name well, no type picker.
 */
export function AddSearchCards(props: SearchSectionProps) {
  const { query, results } = props;
  const { t } = useTranslate();
  return (
    <View>
      <Card radius={20}>
        <AddSearchPad>
          <SearchFieldControl {...props} compact />
          <SearchHintRow query={query} results={results} />
          <SearchHint>
            {t(
              'exercise.editor.search.pick_guidance',
              'Pick from the library or use your own name — Done unlocks once the exercise has a name.',
            )}
          </SearchHint>
        </AddSearchPad>
      </Card>
      {results.length > 0 || query.trim().length > 0 ? (
        <View>
          <SearchSection>
            <Card radius={20}>
              <SearchResults results={results} query={query} onSelectResult={props.onSelectResult} />
            </Card>
          </SearchSection>
        </View>
      ) : null}
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
          <SearchResults results={search.results} query={search.query} onSelectResult={search.onSelectResult} />
        </SearchSection>
      ) : null}
    </Card>
  );
}
