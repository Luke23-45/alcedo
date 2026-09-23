import styled from 'styled-components/native';
import { HomeCard } from '@/components/presentation/home/shared/home-card';
import { HomeGradient } from '@/components/presentation/home/shared/home-gradient';

export const ImportPage = styled.View`
  padding-horizontal: 16px;
  padding-top: 12px;
  padding-bottom: 32px;
  gap: 12px;
`;

export const ParserCard = styled(HomeCard).attrs({ radius: 30, pad: 20 })``;

export const ParserHeaderRow = styled.View`
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const PastedLabel = styled.Text`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: ${({ theme }) => (theme.isDark ? '#86868B' : '#8E8E93')};
`;

export const SourceCaption = styled.Text`
  font-size: 10px;
  font-weight: 500;
  color: ${({ theme }) => (theme.isDark ? '#6C6C70' : '#8E8E93')};
`;

export const PasteBox = styled.View`
  border-radius: 16px;
  border-width: 0.9px;
  min-height: 152px;
  max-height: 260px;
  padding: 12px;
  margin-bottom: 16px;
  ${({ theme }) =>
    theme.isDark
      ? `
          background-color: rgba(0, 0, 0, 0.35);
          border-color: rgba(255, 255, 255, 0.06);
        `
      : `
          background-color: rgba(0, 0, 0, 0.03);
          border-color: rgba(0, 0, 0, 0.08);
        `}
`;

export const StatusRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

export const StatusCheck = styled.View`
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background-color: #30d158;
  align-items: center;
  justify-content: center;
`;

export const StatusText = styled.Text<{ $ok: boolean }>`
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: -0.15px;
  color: ${({ $ok }) => ($ok ? '#4ADE80' : '#FF9F0A')};
`;

export const RecognizedList = styled.View`
  gap: 20px;
  margin-bottom: 20px;
`;

export const RecognizedRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const RecognizedName = styled.Text`
  flex: 1;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const RecognizedNote = styled.Text<{ $ok: boolean }>`
  font-size: 10px;
  font-weight: 500;
  margin-top: 3px;
  color: ${({ theme, $ok }) => ($ok ? '#30D158' : theme.isDark ? '#FF9F0A' : '#C93400')};
`;

export const RecognizedSets = styled.Text`
  flex-shrink: 0;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: -0.1px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const PasteButtonLabel = styled.Text`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.1px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const PasteButton = styled.View`
  align-self: flex-start;
  padding-horizontal: 14px;
  height: 36px;
  border-radius: 18px;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  border-width: 1px;
  margin-bottom: 12px;
  ${({ theme }) =>
    theme.isDark
      ? `
          background-color: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 255, 255, 0.1);
        `
      : `
          background-color: rgba(0, 0, 0, 0.04);
          border-color: rgba(0, 0, 0, 0.08);
        `}
`;

export const SubmitButton = styled(HomeGradient).attrs({ variant: 'brand' })`
  height: 50px;
  border-radius: 25px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.22);
  overflow: hidden;
  shadow-color: #ff2d55;
  shadow-offset: 0px 7px;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
  elevation: 6;
`;

export const SubmitLabel = styled.Text`
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: #ffffff;
`;
