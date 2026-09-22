import { useTranslate } from '@tolgee/react';
import { Circle, G, Path, Rect, Svg } from 'react-native-svg';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeText } from '../shared/home-text';
import { SectionHeader } from '../shared/section-header';
import type { ProgramItem } from '../use-home-data';
import * as S from './programs.styles';

type Accent = ProgramItem['accent'];

/**
 * Reference program gradients (gProgA/B/C), diagonal (0,0)→(1,1).
 * Light tops are lifted so artwork survives white cards; the scrim keeps
 * the bottom text legible in both modes.
 */
const ACCENT_GRADIENT: Record<Accent, { dark: [string, string]; light: [string, string] }> = {
  strength: { dark: ['#7C5CFF', '#241A54'], light: ['#6A4BF0', '#2A1B63'] },
  conditioning: { dark: ['#12A6B4', '#07333C'], light: ['#0E94A2', '#06323A'] },
  mobility: { dark: ['#FF7A3D', '#4A1520'], light: ['#F2662B', '#4A1520'] },
};

/** Accent color for the progress ring/bar. */
const ACCENT_SOLID: Record<Accent, string> = {
  strength: '#C4B5FD',
  conditioning: '#5EDCF0',
  mobility: '#FFB84D',
};

/** Large rotated watermark glyphs, white at 9% (opacity via the Watermark wrapper). */
function WatermarkGlyph({ accent }: { accent: Accent }) {
  if (accent === 'conditioning') {
    return (
      <Svg width={90} height={90} viewBox="0 0 24 24" style={{ transform: [{ rotate: '12deg' }] }}>
        <Path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" fill="#FFFFFF" />
      </Svg>
    );
  }
  if (accent === 'mobility') {
    return (
      <Svg width={80} height={80} viewBox="-6 -6 12 12" style={{ transform: [{ rotate: '0deg' }] }}>
        <Path d="M0 -5.2 L1.35 -1.35 L5.2 0 L1.35 1.35 L0 5.2 L-1.35 1.35 L-5.2 0 L-1.35 -1.35 Z" fill="#FFFFFF" />
      </Svg>
    );
  }
  return (
    <Svg width={96} height={60} viewBox="-16 -10 32 20" style={{ transform: [{ rotate: '-18deg' }] }}>
      <G fill="#FFFFFF">
        <Rect x={-13} y={-5.6} width={4.4} height={11.2} rx={1.8} />
        <Rect x={-7.6} y={-8} width={3.8} height={16} rx={1.7} />
        <Rect x={-7.6} y={-1.9} width={15.2} height={3.8} rx={0.6} />
        <Rect x={3.8} y={-8} width={3.8} height={16} rx={1.7} />
        <Rect x={8.6} y={-5.6} width={4.4} height={11.2} rx={1.8} />
      </G>
    </Svg>
  );
}

/** 26pt progress ring: r13, 3.5 stroke, mathematically derived dash. */
function ProgressRing({ pct, color }: { pct: number; color: string }) {
  const r = 13;
  const c = 2 * Math.PI * r;
  return (
    <Svg width={30} height={30} viewBox="0 0 30 30">
      <Circle cx={15} cy={15} r={r} fill="#000000" fillOpacity={0.22} />
      <Circle cx={15} cy={15} r={r} fill="none" stroke="#FFFFFF" strokeOpacity={0.24} strokeWidth={3.5} />
      <Circle
        cx={15}
        cy={15}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeDasharray={`${pct * c} ${c}`}
        transform="rotate(-90 15 15)"
      />
    </Svg>
  );
}

export function ProgramsSection({ programs, onSeeAll }: { programs: ProgramItem[]; onSeeAll: () => void }) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;

  return (
    <>
      <SectionHeader
        label={t('home.programs.label') /* en: "Programs" */}
        actionLabel={t('home.programs.see_all') /* en: "See All" */}
        onAction={onSeeAll}
      />
      {programs.length === 0 ? (
        <S.EmptyBox>
          <HomeText variant="footnote" tone="secondary">
            {t('home.programs.empty') /* en: "No programs saved yet." */}
          </HomeText>
        </S.EmptyBox>
      ) : (
        <S.Cards>
          {programs.map((program) => {
            const tagLabel =
              program.accent === 'strength'
                ? t('home.programs.strength') /* en: "Strength" */
                : program.accent === 'conditioning'
                  ? t('home.programs.conditioning') /* en: "Conditioning" */
                  : t('home.programs.mobility'); /* en: "Mobility" */
            const pct =
              program.progressPct == null ? null : Math.min(1, Math.max(0, program.progressPct));
            return (
              <S.ProgramCard
                key={program.id}
                style={{ borderCurve: 'continuous' }}
                onPress={onSeeAll}
                accessibilityRole="button"
                accessibilityLabel={program.name}
              >
                <S.CardGradient
                  colors={dark ? ACCENT_GRADIENT[program.accent].dark : ACCENT_GRADIENT[program.accent].light}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <S.Watermark>
                  <WatermarkGlyph accent={program.accent} />
                </S.Watermark>
                <S.Scrim
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.04)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.9)']}
                  locations={[0, 0.42, 0.7, 1]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                />
                <S.CardContent>
                  <S.TopRow>
                    <S.Tag>
                      <HomeText
                        weight={fontWeight.bold}
                        micro
                        tracking={0.5}
                        style={{ fontSize: 9, lineHeight: 11, color: '#FFFFFF' }}
                      >
                        {tagLabel.toLocaleUpperCase()}
                      </HomeText>
                    </S.Tag>
                    {pct != null && <ProgressRing pct={pct} color={ACCENT_SOLID[program.accent]} />}
                  </S.TopRow>
                  <S.BottomGroup>
                    <HomeText
                      weight={fontWeight.semibold}
                      tracking={-0.25}
                      numberOfLines={1}
                      style={{ fontSize: 15, lineHeight: 19, color: '#FFFFFF' }}
                    >
                      {program.name}
                    </HomeText>
                    <HomeText
                      weight={fontWeight.medium}
                      numberOfLines={1}
                      style={{
                        fontSize: 10.5,
                        lineHeight: 13,
                        color: '#FFFFFF',
                        opacity: 0.62,
                        marginTop: 2,
                      }}
                    >
                      {program.detail}
                    </HomeText>
                    {pct != null && (
                      <S.ProgressTrack>
                        <S.ProgressFill
                          style={{
                            width: `${pct * 100}%`,
                            backgroundColor: ACCENT_SOLID[program.accent],
                          }}
                        />
                      </S.ProgressTrack>
                    )}
                  </S.BottomGroup>
                </S.CardContent>
              </S.ProgramCard>
            );
          })}
        </S.Cards>
      )}
    </>
  );
}
