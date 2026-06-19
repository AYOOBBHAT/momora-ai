import type { ComponentProps } from 'react';

import { Ionicons } from '@expo/vector-icons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export const IONICON_PREFIX = 'ion:';

export type CollectionIconOption =
  | { kind: 'emoji'; value: string; label: string }
  | { kind: 'ionicon'; value: IoniconName; label: string };

export const COLLECTION_ICON_OPTIONS: CollectionIconOption[] = [
  { kind: 'emoji', value: '📁', label: 'Folder' },
  { kind: 'emoji', value: '📚', label: 'Books' },
  { kind: 'emoji', value: '💡', label: 'Ideas' },
  { kind: 'emoji', value: '⭐', label: 'Star' },
  { kind: 'emoji', value: '🎯', label: 'Goals' },
  { kind: 'emoji', value: '📝', label: 'Notes' },
  { kind: 'emoji', value: '🔖', label: 'Bookmark' },
  { kind: 'emoji', value: '💼', label: 'Work' },
  { kind: 'ionicon', value: 'logo-linkedin', label: 'LinkedIn' },
  { kind: 'ionicon', value: 'logo-twitter', label: 'Twitter' },
  { kind: 'ionicon', value: 'logo-github', label: 'GitHub' },
  { kind: 'ionicon', value: 'grid-outline', label: 'Notion' },
  { kind: 'ionicon', value: 'logo-youtube', label: 'YouTube' },
  { kind: 'ionicon', value: 'logo-slack', label: 'Slack' },
  { kind: 'ionicon', value: 'logo-discord', label: 'Discord' },
  { kind: 'ionicon', value: 'logo-google', label: 'Google' },
  { kind: 'ionicon', value: 'logo-reddit', label: 'Reddit' },
  { kind: 'ionicon', value: 'globe-outline', label: 'Web' },
];

export const DEFAULT_COLLECTION_ICON = COLLECTION_ICON_OPTIONS[0].value;

export const COLLECTION_ICONS = COLLECTION_ICON_OPTIONS.filter(
  (option): option is Extract<CollectionIconOption, { kind: 'emoji' }> => option.kind === 'emoji',
).map((option) => option.value);

export function encodeCollectionIcon(option: CollectionIconOption): string {
  if (option.kind === 'emoji') {
    return option.value;
  }

  return `${IONICON_PREFIX}${option.value}`;
}

export function parseCollectionIcon(icon?: string | null): {
  kind: 'emoji' | 'ionicon';
  value: string;
} {
  if (!icon) {
    return { kind: 'emoji', value: DEFAULT_COLLECTION_ICON };
  }

  if (icon.startsWith(IONICON_PREFIX)) {
    return { kind: 'ionicon', value: icon.slice(IONICON_PREFIX.length) };
  }

  return { kind: 'emoji', value: icon };
}

export function getCollectionIconLabel(icon?: string | null): string {
  const encoded = icon ?? DEFAULT_COLLECTION_ICON;
  const match = COLLECTION_ICON_OPTIONS.find((option) => encodeCollectionIcon(option) === encoded);
  return match?.label ?? 'Collection';
}
