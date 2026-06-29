function requireEnv(name: string, value: string | undefined): string {

  if (!value || value.trim() === '') {

    throw new Error(`${name} is required. Copy .env.example to .env and set a value.`);

  }

  return value.trim().replace(/\/$/, '');

}



function requireApiUrl(name: string, value: string | undefined): string {

  const normalized = requireEnv(name, value);

  if (!/^https?:\/\//i.test(normalized)) {

    throw new Error(`${name} must start with http:// or https:// (got "${normalized}")`);

  }

  return normalized;

}



function optionalEnv(value: string | undefined): string {

  return value?.trim() ?? '';

}



export const env = {

  apiUrl: requireApiUrl('EXPO_PUBLIC_API_URL', process.env.EXPO_PUBLIC_API_URL),

  googleWebClientId: optionalEnv(process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID),

  privacyPolicyUrl: optionalEnv(process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL),

  termsOfServiceUrl: optionalEnv(process.env.EXPO_PUBLIC_TERMS_OF_SERVICE_URL),

  playStoreUrl: optionalEnv(process.env.EXPO_PUBLIC_PLAY_STORE_URL),

  supportEmail: optionalEnv(process.env.EXPO_PUBLIC_SUPPORT_EMAIL) || 'dbmemora@gmail.com',

  /** Google Form URL for Closed Beta feedback (viewform link). */
  feedbackFormUrl: optionalEnv(process.env.EXPO_PUBLIC_FEEDBACK_FORM_URL),

  /** Optional Google Form entry IDs for pre-filling fields (from form prefill link). */
  feedbackFormEntryType: optionalEnv(process.env.EXPO_PUBLIC_FEEDBACK_FORM_ENTRY_TYPE),
  feedbackFormEntryVersion: optionalEnv(process.env.EXPO_PUBLIC_FEEDBACK_FORM_ENTRY_VERSION),
  feedbackFormEntryPlatform: optionalEnv(process.env.EXPO_PUBLIC_FEEDBACK_FORM_ENTRY_PLATFORM),

} as const;

