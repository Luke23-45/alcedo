import { useTranslate } from '@tolgee/react';
import type { ReactNode } from 'react';
import { Circle, Defs, LinearGradient as SvgGradient, Path, RadialGradient, Stop, Svg } from 'react-native-svg';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeText } from '../shared/home-text';
import { SampleBadge } from '../shared/sample-badge';
import * as S from './coach-card.styles';

const RING_R = 22;
const RECOVERY_PCT = 0.86;

/**
 * Reference coach card: 361×156, gCoachBorder 1.2pt edge, violet/cyan mesh,
 * 34pt gCoach icon, 22pt gCoachRing recovery dial, brand + ghost buttons.
 */
function SparkleGlyph() {
  return (
    <Svg width={11} height={11} viewBox="-5.2 -5.2 10.4 10.4">
      <Path d="M0 -5.2 L1.35 -1.35 L5.2 0 L1.35 1.35 L0 5.2 L-1.35 1.35 L-5.2 0 L-1.35 -1.35 Z" fill="#FFFFFF" />
    </Svg>
  );
}

function MeshGlyph({ dark }: { dark: boolean }) {
  const violet = dark ? '#8E7BFF' : '#8944AB';
  const cyan = dark ? '#2CE9F7' : '#00A6C9';
  return (
    <Svg width="100%" height="100%" viewBox="0 0 361 156" preserveAspectRatio="xMidYMid slice">
      <Defs>
        <RadialGradient id="coachMeshV" cx="320" cy="25" r="150" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={violet} stopOpacity={dark ? 0.3 : 0.16} />
          <Stop offset="1" stopColor={violet} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="coachMeshC" cx="50" cy="150" r="130" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={cyan} stopOpacity={dark ? 0.16 : 0.11} />
          <Stop offset="1" stopColor={cyan} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Path d="M0 0 H361 V156 H0 Z" fill="url(#coachMeshV)" />
      <Path d="M0 0 H361 V156 H0 Z" fill="url(#coachMeshC)" />
    </Svg>
  );
}

function RecoveryRing() {
  const c = 2 * Math.PI * RING_R;
  return (
    <Svg width={54} height={54} viewBox="0 0 54 54">
      <Defs>
        <SvgGradient id="coachRing" x1="0" y1="1" x2="1" y2="0">
          <Stop offset="0" stopColor="#8E7BFF" />
          <Stop offset="1" stopColor="#2CE9F7" />
        </SvgGradient>
      </Defs>
      <Circle cx={27} cy={27} r={RING_R} fill="none" stroke="#FFFFFF" strokeOpacity={0.1} strokeWidth={5} />
      <Circle
        cx={27}
        cy={27}
        r={RING_R}
        fill="none"
        stroke="url(#coachRing)"
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={`${RECOVERY_PCT * c} ${c}`}
        transform="rotate(-90 27 27)"
      />
    </Svg>
  );
}

/**
 * A button slot that is only pressable when a handler is provided — no dead
 * pressables. The visual button stays identical either way.
 */
function ActionSlot({
  onPress,
  label,
  children,
}: {
  onPress?: () => void;
  label: string;
  children: ReactNode;
}) {
  if (onPress) {
    return (
      <S.SlotPressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
        {children}
      </S.SlotPressable>
    );
  }
  return <S.SlotStatic>{children}</S.SlotStatic>;
}

