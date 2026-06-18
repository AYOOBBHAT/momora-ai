import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { SafeCollection } from '../../../api/types';
import { DEFAULT_COLLECTION_COLOR, DEFAULT_COLLECTION_ICON } from '../constants';
import { useTheme } from '../../../theme/ThemeProvider';

interface CollectionCardProps {
  collection: SafeCollection;
  onPress: () => void;
}

export function CollectionCard({ collection, onPress }: CollectionCardProps) {
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
          transform: [{ scale: pressed ? 0.99 : 1 }],
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
      <View style={styles.textBlock}>
        <Text
          numberOfLines={1}
          style={[
            styles.name,
            {
              color: theme.colors.text,
              fontSize: theme.typography.fontSizes.md,
              fontWeight: theme.typography.fontWeights.semibold,
            },
          ]}
        >
          {collection.name}
        </Text>
        {collection.description ? (
          <Text
            numberOfLines={2}
            style={[
              styles.description,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSizes.sm,
              },
            ]}
          >
            {collection.description}
          </Text>
        ) : null}
      </View>
      <View style={[styles.accentDot, { backgroundColor: accentColor }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  iconWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  name: {},
  description: {
    lineHeight: 20,
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
