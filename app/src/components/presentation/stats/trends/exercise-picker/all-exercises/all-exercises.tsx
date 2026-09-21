import { HomeText } from '@/components/presentation/home/shared/home-text';
import { useAppTheme } from '@/hooks/useAppTheme';
import { fontWeight } from '@/styles/theme';
import { useTranslate } from '@tolgee/react';
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, SectionList } from 'react-native';
import { PinnedSectionHeader } from '../pinned-section/pinned-section';
import { RecentSectionHeader } from '../recent-section/recent-section';
import { ExerciseRow } from '../exercise-row/exercise-row';
import {
  SCRUBBER_LETTERS,
  sectionIndexForLetter,
  type PickerExercise,
  type PickerSection,
} from '../exercise-picker-model';
import {
  BottomFadeGradient,
  ListWrap,
  ScrubberColumn,
  ScrubberLetterCell,
  SectionHeaderRow,
} from './all-exercises.styles';

/* Layout constants for scroll math (pt). */
const SECTION_HEADER_H = 32;
const FIRST_ALPHA_HEADER_H = 64; // ALL EXERCISES label (32) + letter header (32)
const ROW_H = 60; // 52pt card + 8pt gap
const SCRUBBER_HIT = { top: 13.6, bottom: 13.6, left: 9.5, right: 9.5 }; // 44×44 hit area

/** "ALL EXERCISES" + live count, right-aligned (10/500, #6C6C70). */
export function AllExercisesHeader({ count }: { count: number }) {
  const { t } = useTranslate();
  return (
    <SectionHeaderRow>
      <HomeText
        weight={fontWeight.bold}
        tracking={1.35}
        style={{ fontSize: 10, lineHeight: 12, color: '#86868B' }}
      >
        {t('stats.exercise_picker.all.header')}
      </HomeText>
      <HomeText weight={fontWeight.medium} style={{ fontSize: 10, lineHeight: 12, color: '#6C6C70' }}>
        {String(count)}
      </HomeText>
    </SectionHeaderRow>
  );
}

/** A-Z section letter header. */
export function AlphaSectionHeader({ letter }: { letter: string }) {
  return (
    <SectionHeaderRow>
      <HomeText
        weight={fontWeight.bold}
        tracking={1.35}
        style={{ fontSize: 10, lineHeight: 12, color: '#86868B' }}
      >
        {letter}
      </HomeText>
    </SectionHeaderRow>
  );
}

/**
 * A-Z scrubber index at x=368. Tapping a letter scrolls the list to that
 * section (nearest section when the letter has no exercises).
 */
export function AlphabetScrubber({
  activeLetter,
  onSelectLetter,
}: {
  activeLetter: string | undefined;
  onSelectLetter: (letter: string) => void;
}) {
  const theme = useAppTheme();
  return (
    <ScrubberColumn pointerEvents="box-none">
      {SCRUBBER_LETTERS.map((letter) => {
        const active = letter === activeLetter;
        return (
          <Pressable
            key={letter}
            onPress={() => onSelectLetter(letter)}
            hitSlop={SCRUBBER_HIT}
            accessibilityRole="button"
            accessibilityLabel={letter}
            accessibilityState={{ selected: active }}
          >
            <ScrubberLetterCell>
              <HomeText
                weight={active ? fontWeight.bold : fontWeight.semibold}
                tracking={-0.1}
                style={{
                  fontSize: 8.5,
                  lineHeight: 10,
                  color: active ? (theme.isDark ? '#FF6A88' : '#D70015') : '#8E8E93',
                }}
              >
                {letter}
              </HomeText>
            </ScrubberLetterCell>
          </Pressable>
        );
      })}
    </ScrubberColumn>
  );
}

/** 40pt fade so the list dissolves under the sticky confirm. */
export function ListBottomFade() {
  const theme = useAppTheme();
  const base = theme.isDark ? 'rgba(5,5,7,0.94)' : 'rgba(243,243,248,0.94)';
  return <BottomFadeGradient colors={['rgba(0,0,0,0)', base] as [string, string]} pointerEvents="none" />;
}

function headerHeightFor(sections: PickerSection[], index: number): number {
  const section = sections[index]!;
  if (section.kind === 'alpha' && (index === 0 || sections[index - 1]!.kind !== 'alpha')) {
    return FIRST_ALPHA_HEADER_H;
  }
  return SECTION_HEADER_H;
}

