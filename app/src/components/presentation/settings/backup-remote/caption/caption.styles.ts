import { type as typeStyle } from '@/styles/theme';
import styled from 'styled-components/native';

// Caption (backup-redesign.md S1): the verbatim audit line, Kinetic brand,
// 14pt medium on the secondary tone.
export const CaptionText = styled.Text`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '500' })}
  color: ${({ theme }) => theme.color.content.secondary};
  margin-left: 24px;
  margin-right: 24px;
  margin-bottom: 20px;
`;
