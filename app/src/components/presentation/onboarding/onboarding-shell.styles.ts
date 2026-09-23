import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ShellSafeArea = styled(SafeAreaView)`
  flex: 1;
`;

export const DotsGap = styled.View`
  flex: 0.25;
  min-height: 56px;
  max-height: 110px;
`;

export const FooterPad = styled.View`
  padding-bottom: 12px;
`;
