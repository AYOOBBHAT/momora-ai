import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

interface SearchBarButtonProps {
  placeholder?: string;
  onPress: () => void;
}

export function SearchBarButton({
  placeholder = 'Search anything…',
  onPress,
}: SearchBarButtonProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={placeholder}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.xl,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <Ionicons color={theme.colors.textSecondary} name="search" size={20} />
      <Text
        style={[
          styles.placeholder,
          {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSizes.md,
          },
        ]}
      >
        {placeholder}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    minHeight: 48,
    paddingHorizontal: 16,
  },
  placeholder: {
    flex: 1,
  },
});
