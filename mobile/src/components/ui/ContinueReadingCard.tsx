import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RecentDocumentItem } from '../../api/types';
import { formatRelativeTime } from '../../features/documents/utils/formatDocument';
import { getContinueActivityProgress } from '../../lib/continueReading';
import { getDocumentVisual } from '../../lib/documentVisuals';
import { useTheme } from '../../theme/ThemeProvider';
import { DocumentThumbnail } from './DocumentThumbnail';
import { SourceBadge } from './SourceBadge';

interface ContinueReadingCardProps {
  document: RecentDocumentItem;
  onPress: () => void;
}

export function ContinueReadingCard({ document, onPress }: ContinueReadingCardProps) {
  const { theme } = useTheme();
  const visual = getDocumentVisual(document.sourceType);
  const viewedAt = document.lastViewedAt ?? document.updatedAt;
  const progress = getContinueActivityProgress(viewedAt);

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
      <SourceBadge sourceType={document.sourceType} />
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: visual.accent,
              borderRadius: theme.radii.full,
              width: `${Math.round(progress * 100)}%`,
            },
          ]}
        />
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
        Opened {formatRelativeTime(viewedAt).toLowerCase()}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 168,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 8,
    marginRight: 12,
  },
  title: {
    minHeight: 38,
    lineHeight: 19,
  },
  progressTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(148, 163, 184, 0.18)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  time: {},
});
