import { Alert, Linking } from 'react-native';

import { env } from '../../../config/env';
import { getAppBuildNumber, getAppPlatformLabel, getAppVersion } from './appInfo';

export type FeedbackType = 'bug' | 'feature' | 'general';

/** Must match Google Form dropdown options exactly (case-sensitive). */
const FEEDBACK_TYPE_LABELS: Record<FeedbackType, string> = {
  bug: 'bug report',
  feature: 'Add Feature',
  general: 'GeneralFeedback',
};

const CONFIRMATION_MESSAGE =
  'Thanks for helping improve Memora. Your feedback helps us prioritize fixes and new features.';

function appendPrefillParams(url: string, type: FeedbackType): string {
  const params = new URLSearchParams();

  if (env.feedbackFormEntryType) {
    params.set(`entry.${env.feedbackFormEntryType}`, FEEDBACK_TYPE_LABELS[type]);
  }

  if (env.feedbackFormEntryVersion) {
    params.set(`entry.${env.feedbackFormEntryVersion}`, getAppVersion());
  }

  if (env.feedbackFormEntryPlatform) {
    params.set(
      `entry.${env.feedbackFormEntryPlatform}`,
      `${getAppPlatformLabel()} (build ${getAppBuildNumber()})`,
    );
  }

  if ([...params.keys()].length === 0) {
    return url;
  }

  params.set('usp', 'pp_url');
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
}

export function buildFeedbackFormUrl(type: FeedbackType): string | null {
  if (!env.feedbackFormUrl) {
    return null;
  }

  return appendPrefillParams(env.feedbackFormUrl, type);
}

async function openFeedbackUrl(url: string): Promise<void> {
  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    Alert.alert('Unable to open form', 'Could not open the feedback form in your browser.');
    return;
  }

  await Linking.openURL(url);
}

export function promptOpenFeedbackForm(type: FeedbackType): void {
  const url = buildFeedbackFormUrl(type);
  if (!url) {
    Alert.alert(
      'Feedback unavailable',
      'The feedback form URL is not configured. Set EXPO_PUBLIC_FEEDBACK_FORM_URL in your environment.',
    );
    return;
  }

  Alert.alert('Open feedback form?', CONFIRMATION_MESSAGE, [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Continue',
      onPress: () => {
        void openFeedbackUrl(url).catch(() => {
          Alert.alert('Unable to open form', 'Could not open the feedback form in your browser.');
        });
      },
    },
  ]);
}
