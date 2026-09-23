import styled from 'styled-components/native';

export const PageScroll = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { flexGrow: 1 },
})`
  flex: 1;
`;

export const PageBody = styled.View`
  flex: 1;
`;

export const CardSlot = styled.View`
  margin-left: 16px;
  margin-right: 16px;
`;

export const BirdWrap = styled.View`
  width: 100%;
`;

export const WelcomeTitlePad = styled.View`
  margin-top: 48px;
`;

export const WelcomeBottomSpacer = styled.View`
  flex: 1;
  min-height: 32px;
`;

export const CardsPad = styled.View`
  margin-top: 24px;
  padding-bottom: 16px;
  row-gap: 12px;
`;
