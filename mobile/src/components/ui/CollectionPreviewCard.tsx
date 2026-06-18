import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { SafeCollection } from '../../api/types';
import { DEFAULT_COLLECTION_COLOR, DEFAULT_COLLECTION_ICON } from '../../features/collections/constants';
import { useTheme } from '../../theme/ThemeProvider';

interface CollectionPreviewCardProps {
  collection: SafeCollection;
  onPress: () => void;
}

export function CollectionPreviewCard({ collection, onPress }: CollectionPreviewCardProps) {
  const { theme } = useTheme();
  const accentColor = collection.color ?? DEFAULT_COLLECTION_COLOR;
  const icon = collection.icon ?? DEFAULT_COLLECTION_ICON;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        theme.elevation.soft,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.lg,
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: `${accentColor}22`,
            borderRadius: theme.radii.md,
          },
        ]}
      >
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text
        numberOfLines={2}
        style={[
          styles.name,
          {
            color: theme.colors.text,
            fontSize: theme.typography.fontSizes.sm,
            fontWeight: theme.typography.fontWeights.semibold,
          },
        ]}
      >
        {collection.name}
      </Text>
      {collection.description ? (
        <Text
          numberOfLines={1}
          style={[
            styles.description,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSizes.xs,
            },
          ]}
        >
          {collection.description}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 132,
    borderWidth: 1,
    padding: 14,
    gap: 10,
    marginRight: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
  name: {
    lineHeight: 18,
  },
  description: {},
});
