const path = require('path');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('sql');
// Keep package.json exports enabled (default in RN 0.79+) for @expo/material-symbols which uses "./*.xml" exports
// react-native-screens 4.26 is patched via patches/react-native-screens+4.26.2.patch to use lib/commonjs instead of src/index

// Spec/test files live under src/app (e.g. share-request-simulation.spec.ts) and would
// otherwise be bundled as routes in dev, pulling vitest -> vite -> `import(filepath)` which
// Metro cannot parse. Prod export happens to exclude them; dev does not — so block them here.
config.resolver.blockList = [
  /.*\.spec\..*/,
  /.*\/__test__\/.*/,
  /.*\/__tests__\/.*/,
  /\/test\/.*/,
];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'crypto') {
    // when importing crypto, resolve to react-native-quick-crypto
    return context.resolveRequest(context, 'react-native-quick-crypto', platform);
  }
  if (moduleName === 'styled-components/native') {
    // Force the native entry — Metro's package-exports fallback can resolve the
    // web entry which touches `document` at top level.
    return context.resolveRequest(context, 'styled-components/native/dist/styled-components.native.cjs.js', platform);
  }
  if (moduleName === 'styled-components') {
    return context.resolveRequest(context, 'styled-components/native/dist/styled-components.native.cjs.js', platform);
  }
  // otherwise chain to the standard Metro resolver.
  return context.resolveRequest(context, moduleName, platform);
};

let outConfig = wrapWithReanimatedMetroConfig(config);
// Re-apply polyfill after wrap — the wrapper clones/overrides serializer.
const existingGetPolyfills = outConfig.serializer.getPolyfills;
outConfig.serializer.getPolyfills = (ctx) => {
  const base = existingGetPolyfills ? existingGetPolyfills(ctx) : [];
  const shim = path.resolve(__dirname, 'polyfills/styled-shim.js');
  return base.includes(shim) ? base : [shim, ...base];
};

module.exports = outConfig;