export function CoachCard({ onAdjust, onDismiss }: { onAdjust?: () => void; onDismiss?: () => void }) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;
  const labelColor = dark ? '#A78BFA' : '#8944AB';
  const betaColor = dark ? '#98989F' : '#6E6E73';
  const titleColor = dark ? '#FFFFFF' : '#1C1C1E';
  const bodyColor = dark ? '#98989F' : '#6E6E73';
  const recLabelColor = dark ? '#98989F' : '#AEAEB2';
  const dismissColor = dark ? '#C7C7CC' : '#3A3A3C';

  return (
    <S.BorderLayer
      colors={
        dark
          ? (['rgba(167,139,250,0.55)', 'rgba(44,233,247,0.22)', 'rgba(255,90,200,0.10)'] as const)
          : (['rgba(137,68,171,0.45)', 'rgba(0,166,201,0.22)', 'rgba(255,45,85,0.10)'] as const)
      }
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ borderCurve: 'continuous' }, { minHeight: 156 }]}
    >
      <S.BodyLayer variant="cardBody" style={{ borderCurve: 'continuous' }}>
        <S.MeshLayer pointerEvents="none">
          <MeshGlyph dark={dark} />
        </S.MeshLayer>
        <S.HeaderRow>
          <S.IconBadge
            colors={dark ? (['#8E7BFF', '#FF5AC8'] as const) : (['#7B61FF', '#FF4FB8'] as const)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <S.IconGloss />
            <SparkleGlyph />
          </S.IconBadge>
          <HomeText
            weight={fontWeight.bold}
            micro
            tracking={1.3}
            style={{ fontSize: 9, lineHeight: 11, color: labelColor, marginLeft: 10 }}
          >
            {t('home.coach.label').toLocaleUpperCase() /* en: "KINETIC COACH" */}
          </HomeText>
          <SampleBadge />
          <S.BetaChip>
            <HomeText
              weight={fontWeight.bold}
              micro
              tracking={0.8}
              style={{ fontSize: 9, lineHeight: 11, color: betaColor }}
            >
              {t('home.coach.beta').toLocaleUpperCase() /* en: "BETA" */}
            </HomeText>
          </S.BetaChip>
        </S.HeaderRow>

        <S.BodyRow>
          <S.CopyBlock>
            <HomeText
              weight={fontWeight.semibold}
              tracking={-0.3}
              style={{ fontSize: 17, lineHeight: 21, color: titleColor }}
            >
              {t('home.coach.title') /* en: "You're 86% recovered" */}
            </HomeText>
            <HomeText
              weight={fontWeight.medium}
              numberOfLines={2}
              style={{ fontSize: 12, lineHeight: 15, color: bodyColor, marginTop: 4 }}
            >
              {
                t(
                  'home.coach.body',
                ) /* en: "Swap today's push for a lighter pull session to protect shoulder volume." */
              }
            </HomeText>
          </S.CopyBlock>
          <S.RingWrap>
            <RecoveryRing />
            <S.RingCenter>
              <HomeText
                weight={fontWeight.bold}
                tabular
                tracking={-0.3}
                style={{ fontSize: 12.5, lineHeight: 15, color: titleColor }}
              >
                {t('home.coach.value') /* en: "86%" */}
              </HomeText>
              <HomeText
                weight={fontWeight.bold}
                micro
                tracking={0.6}
                style={{ fontSize: 8, lineHeight: 10, color: recLabelColor }}
              >
                {t('home.coach.unit').toLocaleUpperCase() /* en: "REC" */}
              </HomeText>
            </S.RingCenter>
          </S.RingWrap>
        </S.BodyRow>

        <S.ButtonsRow>
          <ActionSlot onPress={onAdjust} label={t('home.coach.adjust') /* en: "Adjust Plan" */}>
            <S.AdjustButton variant="brand" style={{ borderCurve: 'continuous' }}>
              <S.AdjustGloss />
              <HomeText
                weight={fontWeight.semibold}
                tracking={-0.15}
                style={{ fontSize: 12.5, lineHeight: 16, color: '#FFFFFF' }}
              >
                {t('home.coach.adjust') /* en: "Adjust Plan" */}
              </HomeText>
            </S.AdjustButton>
          </ActionSlot>
          <ActionSlot onPress={onDismiss} label={t('home.coach.dismiss') /* en: "Not now" */}>
            <S.DismissButton>
              <HomeText
                weight={fontWeight.semibold}
                tracking={-0.15}
                style={{ fontSize: 12.5, lineHeight: 16, color: dismissColor }}
              >
                {t('home.coach.dismiss') /* en: "Not now" */}
              </HomeText>
            </S.DismissButton>
          </ActionSlot>
        </S.ButtonsRow>
      </S.BodyLayer>
    </S.BorderLayer>
  );
}
