import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

interface SearchBarButtonProps {
  placeholder?: string;
  onPress: () => void;
}

export function SearchBarButton({
  placeholder = 'Search notes, PDFs, websites and YouTube…',
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
        theme.elevation.soft,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: `${theme.colors.border}99`,
          borderRadius: theme.radii.xl,
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.995 : 1 }],
        },
      ]}
    >
      <Ionicons color={theme.colors.primary} name="search" size={20} />
      <Text
        numberOfLines={1}
        style={[
          styles.placeholder,
          {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSizes.sm,
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
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 52,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  placeholder: {
    flex: 1,
    lineHeight: 20,
  },
});
