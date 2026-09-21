import { useTranslate } from '@tolgee/react';
import type { TranslationKey } from '@tolgee/web';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeText } from '@/components/presentation/home/shared/home-text';
import { SampleBadge } from '@/components/presentation/home/shared/sample-badge';
import { TrendsSectionHeader } from '../shared/trends-section-header';
import { CanonicalMuscleGroup } from '../constants';
import { trackFractions } from './muscle-track';
import { MuscleCallout, MuscleLoadRow } from '../trends-overview-data';
import { trendsPalette } from '../trends-colors';
import {
  Band,
  BandDot,
  Callout,
  CalloutIcon,
  CalloutText,
  CardInner,
  Fill,
  LegendItem,
  LegendRow,
  LegendSwatch,
  MuscleRow,
  NameRow,
  TitleRow,
  Track,
  WindowPill,
} from './muscle-group-load.styles';

const GROUP_KEYS: Record<CanonicalMuscleGroup, TranslationKey> = {
  Chest: 'trends.muscle.group.chest',
  Back: 'trends.muscle.group.back',
  Shoulders: 'trends.muscle.group.shoulders',
  Quads: 'trends.muscle.group.quads',
  Hamstrings: 'trends.muscle.group.hamstrings',
  Calves: 'trends.muscle.group.calves',
};

/**
 * Muscle Group Load: six fixed rows — sets performed in the last 7 days
 * against the 0–24 set track (13.375 pt/set) with the target band overlaid.
 * The lowest sets/target-low ratio earns the under-trained callout.
 */
export function MuscleGroupLoad({
  rows,
  callout,
  sampled,
}: {
  rows: MuscleLoadRow[];
  callout: MuscleCallout | null;
  sampled: boolean;
}) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;
  const palette = trendsPalette(dark);
  const green = dark ? '#30D158' : '#248A3D';
  const dotColor = dark ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.9)';
  const trackBg = dark ? 'rgba(255,255,255,0.07)' : 'rgba(120,120,128,0.10)';

  return (
    <>
      <TrendsSectionHeader
        label={t('trends.muscle.title')}
        badge={sampled ? <SampleBadge compact /> : undefined}
      />
      <HomeCard hero pad={0}>
        <CardInner>
          <TitleRow>
            <HomeText
              weight={fontWeight.semibold}
              tracking={-0.3}
              style={{ fontSize: 15.5, lineHeight: 20, color: palette.primary }}
            >
              {t('trends.muscle.title')}
            </HomeText>
            <WindowPill $bg={palette.segmentedTrack}>
              <HomeText
                weight={fontWeight.bold}
                micro
                tracking={0.8}
                style={{ fontSize: 8.5, lineHeight: 11, color: palette.dim }}
              >
                {t('trends.muscle.range_label')}
              </HomeText>
            </WindowPill>
          </TitleRow>

          <LegendRow>
            <LegendItem>
              <LegendSwatch $color={green} $height={6} />
              <HomeText
                weight={fontWeight.medium}
                style={{
                  fontSize: 9.5,
                  lineHeight: 12,
                  marginLeft: 6,
                  color: palette.secondary,
                }}
              >
                {t('trends.muscle.legend_sets')}
              </HomeText>
            </LegendItem>
            <LegendItem>
              <LegendSwatch
                $color={
                  dark ? 'rgba(255,255,255,0.12)' : 'rgba(120,120,128,0.20)'
                }
                $height={8}
              />
              <HomeText
                weight={fontWeight.medium}
                style={{
                  fontSize: 9.5,
                  lineHeight: 12,
                  marginLeft: 6,
                  color: palette.secondary,
                }}
              >
                {t('trends.muscle.legend_band')}
              </HomeText>
            </LegendItem>
          </LegendRow>

          {rows.map((row) => {
            const under = callout?.muscle === row.group;
            // Percentages of the measured track width, so bars scale on every
            // device instead of the fixed 321 pt reference widths.
            const { bandLeftPct, bandWidthPct, fillPct } = trackFractions(row);
            return (
              <MuscleRow key={row.group}>
                <NameRow>
                  <HomeText
                    weight={fontWeight.semibold}
                    tracking={-0.15}
                    style={{
                      fontSize: 12,
                      lineHeight: 16,
                      color: palette.name,
                    }}
                  >
                    {t(GROUP_KEYS[row.group])}
                  </HomeText>
                  <HomeText
                    weight={fontWeight.semibold}
                    tabular
                    style={{
                      fontSize: 11,
                      lineHeight: 14,
                      color: under ? theme.home.amber : palette.dim,
                    }}
                  >
                    {t('trends.muscle.sets_label', { count: row.sets })}
                  </HomeText>
                </NameRow>
                <Track $bg={trackBg}>
                  <Band
                    $bg={palette.targetBand}
                    $leftPct={bandLeftPct}
                    $widthPct={bandWidthPct}
                  />
                  {fillPct > 0 ? (
                    <Fill
                      $color={under ? palette.undertrained : green}
                      $widthPct={fillPct}
                    />
                  ) : null}
                  <BandDot $leftPct={bandLeftPct} $color={dotColor} />
                  <BandDot
                    $leftPct={bandLeftPct + bandWidthPct}
                    $color={dotColor}
                  />
                </Track>
              </MuscleRow>
            );
          })}

          {callout ? (
            <Callout $bg={palette.insightBox} $border={palette.insightBorder}>
              <CalloutIcon
                $bg={dark ? 'rgba(255,159,10,0.18)' : 'rgba(255,149,0,0.16)'}
              >
                <HomeText
                  weight={fontWeight.bold}
                  style={{
                    fontSize: 11,
                    lineHeight: 13,
                    color: theme.home.amber,
                  }}
                >
                  !
                </HomeText>
              </CalloutIcon>
              <CalloutText>
                <HomeText
                  weight={fontWeight.semibold}
                  tracking={-0.15}
                  style={{
                    fontSize: 11.5,
                    lineHeight: 15,
                    color: palette.insightText,
                  }}
                >
                  {t('trends.muscle.callout_title', {
                    muscle: t(GROUP_KEYS[callout.muscle]),
                  })}
                </HomeText>
                <HomeText
                  weight={fontWeight.medium}
                  style={{
                    fontSize: 10.5,
                    lineHeight: 14,
                    marginTop: 2,
                    color: palette.insightSub,
                  }}
                >
                  {t('trends.muscle.callout_body', {
                    sets: callout.sets,
                    low: callout.low,
                    high: callout.high,
                    add: callout.add,
                  })}
                </HomeText>
              </CalloutText>
            </Callout>
          ) : null}
        </CardInner>
      </HomeCard>
    </>
  );
}
