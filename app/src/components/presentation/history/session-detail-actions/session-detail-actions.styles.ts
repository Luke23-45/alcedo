import styled from 'styled-components/native';
import { HomeGradient } from '../../home/shared/home-gradient';

export const ActionsWrap = styled.View`
  gap: 12px;
`;

export const Row = styled.View`
  flex-direction: row;
  gap: 13px;
`;

/** Reference: 174×54, rx27, white@.08 + white@.12 border. */
export const ShareButton = styled.Pressable`
  flex: 1;
  height: 54px;
  border-radius: 27px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)')};
  border-width: 1px;
  border-color: ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)')};
`;

export const ShareLabel = styled.Text`
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: -0.25px;
  color: ${({ theme }) => theme.color.content.primary};
`;

/** Reference: 174×54, rx27, brand gradient + gloss, white@.22 border, #FF2D55 shadow. */
export const EditButton = styled.Pressable`
  flex: 1;
  height: 54px;
  border-radius: 27px;
  overflow: hidden;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  /* Reference: glyph ends ~254, label starts 266. */
  gap: 11px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.22);
  shadow-color: #ff2d55;
  shadow-offset: 0px 7px;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
  elevation: 8;
`;

export const EditFill = styled(HomeGradient).attrs({
  colors: ['#FFB03A', '#FF6A3D', '#FF2D55'] as [string, string, string],
  start: { x: 0, y: 0 },
  end: { x: 0.6, y: 1 },
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const EditGloss = styled(HomeGradient).attrs({
  colors: ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0)'] as [string, string],
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 27px;
`;

export const EditLabel = styled.Text`
  font-size: 15px;
  line-height: 20px;
  /* RN can't render 650 — falls back to 400; 600 is nearest representable. */
  font-weight: 600;
  letter-spacing: -0.25px;
  color: #ffffff;
`;

/** Reference: 361×48, rx24, #FF3B30@.10 fill, @.22 stroke. */
export const DeleteButton = styled.Pressable`
  height: 48px;
  border-radius: 24px;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 59, 48, 0.1);
  border-width: 1px;
  border-color: rgba(255, 59, 48, 0.22);
`;

export const DeleteLabel = styled.Text`
  font-size: 14.5px;
  line-height: 19px;
  font-weight: 600;
  letter-spacing: -0.25px;
  /* Reference: #FF6B60 dark / #D70015 light. */
  color: ${({ theme }) => (theme.isDark ? '#FF6B60' : '#D70015')};
`;
