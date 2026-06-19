import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ConversationListItem, SafeDocument } from '../../api/types';
import { formatRelativeTime } from '../../features/documents/utils/formatDocument';
import { useTheme } from '../../theme/ThemeProvider';
import { SectionHeader } from './SectionHeader';

export interface AskMemoraOpenParams {
  conversationId?: string;
  initialMessage?: string;
  focusInput?: boolean;
}

interface AskMemoraSectionProps {
  documents?: SafeDocument[];
  latestConversation?: ConversationListItem | null;
  onOpenChat: (params?: AskMemoraOpenParams) => void;
}

const DEFAULT_SUGGESTIONS = [
  'Summarize my notes',
  'What PDFs have I uploaded?',
  "Explain today's research",
  'What did I save about AWS?',
];

function getSuggestedQuestions(documents: SafeDocument[]): string[] {
  const suggestions: string[] = [];
  const hasNotes = documents.some((doc) => doc.sourceType === 'text');
  const hasPdfs = documents.some(
    (doc) => doc.sourceType === 'pdf' || doc.sourceType === 'upload',
  );
  const hasUrls = documents.some((doc) => doc.sourceType === 'url');
  const hasYoutube = documents.some((doc) => doc.sourceType === 'youtube');

  if (hasNotes) {
    suggestions.push('Summarize my notes');
  }

  if (hasPdfs) {
    suggestions.push('What PDFs have I uploaded?');
  } else if (hasUrls || hasYoutube) {
    suggestions.push('What links and videos have I saved?');
  }

  const today = new Date();
  const todayDocs = documents.filter((doc) => {
    const updated = new Date(doc.updatedAt);
    return (
      updated.getFullYear() === today.getFullYear() &&
      updated.getMonth() === today.getMonth() &&
      updated.getDate() === today.getDate()
    );
  });

  if (todayDocs.length > 0) {
    suggestions.push("Explain today's research");
  }

  const topicMatch = documents
    .flatMap((doc) => [doc.title, ...(doc.metadata?.tags as string[] | undefined ?? [])])
    .join(' ')
    .match(/\b(AWS|React|Python|JavaScript|TypeScript|AI|ML)\b/i);

  if (topicMatch) {
    suggestions.push(`What did I save about ${topicMatch[0]}?`);
  }

  for (const fallback of DEFAULT_SUGGESTIONS) {
    if (suggestions.length >= 4) {
      break;
    }
    if (!suggestions.includes(fallback)) {
      suggestions.push(fallback);
    }
  }

  return suggestions.slice(0, 4);
}

