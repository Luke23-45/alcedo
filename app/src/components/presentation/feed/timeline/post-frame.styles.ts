import styled from 'styled-components/native';
import { HAIRLINE, INK_BODY, INK_META, INK_TITLE } from './timeline-tokens';

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 14px;
  padding-left: 12px;
`;

export const NameCol = styled.View`
  flex: 1;
  height: 36px;
  justify-content: center;
  margin-left: 10px;
`;

export const NameRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Name = styled.Text<{ $dark: boolean }>`
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ $dark }) => ($dark ? INK_TITLE.dark : INK_TITLE.light)};
`;

export const BadgeWrap = styled.View`
  margin-left: 8px;
`;

export const Meta = styled.Text<{ $dark: boolean }>`
  font-size: 10.5px;
  font-weight: 500;
  margin-top: 3px;
  color: ${({ $dark }) => ($dark ? INK_META.dark : INK_META.light)};
`;

/**
 * Positions the 44×44 menu trigger so the dots land on the spec mark: group
 * centre 21pt from the card's right edge, cy on the header midline (32pt from
 * the card top). The negative margins keep the trigger's layout box on the
 * 36pt header row while the 44pt touch target stays centred on it.
 */
export const MenuWrap = styled.View`
  margin-left: auto;
  margin-right: -2px;
  margin-top: -6px;
  margin-bottom: -6px;
  justify-content: center;
`;

export const PosterWrap = styled.View`
  margin-top: 8px;
  margin-left: 15px;
  margin-right: 15px;
`;

export const Caption = styled.Text<{ $dark: boolean }>`
  font-size: 13px;
  font-weight: 500;
  line-height: 17px;
  margin-top: 12px;
  margin-left: 20px;
  margin-right: 20px;
  color: ${({ $dark }) => ($dark ? INK_BODY.dark : INK_BODY.light)};
`;

export const KudosWrap = styled.View`
  margin-top: 12px;
  margin-left: 9px;
  margin-right: 20px;
`;

export const Hairline = styled.View<{ $dark: boolean }>`
  height: 1px;
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 20px;
  background-color: ${({ $dark }) => ($dark ? HAIRLINE.dark : HAIRLINE.light)};
`;
