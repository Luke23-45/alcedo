import { Loader } from '@/components/presentation/foundation/loader';
import { SurfaceText } from '@/components/presentation/foundation/surface-text';
import { RemoteData } from '@/models/remote';
import { ReactNode } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-paper';
import Button from '@/components/presentation/foundation/button';

/** Vertical rhythm for the error chrome (spacing[4] on the 4pt grid). */
const ERROR_GAP = 16;

interface RemoteProps<T> {
  value: RemoteData<T>;
  retry?: () => void;
  success: (value: T) => ReactNode;
  loading?: () => ReactNode;
  notAsked?: () => ReactNode;
  error?: (err: unknown) => ReactNode;
}

/** The default error chrome, exported so callers can reuse it for the errors they don't handle. */
export function RemoteDefaultError({ value, retry }: { value: unknown; retry?: () => void }) {
  return (
    <View style={{ alignItems: 'center', gap: ERROR_GAP }}>
      <Icon source={'error'} size={30} />
      <View style={{ justifyContent: 'center' }}>
        <SurfaceText style={{ textAlign: 'center' }}>{typeof value === 'string' ? value : 'Unknown error'}</SurfaceText>
        {retry ? <Button onPress={retry}>Retry</Button> : undefined}
      </View>
    </View>
  );
}

export function Remote<T>(props: RemoteProps<T>) {
  const { success, retry } = props;
  let { error, loading, notAsked } = props;
  loading ??= () => <Loader />;
  notAsked ??= loading;
  error ??= (value) => <RemoteDefaultError value={value} retry={retry} />;
  return props.value.match({
    notAsked,
    loading,
    error,
    success,
  });
}
