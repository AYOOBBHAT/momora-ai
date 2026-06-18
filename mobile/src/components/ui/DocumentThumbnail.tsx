import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import type { DocumentSourceType } from '../../api/types';
import { getDocumentVisual } from '../../lib/documentVisuals';

interface DocumentThumbnailProps {
  sourceType: DocumentSourceType;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: { box: 36, icon: 18 },
  md: { box: 44, icon: 22 },
  lg: { box: 56, icon: 26 },
} as const;

export function DocumentThumbnail({ sourceType, size = 'md' }: DocumentThumbnailProps) {
  const visual = getDocumentVisual(sourceType);
  const dimensions = SIZES[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: dimensions.box,
          height: dimensions.box,
          borderRadius: dimensions.box * 0.28,
          backgroundColor: visual.background,
        },
      ]}
    >
      <Ionicons color={visual.accent} name={visual.icon} size={dimensions.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
