import styled from 'styled-components/native';

export const Backdrop = styled.Pressable`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.45);
`;

export const SheetWrap = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 86%;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  overflow: hidden;
  border-top-width: 1px;
  border-left-width: 1px;
  border-right-width: 1px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)')};
`;

export const Grabber = styled.View`
  width: 36px;
  height: 5px;
  border-radius: 2.5px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)')};
  align-self: center;
  margin-top: 10px;
  margin-bottom: 6px;
`;

export const SheetHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 6px 20px 12px;
`;

export const SheetBody = styled.View`
  padding: 0 20px;
  gap: 18px;
`;

export const SearchBox = styled.View`
  flex-direction: row;
  align-items: center;
  height: 44px;
  border-radius: 12px;
  padding-horizontal: 12px;
  background-color: ${({ theme }) => theme.color.fill.secondary};
  gap: 8px;
`;

export const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 15px;
  color: ${({ theme }) => theme.color.content.primary};
  padding: 0;
`;

export const ClearQuery = styled.Pressable`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
`;

export const ChipWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

export const Chip = styled.Pressable<{ $selected: boolean }>`
  min-height: 44px;
  padding-horizontal: 14px;
  padding-vertical: 10px;
  border-radius: 22px;
  border-width: 1px;
  align-items: center;
  justify-content: center;
  background-color: ${({ $selected }) => ($selected ? 'rgba(255,159,10,0.14)' : 'rgba(255,255,255,0.06)')};
  border-color: ${({ $selected }) => ($selected ? 'rgba(255,159,10,0.4)' : 'rgba(255,255,255,0.1)')};
`;

export const ToggleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
`;

export const SheetFooter = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px 20px;
`;

export const ClearButton = styled.Pressable`
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 12px;
`;

export const DoneButton = styled.Pressable`
  min-height: 48px;
  padding-horizontal: 28px;
  border-radius: 24px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  shadow-color: #ff2d55;
  shadow-offset: 0px 7px;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
  elevation: 8;
`;
