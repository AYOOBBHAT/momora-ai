import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useCallback, useLayoutEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

import { CollectionPreviewCard } from '../../../components/ui/CollectionPreviewCard';
import { CompactDocumentCard } from '../../../components/ui/CompactDocumentCard';
import { ContinueReadingCard } from '../../../components/ui/ContinueReadingCard';
import { EmptyState } from '../../../components/ui/EmptyState';
import { QuickActionsSection } from '../../../components/ui/QuickActionsSection';
import { RecentChatCard } from '../../../components/ui/RecentChatCard';
import { SearchBarButton } from '../../../components/ui/SearchBarButton';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { ErrorBanner } from '../../collections/components/ErrorBanner';
import { useAuthMe } from '../../../hooks/queries/useAuthMe';
import { useCollections } from '../../../hooks/queries/useCollections';
import { useConversations } from '../../../hooks/queries/useConversations';
import { useRecentDocuments } from '../../../hooks/queries/useDocuments';
import { getApiErrorMessage } from '../../../lib/apiError';
import type { DocumentsStackParamList, MainTabParamList } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = NativeStackScreenProps<DocumentsStackParamList, 'DocumentsList'>;

type TabNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<DocumentsStackParamList, 'DocumentsList'>,
  BottomTabNavigationProp<MainTabParamList>
>;

function getGreetingName(name?: string): string {
  if (!name?.trim()) {
    return 'there';
  }

  return name.trim().split(/\s+/)[0] ?? 'there';
}

