import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RecentDocumentItem } from '../../api/types';
import { getDocumentVisual } from '../../lib/documentVisuals';
import { formatRelativeTime } from '../../features/documents/utils/formatDocument';
import { useTheme } from '../../theme/ThemeProvider';
import { DocumentThumbnail } from './DocumentThumbnail';

interface ContinueReadingCardProps {
  document: RecentDocumentItem;
  onPress: () => void;
}

export function ContinueReadingCard({ document, onPress }: ContinueReadingCardProps) {
  const { theme } = useTheme();
  const visual = getDocumentVisual(document.sourceType);
  const viewedAt = document.lastViewedAt ?? document.updatedAt;

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
      <DocumentThumbnail size="lg" sourceType={document.sourceType} />
      <Text
        numberOfLines={2}
        style={[
          styles.title,
          {
            color: theme.colors.text,
            fontSize: theme.typography.fontSizes.sm,
            fontWeight: theme.typography.fontWeights.semibold,
          },
        ]}
      >
        {document.title}
      </Text>
      <View style={styles.meta}>
        <Text
          style={[
            styles.type,
            {
              color: visual.accent,
              fontSize: theme.typography.fontSizes.xs,
              fontWeight: theme.typography.fontWeights.medium,
            },
          ]}
        >
          {visual.label}
        </Text>
        <Text style={[styles.dot, { color: theme.colors.textSecondary }]}>·</Text>
        <Text
          style={[
            styles.time,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSizes.xs,
            },
          ]}
        >
          {formatRelativeTime(viewedAt)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 156,
    borderWidth: 1,
    padding: 14,
    gap: 10,
    marginRight: 12,
  },
  title: {
    minHeight: 40,
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  type: {},
  dot: {
    fontSize: 10,
  },
  time: {},
});
