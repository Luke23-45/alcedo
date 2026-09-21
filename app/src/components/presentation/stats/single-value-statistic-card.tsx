import Icon from '@/components/presentation/foundation/icon';
import TouchableRipple from '@/components/presentation/foundation/touchable-ripple';
import { AppIconSource } from '@/components/presentation/foundation/ms-icon-source';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ReactNode } from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';

export default function SingleValueStatisticCard(props: {
  title: string;
  value: string | ReactNode;
  icon: AppIconSource;
  onPress?: () => void;
}) {
  const theme = useAppTheme();
  const Wrapper = props.onPress ? TouchableRipple : View;
  return (
    <Card mode="contained" style={{ flex: 1, overflow: 'hidden' }}>
      <Wrapper onPress={props.onPress}>
        <View
          style={{
            gap: theme.space.xs,
            padding: theme.space.base,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.space.sm,
            }}
          >
            <Icon size={16} source={props.icon} color={theme.color.interactive.tint} />
            <Text variant="labelLarge" lineBreakMode="tail" numberOfLines={1}>
              {props.title}
            </Text>
          </View>
          <Text>{props.value}</Text>
        </View>
      </Wrapper>
    </Card>
  );
}
