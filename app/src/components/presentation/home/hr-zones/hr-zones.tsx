import { useTranslate } from '@tolgee/react';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeCard } from '../shared/home-card';
import { HomeGradient } from '../shared/home-gradient';
import { HomeText } from '../shared/home-text';
import { SampleBadge } from '../shared/sample-badge';
import * as S from './hr-zones.styles';

/**
 * Sample HR data (the app has no HR source). Kept internally consistent:
 * total 42:00 = Exercise ring 42/60. Session-only zones are
 * Z1 3:40 · Z2 8:00 · Z3 9:00 · Z4 9:00 · Z5 4:00 = 33:40 active;
 * adding the 8:20 morning walk to Z1 gives 12:00 · 8:00 · 9:00 · 9:00 · 4:00.
 * Z3 and above = 9+9+4 = 22 min. No bar is "highest": all labels uniform.
 *
 * Reference: 44×58 tracks, fills bottom-aligned with 10pt radii, 9.5/700
 * values 7pt above each bar, uniform 10/600 zone labels, static TODAY chip.
 */
const ZONE_GRADIENTS: [string, string][] = [
  ['#5A5A60', '#98989F'],
  ['#1E7A34', '#4ADE80'],
  ['#B89400', '#FFE14D'],
  ['#C25A08', '#FFB84D'],
  ['#B3123A', '#FF6A88'],
];

const ZONES = [
  { zone: 'recovery', minutes: 12 },
  { zone: 'endurance', minutes: 8 },
  { zone: 'tempo', minutes: 9 },
  { zone: 'threshold', minutes: 9 },
  { zone: 'max', minutes: 4 },
] as const;

const MAX_MINUTES = 12;
const BAR_MAX_H = 58;

export function HrZones() {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;
  const aboveMinutes = ZONES.filter((z) => z.zone === 'tempo' || z.zone === 'threshold' || z.zone === 'max').reduce(
    (sum, z) => sum + z.minutes,
    0,
  );
  const valueColors = dark
    ? ['#98989F', '#4ADE80', '#FFE14D', '#FFB84D', '#FF6A88']
    : ['#8E8E93', '#248A3D', '#A05A00', '#C93400', '#D70015'];
  const zoneLabelColor = dark ? '#6C6C70' : '#AEAEB2';
  const titleColor = dark ? '#FFFFFF' : '#1C1C1E';
  const subtitleColor = dark ? '#86868B' : '#6E6E73';

  return (
    <HomeCard radius={30} pad={20} style={{ height: 156 }}>
      <S.HeaderRow>
        <HomeText
          weight={fontWeight.semibold}
          tracking={-0.3}
          style={{ fontSize: 15.5, lineHeight: 19, color: titleColor }}
        >
          {t('home.hr_zones.title') /* en: "Heart Rate Zones" */}
        </HomeText>
        <S.TodayChip>
          <HomeText
            weight={fontWeight.bold}
            micro
            tracking={0.7}
            style={{ fontSize: 9, lineHeight: 11, color: subtitleColor }}
          >
            {t('home.hr_zones.today') /* en: "Today" */}
          </HomeText>
        </S.TodayChip>
      </S.HeaderRow>
      <HomeText weight={fontWeight.medium} style={{ fontSize: 11, lineHeight: 14, color: subtitleColor, marginTop: 4 }}>
        {t('home.hr_zones.subtitle', { minutes: aboveMinutes }) /* en: "{minutes} min in Zone 3 and above" */}
      </HomeText>
      <SampleBadge />
      <S.BarsRow>
        {ZONES.map((z, i) => {
          const h = (z.minutes / MAX_MINUTES) * BAR_MAX_H;
          return (
            <S.ZoneColumn key={z.zone}>
              <S.ZoneTrack>
                <S.ZoneValue pointerEvents="none">
                  <HomeText
                    weight={fontWeight.bold}
                    tabular
                    style={{ fontSize: 9.5, lineHeight: 12, color: valueColors[i] }}
                  >
                    {t('home.hr_zones.minutes', { count: z.minutes }) /* en: "{count}m" */}
                  </HomeText>
                </S.ZoneValue>
                <HomeGradient
                  colors={ZONE_GRADIENTS[i]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={{ width: 44, height: h, borderRadius: 10 }}
                />
              </S.ZoneTrack>
              <HomeText
                weight={fontWeight.semibold}
                tracking={0.2}
                style={{
                  fontSize: 10,
                  lineHeight: 13,
                  color: zoneLabelColor,
                  marginTop: 8,
                }}
              >
                {t('home.hr_zones.zone_label', { n: i + 1 }) /* en: "Z{n}" */}
              </HomeText>
            </S.ZoneColumn>
          );
        })}
      </S.BarsRow>
    </HomeCard>
  );
}
