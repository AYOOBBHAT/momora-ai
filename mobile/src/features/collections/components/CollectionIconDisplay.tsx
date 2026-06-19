import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { DEFAULT_COLLECTION_ICON } from '../constants';
import { parseCollectionIcon } from '../utils/collectionIcon';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface CollectionIconDisplayProps {
  icon?: string | null;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  emojiStyle?: StyleProp<TextStyle>;
}

export function CollectionIconDisplay({
  icon,
  size = 22,
  color,
  style,
  emojiStyle,
}: CollectionIconDisplayProps) {
  const parsed = parseCollectionIcon(icon ?? DEFAULT_COLLECTION_ICON);

  if (parsed.kind === 'ionicon') {
    return (
      <View style={[styles.center, style]}>
        <Ionicons color={color} name={parsed.value as IoniconName} size={size} />
      </View>
    );
  }

  return (
    <Text style={[styles.emoji, { fontSize: size }, emojiStyle, style as StyleProp<TextStyle>]}>
      {parsed.value}
    </Text>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    lineHeight: undefined,
  },
});
