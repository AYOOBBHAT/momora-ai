import { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, type TextInputProps } from 'react-native';

import { useTheme } from '../../../theme/ThemeProvider';

interface AuthTextInputProps extends TextInputProps {
  label?: string;
}

export function AuthTextInput({ label, style, onFocus, onBlur, ...props }: AuthTextInputProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus: TextInputProps['onFocus'] = (event) => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: false,
    }).start();
    onFocus?.(event);
  };

  const handleBlur: TextInputProps['onBlur'] = (event) => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
    onBlur?.(event);
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.border, theme.colors.primary],
  });

  const backgroundColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.surfaceElevated, theme.colors.surface],
  });

  return (
    <>
      {label ? (
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
          {label}
        </Text>
      ) : null}
      <Animated.View
        style={[
          styles.inputWrap,
          {
            borderColor,
            backgroundColor,
            borderRadius: theme.radii.lg,
          },
        ]}
      >
        <TextInput
          placeholderTextColor={`${theme.colors.textSecondary}CC`}
          style={[
            styles.input,
            {
              color: theme.colors.text,
              fontSize: theme.typography.fontSizes.md,
            },
            style,
          ]}
          onBlur={handleBlur}
          onFocus={handleFocus}
          accessibilityState={{ selected: isFocused }}
          {...props}
        />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
  },
  inputWrap: {
    borderWidth: 1.5,
    minHeight: 56,
    justifyContent: 'center',
  },
  input: {
    minHeight: 56,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
});
