import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';

import { useTheme } from '../../../theme/ThemeProvider';

const OTP_LENGTH = 6;

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: string | null;
}

export function OtpInput({ value, onChange, onComplete, disabled = false, error }: OtpInputProps) {
  const { theme } = useTheme();
  const hiddenInputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const digits = value.padEnd(OTP_LENGTH, ' ').slice(0, OTP_LENGTH).split('');
  const activeIndex = Math.min(value.length, OTP_LENGTH - 1);

  useEffect(() => {
    if (value.length === OTP_LENGTH) {
      onComplete?.(value);
    }
  }, [onComplete, value]);

  const handleChange = useCallback(
    (text: string) => {
      const sanitized = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
      onChange(sanitized);
    },
    [onChange],
  );

  const handleKeyPress = useCallback(
    (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (event.nativeEvent.key === 'Backspace' && value.length > 0) {
        onChange(value.slice(0, -1));
      }
    },
    [onChange, value],
  );

  const focusInput = useCallback(() => {
    if (!disabled) {
      hiddenInputRef.current?.focus();
    }
  }, [disabled]);

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Verification code input"
        accessibilityRole="none"
        onPress={focusInput}
        style={styles.boxRow}
      >
        {digits.map((digit, index) => {
          const isActive = isFocused && index === activeIndex && value.length < OTP_LENGTH;
          const hasValue = digit.trim().length > 0;

          return (
            <View
              key={index}
              style={[
                styles.box,
                {
                  backgroundColor: theme.colors.surfaceElevated,
                  borderColor: error
                    ? theme.colors.error
                    : isActive
                      ? theme.colors.primary
                      : theme.colors.border,
                  borderRadius: theme.radii.lg,
                },
              ]}
            >
              <Text
                style={[
                  styles.digit,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSizes.xl,
                    fontWeight: theme.typography.fontWeights.semibold,
                  },
                ]}
              >
                {hasValue ? digit : ''}
              </Text>
            </View>
          );
        })}
      </Pressable>

      <TextInput
        ref={hiddenInputRef}
        accessibilityLabel="Six digit verification code"
        autoComplete="one-time-code"
        editable={!disabled}
        keyboardType="number-pad"
        maxLength={OTP_LENGTH}
        onBlur={() => setIsFocused(false)}
        onChangeText={handleChange}
        onFocus={() => setIsFocused(true)}
        onKeyPress={handleKeyPress}
        style={styles.hiddenInput}
        textContentType="oneTimeCode"
        value={value}
      />

      {error ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[
            styles.error,
            {
              color: theme.colors.error,
              fontSize: theme.typography.fontSizes.sm,
            },
          ]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  boxRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  box: {
    alignItems: 'center',
    borderWidth: 1.5,
    flex: 1,
    height: 56,
    justifyContent: 'center',
    maxWidth: 52,
    minWidth: 44,
  },
  digit: {
    fontVariant: ['tabular-nums'],
  },
  hiddenInput: {
    height: 1,
    opacity: 0,
    position: 'absolute',
    width: 1,
  },
  error: {
    textAlign: 'center',
  },
});
