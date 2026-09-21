import styled from 'styled-components/native';
import { fontWeight } from '@/styles/theme';
import { HomeText } from './home-text';

const Badge = styled.View`
  padding-horizontal: ${({ theme }) => theme.space.xs}px;
  padding-vertical: 2px;
  border-radius: ${({ theme }) => theme.radius.full}px;
  border-width: ${({ theme }) => theme.borderWidth.thin}px;
  border-color: ${({ theme }) => theme.color.border.strong};
`;

/**
 * Marks a section whose numbers are illustrative placeholders, not live data.
 * The app has no health-data import (heart rate, steps, hydration, macros), so
 * those sections must never read as synced.
 */
export function SampleBadge({ compact }: { compact?: boolean }) {
  return (
    <Badge style={compact ? { paddingHorizontal: 6, paddingVertical: 1 } : undefined}>
      <HomeText
        variant="caption2"
        tone="tertiary"
        weight={fontWeight.semibold}
        micro
        style={compact ? { fontSize: 8, lineHeight: 10 } : undefined}
      >
        Sample
      </HomeText>
    </Badge>
  );
}
