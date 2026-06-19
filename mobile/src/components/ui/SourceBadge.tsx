import { StyleSheet, Text, View } from 'react-native';

import type { DocumentSourceType } from '../../api/types';
import { getDocumentVisual } from '../../lib/documentVisuals';
import { useTheme } from '../../theme/ThemeProvider';

interface SourceBadgeProps {
  sourceType: DocumentSourceType;
}

export function SourceBadge({ sourceType }: SourceBadgeProps) {
  const { theme } = useTheme();
  const visual = getDocumentVisual(sourceType);

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: visual.background,
          borderRadius: theme.radii.full,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: visual.accent,
            fontSize: theme.typography.fontSizes.xs,
            fontWeight: theme.typography.fontWeights.semibold,
          },
        ]}
      >
        {visual.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  label: {
    letterSpacing: 0.3,
  },
});
