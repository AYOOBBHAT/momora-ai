import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthFooterLink } from '../components/AuthFooterLink';
import { AuthFormLayout } from '../components/AuthFormLayout';
import { AuthPrimaryButton } from '../components/AuthPrimaryButton';
import { AuthTextInput } from '../components/AuthTextInput';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { useRegister } from '../../../hooks/mutations/useRegister';
import { getApiErrorMessage } from '../../../lib/apiError';
import type { AuthStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const register = useRegister();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!name.trim()) {
      setFieldError('Name is required');
      return false;
    }
    if (!email.trim()) {
      setFieldError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFieldError('Enter a valid email address');
      return false;
    }
    if (password.length < 8) {
      setFieldError('Password must be at least 8 characters');
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

    register.mutate(
      { name: name.trim(), email: email.trim(), password },
      {
        onError: (error) => {
          setApiError(getApiErrorMessage(error, 'Registration failed'));
        },
      },
    );
  };

  return (
    <AuthFormLayout
      showBack
      footer={
        <AuthFooterLink
          actionLabel="Sign in"
          prompt="Already have an account?"
          onPress={() => navigation.navigate('Login')}
        />
      }
      subtitle="Start building your personal AI knowledge base with documents, notes, websites and YouTube."
      title="Create account"
      onBack={() => navigation.goBack()}
    >
      {apiError ? (
        <View style={[styles.errorBox, { backgroundColor: `${theme.colors.error}15` }]}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{apiError}</Text>
        </View>
      ) : null}

      <AuthTextInput
        autoCapitalize="words"
        autoComplete="name"
        label="Name"
        placeholder="Your name"
        value={name}
        onChangeText={setName}
      />

      <AuthTextInput
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
      />

      <AuthTextInput
        autoCapitalize="none"
        autoComplete="new-password"
        label="Password"
        placeholder="At least 8 characters"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {fieldError ? (
        <Text style={[styles.fieldError, { color: theme.colors.error }]}>{fieldError}</Text>
      ) : null}

      <AuthPrimaryButton
        label="Create account"
        loading={register.isPending}
        onPress={handleSubmit}
      />

      <GoogleSignInButton onError={setApiError} />
    </AuthFormLayout>
  );
}

const styles = StyleSheet.create({
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