/**
 * The picker's virtualized list: pinned + recent shortcut sections, then the
 * A-Z library, with the alphabet scrubber and bottom fade overlaid.
 */
export function ExercisePickerList({
  sections,
  selectedName,
  onSelectExercise,
  listHeader,
  listHeaderHeight,
  listEmpty,
  showScrubber,
}: {
  sections: PickerSection[];
  selectedName: string | undefined;
  onSelectExercise: (exercise: PickerExercise) => void;
  listHeader: ReactElement | null;
  /** Height of the list header (0 when the selection card is hidden). */
  listHeaderHeight: number;
  /** Rendered when the search/filter yields no sections. */
  listEmpty: ReactElement | null;
  /** The scrubber only makes sense over the full A-Z list. */
  showScrubber: boolean;
}) {
  const listRef = useRef<SectionList<PickerExercise, PickerSection>>(null);

  // Precomputed section-header offsets for scrubber jumps + active tracking.
  const headerOffsets: number[] = [];
  {
    let y = listHeaderHeight;
    sections.forEach((section, index) => {
      headerOffsets.push(y);
      y += headerHeightFor(sections, index) + section.data.length * ROW_H;
    });
  }

  const firstAlpha = sections.find((s) => s.kind === 'alpha');
  const [activeLetter, setActiveLetter] = useState<string | undefined>(firstAlpha?.title);
  const activeLetterRef = useRef(activeLetter);
  activeLetterRef.current = activeLetter;

  // The scrubber labels the section at the top; reset when the list rebuilds.
  useEffect(() => {
    setActiveLetter(sections.find((s) => s.kind === 'alpha')?.title);
  }, [sections]);

  const scrollToSection = (sectionIndex: number) => {
    // Negative viewOffset lands the section header (not just its first row)
    // at the top of the viewport.
    const headerH = headerHeightFor(sections, sectionIndex);
    listRef.current?.scrollToLocation({
      sectionIndex,
      itemIndex: 0,
      animated: true,
      viewPosition: 0,
      viewOffset: -(headerH + 4),
    });
  };

  const onSelectLetter = (letter: string) => {
    const index = sectionIndexForLetter(sections, letter);
    if (index < 0) {
      return;
    }
    setActiveLetter(sections[index]!.title);
    scrollToSection(index);
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    let current: string | undefined;
    sections.forEach((section, index) => {
      if (section.kind === 'alpha' && headerOffsets[index]! <= y + 120) {
        current = section.title;
      }
    });
    if (current !== undefined && current !== activeLetterRef.current) {
      setActiveLetter(current);
    }
  };

  const renderSectionHeader = ({ section }: { section: PickerSection }) => {
    switch (section.kind) {
      case 'pinned':
        return <PinnedSectionHeader />;
      case 'recent':
        return <RecentSectionHeader />;
      case 'alpha': {
        const index = sections.indexOf(section);
        const isFirstAlpha = index === 0 || sections[index - 1]!.kind !== 'alpha';
        return (
          <>
            {isFirstAlpha ? <AllExercisesHeader count={alphaCount(sections)} /> : null}
            <AlphaSectionHeader letter={section.title} />
          </>
        );
      }
    }
  };

  return (
    <ListWrap>
      <SectionList<PickerExercise, PickerSection>
        ref={listRef}
        sections={sections}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={listHeader}
        renderSectionHeader={renderSectionHeader}
        renderItem={({ item }) => (
          <ExerciseRow
            exercise={item}
            selected={item.name === selectedName}
            onPress={() => onSelectExercise(item)}
            includeEquipment={true}
          />
        )}
        ListEmptyComponent={listEmpty}
        // 16pt margins; the right gutter (41pt) clears the scrubber so rows
        // stay 336pt wide on a 393pt canvas, per the reference.
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 41, paddingBottom: 56 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
      />
      {showScrubber ? (
        <AlphabetScrubber activeLetter={activeLetter} onSelectLetter={onSelectLetter} />
      ) : null}
      <ListBottomFade />
    </ListWrap>
  );
}

function alphaCount(sections: PickerSection[]): number {
  return sections.reduce((sum, s) => (s.kind === 'alpha' ? sum + s.data.length : sum), 0);
}
