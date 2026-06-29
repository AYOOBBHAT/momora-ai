import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';

import { AuthFormLayout } from '../components/AuthFormLayout';
import { AuthPrimaryButton } from '../components/AuthPrimaryButton';
import { OtpInput } from '../components/OtpInput';
import {
  useForgotPassword,
  useVerifyResetOtp,
} from '../../../hooks/mutations/usePasswordReset';
import { getApiErrorMessage, isNetworkError } from '../../../lib/apiError';
import type { AuthStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyResetOtp'>;

const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyResetOtpScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const { email } = route.params;

  const verifyOtp = useVerifyResetOtp();
  const resendCode = useForgotPassword();

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleVerify = useCallback(
    (code: string) => {
      if (verifyOtp.isPending || code.length !== 6) {
        return;
      }

      setOtpError(null);
      setApiError(null);

      verifyOtp.mutate(
        { email, otp: code },
        {
          onSuccess: ({ resetToken }) => {
            navigation.navigate('ResetPassword', { email, resetToken });
          },
          onError: (error) => {
            if (isNetworkError(error)) {
              setApiError('No internet connection. Check your network and try again.');
              return;
            }

            const message = getApiErrorMessage(error, 'Invalid verification code.');
            if (/expired/i.test(message)) {
              setOtpError(message);
            } else if (/too many/i.test(message)) {
              setApiError(message);
            } else {
              setOtpError(message);
            }
            setOtp('');
          },
        },
      );
    },
    [email, navigation, verifyOtp],
  );

  const handleResend = () => {
    if (resendCode.isPending || secondsLeft > 0) {
      return;
    }

    setApiError(null);
    setOtpError(null);
    setOtp('');

    resendCode.mutate(
      { email },
      {
        onSuccess: () => {
          setSecondsLeft(RESEND_COOLDOWN_SECONDS);
        },
        onError: (error) => {
          if (isNetworkError(error)) {
            setApiError('No internet connection. Check your network and try again.');
            return;
          }
          setApiError(
            getApiErrorMessage(error, 'Unable to resend code. Please try again.'),
          );
        },
      },
    );
  };

  return (
    <AuthFormLayout
      brandTagline="Your second brain"
      keyboardVerticalOffset={headerHeight}
      subtitle={`Enter the 6-digit code sent to ${email}.`}
      title="Verify code"
      footer={
        <Pressable
          accessibilityRole="button"
          disabled={secondsLeft > 0 || resendCode.isPending}
          hitSlop={8}
          onPress={handleResend}
          style={({ pressed }) => [
            styles.resendButton,
            { opacity: secondsLeft > 0 || resendCode.isPending ? 0.5 : pressed ? 0.75 : 1 },
          ]}
        >
          <Text
            style={[
              styles.resendText,
              {
                color: theme.colors.primary,
                fontSize: theme.typography.fontSizes.sm,
                fontWeight: theme.typography.fontWeights.semibold,
              },
            ]}
          >
            {resendCode.isPending
              ? 'Sending…'
              : secondsLeft > 0
                ? `Resend code in ${secondsLeft}s`
                : 'Resend code'}
          </Text>
        </Pressable>
      }
    >
      {apiError ? (
        <View style={[styles.messageBox, { backgroundColor: `${theme.colors.error}15` }]}>
          <Text style={[styles.messageText, { color: theme.colors.error }]}>{apiError}</Text>
        </View>
      ) : null}

      <OtpInput
        disabled={verifyOtp.isPending}
        error={otpError}
        value={otp}
        onChange={(value) => {
          setOtpError(null);
          setApiError(null);
          setOtp(value);
        }}
        onComplete={handleVerify}
      />

      <AuthPrimaryButton
        label="Verify code"
        loading={verifyOtp.isPending}
        loadingLabel="Verifying…"
        onPress={() => handleVerify(otp)}
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
  resendButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 8,
  },
  resendText: {
    textAlign: 'center',
  },
});
