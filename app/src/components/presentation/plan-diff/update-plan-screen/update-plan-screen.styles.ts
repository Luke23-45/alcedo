import styled from 'styled-components/native';

export const ScreenContent = styled.View`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 28px;
  gap: 16px;
`;

export const IntroTitle = styled.Text<{ $dark: boolean }>`
  font-size: 24px;
  line-height: 30px;
  font-weight: 700;
  letter-spacing: -0.6px;
  color: ${({ $dark }) => ($dark ? '#FFFFFF' : '#111111')};
`;

export const IntroSubtitle = styled.Text<{ $dark: boolean }>`
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  letter-spacing: -0.2px;
  margin-top: 6px;
  color: ${({ $dark }) => ($dark ? '#98989F' : '#6E6E73')};
`;

export const ModeBlock = styled.View`
  gap: 6px;
`;

/** 11pt consequence line under the segmented control. */
export const ConsequenceLine = styled.Text<{ $dark: boolean }>`
  font-size: 11px;
  line-height: 14px;
  font-weight: 500;
  letter-spacing: -0.2px;
  text-align: center;
  color: ${({ $dark }) => ($dark ? '#86868B' : '#6E6E73')};
`;

export const ReviewHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`;

export const ReviewTitle = styled.Text<{ $dark: boolean }>`
  font-size: 10px;
  line-height: 13px;
  font-weight: 700;
  letter-spacing: 1.35px;
  text-transform: uppercase;
  color: ${({ $dark }) => ($dark ? '#86868B' : '#6E6E73')};
`;

export const SelectedChip = styled.View<{ $dark: boolean }>`
  height: 20px;
  border-radius: 10px;
  padding-left: 8px;
  padding-right: 8px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $dark }) => ($dark ? 'rgba(255,159,10,0.18)' : 'rgba(255,149,0,0.14)')};
`;

export const SelectedChipText = styled.Text<{ $dark: boolean }>`
  font-size: 10px;
  line-height: 13px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: ${({ $dark }) => ($dark ? '#FFB340' : '#B25000')};
`;

export const CardsWrap = styled.View`
  gap: 12px;
`;

export const EmptyState = styled.View`
  align-items: center;
  justify-content: center;
  padding-top: 48px;
  padding-bottom: 48px;
  gap: 12px;
`;

export const EmptyText = styled.Text<{ $dark: boolean }>`
  font-size: 14px;
  line-height: 19px;
  font-weight: 500;
  letter-spacing: -0.2px;
  text-align: center;
  color: ${({ $dark }) => ($dark ? '#86868B' : '#6E6E73')};
`;
