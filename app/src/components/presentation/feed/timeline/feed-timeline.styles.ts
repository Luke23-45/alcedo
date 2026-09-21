import styled from 'styled-components/native';
import { INK_META, INK_TITLE } from './timeline-tokens';

export const Screen = styled.View`
  flex: 1;
`;

export const HeaderWrap = styled.View`
  padding-top: 12px;
  padding-bottom: 12px;
`;

export const ChipsWrap = styled.View`
  margin-top: 12px;
`;

export const Separator = styled.View`
  height: 12px;
`;

export const EmptyWrap = styled.View`
  align-items: center;
  padding-top: 56px;
  padding-left: 48px;
  padding-right: 48px;
`;

export const EmptyTitle = styled.Text<{ $dark: boolean }>`
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.4px;
  text-align: center;
  color: ${({ $dark }) => ($dark ? INK_TITLE.dark : INK_TITLE.light)};
`;

export const EmptyBody = styled.Text<{ $dark: boolean }>`
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  text-align: center;
  margin-top: 8px;
  color: ${({ $dark }) => ($dark ? INK_META.dark : INK_META.light)};
`;
