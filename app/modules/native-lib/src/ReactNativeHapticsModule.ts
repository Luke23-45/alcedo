import { NativeModule, requireNativeModule } from 'expo';
import { Platform, Vibration } from 'react-native';

declare class ReactNativeHapticsModule extends NativeModule {
  triggerSlowRiseHaptic(): void;
  triggerClickHaptic(): void;
  cancelHaptic(): void;
}

type HapticsApi = Pick<ReactNativeHapticsModule, 'triggerSlowRiseHaptic' | 'triggerClickHaptic' | 'cancelHaptic'>;

/**
 * Core vibration works everywhere with no custom native code, so a binary
 * that predates `AlcedoHaptics` still clicks — it just can't do the slow
 * rise. Haptics are pure enhancement; they must never crash a route.
 */
function loadHapticsModule(): HapticsApi {
  if (Platform.OS === 'web') {
    return {
      triggerClickHaptic() {
        try {
          Vibration.vibrate(50);
        } catch {}
      },
      triggerSlowRiseHaptic() {},
      cancelHaptic() {},
    };
  }
  try {
    return requireNativeModule<ReactNativeHapticsModule>('AlcedoHaptics');
  } catch {
    return {
      triggerClickHaptic() {
        try {
          Vibration.vibrate(50);
        } catch {}
      },
      triggerSlowRiseHaptic() {},
      cancelHaptic() {},
    };
  }
}

const module = loadHapticsModule();

export const triggerSlowRiseHaptic = () => {
  module.triggerSlowRiseHaptic();
};

export const triggerClickHaptic = () => {
  module.triggerClickHaptic();
};

export const cancelHaptic = () => {
  module.cancelHaptic();
};
