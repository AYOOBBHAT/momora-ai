import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { SafeDocument } from '../../api/types';
import { PdfUploadButton } from '../../features/documents/components/PdfUploadButton';
import { UrlImportButton } from '../../features/documents/components/UrlImportButton';
import { YoutubeImportButton } from '../../features/documents/components/YoutubeImportButton';
import { useTheme } from '../../theme/ThemeProvider';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

type QuickActionId = 'pdf' | 'url' | 'youtube' | 'note';

interface QuickActionConfig {
  id: QuickActionId;
  label: string;
  icon: IoniconName;
  accent: string;
  background: string;
}

const ACTIONS: QuickActionConfig[] = [
  {
    id: 'pdf',
    label: 'PDF',
    icon: 'document-text-outline',
    accent: '#F87171',
    background: 'rgba(248, 113, 113, 0.12)',
  },
  {
    id: 'url',
    label: 'Website',
    icon: 'globe-outline',
    accent: '#38BDF8',
    background: 'rgba(56, 189, 248, 0.12)',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    icon: 'logo-youtube',
    accent: '#EF4444',
    background: 'rgba(239, 68, 68, 0.12)',
  },
  {
    id: 'note',
    label: 'Add Note',
    icon: 'scan-outline',
    accent: '#A78BFA',
    background: 'rgba(167, 139, 250, 0.12)',
  },
];

interface QuickActionsSectionProps {
  onNotePress: () => void;
  onImportSuccess: (document: SafeDocument) => void;
}

export function QuickActionsSection({ onNotePress, onImportSuccess }: QuickActionsSectionProps) {
  const { theme } = useTheme();
  const [activeAction, setActiveAction] = useState<QuickActionId | null>(null);

  const handleActionPress = (actionId: QuickActionId) => {
    if (actionId === 'note') {
      onNotePress();
      return;
    }

    setActiveAction((current) => (current === actionId ? null : actionId));
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {ACTIONS.map((action) => {
          const isActive = activeAction === action.id;

          return (
            <Pressable
              key={action.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              onPress={() => handleActionPress(action.id)}
              style={({ pressed }) => [
                styles.tile,
                theme.elevation.soft,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: isActive ? action.accent : theme.colors.border,
                  borderRadius: theme.radii.lg,
                  opacity: pressed ? 0.92 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <View
                style={[
                  styles.iconWrap,
                  {
                    backgroundColor: action.background,
                    borderRadius: theme.radii.md,
                  },
                ]}
              >
                <Ionicons color={action.accent} name={action.icon} size={22} />
              </View>
              <Text
                style={[
                  styles.label,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.fontSizes.sm,
                    fontWeight: theme.typography.fontWeights.semibold,
                  },
                ]}
              >
                {action.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {activeAction === 'pdf' ? (
        <View style={styles.panel}>
          <PdfUploadButton onSuccess={onImportSuccess} variant="primary" />
        </View>
      ) : null}

      {activeAction === 'url' ? (
        <View style={styles.panel}>
          <UrlImportButton onSuccess={onImportSuccess} variant="primary" />
        </View>
      ) : null}

      {activeAction === 'youtube' ? (
        <View style={styles.panel}>
          <YoutubeImportButton onSuccess={onImportSuccess} variant="primary" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tile: {
    width: '47%',
    flexGrow: 1,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    minHeight: 96,
    justifyContent: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {},
  panel: {
    marginTop: 4,
  },
});
