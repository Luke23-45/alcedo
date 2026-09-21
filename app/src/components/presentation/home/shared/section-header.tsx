import styled from 'styled-components/native';
import { Pressable } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { fontWeight } from '@/styles/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { HomeText } from './home-text';
import { SampleBadge } from './sample-badge';

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${({ theme }) => theme.space.sm}px;
  /* 12pt parent gap + 8pt = 30pt from card bottom to label baseline. */
  margin-top: 8px;
  /* Pull the following content up so it sits 12pt below the baseline. */
  margin-bottom: -2px;
`;

const LabelGroup = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm}px;
`;

const ActionRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 3px;
`;

/**
 * Section header: 10/700/+1.35 uppercase micro-label, optional "See All"
 * action (11.5/600/−0.1 + 1.7pt chevron), optional SAMPLE marker.
 */
export function SectionHeader({
  label,
  actionLabel,
  onAction,
  sample,
}: {
  label: string;
  actionLabel?: string;
  onAction?: () => void;
  sample?: boolean;
}) {
  const theme = useAppTheme();
  const dark = theme.isDark;
  const labelColor = dark ? '#86868B' : '#8E8E93';
  const seeAll = theme.home.seeAll;

  return (
    <Row>
      <LabelGroup>
        <HomeText
          weight={fontWeight.bold}
          micro
          tracking={1.35}
          style={{ fontSize: 10, lineHeight: 12, color: labelColor }}
        >
          {label.toUpperCase()}
        </HomeText>
        {sample ? <SampleBadge /> : null}
      </LabelGroup>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={12} accessibilityRole="button">
          <ActionRow>
            <HomeText
              weight={fontWeight.semibold}
              tracking={-0.1}
              style={{ fontSize: 11.5, lineHeight: 14, color: seeAll }}
            >
              {actionLabel}
            </HomeText>
            <Svg width={7} height={10} viewBox="0 0 7 10">
              <Path
                d="M1.5 1.5 L5.5 5 L1.5 8.5"
                fill="none"
                stroke={seeAll}
                strokeWidth={1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </ActionRow>
        </Pressable>
      ) : null}
    </Row>
  );
}
