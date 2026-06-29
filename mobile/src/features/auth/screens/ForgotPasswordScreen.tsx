import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';

import { AuthFormLayout } from '../components/AuthFormLayout';
import { AuthPrimaryButton } from '../components/AuthPrimaryButton';
import { AuthTextInput } from '../components/AuthTextInput';
import { useForgotPassword } from '../../../hooks/mutations/usePasswordReset';
import { getApiErrorMessage, isNetworkError } from '../../../lib/apiError';
import { validateEmail } from '../utils/authValidation';
import type { AuthStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const emailRef = useRef<TextInput>(null);
  const forgotPassword = useForgotPassword();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (forgotPassword.isPending) {
      return;
    }

    setApiError(null);

    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    setEmailError(null);

    forgotPassword.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          navigation.navigate('VerifyResetOtp', { email: email.trim() });
        },
        onError: (error) => {
          if (isNetworkError(error)) {
            setApiError('No internet connection. Check your network and try again.');
            return;
          }
          setApiError(
            getApiErrorMessage(
              error,
              'Unable to send verification code. Please try again.',
            ),
          );
        },
      },
    );
  };

  return (
    <AuthFormLayout
      brandTagline="Your second brain"
      keyboardVerticalOffset={headerHeight}
      subtitle="Enter the email linked to your account and we'll send a 6-digit verification code."
      title="Forgot password"
      footer={
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => navigation.navigate('Login')}
          style={({ pressed }) => [styles.backLink, { opacity: pressed ? 0.75 : 1 }]}
        >
          <Text
            style={[
              styles.backLinkText,
              {
                color: theme.colors.primary,
                fontSize: theme.typography.fontSizes.sm,
                fontWeight: theme.typography.fontWeights.semibold,
              },
            ]}
          >
            Back to sign in
          </Text>
        </Pressable>
      }
    >
      {apiError ? (
        <View style={[styles.messageBox, { backgroundColor: `${theme.colors.error}15` }]}>
          <Text style={[styles.messageText, { color: theme.colors.error }]}>{apiError}</Text>
        </View>
      ) : null}

      <AuthTextInput
        ref={emailRef}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        error={emailError}
        keyboardType="email-address"
        label="Email"
        placeholder="you@example.com"
        returnKeyType="done"
        textContentType="emailAddress"
        value={email}
        onChangeText={(value) => {
          setEmailError(null);
          setApiError(null);
          setEmail(value);
        }}
        onSubmitEditing={handleSubmit}
      />

      <AuthPrimaryButton
        label="Send code"
        loading={forgotPassword.isPending}
        loadingLabel="Sending code…"
        onPress={handleSubmit}
      />
    </AuthFormLayout>
  );
}

const styles = StyleSheet.create({
  messageBox: {
    borderRadius: 12,
    padding: 12,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  backLink: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 8,
  },
  backLinkText: {},
});
