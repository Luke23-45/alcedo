import { useAppTheme } from '@/hooks/useAppTheme';
import { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';

export function TitledSection(props: {
  title: string;
  style?: ViewStyle;
  titleRight?: ReactNode;
  children: ReactNode;
}) {
  const theme = useAppTheme();
  return (
    <View
      style={[
        {
          marginHorizontal: theme.layout.screenPadding,
        },
        props.style,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text variant="titleMedium" style={{ marginBottom: theme.space.sm }}>
          {props.title}
        </Text>
        {props.titleRight}
      </View>
      {props.children}
    </View>
  );
}
