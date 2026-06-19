import { Ionicons } from '@expo/vector-icons';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useCallback, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '../../../components/ui/EmptyState';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { AddContentSheet } from '../components/AddContentSheet';
import { CollectionDocumentRow } from '../components/CollectionDocumentRow';
import { ErrorBanner } from '../components/ErrorBanner';
import { DEFAULT_COLLECTION_COLOR, DEFAULT_COLLECTION_ICON } from '../constants';
import { CollectionIconDisplay } from '../components/CollectionIconDisplay';
import { useDeleteCollection } from '../../../hooks/mutations/useDeleteCollection';
import { useCollection } from '../../../hooks/queries/useCollection';
import { useCollectionDocuments } from '../../../hooks/queries/useCollectionDocuments';
import { formatRelativeTime } from '../../documents/utils/formatDocument';
import { getApiErrorMessage } from '../../../lib/apiError';
import type { CollectionsStackParamList, MainTabParamList } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';

type Props = CompositeScreenProps<
  NativeStackScreenProps<CollectionsStackParamList, 'CollectionDetail'>,
  BottomTabScreenProps<MainTabParamList>
>;

type AddContentFlow = 'pdf' | 'url' | 'youtube' | 'note' | 'ocr';

export function CollectionDetailScreen({ navigation, route }: Props) {
  const { collectionId } = route.params;
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [addContentFlow, setAddContentFlow] = useState<AddContentFlow | null>(null);
  const deleteCollection = useDeleteCollection();
  const {
    data: collection,
    isLoading: isCollectionLoading,
    isError: isCollectionError,
    error: collectionError,
    refetch: refetchCollection,
  } = useCollection(collectionId);
  const {
    data: documents = [],
    isLoading: isDocumentsLoading,
    isError: isDocumentsError,
    error: documentsError,
    refetch: refetchDocuments,
  } = useCollectionDocuments(collectionId);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchCollection(), refetchDocuments()]);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchCollection, refetchDocuments]);

  const handleDocumentPress = useCallback(
    (documentId: string) => {
      navigation.navigate('Home', {
        screen: 'DocumentDetail',
        params: { documentId },
      });
    },
    [navigation],
  );

  const handleCreateDocument = useCallback(() => {
    navigation.navigate('Home', {
      screen: 'CreateDocument',
      params: { collectionId },
    });
  }, [collectionId, navigation]);

  const handleOpenAddContent = useCallback(() => {
    setAddContentFlow(null);
    setIsAddSheetOpen(true);
  }, []);

  const handleCloseAddContent = useCallback(() => {
    setIsAddSheetOpen(false);
    setAddContentFlow(null);
  }, []);

  const handleChatWithCollection = useCallback(() => {
    navigation.navigate('Chat', {
      screen: 'ChatMain',
      params: { collectionId },
    });
  }, [collectionId, navigation]);

  const handleImportSuccess = useCallback(
    (documentId: string) => {
      navigation.navigate('Home', {
        screen: 'DocumentDetail',
        params: { documentId },
      });
    },
    [navigation],
  );

  const handleEdit = useCallback(() => {
    navigation.navigate('EditCollection', { collectionId });
  }, [navigation, collectionId]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete collection',
      'This will remove the collection. Documents will not be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteCollection.mutate(collectionId, {
              onSuccess: () => {
                navigation.popToTop();
              },
            });
          },
        },
      ],
    );
  }, [collectionId, deleteCollection, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: collection?.name ?? 'Collection',
      headerRight: () => (
        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit collection"
            onPress={handleEdit}
            style={({ pressed }) => [styles.headerButton, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="create-outline" size={22} color={theme.colors.primary} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete collection"
            disabled={deleteCollection.isPending}
            onPress={handleDelete}
            style={({ pressed }) => [styles.headerButton, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="trash-outline" size={22} color={theme.colors.error} />
          </Pressable>
        </View>
      ),
    });
  }, [
    navigation,
    collection?.name,
    handleEdit,
    handleDelete,
    deleteCollection.isPending,
    theme.colors.primary,
    theme.colors.error,
  ]);

  if (isCollectionLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  if (isCollectionError || !collection) {
    return (
      <View style={[styles.centered, styles.padded, { backgroundColor: theme.colors.background }]}>
        <ErrorBanner
          message={getApiErrorMessage(collectionError, 'Failed to load collection')}
          onRetry={() => void refetchCollection()}
        />
      </View>
    );
  }

  const accentColor = collection.color ?? DEFAULT_COLLECTION_COLOR;
  const documentLabel = documents.length === 1 ? '1 document' : `${documents.length} documents`;

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + 96 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            tintColor={theme.colors.primary}
            onRefresh={() => void handleRefresh()}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.headerCard,
            theme.elevation.soft,
            {
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: `${theme.colors.border}AA`,
              borderRadius: theme.radii.xl,
            },
          ]}
        >
          <View
            pointerEvents="none"
            style={[
              styles.headerGradient,
              {
                backgroundColor: `${accentColor}12`,
                borderTopLeftRadius: theme.radii.xl,
                borderTopRightRadius: theme.radii.xl,
              },
            ]}
          />

          <View style={styles.headerBody}>
            <View
              style={[
                styles.iconWrap,
                {
                  backgroundColor: `${accentColor}20`,
                  borderRadius: theme.radii.lg,
                },
              ]}
            >
              <CollectionIconDisplay icon={collection.icon ?? DEFAULT_COLLECTION_ICON} size={28} />
            </View>

            <Text
              style={[
                styles.collectionName,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.fontSizes.xxl,
                  fontWeight: theme.typography.fontWeights.bold,
                },
              ]}
            >
              {collection.name}
            </Text>

            {collection.description ? (
              <Text
                style={[
                  styles.description,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSizes.md,
                    lineHeight: 22,
                  },
                ]}
              >
                {collection.description}
              </Text>
            ) : null}

            <View style={styles.metaRow}>
              <View
                style={[
                  styles.metaBadge,
                  {
                    backgroundColor: `${accentColor}16`,
                    borderRadius: theme.radii.full,
                  },
                ]}
              >
                <Ionicons color={accentColor} name="documents-outline" size={14} />
                <Text
                  style={[
                    styles.metaBadgeText,
                    {
                      color: theme.colors.text,
                      fontSize: theme.typography.fontSizes.xs,
                      fontWeight: theme.typography.fontWeights.medium,
                    },
                  ]}
                >
                  {documentLabel}
                </Text>
              </View>
              <Text
                style={[
                  styles.metaTime,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSizes.xs,
                  },
                ]}
              >
                Updated {formatRelativeTime(collection.updatedAt).toLowerCase()}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Chat with this collection"
              onPress={handleChatWithCollection}
              style={({ pressed }) => [
                styles.chatButton,
                theme.elevation.soft,
                {
                  backgroundColor: theme.colors.primary,
                  borderRadius: theme.radii.lg,
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.985 : 1 }],
                },
              ]}
            >
              <View
                style={[
                  styles.chatIconWrap,
                  { backgroundColor: `${theme.colors.primaryText}22` },
                ]}
              >
                <Ionicons color={theme.colors.primaryText} name="sparkles" size={18} />
              </View>
              <View style={styles.chatButtonTextWrap}>
                <Text
                  style={[
                    styles.chatButtonTitle,
                    {
                      color: theme.colors.primaryText,
                      fontSize: theme.typography.fontSizes.md,
                      fontWeight: theme.typography.fontWeights.semibold,
                    },
                  ]}
                >
                  Chat with Collection
                </Text>
                <Text
                  style={[
                    styles.chatButtonSubtitle,
                    {
                      color: `${theme.colors.primaryText}CC`,
                      fontSize: theme.typography.fontSizes.xs,
                    },
                  ]}
                >
                  Ask AI about everything saved here
                </Text>
              </View>
              <Ionicons color={theme.colors.primaryText} name="chevron-forward" size={20} />
            </Pressable>
          </View>
        </View>

        {deleteCollection.error ? (
          <ErrorBanner message={getApiErrorMessage(deleteCollection.error, 'Delete failed')} />
        ) : null}

        <View style={styles.documentsSection}>
          <SectionHeader title="Documents" />

          {isDocumentsLoading ? (
            <ActivityIndicator color={theme.colors.primary} style={styles.documentsLoader} />
          ) : isDocumentsError ? (
            <ErrorBanner
              message={getApiErrorMessage(documentsError, 'Failed to load documents')}
              onRetry={() => void refetchDocuments()}
            />
          ) : documents.length === 0 ? (
            <EmptyState
              actionLabel="Add Content"
              icon="📚"
              subtitle="Add PDFs, websites, YouTube videos or notes to start chatting with AI."
              title="This collection is empty."
              onActionPress={handleOpenAddContent}
            />
          ) : (
            <View style={styles.documentsList}>
              {documents.map((document) => (
                <CollectionDocumentRow
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
        accessibilityLabel="Add content to collection"
        onPress={handleOpenAddContent}
        style={({ pressed }) => [
          styles.fab,
          theme.elevation.fab,
          {
            backgroundColor: theme.colors.primary,
            opacity: pressed ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}
      >
        <Ionicons name="add" size={28} color={theme.colors.primaryText} />
      </Pressable>

      <AddContentSheet
        activeFlow={addContentFlow}
        collectionId={collectionId}
        visible={isAddSheetOpen}
        onClose={handleCloseAddContent}
        onCreateNote={handleCreateDocument}
        onFlowChange={setAddContentFlow}
        onImportSuccess={(document) => handleImportSuccess(document.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    gap: 28,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  padded: {
    padding: 24,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerCard: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  headerGradient: {
    height: 88,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  headerBody: {
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  iconWrap: {
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  collectionName: {
    letterSpacing: -0.6,
  },
  description: {},
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 2,
  },
  metaBadge: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaBadgeText: {},
  metaTime: {},
  chatButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  chatIconWrap: {
    alignItems: 'center',
    borderRadius: 12,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  chatButtonTextWrap: {
    flex: 1,
    gap: 2,
  },
  chatButtonTitle: {},
  chatButtonSubtitle: {},
  documentsSection: {
    gap: 0,
  },
  documentsLoader: {
    marginTop: 24,
  },
  documentsList: {
    gap: 10,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