export function AskMemoraSection({
  documents = [],
  latestConversation,
  onOpenChat,
}: AskMemoraSectionProps) {
  const { theme } = useTheme();
  const suggestions = getSuggestedQuestions(documents);
  const latestTitle = latestConversation?.title?.trim() || 'Untitled chat';

  return (
    <View style={styles.container}>
      <SectionHeader title="Ask Memora" />
      <Text
        style={[
          styles.subtitle,
          {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSizes.sm,
            lineHeight: 20,
          },
        ]}
      >
        Ask questions about your notes, PDFs, websites and YouTube.
      </Text>

      <Pressable
        accessibilityHint="Opens chat to ask Memora a question"
        accessibilityRole="button"
        onPress={() => onOpenChat({ focusInput: true })}
        style={({ pressed }) => [
          styles.promptCard,
          theme.elevation.soft,
          {
            borderColor: `${theme.colors.primary}44`,
            borderRadius: theme.radii.xl,
            opacity: pressed ? 0.94 : 1,
            transform: [{ scale: pressed ? 0.992 : 1 }],
          },
        ]}
      >
        <View
          pointerEvents="none"
          style={[
            styles.promptGlow,
            {
              backgroundColor: `${theme.colors.primary}16`,
              borderRadius: theme.radii.xl,
            },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.promptGradientTop,
            { backgroundColor: `${theme.colors.primary}10` },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.promptGradientBottom,
            { backgroundColor: `${theme.colors.primary}06` },
          ]}
        />

        <View style={styles.promptContent}>
          <View
            style={[
              styles.aiIconWrap,
              {
                backgroundColor: `${theme.colors.primary}22`,
                borderRadius: theme.radii.lg,
              },
            ]}
          >
            <Ionicons color={theme.colors.primary} name="sparkles" size={22} />
          </View>

          <Text
            style={[
              styles.promptPlaceholder,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSizes.md,
              },
            ]}
          >
            Ask anything about your knowledge...
          </Text>

          <Ionicons color={theme.colors.primary} name="chevron-forward" size={20} />
        </View>
      </Pressable>

      <View style={styles.chips}>
        {suggestions.map((suggestion) => (
          <Pressable
            key={suggestion}
            accessibilityRole="button"
            onPress={() => onOpenChat({ initialMessage: suggestion })}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: theme.colors.surfaceElevated,
                borderColor: `${theme.colors.border}CC`,
                borderRadius: theme.radii.full,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.chipText,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSizes.sm,
                },
              ]}
            >
              {suggestion}
            </Text>
          </Pressable>
        ))}
      </View>

      {latestConversation ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => onOpenChat({ conversationId: latestConversation.id })}
          style={({ pressed }) => [
            styles.continueRow,
            {
              backgroundColor: theme.colors.surfaceSecondary,
              borderColor: theme.colors.border,
              borderRadius: theme.radii.lg,
              opacity: pressed ? 0.88 : 1,
            },
          ]}
        >
          <View style={styles.continueContent}>
            <Text
              style={[
                styles.continueLabel,
                {
                  color: theme.colors.primary,
                  fontSize: theme.typography.fontSizes.sm,
                  fontWeight: theme.typography.fontWeights.semibold,
                },
              ]}
            >
              Continue previous chat →
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.continueTitle,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSizes.sm,
                  fontWeight: theme.typography.fontWeights.medium,
                },
              ]}
            >
              {latestTitle}
            </Text>
            <Text
              style={[
                styles.continueTime,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSizes.xs,
                },
              ]}
            >
              {formatRelativeTime(latestConversation.updatedAt)}
            </Text>
          </View>
          <Ionicons color={theme.colors.textSecondary} name="chevron-forward" size={18} />
        </Pressable>
      ) : (
        <View
          style={[
            styles.emptyState,
            {
              backgroundColor: theme.colors.surfaceSecondary,
              borderColor: theme.colors.border,
              borderRadius: theme.radii.lg,
            },
          ]}
        >
          <Text
            style={[
              styles.emptyTitle,
              {
                color: theme.colors.text,
                fontSize: theme.typography.fontSizes.sm,
                fontWeight: theme.typography.fontWeights.semibold,
              },
            ]}
          >
            Start your first AI conversation.
          </Text>
          <Text
            style={[
              styles.emptySubtitle,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSizes.sm,
                lineHeight: 20,
              },
            ]}
          >
            Ask Memora anything you've saved.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  subtitle: {
    marginBottom: 16,
    marginTop: -4,
  },
  promptCard: {
    borderWidth: 1,
    marginBottom: 14,
    minHeight: 72,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  promptGlow: {
    ...StyleSheet.absoluteFill,
  },
  promptGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
  },
  promptGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
  },
  promptContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  aiIconWrap: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  promptPlaceholder: {
    flex: 1,
    lineHeight: 22,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: '100%',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipText: {
    lineHeight: 18,
  },
  continueRow: {
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  continueContent: {
    flex: 1,
    gap: 3,
  },
  continueLabel: {},
  continueTitle: {
    lineHeight: 18,
  },
  continueTime: {},
  emptyState: {
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  emptyTitle: {
    lineHeight: 20,
  },
  emptySubtitle: {},
});
