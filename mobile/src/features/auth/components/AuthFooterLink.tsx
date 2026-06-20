import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../../theme/ThemeProvider';

interface AuthFooterLinkProps {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
}

export function AuthFooterLink({ prompt, actionLabel, onPress }: AuthFooterLinkProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.row}>
      <Text
        style={[
          styles.prompt,
          {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSizes.sm,
          },
        ]}
      >
        {prompt}
      </Text>
      <Pressable
        accessibilityLabel={actionLabel}
        accessibilityRole="button"
        hitSlop={8}
        onPress={onPress}
        style={({ pressed }) => [
          styles.action,
          { opacity: pressed ? 0.75 : 1 },
        ]}
      >
        <Text
          style={[
            styles.actionText,
            {
              color: theme.colors.primary,
              fontSize: theme.typography.fontSizes.sm,
              fontWeight: theme.typography.fontWeights.semibold,
            },
          ]}
        >
          {actionLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    minHeight: 44,
  },
  prompt: {},
  action: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  actionText: {},
});
