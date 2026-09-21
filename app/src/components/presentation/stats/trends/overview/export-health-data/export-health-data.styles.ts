import { Pressable } from 'react-native';
import styled from 'styled-components/native';

/** 52pt pill button: translucent fill + hairline stroke, content centered. */
export const ExportButton = styled(Pressable)<{ $dark: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 52px;
  border-radius: 26px;
  background-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.07)' : 'rgba(120,120,128,0.10)')};
  border-width: 1px;
  border-color: ${({ $dark }) => ($dark ? 'rgba(255,255,255,0.12)' : 'rgba(120,120,128,0.18)')};
`;
