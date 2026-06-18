import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RecentDocumentItem } from '../../api/types';
import { getDocumentVisual } from '../../lib/documentVisuals';
import { formatRelativeTime } from '../../features/documents/utils/formatDocument';
import { useTheme } from '../../theme/ThemeProvider';
import { DocumentThumbnail } from './DocumentThumbnail';

interface CompactDocumentCardProps {
  document: RecentDocumentItem;
  onPress?: () => void;
}

export function CompactDocumentCard({ document, onPress }: CompactDocumentCardProps) {
  const { theme } = useTheme();
  const visual = getDocumentVisual(document.sourceType);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.md,
          opacity: onPress && pressed ? 0.9 : 1,
        },
      ]}
    >
      <DocumentThumbnail size="sm" sourceType={document.sourceType} />
      <View style={styles.content}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            {
              color: theme.colors.text,
              fontSize: theme.typography.fontSizes.sm,
              fontWeight: theme.typography.fontWeights.medium,
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
          {document.collectionName ? (
            <>
              <Text style={[styles.dot, { color: theme.colors.textSecondary }]}>·</Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.collection,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSizes.xs,
                  },
                ]}
              >
                {document.collectionName}
              </Text>
            </>
          ) : null}
        </View>
      </View>
      <Text
        style={[
          styles.time,
          {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSizes.xs,
          },
        ]}
      >
        {formatRelativeTime(document.updatedAt)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {},
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  type: {},
  dot: {
    fontSize: 10,
  },
  collection: {
    flexShrink: 1,
  },
  time: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
});
