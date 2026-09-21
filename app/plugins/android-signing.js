const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withAndroidSigningConfig(config, signingConfig) {
  return withAppBuildGradle(config, (config) => {
    config.modResults.contents = config.modResults.contents.replace(
      /signingConfigs \{([\s\S]*?)\}/, // Modify existing signingConfigs without removing debug
      (match) => {
        // EAS-safe: when called as bare string "./plugins/android-signing.js" signingConfig is undefined.
        // Only use explicit signingConfig if it was provided and has a storeFile. Otherwise fall through
        // to the hasProperty-based release block that EAS credentials.json / debug fallback handles.
        const hasExplicitConfig = Boolean(signingConfig?.storeFile);
        if (/release \{/.test(match) && hasExplicitConfig) {
          return match.replace(
            /release \{([\s\S]*?)\}/,
            `release {
              storeFile file('${signingConfig.storeFile}')
              storePassword '${signingConfig.storePassword}'
              keyAlias '${signingConfig.keyAlias}'
              keyPassword '${signingConfig.keyPassword}'
            }`,
          );
        }
        return (
          match.trim() +
          `
        release {
            if (project.hasProperty('ANDROID_UPLOAD_STORE_FILE')) {
                storeFile file(project.property('ANDROID_UPLOAD_STORE_FILE'))
                storePassword project.property('ANDROID_UPLOAD_STORE_PASSWORD')
                keyAlias project.property('ANDROID_UPLOAD_KEY_ALIAS')
                keyPassword project.property('ANDROID_UPLOAD_KEY_PASSWORD')
            }
        }`
        );
      },
    );

    config.modResults.contents = config.modResults.contents.replace(
      /buildTypes \{([\s\S]*?)release \{([\s\S]*?)signingConfig signingConfigs\.debug/, // Ensure release config uses signingConfigs.release
      `buildTypes { $1release { $2if (project.hasProperty('ANDROID_UPLOAD_STORE_FILE')) {
                signingConfig signingConfigs.release
            } else {
                signingConfig signingConfigs.debug
            }
            ndk {
                debugSymbolLevel 'SYMBOL_TABLE'
            }`,
    );

    return config;
  });
};
