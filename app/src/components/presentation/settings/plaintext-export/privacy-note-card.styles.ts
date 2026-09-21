import styled from 'styled-components/native';
import { type as typeStyle } from '@/styles/theme';

// The amber plaintext-health-data note (S4, backup-redesign.md §4): lock
// icon beside a two-tone amber body. No section label.
export const PrivacyWrap = styled.View`
  margin-bottom: 16px;
`;

export const PrivacyRow = styled.View`
  flex-direction: row;
  gap: 12px;
  align-items: flex-start;
`;

export const LockIconWrap = styled.View`
  margin-top: 1px;
`;

export const PrivacyBody = styled.Text`
  ${({ theme }) => typeStyle(theme, 'subheadline', { weight: '500' })}
  font-size: 11.5px;
  line-height: 16px;
  flex: 1;
`;

/** "This is plaintext health data handed to the" — #FFD8A8 per the mock. */
export const PrivacyLead = styled.Text`
  color: #ffd8a8;
`;

/** "OS share sheet. Any receiving app can read it." — #C9A47A per the mock. */
export const PrivacyRest = styled.Text`
  color: #c9a47a;
`;
