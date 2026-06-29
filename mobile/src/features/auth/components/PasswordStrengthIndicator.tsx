import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../../theme/ThemeProvider';
import { getPasswordStrength, type PasswordStrength } from '../utils/authValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const STRENGTH_LABEL: Record<PasswordStrength, string> = {
  weak: 'Weak',
  fair: 'Fair',
  good: 'Good',
  strong: 'Strong',
};

const STRENGTH_SEGMENTS: Record<PasswordStrength, number> = {
  weak: 1,
  fair: 2,
  good: 3,
  strong: 4,
};

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const { theme } = useTheme();
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  if (!password) {
    return null;
  }

  const activeSegments = STRENGTH_SEGMENTS[strength];
  const barColor =
    strength === 'weak'
      ? theme.colors.error
      : strength === 'fair'
        ? '#D4A574'
        : strength === 'good'
          ? theme.colors.success
          : theme.colors.primary;

  return (
    <View accessibilityLiveRegion="polite" style={styles.container}>
      <View style={styles.bars}>
        {Array.from({ length: 4 }, (_, index) => (
          <View
            key={index}
            style={[
              styles.bar,
              {
                backgroundColor:
                  index < activeSegments ? barColor : `${theme.colors.border}`,
              },
            ]}
          />
        ))}
      </View>
      <Text
        style={[
          styles.label,
          {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSizes.xs,
          },
        ]}
      >
        Password strength: {STRENGTH_LABEL[strength]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
    marginTop: -4,
  },
  bars: {
    flexDirection: 'row',
    gap: 6,
  },
  bar: {
    borderRadius: 999,
    flex: 1,
    height: 4,
  },
  label: {},
});
