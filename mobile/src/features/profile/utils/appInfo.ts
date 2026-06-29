import Constants from 'expo-constants';
import { Platform } from 'react-native';

export function getAppVersion(): string {
  return Constants.expoConfig?.version ?? '1.0.0';
}

export function getAppBuildNumber(): string {
  return (
    Constants.nativeBuildVersion ??
    Constants.expoConfig?.ios?.buildNumber ??
    Constants.expoConfig?.android?.versionCode?.toString() ??
    '—'
  );
}

export function getAppPlatformLabel(): string {
  if (Platform.OS === 'ios') {
    return 'iOS';
  }

  if (Platform.OS === 'android') {
    return 'Android';
  }

  return Platform.OS;
}

/** Compact label used in the About card. */
export function getAppVersionLabel(): string {
  const build = getAppBuildNumber();
  return build !== '—'
    ? `Version ${getAppVersion()} (${build})`
    : `Version ${getAppVersion()}`;
}
