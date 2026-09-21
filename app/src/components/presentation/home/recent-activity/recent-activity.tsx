import { useTranslate } from '@tolgee/react';
import { Circle, G, Path, Rect, Svg } from 'react-native-svg';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeCard } from '../shared/home-card';
import { HomeText } from '../shared/home-text';
import { SectionHeader } from '../shared/section-header';
import type { RecentActivityItem } from '../use-home-data';
import * as S from './recent-activity.styles';

/**
 * Reference rows: 361×68, rx22, 10pt gaps. 40×40 kind tile (rx14),
 * 14/600/−0.2 title, 11/500 subtitle, 14/700/−0.3 value, 10/500 unit,
 * 1.9pt chevron in #48484A.
 */
function KindGlyph({ kind }: { kind: RecentActivityItem['kind'] }) {
  if (kind === 'legs') {
    // Bent-leg profile, built from the same filled rounded rects as the dumbbell.
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24">
        <G fill="#5EB0FF">
          <Rect x={9} y={3} width={5} height={9} rx={2.5} />
          <Circle cx={11.5} cy={13.2} r={2.7} />
          <Rect x={11} y={12} width={4.6} height={7} rx={2.3} transform="rotate(20 13.3 12)" />
          <Rect x={8.8} y={18.6} width={8.4} height={3.2} rx={1.6} />
        </G>
      </Svg>
    );
  }
  if (kind === 'strength' || kind === 'upper') {
    // Same dumbbell geometry; upper sessions tint purple, everything else stays pink.
    const fill = kind === 'upper' ? '#C77DFF' : '#FF6A88';
    return (
      <Svg width={22} height={14} viewBox="-14 -9 28 18">
        <G fill={fill}>
          <Rect x={-13} y={-5.6} width={4.4} height={11.2} rx={1.8} />
          <Rect x={-7.6} y={-8} width={3.8} height={16} rx={1.7} />
          <Rect x={-7.6} y={-1.9} width={15.2} height={3.8} rx={0.6} />
          <Rect x={3.8} y={-8} width={3.8} height={16} rx={1.7} />
          <Rect x={8.6} y={-5.6} width={4.4} height={11.2} rx={1.8} />
        </G>
      </Svg>
    );
  }
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" fill="#4ADE80" />
    </Svg>
  );
}

function ChevronGlyph() {
  return (
    <Svg width={8} height={12} viewBox="354 1446 10 12">
      <Path
        d="M357 1448 L361 1452 L357 1456"
        fill="none"
        stroke="#48484A"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function RecentActivitySection({ items, onSeeAll }: { items: RecentActivityItem[]; onSeeAll: () => void }) {
  const { t } = useTranslate();
  const theme = useAppTheme();
  const dark = theme.isDark;
  const titleColor = dark ? '#FFFFFF' : '#1C1C1E';
  const subtitleColor = dark ? '#86868B' : '#8E8E93';
  const unitColor = dark ? '#6C6C70' : '#AEAEB2';

  return (
    <>
      <SectionHeader
        label={t('home.recent_activity.label') /* en: "Recent Activity" */}
        actionLabel={t('home.recent_activity.see_all') /* en: "See All" */}
        onAction={onSeeAll}
      />
      {items.length === 0 ? (
        <S.EmptyBox>
          <HomeText variant="footnote" tone="secondary">
            {t('home.recent_activity.empty') /* en: "No recent activity yet." */}
          </HomeText>
        </S.EmptyBox>
      ) : (
        <S.List>
          {items.map((item) => (
            <HomeCard key={item.id} radius={22} pad={14} style={{ height: 68 }}>
              <S.RowInner>
                <S.Tile $kind={item.kind}>
                  <KindGlyph kind={item.kind} />
                </S.Tile>
                <S.Middle>
                  <HomeText
                    weight={fontWeight.semibold}
                    tracking={-0.2}
                    numberOfLines={1}
                    style={{ fontSize: 14, lineHeight: 18, color: titleColor }}
                  >
                    {item.title}
                  </HomeText>
                  <HomeText
                    weight={fontWeight.medium}
                    numberOfLines={1}
                    style={{ fontSize: 11, lineHeight: 14, color: subtitleColor, marginTop: 2 }}
                  >
                    {item.subtitle}
                  </HomeText>
                </S.Middle>
                <S.ValueBlock>
                  <HomeText
                    weight={fontWeight.bold}
                    tabular
                    tracking={-0.3}
                    numberOfLines={1}
                    style={{ fontSize: 14, lineHeight: 18, color: titleColor }}
                  >
                    {item.value}
                  </HomeText>
                  <HomeText
                    weight={fontWeight.medium}
                    numberOfLines={1}
                    style={{ fontSize: 10, lineHeight: 13, color: unitColor, marginTop: 1 }}
                  >
                    {item.unit}
                  </HomeText>
                </S.ValueBlock>
                <ChevronGlyph />
              </S.RowInner>
            </HomeCard>
          ))}
        </S.List>
      )}
    </>
  );
}
