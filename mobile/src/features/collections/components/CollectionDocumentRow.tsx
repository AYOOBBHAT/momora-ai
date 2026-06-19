import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { SafeDocument } from '../../../api/types';
import { DocumentThumbnail } from '../../../components/ui/DocumentThumbnail';
import { SourceBadge } from '../../../components/ui/SourceBadge';
import { formatRelativeTime } from '../../documents/utils/formatDocument';
import { useTheme } from '../../../theme/ThemeProvider';

interface CollectionDocumentRowProps {
  document: SafeDocument;
  onPress?: () => void;
}

export function CollectionDocumentRow({ document, onPress }: CollectionDocumentRowProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        theme.elevation.soft,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: `${theme.colors.border}AA`,
          borderRadius: theme.radii.lg,
          opacity: onPress && pressed ? 0.92 : 1,
          transform: [{ scale: onPress && pressed ? 0.995 : 1 }],
        },
      ]}
    >
      <DocumentThumbnail size="md" sourceType={document.sourceType} />
      <View style={styles.content}>
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
        <View style={styles.metaRow}>
          <SourceBadge sourceType={document.sourceType} />
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
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  title: {
    lineHeight: 19,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  time: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
});
