import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

// What's-new entry card: the backup-screen card language (rx28), entry tile
// 40×40 rx14 (translucent hue well, like the settings icon wells), title
// 15/600, body 13/400, accent CTA row.
export const EntryTile = styled.View<{ $well: string }>`
  width: 40px;
  height: 40px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $well }) => $well};
`;

export const EntryHeader = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 18px;
  padding-left: 20px;
  padding-right: 20px;
`;

export const EntryTitle = styled.Text`
  flex: 1;
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '600' })}
  font-size: 15px;
  letter-spacing: -0.3px;
  color: ${({ theme }) => theme.color.content.primary};
  margin-left: 14px;
  margin-right: 10px;
`;

export const EntryBody = styled.Text`
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '400' })}
  color: ${({ theme }) => theme.color.content.secondary};
  padding-top: 12px;
  padding-left: 20px;
  padding-right: 20px;
`;

export const EntryCta = styled.Pressable`
  min-height: 48px;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 14px;
  margin-top: 4px;
`;

export const EntryCtaText = styled.Text`
  flex: 1;
  ${({ theme }) => typeStyle(theme, 'footnote', { weight: '600' })}
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.home.seeAll};
`;
