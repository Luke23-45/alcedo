import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

// "CSV · what's in the file" (S4, backup-redesign.md §4): one card holding the
// literal column list in a code well plus the honest caveats below it. The
// column names are file-format literals, intentionally not translated.
export const WhatsInFileWrap = styled.View`
  margin-bottom: 16px;
`;

/** Inner micro-labels ("COLUMNS · …", "HONEST CAVEATS") — 9pt/700, tracking +1.2. */
export const InnerLabel = styled.Text`
  ${({ theme }) => typeStyle(theme, 'caption2', { weight: '700' })}
  font-size: 9px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.content.secondary};
  margin-bottom: 8px;
`;

export const CodeWell = styled.View`
  border-radius: 14px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.03)')};
  border-width: 0.9px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.08)')};
  padding: 16px;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

export const ColumnName = styled.Text`
  ${({ theme }) => {
    const t = typeStyle(theme, 'caption1', { weight: '600' });
    return { ...t, fontFamily: theme.font.mono, fontSize: 10.5, lineHeight: 20 };
  }}
  color: ${({ theme }) => theme.color.content.secondary};
  width: 33.33%;
`;

/** "Weight = raw stored value…" — 11.5pt medium, primary ink. */
export const CaveatLead = styled.Text`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '500' })}
  font-size: 11.5px;
  line-height: 16px;
  color: ${({ theme }) => theme.color.content.primary};
`;

/** "Bodyweight exercises show only…" — 11.5pt medium, secondary ink. */
export const CaveatRest = styled.Text`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '500' })}
  font-size: 11.5px;
  line-height: 16px;
  color: ${({ theme }) => theme.color.content.secondary};
  margin-top: 8px;
`;
