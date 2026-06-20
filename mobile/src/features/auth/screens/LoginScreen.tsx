import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthFooterLink } from '../components/AuthFooterLink';
import { AuthFormLayout } from '../components/AuthFormLayout';
import { AuthPrimaryButton } from '../components/AuthPrimaryButton';
import { AuthTextInput } from '../components/AuthTextInput';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { useLogin } from '../../../hooks/mutations/useLogin';
import { getApiErrorMessage } from '../../../lib/apiError';
import type { AuthStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!email.trim()) {
      setFieldError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFieldError('Enter a valid email address');
      return false;
    }
    if (!password) {
      setFieldError('Password is required');
      return false;
    }
    setFieldError(null);
    return true;
  };

  const handleSubmit = () => {
    setApiError(null);
    if (!validate()) {
      return;
    }

    login.mutate(
      { email: email.trim(), password },
      {
        onError: (error) => {
          setApiError(getApiErrorMessage(error, 'Login failed'));
        },
      },
    );
  };

  return (
    <AuthFormLayout
      footer={
        <AuthFooterLink
          actionLabel="Sign up"
          prompt="Don't have an account?"
          onPress={() => navigation.navigate('Register')}
        />
      }
      subtitle="Access your AI-powered knowledge library and continue where you left off."
      title="Welcome back"
    >
      {apiError ? (
        <View style={[styles.errorBox, { backgroundColor: `${theme.colors.error}15` }]}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{apiError}</Text>
        </View>
      ) : null}

      <View style={styles.field}>
        <AuthTextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.field}>
        <View style={styles.labelRow}>
          <Text
            style={[
              styles.label,
              {
                color: theme.colors.text,
                fontSize: theme.typography.fontSizes.sm,
                fontWeight: theme.typography.fontWeights.medium,
              },
            ]}
          >
            Password
          </Text>
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => navigation.navigate('ForgotPassword')}
            style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
          >
            <Text
              style={[
                styles.link,
                {
                  color: theme.colors.primary,
                  fontSize: theme.typography.fontSizes.sm,
                  fontWeight: theme.typography.fontWeights.medium,
                },
              ]}
            >
              Forgot password?
            </Text>
          </Pressable>
        </View>
        <AuthTextInput
          autoCapitalize="none"
          autoComplete="password"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {fieldError ? (
        <Text style={[styles.fieldError, { color: theme.colors.error }]}>{fieldError}</Text>
      ) : null}

      <AuthPrimaryButton
        label="Sign in"
        loading={login.isPending}
        onPress={handleSubmit}
      />

      <GoogleSignInButton onError={setApiError} />
    </AuthFormLayout>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {},
  link: {},
  fieldError: {
    fontSize: 14,
  },
  errorBox: {
    borderRadius: 12,
    padding: 12,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
