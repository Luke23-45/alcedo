import { useAppTheme } from '@/hooks/useAppTheme';
import { ReactNode } from 'react';
import { View } from 'react-native';

interface SplitCardControlProps {
  titleContent: ReactNode;
  mainContent: ReactNode;
  actions?: ReactNode;
}

export default function SplitCardControl(props: SplitCardControlProps) {
  const theme = useAppTheme();
  return (
    <View style={{ gap: theme.space.sm }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: theme.space.base,
        }}
      >
        {props.titleContent}
        <View
          style={{
            flexDirection: 'row',
            marginLeft: theme.space.sm,
            alignItems: 'flex-start',
            marginTop: -theme.space.sm,
            marginRight: -theme.space.sm,
          }}
        >
          {props.actions}
        </View>
      </View>
      <View style={{ paddingRight: theme.space.sm }}>{props.mainContent}</View>
    </View>
  );
}
