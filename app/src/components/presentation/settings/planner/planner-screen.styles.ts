import styled from 'styled-components/native';

export const PlannerPage = styled.View`
  padding-horizontal: 16px;
  padding-top: 12px;
  padding-bottom: 32px;
  gap: 12px;
`;

export const ChatRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const ChatIconWell = styled.View`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const ChatRowText = styled.View`
  flex: 1;
`;

export const ChatRowTitle = styled.Text`
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.2px;
  color: ${({ theme }) => theme.color.content.primary};
`;

export const ChatRowCaption = styled.Text`
  font-size: 12px;
  font-weight: 400;
  margin-top: 1px;
  color: ${({ theme }) => theme.color.content.secondary};
`;
