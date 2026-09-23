import { LocalDate } from '@js-joda/core';
import { Pressable } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useAppSelector, useAppSelectorWithArg } from '@/store';
import { selectActiveProgram } from '@/store/program';
import { selectCompletedDistinctSessionNames } from '@/store/stored-sessions';
import { useTranslate } from '@tolgee/react';
import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';
import { useChevronColor } from '@/components/presentation/settings/shared/grouped-settings-list';
import { ItemMenu } from '@/components/smart/program-list-item';
import {
  ActiveBadge,
  ActiveBadgeText,
  HeroBody,
  HeroCaption,
  HeroEdge,
  HeroIcon,
  HeroMenuSlot,
  HeroName,
  HeroPercent,
  HeroProgressRow,
  HeroText,
  HeroTitleRow,
  HeroTrack,
} from './program-hero-card.styles';

/** Dumbbell glyph (spec ic-db), shared by the program cards. */
export function DumbbellGlyph({ color, scale = 0.9 }: { color: string; scale?: number }) {
  return (
    <Svg width={26} height={17} viewBox="-14 -9 28 18">
      <Rect x={-13} y={-5.6} width={4.4} height={11.2} rx={1.8} fill={color} transform={`scale(${scale})`} />
      <Rect x={-7.6} y={-8} width={3.8} height={16} rx={1.7} fill={color} transform={`scale(${scale})`} />
      <Rect x={-7.6} y={-1.9} width={15.2} height={3.8} rx={0.6} fill={color} transform={`scale(${scale})`} />
      <Rect x={3.8} y={-8} width={3.8} height={16} rx={1.7} fill={color} transform={`scale(${scale})`} />
      <Rect x={8.6} y={-5.6} width={4.4} height={11.2} rx={1.8} fill={color} transform={`scale(${scale})`} />
    </Svg>
  );
}

/**
 * The active program's hero card. The progress bar is the week's real
 * coverage — how many of this program's sessions were completed in the last
 * 7 days — never a fabricated "week 3 of 6". Tapping opens the program
 * editor; the overflow menu keeps duplicate / share / export.
 */
export function ProgramHeroCard({ id }: { id: string }) {
  const { t } = useTranslate();
  const { push } = useRouter();
  const program = useAppSelector(selectActiveProgram);

  const today = LocalDate.now();
  const recentNames = useAppSelectorWithArg(selectCompletedDistinctSessionNames, today.minusDays(7));
  const locale = useAppSelector((s) => s.settings.preferredLanguage) ?? undefined;
  const chevron = useChevronColor();
  const total = program?.sessions.length ?? 0;
  const covered = program?.sessions.filter((s) => recentNames.includes(s.name)).length ?? 0;
  const fraction = total > 0 ? covered / total : 0;
  const percent = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(fraction * 100));

  if (!program) {
    return null;
  }

  return (
    <Pressable
      onPress={() => push(`/settings/manage-workouts/${id}`)}
      accessibilityRole="button"
      accessibilityLabel={program.name}
    >
      <HeroEdge>
        <HeroBody>
          <HeroIcon>
            <HomeGradient
              variant="gloss"
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 22, opacity: 0.4 }}
            />
            <DumbbellGlyph color="#FFFFFF" />
          </HeroIcon>
          <HeroText>
            <HeroTitleRow>
              <HeroName numberOfLines={1}>{program.name}</HeroName>
              <ActiveBadge>
                <ActiveBadgeText>{t('plan.active.label').toLocaleUpperCase(locale)}</ActiveBadgeText>
              </ActiveBadge>
            </HeroTitleRow>
            <HeroCaption numberOfLines={1}>
              {total > 0
                ? t(settingsKey('settings.programs.hero.coverage'), { covered, total })
                : t(settingsKey('settings.programs.hero.empty'))}
            </HeroCaption>
            {total > 0 ? (
              <HeroProgressRow>
                <HeroTrack>
                  <HomeGradient variant="brand" style={{ width: `${fraction * 100}%`, height: 4 }} />
                </HeroTrack>
                <HeroPercent style={{ fontVariant: ['tabular-nums'] }}>{percent}%</HeroPercent>
              </HeroProgressRow>
            ) : undefined}
          </HeroText>
          <Svg width={7} height={12} viewBox="-4 -6 8 12">
            <Path
              d="M-2 -4 L2 0 L-2 4"
              fill="none"
              stroke={chevron}
              strokeWidth={1.9}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <HeroMenuSlot>
            <ItemMenu id={id} mode="contained" />
          </HeroMenuSlot>
        </HeroBody>
      </HeroEdge>
    </Pressable>
  );
}
