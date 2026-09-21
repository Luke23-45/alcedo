import styled, { css } from 'styled-components/native';
import type { ChangeTitleTone, DeltaChipTone } from '../plan-diff-logic';

export type ReviewCardTone = 'neutral' | 'added' | 'removed' | 'modified';

// ============================================================================
// Card shell
// ============================================================================

export const Card = styled.View<{ $tone: ReviewCardTone; $dark: boolean }>`
  border-radius: 24px;
  border-width: 1px;
  padding-top: 14px;
  padding-bottom: 6px;
  ${({ $tone, $dark }) => {
    switch ($tone) {
      case 'added':
        return css`
          background-color: ${$dark ? 'rgba(48,209,88,0.12)' : 'rgba(48,209,88,0.10)'};
          border-color: ${$dark ? 'rgba(48,209,88,0.25)' : 'rgba(48,209,88,0.28)'};
        `;
      case 'removed':
        return css`
          background-color: ${$dark ? 'rgba(255,69,58,0.12)' : 'rgba(255,59,48,0.08)'};
          border-color: ${$dark ? 'rgba(255,69,58,0.25)' : 'rgba(255,59,48,0.25)'};
        `;
      case 'modified':
        return css`
          background-color: ${$dark ? 'rgba(255,159,10,0.12)' : 'rgba(255,149,0,0.10)'};
          border-color: ${$dark ? 'rgba(255,159,10,0.25)' : 'rgba(255,149,0,0.30)'};
        `;
      case 'neutral':
      default:
        return css`
          background-color: ${$dark ? 'rgba(255,255,255,0.06)' : '#FFFFFF'};
          border-color: ${$dark ? 'rgba(255,255,255,0.08)' : '#E5E5EA'};
        `;
    }
  }}
`;

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 4px;
`;

export const MicroLabel = styled.Text<{ $tone: ReviewCardTone; $dark: boolean }>`
  font-size: 10px;
  line-height: 13px;
  font-weight: 700;
  letter-spacing: 1.35px;
  text-transform: uppercase;
  color: ${({ $tone, $dark }) => {
    switch ($tone) {
      case 'added':
        return $dark ? '#4ADE80' : '#248A3D';
      case 'removed':
        return $dark ? '#FF6B60' : '#D70015';
      case 'modified':
        return $dark ? '#FFB340' : '#B25000';
      case 'neutral':
      default:
        return '#8E8E93';
    }
  }};
`;

export const HeaderCount = styled.Text`
  font-size: 10px;
  line-height: 13px;
  font-weight: 500;
  letter-spacing: 0.2px;
  color: #86868b;
`;

export const RowSeparator = styled.View<{ $dark: boolean }>`
  height: 1px;
  margin-left: 16px;
  margin-right: 16px;
  background-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.06)' : '#F2F2F7')};
`;

// ============================================================================
// Change row
// ============================================================================

export const Row = styled.Pressable`
  min-height: 64px;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 10px;
  padding-bottom: 10px;
  gap: 12px;
`;

export const RowTexts = styled.View`
  flex: 1;
`;

export const RowTitle = styled.Text<{ $tone: ChangeTitleTone; $dark: boolean }>`
  font-size: 13.5px;
  line-height: 18px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ $tone, $dark }) => {
    switch ($tone) {
      case 'added':
        return $dark ? '#4ADE80' : '#248A3D';
      case 'removed':
        return $dark ? '#FF6B60' : '#D70015';
      case 'default':
      default:
        return $dark ? '#FFFFFF' : '#111111';
    }
  }};
`;

export const RowDescription = styled.Text`
  font-size: 10.5px;
  line-height: 14px;
  font-weight: 500;
  letter-spacing: -0.2px;
  color: #86868b;
  margin-top: 3px;
`;

export const TransitionRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 3px;
`;

export const OldValue = styled.Text<{ $dark: boolean }>`
  font-size: 10.5px;
  line-height: 14px;
  font-weight: 500;
  color: ${({ $dark }) => ($dark ? '#6C6C70' : '#AEAEB2')};
`;

export const TransitionArrow = styled.Text<{ $dark: boolean }>`
  font-size: 10px;
  line-height: 14px;
  font-weight: 500;
  color: ${({ $dark }) => ($dark ? '#48484A' : '#AEAEB2')};
  margin-left: 4px;
  margin-right: 4px;
`;

export const NewValueText = styled.Text<{ $dark: boolean }>`
  font-size: 10.5px;
  line-height: 14px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ $dark }) => ($dark ? '#FFFFFF' : '#111111')};
`;

// ============================================================================
// Delta chip + locked state
// ============================================================================

export const DeltaChip = styled.View<{ $tone: DeltaChipTone; $dark: boolean }>`
  height: 20px;
  border-radius: 10px;
  padding-left: 7px;
  padding-right: 7px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $tone, $dark }) => {
    switch ($tone) {
      case 'added':
        return $dark ? 'rgba(48,209,88,0.18)' : 'rgba(48,209,88,0.14)';
      case 'removed':
        return $dark ? 'rgba(255,69,58,0.18)' : 'rgba(255,59,48,0.12)';
      case 'modified':
        return $dark ? 'rgba(255,159,10,0.18)' : 'rgba(255,149,0,0.14)';
    }
  }};
`;

export const DeltaText = styled.Text<{ $tone: DeltaChipTone; $dark: boolean }>`
  font-size: 9.5px;
  line-height: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${({ $tone, $dark }) => {
    switch ($tone) {
      case 'added':
        return $dark ? '#4ADE80' : '#248A3D';
      case 'removed':
        return $dark ? '#FF6B60' : '#D70015';
      case 'modified':
        return $dark ? '#FFB340' : '#B25000';
    }
  }};
`;

export const LockedBox = styled.View<{ $dark: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 7px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.08)' : 'rgba(120,120,128,0.12)')};
`;

export const AlwaysTag = styled.View<{ $dark: boolean }>`
  height: 20px;
  border-radius: 10px;
  padding-left: 7px;
  padding-right: 7px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $dark }) => ($dark ? 'rgba(142,142,147,0.18)' : 'rgba(142,142,147,0.16)')};
`;

export const AlwaysText = styled.Text`
  font-size: 9.5px;
  line-height: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #8e8e93;
`;

// ============================================================================
// Exercise group header (modified card)
// ============================================================================

export const GroupHeader = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 2px;
`;

export const GroupName = styled.Text<{ $dark: boolean }>`
  font-size: 13px;
  line-height: 17px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ $dark }) => ($dark ? '#FFFFFF' : '#111111')};
`;
