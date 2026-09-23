import Svg, { Defs, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store';
import { selectSessions } from '@/store/stored-sessions';
import { setPlannerEnabled } from '@/store/settings';
import { useTranslate } from '@tolgee/react';
import { settingsKey } from '@/components/presentation/settings/shared/settings-i18n';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';
import { SettingsSwitch } from './settings-switch';
import {
  BetaBadge,
  BetaBadgeText,
  CoachBody,
  CoachCaption,
  CoachEdge,
  CoachIcon,
  CoachRight,
  CoachText,
  CoachTitle,
} from './coach-header.styles';

/**
 * The planner's hero card: violet mark, "ALCEDO Planner", the live session
 * count it learns from, a BETA badge, and the master enable switch.
 */
export function CoachHeader() {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const enabled = useAppSelector((s) => s.settings.plannerEnabled);
  const sessionCount = Object.keys(useAppSelector(selectSessions)).length;

  return (
    <CoachEdge>
      <CoachBody>
        {/* Violet aura, top-right of the card (spec mV). */}
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 360 100"
          preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <Defs>
            <RadialGradient id="coachAura" cx="88%" cy="20%" r="45%">
              <Stop offset="0%" stopColor="#8E7BFF" stopOpacity={0.26} />
              <Stop offset="100%" stopColor="#8E7BFF" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x={0} y={0} width={360} height={100} fill="url(#coachAura)" />
        </Svg>
        <CoachIcon>
          <HomeGradient
            variant="gloss"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 20, opacity: 0.45 }}
          />
          <Svg width={22} height={22} viewBox="-6 -6 12 12">
            <Path d="M0 -5.2 L1.35 -1.35 L5.2 0 L1.35 1.35 L0 5.2 L-1.35 1.35 L-5.2 0 L-1.35 -1.35 Z" fill="#FFFFFF" />
          </Svg>
        </CoachIcon>
        <CoachText>
          <CoachTitle numberOfLines={1}>{t(settingsKey('settings.planner.title'))}</CoachTitle>
          <CoachCaption numberOfLines={2}>
            {t(settingsKey('settings.planner.sessions_learned.caption'), { count: sessionCount })}
          </CoachCaption>
        </CoachText>
        <CoachRight>
          <BetaBadge>
            <BetaBadgeText>{t(settingsKey('settings.planner.beta.badge'))}</BetaBadgeText>
          </BetaBadge>
          <SettingsSwitch
            value={enabled}
            onValueChange={(value) => dispatch(setPlannerEnabled(value))}
            accessibilityLabel={t(settingsKey('settings.planner.enabled.label'))}
            testID="planner-enabled-switch"
          />
        </CoachRight>
      </CoachBody>
    </CoachEdge>
  );
}
