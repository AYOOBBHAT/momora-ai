import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { SafeCollection } from '../../api/types';
import { DEFAULT_COLLECTION_COLOR } from '../../features/collections/constants';
import { CollectionIconDisplay } from '../../features/collections/components/CollectionIconDisplay';
import { formatRelativeTime } from '../../features/documents/utils/formatDocument';
import { useTheme } from '../../theme/ThemeProvider';

interface CollectionPreviewCardProps {
  collection: SafeCollection;
  documentCount?: number;
  onPress: () => void;
}

export function CollectionPreviewCard({
  collection,
  documentCount = 0,
  onPress,
}: CollectionPreviewCardProps) {
  const { theme } = useTheme();
  const accentColor = collection.color ?? DEFAULT_COLLECTION_COLOR;
  const countLabel = documentCount === 1 ? '1 document' : `${documentCount} documents`;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        theme.elevation.soft,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: `${theme.colors.border}AA`,
          borderRadius: theme.radii.lg,
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View
        style={[
          styles.gradient,
          {
            backgroundColor: `${accentColor}18`,
            borderRadius: theme.radii.lg,
          },
        ]}
      />
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: `${accentColor}28`,
            borderRadius: theme.radii.md,
          },
        ]}
      >
        <CollectionIconDisplay icon={collection.icon} size={22} />
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
      <Text
        style={[
          styles.meta,
          {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSizes.xs,
          },
        ]}
      >
        {countLabel}
      </Text>
      <Text
        style={[
          styles.meta,
          {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSizes.xs,
          },
        ]}
      >
        Updated {formatRelativeTime(collection.updatedAt).toLowerCase()}
      </Text>
      <View style={[styles.accentDot, { backgroundColor: accentColor }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 132,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.55,
  },
  iconWrap: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  name: {
    lineHeight: 18,
  },
  meta: {
    lineHeight: 16,
  },
  accentDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
