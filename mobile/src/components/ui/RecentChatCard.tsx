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
  const title = conversation.title || 'Untitled chat';
  const preview = conversation.preview || 'No messages yet';
  const messageLabel =
    conversation.messageCount === 1 ? '1 message' : `${conversation.messageCount} messages`;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        theme.elevation.soft,
        style,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: `${theme.colors.border}AA`,
          borderRadius: theme.radii.md,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
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
              fontWeight: theme.typography.fontWeights.semibold,
            },
          ]}
        >
          {title}
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
          {preview}
        </Text>
        <View style={styles.footer}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: `${theme.colors.primary}14`,
                borderRadius: theme.radii.full,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: theme.colors.primary,
                  fontSize: theme.typography.fontSizes.xs,
                  fontWeight: theme.typography.fontWeights.medium,
                },
              ]}
            >
              {messageLabel}
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
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  question: {
    lineHeight: 18,
  },
  preview: {
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {},
  time: {},
});
