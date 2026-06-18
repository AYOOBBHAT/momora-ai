import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import type { ConversationListItem } from '../../api/types';
import { formatRelativeTime } from '../../features/documents/utils/formatDocument';
import { useTheme } from '../../theme/ThemeProvider';

interface RecentChatCardProps {
  conversation: ConversationListItem;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function RecentChatCard({ conversation, onPress, style }: RecentChatCardProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        style,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.md,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: `${theme.colors.primary}18`,
            borderRadius: theme.radii.sm,
          },
        ]}
      >
        <Ionicons color={theme.colors.primary} name="chatbubble-ellipses-outline" size={18} />
      </View>
      <View style={styles.content}>
        <Text
          numberOfLines={1}
          style={[
            styles.question,
            {
              color: theme.colors.text,
              fontSize: theme.typography.fontSizes.sm,
              fontWeight: theme.typography.fontWeights.medium,
            },
          ]}
        >
          {conversation.title || conversation.preview || 'Untitled chat'}
        </Text>
        <Text
          numberOfLines={1}
          style={[
            styles.preview,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSizes.xs,
            },
          ]}
        >
          {conversation.preview || 'No messages yet'}
        </Text>
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
        {formatRelativeTime(conversation.updatedAt)}
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
  iconWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  question: {},
  preview: {},
  time: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
});