function SectionPlaceholder({ message }: { message: string }) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.placeholder,
        {
          backgroundColor: theme.colors.surfaceSecondary,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.md,
        },
      ]}
    >
      <Text
        style={[
          styles.placeholderText,
          {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSizes.sm,
          },
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

export function DocumentsListScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const tabNavigation = navigation.getParent<TabNavigationProp>();

  const { data: user } = useAuthMe();
  const {
    data: recent,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useRecentDocuments();
  const { data: collections = [] } = useCollections();
  const { data: conversations = [] } = useConversations();

  const recentlyViewed = recent?.recentlyViewed ?? [];
  const recentlyAdded = recent?.recentlyAdded ?? [];
  const recentChats = conversations.slice(0, 4);
  const previewCollections = collections.slice(0, 8);
  const hasAnyContent =
    recentlyViewed.length > 0 ||
    recentlyAdded.length > 0 ||
    collections.length > 0 ||
    conversations.length > 0;

  const handleCreatePress = useCallback(() => {
    navigation.navigate('CreateDocument');
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  const handleDocumentPress = useCallback(
    (documentId: string) => {
      navigation.navigate('DocumentDetail', { documentId });
    },
    [navigation],
  );

  const handleImportSuccess = useCallback(
    (document: { id: string }) => {
      navigation.navigate('DocumentDetail', { documentId: document.id });
    },
    [navigation],
  );

  const handleCollectionPress = useCallback(
    (collectionId: string) => {
      tabNavigation?.navigate('Collections', {
        screen: 'CollectionDetail',
        params: { collectionId },
      });
    },
    [tabNavigation],
  );

  const handleChatPress = useCallback(
    (conversationId: string) => {
      tabNavigation?.navigate('Chat', {
        screen: 'ChatMain',
        params: { conversationId },
      });
    },
    [tabNavigation],
  );

  const handleSeeAllCollections = useCallback(() => {
    tabNavigation?.navigate('Collections', { screen: 'CollectionsList' });
  }, [tabNavigation]);

  const handleSeeAllChats = useCallback(() => {
    tabNavigation?.navigate('Chat', { screen: 'ChatHistory' });
  }, [tabNavigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centered, styles.screenPadding, { backgroundColor: theme.colors.background }]}>
        <ErrorBanner
          message={getApiErrorMessage(error, 'Failed to load documents')}
          onRetry={() => void refetch()}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + theme.spacing.md,
            paddingBottom: insets.bottom + 96,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            tintColor={theme.colors.primary}
            onRefresh={() => void refetch()}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.screenPadding}>
          <View style={styles.greetingBlock}>
            <Text
              style={[
                styles.greeting,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSizes.xl,
                  fontWeight: theme.typography.fontWeights.bold,
                },
              ]}
            >
              Hi, {getGreetingName(user?.name)} 👋
            </Text>
            <Text
              style={[
                styles.greetingSubtitle,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSizes.md,
                },
              ]}
            >
              What do you want to explore today?
            </Text>
          </View>

          <SearchBarButton onPress={handleSearchPress} />
        </View>

        <View style={[styles.section, styles.screenPadding]}>
          <SectionHeader title="Quick Actions" />
          <QuickActionsSection onImportSuccess={handleImportSuccess} onNotePress={handleCreatePress} />
        </View>

        {!hasAnyContent ? (
          <View style={styles.screenPadding}>
            <EmptyState
              actionLabel="Create document"
              icon="📄"
              subtitle="Add text documents, import URLs, or upload PDFs to build your knowledge base."
              title="No documents yet"
              onActionPress={handleCreatePress}
            />
          </View>
        ) : null}

        <View style={styles.section}>
          <View style={styles.screenPadding}>
            <SectionHeader title="Continue Reading" />
          </View>
          {recentlyViewed.length === 0 ? (
            <View style={styles.screenPadding}>
              <SectionPlaceholder message="Open a document to pick up where you left off." />
            </View>
          ) : (
            <FlatList
              horizontal
              data={recentlyViewed}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <ContinueReadingCard
                  document={item}
                  onPress={() => handleDocumentPress(item.id)}
                />
              )}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.screenPadding}>
            <SectionHeader
              actionLabel={collections.length > 0 ? 'See all' : undefined}
              title="Collections"
              onActionPress={collections.length > 0 ? handleSeeAllCollections : undefined}
            />
          </View>
          {previewCollections.length === 0 ? (
            <View style={styles.screenPadding}>
              <SectionPlaceholder message="Create a collection to organize your documents." />
            </View>
          ) : (
            <FlatList
              horizontal
              data={previewCollections}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <CollectionPreviewCard
                  collection={item}
                  onPress={() => handleCollectionPress(item.id)}
                />
              )}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>

        <View style={[styles.section, styles.screenPadding]}>
          <SectionHeader
            actionLabel={conversations.length > 0 ? 'See all' : undefined}
            title="Recent Chats"
            onActionPress={conversations.length > 0 ? handleSeeAllChats : undefined}
          />
          {recentChats.length === 0 ? (
            <SectionPlaceholder message="Start a chat and your questions will appear here." />
          ) : (
            <View style={styles.chatList}>
              {recentChats.map((conversation) => (
                <RecentChatCard
                  key={conversation.id}
                  conversation={conversation}
                  onPress={() => handleChatPress(conversation.id)}
                />
              ))}
            </View>
          )}
        </View>

        <View style={[styles.section, styles.screenPadding]}>
          <SectionHeader title="Recent Documents" />
          {recentlyAdded.length === 0 ? (
            <SectionPlaceholder message="New documents will appear here." />
          ) : (
            <View style={styles.documentList}>
              {recentlyAdded.map((document) => (
                <CompactDocumentCard
                  key={document.id}
                  document={document}
                  onPress={() => handleDocumentPress(document.id)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create document"
        onPress={handleCreatePress}
        style={({ pressed }) => [
          styles.fab,
          theme.elevation.soft,
          {
            backgroundColor: theme.colors.primary,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}
      >
        <Ionicons name="add" size={28} color={theme.colors.primaryText} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenPadding: {
    paddingHorizontal: 16,
  },
  scrollContent: {
    gap: 24,
  },
  greetingBlock: {
    gap: 4,
    marginBottom: 16,
  },
  greeting: {
    letterSpacing: -0.3,
  },
  greetingSubtitle: {
    lineHeight: 22,
  },
  section: {
    gap: 0,
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
  placeholder: {
    borderWidth: 1,
    padding: 16,
  },
  placeholderText: {
    textAlign: 'center',
  },
  chatList: {
    gap: 8,
  },
  documentList: {
    gap: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
