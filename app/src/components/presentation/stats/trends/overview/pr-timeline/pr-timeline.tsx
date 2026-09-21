import { useId } from 'react';
import {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
  Svg,
} from 'react-native-svg';
import { useTranslate } from '@tolgee/react';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeText } from '@/components/presentation/home/shared/home-text';
import { SampleBadge } from '@/components/presentation/home/shared/sample-badge';
import { TrendsSectionHeader } from '../shared/trends-section-header';
import { PrTimelineItem } from '../trends-overview-data';
import { trendsPalette } from '../trends-colors';
import {
  Medallion,
  NewPill,
  NodeWrap,
  PrRow,
  Spine,
  TextCol,
  TimelineBody,
  ValueCol,
} from './pr-timeline.styles';

/**
 * PR Timeline: the latest five personal records, newest first, on a gold
 * spine. Values are the records' own e1RMs; "Session Volume" style entries
 * are never fabricated — only what the store holds is shown.
 */
export function PrTimeline({
  items,
  newCount,
  sampled,
}: {
  items: PrTimelineItem[];
  newCount: number;
  sampled: boolean;
}) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;
  const palette = trendsPalette(dark);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  return (
    <>
      <TrendsSectionHeader
        label={t('trends.timeline.title')}
        badge={
          sampled ? (
            <SampleBadge compact />
          ) : newCount > 0 ? (
            <NewPill $bg={palette.goldBg}>
              <HomeText
                weight={fontWeight.bold}
                micro
                tracking={0.8}
                style={{ fontSize: 8.5, lineHeight: 11, color: palette.gold }}
              >
                {t('trends.timeline.new_badge', { count: newCount })}
              </HomeText>
            </NewPill>
          ) : undefined
        }
      />
      <HomeCard hero pad={0}>
        {items.length === 0 ? (
          <HomeText
            weight={fontWeight.medium}
            style={{
              fontSize: 12,
              lineHeight: 17,
              color: palette.secondary,
              textAlign: 'center',
              paddingVertical: 40,
            }}
          >
            {t('trends.timeline.empty')}
          </HomeText>
        ) : (
          <TimelineBody>
            <Spine $dark={dark} />
            {items.map((item) => (
              <PrRow key={`${item.dateLabel}-${item.name}`}>
                <NodeWrap>
                  <Medallion>
                    <Svg width={18} height={18} viewBox="0 0 18 18">
                      <Defs>
                        <LinearGradient
                          id={`prGold${uid}`}
                          x1="0.2"
                          y1="0"
                          x2="0.8"
                          y2="1"
                        >
                          <Stop offset="0" stopColor="#FFF0BE" />
                          <Stop offset="1" stopColor="#D9A441" />
                        </LinearGradient>
                      </Defs>
                      <Circle cx={9} cy={9} r={9} fill={`url(#prGold${uid})`} />
                      <Circle
                        cx={9}
                        cy={9}
                        r={9}
                        fill="none"
                        stroke={dark ? '#131316' : '#FFFFFF'}
                        strokeWidth={2.4}
                      />
                      <Path
                        d="M0 -9 L2.23 -3.07 L8.56 -2.78 L3.61 1.17 L5.29 7.28 L0 3.8 L-5.29 7.28 L-3.61 1.17 L-8.56 -2.78 L-2.23 -3.07 Z"
                        fill={palette.goldDeep}
                        transform="translate(9,9) scale(0.44)"
                      />
                    </Svg>
                  </Medallion>
                </NodeWrap>
                <TextCol>
                  <HomeText
                    weight={fontWeight.bold}
                    micro
                    tracking={0.7}
                    numberOfLines={1}
                    style={{
                      fontSize: 8.5,
                      lineHeight: 11,
                      color: palette.secondary,
                    }}
                  >
                    {item.dateLabel}
                  </HomeText>
                  <HomeText
                    weight={fontWeight.semibold}
                    tracking={-0.2}
                    numberOfLines={1}
                    style={{
                      fontSize: 13,
                      lineHeight: 17,
                      marginTop: 4,
                      color: palette.name,
                    }}
                  >
                    {item.name}
                  </HomeText>
                </TextCol>
                <ValueCol>
                  <HomeText
                    weight={fontWeight.bold}
                    tracking={-0.25}
                    tabular
                    numberOfLines={1}
                    style={{
                      fontSize: 13,
                      lineHeight: 17,
                      color: palette.gold,
                    }}
                  >
                    {item.value}
                  </HomeText>
                </ValueCol>
              </PrRow>
            ))}
          </TimelineBody>
        )}
      </HomeCard>
    </>
  );
}
