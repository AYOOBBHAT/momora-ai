import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';

import { AuthFormLayout } from '../components/AuthFormLayout';
import { AuthPrimaryButton } from '../components/AuthPrimaryButton';
import { AuthTextInput } from '../components/AuthTextInput';
import { PasswordStrengthIndicator } from '../components/PasswordStrengthIndicator';
import { useResetPassword } from '../../../hooks/mutations/usePasswordReset';
import { getApiErrorMessage, isNetworkError } from '../../../lib/apiError';
import {
  validateConfirmPassword,
  validateStrongPassword,
} from '../utils/authValidation';
import type { AuthStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

export function ResetPasswordScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const { email, resetToken } = route.params;

  const resetPassword = useResetPassword();
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const clearError = (field: keyof typeof errors) => {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setApiError(null);
  };

  const validate = (): boolean => {
    const nextErrors = {
      password: validateStrongPassword(password) ?? undefined,
      confirmPassword: validateConfirmPassword(password, confirmPassword) ?? undefined,
    };

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = () => {
    if (resetPassword.isPending) {
      return;
    }

    setApiError(null);
    if (!validate()) {
      return;
    }

    resetPassword.mutate(
      { email, password, resetToken },
      {
        onSuccess: () => {
          navigation.replace('PasswordResetSuccess');
        },
        onError: (error) => {
          if (isNetworkError(error)) {
            setApiError('No internet connection. Check your network and try again.');
            return;
          }
          setApiError(
            getApiErrorMessage(error, 'Unable to reset password. Please try again.'),
          );
        },
      },
    );
  };

  return (
    <AuthFormLayout
      brandTagline="Your second brain"
      keyboardVerticalOffset={headerHeight}
      subtitle="Choose a strong password you haven't used elsewhere."
      title="Create new password"
    >
      {apiError ? (
        <View style={[styles.messageBox, { backgroundColor: `${theme.colors.error}15` }]}>
          <Text style={[styles.messageText, { color: theme.colors.error }]}>{apiError}</Text>
        </View>
      ) : null}

      <AuthTextInput
        ref={passwordRef}
        autoCapitalize="none"
        autoComplete="new-password"
        autoCorrect={false}
        error={errors.password}
        label="New password"
        passwordToggle
        placeholder="At least 8 characters"
        returnKeyType="next"
        secureTextEntry
        textContentType="newPassword"
        value={password}
        onChangeText={(value) => {
          clearError('password');
          setPassword(value);
        }}
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
      />

      <PasswordStrengthIndicator password={password} />

      <AuthTextInput
        ref={confirmPasswordRef}
        autoCapitalize="none"
        autoComplete="new-password"
        autoCorrect={false}
        error={errors.confirmPassword}
        label="Confirm password"
        passwordToggle
        placeholder="Re-enter new password"
        returnKeyType="done"
        secureTextEntry
        textContentType="newPassword"
        value={confirmPassword}
        onChangeText={(value) => {
          clearError('confirmPassword');
          setConfirmPassword(value);
        }}
        onSubmitEditing={handleSubmit}
      />

      <AuthPrimaryButton
        label="Update password"
        loading={resetPassword.isPending}
        loadingLabel="Updating…"
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
});
