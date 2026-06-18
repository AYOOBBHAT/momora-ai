import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onActionPress?: () => void;
  children?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onActionPress,
  children,
}: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.icon, { color: theme.colors.textSecondary }]}>{icon}</Text>
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
            fontSize: theme.typography.fontSizes.lg,
            fontWeight: theme.typography.fontWeights.semibold,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.subtitle,
          {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSizes.md,
          },
        ]}
      >
        {subtitle}
      </Text>
      {actionLabel && onActionPress ? (
        <Pressable
          accessibilityRole="button"
          onPress={onActionPress}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: theme.colors.primary,
              borderRadius: theme.radii.md,
              opacity: pressed ? 0.88 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: theme.colors.primaryText,
                fontSize: theme.typography.fontSizes.md,
                fontWeight: theme.typography.fontWeights.semibold,
              },
            ]}
          >
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    gap: 8,
  },
  icon: {
    fontSize: 44,
    marginBottom: 4,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  button: {
    minHeight: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonText: {},
});
